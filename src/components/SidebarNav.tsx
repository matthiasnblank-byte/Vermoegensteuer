import { useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  DocumentTextIcon, 
  CurrencyDollarIcon,
  Cog6ToothIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { navService } from '../services/navService';
import ThemeToggle from './ThemeToggle';

interface NavItem {
  name: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
}

const navigation: NavItem[] = [
  { name: 'Stammdaten', path: '/stammdaten', icon: DocumentTextIcon },
  { name: 'Finanzanlagen', path: '/finanzanlagen', icon: CurrencyDollarIcon },
];

export default function SidebarNav() {
  const [isCollapsed, setIsCollapsed] = useState(navService.isCollapsed());
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  const toggleButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setIsCollapsed(navService.isCollapsed());
  }, []);

  // Fokus-Trap für mobile Navigation
  useEffect(() => {
    if (!isMobileOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMobileOpen(false);
        toggleButtonRef.current?.focus();
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setIsMobileOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobileOpen]);

  const handleToggle = () => {
    if (window.innerWidth < 1024) {
      // Mobile: Toggle Overlay
      setIsMobileOpen(!isMobileOpen);
    } else {
      // Desktop: Toggle Collapse
      const newState = navService.toggle();
      setIsCollapsed(newState);
    }
  };

  const handleNavLinkClick = () => {
    // Auf mobilen Geräten Navigation nach Klick schließen
    if (window.innerWidth < 1024) {
      setIsMobileOpen(false);
    }
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        ref={toggleButtonRef}
        onClick={handleToggle}
        aria-label="Navigation umschalten"
        aria-expanded={isMobileOpen}
        aria-controls="mainNav"
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-colors"
      >
        {isMobileOpen ? (
          <XMarkIcon className="h-6 w-6" aria-hidden="true" />
        ) : (
          <Bars3Icon className="h-6 w-6" aria-hidden="true" />
        )}
      </button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <nav
        id="mainNav"
        ref={navRef}
        className={`
          fixed lg:static
          top-0 left-0 h-full z-40
          flex flex-col
          bg-white dark:bg-gray-900
          border-r border-gray-200 dark:border-gray-700
          transition-all duration-200 ease-in-out
          ${isCollapsed ? 'w-18 lg:w-18' : 'w-60 lg:w-60'}
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
        aria-label="Hauptnavigation"
      >
        {/* Desktop Toggle Button */}
        <div className="hidden lg:flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          {!isCollapsed && (
            <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Hauptnavigation
            </h2>
          )}
          <button
            onClick={handleToggle}
            aria-label="Navigation umschalten"
            aria-expanded={!isCollapsed}
            className="ml-auto p-1.5 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-colors"
          >
            {isCollapsed ? (
              <Bars3Icon className="h-5 w-5" aria-hidden="true" />
            ) : (
              <XMarkIcon className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        </div>

        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Hauptnavigation
          </h2>
          <button
            onClick={() => setIsMobileOpen(false)}
            aria-label="Navigation schließen"
            className="p-1.5 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-colors"
          >
            <XMarkIcon className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 p-4 overflow-y-auto">
          <nav className="space-y-1" aria-label="Navigation">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  onClick={handleNavLinkClick}
                  className={({ isActive }) =>
                    `flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      isActive
                        ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100'
                    }`
                  }
                  title={isCollapsed ? item.name : undefined}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
                    {!isCollapsed && <span>{item.name}</span>}
                  </div>
                  {!isCollapsed && item.badge && (
                    <span className="inline-flex items-center justify-center min-w-[1.5rem] h-6 px-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Verwaltung Section */}
        <div className="mt-auto p-4 border-t border-gray-200 dark:border-gray-700">
          {!isCollapsed && (
            <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-4">
              Verwaltung
            </h2>
          )}
          <nav className="space-y-1" aria-label="Verwaltung">
            <ThemeToggle isCollapsed={isCollapsed} />
            <NavLink
              to="/einstellungen"
              onClick={handleNavLinkClick}
              className={({ isActive }) =>
                `flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive
                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100'
                }`
              }
              title={isCollapsed ? 'Einstellungen' : undefined}
            >
              <Cog6ToothIcon className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
              {!isCollapsed && <span>Einstellungen</span>}
            </NavLink>
          </nav>
        </div>
      </nav>
    </>
  );
}
