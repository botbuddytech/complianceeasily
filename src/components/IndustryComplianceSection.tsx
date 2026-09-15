import { useState } from 'react';
import {
  Search,
  Shield,
  Utensils,
  ShoppingBag,
  Globe,
  Briefcase,
  Laptop,
  Factory,
  Truck,
  HardHat,
  Hotel,
  Stethoscope,
  GraduationCap,
  Anchor,
  Boxes,
  Coins,
  HeartHandshake,
  Sprout,
  Car,
  Sparkles,
  Film,
  Compass,
  Hammer,
  Pill,
  HelpCircle,
  ArrowRight,
} from 'lucide-react';
import { INDUSTRY_CATEGORIES, INDUSTRY_COMPLIANCE_PACKS } from '../data/industries';
import { IndustryPack } from '../types';
import { Section } from './ui/Section';
import { SectionHeader } from './ui/SectionHeader';
import { Reveal, RevealGroup } from './ui/Reveal';
import { Card } from './ui/Card';

interface IndustryComplianceSectionProps {
  onOpenChecker: () => void;
}

const iconMap: Record<string, any> = {
  Utensils,
  ShoppingBag,
  Globe,
  Briefcase,
  Laptop,
  Factory,
  Truck,
  HardHat,
  Hotel,
  Stethoscope,
  GraduationCap,
  Anchor,
  Boxes,
  Coins,
  HeartHandshake,
  Sprout,
  Car,
  Sparkles,
  Film,
  Compass,
  Shield,
  Hammer,
  Pill,
  HelpCircle,
};

