import { Tab } from '@headlessui/react';
import { ReactNode, useId } from 'react';

interface TabItem {
  label: string;
  badge?: number;
  content: ReactNode;
  /** Optionale ID für das Tab-Panel */
  id?: string;
}

interface TabsProps {
  items: TabItem[];
  defaultIndex?: number;
  /** Beschreibung der Tab-Gruppe für Screenreader */
  ariaLabel?: string;
  /** Callback bei Tab-Wechsel */
  onChange?: (index: number) => void;
}

/**
 * Tabs-Komponente mit vollständiger Barrierefreiheit
 * 
 * WCAG-Konformität:
 * - 1.3.1: Semantische Tab-Struktur mit role="tablist"
 * - 2.1.1: Tastaturnavigation mit Pfeiltasten
 * - 2.4.6: Beschreibende Tab-Labels
 * - 4.1.2: Korrekte ARIA-Zustände (aria-selected, aria-controls)
 */
export default function Tabs({ 
  items, 
  defaultIndex = 0, 
  ariaLabel = 'Tabs',
  onChange 
}: TabsProps) {
  const tabsId = useId();

  return (
    <Tab.Group 
      defaultIndex={defaultIndex}
      onChange={onChange}
    >
      <Tab.List 
        className="flex space-x-1 border-b border-gray-200 dark:border-gray-700 overflow-x-auto" 
        aria-label={ariaLabel}
      >
        {items.map((item, index) => (
          <Tab
            key={index}
            id={`${tabsId}-tab-${index}`}
            aria-controls={`${tabsId}-panel-${index}`}
            className={({ selected }) =>
              `px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap
              focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-inset
              ${
                selected
                  ? 'border-b-2 border-blue-600 text-blue-700 dark:text-blue-400 font-semibold -mb-px'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-b-2 hover:border-gray-300 dark:hover:border-gray-600 -mb-px'
              }`
            }
          >
            {({ selected }) => (
              <div className="flex items-center gap-2">
                <span>{item.label}</span>
                {item.badge !== undefined && (
                  <span
                    className={`inline-flex items-center justify-center min-w-[1.25rem] h-5 px-1.5 text-xs font-medium rounded-full ${
                      selected
                        ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                    aria-label={`${item.badge} Elemente`}
                  >
                    {item.badge}
                  </span>
                )}
              </div>
            )}
          </Tab>
        ))}
      </Tab.List>
      <Tab.Panels className="mt-4">
        {items.map((item, index) => (
          <Tab.Panel 
            key={index}
            id={`${tabsId}-panel-${index}`}
            aria-labelledby={`${tabsId}-tab-${index}`}
            className="focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 dark:focus:ring-offset-gray-900 rounded-lg"
            tabIndex={0}
          >
            {item.content}
          </Tab.Panel>
        ))}
      </Tab.Panels>
    </Tab.Group>
  );
}
