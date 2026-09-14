import {
  Shield,
  ShieldCheck,
  CheckCircle2,
  Info,
} from 'lucide-react';
import { ResponsibilityTimeline } from './ResponsibilityTimeline';
import { Section } from './ui/Section';
import { SectionHeader } from './ui/SectionHeader';
import { Reveal } from './ui/Reveal';
import { Card } from './ui/Card';

interface ProtectionGuaranteeSectionProps {
  onOpenChecker: () => void;
  onOpenProtectionModal: () => void;
}

export function ProtectionGuaranteeSection({
  onOpenChecker,
  onOpenProtectionModal,
}: ProtectionGuaranteeSectionProps) {
  return (
    <Section tone="cream" withGrid className="space-y-16">
      <Reveal>
        <SectionHeader
          eyebrow={
            <>
              <Shield className="w-3 h-3" />
              <span className="text-[10px] font-mono font-bold tracking-widest uppercase">
                CONTRACTUAL ACCOUNTABILITY
              </span>
            </>
          }
          title={
            <>
              If we miss it, <br />
              <span className="text-[#B89E6B]">we pay it.*</span>
            </>
          }
          description="For eligible compliances handled under our Managed plans, if ComplianceEasily misses an agreed statutory deadline after you have submitted all required documents and approvals on time, ComplianceEasily will reimburse the eligible statutory late fee or penalty up to the applicable plan limit."
        />
      </Reveal>

      <Reveal delay={0.05}>
        <div className="max-w-2xl mx-auto space-y-4">
          <Card featured className="space-y-5 relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#D5D0C6]">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-[#EBE8E2] border border-[#D5D0C6] text-[#B89E6B] flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <span className="text-xs font-black text-[#0E1217] tracking-wider uppercase font-mono">
                  Protected by ComplianceEasily
                </span>
              </div>
              <span className="text-[10px] font-mono font-bold text-[#B89E6B] bg-[#EBE8E2] px-2.5 py-1 rounded-full border border-[#D5D0C6] uppercase tracking-wider">
                Guarantee Active: ₹50,000 Cap
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-base font-semibold text-[#0E1217] uppercase font-mono">
                  GSTR-3B — August Period
                </h3>
                <span className="text-xs text-[#6B7580] font-mono font-medium">Due: 20 Sep</span>
              </div>
              <p className="text-xs text-[#5C6570] leading-relaxed">
                Eligible statutory late fee reimbursed in full if filing is delayed solely due to our operational failure.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#EBE8E2] border border-[#D5D0C6] text-xs text-[#0E1217] space-y-1 font-mono">
              <div className="font-bold flex items-center text-[#0E1217]">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#B89E6B] mr-1.5" />
                Status: Document intake verified &bull; On-time filing scheduled
              </div>
              <div className="text-[11px] text-[#6B7580] pl-5">
                Cut-off deadline met: All purchase registers verified before statutory threshold.
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                type="button"
                onClick={onOpenProtectionModal}
                className="btn-primary w-full sm:w-auto font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-1.5"
              >
                <Info className="w-3.5 h-3.5 text-[#D5A77B]" />
                <span>How Protection Works &amp; Legal Terms</span>
              </button>
              <span className="text-[10px] font-mono text-[#6B7580] uppercase tracking-wider">
                Included in Managed + Protected Plan
              </span>
            </div>
          </Card>

          <Card hover={false} className="p-4 text-[11px] text-[#5C6570] leading-relaxed font-sans">
            <strong className="text-[#0E1217] font-bold uppercase tracking-wider text-[10px] block mb-1 font-mono">
              *Legal Disclosure &amp; Terms:
            </strong>
            Subject to eligibility, exclusions and applicable protection limits. Compliance Protection is a
            contractual service guarantee and is not an insurance product or policy. Reimbursement
            applies only where all requested records, signatures, OTPs, approvals and funds were
            provided before the published cut-off time and where the delay was caused solely by
            ComplianceEasily. Excludes taxes, interest, disputed demands, customer-caused delays, portal
            outages, third-party system failures and regulatory changes.
          </Card>
        </div>
      </Reveal>

      <Reveal delay={0.1}>
        <ResponsibilityTimeline onOpenChecker={onOpenChecker} />
      </Reveal>
    </Section>
  );
}
