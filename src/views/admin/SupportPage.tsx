import { PageHeader } from '../../components/dashboard/PageHeader';
import { StatusBadge } from '../../components/dashboard/StatusBadge';
import { DataTable, type Column } from '../../components/dashboard/DataTable';
import { SUPPORT_TICKETS } from '../../data/dashboard/supportTickets';
import type { SupportTicket } from '../../types/dashboard';

const columns: Column<SupportTicket>[] = [
  {
    key: 'ticket',
    header: 'Ticket',
    render: (t) => (
      <div>
        <div className="font-mono text-[11px] font-semibold text-admin-accent">{t.id}</div>
        <div className="font-semibold text-admin-text">{t.subject}</div>
        <div className="font-mono text-[11px] text-admin-muted">
          {t.requesterName} · {t.requesterEmail}
        </div>
      </div>
    ),
  },
  {
    key: 'category',
    header: 'Category',
    render: (t) => <span className="font-mono text-xs">{t.category}</span>,
  },
  {
    key: 'entity',
    header: 'Entity',
    render: (t) => (
      <span className="font-mono text-xs text-admin-muted">{t.entityName ?? '—'}</span>
    ),
  },
  {
    key: 'priority',
    header: 'Priority',
    render: (t) => <StatusBadge status={t.priority} />,
  },
  {
    key: 'status',
    header: 'Status',
    render: (t) => <StatusBadge status={t.status} />,
  },
  {
    key: 'assignee',
    header: 'Assignee',
    render: (t) => (
      <span className="font-mono text-xs text-admin-muted">{t.assignee ?? 'Unassigned'}</span>
    ),
  },
];

export function AdminSupportPage() {
  return (
    <div>
      <PageHeader
        variant="admin"
        title="Support Tickets"
        description="Escalations and client queries across the platform."
      />
      <DataTable variant="admin" columns={columns} rows={SUPPORT_TICKETS} rowKey={(r) => r.id} />
    </div>
  );
}
