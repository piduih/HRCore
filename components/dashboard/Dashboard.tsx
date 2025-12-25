import React from 'react';
import type { LeaveRequest, ClaimRequest } from '../../types';
import { RequestStatus } from '../../types';
import { useAppState } from '../../hooks/useAppContext';
import { StatCard } from './StatCard';
import { QuickActions } from './QuickActions';
import { Card } from '../common/Card';
import { Tag } from '../common/Tag';
import { Page } from '../../App';
import { CompanyAnnouncements } from './CompanyAnnouncements';

interface DashboardProps {
    setActivePage: (page: Page) => void;
    setQrScannerOpen: (isOpen: boolean) => void;
}

const PendingApprovals: React.FC = () => {
    const { leaveRequests, claimRequests, employees, currentUser } = useAppState();
    
    if (!currentUser.isManager) return null;

    const getEmployeeName = (id: string) => employees.find(e => e.id === id)?.name || 'Unknown';

    const pendingLeave = leaveRequests.filter(req => req.status === RequestStatus.PENDING);
    const pendingClaims = claimRequests.filter(req => req.status === RequestStatus.PENDING);

    if (pendingLeave.length === 0 && pendingClaims.length === 0) {
        return (
            <Card className="p-6 border-l-4 border-green-500">
                <h3 className="font-semibold text-lg mb-2">Semuanya Selesai! (All Clear)</h3>
                <p className="text-neutral-500">Tiada permohonan yang menunggu kelulusan anda. Kerja bagus!</p>
            </Card>
        );
    }

    return (
        <Card>
            <div className="p-6">
                 <h3 className="font-semibold text-lg">Permohonan Perlu Diluluskan (Pending Tasks)</h3>
                 <p className="text-sm text-neutral-500">Sila semak permohonan di bawah.</p>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-neutral-500">
                    <thead className="text-xs text-neutral-700 uppercase bg-neutral-50">
                        <tr>
                            <th scope="col" className="px-6 py-3">Nama Pekerja</th>
                            <th scope="col" className="px-6 py-3">Jenis</th>
                            <th scope="col" className="px-6 py-3">Butiran</th>
                            <th scope="col" className="px-6 py-3">Tarikh</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pendingLeave.map((req: LeaveRequest) => (
                            <tr key={req.id} className="bg-white border-b">
                                <td className="px-6 py-4 font-medium text-neutral-900 whitespace-nowrap">{getEmployeeName(req.employeeId)}</td>
                                <td className="px-6 py-4">Cuti</td>
                                <td className="px-6 py-4">{req.leaveType}</td>
                                <td className="px-6 py-4">{req.startDate}</td>
                            </tr>
                        ))}
                        {pendingClaims.map((req: ClaimRequest) => (
                             <tr key={req.id} className="bg-white border-b">
                                <td className="px-6 py-4 font-medium text-neutral-900 whitespace-nowrap">{getEmployeeName(req.employeeId)}</td>
                                <td className="px-6 py-4">Tuntutan</td>
                                <td className="px-6 py-4">RM {req.amount.toFixed(2)}</td>
                                <td className="px-6 py-4">{req.date}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
    )
}

const MyRecentActivity: React.FC = () => {
    const { leaveRequests, claimRequests, currentUser } = useAppState();
    const myRequests = [
        ...leaveRequests.filter(r => r.employeeId === currentUser.id).map(r => ({...r, type: 'Cuti', detail: r.leaveType, date: r.startDate})),
        ...claimRequests.filter(r => r.employeeId === currentUser.id).map(r => ({...r, type: 'Klaim', detail: `RM ${r.amount.toFixed(2)}`, date: r.date}))
    ].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);

    return (
        <Card className="p-6">
            <h3 className="font-semibold text-lg mb-4">Aktiviti Terkini Saya</h3>
            {myRequests.length === 0 ? <p className="text-neutral-500">Tiada aktiviti terkini.</p> :
            <ul className="space-y-4">
                {myRequests.map(req => (
                    <li key={req.id} className="flex justify-between items-center">
                        <div>
                            <p className="font-semibold">{req.type}: {req.detail}</p>
                            <p className="text-sm text-neutral-500">{req.date}</p>
                        </div>
                        <Tag status={req.status} />
                    </li>
                ))}
            </ul>}
        </Card>
    );
}

export const Dashboard: React.FC<DashboardProps> = ({ setActivePage, setQrScannerOpen }) => {
    const { currentUser } = useAppState();
    const leaveBalance = currentUser.annualLeaveEntitled - currentUser.annualLeaveTaken;
  
    return (
    <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard title="Baki Cuti Tahunan" value={`${leaveBalance} Hari`} icon="leave" />
            <StatCard title="Cuti Sakit Diambil" value={`${currentUser.sickLeaveTaken} Hari`} icon="info" />
            <StatCard title="Tugasan Menunggu" value="3" icon="check" />
            <StatCard title="Ahli Pasukan" value="5" icon="directory" />
        </div>
        <QuickActions setActivePage={setActivePage} setQrScannerOpen={setQrScannerOpen} />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
             <div className="lg:col-span-2">
                <CompanyAnnouncements />
            </div>
            <div className="lg:col-span-1 space-y-6">
                <MyRecentActivity />
            </div>
        </div>
        {currentUser.isManager && <PendingApprovals />}
    </div>
  );
};