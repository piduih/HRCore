

import React, { useState } from 'react';
import { useAppState, useAppActions } from '../../hooks/useAppContext';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import { Icon } from '../common/Icon';
import type { PayrollRun, PayrollStatus as PayrollStatusType } from '../../types';
import { PayrollStatus } from '../../types';

const PayrollStatusTag: React.FC<{ status: PayrollStatusType }> = ({ status }) => {
    const statusStyles: Record<PayrollStatusType, string> = {
        [PayrollStatus.DRAFT]: 'bg-yellow-100 text-yellow-800',
        [PayrollStatus.FINALIZED]: 'bg-green-100 text-green-800',
    };
    return <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full inline-block ${statusStyles[status]}`}>{status}</span>;
};

const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

// Helper function to generate CSV content and trigger download
const downloadCsv = (filename: string, headers: string[], data: string[][]) => {
    const csvRows = [headers.join(','), ...data.map(row => row.join(','))];
    const csvContent = "data:text/csv;charset=utf-8," + csvRows.join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

// --- Sub Components ---
const PayrollRunList: React.FC<{ onRunSelect: (run: PayrollRun) => void, onNewRun: () => void }> = ({ onRunSelect, onNewRun }) => {
    const { payrollRuns, currentUser } = useAppState();
    
    if (!currentUser.isManager) {
         return (
            <div className="text-center p-8">
                <h2 className="text-2xl font-bold">Access Denied</h2>
                <p className="text-neutral-500 mt-2">This feature is available for managers only.</p>
            </div>
        );
    }

    return (
        <Card>
            <div className="p-6 flex justify-between items-center">
                <h3 className="font-semibold text-lg">Payroll History</h3>
                <Button onClick={onNewRun}>
                    <Icon name="plus" className="w-4 h-4 mr-2" />
                    Start New Payroll Run
                </Button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-neutral-500">
                    <thead className="text-xs text-neutral-700 uppercase bg-neutral-50">
                        <tr>
                            <th className="px-6 py-3">Period</th>
                            <th className="px-6 py-3">Status</th>
                            <th className="px-6 py-3">Created At</th>
                            <th className="px-6 py-3"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {payrollRuns.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map(run => (
                            <tr key={run.id} className="bg-white border-b hover:bg-neutral-50">
                                <td className="px-6 py-4 font-medium text-neutral-900">{monthNames[run.month - 1]} {run.year}</td>
                                <td className="px-6 py-4"><PayrollStatusTag status={run.status} /></td>
                                <td className="px-6 py-4">{new Date(run.createdAt).toLocaleDateString()}</td>
                                <td className="px-6 py-4 text-right">
                                    <Button size="sm" variant="secondary" onClick={() => onRunSelect(run)}>View Details</Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
    );
};

const PayrollRunDetails: React.FC<{ run: PayrollRun, onBack: () => void }> = ({ run, onBack }) => {
    const { employees } = useAppState();
    const { finalizePayroll } = useAppActions();
    const getEmployee = (id: string) => employees.find(e => e.id === id);

    const handleFinalize = () => {
        if (window.confirm('Are you sure you want to finalize this payroll run? This action cannot be undone.')) {
            finalizePayroll(run.id);
        }
    };
    
    const handleDownloadBankFile = () => {
        const headers = ['BankAccount', 'EmployeeName', 'NetSalary'];
        const data = run.records.map(r => {
            const emp = getEmployee(r.employeeId);
            return [emp?.bankAccount || 'N/A', emp?.name || 'Unknown', r.netSalary.toFixed(2)];
        });
        downloadCsv(`bank_file_${run.year}_${run.month}`, headers, data);
    };
    
    const handleDownloadEpfFile = () => {
        const headers = ['EPFNumber', 'EmployeeName', 'EmployeeContribution', 'EmployerContribution', 'TotalContribution'];
        const data = run.records.map(r => {
            const emp = getEmployee(r.employeeId);
            return [
                emp?.epfNumber || 'N/A',
                emp?.name || 'Unknown',
                r.epfEmployee.toFixed(2),
                r.epfEmployer.toFixed(2),
                (r.epfEmployee + r.epfEmployer).toFixed(2)
            ];
        });
        downloadCsv(`epf_file_${run.year}_${run.month}`, headers, data);
    };

    const handleDownloadSocsoFile = () => {
        const headers = ['EmployeeId', 'EmployeeName', 'SocsoContribution', 'EISContribution'];
        const data = run.records.map(r => {
            const emp = getEmployee(r.employeeId);
            return [
                emp?.id || 'N/A',
                emp?.name || 'Unknown',
                (r.socsoEmployee + r.socsoEmployer).toFixed(2),
                (r.eisEmployee + r.eisEmployer).toFixed(2),
            ];
        });
        downloadCsv(`socso_eis_file_${run.year}_${run.month}`, headers, data);
    }
    
    const formatCurrency = (val: number) => val.toFixed(2);

    return (
        <Card>
            <div className="p-6 border-b">
                <Button variant="secondary" size="sm" onClick={onBack}>&larr; Back to History</Button>
                <div className="flex justify-between items-center mt-2">
                    <div>
                        <h3 className="font-semibold text-lg">Payroll for {monthNames[run.month - 1]} {run.year}</h3>
                        <PayrollStatusTag status={run.status} />
                    </div>
                    {run.status === PayrollStatus.DRAFT && <Button onClick={handleFinalize}>Finalize Payroll</Button>}
                    {run.status === PayrollStatus.FINALIZED && (
                         <div className="flex space-x-2">
                            <Button variant="secondary" onClick={handleDownloadBankFile}>Bank File</Button>
                            <Button variant="secondary" onClick={handleDownloadEpfFile}>EPF File</Button>
                             <Button variant="secondary" onClick={handleDownloadSocsoFile}>PERKESO File</Button>
                        </div>
                    )}
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-neutral-500">
                    <thead className="text-xs text-neutral-700 uppercase bg-neutral-50">
                        <tr>
                            <th className="px-6 py-3">Employee</th>
                            <th className="px-6 py-3">Gross</th>
                            <th className="px-6 py-3">Deductions</th>
                            <th className="px-6 py-3">Net</th>
                            <th className="px-6 py-3">EPF (Employer)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {run.records.map(record => (
                            <tr key={record.employeeId} className="bg-white border-b">
                                <td className="px-6 py-4 font-medium text-neutral-900">{getEmployee(record.employeeId)?.name}</td>
                                <td className="px-6 py-4">{formatCurrency(record.grossSalary)}</td>
                                <td className="px-6 py-4 text-red-600">-{formatCurrency(record.totalDeductions)}</td>
                                <td className="px-6 py-4 font-bold">{formatCurrency(record.netSalary)}</td>
                                <td className="px-6 py-4">{formatCurrency(record.epfEmployer)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
    )
};

const NewRunModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const { payrollRuns } = useAppState();
    const { runPayroll } = useAppActions();
    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [year, setYear] = useState(new Date().getFullYear());

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const existingRun = payrollRuns.find(p => p.month === month && p.year === year);
        if(existingRun) {
            alert(`A payroll run for ${monthNames[month-1]} ${year} already exists. Please delete it first if you want to re-run.`);
            return;
        }
        runPayroll(month, year);
        onClose();
    };
    
    return (
        <Modal isOpen={true} onClose={onClose} title="Start New Payroll Run">
            <form onSubmit={handleSubmit} className="space-y-4">
                <p>Select the month and year for the new payroll run. This will calculate salary for all active employees.</p>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium">Month</label>
                        <select value={month} onChange={e => setMonth(Number(e.target.value))} className="mt-1 w-full rounded-md border-neutral-300">
                            {monthNames.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
                        </select>
                    </div>
                    <div>
                         <label className="block text-sm font-medium">Year</label>
                        <input type="number" value={year} onChange={e => setYear(Number(e.target.value))} className="mt-1 w-full rounded-md border-neutral-300"/>
                    </div>
                </div>
                <div className="flex justify-end space-x-2">
                    <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
                    <Button type="submit">Run Payroll</Button>
                </div>
            </form>
        </Modal>
    );
};


// --- Main Component ---
export const PayrollProcessing: React.FC = () => {
    const [selectedRun, setSelectedRun] = useState<PayrollRun | null>(null);
    const [isNewRunModalOpen, setNewRunModalOpen] = useState(false);

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold">Payroll Processing</h2>
                <p className="text-neutral-500">Process monthly payroll and generate statutory files.</p>
            </div>

            {selectedRun ? (
                <PayrollRunDetails run={selectedRun} onBack={() => setSelectedRun(null)} />
            ) : (
                <PayrollRunList onRunSelect={setSelectedRun} onNewRun={() => setNewRunModalOpen(true)} />
            )}

            {isNewRunModalOpen && <NewRunModal onClose={() => setNewRunModalOpen(false)} />}
        </div>
    );
};
