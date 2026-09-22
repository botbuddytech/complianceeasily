import {
  MessageSquare,
  Calendar,
  Bell,
  Clock,
  Zap,
  ArrowRight,
  Shield,
  Radar,
  IndianRupee,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useReducedMotion } from 'motion/react';
import { WhatsAppDemo } from './WhatsAppDemo';
import { Section } from './ui/Section';
import { Reveal } from './ui/Reveal';

interface WhatsAppRadarSectionProps {
  onOpenChecker: () => void;
  onOpenProtectionModal?: () => void;
}

function HeroBackground() {
  return (
    <div className="hero-bg" aria-hidden="true">
      <div className="hero-bg__orb hero-bg__orb--a" />
      <div className="hero-bg__orb hero-bg__orb--b" />
      <div className="hero-bg__orb hero-bg__orb--c" />
      <div className="hero-bg__shine" />
      <div className="hero-bg__grid" />
      <div className="hero-bg__fade" />
    </div>
  );
}

const HEADLINE_FULL = 'Catch the Error. Not the Notice.';
const HEADLINE_SPLIT_AT = 'Catch the Error.'.length;

function HeadlineTyping() {
  const prefersReduced = useReducedMotion();
  // Start with full headline so LCP text is immediate (animation is progressive enhancement).
  const [typed, setTyped] = useState(HEADLINE_FULL);

  useEffect(() => {
    if (prefersReduced) return;

    let cancelled = false;
    let timeoutId: ReturnType<typeof setTimeout>;
    const TYPE_MS = 55;
    const DELETE_MS = 32;
    const HOLD_FULL_MS = 2200;
    const HOLD_EMPTY_MS = 450;
    let i = HEADLINE_FULL.length;
    let deleting = true;

    const schedule = (fn: () => void, ms: number) => {
      timeoutId = setTimeout(fn, ms);
    };

    const tick = () => {
      if (cancelled) return;

      if (!deleting) {
        i += 1;
        setTyped(HEADLINE_FULL.slice(0, i));
        if (i >= HEADLINE_FULL.length) {
          deleting = true;
          schedule(tick, HOLD_FULL_MS);
          return;
        }
        schedule(tick, TYPE_MS);
        return;
      }

      i -= 1;
      setTyped(HEADLINE_FULL.slice(0, Math.max(i, 0)));
      if (i <= 0) {
        deleting = false;
        i = 0;
        schedule(tick, HOLD_EMPTY_MS);
        return;
      }
      schedule(tick, DELETE_MS);
    };

    // Let first paint settle before starting the loop.
    schedule(tick, HOLD_FULL_MS);

    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
    };
  }, [prefersReduced]);

  const first = typed.slice(0, HEADLINE_SPLIT_AT);
  const second = typed.slice(HEADLINE_SPLIT_AT);

  return (
    <h1
      className="font-display w-full text-center text-[1.65rem] sm:text-4xl lg:text-[3.25rem] font-semibold tracking-tight leading-[1.2] min-h-[1.2em]"
      aria-label={HEADLINE_FULL}
    >
      <span className="text-[#FFFFFF]">{first}</span>
      <span className="text-[#B89E6B] italic">{second}</span>
      <span
        className="inline-block w-[0.08em] h-[0.9em] ml-[0.06em] align-[-0.05em] bg-[#B89E6B] animate-pulse"
        aria-hidden="true"
      />
    </h1>
  );
}

const badgeBase =
  'group inline-flex items-center gap-2 rounded-full pl-1.5 pr-3.5 py-1.5 text-left transition-all duration-300 border backdrop-blur-md hover:-translate-y-0.5';

