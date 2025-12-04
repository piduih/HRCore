


import React, { useState, useMemo } from 'react';
import { useAppState, useAppActions } from '../../hooks/useAppContext';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Icon } from '../common/Icon';
import { Modal } from '../common/Modal';
import type { JobPosting, Candidate, CandidateStage } from '../../types';
import { CandidateStage as CandidateStageEnum } from '../../types';
import { generateContent } from '../../services/geminiService';

// --- Sub-components defined within the main file for simplicity ---

const JobPostingCard: React.FC<{ job: JobPosting, candidateCount: number, onSelect: () => void }> = ({ job, candidateCount, onSelect }) => (
    <Card className="p-6 cursor-pointer hover:shadow-lg hover:border-primary transition-all">
        <div onClick={onSelect}>
            <h3 className="text-lg font-bold text-primary">{job.title}</h3>
            <p className="text-sm text-neutral-600">{job.department}</p>
            <p className="text-sm text-neutral-500 mt-2">{job.description}</p>
        </div>
        <div className="mt-4 pt-4 border-t flex justify-between items-center">
            <span className="text-sm font-semibold">{candidateCount} Candidates</span>
            <Button size="sm" onClick={onSelect}>View Pipeline</Button>
        </div>
    </Card>
);

const CandidateCard: React.FC<{ candidate: Candidate, onMove: (stage: CandidateStage) => void, onSummarize: () => void }> = ({ candidate, onMove, onSummarize }) => {
    // This is a simplified move logic. A real app would have more complex state transitions.
    const nextStage = () => {
        switch(candidate.stage) {
            case CandidateStageEnum.APPLIED: return CandidateStageEnum.SCREENING;
            case CandidateStageEnum.SCREENING: return CandidateStageEnum.INTERVIEW;
            case CandidateStageEnum.INTERVIEW: return CandidateStageEnum.OFFER;
            case CandidateStageEnum.OFFER: return CandidateStageEnum.HIRED;
            default: return null;
        }
    }
    
    return (
        <div className="p-3 bg-white rounded-md shadow-sm border border-neutral-200 space-y-2">
            <p className="font-semibold text-neutral-800">{candidate.name}</p>
            <p className="text-xs text-neutral-500 truncate">{candidate.email}</p>
            <div className="pt-2 border-t flex justify-end space-x-2">
                <Button size="sm" variant="secondary" onClick={onSummarize} title="Summarize with AI" disabled={!candidate.resumeText}>
                    <Icon name="bot" className="w-4 h-4"/>
                </Button>
                 <Button size="sm" variant="secondary" onClick={() => onMove(CandidateStageEnum.REJECTED)}>Reject</Button>
                 {nextStage() && <Button size="sm" onClick={() => onMove(nextStage()!)}>Move</Button>}
            </div>
        </div>
    );
};

const AddCandidateForm: React.FC<{ jobId: string, onClose: () => void }> = ({ jobId, onClose }) => {
    const { addCandidate } = useAppActions();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(!name || !email) return;
        addCandidate({ jobPostingId: jobId, name, email, phone, resumeUrl: '' });
        onClose();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-neutral-700">Full Name</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm" required />
            </div>
             <div>
                <label className="block text-sm font-medium text-neutral-700">Email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm" required />
            </div>
             <div>
                <label className="block text-sm font-medium text-neutral-700">Phone</label>
                <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm" />
            </div>
            <div className="flex justify-end space-x-2">
                <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
                <Button type="submit">Add Candidate</Button>
            </div>
        </form>
    );
};

