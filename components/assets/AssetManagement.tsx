

import React, { useState, useMemo } from 'react';
import { useAppState, useAppActions } from '../../hooks/useAppContext';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import { Icon } from '../common/Icon';
import type { Asset, AssetStatus } from '../../types';
import { AssetStatus as AssetStatusEnum } from '../../types';

const AssetStatusTag: React.FC<{ status: AssetStatus }> = ({ status }) => {
    const statusStyles: Record<AssetStatus, string> = {
        [AssetStatusEnum.IN_STOCK]: 'bg-blue-100 text-blue-800',
        [AssetStatusEnum.ASSIGNED]: 'bg-green-100 text-green-800',
        [AssetStatusEnum.UNDER_REPAIR]: 'bg-yellow-100 text-yellow-800',
        [AssetStatusEnum.DECOMMISSIONED]: 'bg-neutral-100 text-neutral-800',
    };
    return <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full inline-block ${statusStyles[status]}`}>{status}</span>;
};

const AddAssetModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const { addAsset } = useAppActions();
    const [name, setName] = useState('');
    const [category, setCategory] = useState('');
    const [serialNumber, setSerialNumber] = useState('');
    const [purchaseDate, setPurchaseDate] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !category || !serialNumber || !purchaseDate) return;
        addAsset({ name, category, serialNumber, purchaseDate });
        onClose();
    };

    return (
        <Modal isOpen={true} onClose={onClose} title="Add New Asset">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-neutral-700">Asset Name</label>
                        <input type="text" value={name} onChange={e => setName(e.target.value)} className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm" placeholder="e.g., Dell Latitude 7420" required/>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-neutral-700">Category</label>
                        <input type="text" value={category} onChange={e => setCategory(e.target.value)} className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm" placeholder="e.g., Laptop, Phone" required/>
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-neutral-700">Serial Number</label>
                    <input type="text" value={serialNumber} onChange={e => setSerialNumber(e.target.value)} className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm" required/>
                </div>
                 <div>
                    <label className="block text-sm font-medium text-neutral-700">Purchase Date</label>
                    <input type="date" value={purchaseDate} onChange={e => setPurchaseDate(e.target.value)} className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm" required/>
                </div>
                <div className="flex justify-end space-x-2">
                    <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
                    <Button type="submit">Add Asset</Button>
                </div>
            </form>
        </Modal>
    );
};

const AssignAssetModal: React.FC<{ asset: Asset, onClose: () => void }> = ({ asset, onClose }) => {
    const { employees } = useAppState();
    const { assignAsset } = useAppActions();
    const [employeeId, setEmployeeId] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!employeeId) return;
        assignAsset(asset.id, employeeId);
        onClose();
    };
    
    return (
        <Modal isOpen={true} onClose={onClose} title={`Assign: ${asset.name}`}>
             <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-neutral-700">Assign to Employee</label>
                    <select value={employeeId} onChange={e => setEmployeeId(e.target.value)} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-neutral-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md" required>
                        <option value="" disabled>-- Select an employee --</option>
                        {employees.map(emp => <option key={emp.id} value={emp.id}>{emp.name}</option>)}
                    </select>
                </div>
                <div className="flex justify-end space-x-2">
                    <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
                    <Button type="submit">Assign Asset</Button>
                </div>
            </form>
        </Modal>
    );
};


export const AssetManagement: React.FC = () => {
    const { assets, employees } = useAppState();
    const { unassignAsset } = useAppActions();
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddModalOpen, setAddModalOpen] = useState(false);
    const [assigningAsset, setAssigningAsset] = useState<Asset | null>(null);

    const getEmployeeName = (employeeId: string) => {
        return employees.find(e => e.id === employeeId)?.name || 'N/A';
    };

    const handleUnassign = (assetId: string) => {
        if(window.confirm('Are you sure you want to unassign this asset and return it to stock?')) {
            unassignAsset(assetId);
        }
    };

    const filteredAssets = useMemo(() => assets.filter(asset => 
        asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (asset.assignedTo && getEmployeeName(asset.assignedTo).toLowerCase().includes(searchTerm.toLowerCase()))
    ), [assets, searchTerm, employees]);

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold">Asset Management</h2>
                    <p className="text-neutral-500">Track and manage all company assets.</p>
                </div>
                <Button onClick={() => setAddModalOpen(true)}>
                    <Icon name="plus" className="w-4 h-4 mr-2" />
                    Add New Asset
                </Button>
            </div>

            <Card>
                <div className="p-4 border-b">
                     <input
                        type="text"
                        placeholder="Search by name, serial, assigned employee..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full max-w-sm px-4 py-2 border border-neutral-300 rounded-lg focus:ring-primary focus:border-primary"
                    />
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-neutral-500">
                        <thead className="text-xs text-neutral-700 uppercase bg-neutral-50">
                            <tr>
                                <th scope="col" className="px-6 py-3">Asset Name</th>
                                <th scope="col" className="px-6 py-3">Category</th>
                                <th scope="col" className="px-6 py-3">Serial Number</th>
                                <th scope="col" className="px-6 py-3">Assigned To</th>
                                <th scope="col" className="px-6 py-3">Status</th>
                                <th scope="col" className="px-6 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredAssets.map(asset => (
                                <tr key={asset.id} className="bg-white border-b hover:bg-neutral-50">
                                    <td className="px-6 py-4 font-medium text-neutral-900">{asset.name}</td>
                                    <td className="px-6 py-4">{asset.category}</td>
                                    <td className="px-6 py-4">{asset.serialNumber}</td>
                                    <td className="px-6 py-4">{asset.assignedTo ? getEmployeeName(asset.assignedTo) : '-'}</td>
                                    <td className="px-6 py-4"><AssetStatusTag status={asset.status} /></td>
                                    <td className="px-6 py-4">
                                        {asset.status === AssetStatusEnum.IN_STOCK && (
                                            <Button size="sm" onClick={() => setAssigningAsset(asset)}>Assign</Button>
                                        )}
                                        {asset.status === AssetStatusEnum.ASSIGNED && (
                                            <Button size="sm" variant="secondary" onClick={() => handleUnassign(asset.id)}>Unassign</Button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            {isAddModalOpen && <AddAssetModal onClose={() => setAddModalOpen(false)} />}
            {assigningAsset && <AssignAssetModal asset={assigningAsset} onClose={() => setAssigningAsset(null)} />}
        </div>
    );
};
