import { ReactNode, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import SidebarNav from './SidebarNav';
import Breadcrumbs from './Breadcrumbs';
import ThemeToggle from './ThemeToggle';
import { storageService } from '../services/storageService';

interface AppShellProps {
  children: ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  const location = useLocation();
  useEffect(() => {
    storageService.initMockData();
  }, []);
  const caseData = storageService.getCase();

  const getBreadcrumbs = () => {
    if (location.pathname === '/stammdaten') {
      return [
        caseData?.organisation || 'Organisation',
        caseData?.bereich || 'Bereich',
        'Stammdaten',
      ];
    }
    if (location.pathname === '/finanzanlagen') {
      return [
        caseData?.organisation || 'Organisation',
        caseData?.bereich || 'Bereich',
        'Finanzanlagen',
      ];
    }
    if (location.pathname === '/berechnungen') {
      return [
        caseData?.organisation || 'Organisation',
        caseData?.bereich || 'Bereich',
        'Berechnungen',
      ];
    }
    if (location.pathname === '/einstellungen') {
      return ['Einstellungen'];
    }
    return [];
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <SidebarNav />
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <Breadcrumbs items={getBreadcrumbs()} />
            <ThemeToggle />
          </div>
        </header>
        <main className="flex-1 overflow-y-auto px-6 py-4 bg-gray-50 dark:bg-gray-900">
          {children}
        </main>
      </div>
    </div>
  );
}
