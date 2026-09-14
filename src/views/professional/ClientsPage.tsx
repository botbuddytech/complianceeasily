import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { PageHeader } from '../../components/dashboard/PageHeader';
import { StatusBadge } from '../../components/dashboard/StatusBadge';
import { HealthScoreRing } from '../../components/dashboard/HealthScoreRing';
import { DataTable, type Column } from '../../components/dashboard/DataTable';
import { getMyClients, countMyFilingsForClient } from '../../lib/professionalSession';
import type { ClientSummary } from '../../types/dashboard';

export function ProfessionalClientsPage() {
  const [q, setQ] = useState('');
  const clients = getMyClients();

  const rows = useMemo(() => {
    return clients.filter((c) => {
      if (!q) return true;
      const hay = `${c.businessName} ${c.email} ${c.contactName} ${c.state}`.toLowerCase();
      return hay.includes(q.toLowerCase());
    });
  }, [clients, q]);

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
      key: 'assigned',
      header: 'Your filings',
      render: (c) => (
        <span className="font-mono text-sm font-semibold">
          {countMyFilingsForClient(c.id)}
        </span>
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
        title="My Clients"
        description="Businesses with filings or documents currently assigned to you."
      />

      <div className="mb-4 flex items-center gap-2 rounded-xl border border-admin-border bg-admin-surface px-3 py-2">
        <Search className="h-4 w-4 text-admin-muted" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search clients…"
          className="w-full bg-transparent text-sm outline-none placeholder:text-admin-muted"
        />
      </div>

      <DataTable variant="admin" columns={columns} rows={rows} rowKey={(r) => r.id} />
    </div>
  );
}
