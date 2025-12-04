

import React, { useState, useMemo } from 'react';
import type { ClaimRequest } from '../../types';
import { RequestStatus } from '../../types';
import { useAppState, useAppActions } from '../../hooks/useAppContext';
import { Card } from '../common/Card';
import { Tag } from '../common/Tag';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import { Icon } from '../common/Icon';

const ClaimForm: React.FC<{onClose: () => void}> = ({onClose}) => {
    const { addClaimRequest } = useAppActions();
    const [claimType, setClaimType] = useState('Travel');
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState('');
    const [description, setDescription] = useState('');
    const [attachmentName, setAttachmentName] = useState<string | undefined>();
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const numericAmount = parseFloat(amount);
        if (!claimType || !amount || !date || !description || isNaN(numericAmount) || numericAmount <= 0) {
            setError("Please fill all fields correctly. Amount must be a positive number.");
            return;
        }
        addClaimRequest({ claimType, amount: numericAmount, date, description, status: RequestStatus.PENDING, attachmentName });
        onClose();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setAttachmentName(e.target.files[0].name);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="claimType" className="block text-sm font-medium text-neutral-700">Claim Type</label>
                    <input type="text" id="claimType" value={claimType} onChange={e => setClaimType(e.target.value)} placeholder="e.g., Travel, Meals" className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm" />
                </div>
                 <div>
                    <label htmlFor="amount" className="block text-sm font-medium text-neutral-700">Amount (RM)</label>
                    <input type="number" id="amount" value={amount} onChange={e => setAmount(e.target.value)} step="0.01" className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm" />
                </div>
            </div>
            <div>
                <label htmlFor="date" className="block text-sm font-medium text-neutral-700">Date of Expense</label>
                <input type="date" id="date" value={date} onChange={e => setDate(e.target.value)} className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm" />
            </div>
            <div>
                <label htmlFor="description" className="block text-sm font-medium text-neutral-700">Description</label>
                <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} rows={3} className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm" />
            </div>
             <div>
                <label className="block text-sm font-medium text-neutral-700">Attachment</label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-neutral-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                        <Icon name="paperclip" className="mx-auto h-12 w-12 text-neutral-400" />
                        <div className="flex text-sm text-neutral-600">
                            <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary">
                                <span>Upload a file</span>
                                <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} />
                            </label>
                            <p className="pl-1">or drag and drop</p>
                        </div>
                        {attachmentName ? <p className="text-xs text-neutral-500">{attachmentName}</p> : <p className="text-xs text-neutral-500">PNG, JPG, PDF up to 10MB</p>}
                    </div>
                </div>
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <div className="flex justify-end space-x-2">
                <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
                <Button type="submit">Submit Claim</Button>
            </div>
        </form>
    );
}

const ClaimsTable: React.FC<{ requests: ClaimRequest[], isManagerView?: boolean }> = ({ requests, isManagerView = false }) => {
    const { employees, currentUser } = useAppState();
    const { updateRequestStatus } = useAppActions();
    const getEmployeeName = (id: string) => employees.find(e => e.id === id)?.name || 'Unknown';

    const handleAction = (id: string, status: 'Approved' | 'Rejected') => {
        if(window.confirm(`Are you sure you want to ${status.toLowerCase()} this request?`)) {
            updateRequestStatus(id, status, 'claim');
        }
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-neutral-500">
                <thead className="text-xs text-neutral-700 uppercase bg-neutral-50">
                    <tr>
                        {isManagerView && <th scope="col" className="px-6 py-3">Employee</th>}
                        <th scope="col" className="px-6 py-3">Type</th>
                        <th scope="col" className="px-6 py-3">Amount</th>
                        <th scope="col" className="px-6 py-3">Date</th>
                        <th scope="col" className="px-6 py-3">Status</th>
                        {isManagerView && currentUser.isManager && <th scope="col" className="px-6 py-3">Action</th>}
                    </tr>
                </thead>
                <tbody>
                    {requests.map(req => (
                        <tr key={req.id} className="bg-white border-b hover:bg-neutral-50">
                            {isManagerView && <td className="px-6 py-4 font-medium text-neutral-900">{getEmployeeName(req.employeeId)}</td>}
                            <td className="px-6 py-4">{req.claimType}</td>
                            <td className="px-6 py-4">RM {req.amount.toFixed(2)}</td>
                            <td className="px-6 py-4">{req.date}</td>
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

export const ClaimsManagement: React.FC = () => {
    const [activeTab, setActiveTab] = useState('my_claims');
    const [isModalOpen, setModalOpen] = useState(false);
    const { currentUser, claimRequests, employees } = useAppState();

    const myRequests = useMemo(() => claimRequests.filter(r => r.employeeId === currentUser.id)
    .sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()), [claimRequests, currentUser.id]);

    const teamRequests = useMemo(() => {
        const teamMemberIds = employees.filter(e => e.managerId === currentUser.id).map(e => e.id);
        return claimRequests.filter(r => teamMemberIds.includes(r.employeeId))
        .sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [claimRequests, employees, currentUser.id]);

    const tabs = [
        { id: 'my_claims', label: 'My Claims' },
        ...(currentUser.isManager ? [{ id: 'team_claims', label: 'Team Claims' }] : []),
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold">Claims Management</h2>
                    <p className="text-neutral-500">Submit and track your expense claims.</p>
                </div>
                <Button onClick={() => setModalOpen(true)}>Submit Claim</Button>
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
                
                {activeTab === 'my_claims' && <ClaimsTable requests={myRequests} />}
                {activeTab === 'team_claims' && currentUser.isManager && <ClaimsTable requests={teamRequests} isManagerView />}

            </Card>

             <Modal title="Submit a New Claim" isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
                <ClaimForm onClose={() => setModalOpen(false)} />
            </Modal>
        </div>
    );
};
