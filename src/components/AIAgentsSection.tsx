import {
  Cpu,
  FileSearch,
  Scale,
  CalendarCheck,
  ShieldCheck,
  ArrowRight,
  GitCompare,
  FileCheck,
} from 'lucide-react';
import { Section } from './ui/Section';
import { SectionHeader } from './ui/SectionHeader';
import { Reveal, RevealGroup } from './ui/Reveal';
import { Card } from './ui/Card';
import { Counter } from './ui/Counter';

interface AIAgentsSectionProps {
  onOpenChecker: () => void;
}

export function AIAgentsSection({ onOpenChecker }: AIAgentsSectionProps) {
  const capabilities = [
    {
      title: 'Automated Invoice & Document Reading',
      desc: 'Computer vision and NLP ingest purchase invoices, vendor bills, and tax challans, extracting GSTIN, tax values, and HSN codes error-free.',
      icon: FileSearch,
      stat: '99.4% Extraction Precision',
      statValue: 99.4,
      statSuffix: '% Extraction Precision',
      statDecimals: 1,
    },
    {
      title: 'Automated GSTR-2B vs Books Matching',
      desc: 'Instant line-by-line reconciliation of your purchase ledger against government 2B portal returns to maximize eligible Input Tax Credit (ITC).',
      icon: GitCompare,
      stat: 'Zero Ineligible ITC Claims',
    },
    {
      title: 'Statutory Calendar & Rule Engine',
      desc: 'Dynamically recalculates due dates whenever Union Budgets alter thresholds or state governments publish holiday gazettes.',
      icon: CalendarCheck,
      stat: 'Active across 28 States & UTs',
      statValue: 28,
      statSuffix: ' States & UTs',
      statPrefix: 'Active across ',
    },
    {
      title: 'First-Draft Regulatory Responses',
      desc: 'Parses standard scrutiny notices (e.g. GST ASMT-10 or Income Tax intimations) and structures factual draft replies for advocate review.',
      icon: Scale,
      stat: 'Standard Format Verification',
    },
    {
      title: 'Filing Readiness & Sanity Checklists',
      desc: 'Runs pre-flight validation rules before final CA submission to catch PAN-Aadhaar mismatch, invalid HSN digits, or negative tax ledgers.',
      icon: FileCheck,
      stat: 'Pre-filing Validation Pass',
    },
    {
      title: 'Continuous Regulatory Diff Tracker',
      desc: 'Scrapes MCA circulars, GST council decisions, and labour department notifications to update compliance logic without manual intervention.',
      icon: Cpu,
      stat: 'Daily Gazette Sync',
    },
  ];

  return (
    <Section tone="cream" withGrid>
      <Reveal>
        <SectionHeader
          className="mb-14"
          eyebrow={
            <>
              <Cpu className="w-3 h-3" />
              <span className="text-[10px] font-semibold tracking-widest uppercase">
                Autonomous Intelligence Layer
              </span>
            </>
          }
          title={
            <>
              Reminders are only the beginning. <br />
              <span className="text-[#B89E6B]">Eliminating friction before statutory review.</span>
            </>
          }
          description="Most compliance failures happen because manual data collection and invoice reconciliation take hours. Our AI agents do the preparatory heavy lifting so licensed professionals can review and certify in minutes."
        />
      </Reveal>

      <RevealGroup className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {capabilities.map((cap) => {
          const Icon = cap.icon;
          return (
            <Card key={cap.title} className="p-6 flex flex-col justify-between text-left group">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-lg bg-[#EBE8E2] border border-[#D5D0C6] flex items-center justify-center text-[#B89E6B] group-hover:bg-[#E4E0D8] transition-colors">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[9px] font-mono font-bold text-[#B89E6B] bg-[#EBE8E2] px-2 py-0.5 rounded border border-[#D5D0C6] uppercase tracking-wider">
                    {cap.statValue != null ? (
                      <>
                        {cap.statPrefix}
                        <Counter
                          value={cap.statValue}
                          suffix={cap.statSuffix}
                          decimals={cap.statDecimals ?? 0}
                        />
                      </>
                    ) : (
                      cap.stat
                    )}
                  </span>
                </div>

                <h3 className="font-display text-sm font-semibold text-[#0E1217] tracking-tight">{cap.title}</h3>
                <p className="text-xs text-[#5C6570] leading-relaxed">{cap.desc}</p>
              </div>

              <div className="pt-4 mt-4 border-t border-[#D5D0C6] flex items-center justify-between text-[10px] font-mono font-bold text-[#6B7580] uppercase tracking-widest">
                <span>AI Pre-Flight Validation</span>
                <span className="text-[#B89E6B] font-bold">&check;</span>
              </div>
            </Card>
          );
        })}
      </RevealGroup>

      <Reveal delay={0.1}>
        <Card hover={false} className="mt-12 p-5 max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-[#EBE8E2] border border-[#D5D0C6] text-[#B89E6B] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="font-display text-xs font-semibold text-[#0E1217] tracking-wide">
                AI prepares data. Regulated professionals review and certify.
              </div>
              <div className="text-xs text-[#6B7580] font-mono">
                Every calculation is auditable and traceable to original GSTN / MCA source ledgers.
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenChecker}
            className="btn-primary shrink-0 font-mono font-bold text-xs uppercase tracking-wider"
          >
            Run Demo Scan &rarr;
          </button>
        </Card>
      </Reveal>
    </Section>
  );
}
