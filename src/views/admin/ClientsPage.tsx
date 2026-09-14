import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { PageHeader } from '../../components/dashboard/PageHeader';
import { StatusBadge } from '../../components/dashboard/StatusBadge';
import { HealthScoreRing } from '../../components/dashboard/HealthScoreRing';
import { DataTable, type Column } from '../../components/dashboard/DataTable';
import { CLIENTS } from '../../data/dashboard/clients';
import type { ClientSummary } from '../../types/dashboard';

export function ClientsPage() {
  const [q, setQ] = useState('');
  const [status, setStatus] = useState<string>('all');

  const rows = useMemo(() => {
    return CLIENTS.filter((c) => {
      const matchesQ =
        !q ||
        c.businessName.toLowerCase().includes(q.toLowerCase()) ||
        c.email.toLowerCase().includes(q.toLowerCase()) ||
        c.contactName.toLowerCase().includes(q.toLowerCase());
      const matchesStatus = status === 'all' || c.status === status;
      return matchesQ && matchesStatus;
    });
  }, [q, status]);

  const columns: Column<ClientSummary>[] = [
    {
      key: 'client',
      header: 'Client',
      render: (c) => (
        <div>
          <div className="font-semibold text-admin-text">{c.businessName}</div>
          <div className="font-mono text-[11px] text-admin-muted">
            {c.contactName} · {c.email}
          </div>
        </div>
      ),
    },
    {
      key: 'plan',
      header: 'Plan',
      render: (c) => <StatusBadge status={c.planId} />,
    },
    {
      key: 'health',
      header: 'Health',
      render: (c) => <HealthScoreRing score={c.healthScore} size="sm" variant="admin" />,
    },
    {
      key: 'due',
      header: 'Due this week',
      render: (c) => (
        <span className="font-mono text-sm font-semibold">{c.filingsDueThisWeek}</span>
      ),
    },
    {
      key: 'state',
      header: 'State',
      render: (c) => <span className="font-mono text-xs">{c.state}</span>,
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
        title="Clients & Entities"
        description="Search and filter all client businesses across plans and states."
      />

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex flex-1 items-center gap-2 rounded-xl border border-admin-border bg-admin-surface px-3 py-2">
          <Search className="h-4 w-4 text-admin-muted" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search clients…"
            className="w-full bg-transparent text-sm outline-none placeholder:text-admin-muted"
          />
        </div>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="rounded-xl border border-admin-border bg-admin-surface px-3 py-2 text-sm"
        >
          <option value="all">All statuses</option>
          <option value="active">Active</option>
          <option value="trial">Trial</option>
          <option value="suspended">Suspended</option>
          <option value="churned">Churned</option>
        </select>
      </div>

      <DataTable variant="admin" columns={columns} rows={rows} rowKey={(r) => r.id} />
    </div>
  );
}
