import React from 'react';
import { Card } from '../common/Card';
import { Icon } from '../common/Icon';

export const SystemSettings: React.FC = () => {

    return (
        <div>
            <h3 className="text-lg font-bold text-neutral-800 mb-4">System Configuration</h3>
            <Card className="p-6">
                <div className="flex flex-col items-start gap-4">
                     <div className="flex items-center space-x-2">
                         <Icon name="settings" className="w-5 h-5 text-neutral-500" />
                         <h4 className="font-semibold text-neutral-800">System Information</h4>
                     </div>
                     <p className="text-sm text-neutral-600">
                         HR Core Version 1.2.0 (Stable)
                     </p>
                     <p className="text-sm text-neutral-500">
                         Platform is running in standard mode without external AI integrations.
                     </p>
                </div>
            </Card>
        </div>
    );
};