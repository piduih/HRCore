

import React, { useState, useMemo } from 'react';
import { useAppState, useAppActions } from '../../hooks/useAppContext';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Icon } from '../common/Icon';
import { Modal } from '../common/Modal';
import type { PerformanceGoal, PerformanceReview, Employee } from '../../types';
import { GoalStatus, ReviewStatus } from '../../types';
import { generateContent } from '../../services/geminiService';

const GoalStatusTag: React.FC<{ status: GoalStatus }> = ({ status }) => {
    const statusStyles: Record<GoalStatus, string> = {
        [GoalStatus.ON_TRACK]: 'bg-green-100 text-green-800',
        [GoalStatus.AT_RISK]: 'bg-yellow-100 text-yellow-800',
        [GoalStatus.OFF_TRACK]: 'bg-red-100 text-red-800',
        [GoalStatus.COMPLETED]: 'bg-blue-100 text-blue-800',
    };
    return <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${statusStyles[status]}`}>{status}</span>;
};

const GoalCard: React.FC<{ goal: PerformanceGoal }> = ({ goal }) => (
    <Card className="p-4 space-y-3">
        <div className="flex justify-between items-start">
            <h4 className="font-bold text-neutral-800">{goal.title}</h4>
            <GoalStatusTag status={goal.status} />
        </div>
        <p className="text-sm text-neutral-600">{goal.description}</p>
        <p className="text-sm font-medium text-neutral-500">Metric: <span className="text-neutral-700">{goal.metric}</span></p>
        <div>
            <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-neutral-700">Progress</span>
                <span className="text-sm font-medium text-primary">{goal.progress}%</span>
            </div>
            <div className="w-full bg-neutral-200 rounded-full h-2.5">
                <div className="bg-primary h-2.5 rounded-full" style={{ width: `${goal.progress}%` }}></div>
            </div>
        </div>
        <p className="text-xs text-neutral-500 text-right">Due: {goal.dueDate}</p>
    </Card>
);

const ReviewCard: React.FC<{ review: PerformanceReview }> = ({ review }) => {
    const { employees } = useAppState();
    const reviewerName = employees.find(e => e.id === review.reviewerId)?.name || 'Manager';

    return (
        <Card className="p-4">
            <div className="flex justify-between items-center mb-2">
                <h4 className="font-bold text-neutral-800">{review.reviewPeriod} Review</h4>
                <span className="text-xs text-neutral-500">{review.reviewDate}</span>
            </div>
             {review.rating && (
                <div className="flex items-center mb-2">
                    {[...Array(5)].map((_, i) => (
                        <Icon key={i} name="star" className={`w-5 h-5 ${i < review.rating! ? 'text-yellow-400' : 'text-neutral-300'}`} />
                    ))}
                </div>
            )}
            {review.selfAssessment && (
                <div className="mt-2">
                    <p className="text-sm font-semibold">Your Assessment:</p>
                    <p className="text-sm text-neutral-600 italic">"{review.selfAssessment}"</p>
                </div>
            )}
            {review.managerAssessment && (
                <div className="mt-2">
                    <p className="text-sm font-semibold">{reviewerName}'s Assessment:</p>
                    <p className="text-sm text-neutral-600 italic">"{review.managerAssessment}"</p>
                </div>
            )}
            {review.status !== ReviewStatus.COMPLETED && (
                <div className="mt-4 text-center p-2 bg-yellow-50 rounded-md">
                    <p className="text-sm font-semibold text-yellow-800">{review.status}</p>
                </div>
            )}
        </Card>
    );
};


export const PerformanceManagement: React.FC = () => {
    const { currentUser, employees, performanceGoals, performanceReviews } = useAppState();
    const { addPerformanceGoal } = useAppActions();
    const [activeTab, setActiveTab] = useState('my_performance');
    const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>(currentUser.id);
    const [isGoalModalOpen, setGoalModalOpen] = useState(false);
    const [isInsightsModalOpen, setInsightsModalOpen] = useState(false);
    const [insightsContent, setInsightsContent] = useState('');
    const [isInsightsLoading, setIsInsightsLoading] = useState(false);

    const teamMembers = useMemo(() => employees.filter(e => e.managerId === currentUser.id), [employees, currentUser.id]);
    
    const displayedEmployeeId = activeTab === 'my_performance' ? currentUser.id : selectedEmployeeId;

    const goalsForDisplay = useMemo(() => performanceGoals.filter(g => g.employeeId === displayedEmployeeId), [performanceGoals, displayedEmployeeId]);
    const reviewsForDisplay = useMemo(() => performanceReviews.filter(r => r.employeeId === displayedEmployeeId), [performanceReviews, displayedEmployeeId]);
    
    const handleSetGoal = (formData: Omit<PerformanceGoal, 'id' | 'tenantId' | 'employeeId' | 'progress' | 'status'>) => {
        addPerformanceGoal({
            ...formData,
            employeeId: selectedEmployeeId,
            progress: 0,
            status: GoalStatus.ON_TRACK,
        });
        setGoalModalOpen(false);
    }

    const handleGetAiInsights = async () => {
        if (reviewsForDisplay.length === 0) return;
        setInsightsModalOpen(true);
        setIsInsightsLoading(true);
        setInsightsContent('');

        const reviewsText = reviewsForDisplay.map(r => 
            `Review Period: ${r.reviewPeriod}\nSelf-Assessment: ${r.selfAssessment || 'N/A'}\nManager's Assessment: ${r.managerAssessment || 'N/A'}`
        ).join('\n\n');

        const prompt = `Analyze the following performance reviews for an employee. Identify recurring themes, strengths, and areas for improvement. Based on this, suggest 2-3 relevant training topics. Format the output with clear headings.\n\nReviews:\n${reviewsText}`;

        const result = await generateContent(prompt);
        setInsightsContent(result);
        setIsInsightsLoading(false);
    };
    
    const GoalForm: React.FC<{onClose: () => void, employeeName: string}> = ({ onClose, employeeName }) => {
        const [title, setTitle] = useState('');
        const [description, setDescription] = useState('');
        const [metric, setMetric] = useState('');
        const [dueDate, setDueDate] = useState('');

        const handleSubmit = (e: React.FormEvent) => {
            e.preventDefault();
            if(!title || !description || !metric || !dueDate) return;
            handleSetGoal({ title, description, metric, dueDate });
        };
        
        return (
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-neutral-700">Goal Title</label>
                    <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm" placeholder="e.g., Improve Frontend Performance"/>
                </div>
                <div>
                    <label className="block text-sm font-medium text-neutral-700">Description</label>
                    <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-neutral-700">Success Metric</label>
                    <input type="text" value={metric} onChange={e => setMetric(e.target.value)} className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm" placeholder="e.g., Achieve a Lighthouse score of 95+"/>
                </div>
                <div>
                    <label className="block text-sm font-medium text-neutral-700">Due Date</label>
                    <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm" />
                </div>
                <div className="flex justify-end space-x-2">
                    <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
                    <Button type="submit">Set Goal</Button>
                </div>
            </form>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold">Performance Management</h2>
                <p className="text-neutral-500">Track goals, conduct reviews, and foster growth.</p>
            </div>

            <Card>
                <div className="border-b border-neutral-200">
                    <nav className="-mb-px flex space-x-6 px-6">
                        <button onClick={() => setActiveTab('my_performance')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'my_performance' ? 'border-primary text-primary' : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'}`}>My Performance</button>
                        {currentUser.isManager && (
                            <button onClick={() => { setActiveTab('team_performance'); setSelectedEmployeeId(teamMembers[0]?.id || ''); }} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'team_performance' ? 'border-primary text-primary' : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'}`}>Team Performance</button>
                        )}
                    </nav>
                </div>

                {activeTab === 'team_performance' && currentUser.isManager && (
                    <div className="p-4 bg-neutral-50 border-b border-neutral-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="max-w-xs flex-grow">
                            <label htmlFor="team_member" className="block text-sm font-medium text-neutral-700">Select Team Member</label>
                            <select id="team_member" value={selectedEmployeeId} onChange={e => setSelectedEmployeeId(e.target.value)} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-neutral-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md">
                                {teamMembers.map(emp => <option key={emp.id} value={emp.id}>{emp.name}</option>)}
                            </select>
                        </div>
                         {selectedEmployeeId && (
                             <div className="flex items-center space-x-2 flex-shrink-0">
                                <Button variant="secondary" onClick={handleGetAiInsights} disabled={reviewsForDisplay.length === 0}>
                                    <Icon name="bot" className="w-4 h-4 mr-2" />
                                    Get AI Insights
                                </Button>
                                <Button onClick={() => setGoalModalOpen(true)}>
                                    <Icon name="plus" className="w-4 h-4 mr-2" />
                                    Set New Goal
                                </Button>
                            </div>
                        )}
                    </div>
                )}
                
                <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
                     <div className="space-y-4">
                        <h3 className="font-semibold text-lg">Active Goals</h3>
                        {goalsForDisplay.length > 0 ? goalsForDisplay.map(goal => (
                            <GoalCard key={goal.id} goal={goal} />
                        )) : <p className="text-neutral-500">No active goals.</p>}
                    </div>
                     <div className="space-y-4">
                        <h3 className="font-semibold text-lg">Review History</h3>
                        {reviewsForDisplay.length > 0 ? reviewsForDisplay.map(review => (
                            <ReviewCard key={review.id} review={review} />
                        )) : <p className="text-neutral-500">No review history.</p>}
                    </div>
                </div>
            </Card>
            
            <Modal isOpen={isGoalModalOpen} onClose={() => setGoalModalOpen(false)} title={`Set New Goal for ${employees.find(e => e.id === selectedEmployeeId)?.name}`}>
                <GoalForm onClose={() => setGoalModalOpen(false)} employeeName={employees.find(e => e.id === selectedEmployeeId)?.name || ''} />
            </Modal>
             <Modal isOpen={isInsightsModalOpen} onClose={() => setInsightsModalOpen(false)} title={`AI Insights for ${employees.find(e => e.id === selectedEmployeeId)?.name}`} size="lg">
                {isInsightsLoading ? (
                    <div className="text-center p-8">
                        <p>Analyzing reviews...</p>
                    </div>
                ) : (
                    <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: insightsContent.replace(/\n/g, '<br />') }} />
                )}
            </Modal>
        </div>
    );
};
