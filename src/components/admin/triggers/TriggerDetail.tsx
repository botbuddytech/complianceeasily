import type { ReactNode } from 'react';
import type { ComplianceTrigger, GovDepartment } from '../../../types/complianceTriggers';
import { formatDueDate, nextDueDate, reminderDates } from '../../../lib/triggerMatcher';
import { VerificationBadge } from '../../dashboard/VerificationBadge';
import { StatusBadge } from '../../dashboard/StatusBadge';
import { ConditionTree } from './ConditionTree';
import { ProcessStepsPanel } from './ProcessStepsPanel';
import { EvidencePanel } from './EvidencePanel';
import { RuleVersionTimeline } from './RuleVersionTimeline';

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

function Panel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-xl border border-admin-border bg-admin-surface p-3">
      <div className="font-mono text-[10px] font-semibold uppercase tracking-wider text-admin-muted">
        {title}
      </div>
      <div className="mt-2">{children}</div>
    </div>
  );
}

export function TriggerDetail({ trigger, department, mappedEntityCount }: TriggerDetailProps) {
  const due = nextDueDate(trigger);
  const reminders = reminderDates(trigger, due);
  const a = trigger.applicability;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <div className="font-display text-base font-semibold text-admin-text">{trigger.name}</div>
          <div className="mt-1 font-mono text-[11px] text-admin-muted">
            {trigger.id}
            {trigger.ruleId ? ` · ${trigger.ruleId}` : ''} · {trigger.legalReference}
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5">
          <Chip>{trigger.priority}</Chip>
          <Chip>{trigger.triggerType}</Chip>
          <Chip>{trigger.schedule.frequency}</Chip>
          <Chip>{trigger.professionalType}</Chip>
          {trigger.protectionEligible ? <Chip>Protected</Chip> : null}
          <StatusBadge status={trigger.status} />
          <VerificationBadge status={trigger.verificationStatus || 'imported_unverified'} />
          {!trigger.automationEnabled && (
            <span className="rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 font-mono text-[10px] text-amber-800">
              Review required
            </span>
          )}
        </div>
      </div>

      <p className="text-sm leading-relaxed text-admin-text/90">{trigger.description}</p>

      <div className="grid gap-3 sm:grid-cols-2">
        <Panel title="Legal basis & version">
          <ul className="space-y-1 text-xs text-admin-text">
            <li>
              <span className="text-admin-muted">Governing law:</span>{' '}
              {trigger.governingLaw || trigger.legalReference || '—'}
            </li>
            <li>
              <span className="text-admin-muted">Form code:</span> {trigger.formCode || trigger.forms.join(', ') || '—'}
            </li>
            <li>
              <span className="text-admin-muted">Obligation:</span>{' '}
              {(trigger.obligationKind || 'mandatory_if_applicable').replace(/_/g, ' ')}
            </li>
            <li>
              <span className="text-admin-muted">Scope:</span> {trigger.scopeLevel || 'central'}
            </li>
            <li>
              <span className="text-admin-muted">Jurisdiction:</span>{' '}
              {trigger.jurisdictionId || 'IN'}
            </li>
            {trigger.exceptionsText && (
              <li className="pt-1 text-admin-muted">{trigger.exceptionsText}</li>
            )}
          </ul>
          <div className="mt-3">
            <RuleVersionTimeline
              ruleId={trigger.ruleId}
              effectiveFrom={trigger.effectiveFrom}
              effectiveTo={trigger.effectiveTo}
              taxPeriod={trigger.taxPeriod}
              verificationStatus={trigger.verificationStatus}
            />
          </div>
        </Panel>

        <Panel title="Applicability">
          <ul className="space-y-1 text-xs text-admin-text">
            <li>
              <span className="text-admin-muted">Entities:</span> {a.entityTypes.join(', ') || '—'}
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
            {trigger.turnoverBasis && (
              <li>
                <span className="text-admin-muted">Turnover basis:</span> {trigger.turnoverBasis}
              </li>
            )}
            {a.minEmployees != null && (
              <li>
                <span className="text-admin-muted">Min employees:</span> {a.minEmployees}
              </li>
            )}
            {trigger.employeeBasis && (
              <li>
                <span className="text-admin-muted">Employee basis:</span> {trigger.employeeBasis}
              </li>
            )}
            <li className="pt-1 text-admin-muted">{a.conditionsText}</li>
          </ul>
        </Panel>
      </div>

      <Panel title="Conditions">
        <ConditionTree expression={trigger.condition} />
      </Panel>

      <div className="grid gap-3 sm:grid-cols-2">
        <Panel title="Schedule & reminders">
          <ul className="space-y-1 text-xs text-admin-text">
            <li>
              <span className="text-admin-muted">Due rule:</span> {trigger.schedule.dueRule}
            </li>
            <li>
              <span className="text-admin-muted">Deadline text:</span>{' '}
              {trigger.deadlineText || '—'}
            </li>
            <li>
              <span className="text-admin-muted">Schedule source:</span>{' '}
              {(trigger.scheduleSource || 'curated_unverified').replace(/_/g, ' ')}
            </li>
            <li>
              <span className="text-admin-muted">Next due:</span> {formatDueDate(due)}
            </li>
            <li>
              <span className="text-admin-muted">Lead days:</span>{' '}
              {trigger.notification.leadDays.map((d) => `T-${d}`).join(', ')}
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
        </Panel>

        <Panel title="Process & physical steps">
          <ProcessStepsPanel process={trigger.process} />
        </Panel>
      </div>

      <Panel title="Documents (indicative checklist)">
        {trigger.documents?.length ? (
          <div className="space-y-2">
            <p className="text-[11px] text-admin-muted">
              Compound checklists are indicative — not individually verified mandatory attachments.
            </p>
            {trigger.documents.map((d) => (
              <div
                key={d.documentId}
                className="rounded-lg border border-admin-border bg-admin-bg/40 px-2.5 py-2 text-xs"
              >
                <div className="font-semibold text-admin-text">{d.documentName}</div>
                <div className="font-mono text-[10px] text-admin-muted">
                  {d.entryKind} · {d.requirementStatus}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-admin-muted">No document checklist recorded.</p>
        )}
      </Panel>

      {(trigger.assetScopes?.length || trigger.thresholds?.length) && (
        <div className="grid gap-3 sm:grid-cols-2">
          {!!trigger.assetScopes?.length && (
            <Panel title="Asset scope">
              <ul className="space-y-1 text-xs">
                {trigger.assetScopes.map((s, i) => (
                  <li key={`${s.assetClassId}-${s.actorRole}-${i}`}>
                    <span className="font-semibold">{s.assetClassName || s.assetClassId}</span>
                    <span className="text-admin-muted"> · {s.actorRole.replace(/_/g, ' ')}</span>
                  </li>
                ))}
              </ul>
            </Panel>
          )}
          {!!trigger.thresholds?.length && (
            <Panel title="Thresholds">
              <ul className="space-y-1 text-xs">
                {trigger.thresholds.map((t, i) => (
                  <li key={i}>
                    {t.metric} {t.operator} {t.value} {t.unit} — {t.effect}
                  </li>
                ))}
              </ul>
            </Panel>
          )}
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        <Panel title="Penalty summary">
          <ul className="space-y-1 text-xs text-admin-text">
            <li>
              <span className="text-admin-muted">Late fee:</span> {trigger.penaltySummary.lateFee}
            </li>
            <li>
              <span className="text-admin-muted">Interest:</span> {trigger.penaltySummary.interest}
            </li>
            <li>
              <span className="text-admin-muted">Max:</span> {trigger.penaltySummary.maxPenalty}
            </li>
            {trigger.penaltySummary.penaltyRefId && (
              <li>
                <span className="text-admin-muted">Penalty ref:</span>{' '}
                {trigger.penaltySummary.penaltyRefId}
              </li>
            )}
            {trigger.penaltySummary.otherConsequences.map((c) => (
              <li key={c} className="text-admin-muted">
                · {c}
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title="Mapping & sources">
          <ul className="space-y-1 text-xs text-admin-text">
            <li>
              <span className="text-admin-muted">Mapped entities:</span> {mappedEntityCount ?? 0}
            </li>
            <li>
              <span className="text-admin-muted">Forms:</span>{' '}
              {trigger.forms.length ? trigger.forms.join(', ') : '—'}
            </li>
            {department && (
              <li>
                <span className="text-admin-muted">Portal:</span>{' '}
                {department.portalUrl ? (
                  <a
                    href={department.portalUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="underline underline-offset-2"
                  >
                    {department.shortName}
                  </a>
                ) : (
                  department.shortName
                )}
              </li>
            )}
            <li>
              <span className="text-admin-muted">Verified:</span> {trigger.lastVerified}
            </li>
          </ul>
        </Panel>
      </div>

      <Panel title="Evidence">
        <EvidencePanel evidence={trigger.evidence} />
      </Panel>

      <div className="rounded-xl border border-dashed border-admin-border bg-admin-surface p-3 text-xs text-admin-muted">
        <span className="font-semibold text-admin-text">Message template: </span>
        {trigger.notification.messageTemplate
          .replace('{name}', trigger.shortName)
          .replace('{dueDate}', formatDueDate(due))}
      </div>
    </div>
  );
}
