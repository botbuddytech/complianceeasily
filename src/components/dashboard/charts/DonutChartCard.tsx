import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import type { NamedValue } from '../../../types/dashboard';

interface DonutChartCardProps {
  title: string;
  data: NamedValue[];
  variant?: 'client' | 'admin';
}

const FALLBACK = ['#B89E6B', '#8A7349', '#0E1217', '#A8B0BA', '#D5D0C6'];

export function DonutChartCard({
  title,
  data,
  variant = 'admin',
}: DonutChartCardProps) {
  const isAdmin = variant === 'admin';

  return (
    <div
      className={`rounded-2xl border p-4 sm:p-5 ${
        isAdmin ? 'border-admin-border bg-admin-surface' : 'border-[#D5D0C6] bg-white'
      }`}
    >
      <h3
        className={`mb-2 text-sm font-semibold ${
          isAdmin ? 'text-admin-text' : 'text-[#0E1217]'
        }`}
      >
        {title}
      </h3>
      <div className="h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={55}
              outerRadius={80}
              paddingAngle={3}
            >
              {data.map((entry, i) => (
                <Cell key={entry.name} fill={entry.color ?? FALLBACK[i % FALLBACK.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                borderRadius: 12,
                border: `1px solid ${isAdmin ? '#E4E7EC' : '#D5D0C6'}`,
                fontSize: 12,
              }}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              iconType="circle"
              wrapperStyle={{ fontSize: 12 }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
