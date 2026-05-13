import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '../../utils/format';

interface TopProductsChartProps {
  data: Array<{
    name: string;
    code: string;
    quantity: number;
    revenue: number;
  }>;
}

export function TopProductsChart({ data }: TopProductsChartProps) {
  const formattedData = data.map(item => ({
    ...item,
    displayName: `${item.name} (${item.code})`,
  }));

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={formattedData}
          layout="vertical"
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis
            type="number"
            stroke="#64748b"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            type="category"
            dataKey="displayName"
            stroke="#64748b"
            fontSize={11}
            tickLine={false}
            axisLine={false}
            width={120}
            tick={{ textAnchor: 'end' }}
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
                name === 'quantity'
                  ? `${val} unidades`
                  : formatCurrency(val),
                name === 'quantity' ? 'Cantidad vendida' : 'Ingresos'
              ];
            }}
            labelStyle={{ color: '#374151', fontWeight: 'bold' }}
          />
          <Bar
            dataKey="quantity"
            fill="#10b981"
            radius={[0, 4, 4, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}