import { ChevronRightIcon } from '@heroicons/react/24/outline';

interface BreadcrumbsProps {
  items: string[];
}

/**
 * Breadcrumbs-Komponente mit vollständiger Barrierefreiheit
 * 
 * WCAG-Konformität:
 * - 1.3.1: Semantische Struktur mit nav und ol
 * - 2.4.8: Aktuelle Position gekennzeichnet
 * - 4.1.2: aria-current für aktuelle Seite
 */
export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <nav aria-label="Navigationspfad" className="flex items-center">
      <ol className="flex items-center space-x-2 text-sm" role="list">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          
          return (
            <li key={index} className="flex items-center">
              {index > 0 && (
                <ChevronRightIcon 
                  className="h-4 w-4 text-gray-400 dark:text-gray-500 mx-2 flex-shrink-0" 
                  aria-hidden="true" 
                />
              )}
              <span
                className={`${
                  isLast
                    ? 'text-gray-900 dark:text-gray-100 font-medium'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
                aria-current={isLast ? 'page' : undefined}
              >
                {item}
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
