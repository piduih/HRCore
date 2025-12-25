import React, { useState, useMemo } from 'react';
import type { LeaveRequest } from '../../types';
import { RequestStatus, LeaveType } from '../../types';
import { useAppState, useAppActions } from '../../hooks/useAppContext';
import { Card } from '../common/Card';
import { Tag } from '../common/Tag';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import { Icon } from '../common/Icon';

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
            setError("Semua ruang wajib diisi.");
            return;
        }
        const start = new Date(startDate);
        const end = new Date(endDate);
        if (start > end) {
            setError("Tarikh tamat tidak boleh sebelum tarikh mula.");
            return;
        }
        const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 3600 * 24)) + 1;
        addLeaveRequest({ leaveType, startDate, endDate, reason, status: RequestStatus.PENDING, days });
        onClose();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="leaveType" className="block text-sm font-medium text-neutral-700">Jenis Cuti (Leave Type)</label>
                <select id="leaveType" value={leaveType} onChange={(e) => setLeaveType(e.target.value as LeaveType)} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-neutral-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md">
                    {Object.values(LeaveType).map(lt => <option key={lt} value={lt}>{lt}</option>)}
                </select>
            </div>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="startDate" className="block text-sm font-medium text-neutral-700">Mula Tarikh</label>
                    <input type="date" id="startDate" value={startDate} onChange={e => setStartDate(e.target.value)} className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm" />
                </div>
                <div>
                    <label htmlFor="endDate" className="block text-sm font-medium text-neutral-700">Tamat Tarikh</label>
                    <input type="date" id="endDate" value={endDate} onChange={e => setEndDate(e.target.value)} className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm" />
                </div>
            </div>
            <div>
                <label htmlFor="reason" className="block text-sm font-medium text-neutral-700">Sebab Cuti</label>
                <textarea id="reason" value={reason} onChange={e => setReason(e.target.value)} rows={3} placeholder="Contoh: Balik kampung, urusan keluarga..." className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm" />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <div className="flex justify-end space-x-2">
                <Button type="button" variant="secondary" onClick={onClose}>Batal</Button>
                <Button type="submit">Hantar Permohonan</Button>
            </div>
        </form>
    );
}

// Table for Leave Requests
const LeaveTable: React.FC<{ requests: LeaveRequest[], isManagerView?: boolean }> = ({ requests, isManagerView = false }) => {
    const { employees, currentUser } = useAppState();
    const { updateRequestStatus } = useAppActions();
    const getEmployeeName = (id: string) => employees.find(e => e.id === id)?.name || 'Unknown';
    
    const handleAction = (id: string, status: RequestStatus) => {
        if(window.confirm(`Adakah anda pasti mahu ${status === RequestStatus.APPROVED ? 'meluluskan' : 'menolak'} permohonan ini?`)) {
            updateRequestStatus(id, status, 'leave');
        }
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-neutral-500">
                <thead className="text-xs text-neutral-700 uppercase bg-neutral-50">
                    <tr>
                        {isManagerView && <th scope="col" className="px-6 py-3">Pekerja</th>}
                        <th scope="col" className="px-6 py-3">Jenis</th>
                        <th scope="col" className="px-6 py-3">Tarikh</th>
                        <th scope="col" className="px-6 py-3">Hari</th>
                        <th scope="col" className="px-6 py-3">Status</th>
                        {isManagerView && currentUser.isManager && <th scope="col" className="px-6 py-3">Tindakan</th>}
                    </tr>
                </thead>
                <tbody>
                    {requests.map(req => (
                        <tr key={req.id} className="bg-white border-b hover:bg-neutral-50">
                            {isManagerView && <td className="px-6 py-4 font-medium text-neutral-900">{getEmployeeName(req.employeeId)}</td>}
                            <td className="px-6 py-4">{req.leaveType}</td>
                            <td className="px-6 py-4">{req.startDate} hingga {req.endDate}</td>
                            <td className="px-6 py-4">{req.days}</td>
                            <td className="px-6 py-4"><Tag status={req.status} /></td>
                            {isManagerView && currentUser.isManager && req.status === RequestStatus.PENDING && (
                                <td className="px-6 py-4 flex space-x-2">
                                    <Button size="sm" onClick={() => handleAction(req.id, RequestStatus.APPROVED)}>Lulus</Button>
                                    <Button size="sm" variant="danger" onClick={() => handleAction(req.id, RequestStatus.REJECTED)}>Tolak</Button>
                                </td>
                            )}
                        </tr>
                    ))}
                    {requests.length === 0 && (
                        <tr>
                            <td colSpan={6} className="px-6 py-4 text-center text-neutral-500">Tiada rekod permohonan cuti.</td>
                        </tr>
                    )}
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
        { id: 'my_leave', label: 'Cuti Saya (My Leave)' },
        ...(currentUser.isManager ? [{ id: 'team_leave', label: 'Cuti Pasukan (Team Leave)' }] : []),
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold">Pengurusan Cuti</h2>
                    <p className="text-neutral-500">Mohon cuti baru dan semak baki cuti anda.</p>
                </div>
                <Button onClick={() => setModalOpen(true)}>
                    <Icon name="plus" className="w-4 h-4 mr-2" />
                    Mohon Cuti Baru
                </Button>
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

             <Modal title="Permohonan Cuti Baru" isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
                <LeaveForm onClose={() => setModalOpen(false)} />
            </Modal>
        </div>
    );
};