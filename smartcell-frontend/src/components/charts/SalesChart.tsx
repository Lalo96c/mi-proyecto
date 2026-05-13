import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '../../utils/format';

interface SalesChartProps {
  data: Array<{
    month: string;
    total: number;
    count: number;
  }>;
}

export function SalesChart({ data }: SalesChartProps) {
  const formattedData = data.map(item => ({
    ...item,
    monthLabel: new Date(item.month + '-01').toLocaleDateString('es-ES', {
      month: 'short',
      year: '2-digit'
    }),
  }));

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={formattedData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis
            dataKey="monthLabel"
            stroke="#64748b"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#64748b"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `$${value.toLocaleString()}`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
            }}
            formatter={(value, name) => {
              const val = Number(value ?? 0);

              return [
                name === 'total' ? formatCurrency(val) : val,
                name === 'total' ? 'Ventas' : 'Cantidad'
              ];
            }}
            labelStyle={{ color: '#374151' }}
          />
          <Line
            type="monotone"
            dataKey="total"
            stroke="#4f46e5"
            strokeWidth={3}
            dot={{ fill: '#4f46e5', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: '#4f46e5', strokeWidth: 2, fill: 'white' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}