const AiPromptModal: React.FC<{
    onGenerate: (content: string) => void,
    onClose: () => void
}> = ({ onGenerate, onClose }) => {
    const [prompt, setPrompt] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleGenerate = async () => {
        if (!prompt.trim()) return;
        setIsLoading(true);
        const fullPrompt = `Generate a professional and detailed job description for the following role: "${prompt}". The description should be suitable for a job posting. Include sections for "Responsibilities", "Qualifications", and "Benefits".`;
        const result = await generateContent(fullPrompt);
        onGenerate(result);
        setIsLoading(false);
        onClose();
    };

    return (
        <Modal isOpen={true} onClose={onClose} title="Generate Job Description with AI">
            <div className="space-y-4">
                <div>
                    <label htmlFor="ai-prompt" className="block text-sm font-medium text-neutral-700">Describe the role</label>
                    <textarea
                        id="ai-prompt"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        rows={3}
                        className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                        placeholder="e.g., A senior frontend engineer proficient in React and TypeScript."
                    />
                </div>
                <div className="flex justify-end space-x-2">
                    <Button variant="secondary" onClick={onClose} disabled={isLoading}>Cancel</Button>
                    <Button onClick={handleGenerate} disabled={isLoading}>
                        {isLoading ? 'Generating...' : 'Generate'}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};


const AddJobPostingForm: React.FC<{ onClose: () => void; }> = ({ onClose }) => {
    const { addJobPosting } = useAppActions();
    const [title, setTitle] = useState('');
    const [department, setDepartment] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');
    const [isAiModalOpen, setIsAiModalOpen] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !department.trim() || !description.trim()) {
            setError('All fields are required.');
            return;
        }
        addJobPosting({ title, department, description });
        onClose();
    };

    return (
        <>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-neutral-700">Job Title</label>
                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                            placeholder="e.g., Senior Frontend Engineer"
                        />
                    </div>
                     <div>
                        <label htmlFor="department" className="block text-sm font-medium text-neutral-700">Department</label>
                        <input
                            type="text"
                            id="department"
                            value={department}
                            onChange={(e) => setDepartment(e.target.value)}
                            className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                            placeholder="e.g., Technology"
                        />
                    </div>
                </div>
                <div>
                    <div className="flex justify-between items-center mb-1">
                        <label htmlFor="description" className="block text-sm font-medium text-neutral-700">Job Description</label>
                        <Button type="button" size="sm" variant="secondary" onClick={() => setIsAiModalOpen(true)}>
                            <Icon name="bot" className="w-4 h-4 mr-1" />
                            Generate with AI
                        </Button>
                    </div>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={10}
                        className="block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                        placeholder="Describe the role, responsibilities, and qualifications..."
                    />
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <div className="flex justify-end space-x-2 pt-4">
                    <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
                    <Button type="submit">Create Job Posting</Button>
                </div>
            </form>
            {isAiModalOpen && (
                <AiPromptModal
                    onClose={() => setIsAiModalOpen(false)}
                    onGenerate={(generatedContent) => setDescription(generatedContent)}
                />
            )}
        </>
    );
};

// --- Main Recruitment Component ---