function HeroBadges({ onOpenProtectionModal }: { onOpenProtectionModal?: () => void }) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 pt-2">
      <div
        className={`${badgeBase} bg-[#171C22]/90 border-[#B89E6B]/30 shadow-[0_8px_24px_-12px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.06)] hover:border-[#B89E6B]/55 hover:shadow-[0_12px_28px_-12px_rgba(184,158,107,0.35)]`}
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#B89E6B]/15 text-[#B89E6B] ring-1 ring-[#B89E6B]/30 group-hover:bg-[#B89E6B]/25 transition-colors">
          <Radar className="w-3.5 h-3.5" />
        </span>
        <span className="flex flex-col leading-tight">
          <span className="text-[9px] font-mono font-bold uppercase tracking-[0.16em] text-[#B89E6B]">
            Live
          </span>
          <span className="text-xs font-semibold text-[#F4F2EE]">Compliance radar</span>
        </span>
        <span className="relative ml-0.5 flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#B89E6B] opacity-50" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#B89E6B]" />
        </span>
      </div>

      <div
        className={`${badgeBase} bg-gradient-to-r from-[#B89E6B]/20 to-[#B89E6B]/8 border-[#B89E6B]/45 shadow-[0_8px_24px_-12px_rgba(184,158,107,0.45),inset_0_1px_0_rgba(255,255,255,0.08)] hover:border-[#B89E6B]/70 hover:from-[#B89E6B]/28 hover:to-[#B89E6B]/14`}
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#B89E6B] text-[#12161B] shadow-[0_4px_12px_-4px_rgba(184,158,107,0.8)]">
          <IndianRupee className="w-3.5 h-3.5" strokeWidth={2.5} />
        </span>
        <span className="flex flex-col leading-tight">
          <span className="text-[9px] font-mono font-bold uppercase tracking-[0.16em] text-[#D4C09A]">
            Forever free
          </span>
          <span className="text-xs font-semibold text-[#FFFFFF]">₹0 for basic alerts</span>
        </span>
      </div>

      <div
        className={`${badgeBase} bg-[#171C22]/90 border-white/10 shadow-[0_8px_24px_-12px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.06)] hover:border-[#B89E6B]/40 hover:shadow-[0_12px_28px_-12px_rgba(184,158,107,0.28)]`}
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-[#B89E6B] ring-1 ring-white/10 group-hover:bg-[#B89E6B]/15 transition-colors">
          <MessageSquare className="w-3.5 h-3.5" />
        </span>
        <span className="flex flex-col leading-tight">
          <span className="text-[9px] font-mono font-bold uppercase tracking-[0.16em] text-[#8B95A1]">
            Your compliance manager
          </span>
          <span className="text-xs font-semibold text-[#FFFFFF]">
            On WhatsApp. <span className="text-[#B89E6B]">Free.</span>
          </span>
        </span>
      </div>

      <button
        type="button"
        onClick={onOpenProtectionModal}
        className={`${badgeBase} bg-gradient-to-r from-[#1A1510] to-[#221A12] border-[#B89E6B]/40 shadow-[0_8px_24px_-10px_rgba(184,158,107,0.4),inset_0_1px_0_rgba(184,158,107,0.12)] hover:border-[#B89E6B]/75 hover:shadow-[0_14px_32px_-12px_rgba(184,158,107,0.5)]`}
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#B89E6B]/20 text-[#B89E6B] ring-1 ring-[#B89E6B]/35 group-hover:bg-[#B89E6B] group-hover:text-[#12161B] transition-colors">
          <Shield className="w-3.5 h-3.5" />
        </span>
        <span className="flex flex-col leading-tight text-left">
          <span className="text-[9px] font-mono font-bold uppercase tracking-[0.16em] text-[#D4C09A]">
            Protected
          </span>
          <span className="text-xs font-semibold text-[#FFFFFF]">
            100% Penalty Reimbursement
          </span>
        </span>
        <ArrowRight className="w-3.5 h-3.5 text-[#B89E6B] opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
      </button>
    </div>
  );
}

