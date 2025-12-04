
import React from 'react';
import { Page } from '../../App';
import { Icon } from '../common/Icon';
import type { IconName } from '../common/Icon';

interface SidebarProps {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  isSidebarOpen: boolean;
  setSidebarOpen: (isOpen: boolean) => void;
  onLogout: () => void;
}

interface NavItemProps {
  icon: IconName;
  label: Page;
  isActive: boolean;
  onClick: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, isActive, onClick }) => (
  <li>
    <a
      href="#"
      onClick={(e) => {
        e.preventDefault();
        onClick();
      }}
      className={`flex items-center p-3 my-1 rounded-lg transition-colors ${
        isActive
          ? 'bg-primary-50 text-primary-600 font-semibold'
          : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
      }`}
    >
      <Icon name={icon} className="w-5 h-5 mr-3" />
      <span>{label}</span>
    </a>
  </li>
);

const NavGroup: React.FC<{ title: string, children: React.ReactNode }> = ({ title, children }) => (
    <div>
        <h3 className="px-3 mt-4 mb-1 text-xs font-semibold text-neutral-400 uppercase tracking-wider">{title}</h3>
        <ul>
            {children}
        </ul>
    </div>
);


export const Sidebar: React.FC<SidebarProps> = ({ currentPage, setCurrentPage, isSidebarOpen, setSidebarOpen, onLogout }) => {
  
  const handlePageChange = (page: Page) => {
    setCurrentPage(page);
    setSidebarOpen(false); // Close sidebar on mobile after navigation
  };

  const navItems = {
    general: [
        { label: Page.DASHBOARD, icon: 'dashboard' },
        { label: Page.DIRECTORY, icon: 'directory' },
    ],
    management: [
        { label: Page.RECRUITMENT, icon: 'briefcase' },
        { label: Page.ONBOARDING, icon: 'user-circle' },
        { label: Page.LEAVE, icon: 'leave' },
        { label: Page.CLAIMS, icon: 'claims' },
        { label: Page.ATTENDANCE, icon: 'clipboard-check' },
        { label: Page.PERFORMANCE, icon: 'bullhorn' },
        { label: Page.TRAINING, icon: 'academic-cap' },
        { label: Page.ASSETS, icon: 'cube' },
        { label: Page.ENGAGEMENT, icon: 'star' },
        { label: Page.HEALTH_WELLNESS, icon: 'heart' },
    ],
    company: [
        { label: Page.ANALYTICS, icon: 'chart-bar' },
        { label: Page.PAYROLL_PROCESSING, icon: 'banknotes' },
        { label: Page.PAYROLL, icon: 'payroll' },
        { label: Page.RESOURCES, icon: 'book-open' },
    ],
    system: [
        { label: Page.SETTINGS, icon: 'settings' },
    ]
  };

  return (
    <>
        <div 
            className={`fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden transition-opacity ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            onClick={() => setSidebarOpen(false)}
        ></div>
        <aside className={`absolute lg:relative flex-shrink-0 w-64 bg-white border-r border-neutral-200 flex flex-col h-full z-40 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300 ease-in-out`}>
            <div className="flex items-center justify-center p-6 border-b border-neutral-200">
                <h1 className="text-2xl font-bold text-primary">HR Core</h1>
            </div>
            <nav className="flex-1 p-4 overflow-y-auto">
                <NavGroup title="General">
                    {navItems.general.map((item) => (
                        <NavItem
                            key={item.label}
                            icon={item.icon as IconName}
                            label={item.label}
                            isActive={currentPage === item.label}
                            onClick={() => handlePageChange(item.label)}
                        />
                    ))}
                </NavGroup>
                <NavGroup title="Management">
                    {navItems.management.map((item) => (
                        <NavItem
                            key={item.label}
                            icon={item.icon as IconName}
                            label={item.label}
                            isActive={currentPage === item.label}
                            onClick={() => handlePageChange(item.label)}
                        />
                    ))}
                </NavGroup>
                 <NavGroup title="Company">
                    {navItems.company.map((item) => (
                        <NavItem
                            key={item.label}
                            icon={item.icon as IconName}
                            label={item.label}
                            isActive={currentPage === item.label}
                            onClick={() => handlePageChange(item.label)}
                        />
                    ))}
                </NavGroup>
                 <NavGroup title="System">
                    {navItems.system.map((item) => (
                        <NavItem
                            key={item.label}
                            icon={item.icon as IconName}
                            label={item.label}
                            isActive={currentPage === item.label}
                            onClick={() => handlePageChange(item.label)}
                        />
                    ))}
                </NavGroup>
            </nav>
            <div className="p-4 border-t border-neutral-200">
                <ul>
                    <li>
                         <a
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                onLogout();
                            }}
                            className="flex items-center p-3 my-1 rounded-lg transition-colors text-red-600 hover:bg-red-50"
                        >
                            <Icon name="logout" className="w-5 h-5 mr-3" />
                            <span>Logout</span>
                        </a>
                    </li>
                </ul>
            </div>
        </aside>
    </>
  );
};
