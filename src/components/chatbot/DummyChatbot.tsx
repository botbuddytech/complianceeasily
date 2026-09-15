'use client';

import { FormEvent, useEffect, useId, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { MessageCircle, Send, X } from 'lucide-react';
import { Link } from '@/components/nav/NextNav';
import { BrandMark } from '@/components/BrandMark';

type Role = 'bot' | 'user';

type ChatMessage = {
  id: string;
  role: Role;
  text: string;
};

const HIDDEN_PREFIXES = ['/dashboard', '/admin', '/professional', '/login', '/signup'];

const QUICK_PROMPTS = [
  'What compliances do I need?',
  'How does Protection Guarantee work?',
  'GST filing reminders',
  'Talk to a CA / CS',
] as const;

const WELCOME =
  "Hello! 👋 Welcome to ComplianceEasily. I can help with GST, MCA, labour filings, WhatsApp reminders, and our Protection Guarantee. What would you like to know?";

function replyFor(input: string): string {
  const q = input.toLowerCase();

  if (/protect|guarantee|penalty|late fee/.test(q)) {
    return 'Our Compliance Protection Guarantee is a contractual warranty on Managed plans — if we miss an eligible filing due to our operational delay, we reimburse eligible statutory late fees (up to plan limits). It is not insurance. See /protection-guarantee for full terms.';
  }
  if (/gst|gstr|return/.test(q)) {
    return 'We track GSTR-1 / GSTR-3B and related due dates, nudge you on WhatsApp, and Managed plans include professional review before filing. Share your turnover band or open Free Compliance Check to map exact GST obligations.';
  }
  if (/mca|roc|company|llp|annual return|aoc|mgt/.test(q)) {
    return 'For companies and LLPs we calendar MCA annual filings (AOC-4, MGT-7 / Form 8 etc.), DSC windows, and connect you with practising CSs. Start with entity type in Free Compliance Check.';
  }
  if (/price|plan|cost|pricing|fee/.test(q)) {
    return 'Reminder tier is free for one entity. Pro and Managed plans unlock calendars, filings coordination, and Protection on Managed. Jump to #pricing on the home page or Contact us for a scoped quote.';
  }
  if (/whatsapp|remind|alert|radar/.test(q)) {
    return 'WhatsApp Radar sends due-date alerts and document requests on the number you register. Opt-in during signup or Free Compliance Check — you can change frequency anytime in notification settings.';
  }
  if (/ca|cs|advocate|lawyer|professional|accountant/.test(q)) {
    return 'Filings and certifications are handled by independent practising CAs, CSs and Advocates — ComplianceEasily coordinates the workflow. Visit /contact or #for-professionals if you want to join the network.';
  }
  if (/refund|cancel|billing/.test(q)) {
    return 'Subscription and professional-fee refunds follow our Refund Policy. Government challans are pass-through and generally non-refundable. Read /refund-policy or email hello@complianceeasily.com.';
  }
  if (/hello|hi|hey|namaste/.test(q)) {
    return 'Hi there! Ask about GST, MCA, labour, pricing, Protection Guarantee, or WhatsApp reminders — or tap a suggestion below.';
  }

  return 'Thanks — this is a demo assistant. For entity-specific advice, run Free Compliance Check or message hello@complianceeasily.com. Try asking about GST, MCA, Protection Guarantee, or pricing.';
}

function shouldHide(pathname: string | null) {
  if (!pathname) return false;
  return HIDDEN_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

export function DummyChatbot() {
  const pathname = usePathname();
  const prefersReduced = useReducedMotion();
  const panelId = useId();
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 'welcome', role: 'bot', text: WELCOME },
  ]);

  useEffect(() => {
    if (!listRef.current) return;
    listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages, typing, open]);

  useEffect(() => {
    if (open) {
      const t = window.setTimeout(() => inputRef.current?.focus(), 180);
      return () => window.clearTimeout(t);
    }
  }, [open]);

  if (shouldHide(pathname)) return null;

  const pushUser = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || typing) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      text: trimmed,
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setTyping(true);

    window.setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: `b-${Date.now()}`,
          role: 'bot',
          text: replyFor(trimmed),
        },
      ]);
      setTyping(false);
    }, 650 + Math.min(trimmed.length * 8, 900));
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    pushUser(input);
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[60] flex flex-col items-end gap-3 pointer-events-none font-sans">
      <AnimatePresence>
        {open && (
          <motion.div
            id={panelId}
            role="dialog"
            aria-label="ComplianceEasily Assistant"
            aria-modal="false"
            initial={
              prefersReduced
                ? { opacity: 1 }
                : { opacity: 0, y: 16, scale: 0.96 }
            }
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={
              prefersReduced
                ? { opacity: 0 }
                : { opacity: 0, y: 12, scale: 0.96 }
            }
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="pointer-events-auto w-[min(100vw-1.5rem,380px)] h-[min(72vh,500px)] flex flex-col overflow-hidden rounded-xl bg-white shadow-[0_10px_40px_rgba(0,0,0,0.15)] border border-[#E8E2D8]"
          >
            {/* Header — ContractEasily brass bar */}
            <div className="shrink-0 flex items-center gap-3 px-4 py-3.5 bg-[#D5AA6D] text-white">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-[#0E1217] flex items-center justify-center shadow-sm shrink-0 ring-1 ring-white/30">
                <BrandMark size="xs" framed={false} className="!h-10 !w-10" />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-[15px] font-semibold leading-tight text-white tracking-tight">
                  ComplianceEasily Assistant
                </h4>
                <span className="text-[11px] text-white/90 leading-none">Online</span>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="p-1.5 rounded-md text-white/90 hover:bg-white/15 transition-colors"
                aria-label="Close assistant"
              >
                <X className="w-5 h-5" strokeWidth={2.25} />
              </button>
            </div>

            {/* Messages */}
            <div
              ref={listRef}
              className="flex-1 overflow-y-auto bg-[#F8F9FA] px-3.5 py-4 space-y-3"
            >
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed shadow-sm ${
                      m.role === 'user'
                        ? 'bg-[#C49A5A] text-white rounded-br-md'
                        : 'bg-white text-[#2A2F36] rounded-bl-md border border-[#EEEAE3]'
                    }`}
                  >
                    {m.text.split(/(\/[a-z0-9-]+|#[a-z0-9-]+)/g).map((part, i) => {
                      if (part.startsWith('/')) {
                        return (
                          <Link
                            key={`${m.id}-l-${i}`}
                            to={part}
                            className={
                              m.role === 'user'
                                ? 'underline underline-offset-2 font-semibold'
                                : 'text-[#B89E6B] font-semibold underline underline-offset-2'
                            }
                            onClick={() => setOpen(false)}
                          >
                            {part}
                          </Link>
                        );
                      }
                      if (part.startsWith('#')) {
                        return (
                          <a
                            key={`${m.id}-h-${i}`}
                            href={`/${part}`}
                            className={
                              m.role === 'user'
                                ? 'underline underline-offset-2 font-semibold'
                                : 'text-[#B89E6B] font-semibold underline underline-offset-2'
                            }
                            onClick={() => setOpen(false)}
                          >
                            {part}
                          </a>
                        );
                      }
                      return <span key={`${m.id}-t-${i}`}>{part}</span>;
                    })}
                  </div>
                </div>
              ))}

              {typing && (
                <div className="flex justify-start">
                  <div className="bg-white border border-[#EEEAE3] rounded-2xl rounded-bl-md px-3.5 py-3 shadow-sm flex gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C49A5A] animate-bounce [animation-delay:0ms]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C49A5A] animate-bounce [animation-delay:120ms]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C49A5A] animate-bounce [animation-delay:240ms]" />
                  </div>
                </div>
              )}

              {messages.length <= 2 && !typing && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {QUICK_PROMPTS.map((prompt) => (
                    <button
                      key={prompt}
                      type="button"
                      onClick={() => pushUser(prompt)}
                      className="text-[11px] font-medium px-2.5 py-1.5 rounded-full border border-[#D5D0C6] bg-white text-[#5C6570] hover:border-[#C49A5A] hover:text-[#0E1217] transition-colors"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Input */}
            <form
              onSubmit={onSubmit}
              className="shrink-0 bg-white border-t border-[#EEEAE3] p-3"
            >
              <div className="flex items-center gap-2 rounded-full border border-[#E0DBD3] bg-[#F8F9FA] pl-4 pr-1.5 py-1.5 focus-within:border-[#C49A5A] focus-within:bg-white transition-colors">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 min-w-0 bg-transparent text-[13px] text-[#0E1217] placeholder:text-[#9AA3AD] outline-none"
                  aria-label="Chat message"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || typing}
                  className="w-9 h-9 rounded-full bg-[#C49A5A] text-white flex items-center justify-center shrink-0 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#B88B48] transition-colors"
                  aria-label="Send message"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
              <p className="mt-2 text-center text-[10px] text-[#9AA3AD] font-mono">
                Demo chatbot · Not legal advice
              </p>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Launcher row — ContractEasily style */}
      <div className="pointer-events-auto flex items-center gap-2.5">
        {!open && (
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="hidden sm:flex items-center h-11 px-4 rounded-full bg-white border border-[#E8E2D8] shadow-[0_4px_16px_rgba(0,0,0,0.08)] text-[13px] italic text-[#8B95A1] hover:border-[#C49A5A] hover:text-[#5C6570] transition-colors"
          >
            Ask anything compliance…
          </button>
        )}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls={panelId}
          aria-label={open ? 'Close assistant' : 'Open assistant'}
          className="w-[60px] h-[60px] rounded-full bg-[#C49A5A] text-white flex items-center justify-center shadow-[0_4px_20px_rgba(213,170,109,0.4)] hover:bg-[#B88B48] hover:scale-[1.03] active:scale-[0.98] transition-all"
        >
          {open ? (
            <X className="w-6 h-6" strokeWidth={2.25} />
          ) : (
            <MessageCircle className="w-7 h-7" strokeWidth={2} fill="currentColor" fillOpacity={0.15} />
          )}
        </button>
      </div>
    </div>
  );
}
