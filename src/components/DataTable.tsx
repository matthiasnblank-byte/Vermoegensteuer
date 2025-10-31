import { useState } from 'react';
import StatusChip from './StatusChip';
import Button from './Button';

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
}

export default function DataTable({ rows }: DataTableProps) {
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());

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

  return (
    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
      <table className="min-w-full divide-y divide-gray-300" role="table" aria-label="Datentabelle">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="w-12 px-3 py-3">
              <input
                type="checkbox"
                checked={selectedRows.size === rows.length && rows.length > 0}
                onChange={toggleAll}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-600"
                aria-label="Alle Zeilen ausw?hlen"
              />
            </th>
            <th scope="col" className="px-3 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
              Spalte A
            </th>
            <th scope="col" className="px-3 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
              Betrag/Nummer
            </th>
            <th scope="col" className="px-3 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
              Status/Match
            </th>
            <th scope="col" className="px-3 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
              F?lligkeit
            </th>
            <th scope="col" className="px-3 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
              Datum A
            </th>
            <th scope="col" className="px-3 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
              Kennz.
            </th>
            <th scope="col" className="px-3 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
              Erstell-Datum
            </th>
            <th scope="col" className="relative px-3 py-3 w-32">
              <span className="sr-only">Aktionen</span>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {rows.map((row) => (
            <tr
              key={row.id}
              className={`hover:bg-neutral-50 transition-colors ${
                selectedRows.has(row.id) ? 'ring-1 ring-blue-600' : ''
              }`}
            >
              <td className="px-3 py-2">
                <input
                  type="checkbox"
                  checked={selectedRows.has(row.id)}
                  onChange={() => toggleRow(row.id)}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-600"
                  aria-label={`Zeile ${row.id} ausw?hlen`}
                />
              </td>
              <td className="px-3 py-2">
                <div className="text-sm font-medium text-gray-900">{row.title}</div>
                {row.subtitle && (
                  <div className="text-xs text-gray-500 mt-0.5">{row.subtitle}</div>
                )}
              </td>
              <td className="px-3 py-2 text-sm text-gray-900">
                {formatCurrency(row.betrag)}
              </td>
              <td className="px-3 py-2">
                <StatusChip variant={row.status.variant} label={row.status.label} />
              </td>
              <td className="px-3 py-2 text-sm text-gray-500">
                {formatDate(row.faelligkeit)}
              </td>
              <td className="px-3 py-2 text-sm text-gray-500">
                {formatDate(row.datumA)}
              </td>
              <td className="px-3 py-2 text-sm text-gray-500">
                {row.kennz || '-'}
              </td>
              <td className="px-3 py-2 text-sm text-gray-500">
                {formatDate(row.erstellDatum)}
              </td>
              <td className="px-3 py-2">
                <div className="flex items-center justify-end gap-2">
                  <Button variant="primary" onClick={() => {}} className="text-xs py-1 px-2">
                    Primary
                  </Button>
                  <Button variant="secondary" onClick={() => {}} className="text-xs py-1 px-2">
                    Secondary
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
