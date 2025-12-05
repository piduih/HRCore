import React, { useState, useMemo } from 'react';
import { useAppState, useAppActions } from '../../hooks/useAppContext';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Icon } from '../common/Icon';

const HealthCheckinForm: React.FC = () => {
    const { addHealthLog } = useAppActions();
    const [stressLevel, setStressLevel] = useState(5);
    const [workLifeBalance, setWorkLifeBalance] = useState(5);
    const [physicalActivityHours, setPhysicalActivityHours] = useState(0);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const today = new Date().toISOString().split('T')[0];
        addHealthLog({
            date: today,
            stressLevel,
            workLifeBalance,
            physicalActivityHours,
        });
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 3000); // Reset after 3 seconds
    };

    return (
        <Card className="p-6">
            <h3 className="font-semibold text-lg mb-4">Weekly Health Check-in</h3>
            {submitted ? (
                <div className="text-center py-10 text-green-600">
                    <Icon name="check" className="w-12 h-12 mx-auto mb-2" />
                    <p className="font-semibold">Your check-in has been logged. Thank you!</p>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-neutral-700">Stress Level (1=Low, 10=High)</label>
                        <div className="flex items-center space-x-2">
                            <input type="range" min="1" max="10" value={stressLevel} onChange={e => setStressLevel(Number(e.target.value))} className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer" />
                            <span className="font-bold text-primary w-8 text-center">{stressLevel}</span>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-neutral-700">Work-Life Balance (1=Poor, 10=Excellent)</label>
                         <div className="flex items-center space-x-2">
                            <input type="range" min="1" max="10" value={workLifeBalance} onChange={e => setWorkLifeBalance(Number(e.target.value))} className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer" />
                            <span className="font-bold text-primary w-8 text-center">{workLifeBalance}</span>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-neutral-700">Physical Activity this Week (Hours)</label>
                        <input type="number" value={physicalActivityHours} onChange={e => setPhysicalActivityHours(Number(e.target.value))} className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm" />
                    </div>
                    <Button type="submit" className="w-full">Log My Week</Button>
                </form>
            )}
        </Card>
    );
};

const WellnessHub: React.FC = () => {
    return (
        <Card className="p-6">
             <h3 className="font-semibold text-lg mb-4">Wellness Hub</h3>
             <div className="space-y-4">
                <div>
                    <h4 className="font-semibold">Resources</h4>
                    <ul className="list-disc list-inside text-primary text-sm space-y-1 mt-2">
                        <li><a href="#" className="hover:underline">Mental Health Support Program</a></li>
                        <li><a href="#" className="hover:underline">Ergonomics Guide for Your Workspace</a></li>
                    </ul>
                </div>
                 <div>
                    <h4 className="font-semibold">Upcoming Events</h4>
                     <p className="text-sm text-neutral-600 mt-2">No upcoming events scheduled.</p>
                </div>
             </div>
        </Card>
    );
};

const RecentLogs: React.FC = () => {
    const { currentUser, healthLogs } = useAppState();

    const myLogs = useMemo(() => {
        return healthLogs
            .filter(log => log.employeeId === currentUser.id)
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, 4);
    }, [healthLogs, currentUser.id]);

    return (
        <Card className="p-6">
            <h3 className="font-semibold text-lg mb-4">My Recent Check-ins</h3>
            {myLogs.length > 0 ? (
                <div className="space-y-3">
                    {myLogs.map(log => (
                        <div key={log.id} className="p-3 bg-neutral-50 rounded-md flex justify-between items-center">
                            <p className="font-semibold">{new Date(log.date).toLocaleDateString()}</p>
                            <div className="flex space-x-4 text-sm">
                                <span>Stress: <span className="font-bold">{log.stressLevel}/10</span></span>
                                <span>Balance: <span className="font-bold">{log.workLifeBalance}/10</span></span>
                                <span>Activity: <span className="font-bold">{log.physicalActivityHours}h</span></span>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-neutral-500 text-center py-8">No check-ins logged yet.</p>
            )}
        </Card>
    );
};


export const HealthAndWellness: React.FC = () => {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold">Health & Wellness</h2>
                <p className="text-neutral-500">Prioritize your well-being with our health tracking tools and resources.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 space-y-6">
                    <HealthCheckinForm />
                </div>
                <div className="lg:col-span-2 space-y-6">
                    <WellnessHub />
                    <RecentLogs />
                </div>
            </div>
        </div>
    );
};