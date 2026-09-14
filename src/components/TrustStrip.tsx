import {
  Sparkles,
  Calculator,
  Landmark,
  Scale,
  ShieldCheck,
  FileSpreadsheet,
  Receipt,
  IndianRupee,
  BookOpenCheck,
  Building2,
  Users,
  FileCheck,
  Gavel,
  ScrollText,
  Briefcase,
  UtensilsCrossed,
  Factory,
  Cpu,
  Truck,
  Radio,
  PhoneCall,
  Bot,
  ArrowRight,
} from 'lucide-react';
import { Section } from './ui/Section';
import { Card } from './ui/Card';
import { Reveal, RevealGroup } from './ui/Reveal';

const COLUMNS = [
  {
    title: 'Chartered Accountants',
    subtitle: 'ICAI practising members',
    icon: Calculator,
    accent: {
      iconBg: 'bg-[#B89E6B]',
      iconFg: 'text-[#F4F2EE]',
      chip: 'bg-[#EBE8E2] text-[#B89E6B] border-[#D5D0C6]',
      ring: 'ring-[#B89E6B]/15',
    },
    chips: [
      { label: 'GST Audit', icon: FileSpreadsheet },
      { label: 'Income Tax', icon: Receipt },
      { label: 'TDS', icon: IndianRupee },
      { label: 'Financials', icon: BookOpenCheck },
    ],
  },
  {
    title: 'Company Secretaries',
    subtitle: 'ICSI practising members',
    icon: Landmark,
    accent: {
      iconBg: 'bg-[#B89E6B]',
      iconFg: 'text-[#F4F2EE]',
      chip: 'bg-[#EBE8E2] text-[#8A7349] border-[#D5D0C6]',
      ring: 'ring-[#B89E6B]/15',
    },
    chips: [
      { label: 'ROC / MCA', icon: Building2 },
      { label: 'Board Governance', icon: Users },
      { label: 'Annual Filings', icon: FileCheck },
    ],
  },
  {
    title: 'Advocates',
    subtitle: 'Bar Council enrolled',
    icon: Scale,
    accent: {
      iconBg: 'bg-[#1E2630]',
      iconFg: 'text-[#EBE8E2]',
      chip: 'bg-[#EBE8E2] text-[#1E2630] border-[#D5D0C6]',
      ring: 'ring-[#1E2630]/10',
    },
    chips: [
      { label: 'Legal Notices', icon: ScrollText },
      { label: 'Department Appeals', icon: Gavel },
      { label: 'Litigation', icon: Briefcase },
    ],
  },
  {
    title: 'Compliance Pros',
    subtitle: 'Domain specialists',
    icon: ShieldCheck,
    accent: {
      iconBg: 'bg-[#B45309]',
      iconFg: 'text-[#F4F2EE]',
      chip: 'bg-[#F7F5F1] text-[#8A7349] border-[#E4E0D8]',
      ring: 'ring-[#B45309]/15',
    },
    chips: [
      { label: 'EPFO & ESIC', icon: Users },
      { label: 'Shops & Est.', icon: Building2 },
      { label: 'FSSAI / PCB', icon: ShieldCheck },
    ],
  },
] as const;

const INDUSTRY_PACKS = [
  { label: 'Restaurant Pack', icon: UtensilsCrossed },
  { label: 'Factory & Manufacturing', icon: Factory },
  { label: 'SaaS & Tech Pack', icon: Cpu },
  { label: 'Logistics & Fleet', icon: Truck },
] as const;

