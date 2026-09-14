import {
  ArrowRight,
  Gift,
  HandCoins,
  LineChart,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import { BankPartnerStrip } from './BankPartnerStrip';
import { Section } from './ui/Section';
import { SectionHeader } from './ui/SectionHeader';
import { Reveal, RevealGroup } from './ui/Reveal';
import { Card } from './ui/Card';

interface BeyondComplianceSectionProps {
  onOpenChecker: () => void;
}

const INSIGHT_BULLETS = [
  'Cash-flow & GST-linked revenue trends from connected bank, Tally and Zoho feeds',
  'Expense category breakdown so you see where money actually goes each month',
  'Peer benchmarking by industry and turnover band — plain numbers, not jargon',
  'Plain-English monthly health report your founders and board can actually read',
];

const DEAL_BULLETS = [
  'Preferential working-capital & loan offers from partner banks tied to compliance + bank health',
  'Discounted SaaS, payment-gateway and insurance pricing for verified businesses',
  'Scheme & subsidy eligibility alerts — Startup India, MSME, and state incentives',
  'Curated vendor marketplace unlocked via your Compliance Passport score',
];

const STATS = [
  { label: '12+ Partner Banks & Lenders', shortLabel: '12+ Banks', icon: HandCoins },
  { label: '20+ Curated Vendor Deals', shortLabel: '20+ Deals', icon: Gift },
  { label: 'Insights refresh every sync', shortLabel: 'Live Insights', icon: LineChart },
];

export function BeyondComplianceSection({ onOpenChecker }: BeyondComplianceSectionProps) {
  return (
    <Section tone="cream" id="beyond-compliance" className="space-y-8 sm:space-y-12">
      <Reveal>
        <SectionHeader
          eyebrow={
            <>
              <Sparkles className="w-3.5 h-3.5 text-[#B89E6B] shrink-0" />
              <span className="text-[10px] font-mono font-bold tracking-widest uppercase">
                BEYOND STATUTORY FILING
              </span>
            </>
          }
          title={
            <>
              We don&rsquo;t just file your returns.{' '}
              <span className="text-[#B89E6B]">We help your business grow.</span>
            </>
          }
          description="Compliance data is also business intelligence. Turn filings, bank feeds and books into insights — and unlock partner deals that reward staying compliant."
        />
      </Reveal>

      <RevealGroup className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <Card className="p-4 sm:p-7 flex flex-col gap-4 sm:gap-5 text-left min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-[#EBE8E2] border border-[#D5D0C6] flex items-center justify-center text-[#B89E6B] shrink-0">
              <TrendingUp className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#B89E6B] bg-[#EBE8E2] border border-[#D5D0C6] px-2 sm:px-2.5 py-1 rounded-full shrink-0">
              Insights
            </span>
          </div>

          <div className="min-w-0">
            <h3 className="font-display text-lg sm:text-xl font-semibold text-[#0E1217] tracking-tight">
              See what your books are telling you
            </h3>
            <p className="text-sm text-[#5C6570] mt-1.5 leading-relaxed">
              Beyond the return filing, we surface trends and alerts from the same data your CA
              already reviews — so decisions get faster, not just filings.
            </p>
          </div>

          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            <span className="inline-flex items-center text-[10px] sm:text-[11px] font-mono font-bold text-[#B89E6B] bg-[#EBE8E2] border border-[#D5D0C6] px-2 sm:px-2.5 py-1 rounded-lg">
              +18% MoM Revenue
            </span>
            <span className="inline-flex items-center text-[10px] sm:text-[11px] font-mono font-bold text-[#B89E6B] bg-[#EBE8E2] border border-[#D5D0C6] px-2 sm:px-2.5 py-1 rounded-lg">
              ₹42K Savings Flagged
            </span>
            <span className="inline-flex items-center text-[10px] sm:text-[11px] font-mono font-bold text-[#0E1217] bg-[#F4F2EE] border border-[#D5D0C6] px-2 sm:px-2.5 py-1 rounded-lg">
              GST ITC Gap: ₹8.2K
            </span>
          </div>

          <ul className="space-y-2 sm:space-y-2.5 pt-1 border-t border-[#D5D0C6]">
            {INSIGHT_BULLETS.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-[#0E1217]">
                <span className="text-[#B89E6B] font-bold mt-0.5 shrink-0">✓</span>
                <span className="leading-snug min-w-0">{item}</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="p-4 sm:p-7 flex flex-col gap-4 sm:gap-5 text-left min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-[#EBE8E2] border border-[#D5D0C6] flex items-center justify-center text-[#B89E6B] shrink-0">
              <Gift className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#B89E6B] bg-[#EBE8E2] border border-[#D5D0C6] px-2 sm:px-2.5 py-1 rounded-full shrink-0">
              Deals &amp; Perks
            </span>
          </div>

          <div className="min-w-0">
            <h3 className="font-display text-lg sm:text-xl font-semibold text-[#0E1217] tracking-tight">
              Stay compliant. Unlock better deals.
            </h3>
            <p className="text-sm text-[#5C6570] mt-1.5 leading-relaxed">
              A clean Compliance Passport and healthy bank sync open preferential rates, scheme
              alerts, and curated partner offers — without another spreadsheet hunt.
            </p>
          </div>

          <ul className="space-y-2 sm:space-y-2.5">
            {DEAL_BULLETS.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-[#0E1217]">
                <span className="text-[#B89E6B] font-bold mt-0.5 shrink-0">✓</span>
                <span className="leading-snug min-w-0">{item}</span>
              </li>
            ))}
          </ul>

          <div className="mt-auto pt-2 min-w-0 overflow-hidden">
            <BankPartnerStrip compact />
          </div>
        </Card>
      </RevealGroup>

      <Reveal delay={0.08}>
        <div className="rounded-2xl bg-[#FFFFFF] border border-[#D5D0C6] p-3.5 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-3 sm:gap-4 shadow-[0_1px_2px_rgba(14,18,23,0.04)] min-w-0">
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {STATS.map((stat) => {
              const Icon = stat.icon;
              return (
                <span
                  key={stat.label}
                  className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-semibold text-[#0E1217] bg-[#EBE8E2] border border-[#D5D0C6] rounded-full px-2.5 sm:px-3 py-1.5"
                >
                  <Icon className="w-3.5 h-3.5 text-[#B89E6B] shrink-0" />
                  <span className="sm:hidden">{stat.shortLabel}</span>
                  <span className="hidden sm:inline">{stat.label}</span>
                </span>
              );
            })}
          </div>
          <p className="text-xs text-[#5C6570] font-mono italic max-w-md lg:text-right leading-relaxed">
            &ldquo;Filing is the floor. Insights and deals are how compliant businesses pull ahead.&rdquo;
          </p>
        </div>
      </Reveal>

      <Reveal delay={0.1}>
        <div className="text-center px-1">
          <button
            type="button"
            onClick={onOpenChecker}
            className="btn-primary w-full sm:w-auto font-mono font-bold text-xs uppercase tracking-wider"
          >
            <span>Unlock Insights &amp; Deals — Free</span>
            <ArrowRight className="w-4 h-4 shrink-0" />
          </button>
        </div>
      </Reveal>
    </Section>
  );
}
