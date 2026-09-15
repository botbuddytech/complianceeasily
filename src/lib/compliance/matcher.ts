import type {
  ComplianceTrigger,
  ComplianceTriggerDataset,
  ConditionExpression,
  ConditionNode,
  EntityComplianceProfile,
  TriggerMatchResult,
  TriggerSchedule,
  ApplicabilityResult,
} from './types';
import {
  ENTITY_TYPE_TO_ID,
  FILING_ELIGIBLE_OBLIGATION_KINDS,
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

function resolveEntityTypeId(profile: EntityComplianceProfile): string | undefined {
  if (profile.entityTypeId) return profile.entityTypeId;
  return ENTITY_TYPE_TO_ID[profile.entityType];
}

function getFact(
  profile: EntityComplianceProfile,
  field: string,
): string | number | boolean | null | undefined {
  if (profile.facts && field in profile.facts) {
    return profile.facts[field];
  }
  // Map common flat profile fields onto codex fact ids
  switch (field) {
    case 'entity_type':
      return resolveEntityTypeId(profile) ?? profile.entityType;
    case 'state_ut':
      return profile.state;
    case 'employee_count':
    case 'worker_count':
      return profile.employees;
    case 'pan_aggregate_turnover_inr':
    case 'business_turnover_inr':
    case 'company_turnover_inr':
      return profile.annualTurnoverInr;
    case 'gst_registered':
      return includesAny(profile.registrations, ['GSTIN', 'GST']);
    default:
      return undefined;
  }
}

type EvalOutcome = 'true' | 'false' | 'unknown';

function compare(
  left: string | number | boolean,
  op: string,
  right: string | number | boolean,
): boolean {
  if (op === 'eq') return left === right;
  const ln = Number(left);
  const rn = Number(right);
  if (Number.isNaN(ln) || Number.isNaN(rn)) return false;
  switch (op) {
    case 'gt':
      return ln > rn;
    case 'gte':
      return ln >= rn;
    case 'lt':
      return ln < rn;
    case 'lte':
      return ln <= rn;
    default:
      return false;
  }
}

/**
 * Evaluate a codex all/any condition expression.
 * Missing facts yield `unknown` — never silently `false`.
 */
export function evaluateConditionExpression(
  expression: ConditionExpression | ConditionNode | null | undefined,
  profile: EntityComplianceProfile,
  missingFacts: string[],
): EvalOutcome {
  if (!expression || typeof expression !== 'object') return 'true';

  if ('field' in expression && expression.field) {
    const value = getFact(profile, expression.field);
    if (value === undefined || value === null) {
      if (!missingFacts.includes(expression.field)) missingFacts.push(expression.field);
      return 'unknown';
    }
    return compare(value, expression.op, expression.value) ? 'true' : 'false';
  }

  const expr = expression as ConditionExpression;
  if (expr.all?.length) {
    let sawUnknown = false;
    for (const node of expr.all) {
      const r = evaluateConditionExpression(node, profile, missingFacts);
      if (r === 'false') return 'false';
      if (r === 'unknown') sawUnknown = true;
    }
    return sawUnknown ? 'unknown' : 'true';
  }
  if (expr.any?.length) {
    let sawUnknown = false;
    let sawTrue = false;
    for (const node of expr.any) {
      const r = evaluateConditionExpression(node, profile, missingFacts);
      if (r === 'true') sawTrue = true;
      if (r === 'unknown') sawUnknown = true;
    }
    if (sawTrue) return 'true';
    if (sawUnknown) return 'unknown';
    return 'false';
  }
  return 'true';
}

function assetScopeMatches(
  trigger: ComplianceTrigger,
  profile: EntityComplianceProfile,
): EvalOutcome {
  const scopes = trigger.assetScopes;
  if (!scopes?.length) return 'true';
  const holdings = profile.assetHoldings;
  if (!holdings?.length) return 'unknown';
  const ok = scopes.some((s) =>
    holdings.some(
      (h) => h.assetClassId === s.assetClassId && h.actorRole === s.actorRole,
    ),
  );
  return ok ? 'true' : 'false';
}

/**
 * Evaluate whether a trigger applies to an entity profile.
 * Returns tri-state result + human-readable reasons + missing facts.
 */
export function evaluateTrigger(
  profile: EntityComplianceProfile,
  trigger: ComplianceTrigger,
): TriggerMatchResult {
  const reasons: string[] = [];
  const missingFacts: string[] = [];
  const a = trigger.applicability;
  let result: ApplicabilityResult = 'applicable';

  const fail = (reason: string) => {
    result = 'not_applicable';
    reasons.push(reason);
  };
  const unknown = (reason: string) => {
    if (result === 'applicable') result = 'unknown';
    reasons.push(reason);
  };
  const needsReview = (reason: string) => {
    if (result === 'applicable' || result === 'unknown') result = 'needs_review';
    reasons.push(reason);
  };

  // Draft / non-automation rules still evaluate applicability for UI mapping,
  // but draft status marks needs_review rather than hard not_applicable.
  if (trigger.status === 'draft') {
    needsReview('Trigger is in draft status — requires review before automation');
  }

  const entityIds = a.entityTypeIds;
  if (entityIds?.length) {
    const id = resolveEntityTypeId(profile);
    if (!id) {
      unknown(`Entity type "${profile.entityType}" has no catalogue mapping`);
    } else if (!entityIds.includes(id)) {
      fail(`Entity type ${profile.entityType} (${id}) not in [${entityIds.join(', ')}]`);
    } else {
      reasons.push(`Entity type ${profile.entityType} matches`);
    }
  } else if (a.entityTypes?.length && !a.entityTypes.includes(profile.entityType)) {
    // Also allow reverse match via catalogue ids
    const id = resolveEntityTypeId(profile);
    const displays = id
      ? a.entityTypes.some((et) => ENTITY_TYPE_TO_ID[et] === id || et === profile.entityType)
      : false;
    if (!displays && !a.entityTypes.includes(profile.entityType)) {
      fail(`Entity type ${profile.entityType} not in [${a.entityTypes.join(', ')}]`);
    } else {
      reasons.push(`Entity type ${profile.entityType} matches`);
    }
  } else if (a.entityTypes?.length) {
    reasons.push(`Entity type ${profile.entityType} matches`);
  }

  if (a.minTurnoverInr != null) {
    if (profile.annualTurnoverInr == null && profile.facts?.pan_aggregate_turnover_inr == null) {
      unknown('Turnover fact missing (pan_aggregate_turnover_inr / annualTurnoverInr)');
      if (!missingFacts.includes('pan_aggregate_turnover_inr')) {
        missingFacts.push('pan_aggregate_turnover_inr');
      }
    } else {
      const t =
        profile.annualTurnoverInr ??
        Number(profile.facts?.pan_aggregate_turnover_inr ?? 0);
      if (t < a.minTurnoverInr) {
        fail(`Turnover ₹${t.toLocaleString('en-IN')} below min ₹${a.minTurnoverInr.toLocaleString('en-IN')}`);
      } else {
        reasons.push(`Turnover meets minimum ₹${a.minTurnoverInr.toLocaleString('en-IN')}`);
      }
    }
  }

  if (a.maxTurnoverInr != null) {
    if (profile.annualTurnoverInr == null && profile.facts?.pan_aggregate_turnover_inr == null) {
      unknown('Turnover fact missing for max check');
      if (!missingFacts.includes('pan_aggregate_turnover_inr')) {
        missingFacts.push('pan_aggregate_turnover_inr');
      }
    } else {
      const t =
        profile.annualTurnoverInr ??
        Number(profile.facts?.pan_aggregate_turnover_inr ?? 0);
      if (t > a.maxTurnoverInr) {
        fail(`Turnover ₹${t.toLocaleString('en-IN')} above max ₹${a.maxTurnoverInr.toLocaleString('en-IN')}`);
      } else {
        reasons.push(`Turnover within max ₹${a.maxTurnoverInr.toLocaleString('en-IN')}`);
      }
    }
  }

  if (a.minEmployees != null) {
    if (profile.employees == null && profile.facts?.employee_count == null) {
      unknown('Employee count fact missing');
      if (!missingFacts.includes('employee_count')) missingFacts.push('employee_count');
    } else {
      const e = profile.employees ?? Number(profile.facts?.employee_count ?? 0);
      if (e < a.minEmployees) {
        fail(`Employees ${e} below minimum ${a.minEmployees}`);
      } else {
        reasons.push(`Headcount ${e} ≥ ${a.minEmployees}`);
      }
    }
  }

  if (!industryMatches(profile.industry, a.industries)) {
    fail(`Industry "${profile.industry}" not in applicability list`);
  } else if (a.industries !== 'all') {
    reasons.push(`Industry "${profile.industry}" matches`);
  }

  if (!stateMatches(profile.state, a.states)) {
    fail(`State "${profile.state}" not in applicability list`);
  } else if (a.states !== 'all') {
    reasons.push(`State "${profile.state}" matches`);
  }

  if (a.requiresRegistrations?.length) {
    if (!includesAll(profile.registrations, a.requiresRegistrations)) {
      fail(`Missing registrations: ${a.requiresRegistrations.join(', ')}`);
    } else {
      reasons.push(`Has required registrations: ${a.requiresRegistrations.join(', ')}`);
    }
  }

  if (a.excludesRegistrations?.length) {
    if (includesAny(profile.registrations, a.excludesRegistrations)) {
      fail(`Already has excluding registration(s): ${a.excludesRegistrations.join(', ')}`);
    } else {
      reasons.push(`No excluding registrations present`);
    }
  }

  // Structured condition DSL
  if (trigger.condition) {
    const condResult = evaluateConditionExpression(trigger.condition, profile, missingFacts);
    if (condResult === 'false') {
      fail('Applicability condition expression not satisfied');
    } else if (condResult === 'unknown') {
      unknown(`Condition needs facts: ${missingFacts.slice(-5).join(', ') || 'unknown'}`);
    } else {
      reasons.push('Applicability condition expression satisfied');
    }
  }

  // Asset scope
  const assetResult = assetScopeMatches(trigger, profile);
  if (assetResult === 'false') {
    fail('No matching asset holding / actor role for this rule');
  } else if (assetResult === 'unknown' && trigger.assetScopes?.length) {
    unknown('Asset holdings not provided — cannot confirm asset-scoped rule');
    for (const s of trigger.assetScopes) {
      const key = `asset:${s.assetClassId}:${s.actorRole}`;
      if (!missingFacts.includes(key)) missingFacts.push(key);
    }
  } else if (trigger.assetScopes?.length) {
    reasons.push('Asset scope matches profile holdings');
  }

  // Non-filing obligation kinds still show in mapping but need review for automation
  if (
    trigger.obligationKind &&
    !FILING_ELIGIBLE_OBLIGATION_KINDS.has(trigger.obligationKind) &&
    result === 'applicable'
  ) {
    needsReview(`Obligation kind "${trigger.obligationKind}" is not a filing-eligible duty`);
  }

  if (
    trigger.verificationStatus === 'imported_unverified' ||
    trigger.verificationStatus === 'conflict_flagged'
  ) {
    if (result === 'applicable') {
      needsReview(`Verification status: ${trigger.verificationStatus}`);
    }
  }

  const applies = result === 'applicable';
  return { applies, result, reasons, missingFacts };
}

export function triggersForEntity(
  profile: EntityComplianceProfile,
  dataset: ComplianceTriggerDataset,
): Array<{ trigger: ComplianceTrigger; reasons: string[]; result: ApplicabilityResult; missingFacts: string[] }> {
  return dataset.triggers
    .map((trigger) => {
      const { applies, reasons, result, missingFacts } = evaluateTrigger(profile, trigger);
      return applies || result === 'unknown' || result === 'needs_review'
        ? { trigger, reasons, result, missingFacts }
        : null;
    })
    .filter(
      (x): x is { trigger: ComplianceTrigger; reasons: string[]; result: ApplicabilityResult; missingFacts: string[] } =>
        x != null,
    );
}

export function triggersGroupedForEntity(
  profile: EntityComplianceProfile,
  dataset: ComplianceTriggerDataset,
): Record<
  ApplicabilityResult,
  Array<{ trigger: ComplianceTrigger; reasons: string[]; missingFacts: string[] }>
> {
  const groups: Record<
    ApplicabilityResult,
    Array<{ trigger: ComplianceTrigger; reasons: string[]; missingFacts: string[] }>
  > = {
    applicable: [],
    needs_review: [],
    unknown: [],
    not_applicable: [],
  };
  for (const trigger of dataset.triggers) {
    const { result, reasons, missingFacts } = evaluateTrigger(profile, trigger);
    groups[result].push({ trigger, reasons, missingFacts });
  }
  return groups;
}

export function entitiesForTrigger(
  trigger: ComplianceTrigger,
  profiles: EntityComplianceProfile[],
): Array<{ profile: EntityComplianceProfile; reasons: string[]; result: ApplicabilityResult }> {
  return profiles
    .map((profile) => {
      const { applies, reasons, result } = evaluateTrigger(profile, trigger);
      return applies || result === 'unknown' || result === 'needs_review'
        ? { profile, reasons, result }
        : null;
    })
    .filter(
      (x): x is { profile: EntityComplianceProfile; reasons: string[]; result: ApplicabilityResult } =>
        x != null,
    );
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
 * Returns null for continuous / one_time / event without a fixed calendar,
 * and for triggers without a usable schedule.
 */
export function nextDueDate(
  trigger: ComplianceTrigger,
  today: Date = new Date(),
): Date | null {
  if (trigger.scheduleSource === 'none') return null;
  const schedule: TriggerSchedule = trigger.schedule;
  if (!schedule?.frequency) return null;
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
      const months = schedule.dueMonths?.length ? schedule.dueMonths : [3, 6, 9, 12];
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

/** Whether a trigger may generate filings / reminders. */
export function canMaterialize(trigger: ComplianceTrigger): boolean {
  if (!trigger.automationEnabled) return false;
  if (trigger.status !== 'active') return false;
  if (trigger.scheduleSource === 'none') return false;
  if (
    trigger.obligationKind &&
    !FILING_ELIGIBLE_OBLIGATION_KINDS.has(trigger.obligationKind)
  ) {
    return false;
  }
  return true;
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
  facts?: EntityComplianceProfile['facts'];
  assetHoldings?: EntityComplianceProfile['assetHoldings'];
  jurisdictionId?: string;
}): EntityComplianceProfile {
  return {
    id: entity.id,
    name: entity.name,
    clientId: entity.clientId,
    entityType: entity.entityType,
    entityTypeId: ENTITY_TYPE_TO_ID[entity.entityType],
    state: entity.state,
    jurisdictionId: entity.jurisdictionId,
    industry: entity.industry,
    locations: entity.locations,
    employees: entity.employees,
    annualTurnoverInr: entity.annualTurnoverInr,
    registrations: entity.registrations ?? [],
    activities: entity.activities ?? [],
    facts: entity.facts,
    assetHoldings: entity.assetHoldings,
  };
}
