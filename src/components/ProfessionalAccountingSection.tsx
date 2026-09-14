import {
  BookOpenCheck,
  Landmark,
  Mail,
  Link2,
  ArrowRight,
  CheckCircle2,
  RefreshCw,
  FileSpreadsheet,
  ShieldCheck,
} from 'lucide-react';
import { Fragment } from 'react';
import { VerifiedBadge } from './VerifiedBadge';
import { TalkToExpertHighlight } from './TalkToExpertHighlight';
import { BankPartnerStrip } from './BankPartnerStrip';
import { Section } from './ui/Section';
import { SectionHeader } from './ui/SectionHeader';
import { Reveal, RevealGroup } from './ui/Reveal';
import { Card } from './ui/Card';

interface ProfessionalAccountingSectionProps {
  onOpenChecker: () => void;
}

const STANDARDS = [
  { code: 'ICAI AS', note: 'Accounting Standards for non-Ind AS entities' },
  { code: 'Ind AS', note: 'IFRS-converged standards for applicable companies' },
  { code: 'Schedule III', note: 'Companies Act financial statement formats' },
  { code: 'ICDS', note: 'Income Computation & Disclosure Standards' },
  { code: 'GST Books', note: 'Section 35 records, e-invoice & 2B matching' },
];

const INTEGRATIONS = [
  { name: 'Tally Prime', kind: 'Desktop ERP' },
  { name: 'Zoho Books', kind: 'Cloud accounting' },
  { name: 'QuickBooks', kind: 'Cloud books' },
  { name: 'Busy', kind: 'Indian SME ERP' },
  { name: 'Marg', kind: 'Distribution / pharma' },
  { name: 'SAP Business One', kind: 'Mid-market ERP' },
  { name: 'Microsoft Excel', kind: 'Ledgers & MIS' },
  { name: 'GSTN / e-Invoice', kind: 'Statutory feed' },
];

const PIPELINE = [
  { step: '01', title: 'Fetch', detail: 'Bank, UPI, email invoices, WhatsApp bills' },
  { step: '02', title: 'Map', detail: 'Tally, Zoho, QuickBooks or Excel ledgers' },
  { step: '03', title: 'Classify', detail: 'AS / Ind AS, GST, TDS and Schedule III' },
  { step: '04', title: 'Reconcile', detail: 'Bank, 2B, AIS/TIS and vendor statements' },
  { step: '05', title: 'CA sign-off', detail: 'Practising CA reviews and certifies books' },
];

