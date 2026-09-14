import type { ReactNode } from 'react';
import type { ComplianceTrigger, GovDepartment } from '../../../types/complianceTriggers';
import { formatDueDate, nextDueDate, reminderDates } from '../../../lib/triggerMatcher';

interface TriggerDetailProps {
  trigger: ComplianceTrigger;
  department?: GovDepartment;
  mappedEntityCount?: number;
}

function Chip({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-full border border-admin-border bg-admin-bg px-2 py-0.5 font-mono text-[10px] text-admin-muted">
      {children}
    </span>
  );
}

export function TriggerDetail({ trigger, department, mappedEntityCount }: TriggerDetailProps) {
  const due = nextDueDate(trigger);
  const reminders = reminderDates(trigger, due);
  const a = trigger.applicability;

  return (
    <div className="space-y-4 rounded-2xl border border-admin-border bg-admin-bg/50 p-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <div className="font-display text-base font-semibold text-admin-text">{trigger.name}</div>
          <div className="mt-1 font-mono text-[11px] text-admin-muted">
            {trigger.id} · {trigger.legalReference}
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5">
          <Chip>{trigger.priority}</Chip>
          <Chip>{trigger.triggerType}</Chip>
          <Chip>{trigger.schedule.frequency}</Chip>
          <Chip>{trigger.professionalType}</Chip>
          {trigger.protectionEligible ? <Chip>Protected</Chip> : null}
        </div>
      </div>

      <p className="text-sm leading-relaxed text-admin-text/90">{trigger.description}</p>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-admin-border bg-admin-surface p-3">
          <div className="font-mono text-[10px] font-semibold uppercase tracking-wider text-admin-muted">
            Applicability
          </div>
          <ul className="mt-2 space-y-1 text-xs text-admin-text">
            <li>
              <span className="text-admin-muted">Entities:</span> {a.entityTypes.join(', ')}
            </li>
            <li>
              <span className="text-admin-muted">Industries:</span>{' '}
              {a.industries === 'all' ? 'All' : a.industries.join(', ')}
            </li>
            <li>
              <span className="text-admin-muted">States:</span>{' '}
              {a.states === 'all' ? 'All India' : a.states.join(', ')}
            </li>
            {a.minTurnoverInr != null && (
              <li>
                <span className="text-admin-muted">Min turnover:</span> ₹
                {a.minTurnoverInr.toLocaleString('en-IN')}
              </li>
            )}
            {a.maxTurnoverInr != null && (
              <li>
                <span className="text-admin-muted">Max turnover:</span> ₹
                {a.maxTurnoverInr.toLocaleString('en-IN')}
              </li>
            )}
            {a.minEmployees != null && (
              <li>
                <span className="text-admin-muted">Min employees:</span> {a.minEmployees}
              </li>
            )}
            {a.requiresRegistrations.length > 0 && (
              <li>
                <span className="text-admin-muted">Requires:</span>{' '}
                {a.requiresRegistrations.join(', ')}
              </li>
            )}
            {a.excludesRegistrations.length > 0 && (
              <li>
                <span className="text-admin-muted">Excludes if has:</span>{' '}
                {a.excludesRegistrations.join(', ')}
              </li>
            )}
            <li className="pt-1 text-admin-muted">{a.conditionsText}</li>
          </ul>
        </div>

        <div className="rounded-xl border border-admin-border bg-admin-surface p-3">
          <div className="font-mono text-[10px] font-semibold uppercase tracking-wider text-admin-muted">
            Schedule & reminders
          </div>
          <ul className="mt-2 space-y-1 text-xs text-admin-text">
            <li>
              <span className="text-admin-muted">Due rule:</span> {trigger.schedule.dueRule}
            </li>
            <li>
              <span className="text-admin-muted">Next due:</span> {formatDueDate(due)}
            </li>
            <li>
              <span className="text-admin-muted">Lead days:</span>{' '}
              {trigger.notification.leadDays.map((d) => `T-${d}`).join(', ')}
            </li>
            <li>
              <span className="text-admin-muted">Channels:</span>{' '}
              {trigger.notification.channels.join(', ')}
            </li>
            <li>
              <span className="text-admin-muted">Escalation:</span>{' '}
              {trigger.notification.overdueEscalation}
            </li>
            {reminders.length > 0 && (
              <li className="pt-1">
                <span className="text-admin-muted">Upcoming reminders:</span>
                <ul className="mt-1 list-inside list-disc text-admin-muted">
                  {reminders.map((r) => (
                    <li key={r}>{r}</li>
                  ))}
                </ul>
              </li>
            )}
          </ul>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-admin-border bg-admin-surface p-3">
          <div className="font-mono text-[10px] font-semibold uppercase tracking-wider text-admin-muted">
            Penalty summary
          </div>
          <ul className="mt-2 space-y-1 text-xs text-admin-text">
            <li>
              <span className="text-admin-muted">Late fee:</span> {trigger.penaltySummary.lateFee}
            </li>
            <li>
              <span className="text-admin-muted">Interest:</span> {trigger.penaltySummary.interest}
            </li>
            <li>
              <span className="text-admin-muted">Max:</span> {trigger.penaltySummary.maxPenalty}
            </li>
            {trigger.penaltySummary.otherConsequences.map((c) => (
              <li key={c} className="text-admin-muted">
                · {c}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-xl border border-admin-border bg-admin-surface p-3">
          <div className="font-mono text-[10px] font-semibold uppercase tracking-wider text-admin-muted">
            Mapping & sources
          </div>
          <ul className="mt-2 space-y-1 text-xs text-admin-text">
            <li>
              <span className="text-admin-muted">Mapped entities:</span> {mappedEntityCount ?? 0}
            </li>
            <li>
              <span className="text-admin-muted">Forms:</span>{' '}
              {trigger.forms.length ? trigger.forms.join(', ') : '—'}
            </li>
            <li>
              <span className="text-admin-muted">Linked services:</span>{' '}
              {trigger.linkedServiceIds.length ? trigger.linkedServiceIds.join(', ') : '—'}
            </li>
            {department && (
              <li>
                <span className="text-admin-muted">Portal:</span>{' '}
                <a
                  href={department.portalUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="underline underline-offset-2"
                >
                  {department.shortName}
                </a>
              </li>
            )}
            <li>
              <span className="text-admin-muted">Source:</span>{' '}
              <a
                href={trigger.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="break-all underline underline-offset-2"
              >
                {trigger.sourceUrl}
              </a>
            </li>
            <li>
              <span className="text-admin-muted">Verified:</span> {trigger.lastVerified}
            </li>
          </ul>
        </div>
      </div>

      <div className="rounded-xl border border-dashed border-admin-border bg-admin-surface p-3 text-xs text-admin-muted">
        <span className="font-semibold text-admin-text">Message template: </span>
        {trigger.notification.messageTemplate
          .replace('{entity}', '{entity}')
          .replace('{name}', trigger.shortName)
          .replace('{dueDate}', formatDueDate(due))}
      </div>
    </div>
  );
}
