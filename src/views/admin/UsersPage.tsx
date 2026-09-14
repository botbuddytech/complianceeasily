'use client';

import { FormEvent, useState } from 'react';
import { PageHeader } from '../../components/dashboard/PageHeader';
import { StatusBadge } from '../../components/dashboard/StatusBadge';
import { DataTable, type Column } from '../../components/dashboard/DataTable';
import { STAFF_USERS } from '../../data/dashboard/staffUsers';
import { inviteStaffUser } from '@/lib/actions/domain';
import type { StaffUser } from '../../types/dashboard';

const columns: Column<StaffUser>[] = [
  {
    key: 'user',
    header: 'Staff user',
    render: (u) => (
      <div>
        <div className="font-semibold text-admin-text">{u.name}</div>
        <div className="font-mono text-[11px] text-admin-muted">{u.email}</div>
      </div>
    ),
  },
  {
    key: 'role',
    header: 'Role',
    render: (u) => (
      <span className="rounded-full border border-admin-border bg-admin-bg px-2 py-0.5 font-mono text-[11px] font-semibold capitalize">
        {u.role.replace(/_/g, ' ')}
      </span>
    ),
  },
  {
    key: 'perms',
    header: 'Permissions',
    render: (u) => (
      <span className="font-mono text-[11px] text-admin-muted">{u.permissions.join(', ')}</span>
    ),
  },
  {
    key: 'status',
    header: 'Status',
    render: (u) => <StatusBadge status={u.status} />,
  },
  {
    key: 'active',
    header: 'Last active',
    render: (u) => (
      <span className="font-mono text-xs text-admin-muted">{u.lastActive ?? '—'}</span>
    ),
  },
];

export function UsersPage() {
  const [open, setOpen] = useState(false);
  const [rows, setRows] = useState(STAFF_USERS);
  const [message, setMessage] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: '',
    email: '',
    role: 'viewer' as StaffUser['role'],
    scopes: 'clients:read,filings:review',
  });

  const onInvite = async (e: FormEvent) => {
    e.preventDefault();
    const scopes = form.scopes.split(',').map((s) => s.trim()).filter(Boolean);
    const result = await inviteStaffUser({
      name: form.name,
      email: form.email,
      role: form.role,
      scopes,
    });
    if ('error' in result) {
      setMessage(result.error);
      if (!result.error.includes('not configured')) return;
    }
    const id = 'id' in result ? result.id : `staff-local-${Date.now()}`;
    setRows((prev) => [
      {
        id,
        name: form.name,
        email: form.email,
        role: form.role,
        status: 'invited',
        permissions: scopes,
      },
      ...prev,
    ]);
    setMessage(`Invited ${form.email}`);
    setOpen(false);
  };

  return (
    <div>
      <PageHeader
        variant="admin"
        title="Users & Roles"
        description="Internal staff accounts, roles, and permission scopes."
        actions={
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="rounded-full bg-admin-accent px-4 py-2 text-sm font-semibold text-white hover:bg-admin-accent-hover"
          >
            Invite staff
          </button>
        }
      />
      {message && (
        <p className="mb-3 rounded-xl border border-admin-border bg-admin-bg px-3 py-2 text-xs text-admin-muted">
          {message}
        </p>
      )}
      <DataTable variant="admin" columns={columns} rows={rows} rowKey={(r) => r.id} />

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0E1217]/50 p-4">
          <form
            onSubmit={onInvite}
            className="w-full max-w-md rounded-2xl border border-admin-border bg-white p-5 shadow-xl"
          >
            <h2 className="mb-3 font-semibold text-admin-text">Invite staff user</h2>
            <label className="mb-2 block text-xs font-semibold uppercase text-admin-muted">
              Name
              <input
                required
                className="mt-1 w-full rounded-xl border border-admin-border px-3 py-2 text-sm"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              />
            </label>
            <label className="mb-2 block text-xs font-semibold uppercase text-admin-muted">
              Email
              <input
                required
                type="email"
                className="mt-1 w-full rounded-xl border border-admin-border px-3 py-2 text-sm"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              />
            </label>
            <label className="mb-2 block text-xs font-semibold uppercase text-admin-muted">
              Role
              <select
                className="mt-1 w-full rounded-xl border border-admin-border px-3 py-2 text-sm"
                value={form.role}
                onChange={(e) =>
                  setForm((f) => ({ ...f, role: e.target.value as StaffUser['role'] }))
                }
              >
                <option value="super_admin">super_admin</option>
                <option value="ops_manager">ops_manager</option>
                <option value="reviewer">reviewer</option>
                <option value="support">support</option>
                <option value="viewer">viewer</option>
              </select>
            </label>
            <label className="mb-4 block text-xs font-semibold uppercase text-admin-muted">
              Scopes (comma-separated)
              <input
                className="mt-1 w-full rounded-xl border border-admin-border px-3 py-2 text-sm"
                value={form.scopes}
                onChange={(e) => setForm((f) => ({ ...f, scopes: e.target.value }))}
              />
            </label>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-xl border border-admin-border px-3 py-2 text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-xl bg-admin-accent px-3 py-2 text-sm font-semibold text-white"
              >
                Send invite
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