export const RecruitmentManagement: React.FC = () => {
    const { currentUser, jobPostings, candidates } = useAppState();
    const { updateCandidateStage } = useAppActions();
    const [view, setView] = useState<'list' | 'kanban'>('list');
    const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
    const [isAddCandidateModalOpen, setAddCandidateModalOpen] = useState(false);
    const [isAddJobModalOpen, setAddJobModalOpen] = useState(false);
    const [isSummaryModalOpen, setSummaryModalOpen] = useState(false);
    const [summaryContent, setSummaryContent] = useState('');
    const [isSummaryLoading, setIsSummaryLoading] = useState(false);
    const [candidateForSummary, setCandidateForSummary] = useState<Candidate | null>(null);

    const openJobs = useMemo(() => jobPostings.filter(j => j.status === 'Open'), [jobPostings]);
    const selectedJob = useMemo(() => jobPostings.find(j => j.id === selectedJobId), [jobPostings, selectedJobId]);

    const candidatesForJob = useMemo(() => {
        if (!selectedJobId) return [];
        return candidates.filter(c => c.jobPostingId === selectedJobId);
    }, [candidates, selectedJobId]);
    
    const handleSelectJob = (jobId: string) => {
        setSelectedJobId(jobId);
        setView('kanban');
    };

    const handleBackToList = () => {
        setSelectedJobId(null);
        setView('list');
    };
    
    const handleMoveCandidate = (candidateId: string, newStage: CandidateStage) => {
        updateCandidateStage(candidateId, newStage);
    };

    const handleSummarize = async (candidate: Candidate) => {
        if (!candidate.resumeText) return;
        setCandidateForSummary(candidate);
        setSummaryModalOpen(true);
        setIsSummaryLoading(true);
        setSummaryContent('');

        const prompt = `Summarize the key skills, years of experience, and past job titles from the following resume text. Format the output with clear headings using markdown:\n\n---\n\n${candidate.resumeText}`;
        const result = await generateContent(prompt);
        setSummaryContent(result);
        setIsSummaryLoading(false);
    };


    const STAGES_ORDER: CandidateStage[] = [
        CandidateStageEnum.APPLIED,
        CandidateStageEnum.SCREENING,
        CandidateStageEnum.INTERVIEW,
        CandidateStageEnum.OFFER,
        CandidateStageEnum.HIRED,
    ];

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
            {view === 'list' && (
                <>
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="text-2xl font-bold">Recruitment Pipeline</h2>
                            <p className="text-neutral-500">Manage job postings and track candidates.</p>
                        </div>
                        <Button onClick={() => setAddJobModalOpen(true)}>
                            <Icon name="plus" className="w-4 h-4 mr-2" />
                            New Job Posting
                        </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {openJobs.map(job => (
                            <JobPostingCard 
                                key={job.id} 
                                job={job} 
                                candidateCount={candidates.filter(c => c.jobPostingId === job.id).length}
                                onSelect={() => handleSelectJob(job.id)}
                            />
                        ))}
                    </div>
                </>
            )}

            {view === 'kanban' && selectedJob && (
                <>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                        <div>
                            <Button variant="secondary" size="sm" onClick={handleBackToList}>&larr; Back to Jobs</Button>
                            <h2 className="text-2xl font-bold mt-2">{selectedJob.title} Pipeline</h2>
                            <p className="text-neutral-500">{selectedJob.department}</p>
                        </div>
                        <Button onClick={() => setAddCandidateModalOpen(true)}>
                            <Icon name="plus" className="w-4 h-4 mr-2" />
                            Add Candidate
                        </Button>
                    </div>
                    <div className="w-full overflow-x-auto pb-4">
                        <div className="flex space-x-4 min-w-max">
                            {STAGES_ORDER.map(stage => (
                                <div key={stage} className="w-72 bg-neutral-100 rounded-lg p-3 flex-shrink-0">
                                    <h3 className="font-semibold mb-3 px-1">{stage} ({candidatesForJob.filter(c => c.stage === stage).length})</h3>
                                    <div className="space-y-3 h-full overflow-y-auto">
                                        {candidatesForJob.filter(c => c.stage === stage).map(candidate => (
                                            <CandidateCard 
                                                key={candidate.id} 
                                                candidate={candidate} 
                                                onMove={(newStage) => handleMoveCandidate(candidate.id, newStage)} 
                                                onSummarize={() => handleSummarize(candidate)}
                                            />
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            )}

            {isAddCandidateModalOpen && selectedJobId && (
                <Modal isOpen={isAddCandidateModalOpen} onClose={() => setAddCandidateModalOpen(false)} title="Add New Candidate">
                    <AddCandidateForm jobId={selectedJobId} onClose={() => setAddCandidateModalOpen(false)} />
                </Modal>
            )}

            <Modal isOpen={isAddJobModalOpen} onClose={() => setAddJobModalOpen(false)} title="Create New Job Posting" size="lg">
                <AddJobPostingForm onClose={() => setAddJobModalOpen(false)} />
            </Modal>

            <Modal isOpen={isSummaryModalOpen} onClose={() => setSummaryModalOpen(false)} title={`AI Summary for ${candidateForSummary?.name}`} size="lg">
                {isSummaryLoading ? (
                    <div className="text-center p-8">
                        <p>Generating summary...</p>
                    </div>
                ) : (
                    <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: summaryContent.replace(/\n/g, '<br />') }} />
                )}
            </Modal>
        </div>
    );
};