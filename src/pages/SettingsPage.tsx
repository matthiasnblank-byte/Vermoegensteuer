import { useState, useEffect } from 'react';
import { themeService, ThemePreference } from '../services/themeService';

export default function SettingsPage() {
  const [themePreference, setThemePreference] = useState<ThemePreference>('system');

  useEffect(() => {
    setThemePreference(themeService.getPreference());
    
    const unsubscribe = themeService.addListener(() => {
      setThemePreference(themeService.getPreference());
    });

    return unsubscribe;
  }, []);

  const handleThemeChange = (value: ThemePreference) => {
    themeService.setPreference(value);
    setThemePreference(value);
  };

  return (
    <div className="max-w-4xl space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Einstellungen</h1>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Darstellung</h2>
        
        <div className="space-y-3" role="radiogroup" aria-labelledby="theme-label">
          <div id="theme-label" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Farbschema
          </div>
          
          <label className="flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors">
            <input
              type="radio"
              name="theme"
              value="system"
              checked={themePreference === 'system'}
              onChange={(e) => handleThemeChange(e.target.value as ThemePreference)}
              className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-600 focus:ring-2"
              aria-describedby="system-desc"
            />
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-900 dark:text-gray-100">System</div>
              <div id="system-desc" className="text-xs text-gray-500 dark:text-gray-400">
                Folgt der Systemeinstellung
              </div>
            </div>
          </label>

          <label className="flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors">
            <input
              type="radio"
              name="theme"
              value="light"
              checked={themePreference === 'light'}
              onChange={(e) => handleThemeChange(e.target.value as ThemePreference)}
              className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-600 focus:ring-2"
              aria-describedby="light-desc"
            />
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-900 dark:text-gray-100">Hell</div>
              <div id="light-desc" className="text-xs text-gray-500 dark:text-gray-400">
                Helles Farbschema verwenden
              </div>
            </div>
          </label>

          <label className="flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors">
            <input
              type="radio"
              name="theme"
              value="dark"
              checked={themePreference === 'dark'}
              onChange={(e) => handleThemeChange(e.target.value as ThemePreference)}
              className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-600 focus:ring-2"
              aria-describedby="dark-desc"
            />
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-900 dark:text-gray-100">Dunkel</div>
              <div id="dark-desc" className="text-xs text-gray-500 dark:text-gray-400">
                Dunkles Farbschema verwenden
              </div>
            </div>
          </label>
        </div>
      </section>
    </div>
  );
}
