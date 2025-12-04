
import React, { useMemo } from 'react';
import { useAppState } from '../../hooks/useAppContext';
import { Card } from '../common/Card';
import { Icon } from '../common/Icon';
import { OnboardingProcessStatus, OnboardingProcessType } from '../../types';
import { PieChart } from './charts/PieChart';
import { BarChart } from './charts/BarChart';
import { LineChart } from './charts/LineChart';

const StatCard: React.FC<{ title: string; value: string; icon: React.ComponentProps<typeof Icon>['name'] }> = ({ title, value, icon }) => (
    <Card className="p-5">
        <div className="flex items-center">
            <div className="bg-primary-100 rounded-md p-3">
                <Icon name={icon} className="h-6 w-6 text-primary" />
            </div>
            <div className="ml-4">
                <p className="text-sm font-medium text-neutral-500">{title}</p>
                <p className="text-2xl font-bold text-neutral-900">{value}</p>
            </div>
        </div>
    </Card>
);

export const AnalyticsDashboard: React.FC = () => {
    const { employees, onboardingProcesses } = useAppState();

    const analyticsData = useMemo(() => {
        const totalEmployees = employees.length;

        const completedOffboardings = onboardingProcesses.filter(p => p.type === OnboardingProcessType.OFFBOARDING && p.status === OnboardingProcessStatus.COMPLETED).length;
        const totalHeadcountForTurnover = totalEmployees + completedOffboardings;
        const turnoverRate = totalHeadcountForTurnover > 0 ? (completedOffboardings / totalHeadcountForTurnover) * 100 : 0;

        const totalTenureMonths = employees.reduce((acc, emp) => {
            const joinDate = new Date(emp.joinDate);
            const months = (new Date().getFullYear() - joinDate.getFullYear()) * 12 + (new Date().getMonth() - joinDate.getMonth());
            return acc + months;
        }, 0);
        const averageTenure = totalEmployees > 0 ? (totalTenureMonths / totalEmployees / 12) : 0; // in years

        // FIX: Explicitly type the accumulator in `reduce` to avoid type inference issues.
        const departmentDistribution = employees.reduce((acc, emp) => {
            acc[emp.department] = (acc[emp.department] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        // FIX: Explicitly type the accumulator in `reduce` to avoid type inference issues.
        const genderDistribution = employees.reduce((acc, emp) => {
            acc[emp.gender] = (acc[emp.gender] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        // FIX: Explicitly type the accumulator in `reduce` to ensure `departmentSalaries` is correctly typed, resolving errors on `data.totalSalary` and `data.count`.
        const departmentSalaries = employees.reduce<Record<string, { totalSalary: number; count: number }>>((acc, emp) => {
            if (!acc[emp.department]) {
                acc[emp.department] = { totalSalary: 0, count: 0 };
            }
            acc[emp.department].totalSalary += emp.salary;
            acc[emp.department].count++;
            return acc;
        }, {});
        
        const averageSalaryByDepartment = Object.entries(departmentSalaries).map(([dept, data]) => {
            const stats = data as { totalSalary: number; count: number };
            return {
                label: dept,
                value: stats.count > 0 ? stats.totalSalary / stats.count : 0
            };
        });

        const getPastMonths = (count: number) => {
            const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            const result = [];
            const today = new Date();
            for (let i = count - 1; i >= 0; i--) {
                const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
                result.push(months[d.getMonth()]);
            }
            return result;
        };

        const hiringTrends = {
            labels: getPastMonths(6),
            datasets: [{
                label: 'New Hires',
                data: [3, 2, 5, 4, 6, 8], // Mock data
                borderColor: '#0052cc',
            }],
        };

        return {
            totalEmployees,
            turnoverRate,
            averageTenure,
            departmentDistribution,
            genderDistribution,
            averageSalaryByDepartment,
            hiringTrends,
        };
    }, [employees, onboardingProcesses]);

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
                <p className="text-neutral-500">Key metrics and insights into your organization's health.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard title="Total Employees" value={analyticsData.totalEmployees.toString()} icon="users" />
                <StatCard title="Turnover Rate" value={`${analyticsData.turnoverRate.toFixed(1)}%`} icon="user" />
                <StatCard title="Average Tenure" value={`${analyticsData.averageTenure.toFixed(1)} Years`} icon="calendar" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="p-6">
                    <h3 className="font-semibold text-lg mb-4">Department Distribution</h3>
                    <PieChart data={{
                        labels: Object.keys(analyticsData.departmentDistribution),
                        datasets: [{
                            data: Object.values(analyticsData.departmentDistribution),
                            backgroundColor: ['#0052cc', '#4C9AFF', '#99C2FF', '#B3D1FF', '#CCE0FF'],
                        }]
                    }} />
                </Card>
                 <Card className="p-6">
                    <h3 className="font-semibold text-lg mb-4">Gender Diversity</h3>
                    <PieChart data={{
                        labels: Object.keys(analyticsData.genderDistribution),
                        datasets: [{
                            data: Object.values(analyticsData.genderDistribution),
                            backgroundColor: ['#0052cc', '#99C2FF'],
                        }]
                    }} />
                </Card>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                 <Card className="p-6">
                    <h3 className="font-semibold text-lg mb-4">Average Salary by Department</h3>
                    <BarChart data={analyticsData.averageSalaryByDepartment} />
                </Card>
                 <Card className="p-6">
                    <h3 className="font-semibold text-lg mb-4">Hiring Trends (Last 6 Months)</h3>
                     <LineChart data={analyticsData.hiringTrends} />
                </Card>
            </div>

        </div>
    );
};
