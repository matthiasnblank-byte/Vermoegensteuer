import { useState, useId } from 'react';
import StatusChip from './StatusChip';
import Button from './Button';
import VisuallyHidden from './VisuallyHidden';

interface TableRow {
  id: string;
  title: string;
  subtitle?: string;
  betrag: number;
  status: { variant: 'success' | 'neutral' | 'warning'; label: string };
  faelligkeit?: string;
  datumA?: string;
  kennz?: string;
  erstellDatum: string;
}

interface DataTableProps {
  rows: TableRow[];
  /** Beschreibung der Tabelle für Screenreader */
  caption?: string;
  /** Callback für Primär-Aktion */
  onPrimaryAction?: (row: TableRow) => void;
  /** Callback für Sekundär-Aktion */
  onSecondaryAction?: (row: TableRow) => void;
  /** Label für Primär-Button */
  primaryActionLabel?: string;
  /** Label für Sekundär-Button */
  secondaryActionLabel?: string;
}

/**
 * DataTable-Komponente mit vollständiger WCAG 2.1 AA Konformität
 * 
 * Barrierefreiheits-Features:
 * - Semantische Tabellenstruktur mit caption
 * - Korrekte Header-Verknüpfung mit scope
 * - Tastaturnavigation
 * - Aussagekräftige Labels für alle interaktiven Elemente
 */
export default function DataTable({ 
  rows, 
  caption = 'Datentabelle',
  onPrimaryAction,
  onSecondaryAction,
  primaryActionLabel = 'Bearbeiten',
  secondaryActionLabel = 'Details',
}: DataTableProps) {
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const tableId = useId();

  const toggleRow = (id: string) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedRows(newSelected);
  };

  const toggleAll = () => {
    if (selectedRows.size === rows.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(rows.map((r) => r.id)));
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
    }).format(value);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('de-DE');
  };

  const isAllSelected = selectedRows.size === rows.length && rows.length > 0;
  const selectedCount = selectedRows.size;

  return (
    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 dark:ring-gray-700 rounded-lg">
      {/* Screenreader-Ankündigung für Auswahl */}
      {selectedCount > 0 && (
        <div role="status" aria-live="polite" className="sr-only">
          {selectedCount} von {rows.length} Zeilen ausgewählt
        </div>
      )}

      <table 
        className="min-w-full divide-y divide-gray-300 dark:divide-gray-700" 
        aria-labelledby={`${tableId}-caption`}
      >
        <caption 
          id={`${tableId}-caption`}
          className="sr-only"
        >
          {caption}. {rows.length} Einträge insgesamt.
          {selectedCount > 0 && ` ${selectedCount} ausgewählt.`}
        </caption>
        
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th scope="col" className="w-12 px-3 py-3">
              <input
                type="checkbox"
                checked={isAllSelected}
                onChange={toggleAll}
                className="h-4 w-4 text-blue-600 border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                aria-label={isAllSelected ? 'Alle Zeilen abwählen' : 'Alle Zeilen auswählen'}
              />
            </th>
            <th 
              scope="col" 
              className="px-3 py-3 text-left text-xs font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider"
            >
              Bezeichnung
            </th>
            <th 
              scope="col" 
              className="px-3 py-3 text-left text-xs font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider"
            >
              Betrag
            </th>
            <th 
              scope="col" 
              className="px-3 py-3 text-left text-xs font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider"
            >
              Status
            </th>
            <th 
              scope="col" 
              className="px-3 py-3 text-left text-xs font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider"
            >
              Fälligkeit
            </th>
            <th 
              scope="col" 
              className="px-3 py-3 text-left text-xs font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider"
            >
              Datum A
            </th>
            <th 
              scope="col" 
              className="px-3 py-3 text-left text-xs font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider"
            >
              <abbr title="Kennzeichen">Kennz.</abbr>
            </th>
            <th 
              scope="col" 
              className="px-3 py-3 text-left text-xs font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider"
            >
              Erstell-Datum
            </th>
            <th scope="col" className="relative px-3 py-3 w-32">
              <VisuallyHidden>Aktionen</VisuallyHidden>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
          {rows.map((row, index) => (
            <tr
              key={row.id}
              className={`hover:bg-neutral-50 dark:hover:bg-gray-800 transition-colors ${
                selectedRows.has(row.id) 
                  ? 'bg-blue-50 dark:bg-blue-900/20 ring-1 ring-blue-600 ring-inset' 
                  : ''
              }`}
              aria-selected={selectedRows.has(row.id)}
            >
              <td className="px-3 py-2">
                <input
                  type="checkbox"
                  checked={selectedRows.has(row.id)}
                  onChange={() => toggleRow(row.id)}
                  className="h-4 w-4 text-blue-600 border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
                  aria-label={`${row.title} auswählen`}
                  aria-describedby={`row-${row.id}-desc`}
                />
                <span id={`row-${row.id}-desc`} className="sr-only">
                  Zeile {index + 1}: {row.title}, Betrag {formatCurrency(row.betrag)}, Status {row.status.label}
                </span>
              </td>
              <td className="px-3 py-2">
                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {row.title}
                </div>
                {row.subtitle && (
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    {row.subtitle}
                  </div>
                )}
              </td>
              <td className="px-3 py-2 text-sm text-gray-900 dark:text-gray-100">
                {formatCurrency(row.betrag)}
              </td>
              <td className="px-3 py-2">
                <StatusChip variant={row.status.variant} label={row.status.label} />
              </td>
              <td className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
                {formatDate(row.faelligkeit)}
              </td>
              <td className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
                {formatDate(row.datumA)}
              </td>
              <td className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
                {row.kennz || '-'}
              </td>
              <td className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
                {formatDate(row.erstellDatum)}
              </td>
              <td className="px-3 py-2">
                <div className="flex items-center justify-end gap-2">
                  {onPrimaryAction && (
                    <Button 
                      variant="primary" 
                      onClick={() => onPrimaryAction(row)} 
                      className="text-xs py-1 px-2"
                      aria-label={`${primaryActionLabel}: ${row.title}`}
                    >
                      {primaryActionLabel}
                    </Button>
                  )}
                  {onSecondaryAction && (
                    <Button 
                      variant="secondary" 
                      onClick={() => onSecondaryAction(row)} 
                      className="text-xs py-1 px-2"
                      aria-label={`${secondaryActionLabel}: ${row.title}`}
                    >
                      {secondaryActionLabel}
                    </Button>
                  )}
                </div>
              </td>
            </tr>
          ))}
          {rows.length === 0 && (
            <tr>
              <td 
                colSpan={9} 
                className="px-3 py-8 text-center text-gray-500 dark:text-gray-400"
              >
                Keine Daten vorhanden
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
