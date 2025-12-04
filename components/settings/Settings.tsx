
import React, { useState } from 'react';
import { useAppState } from '../../hooks/useAppContext';
import { Card } from '../common/Card';
import { MyProfile } from './MyProfile';
import { CompanyProfileSettings } from './CompanyProfileSettings';
import { SystemSettings } from './SystemSettings';

export const Settings: React.FC = () => {
    const { currentUser } = useAppState();
    const [activeTab, setActiveTab] = useState('my_profile');

    const tabs = [
        { id: 'my_profile', label: 'My Profile' },
        ...(currentUser.isManager ? [{ id: 'company_profile', label: 'Company Profile' }] : []),
        { id: 'system', label: 'System' },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold">Settings</h2>
                <p className="text-neutral-500">Manage your personal, company, and system preferences.</p>
            </div>

            <Card>
                <div className="border-b border-neutral-200">
                    <nav className="-mb-px flex space-x-6 px-6 overflow-x-auto">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                                    activeTab === tab.id
                                        ? 'border-primary text-primary'
                                        : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </div>

                <div className="p-6">
                    {activeTab === 'my_profile' && <MyProfile />}
                    {activeTab === 'company_profile' && currentUser.isManager && <CompanyProfileSettings />}
                    {activeTab === 'system' && <SystemSettings />}
                </div>
            </Card>
        </div>
    );
};
