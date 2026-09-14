import { Fragment, useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { StatusBadge } from '../../dashboard/StatusBadge';
import type { ComplianceTrigger, GovDepartment } from '../../../types/complianceTriggers';
import type { EntityComplianceProfile } from '../../../types/complianceTriggers';
import { entitiesForTrigger, formatDueDate, nextDueDate } from '../../../lib/triggerMatcher';
import { TriggerDetail } from './TriggerDetail';

interface TriggerTableProps {
  triggers: ComplianceTrigger[];
  departments: GovDepartment[];
  profiles: EntityComplianceProfile[];
}

export function TriggerTable({ triggers, departments, profiles }: TriggerTableProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (triggers.length === 0) {
    return (
      <div className="rounded-2xl border border-admin-border bg-admin-surface px-4 py-10 text-center text-sm text-admin-muted">
        No triggers match the current filters.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-admin-border bg-admin-surface">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-admin-border bg-admin-bg font-mono text-[11px] font-semibold uppercase tracking-wider text-admin-muted">
              <th className="w-8 px-3 py-3" />
              <th className="px-3 py-3">Trigger</th>
              <th className="px-3 py-3">Type</th>
              <th className="px-3 py-3">Frequency</th>
              <th className="px-3 py-3">Priority</th>
              <th className="px-3 py-3">Next due</th>
              <th className="px-3 py-3">Entities</th>
              <th className="px-3 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {triggers.map((tr) => {
              const open = expandedId === tr.id;
              const mapped = entitiesForTrigger(tr, profiles);
              const dept = departments.find((d) => d.id === tr.departmentId);
              return (
                <Fragment key={tr.id}>
                  <tr
                    className="cursor-pointer border-b border-admin-border hover:bg-admin-bg/60"
                    onClick={() => setExpandedId(open ? null : tr.id)}
                  >
                    <td className="px-3 py-3 text-admin-muted">
                      {open ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </td>
                    <td className="px-3 py-3">
                      <div className="font-semibold text-admin-text">{tr.shortName}</div>
                      <div className="max-w-xs truncate text-xs text-admin-muted">{tr.name}</div>
                    </td>
                    <td className="px-3 py-3 font-mono text-xs">{tr.triggerType}</td>
                    <td className="px-3 py-3 font-mono text-xs">{tr.schedule.frequency}</td>
                    <td className="px-3 py-3">
                      <StatusBadge status={tr.priority} />
                    </td>
                    <td className="px-3 py-3 font-mono text-xs">
                      {formatDueDate(nextDueDate(tr))}
                    </td>
                    <td className="px-3 py-3 font-mono text-sm font-semibold">{mapped.length}</td>
                    <td className="px-3 py-3">
                      <StatusBadge status={tr.status} />
                    </td>
                  </tr>
                  {open && (
                    <tr className="border-b border-admin-border bg-admin-bg/40">
                      <td colSpan={8} className="px-3 py-4">
                        <TriggerDetail
                          trigger={tr}
                          department={dept}
                          mappedEntityCount={mapped.length}
                        />
                        {mapped.length > 0 && (
                          <div className="mt-3 rounded-xl border border-admin-border bg-admin-surface p-3">
                            <div className="font-mono text-[10px] font-semibold uppercase tracking-wider text-admin-muted">
                              Applies to entities
                            </div>
                            <div className="mt-2 flex flex-wrap gap-2">
                              {mapped.map(({ profile, reasons }) => (
                                <div
                                  key={profile.id}
                                  className="max-w-xs rounded-lg border border-admin-border bg-admin-bg px-2.5 py-1.5"
                                  title={reasons.join(' · ')}
                                >
                                  <div className="text-xs font-semibold text-admin-text">
                                    {profile.name}
                                  </div>
                                  <div className="font-mono text-[10px] text-admin-muted">
                                    {profile.entityType} · {profile.state}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
