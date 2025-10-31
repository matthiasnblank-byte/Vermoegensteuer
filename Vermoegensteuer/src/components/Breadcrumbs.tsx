import { ChevronRightIcon } from '@heroicons/react/24/outline';

interface BreadcrumbsProps {
  items: string[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-sm">
      {items.map((item, index) => (
        <div key={index} className="flex items-center space-x-2">
          {index > 0 && (
            <ChevronRightIcon className="h-4 w-4 text-gray-400" aria-hidden="true" />
          )}
          <span
            className={`${
              index === items.length - 1
                ? 'text-gray-900 dark:text-gray-100 font-medium'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            {item}
          </span>
        </div>
      ))}
    </nav>
  );
}
