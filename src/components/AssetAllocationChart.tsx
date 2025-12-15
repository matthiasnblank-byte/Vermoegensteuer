import { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { AssetPosition } from '../services/storageService';

interface AssetAllocationChartProps {
  assets: AssetPosition[];
}

// Premium color palette - vibrant and harmonious
const COLORS = [
  '#10B981', // Emerald
  '#3B82F6', // Blue
  '#F59E0B', // Amber
  '#8B5CF6', // Violet
  '#EC4899', // Pink
  '#06B6D4', // Cyan
];

export default function AssetAllocationChart({ assets }: AssetAllocationChartProps) {
  const data = useMemo(() => {
    const categoryTotals: Record<string, number> = {};

    assets.forEach(asset => {
      const current = categoryTotals[asset.kategorie] || 0;
      categoryTotals[asset.kategorie] = current + asset.positionswert;
    });

    return Object.entries(categoryTotals)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [assets]);

  const totalValue = useMemo(() =>
    data.reduce((sum, item) => sum + item.value, 0),
    [data]
  );

  if (data.length === 0) {
    return (
      <div className="flex h-96 items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 bg-gradient-to-br from-gray-50 to-white dark:border-gray-700 dark:from-gray-800 dark:to-gray-800/50">
        <p className="text-sm text-gray-500 dark:text-gray-400">Keine Daten für Visualisierung</p>
      </div>
    );
  }

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(value);

  const formatPercent = (value: number) =>
    `${((value / totalValue) * 100).toFixed(1)}%`;

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="rounded-xl bg-white/95 backdrop-blur-sm p-4 shadow-2xl border border-gray-200 dark:bg-gray-800/95 dark:border-gray-700">
          <p className="font-semibold text-gray-900 dark:text-gray-100 mb-2">{data.name}</p>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">
            {formatCurrency(data.value)}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {formatPercent(data.value)} vom Gesamtvermögen
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomLegend = ({ payload }: any) => {
    return (
      <div className="flex flex-wrap gap-3 justify-center mt-6">
        {payload.map((entry: any, index: number) => (
          <div key={`legend-${index}`} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-50 dark:bg-gray-800/50">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
              {entry.value}
            </span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="h-[500px] w-full rounded-2xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 p-6 shadow-xl ring-1 ring-gray-900/5 dark:ring-gray-700 hover:shadow-2xl transition-shadow duration-300">
      <div className="mb-4">
        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-1">
          Vermögensstruktur
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Verteilung nach Anlagekategorien
        </p>
      </div>

      <ResponsiveContainer width="100%" height="85%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="45%"
            innerRadius={90}
            outerRadius={140}
            paddingAngle={3}
            dataKey="value"
            animationBegin={0}
            animationDuration={800}
            label={({ percent }) => percent ? `${(percent * 100).toFixed(0)}%` : ''}
            labelLine={{ stroke: '#94a3b8', strokeWidth: 1 }}
          >
            {data.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
                className="hover:opacity-80 transition-opacity cursor-pointer"
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend content={<CustomLegend />} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
