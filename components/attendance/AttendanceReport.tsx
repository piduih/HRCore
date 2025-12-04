

import React, { useState, useMemo } from 'react';
import { useAppState } from '../../hooks/useAppContext';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Page } from '../../App';
import { AttendanceStatus } from '../../types';
import { Tag } from '../common/Tag';

const StatCard: React.FC<{ title: string, value: number, color: string }> = ({ title, value, color }) => (
    <Card className="p-4">
        <p className="text-sm font-medium text-neutral-500">{title}</p>
        <p className={`text-3xl font-bold ${color}`}>{value}</p>
    </Card>
);

interface AttendanceReportProps {
  setActivePage: (page: Page) => void;
}

export const AttendanceReport: React.FC<AttendanceReportProps> = ({ setActivePage }) => {
    const { attendanceRecords, employees } = useAppState();
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
    const todayStr = today.toISOString().split('T')[0];
    
    const [filters, setFilters] = useState({
        startDate: firstDayOfMonth,
        endDate: todayStr,
        department: 'all',
    });

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const departments = useMemo(() => [...new Set(employees.map(e => e.department))], [employees]);

    const filteredRecords = useMemo(() => {
        return attendanceRecords
            .filter(record => {
                const recordDate = new Date(record.date);
                const startDate = new Date(filters.startDate);
                const endDate = new Date(filters.endDate);
                return recordDate >= startDate && recordDate <= endDate;
            })
            .filter(record => {
                if (filters.department === 'all') return true;
                const employee = employees.find(e => e.id === record.employeeId);
                return employee?.department === filters.department;
            })
            .map(record => ({
                ...record,
                employeeName: employees.find(e => e.id === record.employeeId)?.name || 'Unknown',
                department: employees.find(e => e.id === record.employeeId)?.department || 'N/A',
            }))
            .sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [attendanceRecords, employees, filters]);

    const summaryStats = useMemo(() => {
        return filteredRecords.reduce((acc, record) => {
            if (record.status === AttendanceStatus.PRESENT) acc.present++;
            if (record.status === AttendanceStatus.LATE) acc.late++;
            if (record.status === AttendanceStatus.ABSENT) acc.absent++;
            return acc;
        }, { present: 0, late: 0, absent: 0 });
    }, [filteredRecords]);

    const exportToCsv = () => {
        const headers = ['Date', 'Employee', 'Department', 'Status', 'Clock In', 'Notes'];
        const rows = filteredRecords.map(r => [
            r.date,
            r.employeeName,
            r.department,
            r.status,
            r.checkInTime || '',
            r.notes || ''
        ].join(','));

        const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows].join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `attendance_report_${filters.startDate}_to_${filters.endDate}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <div>
                    <Button variant="secondary" size="sm" onClick={() => setActivePage(Page.ATTENDANCE)}>&larr; Back to Calendar</Button>
                    <h2 className="text-2xl font-bold mt-2">Attendance Report</h2>
                    <p className="text-neutral-500">Analyze attendance trends across the company.</p>
                </div>
                <Button onClick={exportToCsv} disabled={filteredRecords.length === 0}>Export to CSV</Button>
            </div>

            <Card className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="text-sm font-medium">Start Date</label>
                        <input type="date" name="startDate" value={filters.startDate} onChange={handleFilterChange} className="mt-1 w-full rounded-md border-neutral-300 shadow-sm" />
                    </div>
                    <div>
                        <label className="text-sm font-medium">End Date</label>
                        <input type="date" name="endDate" value={filters.endDate} onChange={handleFilterChange} className="mt-1 w-full rounded-md border-neutral-300 shadow-sm" />
                    </div>
                    <div>
                        <label className="text-sm font-medium">Department</label>
                        <select name="department" value={filters.department} onChange={handleFilterChange} className="mt-1 w-full rounded-md border-neutral-300 shadow-sm">
                            <option value="all">All Departments</option>
                            {departments.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                    </div>
                </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard title="Total Present" value={summaryStats.present} color="text-green-600" />
                <StatCard title="Total Late" value={summaryStats.late} color="text-orange-600" />
                <StatCard title="Total Absent" value={summaryStats.absent} color="text-red-600" />
            </div>

            <Card>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-neutral-500">
                        <thead className="text-xs text-neutral-700 uppercase bg-neutral-50">
                            <tr>
                                <th className="px-6 py-3">Date</th>
                                <th className="px-6 py-3">Employee</th>
                                <th className="px-6 py-3">Department</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3">Clock In Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredRecords.map(record => (
                                <tr key={record.id} className="bg-white border-b hover:bg-neutral-50">
                                    <td className="px-6 py-4">{record.date}</td>
                                    <td className="px-6 py-4 font-medium text-neutral-900">{record.employeeName}</td>
                                    <td className="px-6 py-4">{record.department}</td>
                                    <td className="px-6 py-4"><Tag status={record.status} /></td>
                                    <td className="px-6 py-4">{record.checkInTime || '-'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                     {filteredRecords.length === 0 && (
                        <div className="text-center py-16 text-neutral-500">
                            <p>No attendance records found for the selected filters.</p>
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
};