export function ProfessionalAccountingSection({
  onOpenChecker,
}: ProfessionalAccountingSectionProps) {
  return (
    <Section tone="cream" id="professional-accounting">
      <div className="space-y-12">
        <Reveal>
          <SectionHeader
            eyebrow={
              <>
                <BookOpenCheck className="w-3.5 h-3.5" />
                <span className="text-[11px] font-semibold tracking-[0.14em] uppercase">
                  Professional accounting
                </span>
              </>
            }
            title={
              <>
                Books that follow accounting standards.
                <span className="text-[#B89E6B]"> Banks, emails and Tally already in sync.</span>
              </>
            }
            description="Monthly books prepared to ICAI AS or Ind AS, Schedule III and GST record rules — not a spreadsheet dump. Feeds arrive automatically. A practising CA verifies every close."
          />

          <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
            <VerifiedBadge variant="ca" />
            <VerifiedBadge variant="standards" />
            <VerifiedBadge variant="bank" />
            <VerifiedBadge variant="email" />
            <VerifiedBadge variant="integration" label="Tally / Zoho / QB Synced" />
            <VerifiedBadge variant="professional" />
          </div>
        </Reveal>

        <Reveal delay={0.05}>
          <TalkToExpertHighlight onTalkToExpert={onOpenChecker} />
        </Reveal>

        <RevealGroup className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <Card as="article" className="rounded-2xl space-y-4 text-left">
            <div className="flex items-start justify-between gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#EBE8E2] border border-[#D5D0C6] flex items-center justify-center text-[#B89E6B]">
                <BookOpenCheck className="w-5 h-5" />
              </div>
              <VerifiedBadge variant="standards" />
            </div>
            <h3 className="font-display text-xl font-semibold text-[#0E1217] tracking-tight">
              Standards-led books of account
            </h3>
            <p className="text-sm text-[#5C6570] leading-relaxed">
              Ledgers, trial balance, P&amp;L and balance sheet mapped to the standard that applies
              to your entity — ICAI AS, Ind AS, or Schedule III formats for companies.
            </p>
            <ul className="space-y-2">
              {STANDARDS.map((item) => (
                <li key={item.code} className="flex items-start gap-2 text-sm text-[#0E1217]">
                  <CheckCircle2 className="w-4 h-4 text-[#B89E6B] mt-0.5 shrink-0" />
                  <span>
                    <strong className="font-semibold">{item.code}.</strong> {item.note}
                  </span>
                </li>
              ))}
            </ul>
          </Card>

          <Card as="article" className="rounded-2xl space-y-4 text-left">
            <div className="flex items-start justify-between gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#EBE8E2] border border-[#D5D0C6] flex items-center justify-center text-[#B89E6B]">
                <Landmark className="w-5 h-5" />
              </div>
              <div className="flex flex-wrap justify-end gap-1.5">
                <VerifiedBadge variant="bank" />
                <VerifiedBadge variant="email" />
              </div>
            </div>
            <h3 className="font-display text-xl font-semibold text-[#0E1217] tracking-tight">
              Automated bank &amp; email fetch
            </h3>
            <p className="text-sm text-[#5C6570] leading-relaxed">
              Statements, UPI settlements and invoices arrive without chasing folders. Your CA
              reviews exceptions — not every line you already paid.
            </p>
            <BankPartnerStrip />
            <ul className="space-y-2.5 text-sm text-[#0E1217]">
              <li className="flex items-start gap-2">
                <RefreshCw className="w-4 h-4 text-[#B89E6B] mt-0.5 shrink-0" />
                <span>
                  Daily bank feeds via Account Aggregator / net-banking statements, auto-reconciled
                  to cash and bank ledgers.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="w-4 h-4 text-[#B89E6B] mt-0.5 shrink-0" />
                <span>
                  Gmail and Outlook invoice pickup — GSTIN, HSN, tax and vendor extracted for the
                  purchase book.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <FileSpreadsheet className="w-4 h-4 text-[#B89E6B] mt-0.5 shrink-0" />
                <span>
                  WhatsApp bills, UPI screenshots and settlement files classified into the same
                  month-end pack.
                </span>
              </li>
            </ul>
          </Card>

          <Card as="article" className="rounded-2xl space-y-4 text-left">
            <div className="flex items-start justify-between gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#EBE8E2] border border-[#D5D0C6] flex items-center justify-center text-[#B89E6B]">
                <Link2 className="w-5 h-5" />
              </div>
              <VerifiedBadge variant="integration" />
            </div>
            <h3 className="font-display text-xl font-semibold text-[#0E1217] tracking-tight">
              Tally, Zoho, QuickBooks and more
            </h3>
            <p className="text-sm text-[#5C6570] leading-relaxed">
              Keep the software your team already uses. We sync masters, vouchers and GST registers
              — then a CA checks the close against standards.
            </p>
            <div className="grid grid-cols-2 gap-2">
              {INTEGRATIONS.map((app) => (
                <div
                  key={app.name}
                  className="card-elevated rounded-xl px-3 py-2.5"
                >
                  <div className="text-sm font-semibold text-[#0E1217]">{app.name}</div>
                  <div className="text-[11px] text-[#6B7580]">{app.kind}</div>
                </div>
              ))}
            </div>
          </Card>
        </RevealGroup>

        <Reveal delay={0.1}>
          <Card hover={false} className="rounded-2xl p-5 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6">
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#B89E6B] mb-1">
                  Month-end pipeline
                </div>
                <h3 className="font-display text-2xl font-semibold text-[#0E1217] tracking-tight">
                  From live feeds to CA-certified books
                </h3>
              </div>
              <VerifiedBadge variant="ca" label="CA Verified Close" />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-stretch">
              {PIPELINE.map((item, index) => (
                <Fragment key={item.step}>
                  <div className="relative flex-1 min-w-0 card-elevated rounded-xl p-4">
                    <div className="text-[11px] font-semibold text-[#B89E6B] tracking-wider">
                      {item.step}
                    </div>
                    <div className="mt-1 text-sm font-semibold text-[#0E1217]">{item.title}</div>
                    <p className="mt-1 text-xs text-[#5C6570] leading-relaxed">{item.detail}</p>
                  </div>

                  {index < PIPELINE.length - 1 && (
                    <>
                      <div
                        className="hidden sm:flex w-9 shrink-0 self-stretch items-center justify-center"
                        aria-hidden
                      >
                        <span className="flex h-7 w-7 items-center justify-center rounded-full border border-[#B89E6B]/45 bg-[#F4F2EE] text-[#B89E6B] shadow-sm">
                          <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.5} />
                        </span>
                      </div>
                      <div className="flex sm:hidden items-center justify-center py-1" aria-hidden>
                        <span className="flex h-7 w-7 rotate-90 items-center justify-center rounded-full border border-[#B89E6B]/45 bg-[#F4F2EE] text-[#B89E6B]">
                          <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.5} />
                        </span>
                      </div>
                    </>
                  )}
                </Fragment>
              ))}
            </div>
          </Card>
        </Reveal>

        <Reveal delay={0.15}>
          <Card
            hover={false}
            className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl"
          >
            <div className="flex items-start gap-3 text-left">
              <div className="w-10 h-10 rounded-xl bg-[#EBE8E2] border border-[#D5D0C6] flex items-center justify-center text-[#B89E6B] shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="font-display text-lg font-semibold text-[#0E1217]">
                  Books stay yours. Professionals stay accountable.
                </div>
                <p className="text-sm text-[#5C6570]">
                  AI posts and matches. A practising CA certifies the close. Talk to that expert in
                  one phone call whenever something looks off.
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 shrink-0">
              <button
                type="button"
                onClick={onOpenChecker}
                className="btn-primary"
              >
                Start professional books
                <ArrowRight className="w-4 h-4" />
              </button>
              <TalkToExpertHighlight onTalkToExpert={onOpenChecker} variant="compact" />
            </div>
          </Card>
        </Reveal>
      </div>
    </Section>
  );
}
