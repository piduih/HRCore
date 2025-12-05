import React, { useState } from 'react';
import { Card } from '../common/Card';
import { SalaryCalculator } from './SalaryCalculator';
import { RetirementSimulator } from './RetirementSimulator';
import { EisBenefitCalculator } from './EisBenefitCalculator';

type FinancialToolTab = 'salary' | 'retirement' | 'eis';

export const PayrollCalculator: React.FC = () => {
    const [activeTab, setActiveTab] = useState<FinancialToolTab>('salary');

    const tabs: { id: FinancialToolTab, label: string }[] = [
        { id: 'salary', label: 'Salary Calculator' },
        { id: 'retirement', label: 'Retirement Simulator' },
        { id: 'eis', label: 'EIS Benefit Calculator' },
    ];

    const renderContent = () => {
        switch(activeTab) {
            case 'salary':
                return <SalaryCalculator />;
            case 'retirement':
                return <RetirementSimulator />;
            case 'eis':
                return <EisBenefitCalculator />;
            default:
                return null;
        }
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold">Financial Tools</h2>
                <p className="text-neutral-500">Plan your finances with our set of calculators and simulators.</p>
            </div>
            
            <Card>
                <div className="border-b border-neutral-200">
                    <nav className="-mb-px flex space-x-6 px-6" aria-label="Tabs">
                        {tabs.map(tab => (
                             <button 
                                key={tab.id} 
                                onClick={() => setActiveTab(tab.id)} 
                                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === tab.id ? 'border-primary text-primary' : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'}`}
                                aria-current={activeTab === tab.id ? 'page' : undefined}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </div>
                <div className="p-6">
                    {renderContent()}
                </div>
            </Card>
        </div>
    );
};