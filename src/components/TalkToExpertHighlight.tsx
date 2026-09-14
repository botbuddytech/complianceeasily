import { PhoneCall, ArrowRight, BadgeCheck, Clock3 } from 'lucide-react';

interface TalkToExpertHighlightProps {
  onTalkToExpert: () => void;
  variant?: 'banner' | 'compact';
}

export function TalkToExpertHighlight({
  onTalkToExpert,
  variant = 'banner',
}: TalkToExpertHighlightProps) {
  if (variant === 'compact') {
    return (
      <button
        type="button"
        onClick={onTalkToExpert}
        className="btn-secondary-dark shadow-[0_8px_24px_-8px_rgba(14, 18, 23,0.45)]"
      >
        <PhoneCall className="w-4 h-4" />
        <span>Talk to an expert in one call</span>
      </button>
    );
  }

  return (
    <div
      className="relative overflow-hidden rounded-2xl bg-[#0E1217] text-white border border-[#1E2630]
        shadow-[0_2px_4px_rgba(0,0,0,0.12),0_24px_56px_-16px_rgba(14, 18, 23,0.65),inset_0_1px_0_rgba(184, 158, 107,0.08)]"
    >
      <div className="absolute -right-10 -top-10 w-48 h-48 rounded-full bg-[#B89E6B]/40 blur-3xl pointer-events-none" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#B89E6B]/40 to-transparent pointer-events-none" />

      <div className="relative p-5 sm:p-7 flex flex-col lg:flex-row lg:items-center gap-5">
        <div className="w-14 h-14 rounded-2xl bg-[#B89E6B] border border-[#B89E6B] flex items-center justify-center shrink-0 shadow-[0_8px_20px_-6px_rgba(184, 158, 107,0.55)]">
          <PhoneCall className="w-6 h-6 text-[#F4F2EE]" />
        </div>

        <div className="flex-1 space-y-2 text-left min-w-0">
          <div className="glass-pill glass-pill-dark !tracking-[0.16em]">
            One phone call. No portal hopping.
          </div>
          <h3 className="font-display text-xl sm:text-2xl lg:text-3xl font-semibold tracking-tight text-white leading-tight">
            Talk to a practising CA, CS or Advocate in one call.
          </h3>
          <p className="text-sm text-[#A8B0BA] leading-relaxed max-w-2xl">
            Books, GST, MCA or a notice — get a verified expert on the line. They already see your
            bank feeds, email invoices and Tally or Zoho ledgers.
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            <span className="glass-pill glass-pill-dark text-[11px] !normal-case !tracking-normal">
              <Clock3 className="w-3 h-3" /> 15-minute expert slot
            </span>
            <span className="glass-pill glass-pill-dark text-[11px] !normal-case !tracking-normal">
              <BadgeCheck className="w-3 h-3" /> ICAI / ICSI / Bar verified
            </span>
          </div>
        </div>

        <button type="button" onClick={onTalkToExpert} className="btn-primary w-full lg:w-auto shrink-0 shadow-[0_8px_24px_-6px_rgba(213,170,109,0.55)]">
          <span>Talk to an expert now</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
