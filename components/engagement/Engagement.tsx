

import React, { useState, useMemo } from 'react';
import { useAppState, useAppActions } from '../../hooks/useAppContext';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import { Icon } from '../common/Icon';
import type { Survey, SurveyResponse, SurveyAnswer, SurveyQuestion } from '../../types';
import { SurveyStatus, SurveyQuestionType } from '../../types';


// --- Sub-components defined in-file for simplicity ---

const SurveyCard: React.FC<{ 
    survey: Survey;
    hasTaken: boolean;
    onTake: () => void;
    onViewResults: () => void;
    isManager: boolean;
}> = ({ survey, hasTaken, onTake, onViewResults, isManager }) => {
    const statusColors: Record<SurveyStatus, string> = {
        [SurveyStatus.ACTIVE]: 'border-green-500',
        [SurveyStatus.CLOSED]: 'border-neutral-300',
        [SurveyStatus.DRAFT]: 'border-yellow-500',
    };

    return (
        <Card className={`p-6 border-l-4 ${statusColors[survey.status]}`}>
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-lg font-bold text-neutral-800">{survey.title}</h3>
                    <p className="text-sm text-neutral-500">Created on: {new Date(survey.createdAt).toLocaleDateString()}</p>
                </div>
                <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${
                    survey.status === SurveyStatus.ACTIVE ? 'bg-green-100 text-green-800' : 'bg-neutral-100 text-neutral-800'
                }`}>{survey.status}</span>
            </div>
            <p className="text-sm text-neutral-600 my-3">{survey.description}</p>
            <div className="flex justify-end">
                {isManager && <Button variant="secondary" onClick={onViewResults}>View Results</Button>}
                {!isManager && survey.status === SurveyStatus.ACTIVE && (
                    hasTaken ? (
                        <div className="flex items-center text-green-600 font-semibold">
                            <Icon name="check" className="w-5 h-5 mr-2" />
                            Completed
                        </div>
                    ) : (
                        <Button onClick={onTake}>Take Survey</Button>
                    )
                )}
            </div>
        </Card>
    );
};

const TakeSurveyModal: React.FC<{ survey: Survey, onClose: () => void }> = ({ survey, onClose }) => {
    const { submitSurveyResponse } = useAppActions();
    const [answers, setAnswers] = useState<SurveyAnswer[]>([]);

    const handleAnswerChange = (questionId: string, value: string | number) => {
        setAnswers(prev => {
            const existingAnswerIndex = prev.findIndex(a => a.questionId === questionId);
            if (existingAnswerIndex > -1) {
                const newAnswers = [...prev];
                newAnswers[existingAnswerIndex] = { questionId, value };
                return newAnswers;
            }
            return [...prev, { questionId, value }];
        });
    };
    
    const handleSubmit = () => {
        if(answers.length < survey.questions.length) {
            alert('Please answer all questions.');
            return;
        }
        submitSurveyResponse(survey.id, answers);
        onClose();
    };

    return (
        <Modal isOpen={true} onClose={onClose} title={survey.title}>
            <div className="space-y-6">
                {survey.questions.map(q => (
                    <div key={q.id}>
                        <p className="font-medium text-neutral-800">{q.text}</p>
                        {q.type === SurveyQuestionType.RATING && (
                            <div className="flex space-x-2 mt-2">
                                {[1,2,3,4,5].map(rating => (
                                    <button 
                                        key={rating}
                                        onClick={() => handleAnswerChange(q.id, rating)}
                                        className={`w-10 h-10 rounded-full border-2 transition-colors ${answers.find(a => a.questionId === q.id)?.value === rating ? 'bg-primary border-primary text-white' : 'border-neutral-300 hover:border-primary'}`}
                                    >{rating}</button>
                                ))}
                            </div>
                        )}
                        {q.type === SurveyQuestionType.TEXT && (
                            <textarea
                                onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                                rows={3}
                                className="mt-2 block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                            />
                        )}
                    </div>
                ))}
                <div className="flex justify-end space-x-2">
                    <Button variant="secondary" onClick={onClose}>Cancel</Button>
                    <Button onClick={handleSubmit}>Submit</Button>
                </div>
            </div>
        </Modal>
    );
};

const ViewResultsModal: React.FC<{ survey: Survey, responses: SurveyResponse[], onClose: () => void }> = ({ survey, responses, onClose }) => {

    const results = useMemo(() => {
        return survey.questions.map(question => {
            const questionResponses = responses.map(res => res.answers.find(ans => ans.questionId === question.id)).filter(Boolean);
            if (question.type === SurveyQuestionType.RATING) {
                const ratings = questionResponses.map(r => r!.value as number);
                const average = ratings.length > 0 ? (ratings.reduce((a,b) => a + b, 0) / ratings.length).toFixed(1) : 'N/A';
                return { question, type: 'rating', average, count: ratings.length };
            } else {
                const textAnswers = questionResponses.map(r => r!.value as string);
                return { question, type: 'text', answers: textAnswers, count: textAnswers.length };
            }
        });
    }, [survey, responses]);

    return (
         <Modal isOpen={true} onClose={onClose} title={`Results: ${survey.title}`} size="lg">
            <p className="mb-4 text-neutral-600">{responses.length} response(s) received.</p>
            <div className="space-y-6">
                {results.map(result => (
                    <div key={result.question.id}>
                        <h4 className="font-semibold text-neutral-800">{result.question.text}</h4>
                        {result.type === 'rating' && (
                             <div className="flex items-center space-x-4 mt-2">
                                <p className="text-3xl font-bold text-primary">{result.average}</p>
                                <p className="text-neutral-500">Average Rating</p>
                            </div>
                        )}
                        {result.type === 'text' && (
                            <div className="mt-2 space-y-2 max-h-48 overflow-y-auto">
                                {result.answers.length > 0 ? result.answers.map((ans, i) => (
                                    <p key={i} className="text-sm italic p-2 bg-neutral-100 rounded-md">"{ans}"</p>
                                )) : <p className="text-sm text-neutral-500">No text responses yet.</p>}
                            </div>
                        )}
                    </div>
                ))}
                 <div className="flex justify-end pt-4">
                    <Button variant="secondary" onClick={onClose}>Close</Button>
                </div>
            </div>
        </Modal>
    );
};


// --- Main Component ---

export const Engagement: React.FC = () => {
    const { currentUser, surveys, surveyResponses } = useAppState();
    const [activeTab, setActiveTab] = useState(currentUser.isManager ? 'manage' : 'active');
    const [surveyToTake, setSurveyToTake] = useState<Survey | null>(null);
    const [surveyToViewResults, setSurveyToViewResults] = useState<Survey | null>(null);
    
    const myResponses = useMemo(() => surveyResponses.filter(r => r.employeeId === currentUser.id), [surveyResponses, currentUser.id]);
    const activeSurveys = useMemo(() => surveys.filter(s => s.status === SurveyStatus.ACTIVE), [surveys]);

    const tabs = currentUser.isManager 
        ? [{ id: 'manage', label: 'Manage Surveys' }, { id: 'active', label: 'View Active Surveys' }]
        : [{ id: 'active', label: 'Available Surveys' }, { id: 'completed', label: 'My Completed Surveys' }];

    const renderContent = () => {
        if (activeTab === 'active') {
            return activeSurveys.length > 0 ? (
                <div className="space-y-4">
                {activeSurveys.map(s => (
                    <SurveyCard
                        key={s.id}
                        survey={s}
                        hasTaken={myResponses.some(r => r.surveyId === s.id)}
                        onTake={() => setSurveyToTake(s)}
                        onViewResults={() => setSurveyToViewResults(s)}
                        isManager={currentUser.isManager}
                    />
                ))}
                </div>
            ) : <p className="text-neutral-500 text-center py-8">No active surveys at the moment.</p>;
        }
        if (activeTab === 'completed') {
             const completedSurveys = surveys.filter(s => myResponses.some(r => r.surveyId === s.id));
             return completedSurveys.length > 0 ? (
                <div className="space-y-4">
                    {completedSurveys.map(s => <SurveyCard key={s.id} survey={s} hasTaken={true} onTake={()=>{}} onViewResults={()=>{}} isManager={false} />)}
                </div>
             ) : <p className="text-neutral-500 text-center py-8">You have not completed any surveys yet.</p>
        }
        if(activeTab === 'manage') {
             return surveys.length > 0 ? (
                <div className="space-y-4">
                {surveys.map(s => (
                    <SurveyCard
                        key={s.id}
                        survey={s}
                        hasTaken={false}
                        onTake={() => {}}
                        onViewResults={() => setSurveyToViewResults(s)}
                        isManager={true}
                    />
                ))}
                </div>
            ) : <p className="text-neutral-500 text-center py-8">No surveys have been created yet.</p>;
        }
        return null;
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold">Employee Engagement</h2>
                    <p className="text-neutral-500">Gather feedback and measure team satisfaction.</p>
                </div>
                {currentUser.isManager && <Button disabled>Create New Survey</Button>}
            </div>

            <div className="border-b border-neutral-200">
                <nav className="-mb-px flex space-x-6">
                    {tabs.map(tab => (
                        <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === tab.id ? 'border-primary text-primary' : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'}`}>
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </div>
            
            <div>
                {renderContent()}
            </div>
            
            {surveyToTake && <TakeSurveyModal survey={surveyToTake} onClose={() => setSurveyToTake(null)} />}
            {surveyToViewResults && <ViewResultsModal survey={surveyToViewResults} responses={surveyResponses.filter(r => r.surveyId === surveyToViewResults.id)} onClose={() => setSurveyToViewResults(null)} />}

        </div>
    );
};
