import { PageHeader } from '../../components/dashboard/PageHeader';
import { StatusBadge } from '../../components/dashboard/StatusBadge';
import { DataTable, type Column } from '../../components/dashboard/DataTable';
import { PROFESSIONALS } from '../../data/dashboard/professionals';
import type { ProfessionalProfile } from '../../types/dashboard';

const columns: Column<ProfessionalProfile>[] = [
  {
    key: 'name',
    header: 'Professional',
    render: (p) => (
      <div>
        <div className="font-semibold text-admin-text">{p.name}</div>
        <div className="font-mono text-[11px] text-admin-muted">{p.email}</div>
      </div>
    ),
  },
  {
    key: 'type',
    header: 'Type',
    render: (p) => (
      <span className="rounded-full border border-admin-border bg-admin-bg px-2 py-0.5 font-mono text-[11px] font-semibold">
        {p.type}
      </span>
    ),
  },
  {
    key: 'active',
    header: 'Active',
    render: (p) => <span className="font-mono text-sm font-semibold">{p.activeAssignments}</span>,
  },
  {
    key: 'done',
    header: 'Done (mo)',
    render: (p) => <span className="font-mono text-sm">{p.completedThisMonth}</span>,
  },
  {
    key: 'tat',
    header: 'Avg TAT (days)',
    render: (p) => <span className="font-mono text-sm">{p.avgTurnaroundDays}</span>,
  },
  {
    key: 'status',
    header: 'Status',
    render: (p) => <StatusBadge status={p.status} />,
  },
  {
    key: 'spec',
    header: 'Specialties',
    render: (p) => (
      <span className="font-mono text-[11px] text-admin-muted">{p.specialties.join(', ')}</span>
    ),
  },
];

export function ProfessionalsPage() {
  return (
    <div>
      <PageHeader
        variant="admin"
        title="Professionals"
        description="CA / CS / Advocate assignment, capacity, and turnaround."
      />
      <DataTable variant="admin" columns={columns} rows={PROFESSIONALS} rowKey={(r) => r.id} />
    </div>
  );
}
