import { PageHeader } from '../../components/dashboard/PageHeader';
import { StatusBadge } from '../../components/dashboard/StatusBadge';
import { DataTable, type Column } from '../../components/dashboard/DataTable';
import { getMyFilings } from '../../lib/professionalSession';
import type { Filing } from '../../types/dashboard';

const columns: Column<Filing>[] = [
  {
    key: 'filing',
    header: 'Filing',
    render: (f) => (
      <div>
        <div className="font-semibold text-admin-text">{f.name}</div>
        <div className="font-mono text-[11px] text-admin-muted">
          {f.periodLabel} · {f.category}
        </div>
      </div>
    ),
  },
  {
    key: 'client',
    header: 'Client entity',
    render: (f) => <span className="font-mono text-xs">{f.entityName}</span>,
  },
  {
    key: 'due',
    header: 'Due date',
    render: (f) => <span className="font-mono text-xs font-semibold">{f.dueDate}</span>,
  },
  {
    key: 'status',
    header: 'Status',
    render: (f) => <StatusBadge status={f.status} />,
  },
  {
    key: 'notes',
    header: 'Notes',
    render: (f) => (
      <span className="max-w-[12rem] truncate text-xs text-admin-muted">{f.notes ?? '—'}</span>
    ),
  },
];

export function ProfessionalQueuePage() {
  const rows = [...getMyFilings()].sort((a, b) => a.dueDate.localeCompare(b.dueDate));

  return (
    <div>
      <PageHeader
        variant="admin"
        title="My Filing Queue"
        description="Filings assigned to you, sorted by due date."
      />
      <DataTable variant="admin" columns={columns} rows={rows} rowKey={(r) => r.id} />
    </div>
  );
}
