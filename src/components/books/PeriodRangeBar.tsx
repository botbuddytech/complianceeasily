import { CalendarRange } from 'lucide-react';
import {
  PERIOD_PRESETS,
  useBooksPeriod,
  type BooksPeriodPreset,
} from '../../context/BooksPeriodContext';

interface PeriodRangeBarProps {
  variant?: 'client' | 'admin';
  className?: string;
}

export function PeriodRangeBar({ variant = 'client', className = '' }: PeriodRangeBarProps) {
  const { period, periodLabel, setPreset, setFrom, setTo } = useBooksPeriod();
  const isAdmin = variant === 'admin';

  const shell = isAdmin
    ? 'border-admin-border bg-admin-surface'
    : 'border-[#D5D0C6] bg-white';
  const label = isAdmin ? 'text-admin-muted' : 'text-[#6B7580]';
  const ink = isAdmin ? 'text-admin-text' : 'text-[#0E1217]';
  const control = isAdmin
    ? 'border-admin-border bg-admin-bg text-admin-text'
    : 'border-[#D5D0C6] bg-[#F4F2EE] text-[#0E1217]';

  return (
    <div
      className={`mb-4 flex flex-col gap-3 rounded-xl border px-3 py-3 sm:mb-6 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between sm:px-4 ${shell} ${className}`}
    >
      <div className="min-w-0">
        <div className={`flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-wider ${label}`}>
          <CalendarRange className="h-3.5 w-3.5" />
          Reporting period
        </div>
        <div className={`mt-1 text-sm font-semibold ${ink}`}>{periodLabel}</div>
      </div>

      <div className="flex flex-col gap-2 w-full sm:w-auto sm:flex-row sm:flex-wrap sm:items-end">
        <label className="block w-full sm:w-auto sm:min-w-[9.5rem]">
          <span className={`mb-1 block font-mono text-[10px] font-bold uppercase tracking-wider ${label}`}>
            Preset
          </span>
          <select
            value={period.preset === 'custom' ? 'custom' : period.preset}
            onChange={(e) => setPreset(e.target.value as BooksPeriodPreset)}
            className={`w-full rounded-lg border px-2.5 py-1.5 text-sm ${control}`}
          >
            {PERIOD_PRESETS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
            <option value="custom">Custom range</option>
          </select>
        </label>

        <label className="block w-full sm:w-auto sm:min-w-[9rem]">
          <span className={`mb-1 block font-mono text-[10px] font-bold uppercase tracking-wider ${label}`}>
            From
          </span>
          <input
            type="date"
            value={period.from}
            max={period.to}
            onChange={(e) => setFrom(e.target.value)}
            className={`w-full rounded-lg border px-2.5 py-1.5 font-mono text-sm ${control}`}
          />
        </label>

        <label className="block w-full sm:w-auto sm:min-w-[9rem]">
          <span className={`mb-1 block font-mono text-[10px] font-bold uppercase tracking-wider ${label}`}>
            To
          </span>
          <input
            type="date"
            value={period.to}
            min={period.from}
            onChange={(e) => setTo(e.target.value)}
            className={`w-full rounded-lg border px-2.5 py-1.5 font-mono text-sm ${control}`}
          />
        </label>
      </div>
    </div>
  );
}
