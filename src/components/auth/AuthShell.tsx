import { ReactNode } from 'react';
import { Link } from '@/components/nav/NextNav';
import { ShieldCheck, MessageSquare, FileCheck, ArrowLeft } from 'lucide-react';
import { BrandMark } from '@/components/BrandMark';

interface AuthShellProps {
  children: ReactNode;
  title: string;
  subtitle: string;
}

const PERKS = [
  {
    icon: ShieldCheck,
    title: 'Professionally verified',
    desc: 'CAs, CSs & Advocates on every managed filing',
  },
  {
    icon: MessageSquare,
    title: 'WhatsApp radar',
    desc: 'Free statutory reminders for one entity',
  },
  {
    icon: FileCheck,
    title: 'Compliance passport',
    desc: 'One vault for GST, MCA, labour & licences',
  },
] as const;

export function AuthShell({ children, title, subtitle }: AuthShellProps) {
  return (
    <div className="min-h-screen bg-[#F4F2EE] text-[#0E1217] font-sans selection:bg-[#E4E0D8] selection:text-[#0E1217]">
      <div className="grid min-h-screen lg:grid-cols-2">
        {/* Brand panel — Avvocato charcoal + gold */}
        <aside className="relative hidden lg:flex flex-col justify-between overflow-hidden bg-[#0E1217] text-white p-10 xl:p-14">
          <div
            className="absolute inset-0 pointer-events-none opacity-90"
            aria-hidden
            style={{
              background:
                'radial-gradient(ellipse 70% 55% at 72% 42%, rgba(184,158,107,0.14), transparent 58%), radial-gradient(ellipse 55% 45% at 18% 30%, rgba(30,40,55,0.55), transparent 60%), linear-gradient(165deg, #0E1217 0%, #12161B 50%, #0A0E13 100%)',
            }}
          />
          <div
            className="absolute inset-0 opacity-35 pointer-events-none"
            aria-hidden
            style={{
              backgroundImage:
                'linear-gradient(rgba(184,158,107,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(184,158,107,0.05) 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }}
          />

          <div className="relative z-10">
            <Link to="/" className="inline-flex items-center gap-2.5 group">
              <BrandMark size="md" priority />
              <div>
                <div className="font-display text-xl font-semibold tracking-tight">
                  Compliance<span className="text-[#B89E6B]">Easily</span>
                </div>
                <div className="text-[11px] text-[#A8B0BA]">AI speed · Professional accountability</div>
              </div>
            </Link>
          </div>

          <div className="relative z-10 space-y-8 max-w-md">
            <div className="space-y-3">
              <div className="glass-pill glass-pill-dark !tracking-[0.14em]">Secure workspace</div>
              <p className="font-display text-4xl xl:text-[2.75rem] font-semibold tracking-tight leading-[1.12] text-[#B89E6B]">
                Your business compliance, in one signed-in vault.
              </p>
              <p className="text-[#A8B0BA] leading-relaxed">
                Sign in to manage passports, WhatsApp alerts, bank feeds and professional handoffs —
                all in one place.
              </p>
            </div>

            <ul className="space-y-4">
              {PERKS.map((perk) => {
                const Icon = perk.icon;
                return (
                  <li key={perk.title} className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#1A2129] border border-[#B89E6B]/35 flex items-center justify-center text-[#B89E6B] shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-semibold text-white">{perk.title}</div>
                      <div className="text-sm text-[#A8B0BA] mt-0.5">{perk.desc}</div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          <p className="relative z-10 text-xs text-[#6B7580] font-mono">
            UX demo · Google sign-in is simulated (no live OAuth yet)
          </p>
        </aside>

        {/* Form panel */}
        <main className="relative flex flex-col justify-center px-4 py-10 sm:px-8 lg:px-12 xl:px-16">
          <div className="absolute inset-0 pointer-events-none bg-dot-grid-light opacity-25" aria-hidden />

          <div className="relative z-10 w-full max-w-md mx-auto">
            <div className="flex items-center justify-between mb-8 lg:mb-10 gap-3">
              <Link
                to="/"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-[#5C6570] hover:text-[#0E1217] transition-colors shrink-0"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Back to home</span>
                <span className="sm:hidden">Back</span>
              </Link>
              <Link to="/" className="lg:hidden inline-flex items-center gap-2 min-w-0">
                <BrandMark size="xs" />
                <span className="font-display font-semibold text-[#0E1217] truncate">
                  Compliance<span className="text-[#B89E6B]">Easily</span>
                </span>
              </Link>
            </div>

            <div className="space-y-2 mb-8">
              <h1 className="font-display text-2xl sm:text-3xl font-semibold tracking-tight text-[#0E1217] leading-tight">
                {title}
              </h1>
              <p className="text-sm text-[#5C6570] leading-relaxed">{subtitle}</p>
            </div>

            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
