import {
  Cpu,
  Users,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  PhoneCall,
} from 'lucide-react';
import { Section } from './ui/Section';
import { SectionHeader } from './ui/SectionHeader';
import { Reveal, RevealGroup } from './ui/Reveal';
import { Card } from './ui/Card';

interface FinalTrustSectionProps {
  onOpenChecker: () => void;
}

export function FinalTrustSection({ onOpenChecker }: FinalTrustSectionProps) {
  const columns = [
    {
      icon: Cpu,
      title: 'Autonomous System',
      subtitle: 'Speed, scale & proactive radar',
      items: [
        'Automated statutory calendar tracking across Central & State',
        'Intelligent WhatsApp document intake & automated ledger sorting',
        'Instant GSTR-2B line-item matching against purchase ledgers',
        'Pre-filing validation checklists to catch math & data errors',
      ],
    },
    {
      icon: Users,
      title: 'Regulated Network',
      subtitle: 'Certification, judgment & defense',
      items: [
        'Chartered Accountants (ICAI) for tax audits & return sign-offs',
        'Company Secretaries (ICSI) for MCA annual returns & board resolutions',
        'Enrolled Advocates for notice drafting & tribunal representation',
        'Labour law specialists for EPFO, ESIC & state inspections',
      ],
    },
    {
      icon: ShieldCheck,
      title: 'Accountability Trail',
      subtitle: 'Guarantees & audit trails',
      items: [
        'Transparent tariffs with zero markup on government challans',
        'Permanent, immutable responsibility trail from upload to filing',
        'Direct treasury receipts for every statutory rupee spent',
        'Compliance Protection Guarantee: If we miss it, we pay it*',
      ],
    },
  ];

  return (
    <Section tone="espresso" withGrid withGlow className="space-y-16">
      <Reveal>
        <SectionHeader
          eyebrow={
            <>
              <Sparkles className="w-3 h-3" />
              <span className="text-[10px] font-mono font-bold tracking-widest uppercase">
                ARCHITECTURAL COMMITMENT
              </span>
            </>
          }
          title={
            <>
              Technology when it accelerates. <br />
              <span className="text-[#B89E6B]">Professionals when it matters.</span>
            </>
          }
          description="Never choose between slow, opaque manual consultants and disconnected software. Experience the best of both worlds built specifically for Indian entrepreneurs."
        />
      </Reveal>

      <RevealGroup className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
        {columns.map((col) => {
          const Icon = col.icon;
          return (
            <Card key={col.title} className="p-7 flex flex-col justify-between space-y-4">
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-lg bg-[#EBE8E2] border border-[#D5D0C6] flex items-center justify-center text-[#B89E6B]">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display text-sm font-semibold text-[#0E1217] tracking-tight">
                    {col.title}
                  </h3>
                  <p className="text-xs text-[#6B7580] font-medium">{col.subtitle}</p>
                </div>
                <ul className="space-y-2.5 text-xs text-[#5C6570]">
                  {col.items.map((item) => (
                    <li key={item} className="flex items-start">
                      <CheckCircle2 className="w-4 h-4 text-[#B89E6B] mr-2 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          );
        })}
      </RevealGroup>

      <Reveal delay={0.1}>
        <div className="rounded-2xl p-8 sm:p-12 text-center space-y-6 max-w-4xl mx-auto border border-[#1E2630] bg-[#0E1217]/60">
          <div className="space-y-2">
            <div className="glass-pill glass-pill-dark mx-auto">
              <span className="text-[10px] font-mono font-bold tracking-widest uppercase">
                ACTIVATE COVERAGE
              </span>
            </div>
            <h3 className="font-display text-2xl sm:text-3xl lg:text-4xl font-semibold text-[#F4F2EE] tracking-tight">
              Ready to secure your statutory perimeter?
            </h3>
            <p className="text-xs sm:text-sm text-[#A8B0BA] max-w-xl mx-auto font-sans">
              Join thousands of Indian business owners who sleep peacefully knowing their Central,
              State, and municipal compliances are synchronized on WhatsApp.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={onOpenChecker}
              className="btn-primary w-full sm:w-auto px-8 py-3.5 font-semibold text-sm flex items-center justify-center space-x-2"
            >
              <span>Check my business compliance</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={onOpenChecker}
              className="btn-secondary-dark w-full sm:w-auto px-6 py-3.5 font-semibold text-sm flex items-center justify-center space-x-2"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Talk to an expert in one call</span>
            </button>
          </div>

          <p className="text-[11px] font-mono text-[#A8B0BA]">
            2-minute setup &bull; Zero credit card &bull; 1 Entity free forever
          </p>
        </div>
      </Reveal>
    </Section>
  );
}
