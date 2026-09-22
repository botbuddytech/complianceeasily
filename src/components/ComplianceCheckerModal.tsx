import React, { useEffect, useMemo, useState, FormEvent } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Building,
  MapPin,
  TrendingUp,
  Users,
  Briefcase,
  Phone,
  MessageSquare,
  Sparkles,
  Calendar,
  AlertTriangle,
} from 'lucide-react';
import { INDIAN_STATES_DATA } from '../data/states';
import type { ComplianceTriggerDataset } from '../types/complianceTriggers';
import {
  formatDueDate,
  nextDueDate,
  triggersGroupedForEntity,
} from '../lib/compliance/matcher';

const ENTITY_MAP: Record<string, string> = {
  'Private Limited': 'Pvt Ltd',
  'Limited Liability Partnership (LLP)': 'LLP',
  'One Person Company (OPC)': 'OPC',
  'Sole Proprietorship': 'Proprietorship',
  'Partnership Firm': 'Partnership',
  'Public Limited Company': 'Public Ltd',
};

const TURNOVER_MAP: Record<string, number> = {
  'Under ₹20 Lakhs': 1_500_000,
  '₹20 Lakhs - ₹40 Lakhs': 3_000_000,
  '₹40L - ₹1.5 Cr': 10_000_000,
  '₹1.5 Cr - ₹5 Cr': 30_000_000,
  '₹5 Cr - ₹50 Cr': 200_000_000,
  'Above ₹50 Cr': 600_000_000,
};

const EMPLOYEE_MAP: Record<string, number> = {
  '0 (Founders Only)': 0,
  '1 - 9 Employees': 5,
  '10 - 19 Employees': 15,
  '20 - 49 Employees': 30,
  '50+ Employees': 60,
};

const INDUSTRY_MAP: Record<string, string> = {
  'Food / Restaurant / Cloud Kitchen': 'Food & Restaurants',
  'SaaS / IT Services / Tech': 'IT & Technology',
  'Manufacturing / Processing Plant': 'Manufacturing',
  'Retail / Ecommerce / D2C': 'Retail',
  'Logistics / Transportation': 'Logistics',
  'Healthcare / Pharma / Clinic': 'Healthcare',
  'Professional & Creative Services': 'Professional Services',
  'Construction / Real Estate': 'Real Estate',
};

interface ComplianceCheckerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ComplianceCheckerModal({ isOpen, onClose }: ComplianceCheckerModalProps) {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [dataset, setDataset] = useState<ComplianceTriggerDataset | null>(null);

  // Form State
  const [entityType, setEntityType] = useState('Private Limited');
  const [stateCode, setStateCode] = useState('WB');
  const [turnover, setTurnover] = useState('₹40L - ₹1.5 Cr');
  const [employees, setEmployees] = useState('10 - 19');
  const [industry, setIndustry] = useState('Food / Restaurant');
  const [hasBranches, setHasBranches] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [businessName, setBusinessName] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const prefersReduced = useReducedMotion();

