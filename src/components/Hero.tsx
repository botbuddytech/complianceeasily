import {
  Shield,
  ArrowRight,
  CheckCircle2,
  Building2,
  FileCheck,
  Scale,
  Award,
  PhoneCall,
} from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { CompliancePassportDemo } from './CompliancePassportDemo';
import { VerifiedBadge } from './VerifiedBadge';
import { Section } from './ui/Section';
import { Card } from './ui/Card';
import { Reveal, RevealGroup } from './ui/Reveal';

interface HeroProps {
  onOpenChecker: () => void;
  onOpenProtectionModal: () => void;
}

function HeadlineWords() {
  const prefersReduced = useReducedMotion();

  if (prefersReduced) {
    return (
      <h2 className="font-display text-[2rem] sm:text-5xl lg:text-[3.4rem] font-semibold tracking-tight leading-[1.1] text-[#0E1217]">
        AI business compliance for India.
        <br />
        <span className="text-[#B89E6B] italic">Professional accountability.</span>
      </h2>
    );
  }

  const lines = [
    [
      { text: 'AI', className: 'text-[#0E1217]' },
      { text: 'business', className: 'text-[#0E1217]' },
      { text: 'compliance', className: 'text-[#0E1217]' },
      { text: 'for', className: 'text-[#0E1217]' },
      { text: 'India.', className: 'text-[#0E1217]' },
    ],
    [
      { text: 'Professional', className: 'text-[#B89E6B] italic' },
      { text: 'accountability.', className: 'text-[#B89E6B] italic' },
    ],
  ];

  let delayIndex = 0;

  return (
    <h2 className="font-display text-[2rem] sm:text-5xl lg:text-[3.4rem] font-semibold tracking-tight leading-[1.1]">
      {lines.map((line, lineIdx) => (
        <span key={lineIdx} className="block">
          {line.map((word) => {
            const delay = delayIndex * 0.07;
            delayIndex += 1;
            return (
              <motion.span
                key={word.text}
                className={`inline-block mr-[0.28em] ${word.className}`}
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.55,
                  delay,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                {word.text}
              </motion.span>
            );
          })}
        </span>
      ))}
    </h2>
  );
}

