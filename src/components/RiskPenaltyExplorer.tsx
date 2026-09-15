import { useState } from 'react';
import {
  AlertTriangle,
  Search,
  ExternalLink,
  ShieldAlert,
  Info,
} from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { RISK_PENALTY_DATA } from '../data/penalties';
import { Section } from './ui/Section';
import { SectionHeader } from './ui/SectionHeader';
import { Reveal, RevealGroup } from './ui/Reveal';
import { Card } from './ui/Card';

interface RiskPenaltyExplorerProps {
  onOpenChecker: () => void;
}

export function RiskPenaltyExplorer({ onOpenChecker }: RiskPenaltyExplorerProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const prefersReduced = useReducedMotion();

  const categories = [
    'All',
    'GST',
    'MCA / Corporate',
    'Income Tax',
    'TDS',
    'EPFO & Labour',
    'ESIC',
    'FSSAI',
    'Professional Tax',
    'Factory & Pollution',
    'Municipal & Trade Licence',
  ];

  const filteredPenalties = RISK_PENALTY_DATA.filter((item) => {
    const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      item.compliance.toLowerCase().includes(term) ||
      item.penaltyType.toLowerCase().includes(term) ||
      item.otherConsequences.some((c) => c.toLowerCase().includes(term)) ||
      item.department.toLowerCase().includes(term);
    return matchesCat && matchesSearch;
  });

  return (
    <Section tone="cream" withGrid id="risk-explorer" className="space-y-12">
      <Reveal>
        <SectionHeader
          eyebrow={
            <>
              <ShieldAlert className="w-3.5 h-3.5" />
              <span className="text-[10px] font-mono font-bold tracking-wider uppercase">
                NON-COMPLIANCE RISK RADAR
              </span>
            </>
          }
          title={
            <>
              What are you risking <br />
              <span className="text-[#B89E6B]">when a statutory deadline is missed?</span>
            </>
          }
          description="Statutory defaults in India rarely end with a small fee. Compounding per-day late fees, loss of input tax credits, and director disqualification can cripple an otherwise healthy business."
        />
      </Reveal>

      <Reveal delay={0.05}>
        <div className="space-y-4">
          <div className="max-w-xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B7580]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search penalties: GSTR-3B, AOC-4, Section 234F, FSSAI..."
              className="input-elevated w-full pl-12 pr-4 py-3.5 rounded-2xl text-sm text-[#0E1217] font-mono placeholder:text-[#6B7580]"
            />
          </div>

          <div className="-mx-4 sm:mx-0 px-4 sm:px-0 overflow-x-auto scrollbar-none">
            <div className="relative flex flex-nowrap sm:flex-wrap items-center justify-start sm:justify-center gap-2 pt-2 min-w-min pb-1">
              {categories.map((cat) => {
                const isActive = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`relative shrink-0 whitespace-nowrap px-3 sm:px-3.5 py-1.5 rounded-full text-[11px] sm:text-xs font-mono font-bold tracking-wider uppercase transition-colors ${
                      isActive
                        ? 'text-white'
                        : 'bg-[#FFFFFF] border border-[#D5D0C6] text-[#5C6570] hover:bg-[#F4F2EE]'
                    }`}
                  >
                    {isActive && !prefersReduced && (
                      <motion.span
                        layoutId="risk-filter-pill"
                        className="absolute inset-0 rounded-full bg-[#B89E6B] shadow-2xs"
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      />
                    )}
                    {isActive && prefersReduced && (
                      <span className="absolute inset-0 rounded-full bg-[#B89E6B] shadow-2xs" />
                    )}
                    <span className="relative z-10">{cat}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </Reveal>

      <RevealGroup className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPenalties.map((item) => (
          <Card
            key={item.id}
            className="flex flex-col justify-between text-left space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2 min-w-0">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#B89E6B] bg-[#EBE8E2] border border-[#D5D0C6] px-2.5 py-0.5 rounded-full shrink-0">
                  {item.category}
                </span>
                <span className="text-[11px] font-mono text-[#6B7580] font-semibold truncate min-w-0 max-w-[55%] text-right">
                  {item.department}
                </span>
              </div>

              <div>
                <h3 className="font-display text-base font-semibold text-[#0E1217] tracking-tight leading-snug">
                  {item.compliance}
                </h3>
                <div className="text-xs font-semibold text-[#6B7580] mt-0.5 font-mono">
                  Statutory Due: {item.typicalDeadline}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#EBE8E2] border border-[#D5D0C6] space-y-1 font-mono">
                <div className="text-xs font-bold text-[#0E1217] flex items-center">
                  <AlertTriangle className="w-3.5 h-3.5 text-[#B89E6B] mr-1.5 shrink-0" />
                  <span>{item.penaltyType}</span>
                </div>
                <div className="text-xs text-[#B89E6B] font-medium pl-5">{item.lateFee}</div>
                {item.interest && (
                  <div className="text-[11px] text-[#B89E6B] font-semibold pl-5">
                    ⚡ Interest: {item.interest}
                  </div>
                )}
              </div>

              <div className="space-y-1.5 pt-1">
                <div className="text-[11px] font-mono font-bold text-[#6B7580] uppercase tracking-wider">
                  Business Consequences:
                </div>
                {item.otherConsequences.slice(0, 3).map((c) => (
                  <div key={c} className="flex items-start text-xs text-[#5C6570] leading-snug">
                    <span className="text-[#B89E6B] font-bold mr-1.5 shrink-0">&times;</span>
                    <span>{c}</span>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-[#D5D0C6] text-xs">
                <p className="text-[11px] text-[#6B7580] italic">{item.legalNotes}</p>
                <div className="flex items-center justify-between text-[10px] text-[#6B7580] mt-1 font-mono">
                  <span>Verified: {item.lastVerified}</span>
                  {item.sourceUrl && (
                    <a
                      href={item.sourceUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#B89E6B] hover:text-[#8A7349] hover:underline flex items-center font-bold font-mono"
                    >
                      <span>Official Source</span>
                      <ExternalLink className="w-2.5 h-2.5 ml-0.5" />
                    </a>
                  )}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#D5D0C6] flex items-center justify-between gap-2 font-mono">
              <span className="text-[11px] font-mono font-bold text-[#B89E6B] bg-[#EBE8E2] border border-[#D5D0C6] px-2 py-0.5 rounded uppercase">
                Radar: Active Watch
              </span>
              <button
                type="button"
                onClick={onOpenChecker}
                className="btn-primary px-3.5 py-1.5 font-mono font-bold text-xs uppercase tracking-wider"
              >
                Handle This &rarr;
              </button>
            </div>
          </Card>
        ))}
      </RevealGroup>

      <Reveal delay={0.1} className="relative z-0">
        <Card
          hover={false}
          className="!h-auto w-full p-4 sm:p-5 text-xs text-[#5C6570] leading-relaxed flex items-start gap-3"
        >
          <Info className="w-4 h-4 text-[#B89E6B] shrink-0 mt-0.5" />
          <p>
            <strong className="text-[#0E1217] font-mono">Statutory Legal Disclaimer:</strong> Penalty
            amounts and interest rates shown are statutory provisions under applicable Indian laws and
            may vary based on state amendments, aggregate turnover, notification waivers, amnesty
            schemes, or judicial decisions. Never assume every penalty automatically accrues without
            factual evaluation. Consult our qualified professionals for current case-specific advice.
          </p>
        </Card>
      </Reveal>
    </Section>
  );
}
