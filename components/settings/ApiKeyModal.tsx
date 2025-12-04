
import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Icon } from '../common/Icon';

interface ApiKeyModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onClose }) => {
    const [keys, setKeys] = useState({
        gemini: '',
        openai: '',
        anthropic: ''
    });

    useEffect(() => {
        if (isOpen) {
            setKeys({
                gemini: localStorage.getItem('HR_CORE_GEMINI_KEY') || '',
                openai: localStorage.getItem('HR_CORE_OPENAI_KEY') || '',
                anthropic: localStorage.getItem('HR_CORE_ANTHROPIC_KEY') || ''
            });
        }
    }, [isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setKeys(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSave = () => {
        if (keys.gemini) localStorage.setItem('HR_CORE_GEMINI_KEY', keys.gemini);
        else localStorage.removeItem('HR_CORE_GEMINI_KEY');

        if (keys.openai) localStorage.setItem('HR_CORE_OPENAI_KEY', keys.openai);
        else localStorage.removeItem('HR_CORE_OPENAI_KEY');

        if (keys.anthropic) localStorage.setItem('HR_CORE_ANTHROPIC_KEY', keys.anthropic);
        else localStorage.removeItem('HR_CORE_ANTHROPIC_KEY');

        // Reload to apply changes immediately
        window.location.reload();
    };

    const handleAiStudioSelect = async () => {
        const aistudio = (window as any).aistudio;
        if (aistudio && aistudio.openSelectKey) {
            try {
                await aistudio.openSelectKey();
                // We don't need to manually save this to local storage as it injects into process.env,
                // but we can reload to ensure the app picks it up.
                window.location.reload();
            } catch (error) {
                console.error("Error selecting key:", error);
            }
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Tetapan API Key">
            <div className="space-y-6">
                <p className="text-sm text-neutral-600">
                    Masukkan API Key anda untuk membolehkan ciri-ciri AI. Kunci disimpan secara tempatan di dalam pelayar anda (Local Storage).
                </p>

                {/* Google Gemini Section */}
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <div className="flex items-center space-x-2 mb-2">
                        <Icon name="bot" className="w-5 h-5 text-blue-600" />
                        <h4 className="font-bold text-blue-900">Google Gemini</h4>
                    </div>
                    <div className="space-y-3">
                        <div>
                            <label className="block text-xs font-semibold text-neutral-500 mb-1">Manual Input</label>
                            <input
                                type="password"
                                name="gemini"
                                value={keys.gemini}
                                onChange={handleChange}
                                placeholder="sk-..."
                                className="block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                            />
                        </div>
                        <div className="relative flex py-1 items-center">
                            <div className="flex-grow border-t border-blue-200"></div>
                            <span className="flex-shrink-0 mx-2 text-xs text-blue-400">ATAU</span>
                            <div className="flex-grow border-t border-blue-200"></div>
                        </div>
                        <button
                            onClick={handleAiStudioSelect}
                            className="w-full flex justify-center items-center px-4 py-2 border border-blue-300 shadow-sm text-sm font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50"
                        >
                            Pilih melalui AI Studio
                        </button>
                    </div>
                </div>

                {/* OpenAI Section */}
                <div className="p-4 bg-neutral-50 rounded-lg border border-neutral-200">
                     <div className="flex items-center space-x-2 mb-2">
                        <Icon name="cube" className="w-5 h-5 text-neutral-600" />
                        <h4 className="font-bold text-neutral-900">OpenAI (ChatGPT)</h4>
                    </div>
                    <div>
                        <input
                            type="password"
                            name="openai"
                            value={keys.openai}
                            onChange={handleChange}
                            placeholder="sk-..."
                            className="block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                        />
                    </div>
                </div>

                {/* Anthropic Section */}
                <div className="p-4 bg-neutral-50 rounded-lg border border-neutral-200">
                     <div className="flex items-center space-x-2 mb-2">
                        <Icon name="cube" className="w-5 h-5 text-neutral-600" />
                        <h4 className="font-bold text-neutral-900">Anthropic (Claude)</h4>
                    </div>
                    <div>
                        <input
                            type="password"
                            name="anthropic"
                            value={keys.anthropic}
                            onChange={handleChange}
                            placeholder="sk-ant-..."
                            className="block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                        />
                    </div>
                </div>

                <div className="flex justify-end space-x-2 pt-2">
                    <Button variant="secondary" onClick={onClose}>Batal</Button>
                    <Button onClick={handleSave}>Simpan & Muat Semula</Button>
                </div>
            </div>
        </Modal>
    );
};
