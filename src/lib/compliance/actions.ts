'use server';

import { prisma, isPrismaConfigured } from '@/lib/prisma';
import {
  evaluateTrigger,
  entityToProfile,
  nextDueDate,
  reminderDates,
  canMaterialize,
} from '@/lib/compliance/matcher';
import type {
  ComplianceTrigger,
  EntityComplianceProfile,
  ApplicabilityResult,
} from '@/lib/compliance/types';
import rawDataset from '@/data/complianceTriggers.json';
import type { ComplianceTriggerDataset } from '@/lib/compliance/types';
import type { NotifyChannel, Prisma } from '@prisma/client';

const localDataset = rawDataset as ComplianceTriggerDataset;

function mapTrigger(row: {
  id: string;
  name: string;
  shortName: string;
  departmentId: string;
  categoryId: string;
  triggerTypeId: string;
  priority: ComplianceTrigger['priority'];
  status: ComplianceTrigger['status'];
  legalReference: string | null;
  forms: string[];
  description: string | null;
  sourceUrl: string | null;
  lastVerified: Date | null;
  applicability: unknown;
  schedule: unknown;
  notification: unknown;
  thresholds: unknown;
  penaltySummary: unknown;
  linkedServiceIds: string[];
  protectionEligible: boolean;
  professionalType: ComplianceTrigger['professionalType'];
  ruleId?: string | null;
  complianceId?: string | null;
  jurisdictionId?: string | null;
  obligationKind?: string | null;
  scopeLevel?: string | null;
  verificationStatus?: string | null;
  deadlineText?: string | null;
  scheduleSource?: string | null;
  automationEnabled?: boolean | null;
  processJson?: unknown;
  documentsJson?: unknown;
  conditionJson?: unknown;
  evidenceJson?: unknown;
}): ComplianceTrigger {
  return {
    id: row.id,
    name: row.name,
    shortName: row.shortName,
    departmentId: row.departmentId,
    categoryId: row.categoryId,
    triggerType: row.triggerTypeId as ComplianceTrigger['triggerType'],
    priority: row.priority,
    status: row.status,
    legalReference: row.legalReference ?? '',
    forms: row.forms,
    description: row.description ?? '',
    sourceUrl: row.sourceUrl ?? '',
    lastVerified: row.lastVerified ? row.lastVerified.toISOString().slice(0, 10) : '',
    applicability: row.applicability as ComplianceTrigger['applicability'],
    schedule: row.schedule as ComplianceTrigger['schedule'],
    notification: row.notification as ComplianceTrigger['notification'],
    thresholds: (row.thresholds as ComplianceTrigger['thresholds']) ?? [],
    penaltySummary: row.penaltySummary as ComplianceTrigger['penaltySummary'],
    linkedServiceIds: row.linkedServiceIds,
    protectionEligible: row.protectionEligible,
    professionalType: row.professionalType,
    ruleId: row.ruleId,
    complianceId: row.complianceId,
    jurisdictionId: row.jurisdictionId,
    obligationKind: row.obligationKind ?? 'mandatory_if_applicable',
    scopeLevel: row.scopeLevel ?? 'central',
    verificationStatus: row.verificationStatus ?? 'imported_unverified',
    deadlineText: row.deadlineText ?? '',
    scheduleSource: (row.scheduleSource as ComplianceTrigger['scheduleSource']) ?? 'curated_unverified',
    automationEnabled: Boolean(row.automationEnabled),
    process: (row.processJson as ComplianceTrigger['process']) ?? null,
    documents: (row.documentsJson as ComplianceTrigger['documents']) ?? [],
    condition: (row.conditionJson as ComplianceTrigger['condition']) ?? null,
    evidence: (row.evidenceJson as ComplianceTrigger['evidence']) ?? [],
  };
}

async function loadTriggers(): Promise<ComplianceTrigger[]> {
  if (!isPrismaConfigured()) {
    return localDataset.triggers;
  }
  try {
    const rows = await prisma.complianceTrigger.findMany();
    if (!rows.length) return localDataset.triggers;
    return rows.map(mapTrigger);
  } catch {
    return localDataset.triggers;
  }
}

