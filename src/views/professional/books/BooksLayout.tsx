'use client';

import { NavLink } from '@/components/nav/NextNav';
import {
  LayoutDashboard,
  BookOpen,
  ArrowLeftRight,
  Calculator,
  TrendingUp,
  Scale,
  Receipt,
  FileSpreadsheet,
  Plug,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { type ReactNode } from 'react';
import {
  ProfessionalBooksProvider,
  useProfessionalBooks,
} from '../../../context/ProfessionalBooksContext';
import { BooksPeriodProvider } from '../../../context/BooksPeriodContext';
import { PeriodRangeBar } from '../../../components/books/PeriodRangeBar';

const TABS: { label: string; to: string; icon: LucideIcon }[] = [
  { label: 'Overview', to: '/professional/books/overview', icon: LayoutDashboard },
  { label: 'Integrations', to: '/professional/books/integrations', icon: Plug },
  { label: 'Ledgers', to: '/professional/books/ledgers', icon: BookOpen },
  { label: 'Transactions', to: '/professional/books/transactions', icon: ArrowLeftRight },
  { label: 'GST', to: '/professional/books/gst', icon: Receipt },
  { label: 'TDS / TCS', to: '/professional/books/tds', icon: FileSpreadsheet },
  { label: 'Income Tax', to: '/professional/books/income-tax', icon: Calculator },
  { label: 'Profit & Loss', to: '/professional/books/profit-loss', icon: TrendingUp },
  { label: 'Balance Sheet', to: '/professional/books/balance-sheet', icon: Scale },
];

function BooksShell({ children }: { children: ReactNode }) {
  const { entities, entityId, setEntityId, entity } = useProfessionalBooks();

  return (
    <div className="-mx-4 -my-4 flex min-h-[calc(100svh-3.5rem)] flex-col sm:-mx-6 sm:-my-6 lg:-mx-8 lg:-my-8 lg:flex-row">
      <aside className="hidden w-56 shrink-0 border-r border-admin-border bg-admin-bg lg:block">
        <div className="sticky top-0 space-y-4 p-3">
          <div>
            <div className="mb-2 px-2 pt-2 font-mono text-[10px] font-bold uppercase tracking-wider text-admin-muted">
              Client entity
            </div>
            <select
              value={entityId}
              onChange={(e) => setEntityId(e.target.value)}
              className="w-full rounded-xl border border-admin-border bg-admin-surface px-3 py-2 text-sm text-admin-text"
            >
              {entities.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.shortName}
                </option>
              ))}
            </select>
            {entity && (
              <p className="mt-2 px-1 font-mono text-[10px] text-admin-muted">
                {entity.entityType} · {entity.state}
              </p>
            )}
          </div>

          <div>
            <div className="mb-2 px-2 font-mono text-[10px] font-bold uppercase tracking-wider text-admin-muted">
              Books of Accounts
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
                          ? 'bg-admin-accent text-white'
                          : 'text-admin-muted hover:bg-admin-surface hover:text-admin-text'
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
        </div>
      </aside>

      <div className="sticky top-0 z-10 border-b border-admin-border bg-admin-bg/95 px-3 py-2 backdrop-blur lg:hidden">
        <div className="mb-2 flex flex-col gap-2 sm:flex-row sm:items-center">
          <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-admin-muted">
            Books · Client
          </span>
          <select
            value={entityId}
            onChange={(e) => setEntityId(e.target.value)}
            className="flex-1 rounded-xl border border-admin-border bg-admin-surface px-3 py-1.5 text-sm"
          >
            {entities.map((e) => (
              <option key={e.id} value={e.id}>
                {e.shortName}
              </option>
            ))}
          </select>
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
                      ? 'border-admin-accent bg-admin-accent text-white'
                      : 'border-admin-border bg-admin-surface text-admin-muted'
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
        <PeriodRangeBar variant="admin" />
        {children}
      </div>
    </div>
  );
}

export function ProfessionalBooksLayout({ children }: { children: ReactNode }) {
  return (
    <BooksPeriodProvider>
      <ProfessionalBooksProvider>
        <BooksShell>{children}</BooksShell>
      </ProfessionalBooksProvider>
    </BooksPeriodProvider>
  );
}
