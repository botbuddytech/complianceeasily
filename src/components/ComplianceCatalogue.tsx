import { useState } from 'react';
import {
  Search,
  Calendar,
  Layers,
} from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { COMPLIANCE_SERVICES } from '../data/compliances';
import { COMPLIANCE_CATEGORIES } from '../data/categories';
import { VerifiedBadge, VerifiedBadgeVariant } from './VerifiedBadge';
import { Section } from './ui/Section';
import { SectionHeader } from './ui/SectionHeader';
import { Reveal, RevealGroup } from './ui/Reveal';
import { Card } from './ui/Card';

interface ComplianceCatalogueProps {
  onOpenChecker: () => void;
}

export function ComplianceCatalogue({ onOpenChecker }: ComplianceCatalogueProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const prefersReduced = useReducedMotion();

  const filteredServices = COMPLIANCE_SERVICES.filter((svc) => {
    const matchesCat = selectedCategory === 'all' || svc.category === selectedCategory;
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      svc.name.toLowerCase().includes(term) ||
      svc.description.toLowerCase().includes(term) ||
      svc.department.toLowerCase().includes(term);
    return matchesCat && matchesSearch;
  });

  const getVerifiedVariant = (badge: string): VerifiedBadgeVariant | null => {
    if (badge.startsWith('CA')) return 'ca';
    if (badge.startsWith('CS')) return 'cs';
    if (badge.includes('Advocate')) return 'advocate';
    if (badge.includes('Ind AS')) return 'standards';
    if (badge.includes('Professional')) return 'professional';
    return null;
  };

  const getBadgeStyle = (badge: string) => {
    switch (badge) {
      case 'CA Review':
      case 'CA Required':
      case 'CA Verified':
        return 'bg-[#B89E6B] text-white border-[#8A7349] font-semibold';
      case 'CS Review':
      case 'CS Required':
        return 'bg-[#B89E6B] text-white border-[#B89E6B] font-semibold';
      case 'Advocate Review':
        return 'bg-[#E4E0D8] text-[#B89E6B] border-[#B89E6B] font-semibold';
      case 'AS / Ind AS Aligned':
        return 'bg-[#EBE8E2] text-[#B89E6B] border-[#D5A77B] font-semibold';
      case 'AI Assisted':
        return 'bg-[#EBE8E2] text-[#B89E6B] border-[#D5D0C6] font-medium';
      default:
        return 'bg-[#EBE8E2] text-[#B89E6B] border-[#D5D0C6] font-medium';
    }
  };

  const pillClass = (isActive: boolean) =>
    `relative shrink-0 px-3 sm:px-3.5 py-1.5 rounded-full text-[11px] sm:text-xs font-mono font-bold tracking-wider uppercase transition-colors whitespace-nowrap ${
      isActive
        ? 'text-white'
        : 'bg-[#FFFFFF] border border-[#D5D0C6] text-[#5C6570] hover:bg-[#F4F2EE]'
    }`;

  const renderPill = (id: string, label: string, shortLabel: string | undefined, isActive: boolean) => (
    <button
      key={id}
      type="button"
      onClick={() => setSelectedCategory(id)}
      className={pillClass(isActive)}
    >
      {isActive && !prefersReduced && (
        <motion.span
          layoutId="catalogue-filter-pill"
          className="absolute inset-0 rounded-full bg-[#B89E6B] shadow-2xs"
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        />
      )}
      {isActive && prefersReduced && (
        <span className="absolute inset-0 rounded-full bg-[#B89E6B] shadow-2xs" />
      )}
      <span className="relative z-10">
        <span className="sm:hidden">{shortLabel ?? label}</span>
        <span className="hidden sm:inline">{label}</span>
      </span>
    </button>
  );

  return (
    <Section tone="cream" id="services-catalogue" className="space-y-12">
      <Reveal>
        <SectionHeader
          eyebrow={
            <>
              <Layers className="w-3.5 h-3.5" />
              <span className="text-[10px] font-mono font-bold tracking-wider uppercase">
                STATUTORY COMPLIANCE CATALOGUE
              </span>
            </>
          }
          title={
            <>
              Explore statutory compliances{' '}
              <span className="hidden sm:inline"><br /></span>
              <span className="text-[#B89E6B]">by regulatory department.</span>
            </>
          }
          description="Browse our full registry of Central, State, and municipal filings. Every card displays the required professional review level, frequency, and clear government fee disclosures."
        />
      </Reveal>

      <Reveal delay={0.05}>
        <div className="space-y-4">
          <div className="max-w-xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B7580]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search: GSTR-3B, AOC-4, PF ECR, FSSAI..."
              className="input-elevated w-full pl-12 pr-4 py-3.5 rounded-2xl text-sm text-[#0E1217] font-mono placeholder:text-[#6B7580]"
            />
          </div>

          <div className="-mx-4 sm:mx-0 px-4 sm:px-0 overflow-x-auto scrollbar-none">
            <div className="flex flex-nowrap sm:flex-wrap items-center justify-start sm:justify-center gap-2 pt-2 min-w-min pb-1">
              {renderPill(
                'all',
                `All Departments (${COMPLIANCE_SERVICES.length})`,
                `All (${COMPLIANCE_SERVICES.length})`,
                selectedCategory === 'all'
              )}
              {COMPLIANCE_CATEGORIES.map((cat) =>
                renderPill(cat.id, cat.name, undefined, selectedCategory === cat.id)
              )}
            </div>
          </div>
        </div>
      </Reveal>

      <RevealGroup className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map((svc) => (
          <Card key={svc.id} className="flex flex-col justify-between text-left space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2 min-w-0">
                <div className="flex flex-wrap items-center gap-1.5 min-w-0">
                  <span
                    className={`text-[10px] px-2.5 py-0.5 rounded-full border ${getBadgeStyle(
                      svc.professionalBadge
                    )}`}
                  >
                    {svc.professionalBadge}
                  </span>
                  {getVerifiedVariant(svc.professionalBadge) && (
                    <VerifiedBadge variant={getVerifiedVariant(svc.professionalBadge)!} />
                  )}
                </div>
                <span className="text-[11px] text-[#6B7580] font-medium truncate min-w-0 max-w-[40%] text-right">
                  {svc.department}
                </span>
              </div>

              <div>
                <h3 className="font-display text-base font-semibold text-[#0E1217] tracking-tight leading-snug">
                  {svc.name}
                </h3>
                <div className="flex items-center space-x-1.5 text-xs text-[#B89E6B] font-semibold mt-1 font-mono">
                  <Calendar className="w-3.5 h-3.5 text-[#B89E6B]" />
                  <span>{svc.frequency}</span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-[#5C6570] leading-relaxed">{svc.description}</p>

              <div className="p-3 rounded-xl bg-[#EBE8E2] border border-[#D5D0C6] space-y-1 text-xs font-mono">
                <div className="flex items-center justify-between">
                  <span className="text-[#6B7580] font-medium">Service Fee:</span>
                  <span className="font-bold text-[#0E1217]">{svc.price}</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-[#6B7580] pt-0.5 border-t border-[#D5D0C6]">
                  <span>Govt Statutory Fees:</span>
                  <span className="italic">{svc.governmentFees}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#D5D0C6] flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={onOpenChecker}
                className="text-xs font-mono font-bold uppercase text-[#5C6570] hover:text-[#B89E6B] transition-colors"
              >
                Check If Applicable
              </button>
              <button
                type="button"
                onClick={onOpenChecker}
                className="btn-primary px-3.5 py-1.5 font-mono font-bold text-xs uppercase tracking-wider"
              >
                File With Expert &rarr;
              </button>
            </div>
          </Card>
        ))}
      </RevealGroup>

      <Reveal delay={0.1}>
        <Card hover={false} className="p-4 text-xs text-[#6B7580] text-center max-w-2xl mx-auto font-mono">
          All filings requiring attestation or legal certification are handled exclusively by
          registered CAs (ICAI), CSs (ICSI), and Advocates.
        </Card>
      </Reveal>
    </Section>
  );
}
