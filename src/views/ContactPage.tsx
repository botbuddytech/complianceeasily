'use client';

import { FormEvent, useState } from 'react';
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Clock3,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  PhoneCall,
  Scale,
  Send,
} from 'lucide-react';
import { Link } from '@/components/nav/NextNav';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Seo } from '@/components/Seo';
import { CONTACT_SEO, SITE } from '@/lib/seo';
import { ComplianceCheckerModal } from '@/components/ComplianceCheckerModal';
import { ProtectionTermsModal } from '@/components/ProtectionTermsModal';
import { Section } from '@/components/ui/Section';
import { Card } from '@/components/ui/Card';
import { Reveal, RevealGroup } from '@/components/ui/Reveal';

const SUBJECTS = [
  'General enquiry',
  'Sales & pricing',
  'Onboarding support',
  'Professional network (CA / CS / Advocate)',
  'Protection guarantee claim',
  'Partnership / bank / vendor',
  'Press & media',
] as const;

const CHANNELS = [
  {
    icon: MessageSquare,
    title: 'WhatsApp desk',
    detail: '+91 98765 43210',
    hint: 'Fastest for filing & deadline questions',
    href: 'https://wa.me/919876543210',
  },
  {
    icon: Mail,
    title: 'Email',
    detail: SITE.supportEmail,
    hint: 'We reply within one business day',
    href: `mailto:${SITE.supportEmail}`,
  },
  {
    icon: Phone,
    title: 'Phone',
    detail: '+91 33 4000 1200',
    hint: 'Mon–Sat · 10:00–19:00 IST',
    href: 'tel:+913340001200',
  },
] as const;

