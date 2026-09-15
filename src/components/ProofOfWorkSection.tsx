import {
  BadgeCheck,
  FileCheck2,
  IndianRupee,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
} from 'lucide-react';
import { Section } from './ui/Section';
import { Reveal, RevealGroup } from './ui/Reveal';

const STATS = [
  {
    value: '10,000+',
    label: 'Filings completed',
    detail: 'GST, MCA, tax & labour',
    icon: FileCheck2,
  },
  {
    value: '10,000+',
    label: 'Clients served',
    detail: 'Across India, every entity type',
    icon: Users,
  },
  {
    value: '₹1 Cr+',
    label: 'Penalties avoided',
    detail: 'Through on-time filings',
    icon: IndianRupee,
  },
  {
    value: '0.01%',
    label: 'Error rate',
    detail: 'AI prep + professional review',
    icon: Target,
  },
] as const;

const BADGES = [
  { label: 'ICAI practising CAs', icon: BadgeCheck },
  { label: 'ICSI practising CSs', icon: BadgeCheck },
  { label: 'Bar Council advocates', icon: ShieldCheck },
  { label: 'DSC-signed filings', icon: FileCheck2 },
  { label: 'Protection Guarantee', icon: ShieldCheck },
  { label: 'WhatsApp radar live', icon: Sparkles },
] as const;

export function ProofOfWorkSection() {
  return (
    <Section tone="cream" withGrid className="!py-10 sm:!py-12 lg:!py-14">
      <div className="space-y-8 sm:space-y-10">
        <Reveal className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="glass-pill mx-auto">
            <Sparkles className="w-3.5 h-3.5 text-[#B89E6B] shrink-0" />
            <span className="text-[10px] font-mono font-bold tracking-widest uppercase">
              Proof of work
            </span>
          </div>
          <h2 className="font-display text-[1.35rem] sm:text-3xl font-semibold tracking-tight text-[#0E1217] leading-tight">
            Numbers that back the accountability.
          </h2>
          <p className="text-sm sm:text-base text-[#5C6570] leading-relaxed">
            Real filings, real clients, real money saved — reviewed and signed off by practising
            professionals, not just software.
          </p>
        </Reveal>

        <RevealGroup
          className="grid grid-cols-2 lg:grid-cols-4 gap-px rounded-2xl overflow-hidden border border-[#D5D0C6] bg-[#D5D0C6]"
          stagger={0.06}
        >
          {STATS.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="bg-[#F4F2EE] px-3 py-5 sm:px-6 sm:py-8 text-center flex flex-col items-center gap-1.5 sm:gap-2"
              >
                <div className="w-9 h-9 rounded-xl bg-[#EBE8E2] border border-[#D5D0C6] flex items-center justify-center text-[#B89E6B] mb-1">
                  <Icon className="w-4 h-4" strokeWidth={2.1} />
                </div>
                <div className="font-display text-xl sm:text-3xl lg:text-[2.15rem] font-semibold tracking-tight text-[#0E1217] tabular-nums">
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm font-semibold text-[#0E1217] leading-snug">{stat.label}</div>
                <div className="text-[11px] sm:text-xs text-[#6B7580] leading-snug">{stat.detail}</div>
              </div>
            );
          })}
        </RevealGroup>

        <Reveal delay={0.1} className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5">
          {BADGES.map((badge) => {
            const Icon = badge.icon;
            return (
              <span
                key={badge.label}
                className="inline-flex items-center gap-1.5 rounded-full border border-[#D5D0C6] bg-[#FFFFFF] px-3 py-1.5 text-[11px] sm:text-xs font-semibold text-[#0E1217]"
              >
                <Icon className="w-3.5 h-3.5 text-[#B89E6B] shrink-0" strokeWidth={2.25} />
                {badge.label}
              </span>
            );
          })}
        </Reveal>
      </div>
    </Section>
  );
}