  // Load the 1.2MB trigger dataset only after the modal opens (separate chunk).
  useEffect(() => {
    if (!isOpen || dataset) return;
    let cancelled = false;
    import('../data/complianceTriggers.json').then((mod) => {
      if (!cancelled) {
        setDataset((mod.default ?? mod) as ComplianceTriggerDataset);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [isOpen, dataset]);

  const entityOptions = [
    'Private Limited',
    'Limited Liability Partnership (LLP)',
    'One Person Company (OPC)',
    'Sole Proprietorship',
    'Partnership Firm',
    'Public Limited Company',
  ];

  const turnoverOptions = [
    'Under ₹20 Lakhs',
    '₹20 Lakhs - ₹40 Lakhs',
    '₹40L - ₹1.5 Cr',
    '₹1.5 Cr - ₹5 Cr',
    '₹5 Cr - ₹50 Cr',
    'Above ₹50 Cr',
  ];

  const employeeOptions = [
    '0 (Founders Only)',
    '1 - 9 Employees',
    '10 - 19 Employees',
    '20 - 49 Employees',
    '50+ Employees',
  ];

  const industryOptions = [
    'Food / Restaurant / Cloud Kitchen',
    'SaaS / IT Services / Tech',
    'Manufacturing / Processing Plant',
    'Retail / Ecommerce / D2C',
    'Logistics / Transportation',
    'Healthcare / Pharma / Clinic',
    'Professional & Creative Services',
    'Construction / Real Estate',
  ];

  const selectedStateName =
    INDIAN_STATES_DATA.find((s) => s.code === stateCode)?.name || 'West Bengal';

  const matchGroups = useMemo(() => {
    if (!dataset) {
      return {
        applicable: [] as ReturnType<typeof triggersGroupedForEntity>['applicable'],
        needs_review: [] as ReturnType<typeof triggersGroupedForEntity>['needs_review'],
        unknown: [] as ReturnType<typeof triggersGroupedForEntity>['unknown'],
        not_applicable: [] as ReturnType<typeof triggersGroupedForEntity>['not_applicable'],
      };
    }
    const profile = {
      id: 'checker-preview',
      name: businessName || 'Preview entity',
      entityType: ENTITY_MAP[entityType] || 'Pvt Ltd',
      state: selectedStateName,
      industry: INDUSTRY_MAP[industry] || industry,
      employees: EMPLOYEE_MAP[employees] ?? 0,
      annualTurnoverInr: TURNOVER_MAP[turnover] ?? 0,
      registrations: turnover !== 'Under ₹20 Lakhs' ? ['GSTIN', 'PAN'] : ['PAN'],
      activities: [industry],
    };
    return triggersGroupedForEntity(profile, dataset);
  }, [
    dataset,
    entityType,
    selectedStateName,
    industry,
    employees,
    turnover,
    businessName,
  ]);

  const applicable = matchGroups.applicable;
  const needsReview = matchGroups.needs_review;
  const unknown = matchGroups.unknown;
  const nextDated = [...applicable, ...needsReview]
    .map((m) => ({ ...m, due: nextDueDate(m.trigger) }))
    .filter((m) => m.due)
    .sort((a, b) => (a.due!.getTime() - b.due!.getTime()))[0];

  const handleNext = () => {
    if (step < 4) setStep((prev) => (prev + 1) as 1 | 2 | 3 | 4);
  };

  const handlePrev = () => {
    if (step > 1) setStep((prev) => (prev - 1) as any);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setStep(1);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-end sm:items-center justify-center p-0 sm:p-4">
          <motion.button
            type="button"
            aria-label="Close modal backdrop"
            className="absolute inset-0 bg-[#0E1217]/75 backdrop-blur-xs"
            initial={{ opacity: prefersReduced ? 1 : 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={handleReset}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            className="bg-[#F4F2EE] rounded-t-2xl sm:rounded-2xl max-w-2xl w-full max-h-[92vh] sm:max-h-[90vh] overflow-y-auto p-4 sm:p-6 lg:p-8 shadow-2xl border border-[#D5D0C6] text-left relative z-10"
            initial={{ opacity: prefersReduced ? 1 : 0, scale: prefersReduced ? 1 : 0.95, y: prefersReduced ? 0 : 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: prefersReduced ? 1 : 0.95 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
        {/* Close Button */}
        <button
          type="button"
          onClick={handleReset}
          className="absolute top-3 right-3 sm:top-5 sm:right-5 p-2 rounded-full text-[#6B7580] hover:text-[#0E1217] hover:bg-[#EBE8E2] transition-colors z-20"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Strip */}
        <div className="flex items-start sm:items-center gap-3 pb-4 border-b border-[#D5D0C6] pr-10">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#B89E6B] text-white flex items-center justify-center shadow-xs shrink-0">
            <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.2]" />
          </div>
          <div className="min-w-0">
            <h3 className="text-lg sm:text-xl font-display font-semibold text-[#0E1217] tracking-tight leading-[1.15]">
              Business Compliance Radar Setup
            </h3>
            <p className="text-[11px] sm:text-xs text-[#6B7580] mt-0.5 font-mono leading-snug">
              Instant statutory mapping &bull; Free WhatsApp alerts &bull; 2-Minute Assessment
            </p>
          </div>
        </div>

        {/* Progress Stepper (if not submitted) */}
        {!isSubmitted && (
          <div className="py-3 sm:py-4 border-b border-[#D5D0C6]">
            {/* Compact mobile progress */}
            <div className="sm:hidden flex items-center justify-between gap-3 text-xs font-mono">
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-6 h-6 rounded-full bg-[#B89E6B] text-white flex items-center justify-center font-bold text-[11px] shrink-0">
                  {step}
                </span>
                <span className="font-bold text-[#0E1217] truncate">
                  {step === 1 && 'Structure'}
                  {step === 2 && 'Scale'}
                  {step === 3 && 'Activity'}
                  {step === 4 && 'Radar'}
                </span>
              </div>
              <span className="text-[#6B7580] shrink-0">Step {step} of 4</span>
            </div>
            <div className="sm:hidden mt-2.5 h-1.5 rounded-full bg-[#E4E0D8] overflow-hidden">
              <div
                className="h-full rounded-full bg-[#B89E6B] transition-all duration-300"
                style={{ width: `${(step / 4) * 100}%` }}
              />
            </div>

            {/* Full desktop stepper */}
            <div className="hidden sm:flex items-center justify-between text-xs font-mono">
              <div className="flex items-center space-x-2">
                <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[11px] ${
                  step === 1 ? 'bg-[#B89E6B] text-white' : 'bg-[#EBE8E2] text-[#B89E6B] border border-[#D5D0C6]'
                }`}>
                  1
                </span>
                <span className={step === 1 ? 'font-bold text-[#0E1217]' : 'text-[#6B7580]'}>Structure</span>
              </div>
              <div className="w-8 h-0.5 bg-[#D5D0C6]" />
              <div className="flex items-center space-x-2">
                <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[11px] ${
                  step === 2 ? 'bg-[#B89E6B] text-white' : step > 2 ? 'bg-[#EBE8E2] text-[#B89E6B] border border-[#D5D0C6]' : 'bg-[#E4E0D8] text-[#6B7580]'
                }`}>
                  2
                </span>
                <span className={step === 2 ? 'font-bold text-[#0E1217]' : 'text-[#6B7580]'}>Scale</span>
              </div>
              <div className="w-8 h-0.5 bg-[#D5D0C6]" />
              <div className="flex items-center space-x-2">
                <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[11px] ${
                  step === 3 ? 'bg-[#B89E6B] text-white' : step > 3 ? 'bg-[#EBE8E2] text-[#B89E6B] border border-[#D5D0C6]' : 'bg-[#E4E0D8] text-[#6B7580]'
                }`}>
                  3
                </span>
                <span className={step === 3 ? 'font-bold text-[#0E1217]' : 'text-[#6B7580]'}>Activity</span>
              </div>
              <div className="w-8 h-0.5 bg-[#D5D0C6]" />
              <div className="flex items-center space-x-2">
                <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[11px] ${
                  step === 4 ? 'bg-[#B89E6B] text-white' : 'bg-[#E4E0D8] text-[#6B7580]'
                }`}>
                  4
                </span>
                <span className={step === 4 ? 'font-bold text-[#0E1217]' : 'text-[#6B7580]'}>Radar</span>
              </div>
            </div>
          </div>
        )}

        {/* Modal Form Content */}
        {!isSubmitted ? (
          <div className="py-6 space-y-6">
            {/* STEP 1: Entity Structure & State */}
            {step === 1 && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div>
                  <label className="block text-xs font-bold text-[#0E1217] uppercase tracking-wider mb-2 font-mono">
                    1. Select Your Legal Entity Structure:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {entityOptions.map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setEntityType(opt)}
                        className={`p-3 rounded-xl border text-xs font-semibold text-left transition-all font-mono ${
                          entityType === opt
                            ? 'border-[#B89E6B] bg-[#EBE8E2] text-[#0E1217] ring-1 ring-[#B89E6B]/20 font-bold'
                            : 'border-[#D5D0C6] hover:bg-[#EBE8E2] text-[#5C6570]'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0E1217] uppercase tracking-wider mb-2 font-mono">
                    2. Primary Operating State / Registered Office:
                  </label>
                  <select
                    value={stateCode}
                    onChange={(e) => setStateCode(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#D5D0C6] text-sm font-semibold text-[#0E1217] bg-[#F4F2EE] shadow-2xs focus:ring-2 focus:ring-[#B89E6B]/20 focus:border-[#B89E6B] font-mono"
                  >
                    {INDIAN_STATES_DATA.map((st) => (
                      <option key={st.code} value={st.code}>
                        {st.name} {st.isDetailed ? '(Detailed state pack)' : ''}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* STEP 2: Scale (Turnover & Headcount) */}
            {step === 2 && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div>
                  <label className="block text-xs font-bold text-[#0E1217] uppercase tracking-wider mb-2 font-mono">
                    3. Approximate Annual Turnover:
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {turnoverOptions.map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setTurnover(t)}
                        className={`p-2.5 rounded-xl border text-xs font-semibold text-center transition-all font-mono ${
                          turnover === t
                            ? 'border-[#B89E6B] bg-[#EBE8E2] text-[#0E1217] ring-1 ring-[#B89E6B]/20 font-bold'
                            : 'border-[#D5D0C6] hover:bg-[#EBE8E2] text-[#5C6570]'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0E1217] uppercase tracking-wider mb-2 font-mono">
                    4. Total Workforce (Employees &amp; Contract Workers):
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {employeeOptions.map((emp) => (
                      <button
                        key={emp}
                        type="button"
                        onClick={() => setEmployees(emp)}
                        className={`p-2.5 rounded-xl border text-xs font-semibold text-center transition-all font-mono ${
                          employees === emp
                            ? 'border-[#B89E6B] bg-[#EBE8E2] text-[#0E1217] ring-1 ring-[#B89E6B]/20 font-bold'
                            : 'border-[#D5D0C6] hover:bg-[#EBE8E2] text-[#5C6570]'
                        }`}
                      >
                        {emp}
                      </button>
                    ))}
                  </div>
                  <p className="text-[11px] text-[#6B7580] mt-1 font-mono">
                    PF mandate activates at 20+; POSH Internal Committee at 10+ employees.
                  </p>
                </div>
              </div>
            )}

            {/* STEP 3: Industry & Operating Characteristics */}
            {step === 3 && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div>
                  <label className="block text-xs font-bold text-[#0E1217] uppercase tracking-wider mb-2 font-mono">
                    5. Primary Industry Activity:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {industryOptions.map((ind) => (
                      <button
                        key={ind}
                        type="button"
                        onClick={() => setIndustry(ind)}
                        className={`p-2.5 rounded-xl border text-xs font-semibold text-left transition-all font-mono ${
                          industry === ind
                            ? 'border-[#B89E6B] bg-[#EBE8E2] text-[#0E1217] ring-1 ring-[#B89E6B]/20 font-bold'
                            : 'border-[#D5D0C6] hover:bg-[#EBE8E2] text-[#5C6570]'
                        }`}
                      >
                        {ind}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-2 space-y-2">
                  <div className="text-xs font-bold text-[#0E1217] uppercase tracking-wider font-mono">
                    Additional Operating Facts:
                  </div>
                  <label className="flex items-center space-x-2.5 p-2.5 rounded-xl bg-[#EBE8E2] border border-[#D5D0C6] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={hasBranches}
                      onChange={(e) => setHasBranches(e.target.checked)}
                      className="w-4 h-4 rounded text-[#B89E6B] focus:ring-[#B89E6B] accent-[#B89E6B]"
                    />
                    <span className="text-xs font-medium text-[#0E1217]">
                      We operate in more than one location or branch office
                    </span>
                  </label>
                  <label className="flex items-center space-x-2.5 p-2.5 rounded-xl bg-[#EBE8E2] border border-[#D5D0C6] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isExporting}
                      onChange={(e) => setIsExporting(e.target.checked)}
                      className="w-4 h-4 rounded text-[#B89E6B] focus:ring-[#B89E6B] accent-[#B89E6B]"
                    />
                    <span className="text-xs font-medium text-[#0E1217]">
                      We export goods or software/services abroad (IEC / FEMA needed)
                    </span>
                  </label>
                </div>
              </div>
            )}

            {/* STEP 4: Live Preview & WhatsApp Radar Activation Form */}
            {step === 4 && (
              <form onSubmit={handleSubmit} className="space-y-5 animate-in fade-in duration-200">
                {/* Instant Statutory Roadmap Preview */}
                <div className="p-4 rounded-xl bg-[#EBE8E2] border border-[#D5D0C6] space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Sparkles className="w-4 h-4 text-[#B89E6B]" />
                      <span className="text-xs font-bold text-[#0E1217] uppercase tracking-wider font-mono">
                        Catalogue match (research staging)
                      </span>
                    </div>
                    <span className="text-xs font-mono font-bold text-[#B89E6B] bg-[#E4E0D8] border border-[#D5D0C6] px-2 py-0.5 rounded-full">
                      {applicable.length} applicable · {needsReview.length} review · {unknown.length} unknown
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2 rounded-lg bg-[#F4F2EE] border border-[#D5D0C6]">
                      <span className="text-[#6B7580] block text-[10px] font-mono">Entity Type:</span>
                      <strong className="text-[#0E1217] font-mono">{entityType}</strong>
                    </div>
                    <div className="p-2 rounded-lg bg-[#F4F2EE] border border-[#D5D0C6]">
                      <span className="text-[#6B7580] block text-[10px] font-mono">State Laws:</span>
                      <strong className="text-[#0E1217] font-mono">{selectedStateName}</strong>
                    </div>
                  </div>

                  <ul className="max-h-40 space-y-1 overflow-y-auto text-[11px] font-mono">
                    {applicable.slice(0, 8).map(({ trigger }) => (
                      <li key={trigger.id} className="rounded border border-[#D5D0C6] bg-[#F4F2EE] px-2 py-1">
                        <span className="text-emerald-700">Applicable</span> · {trigger.shortName}
                      </li>
                    ))}
                    {needsReview.slice(0, 4).map(({ trigger }) => (
                      <li key={trigger.id} className="rounded border border-amber-200 bg-amber-50 px-2 py-1 text-amber-900">
                        Needs review · {trigger.shortName}
                      </li>
                    ))}
                    {unknown.slice(0, 4).map(({ trigger, missingFacts }) => (
                      <li key={trigger.id} className="rounded border border-sky-200 bg-sky-50 px-2 py-1 text-sky-900">
                        Unknown · {trigger.shortName}
                        {missingFacts.length ? ` (need ${missingFacts.slice(0, 2).join(', ')})` : ''}
                      </li>
                    ))}
                  </ul>
                  <p className="text-[10px] text-[#6B7580] font-mono">
                    Missing facts yield unknown — never silently not-applicable. No rule is automation-enabled.
                  </p>
                </div>

                {/* WhatsApp Radar Activation Details */}
                <div className="space-y-3">
                  <div className="text-xs font-bold text-[#0E1217] uppercase tracking-wider font-mono">
                    Where should we send your free statutory reminders?
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#0E1217] mb-1 font-mono">
                      Business or Entity Name:
                    </label>
                    <input
                      type="text"
                      required
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      placeholder="e.g. Bharat Commerce Enterprises Pvt Ltd"
                      className="w-full px-4 py-2.5 rounded-xl border border-[#D5D0C6] text-xs text-[#0E1217] bg-[#F4F2EE] focus:ring-2 focus:ring-[#B89E6B]/20 focus:border-[#B89E6B]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#0E1217] mb-1 font-mono">
                      WhatsApp Number (for free statutory due-date alerts):
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center space-x-1 text-xs font-bold text-[#6B7580]">
                        <span>🇮🇳 +91</span>
                      </div>
                      <input
                        type="tel"
                        required
                        pattern="[0-9]{10}"
                        value={whatsappNumber}
                        onChange={(e) => setWhatsappNumber(e.target.value)}
                        placeholder="9876543210"
                        className="w-full pl-16 pr-4 py-2.5 rounded-xl border border-[#D5D0C6] text-xs text-[#0E1217] bg-[#F4F2EE] font-mono focus:ring-2 focus:ring-[#B89E6B]/20 focus:border-[#B89E6B]"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full btn-primary py-3.5 px-4 font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 font-mono"
                >
                  <MessageSquare className="w-4 h-4 fill-white" />
                  <span>Activate FREE WhatsApp Compliance Radar</span>
                </button>

                <p className="text-[11px] text-[#6B7580] text-center font-mono">
                  ₹0 Free forever for basic reminders &bull; No spam &bull; Unsubscribe anytime
                </p>
              </form>
            )}

            {/* Stepper Navigation Buttons */}
            {step < 4 && (
              <div className="pt-4 border-t border-[#D5D0C6] flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-2">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="px-4 py-2.5 text-xs font-semibold text-[#5C6570] hover:text-[#0E1217] rounded-full hover:bg-[#EBE8E2] font-mono text-center"
                  >
                    &larr; Back
                  </button>
                ) : (
                  <div className="hidden sm:block" />
                )}

                <button
                  type="button"
                  onClick={handleNext}
                  className="btn-primary w-full sm:w-auto px-6 py-3 sm:py-2.5 font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-1.5 font-mono"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Success Screen */
          <div className="py-8 text-center space-y-5 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-[#EBE8E2] border border-[#D5D0C6] text-[#B89E6B] flex items-center justify-center mx-auto shadow-2xs">
              <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />
            </div>

            <div className="space-y-1.5">
              <h4 className="text-xl font-black text-[#0E1217] uppercase font-mono">
                Compliance Radar Activated for {businessName || 'Your Business'}!
              </h4>
              <p className="text-xs text-[#5C6570] max-w-md mx-auto">
                We have generated your personalized Business Compliance Passport for {selectedStateName}.
                A confirmation message and your upcoming statutory due-date calendar have been sent to{' '}
                <strong className="text-[#0E1217] font-mono">+91 {whatsappNumber || '98XXXXXXXX'}</strong> on WhatsApp.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#EBE8E2] border border-[#D5D0C6] max-w-sm mx-auto text-xs text-left space-y-1.5 font-mono">
              <div className="font-bold text-[#0E1217] uppercase">Next Upcoming Deadline:</div>
              <div className="flex items-center justify-between text-[#5C6570]">
                <span>{nextDated?.trigger.shortName || 'No dated filing yet'}</span>
                <span className="font-mono text-[#B89E6B] font-bold">
                  {nextDated ? formatDueDate(nextDated.due) : '—'}
                </span>
              </div>
              <div className="text-[11px] text-[#6B7580]">
                {applicable.length} applicable · {needsReview.length} need review · {unknown.length} unknown
                from catalogue match. Re-verify before acting.
              </div>
            </div>

            <button
              type="button"
              onClick={handleReset}
              className="btn-primary px-6 py-2.5 font-mono font-bold text-xs uppercase tracking-wider"
            >
              Done &bull; Return to Website
            </button>
          </div>
        )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
