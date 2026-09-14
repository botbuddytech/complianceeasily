import { MapPin, FileText } from 'lucide-react';
import { PageHeader } from '../../../components/dashboard/PageHeader';
import { StatusBadge } from '../../../components/dashboard/StatusBadge';
import {
  getMyPropertyAssets,
  getMyInvestmentCompliances,
  getMyClients,
} from '../../../lib/professionalSession';
import { formatInr } from '../../../data/dashboard/investments';

export function ProfessionalInvestmentsPropertyPage() {
  const properties = getMyPropertyAssets();
  const compliances = getMyInvestmentCompliances().filter((c) => c.domain === 'Property');
  const clients = getMyClients();
  const clientName = (clientId: string) =>
    clients.find((c) => c.id === clientId)?.businessName ?? clientId;

  return (
    <div>
      <PageHeader
        variant="admin"
        title="Property & Land"
        description="Client land and property documents with linked compliances. Read-only."
      />

      {properties.length === 0 ? (
        <div className="rounded-2xl border border-admin-border bg-admin-surface px-4 py-10 text-center text-sm text-admin-muted">
          No property assets for your assigned clients.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {properties.map((p) => {
            const linked = compliances.filter(
              (c) => c.assetLabel === p.name && c.clientId === p.clientId,
            );
            return (
              <article
                key={p.id}
                className="flex flex-col rounded-2xl border border-admin-border bg-admin-surface p-5"
              >
                <div className="mb-3 flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h2 className="font-semibold text-admin-text">{p.name}</h2>
                    <p className="mt-0.5 font-mono text-[11px] text-admin-muted">
                      {clientName(p.clientId)} · {p.type} · {p.ownershipType}
                    </p>
                  </div>
                  <StatusBadge status={p.type.toLowerCase()} />
                </div>

                <dl className="space-y-2 font-mono text-xs text-admin-muted">
                  <div className="flex items-start justify-between gap-2">
                    <dt className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> Location
                    </dt>
                    <dd className="max-w-[60%] text-right font-semibold text-admin-text">
                      {p.address}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-2">
                    <dt>Registration</dt>
                    <dd className="font-semibold text-admin-text">{p.registrationNo}</dd>
                  </div>
                  <div className="flex justify-between gap-2">
                    <dt>Current value</dt>
                    <dd className="font-semibold text-admin-accent">
                      {formatInr(p.currentValueInr)}
                    </dd>
                  </div>
                </dl>

                {linked.length > 0 && (
                  <div className="mt-4 border-t border-admin-border pt-3">
                    <div className="mb-2 flex items-center gap-1 font-mono text-[11px] font-bold uppercase tracking-wider text-admin-muted">
                      <FileText className="h-3 w-3" /> Linked compliances
                    </div>
                    <ul className="space-y-2">
                      {linked.map((c) => (
                        <li
                          key={c.id}
                          className="flex items-center justify-between gap-2 text-xs"
                        >
                          <span className="truncate text-admin-text">{c.name}</span>
                          <StatusBadge status={c.status} />
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
