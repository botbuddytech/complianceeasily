import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react';
import { StatusBadge } from './StatusBadge';
import { EmptyState } from './EmptyState';
import type { Filing } from '../../types/dashboard';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function dateKey(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

interface CalendarCell {
  key: string;
  day: number;
  inMonth: boolean;
}

function buildMonthGrid(year: number, month: number): CalendarCell[] {
  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const cells: CalendarCell[] = [];

  // Leading days from previous month.
  for (let i = 0; i < firstWeekday; i++) {
    const day = daysInPrevMonth - firstWeekday + 1 + i;
    const prevMonthDate = new Date(year, month - 1, day);
    cells.push({
      key: dateKey(prevMonthDate.getFullYear(), prevMonthDate.getMonth(), day),
      day,
      inMonth: false,
    });
  }

  // Current month days.
  for (let day = 1; day <= daysInMonth; day++) {
    cells.push({ key: dateKey(year, month, day), day, inMonth: true });
  }

  // Trailing days from next month to complete full weeks (multiple of 7).
  let nextDay = 1;
  while (cells.length % 7 !== 0) {
    const nextMonthDate = new Date(year, month + 1, nextDay);
    cells.push({
      key: dateKey(nextMonthDate.getFullYear(), nextMonthDate.getMonth(), nextDay),
      day: nextDay,
      inMonth: false,
    });
    nextDay += 1;
  }

  return cells;
}

interface FilingsCalendarProps {
  filings: Filing[];
}

export function FilingsCalendar({ filings }: FilingsCalendarProps) {
  const today = new Date();
  const [cursor, setCursor] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const todayKey = dateKey(today.getFullYear(), today.getMonth(), today.getDate());

  const byDate = useMemo(() => {
    const map = new Map<string, Filing[]>();
    for (const f of filings) {
      if (!map.has(f.dueDate)) map.set(f.dueDate, []);
      map.get(f.dueDate)!.push(f);
    }
    return map;
  }, [filings]);

  const cells = useMemo(() => buildMonthGrid(year, month), [year, month]);
  const monthLabel = cursor.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });

  const goToMonth = (offset: number) => {
    setCursor(new Date(year, month + offset, 1));
    setSelectedDate(null);
  };

  const goToToday = () => {
    setCursor(new Date(today.getFullYear(), today.getMonth(), 1));
    setSelectedDate(todayKey);
  };

  const selectedFilings = selectedDate ? byDate.get(selectedDate) ?? [] : [];

  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-2 rounded-2xl border border-[#D5D0C6] bg-white px-3 py-2.5 sm:px-4">
        <button
          type="button"
          onClick={() => goToMonth(-1)}
          aria-label="Previous month"
          className="rounded-lg border border-[#D5D0C6] p-1.5 text-[#5C6570] hover:border-[#B89E6B] hover:bg-[#EBE8E2]"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-2 font-display text-base font-semibold text-[#0E1217] sm:text-lg">
          <CalendarDays className="h-4 w-4 text-[#6B7580]" />
          {monthLabel}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={goToToday}
            className="rounded-lg border border-[#D5D0C6] px-2.5 py-1 text-xs font-mono font-semibold text-[#5C6570] hover:border-[#B89E6B] hover:bg-[#EBE8E2]"
          >
            Today
          </button>
          <button
            type="button"
            onClick={() => goToMonth(1)}
            aria-label="Next month"
            className="rounded-lg border border-[#D5D0C6] p-1.5 text-[#5C6570] hover:border-[#B89E6B] hover:bg-[#EBE8E2]"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-[#D5D0C6] bg-white">
        <div className="grid grid-cols-7 border-b border-[#D5D0C6] bg-[#EBE8E2] text-center">
          {WEEKDAYS.map((w) => (
            <div
              key={w}
              className="px-1 py-2 font-mono text-[10px] font-semibold uppercase tracking-wider text-[#6B7580] sm:text-[11px]"
            >
              {w}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7">
          {cells.map(({ key, day, inMonth }, i) => {
            const items = byDate.get(key) ?? [];
            const isToday = key === todayKey;
            const isSelected = key === selectedDate;
            const isRightEdge = i % 7 === 6;
            const isBottomEdge = i >= cells.length - 7;

            return (
              <button
                type="button"
                key={key}
                onClick={() => items.length && setSelectedDate(key)}
                className={`min-h-[76px] border-b border-r p-1.5 text-left align-top transition-colors sm:min-h-[96px] sm:p-2 ${
                  isRightEdge ? 'border-r-0' : 'border-[#EBE8E2]'
                } ${isBottomEdge ? 'border-b-0' : 'border-[#EBE8E2]'} ${
                  inMonth ? 'bg-white' : 'bg-[#F4F2EE]'
                } ${isSelected ? 'ring-2 ring-inset ring-[#B89E6B]' : ''} ${
                  items.length ? 'cursor-pointer hover:bg-[#EBE8E2]/70' : 'cursor-default'
                }`}
              >
                <div className="mb-1 flex items-center justify-between">
                  <span
                    className={`font-mono text-[11px] sm:text-xs ${
                      isToday
                        ? 'flex h-5 w-5 items-center justify-center rounded-full bg-[#B89E6B] font-bold text-white'
                        : inMonth
                          ? 'text-[#5C6570]'
                          : 'text-[#9AA3AD]'
                    }`}
                  >
                    {day}
                  </span>
                  {items.length > 0 && (
                    <span className="hidden h-1.5 w-1.5 rounded-full bg-[#B89E6B] sm:inline-block" />
                  )}
                </div>
                <div className="space-y-1">
                  {items.slice(0, 2).map((f) => (
                    <div
                      key={f.id}
                      className="truncate rounded border border-[#D5D0C6] bg-[#EBE8E2] px-1 py-0.5 text-[9px] font-mono font-semibold text-[#B89E6B] sm:text-[10px]"
                      title={`${f.name} · ${f.entityName}`}
                    >
                      {f.shortName}
                    </div>
                  ))}
                  {items.length > 2 && (
                    <div className="text-[9px] font-mono text-[#6B7580] sm:text-[10px]">
                      +{items.length - 2} more
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-4">
        {selectedDate ? (
          selectedFilings.length > 0 ? (
            <div className="rounded-2xl border border-[#D5D0C6] bg-[#EBE8E2]/60 p-4">
              <div className="mb-3 font-mono text-[11px] font-bold uppercase tracking-wider text-[#B89E6B]">
                {selectedFilings.length} filing{selectedFilings.length > 1 ? 's' : ''} due ·{' '}
                {selectedDate}
              </div>
              <div className="space-y-2">
                {selectedFilings.map((f) => (
                  <div
                    key={f.id}
                    className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[#D5D0C6] bg-white px-3 py-2.5"
                  >
                    <div className="min-w-0">
                      <div className="font-semibold text-[#0E1217]">{f.name}</div>
                      <div className="font-mono text-[11px] text-[#6B7580]">
                        {f.entityName} · {f.department} · {f.periodLabel}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {f.assignedProfessional && (
                        <span className="font-mono text-xs text-[#5C6570]">
                          {f.assignedProfessional}
                        </span>
                      )}
                      <StatusBadge status={f.status} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <EmptyState
              title="No filings due on this date"
              description="Pick another highlighted date on the calendar."
            />
          )
        ) : (
          <p className="rounded-2xl border border-dashed border-[#D5D0C6] bg-[#F4F2EE] px-4 py-6 text-center font-mono text-xs text-[#6B7580]">
            Select a highlighted date to see the filings due for your company on that day.
          </p>
        )}
      </div>
    </div>
  );
}
