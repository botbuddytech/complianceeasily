'use client';

import { type ReactNode } from 'react';
import { NavLink } from '@/components/nav/NextNav';
import { List, PenSquare, Tags } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const TABS: { label: string; to: string; icon: LucideIcon; end?: boolean }[] = [
  { label: 'View all blogs', to: '/admin/blog/all', icon: List },
  { label: 'Create blog', to: '/admin/blog/create', icon: PenSquare },
  { label: 'Categories', to: '/admin/blog/categories', icon: Tags },
];

export function BlogLayout({ children }: { children: ReactNode }) {
  return (
    <div className="-mx-4 -my-4 flex min-h-[calc(100svh-3.5rem)] flex-col sm:-mx-6 sm:-my-6 lg:-mx-8 lg:-my-8 lg:flex-row">
      <aside className="hidden w-56 shrink-0 border-r border-admin-border bg-admin-bg/80 lg:block">
        <div className="sticky top-0 p-3">
          <div className="mb-3 px-2 pt-2 font-mono text-[10px] font-bold uppercase tracking-wider text-admin-muted">
            Blog
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
      </aside>

      <div className="sticky top-0 z-10 border-b border-admin-border bg-admin-bg/95 px-3 py-2 backdrop-blur lg:hidden">
        <div className="mb-1.5 px-1 font-mono text-[10px] font-bold uppercase tracking-wider text-admin-muted">
          Blog
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

      <div className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">{children}</div>
    </div>
  );
}
