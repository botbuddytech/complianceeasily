'use client';

import { useMemo, useState } from 'react';
import { MapPin, Layers, ArrowRight, Info } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { INDIAN_STATES_DATA } from '../data/states';
import catalogueRaw from '../data/stateCoverageSlim.json';
import type { VerificationStatus } from '../types/complianceTriggers';
import { Section } from './ui/Section';
import { SectionHeader } from './ui/SectionHeader';
import { Reveal, RevealGroup } from './ui/Reveal';
import { Card } from './ui/Card';
import { VerificationBadge } from './dashboard/VerificationBadge';

/** Homepage-only slim catalogue (jurisdictions + state coverage), not the full 600KB+ file. */
type SlimCatalogue = {
  jurisdictions: Array<{ jurisdictionId: string; name: string }>;
  stateCoverage: Array<{
    coverageId: string;
    jurisdictionId: string;
    topic: string;
    applicabilityStatus?: string;
    authorityUrl?: string;
    coverageStatus: VerificationStatus;
    linkedRuleIds?: string[];
  }>;
  statePropertyProfiles: Array<{
    jurisdictionId: string;
    recordTerms?: string;
    titleNote?: string;
  }>;
};

const catalogue = catalogueRaw as SlimCatalogue;

const TOPIC_LABELS: Record<string, string> = {
  professional_tax: 'Professional tax',
  shops_establishments: 'Shops & establishments',
  labour_welfare_fund: 'Labour welfare fund',
  factory_licensing: 'Factory licensing',
  pollution_cte: 'Pollution CTE',
  pollution_cto: 'Pollution CTO',
  fire_safety: 'Fire safety',
  municipal_trade: 'Municipal trade licence',
  rera: 'RERA',
  psara: 'PSARA',
  legal_metrology: 'Legal metrology',
  boilers: 'Boilers',
  groundwater: 'Groundwater',
  hazardous_waste: 'Hazardous waste',
  excise: 'State excise',
  state_food_safety: 'State food safety',
  state_drug_licensing: 'State drug licensing',
  hospitality_special_permissions: 'Hospitality permissions',
  property_ror: 'Property RoR / land records',
  property_mutation: 'Property mutation',
  land_revenue: 'Land revenue',
  deed_registration: 'Deed registration',
  encumbrance_title: 'Encumbrance / title',
  land_use_eligibility: 'Land-use eligibility',
  boundary_survey: 'Boundary survey',
  property_tax: 'Property tax',
  building_occupancy: 'Building occupancy',
};

/** Map legacy 2-letter state codes / names onto catalogue jurisdiction ids. */
function resolveJurisdictionId(code: string, name: string): string | null {
  const byName = catalogue.jurisdictions.find(
    (j) => j.name.toLowerCase() === name.toLowerCase(),
  );
  if (byName) return byName.jurisdictionId;
  const suffix = code.toUpperCase();
  const byCode = catalogue.jurisdictions.find((j) =>
    j.jurisdictionId.endsWith(`-${suffix}`),
  );
  return byCode?.jurisdictionId ?? null;
}

interface StateComplianceExplorerProps {
  onOpenChecker: () => void;
}

