/**
 * Stub notification providers — schema + interface ready.
 * Real WhatsApp / email / SMS adapters plug in here later.
 */

export type NotifyChannel = 'whatsapp' | 'email' | 'sms' | 'in_app';

export interface NotificationPayload {
  to: string;
  subject?: string;
  body: string;
  meta?: Record<string, unknown>;
}

export interface NotificationProvider {
  channel: NotifyChannel;
  send(payload: NotificationPayload): Promise<{ ok: boolean; providerRef?: string; error?: string }>;
}

export class LoggingNotificationProvider implements NotificationProvider {
  constructor(public channel: NotifyChannel) {}

  async send(payload: NotificationPayload) {
    console.info(`[notify:${this.channel}] to=${payload.to} subject=${payload.subject ?? ''} body=${payload.body.slice(0, 120)}`);
    return { ok: true, providerRef: `stub-${this.channel}-${Date.now()}` };
  }
}

const providers: Record<NotifyChannel, NotificationProvider> = {
  whatsapp: new LoggingNotificationProvider('whatsapp'),
  email: new LoggingNotificationProvider('email'),
  sms: new LoggingNotificationProvider('sms'),
  in_app: new LoggingNotificationProvider('in_app'),
};

export async function sendNotification(
  channel: NotifyChannel,
  payload: NotificationPayload,
) {
  return providers[channel].send(payload);
}

export async function processNotificationJob(job: {
  id: string;
  channel: NotifyChannel;
  payload: NotificationPayload & { to?: string };
}) {
  const to = job.payload.to ?? 'unknown';
  const result = await sendNotification(job.channel, {
    to,
    subject: job.payload.subject,
    body: job.payload.body ?? '',
    meta: { ...job.payload } as Record<string, unknown>,
  });
  return { jobId: job.id, ...result };
}
