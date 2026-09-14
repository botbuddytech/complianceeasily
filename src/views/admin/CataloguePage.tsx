'use client';

import { FormEvent, useState } from 'react';
import { PageHeader } from '../../components/dashboard/PageHeader';
import { StatusBadge } from '../../components/dashboard/StatusBadge';
import { DataTable, type Column } from '../../components/dashboard/DataTable';
import { CATALOGUE_ADMIN } from '../../data/dashboard/catalogueAdmin';
import { upsertService } from '@/lib/actions/domain';
import type { CatalogueServiceAdmin } from '../../types/dashboard';

const columns: Column<CatalogueServiceAdmin>[] = [
  {
    key: 'service',
    header: 'Service',
    render: (s) => (
      <div>
        <div className="font-semibold text-admin-text">{s.shortName}</div>
        <div className="max-w-xs truncate text-xs text-admin-muted">{s.name}</div>
      </div>
    ),
  },
  {
    key: 'category',
    header: 'Category',
    render: (s) => <span className="font-mono text-xs">{s.category}</span>,
  },
  {
    key: 'price',
    header: 'Price',
    render: (s) => <span className="font-mono text-xs font-semibold">{s.price}</span>,
  },
  {
    key: 'gov',
    header: 'Gov fees',
    render: (s) => <span className="font-mono text-xs text-admin-muted">{s.governmentFees}</span>,
  },
  {
    key: 'volume',
    header: 'Filings (mo)',
    render: (s) => <span className="font-mono text-sm font-semibold">{s.filingsThisMonth}</span>,
  },
  {
    key: 'status',
    header: 'Status',
    render: (s) => <StatusBadge status={s.status} />,
  },
  {
    key: 'prot',
    header: 'Protected',
    render: (s) => (
      <span className="font-mono text-xs">{s.protectionEligible ? 'Yes' : 'No'}</span>
    ),
  },
];

export function CataloguePage() {
  const [rows, setRows] = useState(CATALOGUE_ADMIN);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: '',
    shortName: '',
    category: 'GST',
    department: 'GSTN',
    price: '₹999',
    governmentFees: '₹0',
    status: 'active' as CatalogueServiceAdmin['status'],
    protectionEligible: true,
  });

  const onSave = async (e: FormEvent) => {
    e.preventDefault();
    const result = await upsertService(form);
    const id = 'id' in result ? result.id : `svc-local-${Date.now()}`;
    if ('error' in result && !result.error.includes('not configured')) {
      setMessage(result.error);
      return;
    }
    setRows((prev) => [
      {
        id,
        ...form,
        filingsThisMonth: 0,
      },
      ...prev,
    ]);
    setMessage('Service saved to unified catalogue');
    setOpen(false);
  };

  return (
    <div>
      <PageHeader
        variant="admin"
        title="Service Catalogue"
        description="Unified marketing + admin catalogue (services table)."
        actions={
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="rounded-full bg-admin-accent px-4 py-2 text-sm font-semibold text-white"
          >
            Add service
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
          <form onSubmit={onSave} className="w-full max-w-lg rounded-2xl border bg-white p-5 shadow-xl">
            <h2 className="mb-3 font-semibold">Add / update service</h2>
            <div className="grid gap-2 sm:grid-cols-2">
              {(['name', 'shortName', 'category', 'department', 'price', 'governmentFees'] as const).map(
                (key) => (
                  <label key={key} className="block text-xs font-semibold uppercase text-admin-muted">
                    {key}
                    <input
                      required
                      className="mt-1 w-full rounded-xl border px-3 py-2 text-sm"
                      value={form[key]}
                      onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                    />
                  </label>
                ),
              )}
              <label className="block text-xs font-semibold uppercase text-admin-muted">
                Status
                <select
                  className="mt-1 w-full rounded-xl border px-3 py-2 text-sm"
                  value={form.status}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      status: e.target.value as CatalogueServiceAdmin['status'],
                    }))
                  }
                >
                  <option value="active">active</option>
                  <option value="coming_soon">coming_soon</option>
                  <option value="deprecated">deprecated</option>
                </select>
              </label>
              <label className="flex items-center gap-2 text-xs font-semibold uppercase text-admin-muted">
                <input
                  type="checkbox"
                  checked={form.protectionEligible}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, protectionEligible: e.target.checked }))
                  }
                />
                Protection eligible
              </label>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button type="button" onClick={() => setOpen(false)} className="rounded-xl border px-3 py-2 text-sm">
                Cancel
              </button>
              <button type="submit" className="rounded-xl bg-admin-accent px-3 py-2 text-sm font-semibold text-white">
                Save
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
