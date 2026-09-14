import { useState } from 'react';
import { PageHeader } from '../../components/dashboard/PageHeader';
import { StatusBadge } from '../../components/dashboard/StatusBadge';
import { getCurrentProfessional } from '../../lib/professionalSession';
import type { ProfessionalProfile } from '../../types/dashboard';

export function ProfessionalProfilePage() {
  const base = getCurrentProfessional();
  const [status, setStatus] = useState<ProfessionalProfile['status']>(base.status);

  return (
    <div>
      <PageHeader
        variant="admin"
        title="Profile & Specialties"
        description="Your practitioner identity on the ComplianceEasily network. Availability toggle is UI-only."
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-2xl border border-admin-border bg-admin-surface p-5">
          <h2 className="text-sm font-semibold text-admin-text">Identity</h2>
          <div className="mt-4 space-y-3">
            <label className="block text-xs font-mono text-admin-muted">
              Full name
              <input
                className="mt-1 w-full rounded-xl border border-admin-border bg-admin-bg px-3 py-2 text-sm text-admin-text"
                defaultValue={base.name}
                readOnly
              />
            </label>
            <label className="block text-xs font-mono text-admin-muted">
              Email
              <input
                className="mt-1 w-full rounded-xl border border-admin-border bg-admin-bg px-3 py-2 text-sm text-admin-text"
                defaultValue={base.email}
                readOnly
              />
            </label>
            <label className="block text-xs font-mono text-admin-muted">
              Practitioner type
              <input
                className="mt-1 w-full rounded-xl border border-admin-border bg-admin-bg px-3 py-2 text-sm text-admin-text"
                defaultValue={base.type}
                readOnly
              />
            </label>
            <label className="block text-xs font-mono text-admin-muted">
              Registration no.
              <input
                className="mt-1 w-full rounded-xl border border-admin-border bg-admin-bg px-3 py-2 text-sm text-admin-text"
                defaultValue={base.registrationNo ?? '—'}
                readOnly
              />
            </label>
          </div>
        </section>

        <section className="rounded-2xl border border-admin-border bg-admin-surface p-5">
          <h2 className="text-sm font-semibold text-admin-text">Availability</h2>
          <p className="mt-1 text-xs text-admin-muted">
            Controls how the admin queue routes new assignments. Demo toggle only.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {(['available', 'busy', 'offline'] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setStatus(s)}
                className={`rounded-full border px-3 py-1.5 text-xs font-semibold capitalize transition-colors ${
                  status === s
                    ? 'border-admin-accent bg-admin-accent text-white'
                    : 'border-admin-border bg-admin-bg text-admin-muted hover:bg-admin-border/40'
                }`}
              >
                {s}
              </button>
            ))}
            <StatusBadge status={status} className="ml-2" />
          </div>

          <h2 className="mt-8 text-sm font-semibold text-admin-text">Specialties</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {base.specialties.map((s) => (
              <span
                key={s}
                className="rounded-full border border-admin-border bg-admin-bg px-3 py-1 font-mono text-[11px] text-admin-muted"
              >
                {s}
              </span>
            ))}
          </div>

          <div className="mt-8 grid grid-cols-3 gap-3 font-mono text-xs text-admin-muted">
            <div className="rounded-xl border border-admin-border bg-admin-bg p-3">
              <div className="uppercase tracking-wider">Active</div>
              <div className="mt-1 text-lg font-semibold text-admin-text">
                {base.activeAssignments}
              </div>
            </div>
            <div className="rounded-xl border border-admin-border bg-admin-bg p-3">
              <div className="uppercase tracking-wider">Done (mo)</div>
              <div className="mt-1 text-lg font-semibold text-admin-text">
                {base.completedThisMonth}
              </div>
            </div>
            <div className="rounded-xl border border-admin-border bg-admin-bg p-3">
              <div className="uppercase tracking-wider">Avg TAT</div>
              <div className="mt-1 text-lg font-semibold text-admin-text">
                {base.avgTurnaroundDays}d
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
