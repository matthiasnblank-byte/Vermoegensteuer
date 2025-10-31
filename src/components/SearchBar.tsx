import { MagnifyingGlassIcon, CalendarIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

interface SearchBarProps {
  onSearch?: (query: string) => void;
  onDateFilter?: () => void;
}

export default function SearchBar({ onSearch, onDateFilter }: SearchBarProps) {
  const [query, setQuery] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    onSearch?.(value);
  };

  return (
    <div className="flex items-center gap-3">
      <div className="relative flex-1 max-w-md">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
        </div>
        <input
          type="text"
          placeholder="Suchen?"
          value={query}
          onChange={handleChange}
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 text-sm"
          aria-label="Suchfeld"
        />
      </div>
      {onDateFilter && (
        <button
          type="button"
          onClick={onDateFilter}
          className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
          aria-label="Datum-Filter"
        >
          <CalendarIcon className="h-4 w-4" aria-hidden="true" />
          Datum
        </button>
      )}
    </div>
  );
}
