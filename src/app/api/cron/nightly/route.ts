import { NextResponse } from 'next/server';
import { isSupabaseConfigured, createServiceClient } from '@/lib/supabase/admin';
import { materializeEntity } from '@/lib/compliance/actions';
import { processNotificationJob } from '@/lib/notifications/providers';

/**
 * Nightly-style cron endpoint.
 * Protect with CRON_SECRET header in production (Vercel Cron / Supabase scheduled function).
 */
export async function POST(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const auth = request.headers.get('authorization');
    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json({
      ok: true,
      skipped: true,
      reason: 'Supabase not configured',
    });
  }

  const supabase = createServiceClient();
  const { data: entities } = await supabase.from('entities').select('id').limit(500);
  let materialized = 0;
  for (const entity of entities ?? []) {
    await materializeEntity(entity.id);
    materialized += 1;
  }

  // Queue due reminders into notification_jobs (stub delivery)
  const now = new Date().toISOString();
  const { data: dueReminders } = await supabase
    .from('reminders')
    .select('id, channel, filing_id, lead_days')
    .eq('status', 'pending')
    .lte('fire_at', now)
    .limit(100);

  let jobs = 0;
  for (const reminder of dueReminders ?? []) {
    const { data: job } = await supabase
      .from('notification_jobs')
      .insert({
        reminder_id: reminder.id,
        channel: reminder.channel,
        status: 'pending',
        payload: {
          filingId: reminder.filing_id,
          leadDays: reminder.lead_days,
          body: `Compliance reminder T-${reminder.lead_days}`,
          to: 'stub@complianceeasily.com',
        },
      })
      .select('id')
      .maybeSingle();

    await supabase.from('reminders').update({ status: 'queued' }).eq('id', reminder.id);

    if (job?.id) {
      const result = await processNotificationJob({
        id: job.id,
        channel: reminder.channel,
        payload: {
          to: 'stub@complianceeasily.com',
          body: `Compliance reminder T-${reminder.lead_days}`,
        },
      });
      await supabase
        .from('notification_jobs')
        .update({
          status: result.ok ? 'sent' : 'failed',
          error: result.error,
          processed_at: new Date().toISOString(),
        })
        .eq('id', job.id);
      jobs += 1;
    }
  }

  return NextResponse.json({ ok: true, materialized, jobs });
}
