import { useMemo, useState } from 'react';
import { CLIENTS } from '../../../data/dashboard/clients';
import type { ComplianceTriggerDataset, EntityComplianceProfile } from '../../../types/complianceTriggers';
import {
  formatDueDate,
  nextDueDate,
  reminderDates,
  triggersForEntity,
} from '../../../lib/triggerMatcher';
import { StatusBadge } from '../../dashboard/StatusBadge';

interface ClientMappingPanelProps {
  dataset: ComplianceTriggerDataset;
  profiles: EntityComplianceProfile[];
}

export function ClientMappingPanel({ dataset, profiles }: ClientMappingPanelProps) {
  const [clientId, setClientId] = useState(CLIENTS[0]?.id ?? '');
  const clientEntities = useMemo(
    () => profiles.filter((p) => p.clientId === clientId),
    [profiles, clientId],
  );
  const [entityId, setEntityId] = useState(clientEntities[0]?.id ?? '');

  const activeEntityId =
    clientEntities.find((e) => e.id === entityId)?.id ?? clientEntities[0]?.id ?? '';

  const profile = profiles.find((p) => p.id === activeEntityId);

  const matches = useMemo(() => {
    if (!profile) return [];
    return triggersForEntity(profile, dataset).sort((a, b) => {
      const order = { critical: 0, high: 1, medium: 2, low: 3 };
      return order[a.trigger.priority] - order[b.trigger.priority];
    });
  }, [profile, dataset]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row">
        <select
          value={clientId}
          onChange={(e) => {
            setClientId(e.target.value);
            const next = profiles.find((p) => p.clientId === e.target.value);
            setEntityId(next?.id ?? '');
          }}
          className="flex-1 rounded-xl border border-admin-border bg-admin-surface px-3 py-2 text-sm"
        >
          {CLIENTS.map((c) => (
            <option key={c.id} value={c.id}>
              {c.businessName} ({c.state})
            </option>
          ))}
        </select>
        <select
          value={activeEntityId}
          onChange={(e) => setEntityId(e.target.value)}
          className="flex-1 rounded-xl border border-admin-border bg-admin-surface px-3 py-2 text-sm"
          disabled={clientEntities.length === 0}
        >
          {clientEntities.length === 0 ? (
            <option value="">No entities for this client</option>
          ) : (
            clientEntities.map((e) => (
              <option key={e.id} value={e.id}>
                {e.name} · {e.entityType}
              </option>
            ))
          )}
        </select>
      </div>

      {profile && (
        <div className="rounded-2xl border border-admin-border bg-admin-surface p-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="font-display text-lg font-semibold text-admin-text">{profile.name}</div>
              <div className="mt-1 font-mono text-xs text-admin-muted">
                {profile.entityType} · {profile.state} · {profile.industry}
              </div>
            </div>
            <div className="flex flex-wrap gap-3 font-mono text-xs text-admin-muted">
              <span>Employees: {profile.employees ?? '—'}</span>
              <span>
                Turnover: ₹{(profile.annualTurnoverInr ?? 0).toLocaleString('en-IN')}
              </span>
              <span>Regs: {(profile.registrations ?? []).length}</span>
            </div>
          </div>
          {(profile.registrations?.length ?? 0) > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {profile.registrations!.map((r) => (
                <span
                  key={r}
                  className="rounded-full border border-admin-border bg-admin-bg px-2 py-0.5 font-mono text-[10px] text-admin-muted"
                >
                  {r}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="rounded-2xl border border-admin-border bg-admin-surface overflow-hidden">
        <div className="border-b border-admin-border bg-admin-bg px-4 py-3 font-mono text-[11px] font-semibold uppercase tracking-wider text-admin-muted">
          Applicable triggers · {matches.length}
        </div>
        {matches.length === 0 ? (
          <div className="px-4 py-8 text-center text-sm text-admin-muted">
            No triggers map to this entity under current rules.
          </div>
        ) : (
          <ul className="divide-y divide-admin-border">
            {matches.map(({ trigger, reasons }) => {
              const due = nextDueDate(trigger);
              const reminders = reminderDates(trigger, due);
              const dept = dataset.departments.find((d) => d.id === trigger.departmentId);
              return (
                <li key={trigger.id} className="px-4 py-3">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="font-semibold text-admin-text">{trigger.shortName}</div>
                      <div className="text-xs text-admin-muted">
                        {dept?.shortName ?? trigger.departmentId} · {trigger.categoryId} ·{' '}
                        {trigger.triggerType}
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <StatusBadge status={trigger.priority} />
                      <span className="font-mono text-xs text-admin-muted">
                        Due {formatDueDate(due)}
                      </span>
                    </div>
                  </div>
                  <p className="mt-1 text-xs text-admin-muted">{trigger.schedule.dueRule}</p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {reasons.slice(0, 4).map((r) => (
                      <span
                        key={r}
                        className="rounded-md border border-admin-border bg-admin-bg px-2 py-0.5 text-[10px] text-admin-muted"
                      >
                        {r}
                      </span>
                    ))}
                  </div>
                  {reminders.length > 0 && (
                    <div className="mt-2 font-mono text-[10px] text-admin-muted">
                      Reminders: {reminders.join(' · ')}
                    </div>
                  )}
                  <div className="mt-1 font-mono text-[10px] text-admin-muted">
                    Channels: {trigger.notification.channels.join(', ')} → escalate{' '}
                    {trigger.notification.overdueEscalation}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
