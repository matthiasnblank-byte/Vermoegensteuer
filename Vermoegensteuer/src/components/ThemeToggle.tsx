import { useState, useEffect } from 'react';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';
import { themeService } from '../services/themeService';

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(themeService.isDark());

  useEffect(() => {
    setIsDark(themeService.isDark());
  }, []);

  const handleToggle = () => {
    const newTheme = themeService.toggleTheme();
    setIsDark(newTheme === 'dark');
  };

  return (
    <button
      onClick={handleToggle}
      className="p-2 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-colors"
      title={isDark ? 'Light Mode aktivieren' : 'Dark Mode aktivieren'}
      aria-label={isDark ? 'Light Mode aktivieren' : 'Dark Mode aktivieren'}
    >
      {isDark ? (
        <SunIcon className="h-5 w-5" aria-hidden="true" />
      ) : (
        <MoonIcon className="h-5 w-5" aria-hidden="true" />
      )}
    </button>
  );
}


