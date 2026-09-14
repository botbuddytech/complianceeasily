import { UserPlus } from 'lucide-react';
import { PageHeader } from '../../components/dashboard/PageHeader';
import { StatusBadge } from '../../components/dashboard/StatusBadge';
import { DataTable, type Column } from '../../components/dashboard/DataTable';
import { TEAM_MEMBERS } from '../../data/dashboard/team';
import type { TeamMember } from '../../types/dashboard';

const columns: Column<TeamMember>[] = [
  {
    key: 'member',
    header: 'Member',
    render: (m) => (
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#B89E6B] text-xs font-bold text-white">
          {m.avatarInitials}
        </div>
        <div>
          <div className="font-semibold text-[#0E1217]">{m.name}</div>
          <div className="font-mono text-[11px] text-[#6B7580]">{m.email}</div>
        </div>
      </div>
    ),
  },
  {
    key: 'role',
    header: 'Role',
    render: (m) => <StatusBadge status={m.role} />,
  },
  {
    key: 'status',
    header: 'Status',
    render: (m) => <StatusBadge status={m.status} />,
  },
  {
    key: 'active',
    header: 'Last active',
    render: (m) => (
      <span className="font-mono text-xs text-[#5C6570]">{m.lastActive ?? '—'}</span>
    ),
  },
];

export function TeamPage() {
  return (
    <div>
      <PageHeader
        title="Team & Collaborators"
        description="Owners, admins, and authorized CA / CS / Advocate collaborators."
        actions={
          <button type="button" className="btn-primary text-sm py-2 px-4">
            <UserPlus className="h-4 w-4" /> Invite
          </button>
        }
      />
      <DataTable columns={columns} rows={TEAM_MEMBERS} rowKey={(r) => r.id} />
    </div>
  );
}
