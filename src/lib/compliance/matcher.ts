import type {
  ComplianceTrigger,
  ComplianceTriggerDataset,
  EntityComplianceProfile,
  TriggerMatchResult,
  TriggerSchedule,
} from './types';

function includesAll(haystack: string[] | undefined, needles: string[]): boolean {
  if (!needles.length) return true;
  const set = new Set((haystack ?? []).map((s) => s.toLowerCase()));
  return needles.every((n) => set.has(n.toLowerCase()));
}

function includesAny(haystack: string[] | undefined, needles: string[]): boolean {
  if (!needles.length) return false;
  const set = new Set((haystack ?? []).map((s) => s.toLowerCase()));
  return needles.some((n) => set.has(n.toLowerCase()));
}

function industryMatches(
  profileIndustry: string,
  rule: string[] | 'all',
): boolean {
  if (rule === 'all') return true;
  if (!rule.length) return true;
  const ind = profileIndustry.toLowerCase();
  return rule.some(
    (r) =>
      ind === r.toLowerCase() ||
      ind.includes(r.toLowerCase()) ||
      r.toLowerCase().includes(ind),
  );
}

function stateMatches(profileState: string, rule: string[] | 'all'): boolean {
  if (rule === 'all') return true;
  if (!rule.length) return true;
  return rule.some((s) => s.toLowerCase() === profileState.toLowerCase());
}

/**
 * Evaluate whether a trigger applies to an entity profile.
 * Returns boolean + human-readable reasons (both match and miss reasons).
 */
export function evaluateTrigger(
  profile: EntityComplianceProfile,
  trigger: ComplianceTrigger,
): TriggerMatchResult {
  const reasons: string[] = [];
  const a = trigger.applicability;
  let applies = true;

  if (a.entityTypes?.length && !a.entityTypes.includes(profile.entityType)) {
    applies = false;
    reasons.push(`Entity type ${profile.entityType} not in [${a.entityTypes.join(', ')}]`);
  } else if (a.entityTypes?.length) {
    reasons.push(`Entity type ${profile.entityType} matches`);
  }

  if (a.minTurnoverInr != null) {
    const t = profile.annualTurnoverInr ?? 0;
    if (t < a.minTurnoverInr) {
      applies = false;
      reasons.push(`Turnover ₹${t.toLocaleString('en-IN')} below min ₹${a.minTurnoverInr.toLocaleString('en-IN')}`);
    } else {
      reasons.push(`Turnover meets minimum ₹${a.minTurnoverInr.toLocaleString('en-IN')}`);
    }
  }

  if (a.maxTurnoverInr != null) {
    const t = profile.annualTurnoverInr ?? 0;
    if (t > a.maxTurnoverInr) {
      applies = false;
      reasons.push(`Turnover ₹${t.toLocaleString('en-IN')} above max ₹${a.maxTurnoverInr.toLocaleString('en-IN')}`);
    } else {
      reasons.push(`Turnover within max ₹${a.maxTurnoverInr.toLocaleString('en-IN')}`);
    }
  }

  if (a.minEmployees != null) {
    const e = profile.employees ?? 0;
    if (e < a.minEmployees) {
      applies = false;
      reasons.push(`Employees ${e} below minimum ${a.minEmployees}`);
    } else {
      reasons.push(`Headcount ${e} ≥ ${a.minEmployees}`);
    }
  }

  if (!industryMatches(profile.industry, a.industries)) {
    applies = false;
    reasons.push(`Industry "${profile.industry}" not in applicability list`);
  } else if (a.industries !== 'all') {
    reasons.push(`Industry "${profile.industry}" matches`);
  }

  if (!stateMatches(profile.state, a.states)) {
    applies = false;
    reasons.push(`State "${profile.state}" not in applicability list`);
  } else if (a.states !== 'all') {
    reasons.push(`State "${profile.state}" matches`);
  }

  if (a.requiresRegistrations?.length) {
    if (!includesAll(profile.registrations, a.requiresRegistrations)) {
      applies = false;
      reasons.push(`Missing registrations: ${a.requiresRegistrations.join(', ')}`);
    } else {
      reasons.push(`Has required registrations: ${a.requiresRegistrations.join(', ')}`);
    }
  }

  if (a.excludesRegistrations?.length) {
    if (includesAny(profile.registrations, a.excludesRegistrations)) {
      applies = false;
      reasons.push(`Already has excluding registration(s): ${a.excludesRegistrations.join(', ')}`);
    } else {
      reasons.push(`No excluding registrations present`);
    }
  }

  if (trigger.status === 'draft') {
    applies = false;
    reasons.push('Trigger is in draft status');
  }

  return { applies, reasons };
}