async function loadEntityProfile(entityId: string): Promise<EntityComplianceProfile | null> {
  if (!isPrismaConfigured()) {
    const { ENTITIES } = await import('@/data/dashboard/entities');
    const entity = ENTITIES.find((e) => e.id === entityId);
    return entity ? entityToProfile(entity) : null;
  }
  const data = await prisma.entity.findUnique({ where: { id: entityId } });
  if (!data) return null;
  return entityToProfile({
    id: data.id,
    name: data.name,
    entityType: data.entityType,
    state: data.state,
    industry: data.industry,
    clientId: data.clientId,
    employees: data.employees ?? undefined,
    annualTurnoverInr: data.annualTurnoverInr != null ? Number(data.annualTurnoverInr) : undefined,
    registrations: data.registrations ?? [],
    activities: data.activities ?? [],
    locations: data.locations,
  });
}

export type EvaluateResult = {
  entityId: string;
  matches: Array<{
    trigger: ComplianceTrigger;
    reasons: string[];
    result: ApplicabilityResult;
    missingFacts: string[];
    nextDue: string | null;
    reminders: string[];
  }>;
  reviewQueue: Array<{
    trigger: ComplianceTrigger;
    reasons: string[];
    result: ApplicabilityResult;
    missingFacts: string[];
  }>;
};

export async function evaluateEntity(entityId: string): Promise<EvaluateResult> {
  const profile = await loadEntityProfile(entityId);
  if (!profile) {
    return { entityId, matches: [], reviewQueue: [] };
  }

  const triggers = await loadTriggers();
  const matches: EvaluateResult['matches'] = [];
  const reviewQueue: EvaluateResult['reviewQueue'] = [];

  for (const trigger of triggers) {
    const { applies, reasons, result, missingFacts } = evaluateTrigger(profile, trigger);
    if (result === 'needs_review' || result === 'unknown') {
      reviewQueue.push({ trigger, reasons, result, missingFacts });
    }
    if (!applies) continue;
    const due = nextDueDate(trigger);
    matches.push({
      trigger,
      reasons,
      result,
      missingFacts,
      nextDue: due ? due.toISOString().slice(0, 10) : null,
      reminders: reminderDates(trigger, due),
    });
  }

  if (isPrismaConfigured()) {
    const rows = triggers.map((trigger) => {
      const hit = matches.find((m) => m.trigger.id === trigger.id);
      const evaluated = hit
        ? {
            applies: true,
            reasons: hit.reasons,
            result: hit.result,
            missingFacts: hit.missingFacts,
          }
        : evaluateTrigger(profile, trigger);
      return {
        entityId,
        triggerId: trigger.id,
        applies: Boolean(hit),
        reasons: evaluated.reasons,
        result: evaluated.result,
        missingFacts: evaluated.missingFacts,
        evaluatedAt: new Date(),
      };
    });

    for (let i = 0; i < rows.length; i += 100) {
      const chunk = rows.slice(i, i + 100);
      await prisma.$transaction(
        chunk.map((row) =>
          prisma.entityTriggerMatch.upsert({
            where: {
              entityId_triggerId: {
                entityId: row.entityId,
                triggerId: row.triggerId,
              },
            },
            create: {
              entityId: row.entityId,
              triggerId: row.triggerId,
              applies: row.applies,
              reasons: row.reasons as Prisma.InputJsonValue,
              evaluatedAt: row.evaluatedAt,
              result: row.result,
              missingFacts: row.missingFacts,
            } as unknown as Prisma.EntityTriggerMatchCreateInput,
            update: {
              applies: row.applies,
              reasons: row.reasons as Prisma.InputJsonValue,
              evaluatedAt: row.evaluatedAt,
              result: row.result,
              missingFacts: row.missingFacts,
            } as unknown as Prisma.EntityTriggerMatchUpdateInput,
          }),
        ),
      );
    }
  }

  return { entityId, matches, reviewQueue };
}

