'use client';

import { useMemo, useState } from 'react';
import type {
  ComplianceCatalogueDataset,
  StateCoverageRow,
} from '../../../types/complianceTriggers';
import { VerificationBadge } from '../../dashboard/VerificationBadge';
import { Drawer } from '../../ui/Drawer';

const TOPIC_LABELS: Record<string, string> = {
  professional_tax: 'Professional tax',
  shops_establishments: 'Shops & establishments',
  labour_welfare_fund: 'Labour welfare fund',
  factory_licensing: 'Factory licensing',
  pollution_cte: 'Pollution CTE',
  pollution_cto: 'Pollution CTO',
  fire_safety: 'Fire safety',
  municipal_trade: 'Municipal trade',
  rera: 'RERA',
  psara: 'PSARA',
  legal_metrology: 'Legal metrology',
  boilers: 'Boilers',
  groundwater: 'Groundwater',
  hazardous_waste: 'Hazardous waste',
  excise: 'Excise',
  state_food_safety: 'State food safety',
  state_drug_licensing: 'State drug licensing',
  hospitality_special_permissions: 'Hospitality permissions',
  property_ror: 'Property RoR',
  property_mutation: 'Property mutation',
  land_revenue: 'Land revenue',
  deed_registration: 'Deed registration',
  encumbrance_title: 'Encumbrance / title',
  land_use_eligibility: 'Land-use eligibility',
  boundary_survey: 'Boundary survey',
  property_tax: 'Property tax',
  building_occupancy: 'Building occupancy',
};

function statusColor(status: string): string {
  switch (status) {
    case 'authority_directory_confirmed':
    case 'levy_or_service_evidenced':
    case 'partial_rule_research':
      return 'bg-emerald-100 hover:bg-emerald-200';
    case 'researched_partial':
      return 'bg-amber-100 hover:bg-amber-200';
    case 'conflict_flagged':
      return 'bg-orange-100 hover:bg-orange-200';
    case 'research_required':
      return 'bg-slate-100 hover:bg-slate-200';
    case 'discovery_only':
    case 'secondary_discovery_only':
    case 'directory_routing_only':
    default:
      return 'bg-slate-50 hover:bg-slate-100';
  }
}

