'use client';

import { useMemo, useState } from 'react';
import { PageHeader } from '../../components/dashboard/PageHeader';
import { StatusBadge } from '../../components/dashboard/StatusBadge';
import { DataTable, type Column } from '../../components/dashboard/DataTable';
import { FILINGS } from '../../data/dashboard/filings';
import { PROFESSIONALS } from '../../data/dashboard/professionals';
import { assignProfessionalToFiling } from '@/lib/actions/domain';
import type { Filing } from '../../types/dashboard';

export function FilingsQueuePage() {
  const [rows, setRows] = useState(() =>
    [...FILINGS].sort((a, b) => a.dueDate.localeCompare(b.dueDate)),
  );
  const [busyId, setBusyId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const columns: Column<Filing>[] = useMemo(
    () => [
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
        key: 'assignee',
        header: 'Assignee',
        render: (f) => (
          <select
            className="max-w-[160px] rounded-lg border border-admin-border bg-white px-2 py-1 font-mono text-xs"
            value={f.professionalId ?? ''}
            disabled={busyId === f.id}
            onChange={async (e) => {
              const professionalId = e.target.value || null;
              setBusyId(f.id);
              const result = await assignProfessionalToFiling(f.id, professionalId);
              setBusyId(null);
              if ('error' in result) {
                setMessage(result.error);
                // Still update local UI for demo when Supabase is offline
                if (!result.error.includes('not configured')) return;
              }
              const pro = PROFESSIONALS.find((p) => p.id === professionalId);
              setRows((prev) =>
                prev.map((row) =>
                  row.id === f.id
                    ? {
                        ...row,
                        professionalId: professionalId ?? undefined,
                        assignedProfessional: pro?.name,
                      }
                    : row,
                ),
              );
              setMessage(
                professionalId
                  ? `Assigned ${pro?.name ?? professionalId} (also upserts professional_assignments)`
                  : 'Unassigned',
              );
            }}
          >
            <option value="">Unassigned</option>
            {PROFESSIONALS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.type})
              </option>
            ))}
          </select>
        ),
      },
    ],
    [busyId],
  );

  return (
    <div>
      <PageHeader
        variant="admin"
        title="Filing Queue"
        description="Cross-client deadline tracking. Assigning a professional also creates an explicit professional_assignments row."
      />
      {message && (
        <p className="mb-3 rounded-xl border border-admin-border bg-admin-bg px-3 py-2 text-xs text-admin-muted">
          {message}
        </p>
      )}
      <DataTable variant="admin" columns={columns} rows={rows} rowKey={(r) => r.id} />
    </div>
  );
}
