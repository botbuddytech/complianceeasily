'use client';

import { FormEvent, useState } from 'react';
import { Upload, File } from 'lucide-react';
import { PageHeader } from '../../components/dashboard/PageHeader';
import { StatusBadge } from '../../components/dashboard/StatusBadge';
import { DataTable, type Column } from '../../components/dashboard/DataTable';
import { VerifiedBadge } from '../../components/VerifiedBadge';
import { DOCUMENTS } from '../../data/dashboard/documents';
import { uploadDocumentMeta } from '@/lib/actions/domain';
import type { ComplianceDocument } from '../../types/dashboard';

const columns: Column<ComplianceDocument>[] = [
  {
    key: 'name',
    header: 'Document',
    render: (d) => (
      <div className="flex items-start gap-2">
        <File className="mt-0.5 h-4 w-4 shrink-0 text-[#6B7580]" />
        <div>
          <div className="font-semibold text-[#0E1217]">{d.name}</div>
          <div className="font-mono text-[11px] text-[#6B7580]">
            {d.category} · {d.fileType} · {d.sizeLabel}
          </div>
        </div>
      </div>
    ),
  },
  {
    key: 'entity',
    header: 'Entity',
    render: (d) => <span className="font-mono text-xs">{d.entityName}</span>,
  },
  {
    key: 'uploaded',
    header: 'Uploaded',
    render: (d) => (
      <div className="font-mono text-xs">
        <div>{d.uploadedAt}</div>
        <div className="text-[#6B7580]">by {d.uploadedBy}</div>
      </div>
    ),
  },
  {
    key: 'status',
    header: 'Status',
    render: (d) => <StatusBadge status={d.status} />,
  },
];

export function DocumentsPage() {
  const [rows, setRows] = useState(DOCUMENTS);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: '',
    category: 'GST Returns',
    fileType: 'PDF',
    entityId: 'ent-acme',
  });

  const onUpload = async (e: FormEvent) => {
    e.preventDefault();
    const result = await uploadDocumentMeta({
      workspaceId: 'ws-demo',
      entityId: form.entityId,
      name: form.name,
      category: form.category,
      fileType: form.fileType,
      sizeBytes: 120_000,
      storagePath: `documents/${form.entityId}/${Date.now()}-${form.name}`,
      uploadedBy: 'You',
    });
    const id = 'id' in result ? result.id : `doc-local-${Date.now()}`;
    if ('error' in result) {
      setMessage(result.error);
      if (!result.error.includes('not configured')) return;
    }
    setRows((prev) => [
      {
        id,
        entityId: form.entityId,
        entityName: 'ACME Retail',
        name: form.name,
        category: form.category,
        fileType: form.fileType,
        sizeLabel: '120 KB',
        uploadedAt: new Date().toISOString().slice(0, 10),
        status: 'pending_review',
        uploadedBy: 'You',
      },
      ...prev,
    ]);
    setMessage('Document metadata saved (upload file to Storage when Supabase is configured).');
    setOpen(false);
  };

  return (
    <div>
      <PageHeader
        title="Document Vault"
        description="Centralized compliance documents, acknowledgements, and uploads."
        actions={
          <>
            <VerifiedBadge variant="contract_sync" />
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="btn-primary text-sm py-2 px-4"
            >
              <Upload className="h-4 w-4" /> Upload
            </button>
          </>
        }
      />
      {message && (
        <p className="mb-3 rounded-xl border border-[#D5D0C6] bg-[#EBE8E2] px-3 py-2 text-xs text-[#5C6570]">
          {message}
        </p>
      )}
      <DataTable columns={columns} rows={rows} rowKey={(r) => r.id} />

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0E1217]/50 p-4">
          <form
            onSubmit={onUpload}
            className="w-full max-w-md rounded-2xl border border-[#D5D0C6] bg-white p-5 shadow-xl"
          >
            <h2 className="mb-3 font-semibold">Upload document</h2>
            <label className="mb-2 block text-xs font-semibold uppercase text-[#6B7580]">
              Name
              <input
                required
                className="mt-1 w-full rounded-xl border border-[#D5D0C6] px-3 py-2 text-sm"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              />
            </label>
            <label className="mb-2 block text-xs font-semibold uppercase text-[#6B7580]">
              Category
              <select
                className="mt-1 w-full rounded-xl border border-[#D5D0C6] px-3 py-2 text-sm"
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
              >
                {['GST Returns', 'Banking', 'Registrations', 'MCA', 'Licences', 'Other'].map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </label>
            <div className="mt-4 flex justify-end gap-2">
              <button type="button" onClick={() => setOpen(false)} className="rounded-xl border px-3 py-2 text-sm">
                Cancel
              </button>
              <button type="submit" className="rounded-xl bg-[#B89E6B] px-3 py-2 text-sm font-semibold text-white">
                Save
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