export function IndustryComplianceSection({ onOpenChecker }: IndustryComplianceSectionProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPackId, setSelectedPackId] = useState<string>('pack-restaurant');
  const [expandedPackModal, setExpandedPackModal] = useState<IndustryPack | null>(
    INDUSTRY_COMPLIANCE_PACKS['pack-restaurant']
  );

  const filteredIndustries = INDUSTRY_CATEGORIES.filter((ind) => {
    const term = searchTerm.toLowerCase();
    return (
      ind.name.toLowerCase().includes(term) ||
      ind.category.toLowerCase().includes(term) ||
      ind.subcategories.some((sub) => sub.toLowerCase().includes(term))
    );
  });

  const activePack = INDUSTRY_COMPLIANCE_PACKS[selectedPackId] || INDUSTRY_COMPLIANCE_PACKS['pack-restaurant'];

  const handleSelectIndustry = (packId?: string) => {
    if (packId && INDUSTRY_COMPLIANCE_PACKS[packId]) {
      setSelectedPackId(packId);
      setExpandedPackModal(INDUSTRY_COMPLIANCE_PACKS[packId]);
    } else {
      setSelectedPackId('pack-service');
      setExpandedPackModal(INDUSTRY_COMPLIANCE_PACKS['pack-service']);
    }
  };

  return (
    <Section tone="espresso" withGrid withGlow id="industries">
      <Reveal>
        <SectionHeader
          className="mb-14"
          eyebrow={
            <>
              <Sparkles className="w-3 h-3 text-[#B89E6B]" />
              <span className="text-[10px] font-semibold tracking-widest uppercase">
                Industry Compliance
              </span>
            </>
          }
          title={
            <>
              Different businesses. <br />
              Different rules. <br />
              <span className="text-[#B89E6B]">One compliance system.</span>
            </>
          }
          description="A restaurant does not have the same compliance obligations as a factory. A transporter is different from a SaaS company. ComplianceEasily builds a compliance profile around what your business actually does."
        />
        <div className="text-center pt-2 -mt-8 mb-14">
          <button type="button" onClick={onOpenChecker} className="btn-primary font-mono font-bold text-xs uppercase tracking-wider">
            <span>Find My Industry Compliance</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </Reveal>

      <Reveal delay={0.05}>
        <div className="max-w-xl mx-auto mb-10">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B7580]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search your business: e.g. Restaurant, SaaS, Logistics, Textile, Gym..."
              className="input-elevated w-full pl-12 pr-4 py-3.5 text-sm text-[#0E1217] placeholder-[#6B7580]"
            />
          </div>
          <div className="text-center text-xs text-[#6B7580] mt-2 font-mono">
            Showing {filteredIndustries.length} of {INDUSTRY_CATEGORIES.length} Indian business sectors supported
          </div>
        </div>
      </Reveal>

      <RevealGroup className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-16">
        {filteredIndustries.map((ind) => {
          const Icon = iconMap[ind.iconName] || Briefcase;
          const isSelected = selectedPackId === ind.packId;
          return (
            <Card
              key={ind.id}
              onClick={() => handleSelectIndustry(ind.packId)}
              className={`p-4 cursor-pointer flex flex-col justify-between ${
                isSelected ? 'ring-1 ring-[#B89E6B]/20 border-[#B89E6B]' : ''
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                      isSelected ? 'bg-[#B89E6B] text-white' : 'bg-[#E4E0D8] text-[#B89E6B]'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono font-semibold text-[#B89E6B] uppercase tracking-wider">
                    {ind.category}
                  </span>
                </div>

                <h3 className="font-display text-sm font-semibold text-[#0E1217] tracking-tight">{ind.name}</h3>

                <div className="text-[11px] text-[#6B7580] mt-1 line-clamp-2 leading-relaxed">
                  {ind.subcategories.join(' • ')}
                </div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-[#D5D0C6] flex items-center justify-between text-[11px] font-mono font-semibold">
                <span className={isSelected ? 'text-[#B89E6B] font-bold' : 'text-[#6B7580]'}>
                  {ind.packId ? 'View Pack Blueprint' : 'Custom Assessment'}
                </span>
                <ArrowRight
                  className={`w-3.5 h-3.5 ${isSelected ? 'text-[#B89E6B] translate-x-0.5' : 'text-[#6B7580]'}`}
                />
              </div>
            </Card>
          );
        })}
      </RevealGroup>

      <Reveal delay={0.05} className="overflow-visible">
        <Card
          hover={false}
          className="mb-16 flex flex-col sm:flex-row sm:items-center justify-between gap-5 sm:gap-8 p-5 sm:p-6 lg:p-7 text-center sm:text-left overflow-visible"
        >
          <div className="min-w-0 flex-1 space-y-1.5">
            <h4 className="font-display text-base sm:text-lg font-semibold text-[#0E1217] leading-snug tracking-tight">
              Don&rsquo;t see your exact business activity listed?
            </h4>
            <p className="text-sm text-[#5C6570] leading-relaxed max-w-xl mx-auto sm:mx-0">
              We cover multi-disciplinary companies, novel digital services, and niche manufacturing sectors.
            </p>
          </div>
          <button
            type="button"
            onClick={onOpenChecker}
            className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-[#0E1217] hover:bg-[#1E2630] text-white font-mono font-bold text-xs uppercase tracking-wider transition-colors shrink-0 self-center sm:self-auto"
          >
            Tell Us What You Do
          </button>
        </Card>
      </Reveal>

      <Reveal delay={0.1}>
        <Card hover={false} className="p-6 sm:p-8 lg:p-10 text-left">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-[#D5D0C6]">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#B89E6B] bg-[#EBE8E2] px-2.5 py-0.5 rounded-full border border-[#D5D0C6]">
                  {activePack.badge}
                </span>
                <span className="text-xs text-[#6B7580] font-mono">Example Compliance Pack</span>
              </div>
              <h3 className="font-display text-xl sm:text-2xl font-semibold text-[#0E1217] mt-1">
                {activePack.name}
              </h3>
            </div>

            <button type="button" onClick={onOpenChecker} className="btn-primary shrink-0 font-mono font-bold text-xs uppercase tracking-wider">
              <span>{activePack.ctaText}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="flex flex-wrap gap-2 py-4 border-b border-[#D5D0C6]">
            {Object.values(INDUSTRY_COMPLIANCE_PACKS).map((pack) => (
              <button
                key={pack.id}
                type="button"
                onClick={() => setSelectedPackId(pack.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider transition-all ${
                  selectedPackId === pack.id
                    ? 'bg-[#B89E6B] text-white shadow-2xs'
                    : 'bg-[#E4E0D8] text-[#0E1217] hover:bg-[#DDD2C2]'
                }`}
              >
                {pack.name.split('/')[0].trim()}
              </button>
            ))}
          </div>

          <div className="py-4 px-4 my-4 rounded-xl bg-[#FFFBEB] border border-[#FDE68A] text-xs text-[#78350F] flex items-start space-x-2.5">
            <Shield className="w-4 h-4 text-[#B45309] shrink-0 mt-0.5" />
            <div>
              <strong className="font-bold">Important Notice on Applicability:</strong> All listed items are{' '}
              <span className="underline decoration-[#B45309] font-semibold">potential compliances</span> that{' '}
              <span className="underline decoration-[#B45309] font-semibold">may apply based on your business facts</span>,
              turnover, workforce count, and location. We never state that every listed compliance automatically applies to every entity.
            </div>
          </div>

          <p className="text-sm text-[#5C6570] mb-6">{activePack.description}</p>

          <RevealGroup className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activePack.potentialCompliances.map((item, idx) => (
              <Card key={item.title} hover={false} className="p-4 space-y-1.5 bg-[#EBE8E2]/60">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start space-x-2">
                    <span className="w-5 h-5 rounded-full bg-[#E4E0D8] text-[#B89E6B] text-[10px] font-mono font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <h5 className="font-display text-sm font-semibold text-[#0E1217] leading-snug">{item.title}</h5>
                  </div>
                  <span className="text-[10px] font-mono font-semibold text-[#6B7580] bg-[#F4F2EE] border border-[#D5D0C6] px-2 py-0.5 rounded-full shrink-0">
                    {item.regulatoryBody}
                  </span>
                </div>

                <p className="text-xs text-[#5C6570] pl-7 leading-relaxed">{item.description}</p>

                {item.conditionalNote && (
                  <div className="ml-7 text-[11px] font-mono text-[#78350F] bg-[#FEF3C7] border border-[#FDE68A] rounded px-2 py-0.5 font-medium">
                    ⚡ Applicability condition: {item.conditionalNote}
                  </div>
                )}
              </Card>
            ))}
          </RevealGroup>

          <div className="mt-8 pt-6 border-t border-[#D5D0C6] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-[#6B7580] font-mono">
              Includes document checklists, cut-off calendars, and professional review assignments.
            </div>
            <button type="button" onClick={onOpenChecker} className="btn-primary font-mono font-bold text-xs uppercase tracking-wider">
              <span>{activePack.ctaText} &rarr;</span>
            </button>
          </div>
        </Card>
      </Reveal>
    </Section>
  );
}
