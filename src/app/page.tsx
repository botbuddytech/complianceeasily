'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { ProofOfWorkSection } from '@/components/ProofOfWorkSection';
import { TrustStrip } from '@/components/TrustStrip';
import { WhatsAppRadarSection } from '@/components/WhatsAppRadarSection';
import { Footer } from '@/components/Footer';
import { SectionPlaceholder } from '@/components/ui/SectionPlaceholder';

const BeyondComplianceSection = dynamic(
  () =>
    import('@/components/BeyondComplianceSection').then((m) => ({
      default: m.BeyondComplianceSection,
    })),
  { loading: () => <SectionPlaceholder /> },
);
const CustomerStoriesSection = dynamic(
  () =>
    import('@/components/CustomerStoriesSection').then((m) => ({
      default: m.CustomerStoriesSection,
    })),
  { loading: () => <SectionPlaceholder /> },
);
const HumanProfessionalsSection = dynamic(
  () =>
    import('@/components/HumanProfessionalsSection').then((m) => ({
      default: m.HumanProfessionalsSection,
    })),
  { loading: () => <SectionPlaceholder /> },
);
const ProfessionalAccountingSection = dynamic(
  () =>
    import('@/components/ProfessionalAccountingSection').then((m) => ({
      default: m.ProfessionalAccountingSection,
    })),
  { loading: () => <SectionPlaceholder /> },
);
const CompliancePassportSection = dynamic(
  () =>
    import('@/components/CompliancePassportSection').then((m) => ({
      default: m.CompliancePassportSection,
    })),
  { loading: () => <SectionPlaceholder /> },
);
const IndustryComplianceSection = dynamic(
  () =>
    import('@/components/IndustryComplianceSection').then((m) => ({
      default: m.IndustryComplianceSection,
    })),
  { loading: () => <SectionPlaceholder /> },
);
const BusinessGrowthSection = dynamic(
  () =>
    import('@/components/BusinessGrowthSection').then((m) => ({
      default: m.BusinessGrowthSection,
    })),
  { loading: () => <SectionPlaceholder /> },
);
const AIAgentsSection = dynamic(
  () =>
    import('@/components/AIAgentsSection').then((m) => ({ default: m.AIAgentsSection })),
  { loading: () => <SectionPlaceholder /> },
);
const ProfessionalWorkflowSection = dynamic(
  () =>
    import('@/components/ProfessionalWorkflowSection').then((m) => ({
      default: m.ProfessionalWorkflowSection,
    })),
  { loading: () => <SectionPlaceholder /> },
);
const ProtectionGuaranteeSection = dynamic(
  () =>
    import('@/components/ProtectionGuaranteeSection').then((m) => ({
      default: m.ProtectionGuaranteeSection,
    })),
  { loading: () => <SectionPlaceholder /> },
);
const RiskPenaltyExplorer = dynamic(
  () =>
    import('@/components/RiskPenaltyExplorer').then((m) => ({ default: m.RiskPenaltyExplorer })),
  { loading: () => <SectionPlaceholder /> },
);
const ComplianceCatalogue = dynamic(
  () =>
    import('@/components/ComplianceCatalogue').then((m) => ({ default: m.ComplianceCatalogue })),
  { loading: () => <SectionPlaceholder /> },
);
const StateComplianceExplorer = dynamic(
  () =>
    import('@/components/StateComplianceExplorer').then((m) => ({
      default: m.StateComplianceExplorer,
    })),
  { loading: () => <SectionPlaceholder /> },
);
const AnnualPackageExplorer = dynamic(
  () =>
    import('@/components/AnnualPackageExplorer').then((m) => ({
      default: m.AnnualPackageExplorer,
    })),
  { loading: () => <SectionPlaceholder /> },
);
const PricingSection = dynamic(
  () => import('@/components/PricingSection').then((m) => ({ default: m.PricingSection })),
  { loading: () => <SectionPlaceholder /> },
);
const ProfessionalNetworkSection = dynamic(
  () =>
    import('@/components/ProfessionalNetworkSection').then((m) => ({
      default: m.ProfessionalNetworkSection,
    })),
  { loading: () => <SectionPlaceholder /> },
);
const EcosystemSection = dynamic(
  () => import('@/components/EcosystemSection').then((m) => ({ default: m.EcosystemSection })),
  { loading: () => <SectionPlaceholder /> },
);
const FAQSection = dynamic(
  () => import('@/components/FAQSection').then((m) => ({ default: m.FAQSection })),
  { loading: () => <SectionPlaceholder /> },
);
const FinalTrustSection = dynamic(
  () =>
    import('@/components/FinalTrustSection').then((m) => ({ default: m.FinalTrustSection })),
  { loading: () => <SectionPlaceholder /> },
);
const ComplianceCheckerModal = dynamic(
  () =>
    import('@/components/ComplianceCheckerModal').then((m) => ({
      default: m.ComplianceCheckerModal,
    })),
  { ssr: false },
);
const ProtectionTermsModal = dynamic(
  () =>
    import('@/components/ProtectionTermsModal').then((m) => ({
      default: m.ProtectionTermsModal,
    })),
  { ssr: false },
);

