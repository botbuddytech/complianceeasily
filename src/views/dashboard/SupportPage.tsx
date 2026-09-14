import { Plus } from 'lucide-react';
import { PageHeader } from '../../components/dashboard/PageHeader';
import { StatusBadge } from '../../components/dashboard/StatusBadge';
import { DataTable, type Column } from '../../components/dashboard/DataTable';
import { SUPPORT_TICKETS } from '../../data/dashboard/supportTickets';
import type { SupportTicket } from '../../types/dashboard';

const columns: Column<SupportTicket>[] = [
  {
    key: 'id',
    header: 'Ticket',
    render: (t) => (
      <div>
        <div className="font-mono text-xs font-semibold text-[#B89E6B]">{t.id}</div>
        <div className="font-semibold text-[#0E1217]">{t.subject}</div>
      </div>
    ),
  },
  {
    key: 'category',
    header: 'Category',
    render: (t) => <span className="font-mono text-xs">{t.category}</span>,
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
    key: 'updated',
    header: 'Updated',
    render: (t) => <span className="font-mono text-xs">{t.updatedAt}</span>,
  },
];

export function UserSupportPage() {
  return (
    <div>
      <PageHeader
        title="Help & Support"
        description="Track tickets and reach ComplianceEasily support or your assigned professional."
        actions={
          <button type="button" className="btn-primary text-sm py-2 px-4">
            <Plus className="h-4 w-4" /> New ticket
          </button>
        }
      />
      <DataTable columns={columns} rows={SUPPORT_TICKETS} rowKey={(r) => r.id} />
    </div>
  );
}
