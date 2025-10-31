import { ArrowUpTrayIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import Button from './Button';

export default function HeaderCards() {
  return (
    <div className="flex gap-4">
      <div className="rounded-lg shadow-sm border border-gray-200 p-4 bg-white flex-1">
        <h3 className="text-sm font-semibold text-gray-900 mb-1">Card Title A</h3>
        <p className="text-xs text-gray-500 mb-3">Sekund?rer Text f?r Karte A</p>
        <Button variant="primary" onClick={() => {}}>
          <ArrowUpTrayIcon className="h-4 w-4" aria-hidden="true" />
          Upload
        </Button>
      </div>
      
      <div className="rounded-lg shadow-sm border border-gray-200 p-4 bg-white flex-1">
        <h3 className="text-sm font-semibold text-gray-900 mb-1">Card Title B</h3>
        <div className="flex items-center gap-2 mb-2">
          <ArrowPathIcon className="h-4 w-4 text-gray-400 animate-spin" aria-hidden="true" />
          <span className="text-xs text-gray-500">Prozess l?uft</span>
        </div>
        <p className="text-xs text-gray-500">Sekund?rer Text f?r Karte B</p>
      </div>
    </div>
  );
}
