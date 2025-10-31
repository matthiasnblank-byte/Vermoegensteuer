import { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import SidebarNav from './SidebarNav';
import Breadcrumbs from './Breadcrumbs';
import HeaderCards from './HeaderCards';
import { storageService } from '../services/storageService';

interface AppShellProps {
  children: ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  const location = useLocation();
  const caseData = storageService.getCase();

  const getBreadcrumbs = () => {
    if (location.pathname === '/') {
      return ['Dashboard'];
    }
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
    return ['Dashboard'];
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <SidebarNav />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="mb-4">
            <Breadcrumbs items={getBreadcrumbs()} />
          </div>
          <HeaderCards />
        </header>
        <main className="flex-1 overflow-y-auto px-6 py-4">
          {children}
        </main>
      </div>
    </div>
  );
}