export function triggersForEntity(
  profile: EntityComplianceProfile,
  dataset: ComplianceTriggerDataset,
): Array<{ trigger: ComplianceTrigger; reasons: string[] }> {
  return dataset.triggers
    .map((trigger) => {
      const { applies, reasons } = evaluateTrigger(profile, trigger);
      return applies ? { trigger, reasons } : null;
    })
    .filter((x): x is { trigger: ComplianceTrigger; reasons: string[] } => x != null);
}

export function entitiesForTrigger(
  trigger: ComplianceTrigger,
  profiles: EntityComplianceProfile[],
): Array<{ profile: EntityComplianceProfile; reasons: string[] }> {
  return profiles
    .map((profile) => {
      const { applies, reasons } = evaluateTrigger(profile, trigger);
      return applies ? { profile, reasons } : null;
    })
    .filter((x): x is { profile: EntityComplianceProfile; reasons: string[] } => x != null);
}

function daysInMonth(year: number, monthIndex: number): number {
  return new Date(year, monthIndex + 1, 0).getDate();
}

function atLocalNoon(year: number, monthIndex: number, day: number): Date {
  const d = Math.min(day, daysInMonth(year, monthIndex));
  return new Date(year, monthIndex, d, 12, 0, 0, 0);
}

function nextOccurrenceFromMonths(
  today: Date,
  months: number[],
  dueDay: number,
): Date | null {
  if (!months.length) return null;
  const y = today.getFullYear();
  const candidates: Date[] = [];
  for (const offsetYear of [0, 1]) {
    for (const m of months) {
      candidates.push(atLocalNoon(y + offsetYear, m - 1, dueDay));
    }
  }
  candidates.sort((a, b) => a.getTime() - b.getTime());
  return candidates.find((c) => c.getTime() >= today.getTime()) ?? null;
}

/**
 * Compute the next calendar due date for schedule-driven triggers.
 * Returns null for continuous / one_time / event without a fixed calendar.
 */
export function nextDueDate(
  trigger: ComplianceTrigger,
  today: Date = new Date(),
): Date | null {
  const schedule: TriggerSchedule = trigger.schedule;
  const dueDay = schedule.dueDay ?? 1;
  const startOfToday = atLocalNoon(today.getFullYear(), today.getMonth(), today.getDate());

  switch (schedule.frequency) {
    case 'monthly': {
      let candidate = atLocalNoon(startOfToday.getFullYear(), startOfToday.getMonth(), dueDay);
      if (candidate.getTime() < startOfToday.getTime()) {
        candidate = atLocalNoon(startOfToday.getFullYear(), startOfToday.getMonth() + 1, dueDay);
      }
      return candidate;
    }
    case 'quarterly': {
      const months = schedule.dueMonths?.length
        ? schedule.dueMonths
        : [3, 6, 9, 12];
      return nextOccurrenceFromMonths(startOfToday, months, dueDay);
    }
    case 'half_yearly': {
      const months = schedule.dueMonths?.length ? schedule.dueMonths : [6, 12];
      return nextOccurrenceFromMonths(startOfToday, months, dueDay);
    }
    case 'annual': {
      const months = schedule.dueMonths?.length ? schedule.dueMonths : [3];
      return nextOccurrenceFromMonths(startOfToday, months, dueDay);
    }
    case 'renewal':
    case 'event':
    case 'one_time':
    case 'continuous':
    default:
      return null;
  }
}

export function formatDueDate(d: Date | null): string {
  if (!d) return 'Event / ongoing';
  return d.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function reminderDates(trigger: ComplianceTrigger, due: Date | null): string[] {
  if (!due) return [];
  return (trigger.notification.leadDays ?? [])
    .map((lead) => {
      const r = new Date(due);
      r.setDate(r.getDate() - lead);
      return `T-${lead}: ${formatDueDate(r)}`;
    })
    .sort();
}

export function entityToProfile(entity: {
  id: string;
  name: string;
  entityType: string;
  state: string;
  industry: string;
  locations?: number;
  clientId?: string;
  employees?: number;
  annualTurnoverInr?: number;
  registrations?: string[];
  activities?: string[];
}): EntityComplianceProfile {
  return {
    id: entity.id,
    name: entity.name,
    clientId: entity.clientId,
    entityType: entity.entityType,
    state: entity.state,
    industry: entity.industry,
    locations: entity.locations,
    employees: entity.employees,
    annualTurnoverInr: entity.annualTurnoverInr,
    registrations: entity.registrations ?? [],
    activities: entity.activities ?? [],
  };
}
