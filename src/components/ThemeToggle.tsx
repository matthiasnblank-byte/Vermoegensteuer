import { useState, useEffect } from 'react';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';
import { themeService } from '../services/themeService';

interface ThemeToggleProps {
  isCollapsed?: boolean;
}

export default function ThemeToggle({ isCollapsed = false }: ThemeToggleProps) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(themeService.getActiveTheme() === 'dark');
    
    const unsubscribe = themeService.addListener(() => {
      setIsDark(themeService.getActiveTheme() === 'dark');
    });

    return unsubscribe;
  }, []);

  const handleToggle = () => {
    const newTheme = isDark ? 'light' : 'dark';
    themeService.setPreference(newTheme);
  };

  return (
    <button
      onClick={handleToggle}
      className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} px-3 py-2 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600`}
      aria-label={`Zum ${isDark ? 'hellen' : 'dunklen'} Modus wechseln`}
      title={isCollapsed ? `Zum ${isDark ? 'hellen' : 'dunklen'} Modus wechseln` : undefined}
    >
      {isDark ? (
        <SunIcon className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
      ) : (
        <MoonIcon className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
      )}
      {!isCollapsed && <span>{isDark ? 'Hell' : 'Dunkel'}</span>}
    </button>
  );
}