export function StateComplianceExplorer({ onOpenChecker }: StateComplianceExplorerProps) {
  const [selectedStateCode, setSelectedStateCode] = useState<string>('WB');
  const prefersReduced = useReducedMotion();

  const activeState =
    INDIAN_STATES_DATA.find((s) => s.code === selectedStateCode) || INDIAN_STATES_DATA[0];

  const jurisdictionId = useMemo(
    () => resolveJurisdictionId(activeState.code, activeState.name),
    [activeState.code, activeState.name],
  );

  const coverageRows = useMemo(() => {
    if (!jurisdictionId) return [];
    return catalogue.stateCoverage
      .filter((c) => c.jurisdictionId === jurisdictionId)
      .sort((a, b) => a.topic.localeCompare(b.topic));
  }, [jurisdictionId]);

  const propertyProfile = useMemo(() => {
    if (!jurisdictionId) return null;
    return (
      catalogue.statePropertyProfiles.find((p) => p.jurisdictionId === jurisdictionId) ||
      null
    );
  }, [jurisdictionId]);

  const renderStatePill = (code: string, name: string) => {
    const isActive = selectedStateCode === code;
    return (
      <button
        key={code}
        type="button"
        onClick={() => setSelectedStateCode(code)}
        className={`relative px-3 py-1.5 text-xs font-semibold font-mono rounded-full transition-colors ${
          isActive
            ? 'text-white'
            : 'bg-[#FFFFFF] border border-[#D5D0C6] text-[#5C6570] hover:bg-[#F4F2EE]'
        }`}
      >
        {isActive && !prefersReduced && (
          <motion.span
            layoutId="state-filter-pill"
            className="absolute inset-0 rounded-full bg-[#B89E6B] shadow-2xs"
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          />
        )}
        {isActive && prefersReduced && (
          <span className="absolute inset-0 rounded-full bg-[#B89E6B] shadow-2xs" />
        )}
        <span className="relative z-10">{name}</span>
      </button>
    );
  };

  return (
    <Section tone="cream" withGrid className="space-y-12">
      <Reveal>
        <SectionHeader
          eyebrow={
            <>
              <MapPin className="w-3 h-3" />
              <span className="text-[10px] font-mono font-bold tracking-widest uppercase">
                STATE &amp; LOCAL GOVERNANCE
              </span>
            </>
          }
          title={
            <>
              India isn&rsquo;t one compliance jurisdiction. <br />
              <span className="text-[#B89E6B]">State &amp; local rules matter.</span>
            </>
          }
          description="Coverage inventory across 36 states/UTs and 27 topics. Discovery-only cells are research gaps — not verified obligations."
        />
      </Reveal>

      <Reveal delay={0.05}>
        <Card hover={false} className="p-4 sm:p-6 lg:p-10 space-y-6 sm:space-y-8 min-w-0">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 sm:pb-6 border-b border-[#D5D0C6] min-w-0">
            <div className="min-w-0 w-full md:w-auto">
              <label
                htmlFor="state-select"
                className="text-[10px] font-mono font-bold text-[#6B7580] uppercase tracking-wider block mb-1"
              >
                Select Your Operating State / Union Territory:
              </label>
              <div className="flex items-center space-x-3 min-w-0 flex-1">
                <select
                  id="state-select"
                  value={selectedStateCode}
                  onChange={(e) => setSelectedStateCode(e.target.value)}
                  className="input-elevated max-w-full w-full sm:w-auto px-3 sm:px-4 py-2.5 rounded-xl font-bold text-sm text-[#0E1217] font-mono min-w-0"
                >
                  {INDIAN_STATES_DATA.map((st) => (
                    <option key={st.code} value={st.code}>
                      {st.name}
                    </option>
                  ))}
                </select>
                <span className="text-xs text-[#6B7580] font-mono hidden sm:inline">
                  {jurisdictionId || '—'} · Capital: {activeState.capital}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {INDIAN_STATES_DATA.slice(0, 5).map((st) => renderStatePill(st.code, st.name))}
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#EBE8E2] border border-[#D5D0C6] text-xs text-[#5C6570] flex items-start space-x-2 font-mono">
            <Info className="w-4 h-4 text-[#B89E6B] shrink-0 mt-0.5" />
            <span>
              <strong className="text-[#0E1217]">Research staging:</strong> A coverage row does
              not mean the obligation applies. Status shows research depth — discovery-only and
              research-required cells need verification before any filing.
            </span>
          </div>

          {propertyProfile?.recordTerms && (
            <div className="rounded-xl border border-[#D5D0C6] bg-[#F4F2EE] p-4 text-xs">
              <div className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#6B7580]">
                Local land-record terminology
              </div>
              <p className="mt-1 text-[#0E1217]">{propertyProfile.recordTerms}</p>
              {propertyProfile.titleNote && (
                <p className="mt-1 text-[#5C6570]">{propertyProfile.titleNote}</p>
              )}
            </div>
          )}

          {coverageRows.length > 0 ? (
            <RevealGroup className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {coverageRows.map((item) => (
                <Card key={item.coverageId} className="p-5 flex flex-col justify-between space-y-3">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <VerificationBadge status={item.coverageStatus} />
                      <span className="text-[10px] text-[#6B7580] font-mono">{activeState.name}</span>
                    </div>
                    <h4 className="font-display text-sm font-semibold text-[#0E1217] leading-snug">
                      {TOPIC_LABELS[item.topic] || item.topic.replace(/_/g, ' ')}
                    </h4>
                    <p className="text-xs text-[#5C6570] leading-relaxed pt-1">
                      {item.applicabilityStatus?.replace(/_/g, ' ') ||
                        'Requires activity and local-law review'}
                    </p>
                    {item.linkedRuleIds && item.linkedRuleIds.length > 0 && (
                      <div className="text-[10px] font-mono text-[#B89E6B]">
                        Linked rules: {item.linkedRuleIds.join(', ')}
                      </div>
                    )}
                  </div>
                  <div className="pt-3 border-t border-[#D5D0C6] flex items-center justify-between text-[11px] font-mono font-medium text-[#6B7580]">
                    {item.authorityUrl ? (
                      <a
                        href={item.authorityUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="underline underline-offset-2 truncate max-w-[70%]"
                      >
                        Authority route
                      </a>
                    ) : (
                      <span>No authority URL yet</span>
                    )}
                  </div>
                </Card>
              ))}
            </RevealGroup>
          ) : (
            <div className="rounded-xl border border-dashed border-[#D5D0C6] p-12 text-center space-y-4 bg-[#F4F2EE]">
              <div className="w-12 h-12 rounded-full bg-[#EBE8E2] border border-[#D5D0C6] text-[#B89E6B] flex items-center justify-center mx-auto">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="font-display text-base font-semibold text-[#0E1217] uppercase font-mono">
                Coverage not linked for {activeState.name}
              </h3>
              <button
                type="button"
                onClick={onOpenChecker}
                className="btn-primary px-6 py-2.5 font-bold text-xs uppercase tracking-wider font-mono"
              >
                Map my obligations
              </button>
            </div>
          )}

          <div className="pt-4 border-t border-[#D5D0C6] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-[#5C6570] font-mono">
              {coverageRows.length} topic rows for this jurisdiction · research staging inventory
            </div>
            <button
              type="button"
              onClick={onOpenChecker}
              className="btn-primary px-6 py-2.5 font-bold text-xs uppercase tracking-wider flex items-center space-x-1.5 font-mono"
            >
              <span>Map My Multi-State Compliances</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </Card>
      </Reveal>
    </Section>
  );
}
