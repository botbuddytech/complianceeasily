import { Sparkles } from 'lucide-react';
import { Section } from './ui/Section';
import { SectionHeader } from './ui/SectionHeader';
import { Reveal, RevealGroup } from './ui/Reveal';
import { Card } from './ui/Card';

interface ProfessionalWorkflowSectionProps {
  onOpenChecker: () => void;
}

export function ProfessionalWorkflowSection({ onOpenChecker }: ProfessionalWorkflowSectionProps) {
  const badges = [
    {
      badge: 'AI Assisted',
      style: 'bg-[#EBE8E2] text-[#B89E6B] border-[#D5D0C6] font-mono',
      meaning: 'Automated data extraction, reconciliation, and statutory due date tracking powered by AI.',
      appliesTo: 'Reconciliations, document parsing, deadline calculations',
    },
    {
      badge: 'Professional Review Available',
      style: 'bg-[#E4E0D8] text-[#0E1217] border-[#D5A77B] font-mono',
      meaning: 'Can be reviewed by an expert if you want human verification before submission.',
      appliesTo: 'Optional audit checks, vendor verifications, draft notices',
    },
    {
      badge: 'CA Review',
      style: 'bg-[#B89E6B] text-white border-[#8A7349] font-bold font-mono',
      meaning: 'Reviewed by a practicing Chartered Accountant for indirect/direct tax and accounting accuracy.',
      appliesTo: 'GSTR-3B, GSTR-9, ITR-6, Advance Tax, TDS reconciliations',
    },
    {
      badge: 'CS Review',
      style: 'bg-[#B89E6B] text-white border-[#B89E6B] font-bold font-mono',
      meaning: 'Reviewed by a practicing Company Secretary for corporate governance and MCA compliance.',
      appliesTo: 'AOC-4, MGT-7, DIR-3 KYC, Board Minutes, Share allotments',
    },
    {
      badge: 'Advocate Review',
      style: 'bg-[#E4E0D8] text-[#B89E6B] border-[#B89E6B] font-bold font-mono',
      meaning: 'Drafted or vetted by an enrolled Advocate for legal risks, statutory defenses, and representation.',
      appliesTo: 'GST show cause notices, Income tax scrutiny, Departmental summons',
    },
    {
      badge: 'CA Required',
      style: 'bg-[#EBE8E2] text-[#B89E6B] border-[#B89E6B] font-bold font-mono',
      meaning: 'Statutory mandate: Law requires mandatory certification or audit by a practicing CA.',
      appliesTo: 'Section 44AB Tax Audit, Net Worth certificates, Form 3CD',
    },
    {
      badge: 'CS Required',
      style: 'bg-[#EBE8E2] text-[#B89E6B] border-[#B89E6B] font-bold font-mono',
      meaning: 'Statutory mandate: Law requires mandatory secretarial certification by a practicing CS.',
      appliesTo: 'Section 204 Secretarial Audit, Form MGT-8, Capital changes',
    },
    {
      badge: 'CA Verified',
      style: 'bg-[#B89E6B] text-white border-[#8A7349] font-bold',
      meaning: 'A practising Chartered Accountant has reviewed and signed off the books, close, or filing pack.',
      appliesTo: 'Monthly books, bank reconciliations, Ind AS / AS financials, GST 2B match',
    },
    {
      badge: 'AS / Ind AS Aligned',
      style: 'bg-[#EBE8E2] text-[#B89E6B] border-[#D5A77B] font-bold',
      meaning: 'Ledgers and statements mapped to ICAI Accounting Standards or Ind AS and Schedule III formats.',
      appliesTo: 'Trial balance, P&L, Balance Sheet, notes to accounts, ICDS adjustments',
    },
  ];

  return (
    <Section tone="espresso" withGrid withGlow className="space-y-10">
      <Reveal>
        <SectionHeader
          eyebrow={
            <>
              <Sparkles className="w-3.5 h-3.5 text-[#B89E6B]" />
              <span className="text-[10px] font-semibold tracking-widest uppercase">
                Transparent Accountability Badges
              </span>
            </>
          }
          title={
            <>
              Know exactly who handles{' '}
              <span className="text-[#B89E6B]">each compliance.</span>
            </>
          }
          description="When a task requires professional certification or legal filing, we show you the exact badge identifying who reviews, signs, or certifies it — AI prep stays clearly labelled as AI."
        />
      </Reveal>

      <RevealGroup className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {badges.map((b) => (
          <Card key={b.badge} className="p-5 text-left flex flex-col justify-between space-y-3">
            <div className="space-y-2">
              <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs border ${b.style}`}>
                {b.badge}
              </span>
              <p className="text-xs text-[#0E1217] font-medium leading-relaxed">{b.meaning}</p>
            </div>

            <div className="pt-2 border-t border-[#D5D0C6] text-[11px] text-[#6B7580] font-mono">
              <span className="font-bold text-[#B89E6B]">Applies to:</span> {b.appliesTo}
            </div>
          </Card>
        ))}
      </RevealGroup>

      <Reveal delay={0.1}>
        <div className="text-center">
          <button
            type="button"
            onClick={onOpenChecker}
            className="text-xs font-mono font-bold uppercase tracking-wider text-[#B89E6B] hover:text-[#8A7349] transition-colors"
          >
            See badges on your compliance map →
          </button>
        </div>
      </Reveal>
    </Section>
  );
}