export function TrustStrip() {
  return (
    <Section tone="espresso" withGrid withGlow className="!py-12 lg:!py-16">
      <div className="space-y-10">
        <Reveal className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-end">
          <div className="lg:col-span-7 space-y-4 text-left">
            <div className="glass-pill glass-pill-dark">
              <Sparkles className="w-3.5 h-3.5" />
              <span>The operating protocol</span>
            </div>
            <h2 className="font-display text-[1.5rem] sm:text-3xl lg:text-4xl font-semibold text-white tracking-tight leading-[1.15]">
              AI speed &amp; accuracy.{' '}
              <span className="text-[#B89E6B]">Professional accountability.</span>
            </h2>
            <p className="text-sm sm:text-base text-[#A8B0BA] max-w-xl leading-relaxed">
              AI fetches banks, emails and Tally or Zoho ledgers. Qualified professionals review,
              certify, and file — or talk to one in a single phone call.
            </p>
          </div>

          <div className="lg:col-span-5">
            <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5">
              <div className="flex items-center gap-3 rounded-2xl bg-[#FFFFFF] border border-[#D5D0C6] px-3.5 py-3 shadow-[0_1px_2px_rgba(14, 18, 23,0.05)]">
                <div className="w-10 h-10 rounded-xl bg-[#EBE8E2] border border-[#D5D0C6] flex items-center justify-center text-[#B89E6B] shrink-0">
                  <Bot className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#6B7580]">
                    Step 1 · AI layer
                  </div>
                  <div className="text-sm font-semibold text-[#0E1217] leading-snug">
                    Fetch, reconcile &amp; draft
                  </div>
                </div>
              </div>
              <div className="hidden sm:flex lg:hidden items-center justify-center text-[#9AA3AD] shrink-0 px-1">
                <ArrowRight className="w-4 h-4" />
              </div>
              <div className="flex items-center gap-3 rounded-2xl bg-[#0E1217] border border-[#1E2630] px-3.5 py-3 shadow-[0_8px_24px_-12px_rgba(14, 18, 23,0.45)]">
                <div className="w-10 h-10 rounded-xl bg-[#B89E6B] border border-[#B89E6B] flex items-center justify-center text-[#F4F2EE] shrink-0">
                  <PhoneCall className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#A8B0BA]">
                    Step 2 · Human sign-off
                  </div>
                  <div className="text-sm font-semibold text-[#F4F2EE] leading-snug">
                    Review, certify &amp; file
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        <RevealGroup className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {COLUMNS.map((col) => {
            const Icon = col.icon;
            return (
              <Card key={col.title} className="p-5 flex flex-col gap-4 text-left group">
                <div className="flex items-start gap-3">
                  <div
                    className={`w-11 h-11 rounded-2xl ${col.accent.iconBg} ${col.accent.iconFg} flex items-center justify-center shrink-0 shadow-sm ring-4 ${col.accent.ring} group-hover:scale-105 transition-transform duration-200`}
                  >
                    <Icon className="w-5 h-5" strokeWidth={2.1} />
                  </div>
                  <div className="min-w-0 pt-0.5">
                    <h3 className="font-display text-base font-semibold text-[#0E1217] tracking-tight leading-snug">
                      {col.title}
                    </h3>
                    <p className="text-[11px] text-[#6B7580] font-mono mt-0.5">{col.subtitle}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 mt-auto">
                  {col.chips.map((chip) => {
                    const ChipIcon = chip.icon;
                    return (
                      <span
                        key={chip.label}
                        className={`inline-flex items-center gap-1 text-[11px] font-semibold border rounded-full px-2.5 py-1 ${col.accent.chip}`}
                      >
                        <ChipIcon className="w-3 h-3 shrink-0 opacity-80" strokeWidth={2.25} />
                        {chip.label}
                      </span>
                    );
                  })}
                </div>
              </Card>
            );
          })}
        </RevealGroup>

        <Reveal
          delay={0.08}
          className="rounded-2xl bg-[#FFFFFF] border border-[#D5D0C6] p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 shadow-[0_1px_2px_rgba(14, 18, 23,0.04)]"
        >
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 min-w-0">
            <div className="text-[10px] font-mono font-bold uppercase tracking-[0.14em] text-[#6B7580] shrink-0">
              Industry packs
            </div>
            <div className="flex flex-wrap gap-2">
              {INDUSTRY_PACKS.map((pack) => {
                const PackIcon = pack.icon;
                return (
                  <span
                    key={pack.label}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-[#0E1217] bg-[#EBE8E2] border border-[#D5D0C6] rounded-full px-3 py-1.5 hover:border-[#B89E6B] hover:bg-[#F4F2EE] transition-colors cursor-default"
                  >
                    <PackIcon className="w-3.5 h-3.5 text-[#B89E6B] shrink-0" strokeWidth={2.1} />
                    {pack.label}
                  </span>
                );
              })}
            </div>
          </div>

          <div className="inline-flex items-center gap-2 self-start lg:self-auto shrink-0 rounded-full bg-[#EBE8E2] border border-[#D5D0C6] px-3 py-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#B89E6B] opacity-40" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#B89E6B]" />
            </span>
            <Radio className="w-3.5 h-3.5 text-[#B89E6B]" />
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#5C6570]">
              Status:{' '}
              <span className="text-[#B89E6B]">Radar operational</span>
            </span>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
