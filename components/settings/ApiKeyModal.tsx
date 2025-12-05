
import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Icon } from '../common/Icon';

interface ApiKeyModalProps {
    isOpen: boolean;
    onClose: () => void;
}

type Provider = 'gemini' | 'openai' | 'anthropic';

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onClose }) => {
    const [keys, setKeys] = useState({
        gemini: '',
        openai: '',
        anthropic: ''
    });
    const [activeProvider, setActiveProvider] = useState<Provider>('gemini');

    useEffect(() => {
        if (isOpen) {
            setKeys({
                gemini: localStorage.getItem('HR_CORE_GEMINI_KEY') || '',
                openai: localStorage.getItem('HR_CORE_OPENAI_KEY') || '',
                anthropic: localStorage.getItem('HR_CORE_ANTHROPIC_KEY') || ''
            });
            const savedProvider = localStorage.getItem('HR_CORE_ACTIVE_PROVIDER') as Provider;
            if (savedProvider) setActiveProvider(savedProvider);
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

        localStorage.setItem('HR_CORE_ACTIVE_PROVIDER', activeProvider);

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
        <Modal isOpen={isOpen} onClose={onClose} title="Tetapan AI & API Key">
            <div className="space-y-6">
                <p className="text-sm text-neutral-600">
                    Masukkan API Key untuk penyedia pilihan anda. Pilih penyedia utama yang akan digunakan oleh sistem.
                </p>
                
                <div className="bg-white p-4 rounded-lg border border-neutral-200 shadow-sm mb-6">
                    <label className="block text-sm font-bold text-neutral-800 mb-2">Penyedia AI Utama (Active Provider)</label>
                    <div className="flex space-x-4">
                        <label className="inline-flex items-center">
                            <input 
                                type="radio" 
                                className="form-radio text-primary" 
                                name="provider" 
                                value="gemini" 
                                checked={activeProvider === 'gemini'} 
                                onChange={() => setActiveProvider('gemini')}
                            />
                            <span className="ml-2">Gemini</span>
                        </label>
                        <label className="inline-flex items-center">
                            <input 
                                type="radio" 
                                className="form-radio text-primary" 
                                name="provider" 
                                value="openai" 
                                checked={activeProvider === 'openai'} 
                                onChange={() => setActiveProvider('openai')}
                            />
                            <span className="ml-2">OpenAI</span>
                        </label>
                        <label className="inline-flex items-center">
                            <input 
                                type="radio" 
                                className="form-radio text-primary" 
                                name="provider" 
                                value="anthropic" 
                                checked={activeProvider === 'anthropic'} 
                                onChange={() => setActiveProvider('anthropic')}
                            />
                            <span className="ml-2">Anthropic</span>
                        </label>
                    </div>
                </div>

                {/* Google Gemini Section */}
                <div className={`p-4 rounded-lg border ${activeProvider === 'gemini' ? 'bg-blue-50 border-blue-200' : 'bg-neutral-50 border-neutral-200'}`}>
                    <div className="flex items-center space-x-2 mb-2">
                        <Icon name="bot" className={`w-5 h-5 ${activeProvider === 'gemini' ? 'text-blue-600' : 'text-neutral-500'}`} />
                        <h4 className={`font-bold ${activeProvider === 'gemini' ? 'text-blue-900' : 'text-neutral-700'}`}>Google Gemini</h4>
                    </div>
                    <div className="space-y-3">
                        <div>
                            <input
                                type="password"
                                name="gemini"
                                value={keys.gemini}
                                onChange={handleChange}
                                placeholder="Tampal API Key Gemini di sini..."
                                className="block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                            />
                        </div>
                        <div className="relative flex py-1 items-center">
                            <div className="flex-grow border-t border-neutral-300"></div>
                            <span className="flex-shrink-0 mx-2 text-xs text-neutral-400">ATAU</span>
                            <div className="flex-grow border-t border-neutral-300"></div>
                        </div>
                        <button
                            onClick={handleAiStudioSelect}
                            className="w-full flex justify-center items-center px-4 py-2 border border-neutral-300 shadow-sm text-sm font-medium rounded-md text-neutral-700 bg-white hover:bg-neutral-50"
                        >
                            Pilih melalui AI Studio
                        </button>
                    </div>
                </div>

                {/* OpenAI Section */}
                <div className={`p-4 rounded-lg border ${activeProvider === 'openai' ? 'bg-green-50 border-green-200' : 'bg-neutral-50 border-neutral-200'}`}>
                     <div className="flex items-center space-x-2 mb-2">
                        <Icon name="cube" className={`w-5 h-5 ${activeProvider === 'openai' ? 'text-green-600' : 'text-neutral-500'}`} />
                        <h4 className={`font-bold ${activeProvider === 'openai' ? 'text-green-900' : 'text-neutral-700'}`}>OpenAI (GPT-4o/Mini)</h4>
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
                <div className={`p-4 rounded-lg border ${activeProvider === 'anthropic' ? 'bg-purple-50 border-purple-200' : 'bg-neutral-50 border-neutral-200'}`}>
                     <div className="flex items-center space-x-2 mb-2">
                        <Icon name="cube" className={`w-5 h-5 ${activeProvider === 'anthropic' ? 'text-purple-600' : 'text-neutral-500'}`} />
                        <h4 className={`font-bold ${activeProvider === 'anthropic' ? 'text-purple-900' : 'text-neutral-700'}`}>Anthropic (Claude 3.5 Sonnet)</h4>
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
                        <p className="text-xs text-neutral-500 mt-1">Nota: Anthropic mungkin memerlukan proksi jika digunakan terus dari pelayar (CORS).</p>
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
