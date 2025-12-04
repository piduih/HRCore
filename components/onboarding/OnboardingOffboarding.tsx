


import React, { useState, useMemo } from 'react';
import { useAppState, useAppActions } from '../../hooks/useAppContext';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Icon } from '../common/Icon';
import type { OnboardingProcess, OnboardingTask } from '../../types';
import { OnboardingProcessType, OnboardingTaskStatus, OnboardingProcessStatus } from '../../types';

const getAssigneeColor = (assignee: OnboardingTask['assignee']) => {
    switch (assignee) {
        case 'HR': return 'bg-pink-100 text-pink-800';
        case 'IT': return 'bg-purple-100 text-purple-800';
        case 'Manager': return 'bg-indigo-100 text-indigo-800';
        case 'Employee': return 'bg-green-100 text-green-800';
        default: return 'bg-neutral-100 text-neutral-800';
    }
};

const TaskItem: React.FC<{ task: OnboardingTask, onStatusChange: (taskId: string, status: OnboardingTaskStatus) => void }> = ({ task, onStatusChange }) => {
    const isCompleted = task.status === OnboardingTaskStatus.COMPLETED;
    return (
        <div className="flex items-start space-x-3 p-3 bg-white rounded-md border">
            <input
                type="checkbox"
                checked={isCompleted}
                onChange={() => onStatusChange(task.id, isCompleted ? OnboardingTaskStatus.TODO : OnboardingTaskStatus.COMPLETED)}
                className="mt-1 h-4 w-4 rounded border-neutral-300 text-primary focus:ring-primary"
            />
            <div className="flex-1">
                <p className={`font-medium ${isCompleted ? 'line-through text-neutral-500' : 'text-neutral-800'}`}>{task.title}</p>
                <p className="text-sm text-neutral-600">{task.description}</p>
                 <div className="mt-2 flex items-center justify-between text-xs">
                    <span className={`px-2 py-0.5 rounded-full font-semibold ${getAssigneeColor(task.assignee)}`}>{task.assignee}</span>
                    <span className="text-neutral-500">Due: {task.dueDate}</span>
                </div>
            </div>
        </div>
    );
};


const ProcessCard: React.FC<{ process: OnboardingProcess }> = ({ process }) => {
    const { employees } = useAppState();
    const { updateOnboardingTaskStatus } = useAppActions();
    const [isExpanded, setIsExpanded] = useState(false);

    const employee = useMemo(() => employees.find(e => e.id === process.employeeId), [employees, process.employeeId]);

    const completedTasks = useMemo(() => process.tasks.filter(t => t.status === OnboardingTaskStatus.COMPLETED).length, [process.tasks]);
    const totalTasks = process.tasks.length;
    const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    if (!employee) return null;

    return (
        <Card>
            <div className="p-4 cursor-pointer hover:bg-neutral-50" onClick={() => setIsExpanded(!isExpanded)}>
                <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                        <img src={employee.avatarUrl} alt={employee.name} className="w-12 h-12 rounded-full" />
                        <div>
                            <h3 className="font-bold text-lg text-neutral-800">{employee.name}</h3>
                            <p className="text-sm text-neutral-500">{employee.position}</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${
                             process.status === OnboardingProcessStatus.COMPLETED ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                        }`}>{process.status}</span>
                        <Icon name={isExpanded ? 'chevron-down' : 'directory'} className="w-5 h-5 text-neutral-500 transform transition-transform" style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)'}}/>
                    </div>
                </div>
                 <div className="mt-4">
                    <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-neutral-700">Progress</span>
                        <span className="text-sm font-medium text-primary">{progress}%</span>
                    </div>
                    <div className="w-full bg-neutral-200 rounded-full h-2.5">
                        <div className="bg-primary h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
                    </div>
                </div>
            </div>
            {isExpanded && (
                <div className="p-4 bg-neutral-50 border-t">
                    <h4 className="font-semibold mb-3">Checklist</h4>
                    <div className="space-y-3">
                        {process.tasks.map(task => (
                            <TaskItem 
                                key={task.id} 
                                task={task} 
                                onStatusChange={(taskId, newStatus) => updateOnboardingTaskStatus(process.id, taskId, newStatus)} 
                            />
                        ))}
                    </div>
                </div>
            )}
        </Card>
    );
};

export const OnboardingOffboarding: React.FC = () => {
    const { currentUser, onboardingProcesses } = useAppState();
    const [activeTab, setActiveTab] = useState<OnboardingProcessType>(OnboardingProcessType.ONBOARDING);

    const filteredProcesses = useMemo(() => {
        return onboardingProcesses.filter(p => p.type === activeTab);
    }, [onboardingProcesses, activeTab]);

    if (!currentUser.isManager) {
        return (
            <div className="text-center p-8">
                <h2 className="text-2xl font-bold">Access Denied</h2>
                <p className="text-neutral-500 mt-2">This feature is available for managers only.</p>
            </div>
        );
    }
    
    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold">Onboarding & Offboarding</h2>
                    <p className="text-neutral-500">Manage employee transition checklists.</p>
                </div>
                <Button disabled>
                    <Icon name="plus" className="w-4 h-4 mr-2" />
                    New Process
                </Button>
            </div>

             <div className="border-b border-neutral-200">
                <nav className="-mb-px flex space-x-6">
                    <button onClick={() => setActiveTab(OnboardingProcessType.ONBOARDING)} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === OnboardingProcessType.ONBOARDING ? 'border-primary text-primary' : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'}`}>
                        Onboarding
                    </button>
                    <button onClick={() => setActiveTab(OnboardingProcessType.OFFBOARDING)} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === OnboardingProcessType.OFFBOARDING ? 'border-primary text-primary' : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'}`}>
                        Offboarding
                    </button>
                </nav>
            </div>
            
            <div className="space-y-4">
                {filteredProcesses.length > 0 ? (
                    filteredProcesses.map(process => (
                        <ProcessCard key={process.id} process={process} />
                    ))
                ) : (
                    <div className="text-center py-16 text-neutral-500">
                        <p>No active {activeTab.toLowerCase()} processes found.</p>
                    </div>
                )}
            </div>
        </div>
    );
};
