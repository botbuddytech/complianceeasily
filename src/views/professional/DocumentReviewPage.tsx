'use client';

import { useState } from 'react';
import { Check, X } from 'lucide-react';
import { PageHeader } from '../../components/dashboard/PageHeader';
import { StatusBadge } from '../../components/dashboard/StatusBadge';
import { getMyDocuments } from '../../lib/professionalSession';
import { reviewDocument } from '@/lib/actions/domain';
import type { ComplianceDocument, DocumentStatus } from '../../types/dashboard';

export function ProfessionalDocumentReviewPage() {
  const [docs, setDocs] = useState(() =>
    getMyDocuments().filter((d) =>
      ['pending_review', 'uploaded', 'rejected'].includes(d.status),
    ),
  );
  const [busyId, setBusyId] = useState<string | null>(null);

  const setStatus = async (id: string, status: Extract<DocumentStatus, 'approved' | 'rejected'>) => {
    setBusyId(id);
    await reviewDocument(id, status);
    setDocs((prev) => prev.map((d) => (d.id === id ? { ...d, status } : d)));
    setBusyId(null);
  };

  return (
    <div>
      <PageHeader
        variant="admin"
        title="Document Review"
        description="Approve or reject client documents assigned to you. Persists to Supabase when configured."
      />

      {docs.length === 0 ? (
        <div className="rounded-2xl border border-admin-border bg-admin-surface px-4 py-10 text-center text-sm text-admin-muted">
          No documents awaiting your review.
        </div>
      ) : (
        <div className="space-y-3">
          {docs.map((d: ComplianceDocument) => (
            <article
              key={d.id}
              className="flex flex-col gap-3 rounded-2xl border border-admin-border bg-admin-surface p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-semibold text-admin-text">{d.name}</h2>
                  <StatusBadge status={d.status} />
                </div>
                <p className="mt-1 font-mono text-xs text-admin-muted">
                  {d.entityName} · {d.category} · {d.fileType} · uploaded {d.uploadedAt} by{' '}
                  {d.uploadedBy}
                </p>
              </div>
              <div className="flex shrink-0 gap-2">
                <button
                  type="button"
                  disabled={busyId === d.id}
                  onClick={() => setStatus(d.id, 'approved')}
                  className="inline-flex items-center gap-1 rounded-full bg-admin-accent px-3 py-1.5 text-xs font-semibold text-white hover:bg-admin-accent-hover disabled:opacity-60"
                >
                  <Check className="h-3.5 w-3.5" /> Approve
                </button>
                <button
                  type="button"
                  disabled={busyId === d.id}
                  onClick={() => setStatus(d.id, 'rejected')}
                  className="inline-flex items-center gap-1 rounded-full border border-admin-text px-3 py-1.5 text-xs font-semibold text-admin-text hover:bg-admin-bg disabled:opacity-60"
                >
                  <X className="h-3.5 w-3.5" /> Reject
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
