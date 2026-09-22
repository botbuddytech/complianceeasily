'use client';

import { useState, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { Link } from '@/components/nav/NextNav';
import { BrandMark } from '@/components/BrandMark';
import {
  Menu,
  X,
  ChevronDown,
  ArrowRight,
  ExternalLink,
  PhoneCall,
  BookOpenCheck,
  ShieldCheck,
  Briefcase,
  AlertTriangle,
  IndianRupee,
  FileText,
  Search,
  Scale,
  LogIn,
  UserPlus,
} from 'lucide-react';
import { motion, AnimatePresence, LayoutGroup } from 'motion/react';

interface NavbarProps {
  onOpenChecker: () => void;
}

const PRIMARY_LINKS = [
  { href: '#professional-accounting', id: 'professional-accounting', label: 'Books', icon: BookOpenCheck },
  { href: '#compliance-passport', id: 'compliance-passport', label: 'Passport', icon: ShieldCheck },
  { href: '#services-catalogue', id: 'services-catalogue', label: 'Services', icon: Briefcase },
  { href: '#risk-explorer', id: 'risk-explorer', label: 'Risks', icon: AlertTriangle },
  { href: '#pricing', id: 'pricing', label: 'Pricing', icon: IndianRupee },
] as const;

const MORE_LINKS = [
  { href: '#beyond-compliance', label: 'Insights & growth deals' },
  { href: '#annual-package', label: 'Annual package calculator' },
  { href: '#industries', label: 'Industry packs' },
  { href: '#for-professionals', label: 'For CAs, CSs & advocates' },
  { href: '#faq', label: 'FAQs' },
  { href: '#whatsapp-radar', label: 'WhatsApp radar' },
  { href: '/about', label: 'About us' },
  { href: '/contact', label: 'Contact us' },
  { href: '/blog', label: 'Blog' },
  { href: '/terms', label: 'Terms & Conditions' },
  { href: '/privacy', label: 'Privacy Policy' },
  { href: '/protection-guarantee', label: 'Protection Guarantee' },
] as const;

const MOBILE_LINKS = [
  { href: '#professional-accounting', label: 'Professional accounting', group: 'Product' },
  { href: '#beyond-compliance', label: 'Insights & growth deals', group: 'Product' },
  { href: '#compliance-passport', label: 'Compliance passport', group: 'Product' },
  { href: '#industries', label: 'Industry packs', group: 'Product' },
  { href: '#services-catalogue', label: 'Statutory services', group: 'Product' },
  { href: '#annual-package', label: 'Annual package calculator', group: 'Product' },
  { href: '#risk-explorer', label: 'Risks & penalties', group: 'Product' },
  { href: '#pricing', label: 'Transparent pricing', group: 'Product' },
  { href: '#for-professionals', label: 'For CAs, CSs & lawyers', group: 'Network' },
  { href: '#faq', label: 'FAQs', group: 'Network' },
  { href: '/about', label: 'About us', group: 'Network' },
  { href: '/contact', label: 'Contact us', group: 'Network' },
  { href: '/blog', label: 'Blog', group: 'Network' },
  { href: '/terms', label: 'Terms & Conditions', group: 'Legal' },
  { href: '/privacy', label: 'Privacy Policy', group: 'Legal' },
  { href: '/refund-policy', label: 'Refund Policy', group: 'Legal' },
  { href: '/confidentiality', label: 'Confidentiality', group: 'Legal' },
  { href: '/disclaimer', label: 'Disclaimer', group: 'Legal' },
  { href: '/protection-guarantee', label: 'Protection Guarantee', group: 'Legal' },
] as const;

const SUITE = [
  {
    name: 'ContractEasily',
    desc: 'AI contract drafting & review',
    url: 'https://www.contracteasily.com',
    icon: FileText,
    external: true,
    status: 'Live' as const,
  },
  {
    name: 'FindCasesEasily',
    desc: 'Judgments & case intelligence',
    url: 'https://findcaseseasily.com',
    icon: Search,
    external: true,
    status: 'Live' as const,
  },
  {
    name: 'ComplianceEasily',
    desc: 'Business compliance & WhatsApp radar',
    url: '#',
    icon: ShieldCheck,
    external: false,
    status: 'Current' as const,
  },
  {
    name: 'LitigationEasily',
    desc: 'Disputes & court workflow',
    url: '#',
    icon: Scale,
    external: false,
    status: 'Soon' as const,
  },
];

export function Navbar({ onOpenChecker }: NavbarProps) {
  const pathname = usePathname();
  const blogActive = pathname === '/blog' || pathname.startsWith('/blog/');
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [suiteOpen, setSuiteOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    const sectionIds = [
      'professional-accounting',
      'compliance-passport',
      'services-catalogue',
      'risk-explorer',
      'pricing',
      'industries',
      'for-professionals',
    ];
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]?.target?.id) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: '-20% 0px -55% 0px', threshold: [0, 0.25, 0.5] }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const closeMobile = useCallback(() => setMobileMenuOpen(false), []);

  return (
    <header className="sticky top-0 z-50">
      <div
        className={`transition-all duration-300 border-b ${
          isScrolled
            ? 'bg-[#0E1217]/92 backdrop-blur-xl border-[#1E2630] shadow-[0_8px_32px_-12px_rgba(0,0,0,0.45)]'
            : 'bg-[#0E1217]/70 backdrop-blur-md border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className={`flex items-center justify-between gap-4 transition-[height] duration-300 ${
              isScrolled ? 'h-14' : 'h-16 sm:h-[4.25rem]'
            }`}
          >
            {/* Brand — full wordmark, never truncate mid-name */}
            <Link
              to="/"
              aria-label="ComplianceEasily home"
              className="flex items-center gap-2 sm:gap-2.5 group shrink-0"
            >
              <div className="relative shrink-0 group-hover:scale-105 transition-transform duration-200">
                <BrandMark size="sm" priority />
              </div>
              <div className="flex flex-col">
                <span className="font-display text-[15px] sm:text-xl font-semibold tracking-tight text-white whitespace-nowrap leading-none">
                  Compliance<span className="text-[#B89E6B]">Easily</span>
                </span>
                <span
                  className={`hidden sm:block text-[11px] text-[#A8B0BA] tracking-tight whitespace-nowrap transition-all duration-300 overflow-hidden ${
                    isScrolled ? 'max-h-0 opacity-0 mt-0' : 'max-h-5 opacity-100 mt-1'
                  }`}
                >
                  AI speed · Professional accountability
                </span>
              </div>
            </Link>

            {/* Desktop nav */}
            <LayoutGroup id="nav-active">
              <nav className="hidden lg:flex items-center gap-0.5 rounded-full bg-white/5 border border-white/10 p-1">
                {PRIMARY_LINKS.map((link) => {
                  const active = activeId === link.id;
                  return (
                    <a
                      key={link.href}
                      href={link.href}
                      className={`relative px-3.5 py-1.5 text-[13px] font-medium rounded-full transition-colors ${
                        active ? 'text-[#0E1217]' : 'text-[#A8B0BA] hover:text-white'
                      }`}
                    >
                      {active && (
                        <motion.span
                          layoutId="nav-pill"
                          className="absolute inset-0 rounded-full bg-[#B89E6B] shadow-sm"
                          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                        />
                      )}
                      <span className="relative z-10">{link.label}</span>
                    </a>
                  );
                })}

                {/* More */}
                <div
                  className="relative"
                  onMouseEnter={() => setMoreOpen(true)}
                  onMouseLeave={() => setMoreOpen(false)}
                >
                  <button
                    type="button"
                    className={`relative flex items-center gap-1 px-3.5 py-1.5 text-[13px] font-medium rounded-full transition-colors ${
                      moreOpen ? 'text-white' : 'text-[#A8B0BA] hover:text-white'
                    }`}
                    aria-expanded={moreOpen}
                  >
                    <span>More</span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform duration-200 ${moreOpen ? 'rotate-180' : ''}`}
                    />
                  </button>
                  <AnimatePresence>
                    {moreOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 6 }}
                        transition={{ duration: 0.16 }}
                        className="absolute left-1/2 -translate-x-1/2 top-full pt-2 z-50"
                      >
                        <div className="w-56 card-static p-1.5 shadow-lg">
                          {MORE_LINKS.map((item) =>
                            item.href.startsWith('/') ? (
                              <Link
                                key={item.href}
                                to={item.href}
                                className="block px-3 py-2 text-sm text-[#0E1217] rounded-lg hover:bg-[#EBE8E2] hover:text-[#B89E6B] transition-colors"
                              >
                                {item.label}
                              </Link>
                            ) : (
                              <a
                                key={item.href}
                                href={item.href}
                                className="block px-3 py-2 text-sm text-[#0E1217] rounded-lg hover:bg-[#EBE8E2] hover:text-[#B89E6B] transition-colors"
                              >
                                {item.label}
                              </a>
                            )
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <Link
                  to="/blog"
                  className={`relative px-3.5 py-1.5 text-[13px] font-medium rounded-full transition-colors ${
                    blogActive ? 'bg-[#B89E6B] text-[#0E1217]' : 'text-[#A8B0BA] hover:text-white'
                  }`}
                >
                  Blog
                </Link>
              </nav>
            </LayoutGroup>

            {/* Desktop actions */}
            <div className="hidden lg:flex items-center gap-2 shrink-0">
              <div
                className="relative"
                onMouseEnter={() => setSuiteOpen(true)}
                onMouseLeave={() => setSuiteOpen(false)}
              >
                <button
                  type="button"
                  className="flex items-center gap-1 px-3 py-2 text-[13px] font-medium text-[#A8B0BA] hover:text-white rounded-full hover:bg-white/8 transition-colors"
                  aria-expanded={suiteOpen}
                >
                  Suite
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-[#6B7580] transition-transform duration-200 ${
                      suiteOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                <AnimatePresence>
                  {suiteOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.98 }}
                      transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                      className="absolute right-0 top-full pt-2 z-50 origin-top-right"
                    >
                      <div className="w-[22rem] card-static p-3 shadow-xl">
                        <div className="px-2 pb-2 mb-1 border-b border-[#D5D0C6]">
                          <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#6B7580]">
                            Easily Legal Platform
                          </div>
                          <p className="text-xs text-[#6B7580] mt-0.5">
                            Integrated tools for Indian founders &amp; professionals
                          </p>
                        </div>
                        <div className="grid gap-1">
                          {SUITE.map((item) => {
                            const Icon = item.icon;
                            const inner = (
                              <div
                                className={`flex items-start gap-3 p-2.5 rounded-xl transition-colors ${
                                  item.status === 'Current'
                                    ? 'bg-[#EBE8E2] border border-[#D5D0C6]'
                                    : item.status === 'Soon'
                                      ? 'opacity-60'
                                      : 'hover:bg-[#EBE8E2]'
                                }`}
                              >
                                <div className="w-9 h-9 rounded-lg bg-[#FFFFFF] border border-[#D5D0C6] flex items-center justify-center text-[#B89E6B] shrink-0">
                                  <Icon className="w-4 h-4" />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center gap-1.5 text-sm font-semibold text-[#0E1217]">
                                    <span className="truncate">{item.name}</span>
                                    {item.external && (
                                      <ExternalLink className="w-3 h-3 text-[#6B7580] shrink-0" />
                                    )}
                                    {item.status === 'Current' && (
                                      <span className="text-[9px] font-bold uppercase tracking-wider bg-[#B89E6B] text-white px-1.5 py-0.5 rounded-full">
                                        Current
                                      </span>
                                    )}
                                    {item.status === 'Soon' && (
                                      <span className="text-[9px] font-bold uppercase tracking-wider bg-[#E4E0D8] text-[#5C6570] px-1.5 py-0.5 rounded-full">
                                        Soon
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-xs text-[#6B7580] mt-0.5">{item.desc}</div>
                                </div>
                              </div>
                            );

                            if (item.external) {
                              return (
                                <a
                                  key={item.name}
                                  href={item.url}
                                  target="_blank"
                                  rel="noreferrer"
                                >
                                  {inner}
                                </a>
                              );
                            }
                            return <div key={item.name}>{inner}</div>;
                          })}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <button
                type="button"
                onClick={onOpenChecker}
                className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#B89E6B] hover:text-white px-3 py-2 rounded-full hover:bg-white/8 transition-colors"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span className="hidden xl:inline">Talk to expert</span>
                <span className="xl:hidden">Expert</span>
              </button>
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#A8B0BA] hover:text-white px-3 py-2 rounded-full hover:bg-white/8 transition-colors"
              >
                Log in
              </Link>
              <Link
                to="/signup"
                className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-white border border-white/20 bg-white/5 hover:bg-white/10 px-3.5 py-2 rounded-lg transition-colors"
              >
                Sign up
              </Link>
            </div>

            {/* Mobile controls */}
            <div className="lg:hidden flex items-center gap-1.5 sm:gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setMobileMenuOpen((v) => !v)}
                className="p-2 rounded-xl text-[#A8B0BA] hover:text-white hover:bg-white/8 border border-transparent hover:border-white/15 transition-colors"
                aria-label="Toggle navigation"
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 top-[3.5rem] bg-[#0E1217]/55 backdrop-blur-[2px] z-40"
              onClick={closeMobile}
            />
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="lg:hidden absolute inset-x-0 top-full z-50 px-3 pb-3"
            >
              <div className="card-static max-h-[min(78vh,640px)] overflow-y-auto p-3 shadow-xl">
                <div className="space-y-4">
                  <div>
                    <div className="px-2 mb-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#6B7580]">
                      Product
                    </div>
                    <div className="space-y-0.5">
                      {MOBILE_LINKS.filter((l) => l.group === 'Product').map((link, index) => (
                        <motion.a
                          key={link.href}
                          href={link.href}
                          onClick={closeMobile}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.03 }}
                          className="flex items-center justify-between px-3 py-2.5 text-[15px] font-medium text-[#0E1217] rounded-xl hover:bg-[#EBE8E2]"
                        >
                          {link.label}
                          <ArrowRight className="w-3.5 h-3.5 text-[#9AA3AD]" />
                        </motion.a>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="px-2 mb-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#6B7580]">
                      Network
                    </div>
                    <div className="space-y-0.5">
                      {MOBILE_LINKS.filter((l) => l.group === 'Network').map((link) =>
                        link.href.startsWith('/') ? (
                          <Link
                            key={link.href}
                            to={link.href}
                            onClick={closeMobile}
                            className="flex items-center justify-between px-3 py-2.5 text-[15px] font-medium text-[#0E1217] rounded-xl hover:bg-[#EBE8E2]"
                          >
                            {link.label}
                            <ArrowRight className="w-3.5 h-3.5 text-[#9AA3AD]" />
                          </Link>
                        ) : (
                          <a
                            key={link.href}
                            href={link.href}
                            onClick={closeMobile}
                            className="flex items-center justify-between px-3 py-2.5 text-[15px] font-medium text-[#0E1217] rounded-xl hover:bg-[#EBE8E2]"
                          >
                            {link.label}
                            <ArrowRight className="w-3.5 h-3.5 text-[#9AA3AD]" />
                          </a>
                        )
                      )}
                    </div>
                  </div>

                  <div>
                    <div className="px-2 mb-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#6B7580]">
                      Legal
                    </div>
                    <div className="space-y-0.5">
                      {MOBILE_LINKS.filter((l) => l.group === 'Legal').map((link) => (
                        <Link
                          key={link.href}
                          to={link.href}
                          onClick={closeMobile}
                          className="flex items-center justify-between px-3 py-2.5 text-[15px] font-medium text-[#0E1217] rounded-xl hover:bg-[#EBE8E2]"
                        >
                          {link.label}
                          <ArrowRight className="w-3.5 h-3.5 text-[#9AA3AD]" />
                        </Link>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-xl bg-[#EBE8E2] border border-[#D5D0C6] p-2">
                    <div className="px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#6B7580]">
                      Easily Suite
                    </div>
                    {SUITE.filter((s) => s.external || s.status === 'Current').map((item) => {
                      const Icon = item.icon;
                      const content = (
                        <div className="flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-[#FFFFFF]">
                          <Icon className="w-4 h-4 text-[#B89E6B]" />
                          <span className="text-sm font-medium text-[#0E1217]">{item.name}</span>
                          {item.external && <ExternalLink className="w-3 h-3 text-[#6B7580] ml-auto" />}
                        </div>
                      );
                      return item.external ? (
                        <a key={item.name} href={item.url} target="_blank" rel="noreferrer">
                          {content}
                        </a>
                      ) : (
                        <div key={item.name}>{content}</div>
                      );
                    })}
                  </div>

                  <div className="flex flex-col gap-2 pt-1">
                    <div className="grid grid-cols-2 gap-2">
                      <Link
                        to="/login"
                        onClick={closeMobile}
                        className="inline-flex items-center justify-center gap-1.5 py-3 rounded-full border border-[#D5D0C6] bg-[#FFFFFF] text-sm font-semibold text-[#0E1217] hover:bg-[#EBE8E2] transition-colors"
                      >
                        <LogIn className="w-4 h-4" />
                        Log in
                      </Link>
                      <Link
                        to="/signup"
                        onClick={closeMobile}
                        className="inline-flex items-center justify-center gap-1.5 py-3 rounded-full bg-[#B89E6B] text-sm font-semibold text-white hover:bg-[#8A7349] transition-colors"
                      >
                        <UserPlus className="w-4 h-4" />
                        Sign up
                      </Link>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        closeMobile();
                        onOpenChecker();
                      }}
                      className="w-full btn-secondary-dark py-3"
                    >
                      <PhoneCall className="w-4 h-4" />
                      Talk to an expert
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
