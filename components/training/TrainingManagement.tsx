

import React, { useState, useMemo } from 'react';
import { useAppState, useAppActions } from '../../hooks/useAppContext';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Icon } from '../common/Icon';
import { Modal } from '../common/Modal';
import { Tag } from '../common/Tag';
import type { TrainingCourse, TrainingRequest, TrainingStatus } from '../../types';
import { TrainingStatus as TrainingStatusEnum } from '../../types';

const CourseCard: React.FC<{ course: TrainingCourse, onApply: () => void }> = ({ course, onApply }) => (
    <Card className="flex flex-col p-6">
        <div className="flex-grow">
            {course.isHrdcClaimable && (
                <p className="text-xs font-bold text-green-600 bg-green-100 inline-block px-2 py-0.5 rounded-full mb-2">HRD Corp Claimable</p>
            )}
            <h3 className="text-lg font-bold text-neutral-900">{course.title}</h3>
            <p className="text-sm font-medium text-primary">{course.provider}</p>
            <p className="text-sm text-neutral-600 my-3">{course.description}</p>
        </div>
        <div className="flex justify-between items-center mt-4 pt-4 border-t border-neutral-200">
            <div>
                <p className="text-sm text-neutral-500">Cost: <span className="font-semibold text-neutral-800">RM {course.cost}</span></p>
                <p className="text-sm text-neutral-500">Duration: <span className="font-semibold text-neutral-800">{course.duration}</span></p>
            </div>
            <Button size="sm" onClick={onApply}>Apply Now</Button>
        </div>
    </Card>
);

const TrainingRequestModal: React.FC<{ course: TrainingCourse, onClose: () => void }> = ({ course, onClose }) => {
    const { addTrainingRequest } = useAppActions();
    const [reason, setReason] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!reason.trim()) return;
        addTrainingRequest({
            courseId: course.id,
            status: TrainingStatusEnum.PENDING,
            reason,
        });
        onClose();
    };

    return (
        <Modal isOpen={true} onClose={onClose} title={`Apply for: ${course.title}`}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <p className="text-sm text-neutral-600 mb-2">Please provide a reason for attending this course. This will be sent to your manager for approval.</p>
                    <label htmlFor="reason" className="block text-sm font-medium text-neutral-700">Justification</label>
                    <textarea 
                        id="reason" 
                        value={reason} 
                        onChange={e => setReason(e.target.value)} 
                        rows={4}
                        className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                        required
                    />
                </div>
                 <div className="flex justify-end space-x-2">
                    <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
                    <Button type="submit">Submit Application</Button>
                </div>
            </form>
        </Modal>
    );
};

const TrainingTable: React.FC<{ requests: TrainingRequest[], isManagerView?: boolean }> = ({ requests, isManagerView }) => {
    const { employees, trainingCourses, currentUser } = useAppState();
    const { updateTrainingRequestStatus } = useAppActions();
    const getEmployeeName = (id: string) => employees.find(e => e.id === id)?.name || 'Unknown';
    const getCourseTitle = (id: string) => trainingCourses.find(c => c.id === id)?.title || 'Unknown Course';

    const handleAction = (id: string, status: TrainingStatus) => {
        if(window.confirm(`Are you sure you want to ${status.toLowerCase()} this request?`)) {
            updateTrainingRequestStatus(id, status);
        }
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-neutral-500">
                <thead className="text-xs text-neutral-700 uppercase bg-neutral-50">
                    <tr>
                        {isManagerView && <th scope="col" className="px-6 py-3">Employee</th>}
                        <th scope="col" className="px-6 py-3">Course</th>
                        <th scope="col" className="px-6 py-3">Request Date</th>
                        <th scope="col" className="px-6 py-3">Status</th>
                        {isManagerView && <th scope="col" className="px-6 py-3">Action</th>}
                    </tr>
                </thead>
                <tbody>
                    {requests.map(req => (
                        <tr key={req.id} className="bg-white border-b hover:bg-neutral-50">
                            {isManagerView && <td className="px-6 py-4 font-medium text-neutral-900">{getEmployeeName(req.employeeId)}</td>}
                            <td className="px-6 py-4 font-medium text-neutral-900">{getCourseTitle(req.courseId)}</td>
                            <td className="px-6 py-4">{req.requestDate}</td>
                            <td className="px-6 py-4"><Tag status={req.status} /></td>
                            {isManagerView && currentUser.isManager && req.status === TrainingStatusEnum.PENDING && (
                                <td className="px-6 py-4 flex space-x-2">
                                    <Button size="sm" onClick={() => handleAction(req.id, TrainingStatusEnum.APPROVED)}>Approve</Button>
                                    <Button size="sm" variant="danger" onClick={() => handleAction(req.id, TrainingStatusEnum.REJECTED)}>Reject</Button>
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};


export const TrainingManagement: React.FC = () => {
    const { currentUser, trainingCourses, trainingRequests, employees } = useAppState();
    const [activeTab, setActiveTab] = useState('catalog');
    const [selectedCourse, setSelectedCourse] = useState<TrainingCourse | null>(null);

    const tabs = [
        { id: 'catalog', label: 'Course Catalog' },
        { id: 'my_training', label: 'My Training' },
        ...(currentUser.isManager ? [{ id: 'team_requests', label: 'Team Requests' }] : []),
    ];

    const myRequests = useMemo(() => trainingRequests
        .filter(r => r.employeeId === currentUser.id)
        .sort((a,b) => new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime()), 
        [trainingRequests, currentUser.id]
    );

    const teamRequests = useMemo(() => {
        if (!currentUser.isManager) return [];
        const teamMemberIds = employees.filter(e => e.managerId === currentUser.id).map(e => e.id);
        return trainingRequests
            .filter(r => teamMemberIds.includes(r.employeeId))
            .sort((a,b) => new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime());
    }, [trainingRequests, employees, currentUser.id, currentUser.isManager]);

    const renderContent = () => {
        switch (activeTab) {
            case 'catalog':
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {trainingCourses.map(course => (
                            <CourseCard key={course.id} course={course} onApply={() => setSelectedCourse(course)} />
                        ))}
                    </div>
                );
            case 'my_training':
                return <Card><TrainingTable requests={myRequests} /></Card>;
            case 'team_requests':
                return <Card><TrainingTable requests={teamRequests} isManagerView /></Card>;
            default:
                return null;
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold">Training & Development</h2>
                <p className="text-neutral-500">Browse courses, track your learning, and manage team development.</p>
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

            {selectedCourse && (
                <TrainingRequestModal course={selectedCourse} onClose={() => setSelectedCourse(null)} />
            )}
        </div>
    );
};
