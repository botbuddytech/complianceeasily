'use client';

import { useMemo, useState } from 'react';
import { PageHeader } from '../../components/dashboard/PageHeader';
import { StatusBadge } from '../../components/dashboard/StatusBadge';
import { DataTable, type Column } from '../../components/dashboard/DataTable';
import { PROTECTION_CLAIMS } from '../../data/dashboard/protectionClaims';
import { reviewProtectionClaim } from '@/lib/actions/domain';
import type { ProtectionClaim } from '../../types/dashboard';

export function ProtectionClaimsPage() {
  const [rows, setRows] = useState(PROTECTION_CLAIMS);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const columns: Column<ProtectionClaim>[] = useMemo(
    () => [
      {
        key: 'claim',
        header: 'Claim',
        render: (c) => (
          <div>
            <div className="font-mono text-[11px] font-semibold text-admin-accent">{c.id}</div>
            <div className="font-semibold text-admin-text">{c.filingName}</div>
            <div className="mt-0.5 max-w-md text-xs text-admin-muted">{c.reason}</div>
          </div>
        ),
      },
      {
        key: 'entity',
        header: 'Entity',
        render: (c) => <span className="font-mono text-xs">{c.entityName}</span>,
      },
      {
        key: 'amount',
        header: 'Amount',
        render: (c) => <span className="font-mono text-sm font-semibold">{c.amountClaimed}</span>,
      },
      {
        key: 'submitted',
        header: 'Submitted',
        render: (c) => <span className="font-mono text-xs">{c.submittedAt}</span>,
      },
      {
        key: 'status',
        header: 'Status',
        render: (c) => <StatusBadge status={c.status} />,
      },
      {
        key: 'actions',
        header: 'Actions',
        render: (c) => (
          <div className="flex flex-wrap gap-1">
            {(['under_review', 'approved', 'rejected', 'paid'] as const).map((status) => (
              <button
                key={status}
                type="button"
                disabled={busyId === c.id || c.status === status}
                className="rounded-full border border-admin-border px-2 py-0.5 font-mono text-[10px] font-semibold hover:bg-admin-bg disabled:opacity-40"
                onClick={async () => {
                  setBusyId(c.id);
                  const result = await reviewProtectionClaim(c.id, status, 'Ops Manager');
                  setBusyId(null);
                  if ('error' in result && !result.error.includes('not configured')) {
                    setMessage(result.error);
                    return;
                  }
                  setRows((prev) =>
                    prev.map((row) =>
                      row.id === c.id
                        ? { ...row, status, reviewedBy: 'Ops Manager' }
                        : row,
                    ),
                  );
                  setMessage(`${c.id} → ${status}`);
                }}
              >
                {status}
              </button>
            ))}
          </div>
        ),
      },
    ],
    [busyId],
  );

  return (
    <div>
      <PageHeader
        variant="admin"
        title="Protection Claims"
        description="Review and process Compliance Protection Guarantee claims (submitted → under_review → approved/rejected → paid)."
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
