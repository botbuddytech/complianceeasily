import { useState } from 'react';
import {
  MapPin,
  Layers,
  ArrowRight,
  Info,
} from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { INDIAN_STATES_DATA } from '../data/states';
import { StateComplianceData } from '../types';
import { Section } from './ui/Section';
import { SectionHeader } from './ui/SectionHeader';
import { Reveal, RevealGroup } from './ui/Reveal';
import { Card } from './ui/Card';

interface StateComplianceExplorerProps {
  onOpenChecker: () => void;
}

export function StateComplianceExplorer({ onOpenChecker }: StateComplianceExplorerProps) {
  const [selectedStateCode, setSelectedStateCode] = useState<string>('WB');
  const prefersReduced = useReducedMotion();

  const activeState: StateComplianceData =
    INDIAN_STATES_DATA.find((s) => s.code === selectedStateCode) || INDIAN_STATES_DATA[0];

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
    <Section tone="espresso" withGrid withGlow className="space-y-12">
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
          description="Your statutory obligations can change with your State, city, office, factory, shop, and workforce. ComplianceEasily monitors state and municipal laws alongside Central statutes."
        />
      </Reveal>

      <Reveal delay={0.05}>
        <Card hover={false} className="p-4 sm:p-6 lg:p-10 space-y-6 sm:space-y-8 min-w-0">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 sm:pb-6 border-b border-[#D5D0C6] min-w-0">
            <div className="min-w-0 w-full md:w-auto">
              <label htmlFor="state-select" className="text-[10px] font-mono font-bold text-[#6B7580] uppercase tracking-wider block mb-1">
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
                      {st.name} {st.isDetailed ? '(Full State Pack Active)' : ''}
                    </option>
                  ))}
                </select>
                <span className="text-xs text-[#6B7580] font-mono hidden sm:inline">
                  Capital: {activeState.capital}
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
              <strong className="text-[#0E1217]">Statutory Applicability Note:</strong> Applicability depends on your specific
              business activity, registered location, employee count, and factual circumstances.
            </span>
          </div>

          {activeState.isDetailed ? (
            <div className="space-y-6">
              <div className="p-4 rounded-xl border border-[#D5D0C6] bg-[#F4F2EE] flex flex-wrap items-center gap-2 text-xs font-mono">
                <span className="font-bold text-[#6B7580] uppercase tracking-wider">
                  Local Regulators Monitored:
                </span>
                {activeState.localRegulators.map((reg) => (
                  <span
                    key={reg}
                    className="px-2.5 py-1 rounded bg-[#EBE8E2] border border-[#D5D0C6] font-medium text-[#0E1217]"
                  >
                    {reg}
                  </span>
                ))}
              </div>

              <RevealGroup className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {activeState.compliances.map((item) => (
                  <Card key={item.name} className="p-5 flex flex-col justify-between space-y-3">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                            item.mandatoryLevel === 'Mandatory'
                              ? 'bg-[#EBE8E2] text-[#B89E6B] border border-[#B89E6B]'
                              : 'bg-[#EBE8E2] text-[#B89E6B] border border-[#D5D0C6]'
                          }`}
                        >
                          {item.mandatoryLevel}
                        </span>
                        <span className="text-[10px] text-[#6B7580] font-mono">{activeState.name}</span>
                      </div>

                      <h4 className="font-display text-sm font-semibold text-[#0E1217] leading-snug">
                        {item.name}
                      </h4>
                      <div className="text-xs text-[#B89E6B] font-medium font-mono">
                        Dept: {item.department}
                      </div>

                      <p className="text-xs text-[#5C6570] leading-relaxed pt-1">
                        {item.applicabilityNotes}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-[#D5D0C6] flex items-center justify-between text-[11px] font-mono font-medium text-[#6B7580]">
                      <span>Schedule: {item.frequency}</span>
                    </div>
                  </Card>
                ))}
              </RevealGroup>
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-[#D5D0C6] p-12 text-center space-y-4 bg-[#F4F2EE]">
              <div className="w-12 h-12 rounded-full bg-[#EBE8E2] border border-[#D5D0C6] text-[#B89E6B] flex items-center justify-center mx-auto">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="font-display text-base font-semibold text-[#0E1217] uppercase font-mono">
                State compliance pack being expanded for {activeState.name}
              </h3>
              <p className="text-xs text-[#5C6570] max-w-md mx-auto">
                We are actively integrating the local municipal corporations, shops &amp; establishment
                portals, and commercial tax gazettes for {activeState.name}. We do not fabricate
                statutory obligations merely to populate state cards.
              </p>
              <button
                type="button"
                onClick={onOpenChecker}
                className="btn-primary px-6 py-2.5 font-bold text-xs uppercase tracking-wider font-mono"
              >
                Request Priority Onboarding for {activeState.name}
              </button>
            </div>
          )}

          <div className="pt-4 border-t border-[#D5D0C6] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-[#5C6570] font-mono">
              Need multi-state establishment compliance for branches or retail outlets?
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