export function ContactPage() {
  const [isCheckerOpen, setIsCheckerOpen] = useState(false);
  const [isProtectionModalOpen, setIsProtectionModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState<(typeof SUBJECTS)[number]>('General enquiry');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    window.setTimeout(() => {
      setSubmitting(false);
      setSent(true);
    }, 700);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F2EE] text-[#0E1217] font-sans">
      <Seo page={CONTACT_SEO} />
      <Navbar onOpenChecker={() => setIsCheckerOpen(true)} />

      <main className="flex-1">
        <Section tone="espresso" withGrid withGlow className="!pt-10 !pb-14 lg:!pt-16 lg:!pb-20">
          <Reveal className="max-w-3xl space-y-4 text-left">
            <div className="glass-pill glass-pill-dark">
              <Scale className="w-3.5 h-3.5 text-[#B89E6B]" />
              <span className="text-[10px] font-mono font-bold tracking-widest uppercase">
                Contact us
              </span>
            </div>
            <h1 className="font-display text-[1.75rem] sm:text-4xl lg:text-[2.75rem] font-semibold tracking-tight text-white leading-[1.15]">
              Talk to ComplianceEasily.{' '}
              <span className="text-[#B89E6B] italic">We respond with accountability.</span>
            </h1>
            <p className="text-sm sm:text-base text-[#A8B0BA] leading-relaxed max-w-2xl">
              Sales, onboarding, practitioner network, or a guarantee query — write to us and a
              human operator will route your request. For urgent deadlines, WhatsApp is fastest.
            </p>
          </Reveal>
        </Section>

        <Section tone="cream" withGrid className="!py-12 sm:!py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            <Reveal className="lg:col-span-5 space-y-5">
              <RevealGroup className="space-y-3" stagger={0.06}>
                {CHANNELS.map((channel) => {
                  const Icon = channel.icon;
                  return (
                    <a
                      key={channel.title}
                      href={channel.href}
                      target={channel.href.startsWith('http') ? '_blank' : undefined}
                      rel={channel.href.startsWith('http') ? 'noreferrer' : undefined}
                      className="flex items-start gap-3 rounded-2xl border border-[#D5D0C6] bg-white p-4 hover:border-[#B89E6B] transition-colors"
                    >
                      <div className="w-10 h-10 rounded-xl bg-[#EBE8E2] border border-[#D5D0C6] flex items-center justify-center text-[#B89E6B] shrink-0">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#6B7580]">
                          {channel.title}
                        </div>
                        <div className="font-semibold text-[#0E1217] mt-0.5">{channel.detail}</div>
                        <div className="text-xs text-[#5C6570] mt-0.5">{channel.hint}</div>
                      </div>
                    </a>
                  );
                })}
              </RevealGroup>

              <Card hover={false} className="p-5 space-y-3">
                <div className="flex items-center gap-2 text-[#B89E6B]">
                  <Building2 className="w-4 h-4" />
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider">
                    Registered office
                  </span>
                </div>
                <p className="text-sm text-[#0E1217] leading-relaxed">
                  ComplianceEasily
                  <br />
                  Kolkata, West Bengal, India
                </p>
                <div className="flex items-start gap-2 text-xs text-[#5C6570]">
                  <MapPin className="w-3.5 h-3.5 text-[#B89E6B] shrink-0 mt-0.5" />
                  <span>Serving Central, State and municipal compliances across India.</span>
                </div>
                <div className="flex items-start gap-2 text-xs text-[#5C6570]">
                  <Clock3 className="w-3.5 h-3.5 text-[#B89E6B] shrink-0 mt-0.5" />
                  <span>Support hours: Monday–Saturday, 10:00–19:00 IST</span>
                </div>
              </Card>

              <div className="rounded-2xl border border-[#D5D0C6] bg-[#EBE8E2]/70 p-4 text-xs text-[#5C6570] leading-relaxed">
                <strong className="text-[#0E1217] font-semibold">Legal note:</strong> ComplianceEasily
                is a technology coordination platform. Statutory advice, certifications and filings
                are rendered by independent practising CAs, CSs and Advocates.
              </div>
            </Reveal>

            <Reveal delay={0.08} className="lg:col-span-7">
              <Card hover={false} className="p-5 sm:p-7">
                {sent ? (
                  <div className="py-10 sm:py-14 text-center space-y-4">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EBE8E2] border border-[#D5D0C6] text-[#B89E6B]">
                      <CheckCircle2 className="w-7 h-7" />
                    </div>
                    <h2 className="font-display text-2xl font-semibold text-[#0E1217] tracking-tight">
                      Message received.
                    </h2>
                    <p className="text-sm text-[#5C6570] max-w-md mx-auto leading-relaxed">
                      Thank you, {name.trim() || 'there'}. Our desk will respond to{' '}
                      <span className="font-semibold text-[#0E1217]">{email || 'your inbox'}</span>{' '}
                      within one business day. For urgent filings, use WhatsApp.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setSent(false);
                          setMessage('');
                        }}
                        className="btn-primary"
                      >
                        Send another message
                      </button>
                      <Link
                        to="/"
                        className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg border border-[#D5D0C6] bg-white text-sm font-semibold text-[#0E1217] hover:bg-[#EBE8E2] transition-colors"
                      >
                        Back to home
                      </Link>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-1.5">
                      <h2 className="font-display text-xl sm:text-2xl font-semibold text-[#0E1217] tracking-tight">
                        Write to our desk
                      </h2>
                      <p className="text-sm text-[#5C6570]">
                        Fields marked required help us route your request to the right operator.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <label className="block space-y-1.5">
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#6B7580]">
                          Full name *
                        </span>
                        <input
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="input-elevated w-full px-3.5 py-2.5 rounded-xl text-sm"
                          placeholder="Your name"
                          autoComplete="name"
                        />
                      </label>
                      <label className="block space-y-1.5">
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#6B7580]">
                          Work email *
                        </span>
                        <input
                          required
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="input-elevated w-full px-3.5 py-2.5 rounded-xl text-sm"
                          placeholder="you@company.com"
                          autoComplete="email"
                        />
                      </label>
                      <label className="block space-y-1.5">
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#6B7580]">
                          Phone / WhatsApp
                        </span>
                        <input
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="input-elevated w-full px-3.5 py-2.5 rounded-xl text-sm"
                          placeholder="+91 …"
                          autoComplete="tel"
                        />
                      </label>
                      <label className="block space-y-1.5">
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#6B7580]">
                          Subject *
                        </span>
                        <select
                          required
                          value={subject}
                          onChange={(e) => setSubject(e.target.value as (typeof SUBJECTS)[number])}
                          className="input-elevated w-full px-3.5 py-2.5 rounded-xl text-sm"
                        >
                          {SUBJECTS.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </label>
                    </div>

                    <label className="block space-y-1.5">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#6B7580]">
                        Message *
                      </span>
                      <textarea
                        required
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        rows={6}
                        className="input-elevated w-full px-3.5 py-3 rounded-xl text-sm resize-y min-h-[140px]"
                        placeholder="Tell us about your entity, jurisdiction, and what you need help with…"
                      />
                    </label>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                      <p className="text-[11px] text-[#6B7580] leading-relaxed max-w-sm">
                        By submitting, you agree we may contact you about this enquiry. No spam —
                        only operational follow-ups.
                      </p>
                      <button
                        type="submit"
                        disabled={submitting}
                        className="btn-primary shrink-0 disabled:opacity-60"
                      >
                        {submitting ? (
                          <span>Sending…</span>
                        ) : (
                          <>
                            <Send className="w-3.5 h-3.5" />
                            <span>Send message</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </Card>

              <div className="mt-4 flex flex-col sm:flex-row gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsCheckerOpen(true)}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-[#0E1217] text-white text-sm font-semibold hover:bg-[#1E2630] transition-colors"
                >
                  <PhoneCall className="w-4 h-4 text-[#B89E6B]" />
                  Check my compliance — Free
                </button>
                <a
                  href="https://wa.me/919876543210"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg border border-[#D5D0C6] bg-white text-sm font-semibold text-[#0E1217] hover:bg-[#EBE8E2] transition-colors"
                >
                  <MessageSquare className="w-4 h-4 text-[#B89E6B]" />
                  Chat on WhatsApp
                </a>
              </div>
            </Reveal>
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