export function Hero({ onOpenChecker, onOpenProtectionModal }: HeroProps) {
  return (
    <Section tone="cream" withGrid className="!pt-8 !pb-16 lg:!pt-14 lg:!pb-24">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 lg:gap-8 items-center min-w-0">
        <Reveal className="lg:col-span-6 space-y-5 sm:space-y-6 text-left min-w-0">
          <div className="glass-pill">
            <span className="w-2 h-2 rounded-full bg-[#B89E6B] animate-pulse-ring" />
            <span>AI-powered. Professionally verified.</span>
          </div>

          <div className="space-y-3">
            <HeadlineWords />
            <p className="text-lg text-[#5C6570] leading-relaxed">
              Know which GST, MCA, tax, labour and State rules apply to your entity. Get free WhatsApp
              reminders, keep books to accounting standards, and file with a practising CA, CS or
              Advocate one phone call away.
            </p>
          </div>

          <RevealGroup className="grid grid-cols-1 sm:grid-cols-2 gap-3" stagger={0.08}>
            <Card className="p-4">
              <div className="text-[10px] font-mono font-bold text-[#B89E6B] uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#B89E6B]" />
                AI Compliance Agent
              </div>
              <p className="text-xs text-[#5C6570] leading-relaxed">
                24/7 Statutory Monitoring, Document Collection, First-Level Audits &amp; Automation
              </p>
            </Card>
            <Card featured className="p-4">
              <div className="text-[10px] font-mono font-bold text-[#B89E6B] uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#B89E6B]" />
                Professional Experts
              </div>
              <p className="text-xs text-[#5C6570] leading-relaxed">
                Final Review, Advisory, Certification, Representation &amp; Statutory Filing
              </p>
            </Card>
          </RevealGroup>

          <Card hover={false} className="p-3 space-y-2.5">
            <div className="flex items-center space-x-2 text-xs font-semibold text-[#B89E6B]">
              <Shield className="w-3.5 h-3.5 text-[#B89E6B]" />
              <span>Licensed practitioners, professionally verified</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              <VerifiedBadge variant="ca" label="CA Verified" />
              <VerifiedBadge variant="cs" label="CS Verified" />
              <VerifiedBadge variant="advocate" />
              <VerifiedBadge variant="standards" />
              <VerifiedBadge variant="professional" />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-medium text-[#0E1217]">
              <div className="flex items-center space-x-1.5 card-static px-2.5 py-1.5 rounded-lg min-w-0">
                <Award className="w-3.5 h-3.5 text-[#B89E6B] shrink-0" />
                <span className="truncate min-w-0">Chartered Acc.</span>
              </div>
              <div className="flex items-center space-x-1.5 card-static px-2.5 py-1.5 rounded-lg min-w-0">
                <Building2 className="w-3.5 h-3.5 text-[#B45309] shrink-0" />
                <span className="truncate min-w-0">Company Sec.</span>
              </div>
              <div className="flex items-center space-x-1.5 card-static px-2.5 py-1.5 rounded-lg min-w-0">
                <Scale className="w-3.5 h-3.5 text-[#B89E6B] shrink-0" />
                <span className="truncate min-w-0">Advocates</span>
              </div>
              <div className="flex items-center space-x-1.5 card-static px-2.5 py-1.5 rounded-lg min-w-0">
                <FileCheck className="w-3.5 h-3.5 text-[#B89E6B] shrink-0" />
                <span className="truncate min-w-0">Labour &amp; Tax Pros</span>
              </div>
            </div>
          </Card>

          <p className="text-sm sm:text-base text-[#5C6570] leading-relaxed font-normal">
            ComplianceEasily identifies all Central, State and municipal statutory requirements
            for your entity, delivers proactive reminders on WhatsApp for free, and lets AI agents and
            certified practitioners execute filings when you are ready.
          </p>

          <div className="pt-1 space-y-3">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3">
              <button type="button" onClick={onOpenChecker} className="btn-primary group w-full sm:w-auto text-center">
                <span>Check my business compliance</span>
                <span className="text-[10px] bg-[#0E1217]/55 px-2 py-0.5 rounded-full font-medium text-[#FFFFFF]">
                  Free
                </span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform shrink-0" />
              </button>

              <button
                type="button"
                onClick={onOpenChecker}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-[#EBE8E2] hover:bg-[#D5D0C6] text-[#0E1217] border border-[#D5D0C6] font-semibold text-sm transition-colors w-full sm:w-auto"
              >
                <PhoneCall className="w-4 h-4 text-[#B89E6B] shrink-0" />
                <span>Talk to an expert in one call</span>
              </button>
            </div>

            <p className="text-xs text-[#6B7580]">
              No credit card &bull; Takes 2 minutes &bull; One entity free forever
            </p>
          </div>

          <RevealGroup
            className="pt-3 border-t border-[#D5D0C6] grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-semibold text-[#5C6570]"
            stagger={0.05}
          >
            <div className="flex items-center space-x-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#B89E6B] shrink-0" />
              <span>Central &amp; State Rules</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#B89E6B] shrink-0" />
              <span>WhatsApp-First Alerts</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#B89E6B] shrink-0" />
              <span>Itemized Pass-Through Fees</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#B89E6B] shrink-0" />
              <span>Regulated Sign-Off</span>
            </div>
          </RevealGroup>
        </Reveal>

        <Reveal delay={0.15} className="lg:col-span-6 relative min-w-0">
          <div className="absolute -inset-4 sm:-inset-6 rounded-[2rem] bg-[#B89E6B]/12 blur-3xl pointer-events-none" />
          <div className="relative animate-float min-w-0">
            <CompliancePassportDemo
              onOpenChecker={onOpenChecker}
              onOpenProtectionModal={onOpenProtectionModal}
            />
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
