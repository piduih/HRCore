
import React, { useState, useCallback, useEffect } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { Dashboard } from './components/dashboard/Dashboard';
import { EmployeeDirectory } from './components/directory/EmployeeDirectory';
import { LeaveManagement } from './components/leave/LeaveManagement';
import { ClaimsManagement } from './components/claims/ClaimsManagement';
import { PayrollCalculator } from './components/payroll/PayrollCalculator';
import { AiHelperChat } from './components/ai/AiHelperChat';
import { AppContextProvider } from './context/AppContext';
import { Resources } from './components/resources/Resources';
import { AttendanceDiscipline } from './components/attendance/AttendanceDiscipline';
import { QRCodeScanner } from './components/attendance/QRCodeScanner';
import { PerformanceManagement } from './components/performance/PerformanceManagement';
import { TrainingManagement } from './components/training/TrainingManagement';
import { AssetManagement } from './components/assets/AssetManagement';
import { RecruitmentManagement } from './components/recruitment/RecruitmentManagement';
import { AttendanceReport } from './components/attendance/AttendanceReport';
import { PayrollProcessing } from './components/payroll/PayrollProcessing';
import { Settings } from './components/settings/Settings';
import { Engagement } from './components/engagement/Engagement';
import { OnboardingOffboarding } from './components/onboarding/OnboardingOffboarding';
import { AnalyticsDashboard } from './components/analytics/AnalyticsDashboard';
import { HealthAndWellness } from './components/health/HealthAndWellness';
import { Toast } from './components/common/Toast';
import { LoginPage } from './components/auth/LoginPage';

export enum Page {
  DASHBOARD = 'Dashboard',
  DIRECTORY = 'Employee Directory',
  RECRUITMENT = 'Recruitment',
  ONBOARDING = 'Onboarding & Offboarding',
  LEAVE = 'Leave Management',
  CLAIMS = 'Claims Management',
  ATTENDANCE = 'Attendance & Discipline',
  ATTENDANCE_REPORT = 'Attendance Report',
  PERFORMANCE = 'Performance',
  TRAINING = 'Training',
  ASSETS = 'Assets',
  ENGAGEMENT = 'Engagement',
  HEALTH_WELLNESS = 'Health & Wellness',
  ANALYTICS = 'Analytics Dashboard',
  PAYROLL = 'Financial Tools',
  PAYROLL_PROCESSING = 'Payroll Processing',
  RESOURCES = 'Pusat Sumber',
  SETTINGS = 'Settings',
}

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPage, setCurrentPage] = useState<Page>(Page.DASHBOARD);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isAiChatOpen, setAiChatOpen] = useState(false);
  const [aiInitialPrompt, setAiInitialPrompt] = useState('');
  const [isQrScannerOpen, setQrScannerOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'info' | 'error' } | null>(null);

  // Handle loader removal on mount
  useEffect(() => {
    const loader = document.getElementById('loader');
    if (loader) {
      // Small delay to ensure smooth transition
      setTimeout(() => {
        loader.classList.add('fade-out');
        const removeLoader = () => {
             if (loader && loader.parentNode) {
                 loader.parentNode.removeChild(loader);
             }
        };
        loader.addEventListener('transitionend', removeLoader);
        // Fallback cleanup
        setTimeout(removeLoader, 600);
      }, 100);
    }
  }, []);

  useEffect(() => {
    const handleOffline = () => {
      setToast({ message: 'You are currently offline. Some features may be limited.', type: 'error' });
    };

    const handleOnline = () => {
      setToast({ message: 'Connection restored. You are back online!', type: 'info' });
    };

    if (!navigator.onLine) {
      handleOffline();
    }

    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);

    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
    };
  }, []);

  const renderPage = useCallback(() => {
    switch (currentPage) {
      case Page.DASHBOARD:
        return <Dashboard setActivePage={setCurrentPage} setQrScannerOpen={setQrScannerOpen} />;
      case Page.DIRECTORY:
        return <EmployeeDirectory />;
      case Page.RECRUITMENT:
        return <RecruitmentManagement />;
      case Page.ONBOARDING:
        return <OnboardingOffboarding />;
      case Page.LEAVE:
        return <LeaveManagement />;
      case Page.CLAIMS:
        return <ClaimsManagement />;
      case Page.ATTENDANCE:
        return <AttendanceDiscipline setActivePage={setCurrentPage} />;
      case Page.ATTENDANCE_REPORT:
        return <AttendanceReport setActivePage={setCurrentPage} />;
      case Page.PERFORMANCE:
        return <PerformanceManagement />;
      case Page.TRAINING:
        return <TrainingManagement />;
      case Page.ASSETS:
        return <AssetManagement />;
      case Page.ENGAGEMENT:
        return <Engagement />;
      case Page.HEALTH_WELLNESS:
        return <HealthAndWellness setAiChatOpen={setAiChatOpen} setAiInitialPrompt={setAiInitialPrompt} />;
      case Page.ANALYTICS:
        return <AnalyticsDashboard />;
      case Page.PAYROLL:
        return <PayrollCalculator setAiChatOpen={setAiChatOpen} setAiInitialPrompt={setAiInitialPrompt} />;
      case Page.PAYROLL_PROCESSING:
        return <PayrollProcessing />;
      case Page.RESOURCES:
        return <Resources />;
      case Page.SETTINGS:
        return <Settings />;
      default:
        return <Dashboard setActivePage={setCurrentPage} setQrScannerOpen={setQrScannerOpen} />;
    }
  }, [currentPage]);

  const handleLogout = () => {
    setIsAuthenticated(false);
    setSidebarOpen(false);
    setAiChatOpen(false);
    setCurrentPage(Page.DASHBOARD);
  };

  if (!isAuthenticated) {
    return <LoginPage onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <AppContextProvider>
      <div className="flex h-screen bg-neutral-100 text-neutral-800">
        <Sidebar 
          currentPage={currentPage} 
          setCurrentPage={setCurrentPage}
          isSidebarOpen={isSidebarOpen}
          setSidebarOpen={setSidebarOpen}
          onLogout={handleLogout}
        />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header 
            pageTitle={currentPage} 
            onMenuClick={() => setSidebarOpen(true)}
          />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-neutral-50 p-4 sm:p-6 lg:p-8">
            {renderPage()}
          </main>
        </div>
        <AiHelperChat 
          isOpen={isAiChatOpen} 
          setIsOpen={setAiChatOpen} 
          initialPrompt={aiInitialPrompt}
          clearInitialPrompt={() => setAiInitialPrompt('')}
        />
        <QRCodeScanner 
          isOpen={isQrScannerOpen}
          onClose={() => setQrScannerOpen(false)}
        />
      </div>
      <Toast
        isOpen={!!toast}
        message={toast?.message || ''}
        type={toast?.type || 'info'}
        onClose={() => setToast(null)}
      />
    </AppContextProvider>
  );
};

export default App;
