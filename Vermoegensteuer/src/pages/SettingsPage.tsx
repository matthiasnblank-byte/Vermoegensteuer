import { useState, useEffect, useId } from 'react';
import { themeService, ThemePreference } from '../services/themeService';
import LiveRegion from '../components/LiveRegion';
import { useAnnounce } from '../hooks/useAnnounce';

/**
 * SettingsPage - Seite für Anwendungseinstellungen
 * 
 * WCAG-Konformität:
 * - 1.3.1: Semantische Struktur mit fieldset/legend für Radiogruppen
 * - 2.4.6: Beschreibende Labels
 * - 4.1.2: Korrekte ARIA-Attribute für Radio-Buttons
 * - 4.1.3: Status-Nachrichten bei Einstellungsänderungen
 */
export default function SettingsPage() {
  const formId = useId();
  const [themePreference, setThemePreference] = useState<ThemePreference>('system');
  const { message: announcement, announce } = useAnnounce();

  useEffect(() => {
    // Seitentitel setzen
    document.title = 'Einstellungen - Vermögensteuer-Dashboard';
    
    setThemePreference(themeService.getPreference());
    
    const unsubscribe = themeService.addListener(() => {
      setThemePreference(themeService.getPreference());
    });

    return unsubscribe;
  }, []);

  const handleThemeChange = (value: ThemePreference) => {
    themeService.setPreference(value);
    setThemePreference(value);
    
    // Ankündigung für Screenreader
    const themeLabels = {
      system: 'Systemeinstellung',
      light: 'Hell',
      dark: 'Dunkel'
    };
    announce(`Farbschema geändert zu: ${themeLabels[value]}`);
  };

  return (
    <div className="max-w-4xl space-y-6">
      {/* Live-Region für Status-Ankündigungen */}
      <LiveRegion message={announcement} />

      {/* Seiten-Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
          Einstellungen
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Passen Sie die Anwendung nach Ihren Wünschen an.
        </p>
      </div>

      {/* Darstellungs-Einstellungen */}
      <section className="space-y-4" aria-labelledby="section-display">
        <h2 
          id="section-display" 
          className="text-lg font-semibold text-gray-900 dark:text-gray-100"
        >
          Darstellung
        </h2>
        
        <fieldset>
          <legend 
            id={`${formId}-theme-legend`}
            className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3"
          >
            Farbschema
          </legend>
          
          <div 
            className="space-y-3" 
            role="radiogroup" 
            aria-labelledby={`${formId}-theme-legend`}
          >
            {/* System-Option */}
            <label 
              className={`flex items-center gap-3 p-3 border rounded-md cursor-pointer transition-colors ${
                themePreference === 'system'
                  ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 ring-2 ring-blue-600'
                  : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              <input
                type="radio"
                name="theme"
                value="system"
                checked={themePreference === 'system'}
                onChange={(e) => handleThemeChange(e.target.value as ThemePreference)}
                className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
                aria-describedby={`${formId}-system-desc`}
              />
              <div className="flex-1">
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  System
                </span>
                <p 
                  id={`${formId}-system-desc`} 
                  className="text-xs text-gray-500 dark:text-gray-400 mt-0.5"
                >
                  Folgt der Systemeinstellung Ihres Geräts
                </p>
              </div>
            </label>

            {/* Hell-Option */}
            <label 
              className={`flex items-center gap-3 p-3 border rounded-md cursor-pointer transition-colors ${
                themePreference === 'light'
                  ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 ring-2 ring-blue-600'
                  : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              <input
                type="radio"
                name="theme"
                value="light"
                checked={themePreference === 'light'}
                onChange={(e) => handleThemeChange(e.target.value as ThemePreference)}
                className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
                aria-describedby={`${formId}-light-desc`}
              />
              <div className="flex-1">
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  Hell
                </span>
                <p 
                  id={`${formId}-light-desc`} 
                  className="text-xs text-gray-500 dark:text-gray-400 mt-0.5"
                >
                  Helles Farbschema für optimale Lesbarkeit bei Tageslicht
                </p>
              </div>
            </label>

            {/* Dunkel-Option */}
            <label 
              className={`flex items-center gap-3 p-3 border rounded-md cursor-pointer transition-colors ${
                themePreference === 'dark'
                  ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 ring-2 ring-blue-600'
                  : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              <input
                type="radio"
                name="theme"
                value="dark"
                checked={themePreference === 'dark'}
                onChange={(e) => handleThemeChange(e.target.value as ThemePreference)}
                className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
                aria-describedby={`${formId}-dark-desc`}
              />
              <div className="flex-1">
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  Dunkel
                </span>
                <p 
                  id={`${formId}-dark-desc`} 
                  className="text-xs text-gray-500 dark:text-gray-400 mt-0.5"
                >
                  Dunkles Farbschema zur Reduzierung der Augenbelastung
                </p>
              </div>
            </label>
          </div>
        </fieldset>
      </section>

      {/* Barrierefreiheits-Informationen */}
      <section className="space-y-4 pt-6 border-t border-gray-200 dark:border-gray-700" aria-labelledby="section-accessibility">
        <h2 
          id="section-accessibility" 
          className="text-lg font-semibold text-gray-900 dark:text-gray-100"
        >
          Barrierefreiheit
        </h2>
        
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
            Tastaturnavigation
          </h3>
          <dl className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex gap-2">
              <dt className="font-mono bg-gray-200 dark:bg-gray-700 px-2 py-0.5 rounded text-xs">Tab</dt>
              <dd>Zum nächsten Element navigieren</dd>
            </div>
            <div className="flex gap-2">
              <dt className="font-mono bg-gray-200 dark:bg-gray-700 px-2 py-0.5 rounded text-xs">Shift + Tab</dt>
              <dd>Zum vorherigen Element navigieren</dd>
            </div>
            <div className="flex gap-2">
              <dt className="font-mono bg-gray-200 dark:bg-gray-700 px-2 py-0.5 rounded text-xs">Enter / Leertaste</dt>
              <dd>Element aktivieren</dd>
            </div>
            <div className="flex gap-2">
              <dt className="font-mono bg-gray-200 dark:bg-gray-700 px-2 py-0.5 rounded text-xs">Escape</dt>
              <dd>Dialog schließen</dd>
            </div>
            <div className="flex gap-2">
              <dt className="font-mono bg-gray-200 dark:bg-gray-700 px-2 py-0.5 rounded text-xs">Pfeiltasten</dt>
              <dd>Innerhalb von Listen/Tabs navigieren</dd>
            </div>
          </dl>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
          <h3 className="text-sm font-medium text-blue-900 dark:text-blue-200 mb-2">
            WCAG 2.1 AA Konformität
          </h3>
          <p className="text-sm text-blue-800 dark:text-blue-300">
            Diese Anwendung wurde gemäß den Web Content Accessibility Guidelines (WCAG) 2.1 
            auf Stufe AA entwickelt. Bei Fragen zur Barrierefreiheit wenden Sie sich bitte 
            an den Support.
          </p>
        </div>
      </section>
    </div>
  );
}
