import React, { useState, useMemo } from 'react';
import { useAppState, useAppActions } from '../../hooks/useAppContext';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Icon } from '../common/Icon';
import { Modal } from '../common/Modal';
import type { JobPosting, Candidate, CandidateStage } from '../../types';
import { CandidateStage as CandidateStageEnum } from '../../types';

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

const CandidateCard: React.FC<{ candidate: Candidate, onMove: (stage: CandidateStage) => void }> = ({ candidate, onMove }) => {
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

const AddJobPostingForm: React.FC<{ onClose: () => void; }> = ({ onClose }) => {
    const { addJobPosting } = useAppActions();
    const [title, setTitle] = useState('');
    const [department, setDepartment] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');

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
                <label htmlFor="description" className="block text-sm font-medium text-neutral-700">Job Description</label>
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
        </div>
    );
};