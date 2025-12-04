

import React, { useState, useMemo } from 'react';
import { Card } from '../common/Card';
import { getEpfContribution, getSocsoContribution, getEisContribution, getPcbContribution } from '../../services/payrollService';
import type { Reliefs } from '../../services/payrollService';
import { InfoTooltip } from './InfoTooltip';

const ResultRow: React.FC<{ label: string; value: string; isDeduction?: boolean; tooltip?: string; className?: string }> = ({ label, value, isDeduction = false, tooltip, className = '' }) => (
    <div className={`flex justify-between items-center ${className}`}>
        <div className="flex items-center space-x-2">
            <span>{label}</span>
            {tooltip && <InfoTooltip text={tooltip} />}
        </div>
        <span className={isDeduction ? 'text-red-600' : ''}>{isDeduction ? `-${value}` : value}</span>
    </div>
);

const ReliefInput: React.FC<{ name: keyof Reliefs, label: string, max: number, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }> = ({ name, label, max, value, onChange }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-neutral-700">{label}</label>
        <div className="relative mt-1">
            <input
                type="number"
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                placeholder="0"
                className="block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm pr-20"
                aria-label={label}
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span className="text-neutral-500 sm:text-sm">Max: {max.toLocaleString()}</span>
            </div>
        </div>
    </div>
);

