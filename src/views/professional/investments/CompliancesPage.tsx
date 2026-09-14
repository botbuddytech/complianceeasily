import { useMemo, useState } from 'react';
import { Calendar } from 'lucide-react';
import { PageHeader } from '../../../components/dashboard/PageHeader';
import { StatusBadge } from '../../../components/dashboard/StatusBadge';
import { DataTable, type Column } from '../../../components/dashboard/DataTable';
import { EmptyState } from '../../../components/dashboard/EmptyState';
import {
  getMyInvestmentCompliances,
  getMyClients,
} from '../../../lib/professionalSession';
import type { InvestmentComplianceItem } from '../../../types/investments';

type DomainFilter = 'all' | 'Property' | 'Stocks';

const FILTERS: { id: DomainFilter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'Property', label: 'Property' },
  { id: 'Stocks', label: 'Stocks' },
];

export function ProfessionalInvestmentsCompliancesPage() {
  const [filter, setFilter] = useState<DomainFilter>('all');
  const all = getMyInvestmentCompliances();
  const clients = getMyClients();
  const clientName = (clientId: string) =>
    clients.find((c) => c.id === clientId)?.businessName ?? clientId;

  const rows = useMemo(() => {
    const sorted = [...all].sort((a, b) => a.dueDate.localeCompare(b.dueDate));
    if (filter === 'all') return sorted;
    return sorted.filter((c) => c.domain === filter);
  }, [all, filter]);

  const columns: Column<InvestmentComplianceItem>[] = [
    {
      key: 'client',
      header: 'Client',
      render: (c) => (
        <span className="font-mono text-xs text-admin-muted">{clientName(c.clientId)}</span>
      ),
    },
    {
      key: 'name',
      header: 'Compliance',
      render: (c) => (
        <div>
          <div className="font-semibold text-admin-text">{c.name}</div>
          <div className="font-mono text-[11px] text-admin-muted">
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
          <Calendar className="h-3.5 w-3.5 text-admin-muted" />
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
        variant="admin"
        title="Investment Compliances"
        description="Property and stock-market compliances for your assigned clients. Read-only."
      />

      <div className="mb-4 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setFilter(f.id)}
            className={`rounded-full border px-3 py-1 text-xs font-mono font-semibold transition-colors ${
              filter === f.id
                ? 'border-admin-accent bg-admin-accent text-white'
                : 'border-admin-border bg-admin-surface text-admin-muted hover:bg-admin-bg'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <DataTable
        variant="admin"
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
