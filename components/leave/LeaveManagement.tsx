

import React, { useState, useMemo } from 'react';
import type { LeaveRequest } from '../../types';
import { RequestStatus, LeaveType } from '../../types';
import { useAppState, useAppActions } from '../../hooks/useAppContext';
import { Card } from '../common/Card';
import { Tag } from '../common/Tag';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';

// Form to Apply for Leave
const LeaveForm: React.FC<{onClose: () => void}> = ({onClose}) => {
    const { addLeaveRequest } = useAppActions();
    const [leaveType, setLeaveType] = useState<LeaveType>(LeaveType.ANNUAL);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [reason, setReason] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!leaveType || !startDate || !endDate || !reason) {
            setError("All fields are required.");
            return;
        }
        const start = new Date(startDate);
        const end = new Date(endDate);
        if (start > end) {
            setError("End date cannot be before start date.");
            return;
        }
        const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 3600 * 24)) + 1;
        addLeaveRequest({ leaveType, startDate, endDate, reason, status: RequestStatus.PENDING, days });
        onClose();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="leaveType" className="block text-sm font-medium text-neutral-700">Leave Type</label>
                <select id="leaveType" value={leaveType} onChange={(e) => setLeaveType(e.target.value as LeaveType)} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-neutral-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md">
                    {Object.values(LeaveType).map(lt => <option key={lt} value={lt}>{lt}</option>)}
                </select>
            </div>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="startDate" className="block text-sm font-medium text-neutral-700">Start Date</label>
                    <input type="date" id="startDate" value={startDate} onChange={e => setStartDate(e.target.value)} className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm" />
                </div>
                <div>
                    <label htmlFor="endDate" className="block text-sm font-medium text-neutral-700">End Date</label>
                    <input type="date" id="endDate" value={endDate} onChange={e => setEndDate(e.target.value)} className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm" />
                </div>
            </div>
            <div>
                <label htmlFor="reason" className="block text-sm font-medium text-neutral-700">Reason</label>
                <textarea id="reason" value={reason} onChange={e => setReason(e.target.value)} rows={3} className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm" />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <div className="flex justify-end space-x-2">
                <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
                <Button type="submit">Submit Request</Button>
            </div>
        </form>
    );
}

// Table for Leave Requests
const LeaveTable: React.FC<{ requests: LeaveRequest[], isManagerView?: boolean }> = ({ requests, isManagerView = false }) => {
    const { employees, currentUser } = useAppState();
    const { updateRequestStatus } = useAppActions();
    const getEmployeeName = (id: string) => employees.find(e => e.id === id)?.name || 'Unknown';
    
    const handleAction = (id: string, status: 'Approved' | 'Rejected') => {
        if(window.confirm(`Are you sure you want to ${status.toLowerCase()} this request?`)) {
            updateRequestStatus(id, status, 'leave');
        }
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-neutral-500">
                <thead className="text-xs text-neutral-700 uppercase bg-neutral-50">
                    <tr>
                        {isManagerView && <th scope="col" className="px-6 py-3">Employee</th>}
                        <th scope="col" className="px-6 py-3">Type</th>
                        <th scope="col" className="px-6 py-3">Dates</th>
                        <th scope="col" className="px-6 py-3">Days</th>
                        <th scope="col" className="px-6 py-3">Status</th>
                        {isManagerView && currentUser.isManager && <th scope="col" className="px-6 py-3">Action</th>}
                    </tr>
                </thead>
                <tbody>
                    {requests.map(req => (
                        <tr key={req.id} className="bg-white border-b hover:bg-neutral-50">
                            {isManagerView && <td className="px-6 py-4 font-medium text-neutral-900">{getEmployeeName(req.employeeId)}</td>}
                            <td className="px-6 py-4">{req.leaveType}</td>
                            <td className="px-6 py-4">{req.startDate} to {req.endDate}</td>
                            <td className="px-6 py-4">{req.days}</td>
                            <td className="px-6 py-4"><Tag status={req.status} /></td>
                            {isManagerView && currentUser.isManager && req.status === RequestStatus.PENDING && (
                                <td className="px-6 py-4 flex space-x-2">
                                    <Button size="sm" onClick={() => handleAction(req.id, 'Approved')}>Approve</Button>
                                    <Button size="sm" variant="danger" onClick={() => handleAction(req.id, 'Rejected')}>Reject</Button>
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}


// Main Component
export const LeaveManagement: React.FC = () => {
    const [activeTab, setActiveTab] = useState('my_leave');
    const [isModalOpen, setModalOpen] = useState(false);
    const { currentUser, leaveRequests, employees } = useAppState();

    const myRequests = useMemo(() => leaveRequests.filter(r => r.employeeId === currentUser.id)
    .sort((a,b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()), [leaveRequests, currentUser.id]);
    
    const teamRequests = useMemo(() => {
        const teamMemberIds = employees.filter(e => e.managerId === currentUser.id).map(e => e.id);
        return leaveRequests.filter(r => teamMemberIds.includes(r.employeeId))
        .sort((a,b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
    }, [leaveRequests, employees, currentUser.id]);

    const tabs = [
        { id: 'my_leave', label: 'My Leave' },
        ...(currentUser.isManager ? [{ id: 'team_leave', label: 'Team Leave' }] : []),
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold">Leave Management</h2>
                    <p className="text-neutral-500">Manage your time off and view your team's schedule.</p>
                </div>
                <Button onClick={() => setModalOpen(true)}>Apply for Leave</Button>
            </div>
            
            <Card>
                <div className="border-b border-neutral-200">
                    <nav className="-mb-px flex space-x-6 px-6">
                        {tabs.map(tab => (
                             <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === tab.id ? 'border-primary text-primary' : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'}`}>
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </div>
                
                {activeTab === 'my_leave' && <LeaveTable requests={myRequests} />}
                {activeTab === 'team_leave' && currentUser.isManager && <LeaveTable requests={teamRequests} isManagerView />}

            </Card>

             <Modal title="Apply for Leave" isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
                <LeaveForm onClose={() => setModalOpen(false)} />
            </Modal>
        </div>
    );
};
