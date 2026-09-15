'use client';

import { useMemo, useState } from 'react';
import type {
  ComplianceTrigger,
  GovDepartment,
  EntityComplianceProfile,
} from '../../../types/complianceTriggers';
import { entitiesForTrigger, formatDueDate, nextDueDate } from '../../../lib/triggerMatcher';
import { StatusBadge } from '../../dashboard/StatusBadge';
import { VerificationBadge } from '../../dashboard/VerificationBadge';
import { EmptyState } from '../../dashboard/EmptyState';
import { Drawer } from '../../ui/Drawer';
import { TriggerDetail } from './TriggerDetail';

interface TriggerTableProps {
  triggers: ComplianceTrigger[];
  departments: GovDepartment[];
  profiles: EntityComplianceProfile[];
}

export function TriggerTable({ triggers, departments, profiles }: TriggerTableProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selected = useMemo(
    () => triggers.find((t) => t.id === selectedId) ?? null,
    [triggers, selectedId],
  );
  const selectedDept = selected
    ? departments.find((d) => d.id === selected.departmentId)
    : undefined;
  const selectedMapped = selected ? entitiesForTrigger(selected, profiles) : [];

  if (triggers.length === 0) {
    return (
      <EmptyState
        title="No triggers match"
        description="Try clearing filters or switching department / category / jurisdiction."
      />
    );
  }

  const sorted = [...triggers].sort((a, b) => a.shortName.localeCompare(b.shortName));

  return (
    <>
      <div className="overflow-hidden rounded-2xl border border-admin-border bg-admin-surface">
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead>
              <tr className="sticky top-0 z-10 border-b border-admin-border bg-admin-bg font-mono text-[11px] font-semibold uppercase tracking-wider text-admin-muted">
                <th className="px-3 py-3">Trigger</th>
                <th className="px-3 py-3">Type</th>
                <th className="px-3 py-3">Frequency</th>
                <th className="px-3 py-3">Jurisdiction</th>
                <th className="px-3 py-3">Verification</th>
                <th className="px-3 py-3">Automation</th>
                <th className="px-3 py-3">Priority</th>
                <th className="px-3 py-3">Next due</th>
                <th className="px-3 py-3">Entities</th>
                <th className="px-3 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((tr) => {
                const mapped = entitiesForTrigger(tr, profiles);
                const muted = !tr.automationEnabled;
                return (
                  <tr
                    key={tr.id}
                    className={`cursor-pointer border-b border-admin-border/70 last:border-0 hover:bg-admin-bg/60 ${
                      muted ? 'opacity-80' : ''
                    }`}
                    onClick={() => setSelectedId(tr.id)}
                  >
                    <td className="px-3 py-3">
                      <div className="font-semibold text-admin-text">{tr.shortName}</div>
                      <div className="max-w-[220px] truncate text-xs text-admin-muted">{tr.name}</div>
                    </td>
                    <td className="px-3 py-3 font-mono text-xs">{tr.triggerType}</td>
                    <td className="px-3 py-3 font-mono text-xs">{tr.schedule.frequency}</td>
                    <td className="px-3 py-3 font-mono text-xs">{tr.jurisdictionId || 'IN'}</td>
                    <td className="px-3 py-3">
                      <VerificationBadge status={tr.verificationStatus || 'imported_unverified'} />
                    </td>
                    <td className="px-3 py-3">
                      {tr.automationEnabled ? (
                        <StatusBadge status="active" />
                      ) : (
                        <span className="rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 font-mono text-[10px] text-amber-800">
                          Review required
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-3">
                      <StatusBadge status={tr.priority} />
                    </td>
                    <td className="px-3 py-3 font-mono text-xs">{formatDueDate(nextDueDate(tr))}</td>
                    <td className="px-3 py-3 font-mono text-xs">{mapped.length}</td>
                    <td className="px-3 py-3">
                      <StatusBadge status={tr.status} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="space-y-2 p-3 md:hidden">
          {sorted.map((tr) => (
            <button
              key={tr.id}
              type="button"
              onClick={() => setSelectedId(tr.id)}
              className="w-full rounded-xl border border-admin-border bg-admin-bg/40 p-3 text-left"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="font-semibold text-admin-text">{tr.shortName}</div>
                  <div className="text-xs text-admin-muted">{tr.name}</div>
                </div>
                <StatusBadge status={tr.status} />
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                <VerificationBadge status={tr.verificationStatus || 'imported_unverified'} />
                {!tr.automationEnabled && (
                  <span className="rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 font-mono text-[10px] text-amber-800">
                    Review required
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      <Drawer
        open={Boolean(selected)}
        onClose={() => setSelectedId(null)}
        title={selected?.name || ''}
        subtitle={selected ? `${selected.id}${selected.ruleId ? ` · ${selected.ruleId}` : ''}` : ''}
        widthClass="max-w-2xl"
      >
        {selected && (
          <div className="space-y-4 pb-8">
            <TriggerDetail
              trigger={selected}
              department={selectedDept}
              mappedEntityCount={selectedMapped.length}
            />
            {selectedMapped.length > 0 && (
              <div className="rounded-xl border border-admin-border bg-admin-bg/40 p-3">
                <div className="font-mono text-[10px] font-semibold uppercase tracking-wider text-admin-muted">
                  Applies / review for entities
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {selectedMapped.map(({ profile, reasons, result }) => (
                    <div
                      key={profile.id}
                      className="max-w-xs rounded-lg border border-admin-border bg-admin-surface px-2.5 py-1.5"
                      title={reasons.join(' · ')}
                    >
                      <div className="text-xs font-semibold text-admin-text">{profile.name}</div>
                      <div className="font-mono text-[10px] text-admin-muted">
                        {profile.entityType} · {profile.state} · {result}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Drawer>
    </>
  );
}
