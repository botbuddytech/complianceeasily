import { ArrowRight, Sparkles } from 'lucide-react';
import { Section } from './ui/Section';
import { SectionHeader } from './ui/SectionHeader';
import { Reveal, RevealGroup } from './ui/Reveal';
import { Card } from './ui/Card';

interface CompliancePassportSectionProps {
  onOpenChecker: () => void;
}

export function CompliancePassportSection({ onOpenChecker }: CompliancePassportSectionProps) {
  const passportModules = [
    { title: 'Business Profile', desc: 'CIN, PAN, incorporation date & entity structure' },
    { title: 'Directors & Partners', desc: 'DIN KYC status, DSC expiry & board disclosures' },
    { title: 'GST Registrations', desc: 'Multi-state GSTINs, return status & ITC credits' },
    { title: 'Business Locations', desc: 'Registered office, retail shops, plants & warehouses' },
    { title: 'Employees & Payroll', desc: 'PF / ESI / PT applicability & monthly headcount' },
    { title: 'Licences & Permits', desc: 'FSSAI, Trade, Fire NOC, SPCB consent expiries' },
    { title: 'Compliance Obligations', desc: 'Living register of active, upcoming & due tasks' },
    { title: 'Filing History', desc: 'Permanent archive of filed forms, ARNs & SRNs' },
    { title: 'Document Vault', desc: 'Encrypted storage for invoices, registers & returns' },
    { title: 'Notices & Scrutiny', desc: 'Department intimations, responses & counsel drafts' },
    { title: 'Audit Dossiers', desc: 'Tax audit & statutory audit supporting workpapers' },
    { title: 'Deadlines & Radar', desc: 'Automated WhatsApp reminder schedules' },
    { title: 'Protection Status', desc: 'Active guarantee limits & covered task badges' },
    { title: 'Responsibility Trail', desc: 'Timestamped log of document uploads & CA reviews' },
  ];

  return (
    <Section tone="espresso" withGrid withGlow id="compliance-passport" className="space-y-12">
      <Reveal>
        <SectionHeader
          eyebrow={
            <>
              <Sparkles className="w-3.5 h-3.5 text-[#B89E6B]" />
              <span className="text-xs font-semibold tracking-wider uppercase">
                CENTRALIZED SINGLE SOURCE OF TRUTH
              </span>
            </>
          }
          title={
            <>
              One living compliance record <br />
              <span className="text-[#B89E6B]">for your entire business.</span>
            </>
          }
          description="Stop digging through old email threads, WhatsApp chats with past accountants, and loose paper receipts. Your Business Compliance Passport maintains every registration, deadline, and filed document in one auditable vault."
        />
      </Reveal>

      <div className="space-y-4 text-left max-w-5xl mx-auto">
        <Reveal>
          <div className="border-b border-[#1E2630] pb-2 text-center sm:text-left">
            <h4 className="font-display text-base font-semibold text-white">
              What Lives Inside Every Compliance Passport
            </h4>
            <p className="text-xs text-[#A8B0BA]">
              A unified architecture structured to withstand diligence, bank scrutiny, and government
              inspections.
            </p>
          </div>
        </Reveal>

        <RevealGroup className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {passportModules.map((item) => (
            <Card key={item.title} className="p-3 rounded-xl">
              <div className="text-xs font-semibold text-[#0E1217] flex items-center font-display">
                <span className="w-1.5 h-1.5 rounded-full bg-[#B89E6B] mr-2 shrink-0" />
                {item.title}
              </div>
              <p className="text-[11px] text-[#5C6570] mt-0.5 leading-snug pl-3.5">{item.desc}</p>
            </Card>
          ))}
        </RevealGroup>

        <Reveal delay={0.1}>
          <div className="pt-4 text-center space-y-2">
            <button
              type="button"
              onClick={onOpenChecker}
              className="btn-primary font-mono font-bold text-xs uppercase tracking-wider"
            >
              <span>Create My Business Compliance Passport</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <div className="text-[11px] text-[#8B95A1] font-mono">
              Takes 2 minutes &bull; Instant personalized statutory roadmap
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
