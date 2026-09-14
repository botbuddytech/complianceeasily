'use client';

import { FormEvent, useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import { PageHeader } from '../../components/dashboard/PageHeader';
import { StatCard, StatGrid } from '../../components/dashboard/StatCard';
import { StatusBadge } from '../../components/dashboard/StatusBadge';
import { DataTable, type Column } from '../../components/dashboard/DataTable';
import {
  PROTECTION_CLAIMS,
  PROTECTION_ELIGIBILITY,
} from '../../data/dashboard/protectionClaims';
import { submitProtectionClaim } from '@/lib/actions/domain';
import type { ProtectionClaim } from '../../types/dashboard';

const columns: Column<ProtectionClaim>[] = [
  {
    key: 'filing',
    header: 'Claim',
    render: (c) => (
      <div>
        <div className="font-semibold text-[#0E1217]">{c.filingName}</div>
        <div className="font-mono text-[11px] text-[#6B7580]">{c.entityName}</div>
      </div>
    ),
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
];

export function ProtectionPage() {
  const e = PROTECTION_ELIGIBILITY;
  const [rows, setRows] = useState(PROTECTION_CLAIMS);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [form, setForm] = useState({
    filingName: '',
    amountClaimed: '',
    reason: '',
  });

  const onSubmit = async (ev: FormEvent) => {
    ev.preventDefault();
    const result = await submitProtectionClaim({
      workspaceId: 'ws-demo',
      entityId: 'ent-acme',
      filingName: form.filingName,
      amountClaimed: form.amountClaimed,
      reason: form.reason,
    });
    const id = 'id' in result ? result.id : `clm-local-${Date.now()}`;
    if ('error' in result && !result.error.includes('not configured')) {
      setMessage(result.error);
      return;
    }
    setRows((prev) => [
      {
        id,
        entityId: 'ent-acme',
        entityName: 'ACME Retail',
        filingName: form.filingName,
        amountClaimed: form.amountClaimed,
        submittedAt: new Date().toISOString().slice(0, 10),
        status: 'submitted',
        reason: form.reason,
      },
      ...prev,
    ]);
    setMessage('Claim submitted');
    setOpen(false);
  };

  return (
    <div>
      <PageHeader
        title="Protection Guarantee"
        description={e.guaranteeNote}
        actions={
          <button type="button" onClick={() => setOpen(true)} className="btn-primary text-sm py-2 px-4">
            <ShieldCheck className="h-4 w-4" /> File a claim
          </button>
        }
      />
      {message && (
        <p className="mb-3 rounded-xl border border-[#D5D0C6] bg-[#EBE8E2] px-3 py-2 text-xs text-[#5C6570]">
          {message}
        </p>
      )}

      <StatGrid>
        <StatCard label="Protected entities" value={e.activeEntities} tone="success" />
        <StatCard label="Covered filings (mo)" value={e.coveredFilingsThisMonth} />
        <StatCard label="Claims paid YTD" value={e.claimsPaidYTD} />
        <StatCard
          label="Open claims"
          value={rows.filter((c) =>
            ['submitted', 'under_review', 'approved'].includes(c.status),
          ).length}
          tone="warning"
        />
      </StatGrid>

      <h3 className="mb-3 mt-8 text-sm font-semibold text-[#0E1217]">Claim history</h3>
      <DataTable columns={columns} rows={rows} rowKey={(r) => r.id} />

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0E1217]/50 p-4">
          <form onSubmit={onSubmit} className="w-full max-w-md rounded-2xl border bg-white p-5 shadow-xl">
            <h2 className="mb-3 font-semibold">File protection claim</h2>
            <label className="mb-2 block text-xs font-semibold uppercase text-[#6B7580]">
              Filing
              <input
                required
                className="mt-1 w-full rounded-xl border px-3 py-2 text-sm"
                value={form.filingName}
                onChange={(e) => setForm((f) => ({ ...f, filingName: e.target.value }))}
              />
            </label>
            <label className="mb-2 block text-xs font-semibold uppercase text-[#6B7580]">
              Amount claimed
              <input
                required
                className="mt-1 w-full rounded-xl border px-3 py-2 text-sm"
                placeholder="₹5,000"
                value={form.amountClaimed}
                onChange={(e) => setForm((f) => ({ ...f, amountClaimed: e.target.value }))}
              />
            </label>
            <label className="mb-4 block text-xs font-semibold uppercase text-[#6B7580]">
              Reason
              <textarea
                required
                className="mt-1 w-full rounded-xl border px-3 py-2 text-sm"
                rows={3}
                value={form.reason}
                onChange={(e) => setForm((f) => ({ ...f, reason: e.target.value }))}
              />
            </label>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setOpen(false)} className="rounded-xl border px-3 py-2 text-sm">
                Cancel
              </button>
              <button type="submit" className="rounded-xl bg-[#B89E6B] px-3 py-2 text-sm font-semibold text-white">
                Submit claim
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
