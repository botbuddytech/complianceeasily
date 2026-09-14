import {
  Award,
  Building2,
  Scale,
  FileCheck2,
  ArrowRight,
  CheckCircle2,
  Shield,
} from 'lucide-react';
import { VerifiedBadge, VerifiedBadgeVariant } from './VerifiedBadge';
import { Section } from './ui/Section';
import { SectionHeader } from './ui/SectionHeader';
import { Reveal, RevealGroup } from './ui/Reveal';
import { Card } from './ui/Card';

interface HumanProfessionalsSectionProps {
  onOpenChecker: () => void;
}

export function HumanProfessionalsSection({ onOpenChecker }: HumanProfessionalsSectionProps) {
  const cards = [
    {
      title: 'CHARTERED ACCOUNTANTS',
      subtitle: 'Tax, Financial Audit & Statutory Reconciliations',
      icon: Award,
      verified: 'ca' as VerifiedBadgeVariant,
      items: [
        'GST Return & Input Tax Credit Review',
        'Corporate & Business Income Tax (ITR)',
        'Quarterly TDS Computation & Forms',
        'Management Accounting & Books',
        'Tax Audit under Section 44AB',
        'Financial Statements (P&L, Balance Sheet)',
        'GSTR-2B vs Purchase Reconciliations',
      ],
    },
    {
      title: 'COMPANY SECRETARIES',
      subtitle: 'Corporate Governance, ROC & Board Affairs',
      icon: Building2,
      verified: 'cs' as VerifiedBadgeVariant,
      items: [
        'ROC / MCA Master Data Compliance',
        'AOC-4 & MGT-7 Annual Returns',
        'Board Compliance & Minutes Maintenance',
        'Director Changes & DIN Verifications',
        'Secretarial Compliance Documentation',
        'Secretarial Audit under Section 204',
        'LLP Statements of Account & Solvency',
      ],
    },
    {
      title: 'ADVOCATES & LEGAL COUNSEL',
      subtitle: 'Regulatory Scrutiny, Notices & Representation',
      icon: Scale,
      verified: 'advocate' as VerifiedBadgeVariant,
      items: [
        'GST & Income Tax Notice Legal Responses',
        'Regulatory Summons & Inquiries Handling',
        'Statutory Legal Opinions & Structuring',
        'Commercial Contractual Compliance',
        'Regulatory Disputes & Tribunal Matters',
        'Authorized Departmental Representation',
        'Litigation Escalation to High Courts',
      ],
    },
    {
      title: 'COMPLIANCE SPECIALISTS',
      subtitle: 'Labour, Factory, Municipal & Licensing Regulators',
      icon: FileCheck2,
      verified: 'professional' as VerifiedBadgeVariant,
      items: [
        'Labour Law & Statutory Muster Registers',
        'EPFO & ESIC Monthly Remittances',
        'Professional Tax State Enrollments',
        'FSSAI Food Safety Licensing & FoSCoS',
        'Municipal Trade Licences & ULB Permits',
        'Factories Act 1948 Approvals & Safety',
        'Pollution Control Board Consents (CTE/CTO)',
        'Industry-Specific Environmental Clearances',
      ],
    },
  ];

  return (
    <Section tone="espresso" withGrid withGlow>
      <Reveal>
        <SectionHeader
          className="mb-14"
          eyebrow={
            <>
              <Award className="w-3 h-3 text-[#B89E6B]" />
              <span className="text-[10px] font-semibold tracking-widest uppercase">
                AI SPEED + REGULATED ACCOUNTABILITY
              </span>
            </>
          }
          title={
            <>
              AI handles the heavy prep. <br />
              <span className="text-[#B89E6B]">Licensed practitioners certify &amp; file.</span>
            </>
          }
          description="ComplianceEasily couples automated reconciliation with an elite network of Chartered Accountants, Company Secretaries, Advocates, and domain-regulated practitioners."
        />
      </Reveal>

      <RevealGroup className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Card
              key={card.title}
              className="flex flex-col justify-between text-left group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-lg border border-[#D5D0C6] bg-[#EBE8E2] text-[#B89E6B] flex items-center justify-center">
                    <Icon className="w-5 h-5 stroke-[2]" />
                  </div>
                  <VerifiedBadge variant={card.verified} />
                </div>

                <div>
                  <h3 className="font-display text-base font-semibold text-[#0E1217] tracking-tight">
                    {card.title}
                  </h3>
                  <p className="text-xs text-[#6B7580] font-medium mt-0.5">{card.subtitle}</p>
                </div>

                <div className="pt-2 border-t border-[#D5D0C6] space-y-2">
                  {card.items.map((item) => (
                    <div
                      key={item}
                      className="flex items-start text-xs text-[#0E1217] leading-snug"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#B89E6B] mr-2 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-[#D5D0C6]">
                <div className="text-[10px] font-mono font-bold text-[#B89E6B] bg-[#EBE8E2] border border-[#D5D0C6] px-2.5 py-1.5 rounded-lg flex items-center justify-between uppercase tracking-wider">
                  <span>Regulated Oversight</span>
                  <Shield className="w-3 h-3 text-[#B89E6B]" />
                </div>
              </div>
            </Card>
          );
        })}
      </RevealGroup>

      <Reveal delay={0.1}>
        <Card hover={false} className="mt-12 p-6 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="space-y-1">
            <h4 className="font-display text-base font-semibold text-[#0E1217] tracking-tight">
              One unified console. The right professional for every filing.
            </h4>
            <p className="text-xs text-[#5C6570]">
              Never get stuck coordinating between fragmented local accountants, disjointed brokers, and isolated advisors.
            </p>
          </div>

          <button
            type="button"
            onClick={onOpenChecker}
            className="btn-primary shrink-0 font-mono font-bold text-xs uppercase tracking-wider"
          >
            <span>Explore Professional Network</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </Card>
      </Reveal>
    </Section>
  );
}
