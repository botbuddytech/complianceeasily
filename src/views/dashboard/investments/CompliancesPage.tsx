import { useMemo, useState } from 'react';
import { Calendar } from 'lucide-react';
import { PageHeader } from '../../../components/dashboard/PageHeader';
import { StatusBadge } from '../../../components/dashboard/StatusBadge';
import { DataTable, type Column } from '../../../components/dashboard/DataTable';
import { EmptyState } from '../../../components/dashboard/EmptyState';
import { getClientInvestmentCompliances } from '../../../data/dashboard/investments';
import type { InvestmentComplianceItem } from '../../../types/investments';

type DomainFilter = 'all' | 'Property' | 'Stocks';

const FILTERS: { id: DomainFilter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'Property', label: 'Property' },
  { id: 'Stocks', label: 'Stocks' },
];

export function InvestmentsCompliancesPage() {
  const [filter, setFilter] = useState<DomainFilter>('all');
  const all = getClientInvestmentCompliances();

  const rows = useMemo(() => {
    const sorted = [...all].sort((a, b) => a.dueDate.localeCompare(b.dueDate));
    if (filter === 'all') return sorted;
    return sorted.filter((c) => c.domain === filter);
  }, [all, filter]);

  const columns: Column<InvestmentComplianceItem>[] = [
    {
      key: 'name',
      header: 'Compliance',
      render: (c) => (
        <div>
          <div className="font-semibold text-[#0E1217]">{c.name}</div>
          <div className="font-mono text-[11px] text-[#6B7580]">
            {c.authority}
            {c.periodLabel ? ` · ${c.periodLabel}` : ''}
          </div>
        </div>
      ),
    },
    {
      key: 'domain',
      header: 'Domain',
      render: (c) => <StatusBadge status={c.domain} />,
    },
    {
      key: 'asset',
      header: 'Asset',
      render: (c) => <span className="font-mono text-xs">{c.assetLabel}</span>,
    },
    {
      key: 'due',
      header: 'Due',
      render: (c) => (
        <span className="inline-flex items-center gap-1 font-mono text-xs">
          <Calendar className="h-3.5 w-3.5 text-[#6B7580]" />
          {c.dueDate}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (c) => <StatusBadge status={c.status} />,
    },
  ];

  return (
    <div>
      <PageHeader
        title="Investment Compliances"
        description="Property tax, mutation, capital gains, AIS/STT, demat KYC, and related filings."
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

      <DataTable
        columns={columns}
        rows={rows}
        rowKey={(r) => r.id}
        empty={
          <EmptyState
            title="No compliances match this filter"
            description="Try another domain tab."
          />
        }
      />
    </div>
  );
}
