import React, { useState, useCallback, useEffect } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { Dashboard } from './components/dashboard/Dashboard';
import { EmployeeDirectory } from './components/directory/EmployeeDirectory';
import { LeaveManagement } from './components/leave/LeaveManagement';
import { ClaimsManagement } from './components/claims/ClaimsManagement';
import { PayrollCalculator } from './components/payroll/PayrollCalculator';
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
import { LandingPage } from './components/layout/LandingPage';

export enum Page {
  DASHBOARD = 'Utama (Dashboard)',
  DIRECTORY = 'Direktori Pekerja',
  RECRUITMENT = 'Jawatan Kosong (Recruitment)',
  ONBOARDING = 'Masuk & Keluar (Onboarding)',
  LEAVE = 'Mohon Cuti (Leave)',
  CLAIMS = 'Tuntutan (Claims)',
  ATTENDANCE = 'Kehadiran (Attendance)',
  ATTENDANCE_REPORT = 'Laporan Kehadiran',
  PERFORMANCE = 'Prestasi (Performance)',
  TRAINING = 'Latihan (Training)',
  ASSETS = 'Aset Syarikat',
  ENGAGEMENT = 'Suara Pekerja (Survey)',
  HEALTH_WELLNESS = 'Kesihatan (Wellness)',
  ANALYTICS = 'Analisa Data',
  PAYROLL = 'Kalkulator Gaji',
  PAYROLL_PROCESSING = 'Proses Gaji (Payroll)',
  RESOURCES = 'Pusat Sumber',
  SETTINGS = 'Tetapan (Settings)',
}

type ViewState = 'landing' | 'login' | 'app';

const App: React.FC = () => {
  const [viewState, setViewState] = useState<ViewState>('landing');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPage, setCurrentPage] = useState<Page>(Page.DASHBOARD);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isQrScannerOpen, setQrScannerOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'info' | 'error' } | null>(null);

  useEffect(() => {
    const handleOffline = () => {
      setToast({ message: 'Anda sedang offline. Beberapa fungsi mungkin terhad.', type: 'error' });
    };

    const handleOnline = () => {
      setToast({ message: 'Sambungan internet kembali pulih!', type: 'info' });
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

  useEffect(() => {
     // Remove loader if present
     const loader = document.getElementById('loader');
     if (loader) {
         loader.remove();
     }
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
        return <HealthAndWellness />;
      case Page.ANALYTICS:
        return <AnalyticsDashboard />;
      case Page.PAYROLL:
        return <PayrollCalculator />;
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

  const handleLogin = () => {
    setIsAuthenticated(true);
    setViewState('app');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setSidebarOpen(false);
    setCurrentPage(Page.DASHBOARD);
    setViewState('landing');
  };

  // View Routing Logic
  if (viewState === 'landing') {
      return <LandingPage onLoginClick={() => setViewState('login')} />;
  }

  if (viewState === 'login') {
      return <LoginPage onLogin={handleLogin} onBack={() => setViewState('landing')} />;
  }

  // Authenticated App View
  return (
    <AppContextProvider>
      <div className="flex h-screen bg-neutral-100 text-neutral-800 font-sans">
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