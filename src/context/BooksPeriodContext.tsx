import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

export type BooksPeriodPreset =
  | 'fy-2025-26'
  | 'fy-2024-25'
  | 'q1-2025-26'
  | 'q2-2025-26'
  | 'q3-2025-26'
  | 'q4-2025-26'
  | 'recent-2026'
  | 'custom';

export interface BooksPeriod {
  from: string;
  to: string;
  preset: BooksPeriodPreset;
}

export const PERIOD_PRESETS: {
  id: Exclude<BooksPeriodPreset, 'custom'>;
  label: string;
  from: string;
  to: string;
}[] = [
  { id: 'fy-2025-26', label: 'FY 2025-26', from: '2025-04-01', to: '2026-03-31' },
  { id: 'fy-2024-25', label: 'FY 2024-25', from: '2024-04-01', to: '2025-03-31' },
  { id: 'q1-2025-26', label: 'Q1 FY 2025-26', from: '2025-04-01', to: '2025-06-30' },
  { id: 'q2-2025-26', label: 'Q2 FY 2025-26', from: '2025-07-01', to: '2025-09-30' },
  { id: 'q3-2025-26', label: 'Q3 FY 2025-26', from: '2025-10-01', to: '2025-12-31' },
  { id: 'q4-2025-26', label: 'Q4 FY 2025-26', from: '2026-01-01', to: '2026-03-31' },
  {
    id: 'recent-2026',
    label: 'Recent activity (Jul–Sep 2026)',
    from: '2026-07-01',
    to: '2026-09-30',
  },
];

const DEFAULT_PERIOD: BooksPeriod = {
  from: '2025-04-01',
  to: '2026-03-31',
  preset: 'fy-2025-26',
};

function formatDisplayDate(iso: string): string {
  if (!iso) return '—';
  const d = new Date(`${iso}T12:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function formatPeriodLabel(from: string, to: string): string {
  return `${formatDisplayDate(from)} – ${formatDisplayDate(to)}`;
}

export function formatPeriodEndedLabel(to: string): string {
  return formatDisplayDate(to);
}

interface BooksPeriodContextValue {
  period: BooksPeriod;
  periodLabel: string;
  periodEndedLabel: string;
  setPreset: (preset: BooksPeriodPreset) => void;
  setFrom: (from: string) => void;
  setTo: (to: string) => void;
  setRange: (from: string, to: string) => void;
}

const BooksPeriodContext = createContext<BooksPeriodContextValue | null>(null);

export function BooksPeriodProvider({ children }: { children: ReactNode }) {
  const [period, setPeriod] = useState<BooksPeriod>(DEFAULT_PERIOD);

  const setPreset = useCallback((preset: BooksPeriodPreset) => {
    if (preset === 'custom') {
      setPeriod((p) => ({ ...p, preset: 'custom' }));
      return;
    }
    const match = PERIOD_PRESETS.find((p) => p.id === preset);
    if (!match) return;
    setPeriod({ from: match.from, to: match.to, preset: match.id });
  }, []);

  const setFrom = useCallback((from: string) => {
    setPeriod((p) => ({
      from,
      to: p.to < from ? from : p.to,
      preset: 'custom',
    }));
  }, []);

  const setTo = useCallback((to: string) => {
    setPeriod((p) => ({
      from: p.from > to ? to : p.from,
      to,
      preset: 'custom',
    }));
  }, []);

  const setRange = useCallback((from: string, to: string) => {
    setPeriod({ from, to, preset: 'custom' });
  }, []);

  const periodLabel = useMemo(
    () => formatPeriodLabel(period.from, period.to),
    [period.from, period.to],
  );
  const periodEndedLabel = useMemo(
    () => formatPeriodEndedLabel(period.to),
    [period.to],
  );

  const value = useMemo(
    () => ({
      period,
      periodLabel,
      periodEndedLabel,
      setPreset,
      setFrom,
      setTo,
      setRange,
    }),
    [period, periodLabel, periodEndedLabel, setPreset, setFrom, setTo, setRange],
  );

  return (
    <BooksPeriodContext.Provider value={value}>{children}</BooksPeriodContext.Provider>
  );
}

export function useBooksPeriod() {
  const ctx = useContext(BooksPeriodContext);
  if (!ctx) {
    throw new Error('useBooksPeriod must be used within BooksPeriodProvider');
  }
  return ctx;
}
