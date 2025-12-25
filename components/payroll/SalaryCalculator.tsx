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
                    <h3 className="font-semibold text-lg mb-4">Masukkan Gaji Anda</h3>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="grossSalary" className="block text-sm font-medium text-neutral-700">Gaji Kasar Bulanan (Monthly Gross Salary)</label>
                            <input
                                type="number"
                                id="grossSalary"
                                value={grossSalary}
                                onChange={(e) => setGrossSalary(e.target.value)}
                                placeholder="cth: 5500"
                                className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                                aria-label="Monthly Gross Salary"
                            />
                        </div>
                    </div>
                </Card>
                <Card className="p-6">
                    <h3 className="font-semibold text-lg mb-4">Pelepasan Cukai (Tax Reliefs)</h3>
                    <p className="text-xs text-neutral-500 mb-4">Masukkan nilai tahunan untuk mengurangkan cukai PCB anda.</p>
                    <div className="space-y-4">
                        <ReliefInput name="lifeInsurance" label="Insurans Hayat & Takaful" max={3000} value={reliefs.lifeInsurance} onChange={handleReliefChange} />
                        <ReliefInput name="lifestyle" label="Gaya Hidup (Buku, Internet, Gajet)" max={2500} value={reliefs.lifestyle} onChange={handleReliefChange} />
                        <ReliefInput name="medicalParents" label="Perubatan Ibu Bapa" max={8000} value={reliefs.medicalParents} onChange={handleReliefChange} />
                        <ReliefInput name="education" label="Yuran Pendidikan (Diri Sendiri)" max={7000} value={reliefs.education} onChange={handleReliefChange} />
                    </div>
                </Card>
            </div>
            <div className="lg:col-span-2">
                <Card className="p-6">
                    <h3 className="font-semibold text-lg mb-4">Butiran Gaji (Salary Breakdown)</h3>
                    {calculation.salary > 0 ? (
                        <div className="space-y-6">
                            <div className="p-6 text-center bg-primary-50 rounded-lg border border-primary-100">
                                <p className="text-lg font-medium text-primary-700">Gaji Bersih (Net Salary)</p>
                                <p className="text-sm text-primary-600 mb-2">Duit yang masuk akaun bank anda</p>
                                <p className="text-4xl font-bold text-primary">{formatCurrency(calculation.netSalary)}</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                <div className="space-y-2">
                                    <h4 className="font-semibold">Pendapatan (Earnings)</h4>
                                    <ResultRow label="Gaji Kasar" value={formatCurrency(calculation.salary)} />
                                </div>
                                <div className="space-y-2">
                                    <h4 className="font-semibold">Potongan (Deductions)</h4>
                                    <ResultRow 
                                        label="KWSP (EPF)" 
                                        value={formatCurrency(calculation.epf.employee)} 
                                        isDeduction 
                                        tooltip="Simpanan hari tua anda. Wajib untuk persaraan." 
                                    />
                                    <div className="pl-6 border-l-2 border-neutral-100 ml-2 space-y-1 text-sm text-neutral-500">
                                        <ResultRow label="Akaun Persaraan (75%)" value={formatCurrency(calculation.epf.akaun1)} />
                                        <ResultRow label="Akaun Sejahtera (15%)" value={formatCurrency(calculation.epf.akaun2)} />
                                        <ResultRow label="Akaun Fleksibel (10%)" value={formatCurrency(calculation.epf.akaun3)} />
                                    </div>
                                    <ResultRow 
                                        label="PERKESO (SOCSO)" 
                                        value={formatCurrency(calculation.socso.employee)} 
                                        isDeduction
                                        tooltip="Insurans perlindungan jika anda kemalangan semasa kerja."
                                    />
                                    <ResultRow 
                                        label="SIP (EIS)" 
                                        value={formatCurrency(calculation.eis.employee)} 
                                        isDeduction
                                        tooltip="Bantuan kewangan sementara jika anda kehilangan pekerjaan."
                                    />
                                    <ResultRow 
                                        label="PCB (Tax)" 
                                        value={formatCurrency(calculation.pcb)} 
                                        isDeduction
                                        tooltip="Potongan Cukai Bulanan. Bayaran cukai pendapatan kepada LHDN."
                                    />
                                    <ResultRow label="Jumlah Potongan" value={formatCurrency(calculation.totalEmployeeDeductions)} isDeduction className="font-bold border-t pt-2 mt-2" />
                                </div>
                            </div>
                             <div className="p-4 bg-neutral-100 rounded-lg text-sm space-y-2 mt-6">
                                <h4 className="font-semibold mb-2">Sumbangan Majikan (Employer Pays For You)</h4>
                                <p className="text-xs text-neutral-500 mb-2">Majikan anda membayar amaun ini tambahan kepada gaji kasar anda.</p>
                                <ResultRow label="KWSP (EPF)" value={formatCurrency(calculation.epf.employer)} tooltip="Majikan tambah simpanan persaraan anda (biasanya 12-13%)." />
                                <ResultRow label="PERKESO (SOCSO)" value={formatCurrency(calculation.socso.employer)} tooltip="Majikan bayar untuk perlindungan keselamatan anda." />
                                <ResultRow label="SIP (EIS)" value={formatCurrency(calculation.eis.employer)} tooltip="Majikan bayar untuk insurans kehilangan kerja anda." />
                                <ResultRow label="Jumlah Kos Majikan" value={formatCurrency(calculation.totalCostToEmployer)} className="font-bold border-t border-neutral-300 pt-2 mt-2" />
                            </div>
                        </div>
                    ) : (
                         <div className="text-center py-16 text-neutral-500">
                            <p>Masukkan gaji kasar anda di sebelah kiri untuk lihat pengiraan.</p>
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
};