export const SalaryCalculator: React.FC = () => {
    const [grossSalary, setGrossSalary] = useState('');
    const [reliefs, setReliefs] = useState({
        lifeInsurance: '',
        lifestyle: '',
        medicalParents: '',
        education: '',
    });

    const handleReliefChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setReliefs(prev => ({ ...prev, [name]: value }));
    };

    const calculation = useMemo(() => {
        const salary = parseFloat(grossSalary) || 0;
        
        const numericReliefs: Reliefs = {
            lifeInsurance: parseFloat(reliefs.lifeInsurance) || 0,
            lifestyle: parseFloat(reliefs.lifestyle) || 0,
            medicalParents: parseFloat(reliefs.medicalParents) || 0,
            education: parseFloat(reliefs.education) || 0,
        };

        const epf = getEpfContribution(salary);
        const socso = getSocsoContribution(salary);
        const eis = getEisContribution(salary);
        const pcb = getPcbContribution(salary, epf.employee, numericReliefs);

        const totalEmployeeDeductions = epf.employee + socso.employee + eis.employee + pcb;
        const netSalary = salary - totalEmployeeDeductions;
        const totalEmployerContributions = epf.employer + socso.employer + eis.employer;
        const totalCostToEmployer = salary + totalEmployerContributions;

        return { salary, epf, socso, eis, pcb, totalEmployeeDeductions, netSalary, totalEmployerContributions, totalCostToEmployer };

    }, [grossSalary, reliefs]);

    const formatCurrency = (value: number) => `RM ${value.toFixed(2)}`;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-6">
                 <Card className="p-6">
                    <h3 className="font-semibold text-lg mb-4">Enter Your Salary</h3>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="grossSalary" className="block text-sm font-medium text-neutral-700">Monthly Gross Salary (RM)</label>
                            <input
                                type="number"
                                id="grossSalary"
                                value={grossSalary}
                                onChange={(e) => setGrossSalary(e.target.value)}
                                placeholder="e.g., 5500"
                                className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                                aria-label="Monthly Gross Salary"
                            />
                        </div>
                    </div>
                </Card>
                <Card className="p-6">
                    <h3 className="font-semibold text-lg mb-4">Pelepasan Cukai (Tahunan)</h3>
                    <div className="space-y-4">
                        <ReliefInput name="lifeInsurance" label="Insurans Hayat & Takaful" max={3000} value={reliefs.lifeInsurance} onChange={handleReliefChange} />
                        <ReliefInput name="lifestyle" label="Gaya Hidup" max={2500} value={reliefs.lifestyle} onChange={handleReliefChange} />
                        <ReliefInput name="medicalParents" label="Perubatan Ibu Bapa" max={8000} value={reliefs.medicalParents} onChange={handleReliefChange} />
                        <ReliefInput name="education" label="Yuran Pendidikan (Diri)" max={7000} value={reliefs.education} onChange={handleReliefChange} />
                    </div>
                </Card>
                 <div className="text-xs text-neutral-500 p-3 bg-yellow-50 rounded-lg">
                    <p><strong>Disclaimer:</strong> This is an estimation tool based on rates for Malaysian citizens under 60. Always refer to official sources (LHDN, KWSP, PERKESO) for precise figures.</p>
                </div>
            </div>
            <div className="lg:col-span-2">
                <Card className="p-6">
                    <h3 className="font-semibold text-lg mb-4">Salary Breakdown</h3>
                    {calculation.salary > 0 ? (
                        <div className="space-y-6">
                            <div className="p-6 text-center bg-primary-50 rounded-lg">
                                <p className="text-lg font-medium text-primary-700">Net Salary (Take-home)</p>
                                <p className="text-4xl font-bold text-primary">{formatCurrency(calculation.netSalary)}</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                <div className="space-y-2">
                                    <h4 className="font-semibold">Earnings</h4>
                                    <ResultRow label="Gross Salary" value={formatCurrency(calculation.salary)} />
                                </div>
                                <div className="space-y-2">
                                    <h4 className="font-semibold">Employee Deductions</h4>
                                    <ResultRow 
                                        label="EPF" 
                                        value={formatCurrency(calculation.epf.employee)} 
                                        isDeduction 
                                        tooltip="Kumpulan Wang Simpanan Pekerja (KWSP). Contribution Rates (under 60): Employee 11%, Employer 13% (salary ≤ RM5k) or 12% (salary > RM5k). Your contribution is split into: Akaun Persaraan (75%), Akaun Sejahtera (15%), and Akaun Fleksibel (10%)." 
                                    />
                                    <div className="pl-6 border-l ml-2 space-y-1 text-sm text-neutral-600">
                                        <ResultRow label="Akaun Persaraan" value={formatCurrency(calculation.epf.akaun1)} />
                                        <ResultRow label="Akaun Sejahtera" value={formatCurrency(calculation.epf.akaun2)} />
                                        {/* FIX: Corrected typo from `formatcurrency` to `formatCurrency`. */}
                                        <ResultRow label="Akaun Fleksibel" value={formatCurrency(calculation.epf.akaun3)} />
                                    </div>
                                    <ResultRow 
                                        label="SOCSO" 
                                        value={formatCurrency(calculation.socso.employee)} 
                                        isDeduction
                                        tooltip="Pertubuhan Keselamatan Sosial (PERKESO): Provides social security protection for employment injury and invalidity."
                                    />
                                    <ResultRow 
                                        label="EIS" 
                                        value={formatCurrency(calculation.eis.employee)} 
                                        isDeduction
                                        tooltip="Sistem Insurans Pekerjaan (SIP): Provides financial support for workers who have lost their jobs."
                                    />
                                    <ResultRow 
                                        label="PCB (Income Tax)" 
                                        value={formatCurrency(calculation.pcb)} 
                                        isDeduction
                                        tooltip="Potongan Cukai Bulanan (PCB): Monthly tax deduction for income tax purposes."
                                    />
                                    <ResultRow label="Total Deductions" value={formatCurrency(calculation.totalEmployeeDeductions)} isDeduction className="font-bold border-t pt-2 mt-2" />
                                </div>
                            </div>
                             <div className="p-4 bg-neutral-100 rounded-lg text-sm space-y-2 mt-6">
                                <h4 className="font-semibold mb-2">Employer Contributions</h4>
                                <ResultRow label="EPF" value={formatCurrency(calculation.epf.employer)} tooltip="Employer's mandatory contribution to your retirement savings." />
                                <ResultRow label="SOCSO" value={formatCurrency(calculation.socso.employer)} tooltip="Employer's contribution to your social security protection." />
                                <ResultRow label="EIS" value={formatCurrency(calculation.eis.employer)} tooltip="Employer's contribution to your job loss insurance." />
                                <ResultRow label="Total Cost to Employer" value={formatCurrency(calculation.totalCostToEmployer)} className="font-bold border-t pt-2 mt-2" />
                            </div>
                        </div>
                    ) : (
                         <div className="text-center py-16 text-neutral-500">
                            <p>Enter your gross salary to see the breakdown.</p>
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
};