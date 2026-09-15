import type { SVGProps } from 'react';
import {
  Rocket,
  Users,
  MapPin,
  Factory,
  Globe2,
  ArrowRight,
  Sparkles,
  Briefcase,
} from 'lucide-react';
import { Section } from './ui/Section';
import { SectionHeader } from './ui/SectionHeader';
import { Reveal, RevealGroup } from './ui/Reveal';
import { Card } from './ui/Card';

interface BusinessGrowthSectionProps {
  onOpenChecker: () => void;
}

export function BusinessGrowthSection({ onOpenChecker }: BusinessGrowthSectionProps) {
  const stages = [
    {
      stage: '01. START',
      title: 'Formation & Setup',
      icon: Rocket,
      accent: 'blue',
      items: [
        'Entity Selection (Pvt Ltd / LLP / OPC)',
        'Company PAN, TAN & Bank Account',
        'GST Registration (where applicable)',
        'Shops & Establishment Intimation',
        'Startup India (DPIIT) Recognition',
        'Director KYC & Board Disclosures',
      ],
    },
    {
      stage: '02. HIRE WORKFORCE',
      title: 'Labour & Payroll',
      icon: Users,
      accent: 'blue',
      items: [
        'EPFO Registration & Monthly ECR',
        'ESIC Medical Insurance Remittances',
        'State Professional Tax (PT) Deduction',
        'Statutory Wages & Muster Registers',
        'POSH Internal Complaints Committee (10+)',
        'Payment of Gratuity Act Compliance',
      ],
    },
    {
      stage: '03. SECOND LOCATION',
      title: 'Inter-State Expansion',
      icon: MapPin,
      accent: 'amber',
      items: [
        'GST Additional Place of Business (APOB)',
        'Distinct State GSTIN if inter-state',
        'State-Specific Shops & Establishment',
        'Municipal Trade Licence (ULB)',
        'Local Professional Tax Registration',
        'State Labour Welfare Fund (LWF)',
      ],
    },
    {
      stage: '04. MANUFACTURING',
      title: 'Plant & Industrial Scale',
      icon: Factory,
      accent: 'purple',
      items: [
        'Factories Act 1948 Plan Approval',
        'State PCB Consent to Operate (CTO)',
        'Industrial Fire Safety Clearance NOC',
        'Machinery & Boiler Inspection Returns',
        'Hazardous Waste & Disposal Manifests',
        'Canteen & Creche Statutory Mandates',
      ],
    },
    {
      stage: '05. EXPORT / GLOBAL',
      title: 'Cross-Border Operations',
      icon: Globe2,
      accent: 'indigo',
      items: [
        'DGFT Importer-Exporter Code (IEC)',
        'Letter of Undertaking (LUT) on GSTN',
        'FEMA & RBI / EDPMS Export Realization',
        'Export Promotion Council (RCMC)',
        'Customs Authorized Economic Operator (AEO)',
        'Transfer Pricing & Country-by-Country File',
      ],
    },
  ];

  return (
    <Section tone="cream" withGrid>
      <div className="space-y-12 sm:space-y-20">
        <div className="space-y-8 sm:space-y-12">
          <Reveal>
            <SectionHeader
              eyebrow={
                <>
                  <Sparkles className="w-3.5 h-3.5 text-[#B89E6B]" />
                  <span className="text-[10px] font-semibold tracking-widest uppercase">
                    Dynamic Compliance Roadmap
                  </span>
                </>
              }
              title={
                <>
                  Your compliance changes <br />
                  <span className="text-[#B89E6B]">when your business changes.</span>
                </>
              }
              description="Compliance is not a static one-time certificate. As you hire staff, open new offices, or launch production lines, new statutory thresholds activate automatically."
            />
          </Reveal>

          <RevealGroup className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {stages.map((st) => {
              const Icon = st.icon;
              return (
                <Card key={st.stage} className="p-5 flex flex-col justify-between text-left">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-9 h-9 rounded-xl bg-[#EBE8E2] border border-[#D5D0C6] flex items-center justify-center text-[#B89E6B] shadow-2xs">
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] font-mono font-bold text-[#6B7580]">{st.stage}</span>
                    </div>

                    <div>
                      <h3 className="font-display text-sm font-semibold text-[#0E1217] tracking-tight">{st.title}</h3>
                    </div>

                    <div className="pt-2 border-t border-[#D5D0C6] space-y-1.5">
                      {st.items.map((item) => (
                        <div key={item} className="flex items-start text-[11px] text-[#5C6570] leading-snug">
                          <span className="text-[#B89E6B] font-bold mr-1.5">✓</span>
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#D5D0C6] text-[10px] font-mono font-bold text-[#B89E6B] uppercase tracking-wider flex items-center justify-between">
                    <span>Auto-monitored</span>
                    <span>→</span>
                  </div>
                </Card>
              );
            })}
          </RevealGroup>

          <Reveal delay={0.05}>
            <div className="p-4 rounded-xl bg-[#EBE8E2] border border-[#D5D0C6] max-w-2xl mx-auto text-center text-xs font-semibold text-[#0E1217]">
              &ldquo;ComplianceEasily keeps rebuilding your compliance map as you grow.&rdquo;
            </div>
          </Reveal>
        </div>

        <div className="pt-8 border-t border-[#D5D0C6] space-y-10">
          <Reveal>
            <SectionHeader
              eyebrow={
                <span className="text-[10px] font-semibold tracking-widest uppercase">Complexity Benchmark</span>
              }
              title={
                <>
                  A 5-person SaaS startup does not need a factory inspection. <br />
                  <span className="text-[#B89E6B]">A chemical factory cannot survive on basic GST.</span>
                </>
              }
              description="Same platform. Different compliance engine."
            />
          </Reveal>

          <RevealGroup className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="p-6 sm:p-7 text-left space-y-5">
              <div className="flex items-center justify-between pb-4 border-b border-[#D5D0C6]">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-[#EBE8E2] border border-[#D5D0C6] flex items-center justify-center text-[#B89E6B]">
                    <Laptop className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-display text-base font-semibold text-[#0E1217]">SaaS / Tech Startup</h4>
                    <p className="text-xs text-[#6B7580]">5-10 remote team &bull; Pure software</p>
                  </div>
                </div>
                <span className="text-xs font-bold font-mono text-[#B89E6B] bg-[#EBE8E2] border border-[#D5D0C6] px-2.5 py-1 rounded-lg">
                  ~6 Core Compliances
                </span>
              </div>

              <div className="space-y-2 text-xs text-[#0E1217] font-mono">
                {[
                  ['MCA Annual Filing (AOC-4 & MGT-7)', 'Annual'],
                  ['GST Returns (GSTR-1 & GSTR-3B)', 'Monthly / QRMP'],
                  ['TDS Deductions & Form 26Q Returns', 'Quarterly'],
                  ['Advance Tax Installments', '4 Quarters'],
                  ['Corporate Income Tax Return (ITR-6)', 'Annual'],
                  ['EPFO / ESIC (If headcount exceeds 20)', 'Conditional'],
                ].map(([label, freq]) => (
                  <div
                    key={label}
                    className="flex items-center justify-between p-2.5 rounded-lg bg-[#EBE8E2] border border-[#D5D0C6]"
                  >
                    <span className="font-semibold text-[#0E1217]">{label}</span>
                    <span className={`font-bold ${freq === 'Conditional' ? 'text-[#B89E6B]' : 'text-[#B89E6B]'}`}>
                      {freq}
                    </span>
                  </div>
                ))}
              </div>

              <div className="p-3 rounded-xl bg-[#EBE8E2] border border-[#D5D0C6] text-xs text-[#0E1217] font-medium">
                ⚡ Lightweight, streamlined workflow focused on tax accuracy and digital invoices.
              </div>
            </Card>

            <Card className="p-6 sm:p-7 text-left space-y-5">
              <div className="flex items-center justify-between pb-4 border-b border-[#D5D0C6]">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-[#EBE8E2] border border-[#D5D0C6] flex items-center justify-center text-[#B89E6B]">
                    <Factory className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-display text-base font-semibold text-[#0E1217]">Industrial Manufacturing Unit</h4>
                    <p className="text-xs text-[#6B7580]">45 on-site plant workers &bull; Heavy machinery</p>
                  </div>
                </div>
                <span className="text-xs font-bold font-mono text-[#B89E6B] bg-[#EBE8E2] border border-[#D5D0C6] px-2.5 py-1 rounded-lg">
                  24+ Statutory Compliances
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#0E1217] font-mono">
                {[
                  'Factories Act Licence',
                  'SPCB Air/Water Consent (CTO)',
                  'Industrial Fire NOC',
                  'Boilers & Pressure Vessels',
                  'Hazardous Waste Manifest',
                  'Legal Metrology (Weights)',
                  'EPFO Monthly ECR',
                  'ESIC Health Contributions',
                  'State Professional Tax',
                  'Municipal Factory Licence',
                  'Contract Labour (CLRA)',
                  'Environment Statement (Form V)',
                ].map((item) => (
                  <div key={item} className="p-2 rounded bg-[#EBE8E2] border border-[#D5D0C6] font-medium">
                    • {item}
                  </div>
                ))}
              </div>

              <div className="p-3 rounded-xl bg-[#EBE8E2] border border-[#D5D0C6] text-xs text-[#0E1217] font-medium">
                ⚡ Multi-layered inspections, local safety clearances, and strict occupational returns.
              </div>
            </Card>
          </RevealGroup>

          <Reveal delay={0.1}>
            <div className="text-center pt-2">
              <button
                type="button"
                onClick={onOpenChecker}
                className="btn-primary font-mono font-bold text-xs uppercase tracking-wider"
              >
                <span>Build My Custom Compliance Profile</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}

function Laptop(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 16V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9m16 0H4m16 0 1.28 2.55a1 1 0 0 1-.9 1.45H3.62a1 1 0 0 1-.9-1.45L4 16" />
    </svg>
  );
}
