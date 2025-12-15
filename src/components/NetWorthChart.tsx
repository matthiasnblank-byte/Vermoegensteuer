import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { AssetPosition, SchuldPosition } from '../services/storageService';

interface NetWorthChartProps {
    assets: AssetPosition[];
    schulden: SchuldPosition[];
}

export default function NetWorthChart({ assets, schulden }: NetWorthChartProps) {
    const data = useMemo(() => {
        const totalAssets = assets.reduce((sum, a) => sum + a.positionswert, 0);
        const totalDebts = schulden.reduce((sum, s) => sum + s.nennbetrag, 0);
        const netWorth = totalAssets - totalDebts;

        return [
            {
                name: 'Vermögen',
                value: totalAssets,
                color: '#10B981',
                label: 'Brutto'
            },
            {
                name: 'Schulden',
                value: totalDebts,
                color: '#EF4444',
                label: 'Verbindlichkeiten'
            },
            {
                name: 'Reinvermögen',
                value: netWorth,
                color: '#3B82F6',
                label: 'Netto'
            },
        ];
    }, [assets, schulden]);

    const formatCurrency = (value: number) =>
        new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(value);

    const formatAxisCurrency = (value: number) => {
        if (value >= 1000000) {
            return `${(value / 1000000).toFixed(1)}M €`;
        } else if (value >= 1000) {
            return `${(value / 1000).toFixed(0)}k €`;
        }
        return `${value} €`;
    };

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="rounded-xl bg-white/95 backdrop-blur-sm p-4 shadow-2xl border border-gray-200 dark:bg-gray-800/95 dark:border-gray-700">
                    <p className="font-semibold text-gray-900 dark:text-gray-100 mb-2">{data.name}</p>
                    <p className="text-2xl font-bold mb-1" style={{ color: data.color }}>
                        {formatCurrency(data.value)}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{data.label}</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="h-[500px] w-full rounded-2xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 p-6 shadow-xl ring-1 ring-gray-900/5 dark:ring-gray-700 hover:shadow-2xl transition-shadow duration-300">
            <div className="mb-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                    Vermögensbilanz
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    Vergleich der finanziellen Positionen
                </p>
            </div>

            <ResponsiveContainer width="100%" height="85%">
                <BarChart
                    data={data}
                    margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 40,
                    }}
                >
                    <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke="#e5e7eb"
                        opacity={0.5}
                    />
                    <XAxis
                        dataKey="name"
                        tick={{ fill: '#6b7280', fontSize: 13, fontWeight: 500 }}
                        axisLine={{ stroke: '#e5e7eb' }}
                        tickLine={false}
                    />
                    <YAxis
                        tickFormatter={formatAxisCurrency}
                        tick={{ fill: '#6b7280', fontSize: 12 }}
                        axisLine={{ stroke: '#e5e7eb' }}
                        tickLine={false}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
                    <Bar
                        dataKey="value"
                        radius={[12, 12, 0, 0]}
                        animationBegin={0}
                        animationDuration={800}
                        maxBarSize={120}
                    >
                        {data.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={entry.color}
                                className="hover:opacity-80 transition-opacity cursor-pointer"
                            />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
