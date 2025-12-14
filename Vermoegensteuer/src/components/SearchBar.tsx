import { MagnifyingGlassIcon, CalendarIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useState, useId, useRef } from 'react';

interface SearchBarProps {
  onSearch?: (query: string) => void;
  onDateFilter?: () => void;
  /** Platzhaltertext */
  placeholder?: string;
  /** Label für das Suchfeld (Screenreader) */
  label?: string;
}

/**
 * SearchBar-Komponente mit vollständiger Barrierefreiheit
 * 
 * WCAG-Konformität:
 * - 1.3.1: Label programmatisch verknüpft
 * - 2.1.1: Vollständige Tastaturbedienung
 * - 2.4.6: Beschreibende Labels
 * - 3.3.2: Labels und Anweisungen
 */
export default function SearchBar({ 
  onSearch, 
  onDateFilter,
  placeholder = 'Suchen...',
  label = 'Suchbegriff eingeben'
}: SearchBarProps) {
  const [query, setQuery] = useState('');
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    onSearch?.(value);
  };

  const handleClear = () => {
    setQuery('');
    onSearch?.('');
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape' && query) {
      handleClear();
    }
  };

  return (
    <div className="flex items-center gap-3" role="search">
      <div className="relative flex-1 max-w-md">
        <label htmlFor={inputId} className="sr-only">
          {label}
        </label>
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <MagnifyingGlassIcon 
            className="h-5 w-5 text-gray-400 dark:text-gray-500" 
            aria-hidden="true" 
          />
        </div>
        <input
          ref={inputRef}
          id={inputId}
          type="search"
          placeholder={placeholder}
          value={query}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          className="block w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 text-sm"
          aria-describedby={query ? `${inputId}-hint` : undefined}
        />
        {query && (
          <>
            <span id={`${inputId}-hint`} className="sr-only">
              Drücken Sie Escape zum Löschen
            </span>
            <button
              type="button"
              onClick={handleClear}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none focus:text-gray-600"
              aria-label="Suche löschen"
            >
              <XMarkIcon className="h-4 w-4" aria-hidden="true" />
            </button>
          </>
        )}
      </div>
      {onDateFilter && (
        <button
          type="button"
          onClick={onDateFilter}
          className="inline-flex items-center gap-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
          aria-label="Nach Datum filtern"
        >
          <CalendarIcon className="h-4 w-4" aria-hidden="true" />
          <span>Datum</span>
        </button>
      )}
    </div>
  );
}