export default function LandingPage() {
  const [isCheckerOpen, setIsCheckerOpen] = useState(false);
  const [isProtectionModalOpen, setIsProtectionModalOpen] = useState(false);

  const handleOpenChecker = () => setIsCheckerOpen(true);
  const handleCloseChecker = () => setIsCheckerOpen(false);
  const handleOpenProtection = () => setIsProtectionModalOpen(true);
  const handleCloseProtection = () => setIsProtectionModalOpen(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F2EE] text-[#0E1217] selection:bg-[#D5D0C6] selection:text-[#0E1217] font-sans">
      <Navbar onOpenChecker={handleOpenChecker} />

      <main className="flex-1">
        <WhatsAppRadarSection
          onOpenChecker={handleOpenChecker}
          onOpenProtectionModal={handleOpenProtection}
        />
        <Hero onOpenChecker={handleOpenChecker} onOpenProtectionModal={handleOpenProtection} />
        <ProofOfWorkSection />
        <TrustStrip />
        <BeyondComplianceSection onOpenChecker={handleOpenChecker} />
        <CustomerStoriesSection />
        <HumanProfessionalsSection onOpenChecker={handleOpenChecker} />
        <ProfessionalAccountingSection onOpenChecker={handleOpenChecker} />
        <CompliancePassportSection onOpenChecker={handleOpenChecker} />
        <IndustryComplianceSection onOpenChecker={handleOpenChecker} />
        <BusinessGrowthSection onOpenChecker={handleOpenChecker} />
        <AIAgentsSection onOpenChecker={handleOpenChecker} />
        <ProfessionalWorkflowSection onOpenChecker={handleOpenChecker} />
        <ProtectionGuaranteeSection
          onOpenChecker={handleOpenChecker}
          onOpenProtectionModal={handleOpenProtection}
        />
        <RiskPenaltyExplorer onOpenChecker={handleOpenChecker} />
        <ComplianceCatalogue onOpenChecker={handleOpenChecker} />
        <StateComplianceExplorer onOpenChecker={handleOpenChecker} />
        <AnnualPackageExplorer onOpenChecker={handleOpenChecker} />
        <PricingSection
          onOpenChecker={handleOpenChecker}
          onOpenProtectionModal={handleOpenProtection}
        />
        <ProfessionalNetworkSection onOpenChecker={handleOpenChecker} />
        <EcosystemSection />
        <FAQSection onOpenChecker={handleOpenChecker} />
        <FinalTrustSection onOpenChecker={handleOpenChecker} />
      </main>

      <Footer onOpenChecker={handleOpenChecker} onOpenProtectionModal={handleOpenProtection} />

      {isCheckerOpen && (
        <ComplianceCheckerModal isOpen={isCheckerOpen} onClose={handleCloseChecker} />
      )}
      {isProtectionModalOpen && (
        <ProtectionTermsModal isOpen={isProtectionModalOpen} onClose={handleCloseProtection} />
      )}
    </div>
  );
}
