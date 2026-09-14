'use server';

import { createClient } from '@/lib/supabase/server';
import { isSupabaseConfigured, createServiceClient } from '@/lib/supabase/admin';
import {
  evaluateTrigger,
  entityToProfile,
  nextDueDate,
  reminderDates,
} from '@/lib/compliance/matcher';
import type { ComplianceTrigger, EntityComplianceProfile } from '@/lib/compliance/types';
import rawDataset from '@/data/complianceTriggers.json';
import type { ComplianceTriggerDataset } from '@/lib/compliance/types';

const localDataset = rawDataset as ComplianceTriggerDataset;

function rowToTrigger(row: Record<string, unknown>): ComplianceTrigger {
  return {
    id: row.id as string,
    name: row.name as string,
    shortName: (row.short_name as string) ?? (row.shortName as string),
    departmentId: (row.department_id as string) ?? (row.departmentId as string),
    categoryId: (row.category_id as string) ?? (row.categoryId as string),
    triggerType: (row.trigger_type as ComplianceTrigger['triggerType']) ?? (row.triggerType as ComplianceTrigger['triggerType']),
    priority: row.priority as ComplianceTrigger['priority'],
    status: row.status as ComplianceTrigger['status'],
    legalReference: (row.legal_reference as string) ?? (row.legalReference as string) ?? '',
    forms: (row.forms as string[]) ?? [],
    description: (row.description as string) ?? '',
    sourceUrl: (row.source_url as string) ?? (row.sourceUrl as string) ?? '',
    lastVerified: (row.last_verified as string) ?? (row.lastVerified as string) ?? '',
    applicability: row.applicability as ComplianceTrigger['applicability'],
    schedule: row.schedule as ComplianceTrigger['schedule'],
    notification: row.notification as ComplianceTrigger['notification'],
    thresholds: (row.thresholds as ComplianceTrigger['thresholds']) ?? [],
    penaltySummary: (row.penalty_summary as ComplianceTrigger['penaltySummary']) ?? (row.penaltySummary as ComplianceTrigger['penaltySummary']),
    linkedServiceIds: (row.linked_service_ids as string[]) ?? (row.linkedServiceIds as string[]) ?? [],
    protectionEligible: (row.protection_eligible as boolean) ?? (row.protectionEligible as boolean) ?? false,
    professionalType: (row.professional_type as ComplianceTrigger['professionalType']) ?? (row.professionalType as ComplianceTrigger['professionalType']),
  };
}

async function loadTriggers(): Promise<ComplianceTrigger[]> {
  if (!isSupabaseConfigured()) {
    return localDataset.triggers;
  }
  const supabase = await createClient();
  const { data, error } = await supabase.from('compliance_triggers').select('*');
  if (error || !data?.length) {
    return localDataset.triggers;
  }
  return data.map((r) => rowToTrigger(r as Record<string, unknown>));
}

async function loadEntityProfile(entityId: string): Promise<EntityComplianceProfile | null> {
  if (!isSupabaseConfigured()) {
    const { ENTITIES } = await import('@/data/dashboard/entities');
    const entity = ENTITIES.find((e) => e.id === entityId);
    return entity ? entityToProfile(entity) : null;
  }
  const supabase = await createClient();
  const { data } = await supabase.from('entities').select('*').eq('id', entityId).maybeSingle();
  if (!data) return null;
  return entityToProfile({
    id: data.id,
    name: data.name,
    entityType: data.entity_type,
    state: data.state,
    industry: data.industry,
    clientId: data.client_id,
    employees: data.employees ?? undefined,
    annualTurnoverInr: data.annual_turnover_inr ?? undefined,
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
    nextDue: string | null;
    reminders: string[];
  }>;
};

export async function evaluateEntity(entityId: string): Promise<EvaluateResult> {
  const profile = await loadEntityProfile(entityId);
  if (!profile) {
    return { entityId, matches: [] };
  }

  const triggers = await loadTriggers();
  const matches = triggers
    .map((trigger) => {
      const { applies, reasons } = evaluateTrigger(profile, trigger);
      if (!applies) return null;
      const due = nextDueDate(trigger);
      return {
        trigger,
        reasons,
        nextDue: due ? due.toISOString().slice(0, 10) : null,
        reminders: reminderDates(trigger, due),
      };
    })
    .filter((x): x is NonNullable<typeof x> => x != null);

  if (isSupabaseConfigured()) {
    const supabase = createServiceClient();
    const rows = triggers.map((trigger) => {
      const hit = matches.find((m) => m.trigger.id === trigger.id);
      return {
        entity_id: entityId,
        trigger_id: trigger.id,
        applies: Boolean(hit),
        reasons: hit?.reasons ?? evaluateTrigger(profile, trigger).reasons,
        evaluated_at: new Date().toISOString(),
      };
    });
    // Upsert in chunks
    for (let i = 0; i < rows.length; i += 100) {
      await supabase.from('entity_trigger_matches').upsert(rows.slice(i, i + 100), {
        onConflict: 'entity_id,trigger_id',
      });
    }
  }

  return { entityId, matches };
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
}> {
  const evaluated = await evaluateEntity(entityId);
  if (!isSupabaseConfigured()) {
    return {
      filingsUpserted: evaluated.matches.filter((m) => m.nextDue).length,
      remindersUpserted: 0,
    };
  }

  const supabase = createServiceClient();
  const { data: entity } = await supabase
    .from('entities')
    .select('id, workspace_id, name')
    .eq('id', entityId)
    .maybeSingle();
  if (!entity) {
    return { filingsUpserted: 0, remindersUpserted: 0 };
  }

  let filingsUpserted = 0;
  let remindersUpserted = 0;

  for (const match of evaluated.matches) {
    if (!match.nextDue) continue;
    const due = new Date(match.nextDue + 'T12:00:00');
    const period = periodLabelFor(match.trigger, due);
    const filingId = `fil-${entityId}-${match.trigger.id}-${period}`.replace(/\s+/g, '-').toLowerCase();

    const { error } = await supabase.from('filings').upsert(
      {
        id: filingId,
        entity_id: entityId,
        workspace_id: entity.workspace_id,
        trigger_id: match.trigger.id,
        name: match.trigger.name,
        short_name: match.trigger.shortName,
        department: match.trigger.departmentId,
        category: match.trigger.categoryId,
        due_date: match.nextDue,
        period_label: period,
        status: 'upcoming',
        protection_eligible: match.trigger.protectionEligible,
      },
      { onConflict: 'id' },
    );
    if (!error) {
      filingsUpserted += 1;
      const channels = match.trigger.notification.channels ?? ['in_app'];
      for (const lead of match.trigger.notification.leadDays ?? []) {
        const fire = new Date(due);
        fire.setDate(fire.getDate() - lead);
        for (const channel of channels) {
          const { error: remErr } = await supabase.from('reminders').upsert(
            {
              filing_id: filingId,
              channel,
              lead_days: lead,
              fire_at: fire.toISOString(),
              status: 'pending',
            },
            { onConflict: 'filing_id,channel,lead_days' },
          );
          if (!remErr) remindersUpserted += 1;
        }
      }
    }
  }

  return { filingsUpserted, remindersUpserted };
}
