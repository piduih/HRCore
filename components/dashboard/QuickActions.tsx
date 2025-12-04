
import React from 'react';
import { Card } from '../common/Card';
import { Icon } from '../common/Icon';
import { Page } from '../../App';

interface ActionButtonProps {
    icon: React.ComponentProps<typeof Icon>['name'];
    label: string;
    onClick: () => void;
}

const ActionButton: React.FC<ActionButtonProps> = ({icon, label, onClick}) => (
    <button onClick={onClick} className="flex flex-col items-center justify-center space-y-2 text-center p-4 rounded-lg hover:bg-primary-50 transition-colors">
        <div className="w-14 h-14 bg-primary-100 rounded-full flex items-center justify-center text-primary">
            <Icon name={icon} className="w-7 h-7" />
        </div>
        <span className="font-semibold text-neutral-700 text-sm">{label}</span>
    </button>
)

interface QuickActionsProps {
    setActivePage: (page: Page) => void;
    setQrScannerOpen: (isOpen: boolean) => void;
}


export const QuickActions: React.FC<QuickActionsProps> = ({ setActivePage, setQrScannerOpen }) => {
  return (
    <Card className="p-4 sm:p-6">
        <h3 className="font-semibold text-lg mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            <ActionButton icon="qrcode" label="Clock In" onClick={() => setQrScannerOpen(true)} />
            <ActionButton icon="plus" label="Apply Leave" onClick={() => setActivePage(Page.LEAVE)} />
            <ActionButton icon="money" label="Submit Claim" onClick={() => setActivePage(Page.CLAIMS)} />
            <ActionButton icon="payroll" label="Payroll Tool" onClick={() => setActivePage(Page.PAYROLL)} />
            <ActionButton icon="directory" label="View Directory" onClick={() => setActivePage(Page.DIRECTORY)} />
        </div>
    </Card>
  );
};