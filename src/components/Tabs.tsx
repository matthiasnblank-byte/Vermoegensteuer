import { Tab } from '@headlessui/react';
import { ReactNode } from 'react';

interface TabItem {
  label: string;
  badge?: number;
  content: ReactNode;
}

interface TabsProps {
  items: TabItem[];
  defaultIndex?: number;
}

export default function Tabs({ items, defaultIndex = 0 }: TabsProps) {
  return (
    <Tab.Group defaultIndex={defaultIndex}>
      <Tab.List className="flex space-x-1 border-b border-gray-200" aria-label="Tabs">
        {items.map((item, index) => (
          <Tab
            key={index}
            className={({ selected }) =>
              `px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 ${
                selected
                  ? 'border-b-2 border-blue-600 text-blue-700 font-semibold'
                  : 'text-gray-500 hover:text-gray-700 hover:border-b-2 hover:border-gray-300'
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
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}
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
          <Tab.Panel key={index}>
            {item.content}
          </Tab.Panel>
        ))}
      </Tab.Panels>
    </Tab.Group>
  );
}
