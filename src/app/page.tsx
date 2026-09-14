'use client';

import { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { TrustStrip } from '@/components/TrustStrip';
import { BeyondComplianceSection } from '@/components/BeyondComplianceSection';
import { HumanProfessionalsSection } from '@/components/HumanProfessionalsSection';
import { ProfessionalAccountingSection } from '@/components/ProfessionalAccountingSection';
import { WhatsAppRadarSection } from '@/components/WhatsAppRadarSection';
import { CompliancePassportSection } from '@/components/CompliancePassportSection';
import { IndustryComplianceSection } from '@/components/IndustryComplianceSection';
import { BusinessGrowthSection } from '@/components/BusinessGrowthSection';
import { AIAgentsSection } from '@/components/AIAgentsSection';
import { ProfessionalWorkflowSection } from '@/components/ProfessionalWorkflowSection';
import { ProtectionGuaranteeSection } from '@/components/ProtectionGuaranteeSection';
import { RiskPenaltyExplorer } from '@/components/RiskPenaltyExplorer';
import { ComplianceCatalogue } from '@/components/ComplianceCatalogue';
import { StateComplianceExplorer } from '@/components/StateComplianceExplorer';
import { AnnualPackageExplorer } from '@/components/AnnualPackageExplorer';
import { PricingSection } from '@/components/PricingSection';
import { ProfessionalNetworkSection } from '@/components/ProfessionalNetworkSection';
import { EcosystemSection } from '@/components/EcosystemSection';
import { FAQSection } from '@/components/FAQSection';
import { FinalTrustSection } from '@/components/FinalTrustSection';
import { Footer } from '@/components/Footer';
import { ComplianceCheckerModal } from '@/components/ComplianceCheckerModal';
import { ProtectionTermsModal } from '@/components/ProtectionTermsModal';

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
        <TrustStrip />
        <BeyondComplianceSection onOpenChecker={handleOpenChecker} />
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

      <ComplianceCheckerModal isOpen={isCheckerOpen} onClose={handleCloseChecker} />
      <ProtectionTermsModal isOpen={isProtectionModalOpen} onClose={handleCloseProtection} />
    </div>
  );
}
