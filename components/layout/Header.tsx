import React from 'react';
import { useAppState, useAppActions } from '../../hooks/useAppContext';
import { Icon } from '../common/Icon';

interface HeaderProps {
  pageTitle: string;
  onMenuClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ pageTitle, onMenuClick }) => {
  const { currentUser, tenants, currentTenantId } = useAppState();
  const { switchTenant } = useAppActions();

  return (
    <header className="bg-white shadow-sm p-4 flex justify-between items-center z-10">
      <div className="flex items-center">
        <button onClick={onMenuClick} className="lg:hidden mr-4 text-neutral-600">
          <Icon name="menu" />
        </button>
        <h1 className="text-xl font-bold text-neutral-800">{pageTitle}</h1>
      </div>
      <div className="flex items-center space-x-4">
        {/* Tenant Switcher (for demo purposes) */}
        <div className="relative hidden sm:block">
           <select
              value={currentTenantId}
              onChange={(e) => switchTenant(e.target.value)}
              className="appearance-none bg-neutral-100 border border-neutral-200 rounded-md py-2 pl-3 pr-8 text-sm font-semibold text-neutral-700 hover:bg-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              aria-label="Select Tenant"
            >
              {tenants.map(tenant => (
                <option key={tenant.id} value={tenant.id}>{tenant.name}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-neutral-700">
                <Icon name="chevron-down" className="w-4 h-4" />
            </div>
        </div>
        <div className="text-right hidden sm:block">
          <p className="font-semibold text-neutral-800">{currentUser.name}</p>
          <p className="text-sm text-neutral-500">{currentUser.position}</p>
        </div>
        <img
          className="w-10 h-10 rounded-full"
          src={currentUser.avatarUrl}
          alt={currentUser.name}
        />
      </div>
    </header>
  );
};
