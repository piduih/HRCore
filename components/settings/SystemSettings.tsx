
import React, { useState } from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Icon } from '../common/Icon';
import { ApiKeyModal } from './ApiKeyModal';

export const SystemSettings: React.FC = () => {
    const [isApiKeyModalOpen, setApiKeyModalOpen] = useState(false);

    return (
        <div>
            <h3 className="text-lg font-bold text-neutral-800 mb-4">System Configuration</h3>
            <Card className="p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <div className="flex items-center space-x-2 mb-1">
                            <Icon name="settings" className="w-5 h-5 text-neutral-500" />
                            <h4 className="font-semibold text-neutral-800">AI Provider Configuration</h4>
                        </div>
                        <p className="text-sm text-neutral-500">Manage API keys for Gemini, OpenAI, or Anthropic to enable AI features.</p>
                    </div>
                    <Button onClick={() => setApiKeyModalOpen(true)} variant="secondary">
                        Manage API Keys
                    </Button>
                </div>
            </Card>

            <ApiKeyModal isOpen={isApiKeyModalOpen} onClose={() => setApiKeyModalOpen(false)} />
        </div>
    );
};
