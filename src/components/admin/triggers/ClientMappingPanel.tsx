'use client';

import { useMemo, useState } from 'react';
import { CLIENTS } from '../../../data/dashboard/clients';
import type {
  ApplicabilityResult,
  ComplianceTriggerDataset,
  EntityComplianceProfile,
} from '../../../types/complianceTriggers';
import catalogueRaw from '../../../data/complianceCatalogue.json';
import type { ComplianceCatalogueDataset } from '../../../types/complianceTriggers';
import {
  formatDueDate,
  nextDueDate,
  triggersGroupedForEntity,
} from '../../../lib/triggerMatcher';
import { StatusBadge } from '../../dashboard/StatusBadge';
import { ResultBadge } from '../../dashboard/VerificationBadge';
import { MissingFactsPanel } from './MissingFactsPanel';

const catalogue = catalogueRaw as ComplianceCatalogueDataset;

const GROUP_ORDER: ApplicabilityResult[] = [
  'applicable',
  'needs_review',
  'unknown',
  'not_applicable',
];

const GROUP_LABELS: Record<ApplicabilityResult, string> = {
  applicable: 'Applicable',
  needs_review: 'Needs review',
  unknown: 'Unknown — missing facts',
  not_applicable: 'Not applicable',
};

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
  const [factOverrides, setFactOverrides] = useState<Record<string, string>>({});
  const [showNotApplicable, setShowNotApplicable] = useState(false);

  const activeEntityId =
    clientEntities.find((e) => e.id === entityId)?.id ?? clientEntities[0]?.id ?? '';

  const baseProfile = profiles.find((p) => p.id === activeEntityId);

  const profile = useMemo(() => {
    if (!baseProfile) return undefined;
    const facts: Record<string, string | number | boolean> = {};
    for (const [k, v] of Object.entries(baseProfile.facts || {})) {
      if (v !== null && v !== undefined) facts[k] = v;
    }
    for (const [k, v] of Object.entries(factOverrides)) {
      if (!v.trim()) continue;
      const num = Number(v);
      facts[k] = Number.isFinite(num) && v.trim() !== '' && /^-?\d+(\.\d+)?$/.test(v.trim()) ? num : v;
    }
    return { ...baseProfile, facts };
  }, [baseProfile, factOverrides]);

  const groups = useMemo(() => {
    if (!profile) {
      return {
        applicable: [],
        needs_review: [],
        unknown: [],
        not_applicable: [],
      } as ReturnType<typeof triggersGroupedForEntity>;
    }
    return triggersGroupedForEntity(profile, dataset);
  }, [profile, dataset]);

  const allMissing = useMemo(() => {
    const set = new Set<string>();
    for (const g of ['unknown', 'needs_review'] as const) {
      for (const row of groups[g]) {
        row.missingFacts.forEach((f) => set.add(f));
      }
    }
    return [...set];
  }, [groups]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row">
        <select
          value={clientId}
          onChange={(e) => {
            setClientId(e.target.value);
            const next = profiles.find((p) => p.clientId === e.target.value);
            setEntityId(next?.id ?? '');
            setFactOverrides({});
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
          onChange={(e) => {
            setEntityId(e.target.value);
            setFactOverrides({});
          }}
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
                {profile.entityType}
                {profile.entityTypeId ? ` (${profile.entityTypeId})` : ''} · {profile.state} ·{' '}
                {profile.industry}
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
          <div className="mt-3 flex flex-wrap gap-2 font-mono text-[11px]">
            <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-emerald-800">
              Applicable {groups.applicable.length}
            </span>
            <span className="rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-amber-800">
              Needs review {groups.needs_review.length}
            </span>
            <span className="rounded-full border border-sky-200 bg-sky-50 px-2 py-0.5 text-sky-800">
              Unknown {groups.unknown.length}
            </span>
            <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-slate-600">
              Not applicable {groups.not_applicable.length}
            </span>
          </div>
        </div>
      )}

      {allMissing.length > 0 && (
        <div className="rounded-2xl border border-amber-200 bg-admin-surface p-4">
          <div className="mb-2 font-mono text-[11px] font-semibold uppercase tracking-wider text-amber-800">
            Missing facts
          </div>
          <MissingFactsPanel
            missingFacts={allMissing}
            fieldDefs={catalogue.businessProfileFields}
            values={factOverrides}
            onChange={(fieldId, value) =>
              setFactOverrides((prev) => ({ ...prev, [fieldId]: value }))
            }
          />
        </div>
      )}

      <label className="flex items-center gap-2 text-xs text-admin-muted">
        <input
          type="checkbox"
          checked={showNotApplicable}
          onChange={(e) => setShowNotApplicable(e.target.checked)}
        />
        Show not-applicable rules
      </label>

      {GROUP_ORDER.filter((g) => g !== 'not_applicable' || showNotApplicable).map((group) => {
        const rows = groups[group];
        if (!rows.length) return null;
        return (
          <div
            key={group}
            className="overflow-hidden rounded-2xl border border-admin-border bg-admin-surface"
          >
            <div className="border-b border-admin-border bg-admin-bg px-4 py-3 font-mono text-[11px] font-semibold uppercase tracking-wider text-admin-muted">
              {GROUP_LABELS[group]} · {rows.length}
            </div>
            <ul className="divide-y divide-admin-border">
              {rows
                .slice()
                .sort((a, b) => {
                  const order = { critical: 0, high: 1, medium: 2, low: 3 };
                  return order[a.trigger.priority] - order[b.trigger.priority];
                })
                .slice(0, group === 'not_applicable' ? 40 : 200)
                .map(({ trigger, reasons, missingFacts }) => {
                  const due = nextDueDate(trigger);
                  const dept = dataset.departments.find((d) => d.id === trigger.departmentId);
                  return (
                    <li key={trigger.id} className="px-4 py-3">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div className="min-w-0">
                          <div className="font-semibold text-admin-text">{trigger.shortName}</div>
                          <div className="text-xs text-admin-muted">
                            {dept?.shortName ?? trigger.departmentId} · {trigger.triggerType}
                            {trigger.obligationKind
                              ? ` · ${trigger.obligationKind.replace(/_/g, ' ')}`
                              : ''}
                          </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          <ResultBadge result={group} />
                          <StatusBadge status={trigger.priority} />
                          <span className="font-mono text-xs text-admin-muted">
                            Due {formatDueDate(due)}
                          </span>
                        </div>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {reasons.slice(0, 5).map((r) => (
                          <span
                            key={r}
                            className="rounded-md border border-admin-border bg-admin-bg px-2 py-0.5 text-[10px] text-admin-muted"
                          >
                            {r}
                          </span>
                        ))}
                      </div>
                      {missingFacts.length > 0 && (
                        <div className="mt-1 font-mono text-[10px] text-amber-800">
                          Missing: {missingFacts.join(', ')}
                        </div>
                      )}
                    </li>
                  );
                })}
            </ul>
          </div>
        );
      })}
    </div>
  );
}
