import { User, Mail, Phone, Shield, KeyRound, Smartphone, Monitor, Building2, Globe2, Languages, CalendarRange } from 'lucide-react';
import { PageHeader } from '../../components/dashboard/PageHeader';

const fieldClass =
  'input-elevated mt-1.5 w-full rounded-lg px-4 py-3 text-sm font-sans text-[#0E1217] read-only:bg-[#F4F2EE] read-only:text-[#5C6570] focus:border-[#B89E6B]';

const labelClass =
  'block text-[11px] font-mono font-semibold uppercase tracking-wider text-[#6B7580]';

export function SettingsPage() {
  return (
    <div>
      <PageHeader
        title="Account Settings"
        description="Profile, security, and workspace preferences. UI only for now."
      />

      <div className="grid gap-5 lg:grid-cols-2">
        {/* Profile */}
        <section className="rounded-2xl border border-[#D5D0C6] bg-white p-5 sm:p-6 shadow-sm">
          <div className="flex items-start justify-between gap-4 border-b border-[#EBE8E2] pb-4">
            <div>
              <div className="inline-flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0E1217] text-[#B89E6B]">
                  <User className="h-4 w-4" />
                </span>
                <h2 className="font-display text-lg font-semibold tracking-tight text-[#0E1217]">
                  Profile
                </h2>
              </div>
              <p className="mt-1 text-xs text-[#6B7580]">
                How you appear across filings and WhatsApp alerts.
              </p>
            </div>
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#B89E6B] text-sm font-bold text-white shadow-[0_4px_12px_-4px_rgba(184,158,107,0.55)]">
              AO
            </div>
          </div>

          <div className="mt-5 space-y-4">
            <label className={labelClass}>
              Full name
              <div className="relative">
                <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#B89E6B]" />
                <input
                  className={`${fieldClass} pl-10`}
                  defaultValue="Abhishek Owner"
                  readOnly
                />
              </div>
            </label>
            <label className={labelClass}>
              Email
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#B89E6B]" />
                <input
                  type="email"
                  className={`${fieldClass} pl-10`}
                  defaultValue="abhishek@acmeretail.in"
                  readOnly
                />
              </div>
            </label>
            <label className={labelClass}>
              Phone (WhatsApp)
              <div className="relative">
                <Phone className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#B89E6B]" />
                <input
                  type="tel"
                  className={`${fieldClass} pl-10`}
                  defaultValue="+91 98XXX XX210"
                  readOnly
                />
              </div>
            </label>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-[#EBE8E2] pt-4">
            <button type="button" className="btn-primary text-xs py-2.5 px-4">
              Save changes
            </button>
            <span className="text-[11px] font-mono text-[#6B7580]">Demo · fields are read-only</span>
          </div>
        </section>

        {/* Security */}
        <section className="rounded-2xl border border-[#D5D0C6] bg-white p-5 sm:p-6 shadow-sm">
          <div className="border-b border-[#EBE8E2] pb-4">
            <div className="inline-flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0E1217] text-[#B89E6B]">
                <Shield className="h-4 w-4" />
              </span>
              <h2 className="font-display text-lg font-semibold tracking-tight text-[#0E1217]">
                Security
              </h2>
            </div>
            <p className="mt-1 text-xs text-[#6B7580]">
              Protect the workspace that holds your compliance passport.
            </p>
          </div>

          <div className="mt-5 space-y-3">
            <button
              type="button"
              className="group flex w-full items-start gap-3 rounded-xl border border-[#D5D0C6] bg-[#F4F2EE]/60 px-4 py-3.5 text-left transition-colors hover:border-[#B89E6B]/50 hover:bg-[#EBE8E2]"
            >
              <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#D5D0C6] bg-white text-[#B89E6B]">
                <KeyRound className="h-4 w-4" />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-semibold text-[#0E1217]">Change password</span>
                <span className="mt-0.5 block text-xs text-[#6B7580]">UI placeholder</span>
              </span>
            </button>
            <button
              type="button"
              className="group flex w-full items-start gap-3 rounded-xl border border-[#D5D0C6] bg-[#F4F2EE]/60 px-4 py-3.5 text-left transition-colors hover:border-[#B89E6B]/50 hover:bg-[#EBE8E2]"
            >
              <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#D5D0C6] bg-white text-[#B89E6B]">
                <Smartphone className="h-4 w-4" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center justify-between gap-2">
                  <span className="text-sm font-semibold text-[#0E1217]">Two-factor authentication</span>
                  <span className="rounded-full border border-[#D5D0C6] bg-white px-2 py-0.5 text-[10px] font-mono font-semibold uppercase tracking-wider text-[#6B7580]">
                    Off
                  </span>
                </span>
                <span className="mt-0.5 block text-xs text-[#6B7580]">Not enabled</span>
              </span>
            </button>
            <button
              type="button"
              className="group flex w-full items-start gap-3 rounded-xl border border-[#D5D0C6] bg-[#F4F2EE]/60 px-4 py-3.5 text-left transition-colors hover:border-[#B89E6B]/50 hover:bg-[#EBE8E2]"
            >
              <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#D5D0C6] bg-white text-[#B89E6B]">
                <Monitor className="h-4 w-4" />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-semibold text-[#0E1217]">Active sessions</span>
                <span className="mt-0.5 block text-xs text-[#6B7580]">1 device · this browser</span>
              </span>
            </button>
          </div>
        </section>

        {/* Preferences */}
        <section className="rounded-2xl border border-[#D5D0C6] bg-white p-5 sm:p-6 shadow-sm lg:col-span-2">
          <div className="border-b border-[#EBE8E2] pb-4">
            <div className="inline-flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0E1217] text-[#B89E6B]">
                <Globe2 className="h-4 w-4" />
              </span>
              <h2 className="font-display text-lg font-semibold tracking-tight text-[#0E1217]">
                Preferences
              </h2>
            </div>
            <p className="mt-1 text-xs text-[#6B7580]">
              Defaults for reminders, filings, and reports.
            </p>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {[
              { icon: Building2, label: 'Default entity', value: 'ACME Retail' },
              { icon: Globe2, label: 'Timezone', value: 'Asia/Kolkata' },
              { icon: Languages, label: 'Language', value: 'English (IN)' },
              { icon: CalendarRange, label: 'Fiscal year start', value: '1 April' },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.label}
                  className="flex items-center justify-between gap-3 rounded-xl border border-[#D5D0C6] bg-[#F4F2EE]/50 px-4 py-3.5"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#D5D0C6] bg-white text-[#B89E6B]">
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="text-sm font-medium text-[#0E1217]">{item.label}</span>
                  </div>
                  <span className="shrink-0 rounded-full border border-[#B89E6B]/35 bg-white px-2.5 py-1 text-[11px] font-mono font-semibold text-[#B89E6B]">
                    {item.value}
                  </span>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
