import { useMemo, useState } from 'react';
import { Calendar, List, CalendarDays } from 'lucide-react';
import { PageHeader } from '../../components/dashboard/PageHeader';
import { StatusBadge } from '../../components/dashboard/StatusBadge';
import { DataTable, type Column } from '../../components/dashboard/DataTable';
import { EmptyState } from '../../components/dashboard/EmptyState';
import { FilingsCalendar } from '../../components/dashboard/FilingsCalendar';
import { FILINGS } from '../../data/dashboard/filings';
import type { Filing, FilingStatus } from '../../types/dashboard';

type ViewMode = 'list' | 'calendar';

const VIEWS: { id: ViewMode; label: string; icon: typeof List }[] = [
  { id: 'list', label: 'List', icon: List },
  { id: 'calendar', label: 'Calendar', icon: CalendarDays },
];

const FILTERS: { id: 'all' | FilingStatus; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'action_required', label: 'Action' },
  { id: 'upcoming', label: 'Upcoming' },
  { id: 'overdue', label: 'Overdue' },
  { id: 'need_info', label: 'Need Info' },
  { id: 'filed', label: 'Filed' },
];

export function FilingsPage() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]['id']>('all');
  const [view, setView] = useState<ViewMode>('calendar');

  const rows = useMemo(() => {
    const sorted = [...FILINGS].sort((a, b) => a.dueDate.localeCompare(b.dueDate));
    if (filter === 'all') return sorted;
    return sorted.filter((f) => f.status === filter);
  }, [filter]);

  const byMonth = useMemo(() => {
    const map = new Map<string, Filing[]>();
    for (const f of rows) {
      const key = f.dueDate.slice(0, 7);
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(f);
    }
    return [...map.entries()];
  }, [rows]);

  const columns: Column<Filing>[] = [
    {
      key: 'name',
      header: 'Filing',
      render: (f) => (
        <div>
          <div className="font-semibold text-[#0E1217]">{f.name}</div>
          <div className="font-mono text-[11px] text-[#6B7580]">
            {f.department} · {f.periodLabel}
          </div>
        </div>
      ),
    },
    {
      key: 'entity',
      header: 'Entity',
      render: (f) => <span className="font-mono text-xs">{f.entityName}</span>,
    },
    {
      key: 'due',
      header: 'Due',
      render: (f) => (
        <span className="inline-flex items-center gap-1 font-mono text-xs">
          <Calendar className="h-3.5 w-3.5 text-[#6B7580]" />
          {f.dueDate}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (f) => <StatusBadge status={f.status} />,
    },
    {
      key: 'pro',
      header: 'Professional',
      render: (f) => (
        <span className="font-mono text-xs text-[#5C6570]">{f.assignedProfessional ?? '—'}</span>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Filings & Calendar"
        description="Upcoming, overdue, and completed statutory filings across your entities."
        actions={
          <div className="inline-flex rounded-lg border border-[#D5D0C6] bg-white p-0.5">
            {VIEWS.map((v) => {
              const Icon = v.icon;
              return (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => setView(v.id)}
                  className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-mono font-semibold transition-colors ${
                    view === v.id
                      ? 'bg-[#0E1217] text-white'
                      : 'text-[#5C6570] hover:bg-[#EBE8E2]'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {v.label}
                </button>
              );
            })}
          </div>
        }
      />

      <div className="mb-4 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setFilter(f.id)}
            className={`rounded-full border px-3 py-1 text-xs font-mono font-semibold transition-colors ${
              filter === f.id
                ? 'border-[#0E1217] bg-[#0E1217] text-white'
                : 'border-[#D5D0C6] bg-white text-[#5C6570] hover:bg-[#EBE8E2]'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {view === 'calendar' ? (
        <FilingsCalendar filings={rows} />
      ) : (
        <>
          {/* Month groups (calendar-style) */}
          <div className="mb-6 space-y-3">
            {byMonth.map(([month, items]) => (
              <div
                key={month}
                className="rounded-xl border border-[#D5D0C6] bg-[#EBE8E2]/60 px-4 py-3"
              >
                <div className="mb-2 font-mono text-[11px] font-bold uppercase tracking-wider text-[#B89E6B]">
                  {month}
                </div>
                <div className="flex flex-wrap gap-2">
                  {items.map((f) => (
                    <span
                      key={f.id}
                      className="inline-flex items-center gap-2 rounded-lg border border-[#D5D0C6] bg-white px-2.5 py-1.5 text-xs"
                    >
                      <span className="font-mono font-semibold">{f.shortName}</span>
                      <StatusBadge status={f.status} />
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <DataTable
            columns={columns}
            rows={rows}
            rowKey={(r) => r.id}
            empty={
              <EmptyState
                title="No filings match this filter"
                description="Try another status tab."
              />
            }
          />
        </>
      )}
    </div>
  );
}
