'use client';

import { Menu, Search, Bell, Calendar } from 'lucide-react';
import type { DashboardVariant } from './navConfig';
import { RoleSwitcher } from './RoleSwitcher';

interface TopbarProps {
  variant: DashboardVariant;
  title?: string;
  onOpenMobile: () => void;
}

function formatToday() {
  return new Date().toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function Topbar({ variant, title, onOpenMobile }: TopbarProps) {
  const avatar =
    variant === 'admin' ? 'AD' : variant === 'professional' ? 'PS' : 'AO';
  const today = formatToday();

  return (
    <header className="sticky top-0 z-20 flex h-14 items-center gap-2 sm:gap-3 border-b border-[#D5D0C6] bg-[#F4F2EE]/95 text-[#0E1217] backdrop-blur px-3 sm:px-6 min-w-0">
      <button
        type="button"
        onClick={onOpenMobile}
        className="inline-flex rounded-lg p-2 hover:bg-[#EBE8E2] lg:hidden shrink-0"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="min-w-0 flex-1">
        {title ? (
          <h1 className="truncate text-sm font-semibold sm:text-base">{title}</h1>
        ) : (
          <div className="hidden max-w-md items-center gap-2 rounded-lg border border-[#D5D0C6] bg-white px-3 py-1.5 text-sm text-[#6B7580] sm:flex">
            <Search className="h-4 w-4 shrink-0" />
            <span className="font-mono text-xs">Search (UI only)…</span>
          </div>
        )}
      </div>

      <div
        className="hidden items-center gap-1.5 rounded-lg px-2.5 py-1.5 font-mono text-xs text-[#6B7580] sm:inline-flex shrink-0"
        title={today}
      >
        <Calendar className="h-3.5 w-3.5 shrink-0" />
        <time dateTime={new Date().toISOString().slice(0, 10)}>{today}</time>
      </div>

      <button
        type="button"
        className="relative rounded-lg p-2 hover:bg-[#EBE8E2] shrink-0"
        aria-label="Notifications"
      >
        <Bell className="h-4 w-4" />
        <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-[#B89E6B]" />
      </button>

      <div className="min-w-0 shrink">
        <RoleSwitcher variant={variant} />
      </div>

      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#B89E6B] text-xs font-bold text-white shrink-0">
        {avatar}
      </div>
    </header>
  );
}
