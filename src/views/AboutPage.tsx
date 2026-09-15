'use client';

import { useState } from 'react';
import {
  ArrowRight,
  BadgeCheck,
  Bot,
  Building2,
  MessageSquare,
  Scale,
  ShieldCheck,
  Sparkles,
  Users,
} from 'lucide-react';
import { Link } from '@/components/nav/NextNav';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Seo } from '@/components/Seo';
import { ABOUT_SEO } from '@/lib/seo';
import { ComplianceCheckerModal } from '@/components/ComplianceCheckerModal';
import { ProtectionTermsModal } from '@/components/ProtectionTermsModal';
import { Section } from '@/components/ui/Section';
import { Card } from '@/components/ui/Card';
import { Reveal, RevealGroup } from '@/components/ui/Reveal';

const PILLARS = [
  {
    icon: Bot,
    title: 'AI for the busywork',
    body: 'Statutory calendars, document intake, reconciliations and first-level checks run continuously — so deadlines never depend on memory alone.',
  },
  {
    icon: BadgeCheck,
    title: 'Professionals for sign-off',
    body: 'Practising CAs, CSs and Advocates review, certify and file. Regulated work stays with regulated people — never fully automated.',
  },
  {
    icon: MessageSquare,
    title: 'WhatsApp-first clarity',
    body: 'Free due-date reminders and status updates on the channel Indian businesses already use every day.',
  },
  {
    icon: ShieldCheck,
    title: 'Accountable by design',
    body: 'Itemized fees, audit trails, and a Compliance Protection Guarantee so responsibility is never opaque.',
  },
] as const;

const STATS = [
  { value: '10,000+', label: 'Filings completed' },
  { value: '10,000+', label: 'Clients served' },
  { value: '₹1 Cr+', label: 'Penalties avoided' },
  { value: '0.01%', label: 'Error rate' },
] as const;

const PRINCIPLES = [
  {
    title: 'Technology when it accelerates',
    body: 'We automate monitoring, intake and draft prep — never the final legal certification.',
  },
  {
    title: 'Professionals when it matters',
    body: 'ICAI, ICSI and Bar Council practitioners own review, DSC filings and representation.',
  },
  {
    title: 'Transparent economics',
    body: 'Government challans pass through without markup. You see what you pay, and why.',
  },
] as const;

