'use client';

import { type ReactNode } from 'react';
import { NavLink } from '@/components/nav/NextNav';
import {
  LayoutDashboard,
  Link2,
  BookOpen,
  ArrowLeftRight,
  Calculator,
  TrendingUp,
  Scale,
  Download,
  Receipt,
  FileSpreadsheet,
  Plug,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { BooksPeriodProvider } from '@/context/BooksPeriodContext';
import { PeriodRangeBar } from '@/components/books/PeriodRangeBar';

const TABS: { label: string; to: string; icon: LucideIcon }[] = [
  { label: 'Overview', to: '/dashboard/bookkeeping/overview', icon: LayoutDashboard },
  { label: 'Connections', to: '/dashboard/bookkeeping/connections', icon: Link2 },
  { label: 'Integrations', to: '/dashboard/bookkeeping/integrations', icon: Plug },
  { label: 'Ledgers', to: '/dashboard/bookkeeping/ledgers', icon: BookOpen },
  { label: 'Transactions', to: '/dashboard/bookkeeping/transactions', icon: ArrowLeftRight },
  { label: 'GST', to: '/dashboard/bookkeeping/gst', icon: Receipt },
  { label: 'TDS / TCS', to: '/dashboard/bookkeeping/tds', icon: FileSpreadsheet },
  { label: 'Income Tax', to: '/dashboard/bookkeeping/income-tax', icon: Calculator },
  { label: 'Profit & Loss', to: '/dashboard/bookkeeping/profit-loss', icon: TrendingUp },
  { label: 'Balance Sheet', to: '/dashboard/bookkeeping/balance-sheet', icon: Scale },
  { label: 'Exports', to: '/dashboard/bookkeeping/exports', icon: Download },
];

export function BookkeepingLayout({ children }: { children: ReactNode }) {
  return (
    <BooksPeriodProvider>
      <div className="-mx-4 -my-4 flex min-h-[calc(100svh-3.5rem)] flex-col sm:-mx-6 sm:-my-6 lg:-mx-8 lg:-my-8 lg:flex-row">
        <aside className="hidden w-56 shrink-0 border-r border-[#D5D0C6] bg-[#EBE8E2]/80 lg:block">
          <div className="sticky top-0 p-3">
            <div className="mb-3 px-2 pt-2 font-mono text-[10px] font-bold uppercase tracking-wider text-[#6B7580]">
              Bookkeeping
            </div>
            <nav className="space-y-0.5">
              {TABS.map((tab) => {
                const Icon = tab.icon;
                return (
                  <NavLink
                    key={tab.to}
                    to={tab.to}
                    className={({ isActive }) =>
                      `flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-[#0E1217] text-white'
                          : 'text-[#5C6570] hover:bg-white hover:text-[#0E1217]'
                      }`
                    }
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    {tab.label}
                  </NavLink>
                );
              })}
            </nav>
          </div>
        </aside>

        <div className="sticky top-0 z-10 border-b border-[#D5D0C6] bg-[#F4F2EE]/95 px-3 py-2 backdrop-blur lg:hidden">
          <div className="mb-1.5 px-1 font-mono text-[10px] font-bold uppercase tracking-wider text-[#6B7580]">
            Bookkeeping
          </div>
          <nav className="-mx-1 flex gap-1 overflow-x-auto pb-1">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              return (
                <NavLink
                  key={tab.to}
                  to={tab.to}
                  className={({ isActive }) =>
                    `inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
                      isActive
                        ? 'border-[#0E1217] bg-[#0E1217] text-white'
                        : 'border-[#D5D0C6] bg-white text-[#5C6570]'
                    }`
                  }
                >
                  <Icon className="h-3.5 w-3.5" />
                  {tab.label}
                </NavLink>
              );
            })}
          </nav>
        </div>

        <div className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
          <PeriodRangeBar variant="client" />
          {children}
        </div>
      </div>
    </BooksPeriodProvider>
  );
}
