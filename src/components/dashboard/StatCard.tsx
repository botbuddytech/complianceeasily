import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  hint?: string;
  icon?: LucideIcon;
  tone?: 'default' | 'warning' | 'danger' | 'success' | 'admin';
  className?: string;
}

const TONE: Record<NonNullable<StatCardProps['tone']>, string> = {
  default: 'border-[#D5D0C6] bg-white text-[#0E1217] shadow-sm',
  warning: 'border-amber-200 bg-amber-50 text-amber-800',
  danger: 'border-red-200 bg-red-50 text-red-700',
  success: 'border-emerald-200 bg-emerald-50 text-emerald-800',
  admin: 'border-[#D5D0C6] bg-white text-[#0E1217] shadow-sm',
};

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  tone = 'default',
  className = '',
}: StatCardProps) {
  return (
    <div className={`rounded-2xl border p-4 ${TONE[tone]} ${className}`}>
      <div className="flex items-start justify-between gap-2">
        <div className="text-xs font-mono font-medium uppercase tracking-wider text-[#6B7580]">
          {label}
        </div>
        {Icon && <Icon className="h-4 w-4 shrink-0 text-[#B89E6B]" />}
      </div>
      <div className="mt-2 text-2xl font-bold font-mono tracking-tight">{value}</div>
      {hint && <div className="mt-1 text-xs text-[#6B7580]">{hint}</div>}
    </div>
  );
}

export function StatGrid({ children }: { children: ReactNode }) {
  return <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">{children}</div>;
}
