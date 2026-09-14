import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { ChartPoint } from '../../../types/dashboard';

interface BarChartCardProps {
  title: string;
  data: ChartPoint[];
  color?: string;
  variant?: 'client' | 'admin';
}

export function BarChartCard({
  title,
  data,
  color,
  variant = 'admin',
}: BarChartCardProps) {
  const isAdmin = variant === 'admin';
  const fill = color ?? '#B89E6B';

  return (
    <div
      className={`rounded-2xl border p-4 sm:p-5 ${
        isAdmin ? 'border-admin-border bg-admin-surface' : 'border-[#D5D0C6] bg-white'
      }`}
    >
      <h3
        className={`mb-4 text-sm font-semibold ${
          isAdmin ? 'text-admin-text' : 'text-[#0E1217]'
        }`}
      >
        {title}
      </h3>
      <div className="h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={isAdmin ? '#E4E7EC' : '#D5D0C6'}
              vertical={false}
            />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 11, fill: isAdmin ? '#667085' : '#6B7580' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: isAdmin ? '#667085' : '#6B7580' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                borderRadius: 12,
                border: `1px solid ${isAdmin ? '#E4E7EC' : '#D5D0C6'}`,
                fontSize: 12,
              }}
            />
            <Bar dataKey="value" fill={fill} radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
