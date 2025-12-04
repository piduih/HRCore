
import React, { useState, useMemo } from 'react';
import { calculateRetirementProjection } from '../../services/payrollService';
import type { RetirementParams } from '../../services/payrollService';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Icon } from '../common/Icon';

interface SimulatorProps {
    setAiChatOpen: (isOpen: boolean) => void;
    setAiInitialPrompt: (prompt: string) => void;
}

const InputField: React.FC<{ name: keyof RetirementParams, label: string, value: string | number, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, type?: string, step?: string, placeholder?: string }> = 
    ({ name, label, value, onChange, type = 'number', step, placeholder }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-neutral-700">{label}</label>
        <input
            type={type}
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            step={step}
            className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
        />
    </div>
);


export const RetirementSimulator: React.FC<SimulatorProps> = ({ setAiChatOpen, setAiInitialPrompt }) => {
    const [params, setParams] = useState<RetirementParams>({
        currentAge: 30,
        retirementAge: 55,
        currentSalary: 5000,
        currentBalance: 50000,
        salaryIncrement: 3,
        annualDividend: 5,
    });
    const [showResults, setShowResults] = useState(false);

    const handleParamChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setParams(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
        setShowResults(false);
    };

    const projection = useMemo(() => {
        if (!showResults) return null;
        return calculateRetirementProjection(params);
    }, [params, showResults]);

    const handleAskAi = () => {
        setAiInitialPrompt("Based on my EPF retirement projection, what are some general strategies in Malaysia to increase my savings? Please explain options like voluntary contributions. (Do not give financial advice).");
        setAiChatOpen(true);
    };

    const formatCurrency = (value: number) => `RM ${value.toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-6">
                <Card className="p-6">
                     <h3 className="font-semibold text-lg mb-4">Simulation Parameters</h3>
                     <div className="space-y-4">
                        <InputField name="currentAge" label="Current Age" value={params.currentAge} onChange={handleParamChange} placeholder="e.g., 30" />
                        <InputField name="retirementAge" label="Target Retirement Age" value={params.retirementAge} onChange={handleParamChange} placeholder="e.g., 55" />
                        <InputField name="currentSalary" label="Current Gross Monthly Salary (RM)" value={params.currentSalary} onChange={handleParamChange} placeholder="e.g., 5000" />
                        <InputField name="currentBalance" label="Current EPF Balance (RM)" value={params.currentBalance} onChange={handleParamChange} placeholder="e.g., 50000" />
                        <InputField name="salaryIncrement" label="Annual Salary Increment (%)" value={params.salaryIncrement} onChange={handleParamChange} step="0.5" placeholder="e.g., 3" />
                        <InputField name="annualDividend" label="Assumed Annual Dividend (%)" value={params.annualDividend} onChange={handleParamChange} step="0.5" placeholder="e.g., 5" />
                     </div>
                     <Button onClick={() => setShowResults(true)} className="w-full mt-6">Calculate Projection</Button>
                </Card>
                 <div className="text-xs text-neutral-500 p-3 bg-yellow-50 rounded-lg">
                    <p><strong>Disclaimer:</strong> This is a simulation tool. The actual dividend rates and your salary progression may vary. This is not financial advice.</p>
                </div>
            </div>
             <div className="lg:col-span-2">
                <Card className="p-6">
                    <h3 className="font-semibold text-lg mb-4">Your Retirement Projection</h3>
                    {projection ? (
                        <div className="space-y-6">
                            <div className="p-6 text-center bg-green-50 rounded-lg">
                                <p className="text-lg font-medium text-green-700">Projected Savings at Age {params.retirementAge}</p>
                                <p className="text-4xl font-bold text-green-800">{formatCurrency(projection.finalBalance)}</p>
                            </div>
                            <div>
                                <h4 className="font-semibold mb-2">Growth Timeline</h4>
                                <ul className="space-y-2">
                                    {projection.timeline.map(item => (
                                        <li key={item.age} className="flex justify-between p-3 bg-neutral-50 rounded-md">
                                            <span className="font-medium">At Age {item.age}</span>
                                            <span className="font-semibold text-neutral-800">{formatCurrency(item.balance)}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="text-center pt-4">
                                <Button variant="secondary" onClick={handleAskAi}>
                                    <Icon name="bot" className="w-5 h-5 mr-2" />
                                    Ask AI for tips to improve savings
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-16 text-neutral-500">
                            <p>Fill in your details and click "Calculate Projection" to see your estimated retirement savings.</p>
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
};
