'use client';

import { useMemo, useState, type ReactNode } from 'react';
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';

export interface Column<T> {
  key: string;
  header: string;
  className?: string;
  /** Hide this column in the mobile stacked-card layout */
  hideOnMobile?: boolean;
  sortable?: boolean;
  sortValue?: (row: T) => string | number | null | undefined;
  render: (row: T) => ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  variant?: 'client' | 'admin';
  empty?: ReactNode;
  loading?: boolean;
  stickyHeader?: boolean;
}

export function DataTable<T>({
  columns,
  rows,
  rowKey,
  empty,
  loading,
  stickyHeader = true,
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const sortedRows = useMemo(() => {
    if (!sortKey) return rows;
    const col = columns.find((c) => c.key === sortKey);
    if (!col?.sortValue && !col?.sortable) return rows;
    const copy = [...rows];
    copy.sort((a, b) => {
      const av = col.sortValue ? col.sortValue(a) : '';
      const bv = col.sortValue ? col.sortValue(b) : '';
      const an = av == null ? '' : av;
      const bn = bv == null ? '' : bv;
      if (typeof an === 'number' && typeof bn === 'number') {
        return sortDir === 'asc' ? an - bn : bn - an;
      }
      const cmp = String(an).localeCompare(String(bn), undefined, { sensitivity: 'base' });
      return sortDir === 'asc' ? cmp : -cmp;
    });
    return copy;
  }, [rows, sortKey, sortDir, columns]);

  function toggleSort(key: string) {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  }

  if (loading) {
    return (
      <div className="overflow-hidden rounded-2xl border border-[#D5D0C6] bg-white shadow-sm">
        <div className="animate-pulse space-y-3 p-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-10 rounded-lg bg-[#EBE8E2]" />
          ))}
        </div>
      </div>
    );
  }

  if (rows.length === 0 && empty) {
    return <>{empty}</>;
  }

  const mobileColumns = columns.filter((col) => !col.hideOnMobile);
  const headerClass = stickyHeader ? 'sticky top-0 z-10' : '';

  return (
    <div className="overflow-hidden rounded-2xl border border-[#D5D0C6] bg-white shadow-sm">
      <div className="space-y-3 p-3 md:hidden">
        {sortedRows.map((row) => (
          <article
            key={rowKey(row)}
            className="space-y-2.5 rounded-xl border border-[#D5D0C6] bg-[#F4F2EE]/50 p-3.5"
          >
            {mobileColumns.map((col, index) => (
              <div
                key={col.key}
                className={`flex items-start justify-between gap-3 ${
                  index === 0 ? '' : 'border-t border-[#EBE8E2] pt-2'
                }`}
              >
                <span className="shrink-0 pt-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-[#6B7580]">
                  {col.header}
                </span>
                <div className={`min-w-0 text-right text-sm text-[#0E1217] ${col.className ?? ''}`}>
                  {col.render(row)}
                </div>
              </div>
            ))}
          </article>
        ))}
      </div>

      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr
              className={`border-b border-[#D5D0C6] bg-[#EBE8E2] font-mono text-[11px] font-semibold uppercase tracking-wider text-[#6B7580] ${headerClass}`}
            >
              {columns.map((col) => (
                <th key={col.key} className={`px-4 py-3 ${col.className ?? ''}`}>
                  {col.sortable || col.sortValue ? (
                    <button
                      type="button"
                      onClick={() => toggleSort(col.key)}
                      className="inline-flex items-center gap-1 hover:text-[#0E1217]"
                    >
                      {col.header}
                      {sortKey === col.key ? (
                        sortDir === 'asc' ? (
                          <ArrowUp className="h-3 w-3" />
                        ) : (
                          <ArrowDown className="h-3 w-3" />
                        )
                      ) : (
                        <ArrowUpDown className="h-3 w-3 opacity-40" />
                      )}
                    </button>
                  ) : (
                    col.header
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedRows.map((row) => (
              <tr
                key={rowKey(row)}
                className="border-b border-[#EBE8E2] last:border-0 hover:bg-[#F4F2EE]/80"
              >
                {columns.map((col) => (
                  <td key={col.key} className={`px-4 py-3 align-middle ${col.className ?? ''}`}>
                    {col.render(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
