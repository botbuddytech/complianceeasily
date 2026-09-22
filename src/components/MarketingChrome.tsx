'use client';

import { useState, type ReactNode } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ComplianceCheckerModal } from '@/components/ComplianceCheckerModal';
import { ProtectionTermsModal } from '@/components/ProtectionTermsModal';

export function MarketingChrome({ children }: { children: ReactNode }) {
  const [isCheckerOpen, setIsCheckerOpen] = useState(false);
  const [isProtectionModalOpen, setIsProtectionModalOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F2EE] text-[#0E1217] font-sans">
      <Navbar onOpenChecker={() => setIsCheckerOpen(true)} />
      <main className="flex-1">{children}</main>
      <Footer
        onOpenChecker={() => setIsCheckerOpen(true)}
        onOpenProtectionModal={() => setIsProtectionModalOpen(true)}
      />
      {isCheckerOpen && (
        <ComplianceCheckerModal isOpen={isCheckerOpen} onClose={() => setIsCheckerOpen(false)} />
      )}
      {isProtectionModalOpen && (
        <ProtectionTermsModal
          isOpen={isProtectionModalOpen}
          onClose={() => setIsProtectionModalOpen(false)}
        />
      )}
    </div>
  );
}
