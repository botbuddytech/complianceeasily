'use client';

import type { ReactNode } from 'react';

export interface TabItem {
  id: string;
  label: string;
  count?: number;
}

export function Tabs({
  items,
  value,
  onChange,
  className = '',
}: {
  items: TabItem[];
  value: string;
  onChange: (id: string) => void;
  className?: string;
}) {
  return (
    <div
      role="tablist"
      className={`flex flex-wrap gap-2 ${className}`}
    >
      {items.map((item) => {
        const active = item.id === value;
        return (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(item.id)}
            className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition ${
              active
                ? 'border-admin-ink bg-admin-ink text-white'
                : 'border-admin-border bg-admin-surface text-admin-muted hover:border-admin-ink/40 hover:text-admin-ink'
            }`}
          >
            {item.label}
            {item.count != null && (
              <span
                className={`ml-1.5 font-mono text-[11px] ${
                  active ? 'text-white/70' : 'text-admin-muted'
                }`}
              >
                {item.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

export function TabsPanel({
  when,
  active,
  children,
}: {
  when: string;
  active: string;
  children: ReactNode;
}) {
  if (when !== active) return null;
  return <div role="tabpanel">{children}</div>;
}
