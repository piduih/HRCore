import React, { useState, useMemo } from 'react';
import { calculateEisBenefits } from '../../services/payrollService';
import { Card } from '../common/Card';

export const EisBenefitCalculator: React.FC = () => {
    const [salary, setSalary] = useState('');
    
    const benefits = useMemo(() => {
        const monthlySalary = parseFloat(salary);
        if (isNaN(monthlySalary) || monthlySalary <= 0) return [];
        return calculateEisBenefits(monthlySalary);
    }, [salary]);

    const formatCurrency = (value: number) => `RM ${value.toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-6">
                <Card className="p-6">
                    <h3 className="font-semibold text-lg mb-4">Enter Your Salary</h3>
                    <div className="space-y-1">
                        <label htmlFor="eisSalary" className="block text-sm font-medium text-neutral-700">Last Drawn Monthly Salary (RM)</label>
                        <input
                            type="number"
                            id="eisSalary"
                            value={salary}
                            onChange={(e) => setSalary(e.target.value)}
                            placeholder="e.g., 4500"
                            className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                        />
                         <p className="text-xs text-neutral-500 pt-1">This is used to determine your Assumed Monthly Wage for EIS.</p>
                    </div>
                </Card>
                <div className="text-xs text-neutral-500 p-3 bg-yellow-50 rounded-lg">
                    <p><strong>Disclaimer:</strong> This is an estimation for the Job-Search Allowance (EMP). Final amounts and eligibility are determined by PERKESO upon application.</p>
                </div>
            </div>
             <div className="lg:col-span-2">
                <Card className="p-6">
                    <h3 className="font-semibold text-lg mb-4">Estimated Monthly Payout</h3>
                    {benefits.length > 0 ? (
                        <div className="space-y-4">
                            <p className="text-sm text-neutral-600">Based on your salary, here is the estimated Job-Search Allowance (Elaun Mencari Pekerjaan) you may receive for up to 6 months while actively seeking new employment.</p>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="text-xs text-neutral-700 uppercase bg-neutral-100">
                                        <tr>
                                            <th scope="col" className="px-4 py-3">Month</th>
                                            <th scope="col" className="px-4 py-3">Payout Rate</th>
                                            <th scope="col" className="px-4 py-3 text-right">Estimated Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {benefits.map((benefit, index) => (
                                            <tr key={benefit.month} className="border-b">
                                                <td className="px-4 py-3 font-medium">Month {benefit.month}</td>
                                                <td className="px-4 py-3">{[80, 50, 40, 40, 30, 30][index]}%</td>
                                                <td className="px-4 py-3 font-semibold text-right">{formatCurrency(benefit.amount)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ) : (
                         <div className="text-center py-16 text-neutral-500">
                            <p>Enter your last drawn salary to see your estimated EIS benefits.</p>
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
};