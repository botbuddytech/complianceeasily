'use client';

import { Search } from 'lucide-react';
import type { ReactNode } from 'react';

export interface FilterSelect {
  id: string;
  label: string;
  value: string;
  options: Array<{ value: string; label: string }>;
  onChange: (value: string) => void;
}

export function FilterBar({
  search,
  onSearchChange,
  searchPlaceholder = 'Search…',
  selects = [],
  trailing,
}: {
  search: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  selects?: FilterSelect[];
  trailing?: ReactNode;
}) {
  return (
    <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:flex-wrap lg:items-center">
      <div className="flex flex-1 items-center gap-2 rounded-xl border border-admin-border bg-admin-surface px-3 py-2">
        <Search className="h-4 w-4 shrink-0 text-admin-muted" />
        <input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={searchPlaceholder}
          className="w-full bg-transparent text-sm text-admin-ink outline-none placeholder:text-admin-muted"
        />
      </div>
      {selects.map((s) => (
        <label key={s.id} className="flex items-center gap-2 text-xs text-admin-muted">
          <span className="hidden font-mono uppercase tracking-wider sm:inline">{s.label}</span>
          <select
            value={s.value}
            onChange={(e) => s.onChange(e.target.value)}
            className="rounded-xl border border-admin-border bg-admin-surface px-3 py-2 text-sm text-admin-ink"
          >
            {s.options.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
      ))}
      {trailing}
    </div>
  );
}
