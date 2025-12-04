import React, { useState } from 'react';
import { useAppActions } from '../../hooks/useAppContext';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import { Icon } from '../common/Icon';
import { generateContent } from '../../services/geminiService';

const AiPromptModal: React.FC<{
    onGenerate: (content: string) => void,
    onClose: () => void
}> = ({ onGenerate, onClose }) => {
    const [prompt, setPrompt] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleGenerate = async () => {
        if (!prompt.trim()) return;
        setIsLoading(true);
        const fullPrompt = `Generate a professional and friendly company announcement for the following topic: "${prompt}". The announcement should be clear, concise, and ready to be posted.`;
        const result = await generateContent(fullPrompt);
        onGenerate(result);
        setIsLoading(false);
        onClose();
    };

    return (
        <Modal isOpen={true} onClose={onClose} title="Generate Announcement with AI">
            <div className="space-y-4">
                <div>
                    <label htmlFor="ai-prompt" className="block text-sm font-medium text-neutral-700">Describe the announcement</label>
                    <textarea
                        id="ai-prompt"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        rows={3}
                        className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                        placeholder="e.g., A company-wide potluck next Friday at 1 PM in the pantry."
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


interface AnnouncementFormProps {
    onClose: () => void;
}

export const AnnouncementForm: React.FC<AnnouncementFormProps> = ({ onClose }) => {
    const { addAnnouncement } = useAppActions();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [error, setError] = useState('');
    const [isAiModalOpen, setIsAiModalOpen] = useState(false);

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
        <>
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
                    <div className="flex justify-between items-center">
                        <label htmlFor="content" className="block text-sm font-medium text-neutral-700">Content</label>
                        <Button type="button" size="sm" variant="secondary" onClick={() => setIsAiModalOpen(true)}>
                            <Icon name="bot" className="w-4 h-4 mr-1" />
                            Generate with AI
                        </Button>
                    </div>
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
            {isAiModalOpen && (
                <AiPromptModal
                    onClose={() => setIsAiModalOpen(false)}
                    onGenerate={(generatedContent) => setContent(generatedContent)}
                />
            )}
        </>
    );
};
