import Tabs from '../components/Tabs';
import SearchBar from '../components/SearchBar';
import DataTable from '../components/DataTable';

const mockTableData = [
  {
    id: '1',
    title: 'Item A',
    subtitle: 'ID: 12345',
    betrag: 15000.50,
    status: { variant: 'success' as const, label: 'Aktiv' },
    faelligkeit: '2024-12-31',
    datumA: '2024-01-15',
    kennz: 'ABC-123',
    erstellDatum: '2024-01-01',
  },
  {
    id: '2',
    title: 'Item B',
    subtitle: 'ID: 67890',
    betrag: 8500.75,
    status: { variant: 'neutral' as const, label: 'In Bearbeitung' },
    faelligkeit: '2024-11-30',
    datumA: '2024-02-20',
    kennz: 'XYZ-456',
    erstellDatum: '2024-01-05',
  },
  {
    id: '3',
    title: 'Item C',
    subtitle: 'ID: 11111',
    betrag: 25000.00,
    status: { variant: 'warning' as const, label: '?berf?llig' },
    faelligkeit: '2024-10-15',
    datumA: '2024-03-10',
    kennz: 'DEF-789',
    erstellDatum: '2024-01-10',
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <Tabs
        items={[
          {
            label: 'Tab 1',
            badge: 5,
            content: (
              <div className="space-y-4">
                <SearchBar
                  onSearch={(query) => console.log('Search:', query)}
                  onDateFilter={() => console.log('Date filter')}
                />
                <DataTable rows={mockTableData} />
              </div>
            ),
          },
          {
            label: 'Tab 2',
            badge: 12,
            content: (
              <div className="space-y-4">
                <SearchBar
                  onSearch={(query) => console.log('Search:', query)}
                  onDateFilter={() => console.log('Date filter')}
                />
                <DataTable rows={mockTableData.slice(0, 2)} />
              </div>
            ),
          },
          {
            label: 'Tab 3',
            badge: 3,
            content: (
              <div className="space-y-4">
                <SearchBar
                  onSearch={(query) => console.log('Search:', query)}
                  onDateFilter={() => console.log('Date filter')}
                />
                <DataTable rows={mockTableData.slice(2)} />
              </div>
            ),
          },
        ]}
      />
    </div>
  );
}
