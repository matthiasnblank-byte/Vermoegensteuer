import { ReactNode, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import SidebarNav from './SidebarNav';
import Breadcrumbs from './Breadcrumbs';
import ThemeToggle from './ThemeToggle';
import SkipLink from './SkipLink';
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

  // Fokus auf Hauptinhalt bei Routenwechsel für bessere Screenreader-Navigation
  useEffect(() => {
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      // Kurze Verzögerung für DOM-Updates
      setTimeout(() => {
        mainContent.focus();
      }, 100);
    }
  }, [location.pathname]);

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

  // Seitentitel für aktuellen Bereich
  const getPageTitle = (): string => {
    if (location.pathname === '/stammdaten') return 'Stammdaten';
    if (location.pathname === '/finanzanlagen') return 'Finanzanlagen';
    if (location.pathname === '/berechnungen') return 'Berechnungen';
    if (location.pathname === '/einstellungen') return 'Einstellungen';
    return 'Dashboard';
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Skip-Links für Tastaturnutzer (WCAG 2.4.1) */}
      <SkipLink href="#main-content">
        Zum Hauptinhalt springen
      </SkipLink>
      <SkipLink href="#mainNav">
        Zur Navigation springen
      </SkipLink>

      {/* Sidebar Navigation */}
      <SidebarNav />

      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        {/* Header mit semantischem landmark */}
        <header 
          className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4"
          role="banner"
        >
          <div className="flex items-center justify-between">
            <Breadcrumbs items={getBreadcrumbs()} />
            <div className="flex items-center gap-4">
              <ThemeToggle />
            </div>
          </div>
        </header>

        {/* Hauptinhalt mit korrektem landmark und tabindex für Focus-Management */}
        <main 
          id="main-content"
          className="flex-1 overflow-y-auto px-6 py-4 bg-gray-50 dark:bg-gray-900"
          role="main"
          aria-label={`${getPageTitle()} - Hauptinhalt`}
          tabIndex={-1}
        >
          {children}
        </main>

        {/* Footer für zusätzliche Informationen */}
        <footer 
          className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-6 py-2 text-xs text-gray-500 dark:text-gray-400"
          role="contentinfo"
        >
          <div className="flex items-center justify-between">
            <span>© {new Date().getFullYear()} Vermögensteuer-Dashboard</span>
            <span>WCAG 2.1 AA konform</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
