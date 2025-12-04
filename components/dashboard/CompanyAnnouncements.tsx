import React, { useState } from 'react';
import { useAppState } from '../../hooks/useAppContext';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Icon } from '../common/Icon';
import { Modal } from '../common/Modal';
import { AnnouncementForm } from './AnnouncementForm';

export const CompanyAnnouncements: React.FC = () => {
    const { announcements, currentUser, employees } = useAppState();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const getAuthorName = (authorId: string) => {
        return employees.find(e => e.id === authorId)?.name || 'HR Department';
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    return (
        <Card className="p-6">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-lg">Company Announcements</h3>
                {currentUser.isManager && (
                    <Button onClick={() => setIsModalOpen(true)} size="sm">
                        <Icon name="plus" className="w-4 h-4 mr-2" />
                        Add Announcement
                    </Button>
                )}
            </div>
            
            <div className="space-y-4">
                {announcements.length > 0 ? (
                    announcements.slice(0, 3).map(announcement => (
                        <div key={announcement.id} className="p-4 bg-primary-50 rounded-lg">
                            <h4 className="font-bold text-primary-800">{announcement.title}</h4>
                            <p className="text-xs text-neutral-500 mb-2">
                                Posted by {getAuthorName(announcement.authorId)} on {formatDate(announcement.createdAt)}
                            </p>
                            <p className="text-sm text-neutral-700">{announcement.content}</p>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-8">
                        <p className="text-neutral-500">No company announcements at the moment.</p>
                    </div>
                )}
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Create New Announcement"
            >
                <AnnouncementForm onClose={() => setIsModalOpen(false)} />
            </Modal>
        </Card>
    );
};
