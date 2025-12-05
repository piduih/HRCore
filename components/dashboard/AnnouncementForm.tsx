import React, { useState } from 'react';
import { useAppActions } from '../../hooks/useAppContext';
import { Button } from '../common/Button';

interface AnnouncementFormProps {
    onClose: () => void;
}

export const AnnouncementForm: React.FC<AnnouncementFormProps> = ({ onClose }) => {
    const { addAnnouncement } = useAppActions();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !content.trim()) {
            setError('Both title and content are required.');
            return;
        }
        addAnnouncement({ title, content });
        onClose();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="title" className="block text-sm font-medium text-neutral-700">Title</label>
                <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                    placeholder="e.g., Upcoming Public Holiday"
                />
            </div>
            <div>
                <label htmlFor="content" className="block text-sm font-medium text-neutral-700">Content</label>
                <textarea
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={5}
                    className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                    placeholder="Write your announcement details here..."
                />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <div className="flex justify-end space-x-2">
                <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
                <Button type="submit">Publish Announcement</Button>
            </div>
        </form>
    );
};