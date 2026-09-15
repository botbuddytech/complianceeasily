import { NextResponse } from 'next/server';
import { prisma, isPrismaConfigured } from '@/lib/prisma';
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

  if (!isPrismaConfigured()) {
    return NextResponse.json({
      ok: true,
      skipped: true,
      reason: 'DATABASE_URL not configured',
    });
  }

  const entities = await prisma.entity.findMany({ select: { id: true }, take: 500 });
  let materialized = 0;
  for (const entity of entities) {
    await materializeEntity(entity.id);
    materialized += 1;
  }

  const dueReminders = await prisma.reminder.findMany({
    where: {
      status: 'pending',
      fireAt: { lte: new Date() },
    },
    select: { id: true, channel: true, filingId: true, leadDays: true },
    take: 100,
  });

  let jobs = 0;
  for (const reminder of dueReminders) {
    const job = await prisma.notificationJob.create({
      data: {
        reminderId: reminder.id,
        channel: reminder.channel,
        status: 'pending',
        payload: {
          filingId: reminder.filingId,
          leadDays: reminder.leadDays,
          body: `Compliance reminder T-${reminder.leadDays}`,
          to: 'stub@complianceeasily.com',
        },
      },
      select: { id: true },
    });

    await prisma.reminder.update({
      where: { id: reminder.id },
      data: { status: 'queued' },
    });

    const result = await processNotificationJob({
      id: job.id,
      channel: reminder.channel,
      payload: {
        to: 'stub@complianceeasily.com',
        body: `Compliance reminder T-${reminder.leadDays}`,
      },
    });

    await prisma.notificationJob.update({
      where: { id: job.id },
      data: {
        status: result.ok ? 'sent' : 'failed',
        error: result.error,
        processedAt: new Date(),
      },
    });
    jobs += 1;
  }

  return NextResponse.json({ ok: true, materialized, jobs });
}