export function StateCoverageMatrix({
  catalogue,
}: {
  catalogue: ComplianceCatalogueDataset;
}) {
  const jurisdictions = useMemo(
    () =>
      catalogue.jurisdictions
        .filter((j) => j.level === 'state' || j.level === 'union_territory')
        .sort((a, b) => a.name.localeCompare(b.name)),
    [catalogue.jurisdictions],
  );

  const topics = useMemo(() => {
    const set = new Set(catalogue.stateCoverage.map((c) => c.topic));
    return [...set].sort();
  }, [catalogue.stateCoverage]);

  const byKey = useMemo(() => {
    const map = new Map<string, StateCoverageRow>();
    for (const row of catalogue.stateCoverage) {
      map.set(`${row.jurisdictionId}::${row.topic}`, row);
    }
    return map;
  }, [catalogue.stateCoverage]);

  const propertyByJurisdiction = useMemo(() => {
    const map = new Map(
      catalogue.statePropertyProfiles.map((p) => [p.jurisdictionId, p]),
    );
    return map;
  }, [catalogue.statePropertyProfiles]);

  const [selected, setSelected] = useState<StateCoverageRow | null>(null);
  const [topicFilter, setTopicFilter] = useState('all');

  const visibleTopics = topicFilter === 'all' ? topics : topics.filter((t) => t === topicFilter);

  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    for (const row of catalogue.stateCoverage) {
      c[row.coverageStatus] = (c[row.coverageStatus] || 0) + 1;
    }
    return c;
  }, [catalogue.stateCoverage]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 text-[11px] font-mono">
        {Object.entries(counts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 8)
          .map(([status, n]) => (
            <span
              key={status}
              className="rounded-full border border-admin-border bg-admin-surface px-2 py-0.5 text-admin-muted"
            >
              {status.replace(/_/g, ' ')}: {n}
            </span>
          ))}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <label className="text-xs text-admin-muted">
          Topic{' '}
          <select
            value={topicFilter}
            onChange={(e) => setTopicFilter(e.target.value)}
            className="ml-1 rounded-xl border border-admin-border bg-admin-surface px-3 py-1.5 text-sm"
          >
            <option value="all">All ({topics.length})</option>
            {topics.map((t) => (
              <option key={t} value={t}>
                {TOPIC_LABELS[t] || t}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="overflow-auto rounded-2xl border border-admin-border bg-admin-surface">
        <table className="min-w-max border-collapse text-left text-[10px]">
          <thead>
            <tr className="sticky top-0 z-10 bg-admin-bg">
              <th className="sticky left-0 z-20 bg-admin-bg px-2 py-2 font-mono uppercase tracking-wider text-admin-muted">
                Jurisdiction
              </th>
              {visibleTopics.map((t) => (
                <th
                  key={t}
                  className="max-w-[72px] truncate px-1 py-2 font-mono uppercase tracking-wider text-admin-muted"
                  title={TOPIC_LABELS[t] || t}
                >
                  {(TOPIC_LABELS[t] || t).slice(0, 10)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {jurisdictions.map((j) => (
              <tr key={j.jurisdictionId} className="border-t border-admin-border/60">
                <td className="sticky left-0 z-10 whitespace-nowrap bg-admin-surface px-2 py-1 font-semibold text-admin-text">
                  {j.name}
                </td>
                {visibleTopics.map((t) => {
                  const row = byKey.get(`${j.jurisdictionId}::${t}`);
                  if (!row) {
                    return (
                      <td key={t} className="px-1 py-1">
                        <span className="inline-block h-5 w-5 rounded bg-slate-50" />
                      </td>
                    );
                  }
                  return (
                    <td key={t} className="px-1 py-1">
                      <button
                        type="button"
                        title={`${TOPIC_LABELS[t] || t}: ${row.coverageStatus}`}
                        onClick={() => setSelected(row)}
                        className={`inline-block h-5 w-5 rounded border border-admin-border/50 ${statusColor(
                          row.coverageStatus,
                        )}`}
                      />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Drawer
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        title={selected ? TOPIC_LABELS[selected.topic] || selected.topic : ''}
        subtitle={
          selected
            ? `${selected.jurisdictionId} · ${selected.coverageId}`
            : ''
        }
      >
        {selected && (
          <div className="space-y-3 text-sm">
            <VerificationBadge status={selected.coverageStatus} />
            <ul className="space-y-1 text-xs text-admin-text">
              <li>
                <span className="text-admin-muted">Applicability:</span>{' '}
                {selected.applicabilityStatus || '—'}
              </li>
              <li>
                <span className="text-admin-muted">Next verification:</span>{' '}
                {selected.nextVerification || '—'}
              </li>
              <li>
                <span className="text-admin-muted">Linked rules:</span>{' '}
                {selected.linkedRuleIds?.length
                  ? selected.linkedRuleIds.join(', ')
                  : 'None linked'}
              </li>
            </ul>
            {selected.authorityUrl && (
              <a
                href={selected.authorityUrl}
                target="_blank"
                rel="noreferrer"
                className="block break-all text-xs underline"
              >
                Authority: {selected.authorityUrl}
              </a>
            )}
            {selected.applicationUrl && (
              <a
                href={selected.applicationUrl}
                target="_blank"
                rel="noreferrer"
                className="block break-all text-xs underline"
              >
                Application: {selected.applicationUrl}
              </a>
            )}
            {propertyByJurisdiction.get(selected.jurisdictionId) && (
              <div className="rounded-xl border border-admin-border bg-admin-bg/40 p-3 text-xs">
                <div className="font-mono text-[10px] font-semibold uppercase tracking-wider text-admin-muted">
                  Property profile
                </div>
                <p className="mt-1">
                  {propertyByJurisdiction.get(selected.jurisdictionId)?.recordTerms ||
                    'Local terms unresolved'}
                </p>
                <p className="mt-1 text-admin-muted">
                  {propertyByJurisdiction.get(selected.jurisdictionId)?.titleNote}
                </p>
              </div>
            )}
          </div>
        )}
      </Drawer>
    </div>
  );
}