function periodLabelFor(trigger: ComplianceTrigger, due: Date): string {
  const freq = trigger.schedule.frequency;
  const y = due.getFullYear();
  const m = due.getMonth() + 1;
  if (freq === 'monthly') {
    return `${due.toLocaleString('en-IN', { month: 'short' })} ${y}`;
  }
  if (freq === 'quarterly') {
    const q = Math.ceil(m / 3);
    return `Q${q} FY ${m >= 4 ? `${y}-${String(y + 1).slice(2)}` : `${y - 1}-${String(y).slice(2)}`}`;
  }
  if (freq === 'half_yearly') {
    return m <= 6 ? `H1 ${y}` : `H2 ${y}`;
  }
  if (freq === 'annual') {
    return `FY ${m >= 4 ? `${y}-${String(y + 1).slice(2)}` : `${y - 1}-${String(y).slice(2)}`}`;
  }
  return due.toISOString().slice(0, 10);
}

export async function materializeEntity(entityId: string): Promise<{
  filingsUpserted: number;
  remindersUpserted: number;
  skippedForReview: number;
}> {
  const evaluated = await evaluateEntity(entityId);
  const materializable = evaluated.matches.filter(
    (m) => m.nextDue && canMaterialize(m.trigger),
  );
  const skippedForReview =
    evaluated.matches.filter((m) => m.nextDue && !canMaterialize(m.trigger)).length +
    evaluated.reviewQueue.length;

  if (!isPrismaConfigured()) {
    return {
      filingsUpserted: materializable.length,
      remindersUpserted: 0,
      skippedForReview,
    };
  }

  const entity = await prisma.entity.findUnique({
    where: { id: entityId },
    select: { id: true, workspaceId: true, name: true },
  });
  if (!entity) {
    return { filingsUpserted: 0, remindersUpserted: 0, skippedForReview };
  }

  let filingsUpserted = 0;
  let remindersUpserted = 0;

  for (const match of materializable) {
    if (!match.nextDue) continue;
    const due = new Date(match.nextDue + 'T12:00:00');
    const period = periodLabelFor(match.trigger, due);
    const filingId = `fil-${entityId}-${match.trigger.id}-${period}`
      .replace(/\s+/g, '-')
      .toLowerCase();

    try {
      await prisma.filing.upsert({
        where: { id: filingId },
        create: {
          id: filingId,
          entityId,
          workspaceId: entity.workspaceId,
          triggerId: match.trigger.id,
          name: match.trigger.name,
          shortName: match.trigger.shortName,
          department: match.trigger.departmentId,
          category: match.trigger.categoryId,
          dueDate: new Date(match.nextDue),
          periodLabel: period,
          status: 'upcoming',
          protectionEligible: match.trigger.protectionEligible,
          notes:
            match.trigger.scheduleSource === 'curated_unverified'
              ? 'Schedule source: curated_unverified — re-verify deadline before filing.'
              : undefined,
        },
        update: {
          name: match.trigger.name,
          shortName: match.trigger.shortName,
          department: match.trigger.departmentId,
          category: match.trigger.categoryId,
          dueDate: new Date(match.nextDue),
          periodLabel: period,
          protectionEligible: match.trigger.protectionEligible,
        },
      });
      filingsUpserted += 1;

      const channels = (match.trigger.notification.channels ?? ['in_app']) as NotifyChannel[];
      for (const lead of match.trigger.notification.leadDays ?? []) {
        const fire = new Date(due);
        fire.setDate(fire.getDate() - lead);
        for (const channel of channels) {
          await prisma.reminder.upsert({
            where: {
              filingId_channel_leadDays: {
                filingId,
                channel,
                leadDays: lead,
              },
            },
            create: {
              filingId,
              channel,
              leadDays: lead,
              fireAt: fire,
              status: 'pending',
            },
            update: {
              fireAt: fire,
              status: 'pending',
            },
          });
          remindersUpserted += 1;
        }
      }
    } catch {
      // skip failed filing upsert
    }
  }

  return { filingsUpserted, remindersUpserted, skippedForReview };
}