export function WhatsAppRadarSection({
  onOpenChecker,
  onOpenProtectionModal,
}: WhatsAppRadarSectionProps) {
  const benefits = [
    {
      title: 'Personalized Compliance Calendar',
      description:
        'A custom statutory calendar built strictly around your company type, turnover thresholds, and operating states—no irrelevant spam.',
      icon: Calendar,
    },
    {
      title: 'WhatsApp Due-Date Reminders',
      description:
        'Timely proactive pings at 7 days, 3 days, and 24 hours before deadlines with checklist of required documents.',
      icon: Bell,
    },
    {
      title: 'Licence & Registration Expiry Alerts',
      description:
        'Advance 90-day, 60-day, and 30-day warnings before FSSAI, Shops & Establishment, Factory, Trade, or SPCB consents expire.',
      icon: Clock,
    },
    {
      title: 'New Compliance Alerts When You Change',
      description:
        'Hired employee #20? Opened a branch in Pune? Cross ₹40L turnover? We automatically alert you to the new rules that kick in.',
      icon: Zap,
    },
  ];

  return (
    <Section
      tone="espresso"
      id="whatsapp-radar"
      backdrop={<HeroBackground />}
      className="!pt-8 !pb-16 lg:!pt-14 lg:!pb-24 border-[#1E2630]"
    >
      <div className="space-y-8 lg:space-y-10 min-w-0">
        <Reveal className="w-full space-y-4 text-center min-w-0">
          <HeadlineTyping />
          <p className="text-base sm:text-lg lg:text-xl text-[#A8B0BA] leading-relaxed max-w-3xl mx-auto">
            Most businesses don&rsquo;t find out something&rsquo;s wrong until a notice does.
            ComplianceEasily checks your filings in real time — on WhatsApp, free — so you fix it
            before you file, not after you&rsquo;re fined.
          </p>

          <HeroBadges onOpenProtectionModal={onOpenProtectionModal} />
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center min-w-0">
          <Reveal delay={0.05} className="lg:col-span-6 space-y-5 sm:space-y-6 text-left min-w-0">
            <div className="space-y-3.5">
              {benefits.map((b) => {
                const Icon = b.icon;
                return (
                  <div key={b.title} className="flex items-start space-x-3.5 text-left">
                    <div className="w-8 h-8 rounded-lg bg-white/8 border border-[#1E2630] flex items-center justify-center text-[#B89E6B] shrink-0 mt-0.5">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-display text-sm font-semibold text-[#FFFFFF]">
                        {b.title}
                      </h3>
                      <p className="text-xs text-[#8B95A1] leading-relaxed mt-0.5">
                        {b.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-3 space-y-3">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <button
                  type="button"
                  onClick={onOpenChecker}
                  className="btn-primary group w-full sm:w-auto text-center"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Start FREE on WhatsApp</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform shrink-0" />
                </button>

                <a
                  href="#pricing"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-white/8 hover:bg-white/14 text-[#FFFFFF] border border-[#B89E6B]/40 font-semibold text-sm transition-colors backdrop-blur-sm w-full sm:w-auto"
                >
                  See Pricing
                </a>
              </div>

              <button
                type="button"
                onClick={onOpenProtectionModal}
                className="flex items-start gap-2.5 text-left text-xs sm:text-sm text-[#A8B0BA] leading-relaxed hover:text-[#FFFFFF] transition-colors group w-full"
              >
                <Shield className="w-4 h-4 text-[#B89E6B] shrink-0 mt-0.5" />
                <span>
                  Backed by our{' '}
                  <span className="text-[#B89E6B] font-semibold">
                    100% Penalty Reimbursement Guarantee
                  </span>{' '}
                  — if a notice or penalty ever reaches you while you&rsquo;re with us, we cover it.{' '}
                  <span className="text-[#B89E6B] underline-offset-2 group-hover:underline whitespace-nowrap">
                    Terms apply →
                  </span>
                </span>
              </button>
            </div>
          </Reveal>

          <Reveal delay={0.15} className="lg:col-span-6 relative flex justify-center min-w-0 w-full px-0 sm:px-2">
            <div className="absolute -inset-4 sm:-inset-6 rounded-[2rem] bg-[#B89E6B]/15 blur-3xl pointer-events-none" />
            <div className="relative animate-float min-w-0 w-full flex justify-center">
              <WhatsAppDemo onOpenChecker={onOpenChecker} />
            </div>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