export function AboutPage() {
  const [isCheckerOpen, setIsCheckerOpen] = useState(false);
  const [isProtectionModalOpen, setIsProtectionModalOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F2EE] text-[#0E1217] font-sans">
      <Seo page={ABOUT_SEO} />
      <Navbar onOpenChecker={() => setIsCheckerOpen(true)} />

      <main className="flex-1">
        <Section tone="espresso" withGrid withGlow className="!pt-10 !pb-14 lg:!pt-16 lg:!pb-20">
          <Reveal className="max-w-3xl space-y-4 text-left">
            <div className="glass-pill glass-pill-dark">
              <Sparkles className="w-3.5 h-3.5 text-[#B89E6B]" />
              <span className="text-[10px] font-mono font-bold tracking-widest uppercase">
                About us
              </span>
            </div>
            <h1 className="font-display text-[1.75rem] sm:text-4xl lg:text-[2.75rem] font-semibold tracking-tight text-white leading-[1.15]">
              Built for Indian businesses that cannot afford a missed deadline.{' '}
              <span className="text-[#B89E6B] italic">Or an opaque consultant.</span>
            </h1>
            <p className="text-sm sm:text-base text-[#A8B0BA] leading-relaxed max-w-2xl">
              ComplianceEasily is the operating layer between autonomous AI monitoring and
              regulated professional accountability — so founders stay compliant without living
              inside GSTN, MCA and labour portals.
            </p>
          </Reveal>
        </Section>

        <Section tone="cream" withGrid className="!py-12 sm:!py-16 space-y-12 sm:space-y-16">
          <Reveal className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            <div className="lg:col-span-5 space-y-3">
              <div className="text-[11px] font-mono font-bold uppercase tracking-[0.14em] text-[#B89E6B]">
                Our mission
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-semibold tracking-tight text-[#0E1217] leading-tight">
                Make statutory compliance as reliable as a bank ledger.
              </h2>
            </div>
            <div className="lg:col-span-7 space-y-4 text-sm sm:text-base text-[#5C6570] leading-relaxed">
              <p>
                Indian entities face a maze of Central, State and municipal obligations — GST, MCA,
                TDS, EPFO, ESIC, shops &amp; establishment, FSSAI and more. Miss one, and penalties
                compound.
              </p>
              <p>
                We built ComplianceEasily so every business — from a single-GST shop to a multi-state
                group — can see what applies, get reminded in time, keep books to standards, and file
                with a practising professional one call away.
              </p>
            </div>
          </Reveal>

          <RevealGroup className="grid grid-cols-1 sm:grid-cols-2 gap-4" stagger={0.06}>
            {PILLARS.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <Card key={pillar.title} className="p-5 space-y-3 text-left">
                  <div className="w-10 h-10 rounded-xl bg-[#EBE8E2] border border-[#D5D0C6] flex items-center justify-center text-[#B89E6B]">
                    <Icon className="w-4 h-4" strokeWidth={2.1} />
                  </div>
                  <h3 className="font-display text-base font-semibold text-[#0E1217] tracking-tight">
                    {pillar.title}
                  </h3>
                  <p className="text-sm text-[#5C6570] leading-relaxed">{pillar.body}</p>
                </Card>
              );
            })}
          </RevealGroup>
        </Section>

        <Section tone="sand" withGrid className="!py-12 sm:!py-14">
          <Reveal className="text-center space-y-3 max-w-2xl mx-auto mb-8 sm:mb-10">
            <div className="text-[11px] font-mono font-bold uppercase tracking-[0.14em] text-[#6B7580]">
              Proof of work
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-semibold tracking-tight text-[#0E1217]">
              Numbers that back the accountability.
            </h2>
          </Reveal>
          <RevealGroup
            className="grid grid-cols-2 lg:grid-cols-4 gap-px rounded-2xl overflow-hidden border border-[#D5D0C6] bg-[#D5D0C6]"
            stagger={0.05}
          >
            {STATS.map((stat) => (
              <div
                key={stat.label}
                className="bg-[#F4F2EE] px-4 py-6 sm:px-6 sm:py-8 text-center space-y-1"
              >
                <div className="font-display text-2xl sm:text-3xl font-semibold text-[#0E1217] tabular-nums">
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm font-semibold text-[#5C6570]">{stat.label}</div>
              </div>
            ))}
          </RevealGroup>
        </Section>

        <Section tone="espresso" withGrid withGlow className="!py-12 sm:!py-16 space-y-10">
          <Reveal className="max-w-2xl space-y-3">
            <div className="glass-pill glass-pill-dark">
              <Scale className="w-3.5 h-3.5 text-[#B89E6B]" />
              <span className="text-[10px] font-mono font-bold tracking-widest uppercase">
                How we work
              </span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-semibold tracking-tight text-white leading-tight">
              Three principles. No shortcuts on regulated work.
            </h2>
          </Reveal>

          <RevealGroup className="grid grid-cols-1 md:grid-cols-3 gap-4" stagger={0.07}>
            {PRINCIPLES.map((item, i) => (
              <Card key={item.title} className="p-5 space-y-3 text-left">
                <div className="text-[10px] font-mono font-bold text-[#B89E6B] uppercase tracking-wider">
                  0{i + 1}
                </div>
                <h3 className="font-display text-base font-semibold text-[#0E1217] tracking-tight">
                  {item.title}
                </h3>
                <p className="text-sm text-[#5C6570] leading-relaxed">{item.body}</p>
              </Card>
            ))}
          </RevealGroup>

          <Reveal delay={0.1}>
            <Card hover={false} className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex items-start gap-3 min-w-0 flex-1">
                <div className="w-10 h-10 rounded-xl bg-[#EBE8E2] border border-[#D5D0C6] flex items-center justify-center text-[#B89E6B] shrink-0">
                  <Users className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-display text-base font-semibold text-[#0E1217] tracking-tight">
                    Part of the Easily platform ecosystem
                  </h3>
                  <p className="text-sm text-[#5C6570] mt-1 leading-relaxed">
                    Alongside ContractEasily and FindCasesEasily — specialised tools for Indian
                    founders, CAs and advocates.
                  </p>
                </div>
              </div>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg border border-[#D5D0C6] bg-white text-sm font-semibold text-[#0E1217] hover:bg-[#EBE8E2] transition-colors shrink-0"
              >
                Talk to us
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </Card>
          </Reveal>
        </Section>

        <Section tone="cream" withGrid className="!py-12 sm:!py-16">
          <Reveal className="rounded-2xl border border-[#D5D0C6] bg-white p-6 sm:p-10 text-center space-y-5 max-w-3xl mx-auto">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0E1217] text-[#B89E6B]">
              <Building2 className="w-5 h-5" />
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-semibold tracking-tight text-[#0E1217]">
              Ready to map your statutory perimeter?
            </h2>
            <p className="text-sm text-[#5C6570] leading-relaxed max-w-xl mx-auto">
              Free for one entity forever. Takes about two minutes. No credit card.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => setIsCheckerOpen(true)}
                className="btn-primary w-full sm:w-auto"
              >
                Check my business compliance
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <Link
                to="/contact"
                className="inline-flex w-full sm:w-auto items-center justify-center gap-2 px-5 py-3 rounded-lg border border-[#D5D0C6] bg-[#EBE8E2] text-sm font-semibold text-[#0E1217] hover:bg-[#D5D0C6] transition-colors"
              >
                Contact the desk
              </Link>
            </div>
          </Reveal>
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
