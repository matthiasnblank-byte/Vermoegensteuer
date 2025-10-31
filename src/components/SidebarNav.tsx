import { NavLink } from 'react-router-dom';
import { 
  DocumentTextIcon, 
  CurrencyDollarIcon,
  ChartBarIcon 
} from '@heroicons/react/24/outline';

interface NavItem {
  name: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
}

const navigation: NavItem[] = [
  { name: 'Dashboard', path: '/', icon: ChartBarIcon, badge: 12 },
  { name: 'Stammdaten', path: '/stammdaten', icon: DocumentTextIcon },
  { name: 'Finanzanlagen', path: '/finanzanlagen', icon: CurrencyDollarIcon, badge: 5 },
];

export default function SidebarNav() {
  return (
    <div className="flex flex-col w-60 bg-white border-r border-gray-200 h-full">
      <div className="p-4">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-4">
          Hauptnavigation
        </h2>
        <nav className="space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span className="inline-flex items-center justify-center min-w-[1.5rem] h-6 px-1.5 text-xs font-medium text-gray-700 bg-gray-100 rounded-full">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto p-4 border-t border-gray-200">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-4">
          Verwaltung
        </h2>
        <nav className="space-y-1">
          <a
            href="#"
            className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-50 hover:text-gray-900"
          >
            <DocumentTextIcon className="h-5 w-5" aria-hidden="true" />
            <span>Item A</span>
          </a>
          <a
            href="#"
            className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-50 hover:text-gray-900"
          >
            <DocumentTextIcon className="h-5 w-5" aria-hidden="true" />
            <span>Item B</span>
          </a>
        </nav>
      </div>
    </div>
  );
}
