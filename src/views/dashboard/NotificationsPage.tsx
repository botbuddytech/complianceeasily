'use client';

import { useState } from 'react';
import { MessageCircle, Mail, Smartphone, Bell } from 'lucide-react';
import { PageHeader } from '../../components/dashboard/PageHeader';
import { NOTIFICATION_PREFS } from '../../data/dashboard/notifications';
import { updateNotificationPreference } from '@/lib/actions/domain';
import type { NotificationPreference } from '../../types/dashboard';

const ICONS = {
  whatsapp: MessageCircle,
  email: Mail,
  sms: Smartphone,
  in_app: Bell,
};

function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative h-6 w-11 rounded-full transition-colors ${
        checked ? 'bg-[#B89E6B]' : 'bg-[#D5D0C6]'
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
          checked ? 'translate-x-5' : ''
        }`}
      />
    </button>
  );
}

export function NotificationsPage() {
  const [prefs, setPrefs] = useState<NotificationPreference[]>(NOTIFICATION_PREFS);
  const [status, setStatus] = useState<string | null>(null);

  const setChannel = async (id: string, enabled: boolean) => {
    setPrefs((prev) => prev.map((p) => (p.id === id ? { ...p, enabled } : p)));
    const result = await updateNotificationPreference({ preferenceId: id, enabled });
    setStatus(
      'error' in result
        ? result.error.includes('not configured')
          ? 'Saved locally (configure Supabase to persist)'
          : result.error
        : 'Preferences saved',
    );
  };

  const setEvent = async (channelId: string, eventId: string, enabled: boolean) => {
    setPrefs((prev) =>
      prev.map((p) =>
        p.id === channelId
          ? {
              ...p,
              events: p.events.map((e) => (e.id === eventId ? { ...e, enabled } : e)),
            }
          : p,
      ),
    );
    const result = await updateNotificationPreference({
      preferenceId: channelId,
      eventId,
      eventEnabled: enabled,
    });
    setStatus(
      'error' in result
        ? result.error.includes('not configured')
          ? 'Saved locally (configure Supabase to persist)'
          : result.error
        : 'Preferences saved',
    );
  };

  return (
    <div>
      <PageHeader
        title="Notifications"
        description="Control WhatsApp Radar, email digests, SMS, and in-app alerts."
      />
      {status && (
        <p className="mb-3 rounded-xl border border-[#D5D0C6] bg-[#EBE8E2] px-3 py-2 text-xs text-[#5C6570]">
          {status}
        </p>
      )}

      <div className="space-y-4">
        {prefs.map((p) => {
          const Icon = ICONS[p.channel];
          return (
            <section
              key={p.id}
              className="rounded-2xl border border-[#D5D0C6] bg-white p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#D5D0C6] bg-[#EBE8E2] text-[#B89E6B]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-[#0E1217]">{p.label}</h2>
                    <p className="mt-0.5 text-xs text-[#6B7580]">{p.description}</p>
                  </div>
                </div>
                <Toggle checked={p.enabled} onChange={(v) => setChannel(p.id, v)} />
              </div>

              <ul className={`mt-4 space-y-2 border-t border-[#EBE8E2] pt-4 ${!p.enabled ? 'opacity-40 pointer-events-none' : ''}`}>
                {p.events.map((e) => (
                  <li key={e.id} className="flex items-center justify-between gap-3 text-sm">
                    <span className="text-[#5C6570]">{e.label}</span>
                    <Toggle
                      checked={e.enabled}
                      onChange={(v) => setEvent(p.id, e.id, v)}
                    />
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
}
