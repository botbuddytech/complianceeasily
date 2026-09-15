import { useMemo, useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  Building2,
  Calculator,
  Check,
  FileCheck2,
  Info,
  Layers,
  MapPin,
  Package,
  Receipt,
  ShieldCheck,
  Ship,
  Users,
  UtensilsCrossed,
} from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { PRICING_PLANS } from '../data/pricing';
import {
  ENTITY_TYPES,
  PACKAGE_DEPARTMENTS,
  TURNOVER_BANDS,
  estimateAnnualFilings,
  getDepartmentsByIds,
  recommendPlanId,
} from '../data/annualPackages';
import { Section } from './ui/Section';
import { SectionHeader } from './ui/SectionHeader';
import { Reveal, RevealGroup } from './ui/Reveal';
import { Card } from './ui/Card';

interface AnnualPackageExplorerProps {
  onOpenChecker: () => void;
}

const iconMap: Record<string, typeof Building2> = {
  Building2,
  Receipt,
  Calculator,
  Users,
  FileCheck2,
  MapPin,
  UtensilsCrossed,
  Ship,
  ShieldCheck,
  BookOpen,
};

export function AnnualPackageExplorer({ onOpenChecker }: AnnualPackageExplorerProps) {
  const prefersReduced = useReducedMotion();
  const [entityId, setEntityId] = useState(ENTITY_TYPES[3].id);
  const [turnoverId, setTurnoverId] = useState(TURNOVER_BANDS[2].id);
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>(
    ENTITY_TYPES[3].defaultDepartmentIds
  );

  const activeEntity = ENTITY_TYPES.find((e) => e.id === entityId) || ENTITY_TYPES[0];
  const activeTurnover = TURNOVER_BANDS.find((t) => t.id === turnoverId) || TURNOVER_BANDS[0];

  const handleEntityChange = (id: string) => {
    setEntityId(id);
    const next = ENTITY_TYPES.find((e) => e.id === id);
    if (next) setSelectedDepartments(next.defaultDepartmentIds);
  };

  const toggleDepartment = (id: string) => {
    setSelectedDepartments((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]
    );
  };

  const selectedDepts = useMemo(
    () => getDepartmentsByIds(selectedDepartments),
    [selectedDepartments]
  );

  const annualFilings = useMemo(
    () => estimateAnnualFilings(selectedDepartments),
    [selectedDepartments]
  );

  const planId = recommendPlanId(
    activeEntity.weight,
    activeTurnover.weight,
    selectedDepartments.length
  );
  const recommendedPlan = PRICING_PLANS.find((p) => p.id === planId) || PRICING_PLANS[0];

  const renderPill = (
    id: string,
    label: string,
    shortLabel: string,
    isActive: boolean,
    onClick: () => void,
    layoutId: string
  ) => (
    <button
      key={id}
      type="button"
      onClick={onClick}
      className={`relative shrink-0 px-2.5 sm:px-3 py-1.5 text-[11px] sm:text-xs font-semibold font-mono rounded-full transition-colors whitespace-nowrap ${
        isActive
          ? 'text-white'
          : 'bg-[#FFFFFF] border border-[#D5D0C6] text-[#5C6570] hover:bg-[#F4F2EE]'
      }`}
    >
      {isActive && !prefersReduced && (
        <motion.span
          layoutId={layoutId}
          className="absolute inset-0 rounded-full bg-[#B89E6B] shadow-2xs"
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        />
      )}
      {isActive && prefersReduced && (
        <span className="absolute inset-0 rounded-full bg-[#B89E6B] shadow-2xs" />
      )}
      <span className="relative z-10">
        <span className="sm:hidden">{shortLabel}</span>
        <span className="hidden sm:inline">{label}</span>
      </span>
    </button>
  );

  return (
    <Section tone="espresso" withGrid withGlow id="annual-package" className="space-y-8 sm:space-y-12">
      <Reveal>
        <SectionHeader
          eyebrow={
            <>
              <Package className="w-3.5 h-3.5 shrink-0" />
              <span className="text-[10px] font-mono font-bold tracking-widest uppercase">
                ANNUAL COMPLIANCE PACKAGE
              </span>
            </>
          }
          title={
            <>
              Build your annual compliance package.{' '}
              <span className="text-[#B89E6B]">By entity, turnover &amp; departments.</span>
            </>
          }
          description="Select your legal structure, turnover band, and the regulators that apply. Get an illustrative package preview with filing counts and a recommended plan tier — then verify the exact roadmap for free."
        />
      </Reveal>

      <Reveal delay={0.05}>
        <Card hover={false} className="p-4 sm:p-6 lg:p-10 space-y-6 sm:space-y-8 min-w-0 overflow-hidden">
          <div className="space-y-3 min-w-0">
            <label className="text-[10px] font-mono font-bold text-[#6B7580] uppercase tracking-wider block">
              1. Legal Entity Type
            </label>
            <div className="-mx-1 px-1 overflow-x-auto scrollbar-none">
              <div className="flex flex-nowrap sm:flex-wrap gap-2 min-w-min pb-1">
                {ENTITY_TYPES.map((entity) =>
                  renderPill(
                    entity.id,
                    entity.label,
                    entity.shortLabel,
                    entityId === entity.id,
                    () => handleEntityChange(entity.id),
                    'annual-entity-pill'
                  )
                )}
              </div>
            </div>
            <p className="text-xs text-[#5C6570] font-mono leading-relaxed">{activeEntity.description}</p>
          </div>

          <div className="space-y-3 pt-2 border-t border-[#D5D0C6] min-w-0">
            <label className="text-[10px] font-mono font-bold text-[#6B7580] uppercase tracking-wider block">
              2. Approximate Annual Turnover
            </label>
            <div className="-mx-1 px-1 overflow-x-auto scrollbar-none">
              <div className="flex flex-nowrap sm:flex-wrap gap-2 min-w-min pb-1">
                {TURNOVER_BANDS.map((band) =>
                  renderPill(
                    band.id,
                    band.label,
                    band.shortLabel,
                    turnoverId === band.id,
                    () => setTurnoverId(band.id),
                    'annual-turnover-pill'
                  )
                )}
              </div>
            </div>
            <p className="text-[11px] text-[#6B7580] font-mono sm:hidden">
              Selected: {activeTurnover.label}
            </p>
          </div>

          <div className="space-y-3 pt-2 border-t border-[#D5D0C6] min-w-0">
            <label className="text-[10px] font-mono font-bold text-[#6B7580] uppercase tracking-wider block">
              3. Applicable Departments ({selectedDepartments.length} selected)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {PACKAGE_DEPARTMENTS.map((dept) => {
                const Icon = iconMap[dept.iconName] || Layers;
                const checked = selectedDepartments.includes(dept.id);
                return (
                  <button
                    key={dept.id}
                    type="button"
                    onClick={() => toggleDepartment(dept.id)}
                    className={`flex items-center gap-2 sm:gap-2.5 p-2.5 sm:p-3 rounded-xl border text-left transition-all font-mono min-w-0 ${
                      checked
                        ? 'border-[#B89E6B] bg-[#EBE8E2] ring-1 ring-[#B89E6B]/20'
                        : 'border-[#D5D0C6] bg-[#FFFFFF] hover:bg-[#F4F2EE]'
                    }`}
                  >
                    <span
                      className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 border ${
                        checked
                          ? 'bg-[#B89E6B] border-[#B89E6B] text-white'
                          : 'bg-[#F4F2EE] border-[#D5D0C6] text-transparent'
                      }`}
                    >
                      <Check className="w-3 h-3" strokeWidth={3} />
                    </span>
                    <Icon className="w-4 h-4 text-[#B89E6B] shrink-0" />
                    <span className="text-xs font-semibold text-[#0E1217] truncate min-w-0">
                      {dept.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-[#D5D0C6] space-y-5 sm:space-y-6 min-w-0">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
              <div className="space-y-1.5 min-w-0">
                <div className="text-[10px] font-mono font-bold text-[#6B7580] uppercase tracking-wider">
                  Illustrative package preview
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full bg-[#B89E6B] text-white text-[11px] sm:text-xs font-mono font-bold max-w-full">
                    <span className="truncate">Recommended: {recommendedPlan.name}</span>
                  </span>
                  <span className="text-xs font-mono font-semibold text-[#0E1217]">
                    {recommendedPlan.priceDisplay}
                    <span className="text-[#6B7580] font-medium"> {recommendedPlan.period}</span>
                  </span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 text-xs font-mono">
                <span className="px-2.5 sm:px-3 py-1.5 rounded-lg bg-[#EBE8E2] border border-[#D5D0C6] font-bold text-[#0E1217]">
                  ~{annualFilings} filings / year
                </span>
                <span className="px-2.5 sm:px-3 py-1.5 rounded-lg bg-[#EBE8E2] border border-[#D5D0C6] font-bold text-[#0E1217]">
                  {selectedDepartments.length} departments
                </span>
              </div>
            </div>

            {selectedDepts.length > 0 ? (
              <RevealGroup className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {selectedDepts.map((dept) => {
                  const Icon = iconMap[dept.iconName] || Layers;
                  return (
                    <Card key={dept.id} className="p-3.5 sm:p-4 space-y-3 text-left min-w-0">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-[#EBE8E2] border border-[#D5D0C6] flex items-center justify-center text-[#B89E6B] shrink-0">
                          <Icon className="w-4 h-4" />
                        </div>
                        <h4 className="font-display text-sm font-semibold text-[#0E1217] truncate min-w-0">
                          {dept.name}
                        </h4>
                      </div>
                      <ul className="space-y-1.5">
                        {dept.filings.map((filing) => (
                          <li
                            key={filing.label}
                            className="flex items-start justify-between gap-2 text-[11px] font-mono"
                          >
                            <span className="text-[#5C6570] leading-snug min-w-0 break-words">
                              {filing.label}
                            </span>
                            <span className="text-[#B89E6B] font-bold shrink-0">
                              {filing.frequency}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </Card>
                  );
                })}
              </RevealGroup>
            ) : (
              <div className="rounded-xl border border-dashed border-[#D5D0C6] p-6 sm:p-8 text-center text-xs text-[#6B7580] font-mono">
                Select at least one department to preview included filings.
              </div>
            )}

            <div className="p-3 sm:p-3.5 rounded-xl bg-[#EBE8E2] border border-[#D5D0C6] text-xs text-[#5C6570] flex items-start gap-2 font-mono">
              <Info className="w-4 h-4 text-[#B89E6B] shrink-0 mt-0.5" />
              <span className="min-w-0 leading-relaxed">
                <strong className="text-[#0E1217]">Indicative only.</strong> Filing counts and plan
                tiers are illustrative. Get an exact, verified statutory roadmap with the free
                compliance check — applicability depends on state, workforce, and activity facts.
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3">
              <button
                type="button"
                onClick={onOpenChecker}
                className="btn-primary w-full sm:w-auto font-mono font-bold text-xs uppercase tracking-wider"
              >
                <span>Get My Exact Package — Free</span>
                <ArrowRight className="w-3.5 h-3.5 shrink-0" />
              </button>
              <a
                href="#pricing"
                className="inline-flex w-full sm:w-auto items-center justify-center px-5 py-3 rounded-full bg-[#FFFFFF] hover:bg-[#F4F2EE] text-[#0E1217] font-mono font-bold text-xs uppercase tracking-wider border border-[#D5D0C6] transition-colors"
              >
                See Plan Pricing
              </a>
            </div>
          </div>
        </Card>
      </Reveal>
    </Section>
  );
}
