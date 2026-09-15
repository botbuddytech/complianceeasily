'use client';

import { useState } from 'react';
import { ArrowRight, Scale } from 'lucide-react';
import { Link } from '@/components/nav/NextNav';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Seo } from '@/components/Seo';
import type { PageSeo } from '@/lib/seo';
import { ComplianceCheckerModal } from '@/components/ComplianceCheckerModal';
import { ProtectionTermsModal } from '@/components/ProtectionTermsModal';
import { Section } from '@/components/ui/Section';
import { Reveal } from '@/components/ui/Reveal';
import { LEGAL_NAV, type LegalDocument } from '@/data/legalDocuments';

interface LegalPageShellProps {
  document: LegalDocument;
  seo: PageSeo;
}

export function LegalPageShell({ document, seo }: LegalPageShellProps) {
  const [isCheckerOpen, setIsCheckerOpen] = useState(false);
  const [isProtectionModalOpen, setIsProtectionModalOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F2EE] text-[#0E1217] font-sans">
      <Seo page={seo} />
      <Navbar onOpenChecker={() => setIsCheckerOpen(true)} />

      <main className="flex-1">
        <Section tone="espresso" withGrid withGlow className="!pt-10 !pb-12 lg:!pt-14 lg:!pb-16">
          <Reveal className="max-w-3xl space-y-4 text-left">
            <div className="glass-pill glass-pill-dark">
              <Scale className="w-3.5 h-3.5 text-[#B89E6B]" />
              <span className="text-[10px] font-mono font-bold tracking-widest uppercase">
                {document.eyebrow}
              </span>
            </div>
            <h1 className="font-display text-[1.75rem] sm:text-4xl lg:text-[2.5rem] font-semibold tracking-tight text-white leading-[1.15]">
              {document.title}
            </h1>
            <p className="text-sm sm:text-base text-[#A8B0BA] leading-relaxed">{document.summary}</p>
            <div className="flex flex-wrap gap-x-4 gap-y-1 font-mono text-[11px] text-[#8B95A1]">
              <span>Effective {document.effectiveDate}</span>
              <span className="text-[#B89E6B]">·</span>
              <span>{document.version}</span>
            </div>
          </Reveal>
        </Section>

        <Section tone="cream" withGrid className="!py-10 sm:!py-14">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            <aside className="lg:col-span-3 lg:sticky lg:top-24 space-y-4">
              <div className="text-[10px] font-mono font-bold uppercase tracking-[0.14em] text-[#6B7580]">
                Legal library
              </div>
              <nav className="flex lg:flex-col gap-1.5 overflow-x-auto lg:overflow-visible pb-1 -mx-1 px-1 scrollbar-none">
                {LEGAL_NAV.map((item) => {
                  const active = item.href === `/${document.slug}`;
                  return (
                    <Link
                      key={item.href}
                      to={item.href}
                      className={`shrink-0 rounded-lg px-3 py-2 text-sm font-medium transition-colors whitespace-nowrap ${
                        active
                          ? 'bg-[#0E1217] text-white'
                          : 'bg-white border border-[#D5D0C6] text-[#5C6570] hover:border-[#B89E6B] hover:text-[#0E1217]'
                      }`}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
              <Link
                to="/contact"
                className="hidden lg:inline-flex items-center gap-1.5 text-xs font-semibold text-[#B89E6B] hover:underline pt-2"
              >
                Questions? Contact us
                <ArrowRight className="w-3 h-3" />
              </Link>
            </aside>

            <article className="lg:col-span-9 min-w-0">
              <div className="rounded-2xl border border-[#D5D0C6] bg-white p-5 sm:p-8 space-y-8 shadow-sm">
                {document.sections.map((section) => (
                  <section key={section.id} id={section.id} className="scroll-mt-28 space-y-3">
                    <h2 className="font-display text-lg sm:text-xl font-semibold tracking-tight text-[#0E1217]">
                      {section.title}
                    </h2>
                    {section.paragraphs?.map((p) => (
                      <p key={p.slice(0, 48)} className="text-sm text-[#5C6570] leading-relaxed">
                        {p}
                      </p>
                    ))}
                    {section.bullets && section.bullets.length > 0 && (
                      <ul className="space-y-1.5 pl-1">
                        {section.bullets.map((b) => (
                          <li
                            key={b.slice(0, 48)}
                            className="flex items-start gap-2 text-sm text-[#5C6570] leading-relaxed"
                          >
                            <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[#B89E6B] shrink-0" />
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </section>
                ))}

                <div className="pt-6 border-t border-[#D5D0C6] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <p className="text-[11px] font-mono text-[#6B7580]">
                    ComplianceEasily · {document.version} · Effective {document.effectiveDate}
                  </p>
                  <Link
                    to="/contact"
                    className="inline-flex items-center justify-center gap-2 text-sm font-semibold text-[#0E1217] hover:text-[#B89E6B] transition-colors"
                  >
                    Contact legal / support desk
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </article>
          </div>
        </Section>
      </main>

      <Footer
        onOpenChecker={() => setIsCheckerOpen(true)}
        onOpenProtectionModal={() => setIsProtectionModalOpen(true)}
      />

      <ComplianceCheckerModal isOpen={isCheckerOpen} onClose={() => setIsCheckerOpen(false)} />
      <ProtectionTermsModal
        isOpen={isProtectionModalOpen}
        onClose={() => setIsProtectionModalOpen(false)}
      />
    </div>
  );
}
