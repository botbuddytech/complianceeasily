import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  evaluateTrigger,
  nextDueDate,
  reminderDates,
  triggersForEntity,
  entityToProfile,
  formatDueDate,
} from '../matcher';
import type {
  ComplianceTrigger,
  ComplianceTriggerDataset,
  EntityComplianceProfile,
} from '../types';
import rawDataset from '../fixtures/complianceTriggers.json';
import fixtureEntities from '../fixtures/entities.json';

const dataset = rawDataset as ComplianceTriggerDataset;

function baseTrigger(overrides: Partial<ComplianceTrigger> = {}): ComplianceTrigger {
  return {
    id: 'test-trigger',
    name: 'Test Trigger',
    shortName: 'TEST',
    departmentId: 'gst',
    categoryId: 'gst',
    triggerType: 'date',
    priority: 'medium',
    status: 'active',
    legalReference: 'Test Act',
    forms: [],
    description: 'test',
    sourceUrl: '',
    lastVerified: '2026-01-01',
    applicability: {
      entityTypes: ['Pvt Ltd'],
      industries: 'all',
      states: 'all',
      requiresRegistrations: [],
      excludesRegistrations: [],
      conditionsText: '',
    },
    schedule: {
      frequency: 'monthly',
      dueRule: 'day 20',
      dueDay: 20,
    },
    notification: {
      leadDays: [7, 3, 1],
      channels: ['whatsapp', 'email'],
      overdueEscalation: 'ops_manager',
      messageTemplate: 'Due soon',
    },
    thresholds: [],
    penaltySummary: {
      lateFee: '',
      interest: '',
      maxPenalty: '',
      otherConsequences: [],
      penaltyRefId: null,
    },
    linkedServiceIds: [],
    protectionEligible: false,
    professionalType: 'CA',
    ...overrides,
  };
}

function baseProfile(overrides: Partial<EntityComplianceProfile> = {}): EntityComplianceProfile {
  return {
    id: 'ent-test',
    name: 'Test Co',
    entityType: 'Pvt Ltd',
    state: 'West Bengal',
    industry: 'Food & Restaurants',
    employees: 28,
    annualTurnoverInr: 62000000,
    registrations: ['GSTIN', 'PAN', 'CIN'],
    activities: ['retail'],
    ...overrides,
  };
}

describe('evaluateTrigger – applicability', () => {
  it('matches when entity type is allowed', () => {
    const result = evaluateTrigger(baseProfile(), baseTrigger());
    expect(result.applies).toBe(true);
    expect(result.reasons.some((r) => r.includes('Entity type'))).toBe(true);
  });

  it('rejects wrong entity type', () => {
    const result = evaluateTrigger(
      baseProfile({ entityType: 'Proprietorship' }),
      baseTrigger(),
    );
    expect(result.applies).toBe(false);
    expect(result.reasons[0]).toContain('not in');
  });

  it('rejects below min turnover', () => {
    const result = evaluateTrigger(
      baseProfile({ annualTurnoverInr: 1_000_000 }),
      baseTrigger({
        applicability: {
          ...baseTrigger().applicability,
          minTurnoverInr: 5_000_000,
        },
      }),
    );
    expect(result.applies).toBe(false);
    expect(result.reasons.some((r) => r.includes('below min'))).toBe(true);
  });

  it('rejects above max turnover', () => {
    const result = evaluateTrigger(
      baseProfile({ annualTurnoverInr: 200_000_000 }),
      baseTrigger({
        applicability: {
          ...baseTrigger().applicability,
          maxTurnoverInr: 50_000_000,
        },
      }),
    );
    expect(result.applies).toBe(false);
  });

  it('rejects below min employees', () => {
    const result = evaluateTrigger(
      baseProfile({ employees: 5 }),
      baseTrigger({
        applicability: {
          ...baseTrigger().applicability,
          minEmployees: 10,
        },
      }),
    );
    expect(result.applies).toBe(false);
  });

  it('accepts industries: all', () => {
    const result = evaluateTrigger(
      baseProfile({ industry: 'Anything' }),
      baseTrigger({
        applicability: { ...baseTrigger().applicability, industries: 'all' },
      }),
    );
    expect(result.applies).toBe(true);
  });

  it('rejects industry not in list', () => {
    const result = evaluateTrigger(
      baseProfile({ industry: 'Mining' }),
      baseTrigger({
        applicability: {
          ...baseTrigger().applicability,
          industries: ['Food & Restaurants', 'IT & Technology'],
        },
      }),
    );
    expect(result.applies).toBe(false);
  });

  it('rejects wrong state', () => {
    const result = evaluateTrigger(
      baseProfile({ state: 'Kerala' }),
      baseTrigger({
        applicability: {
          ...baseTrigger().applicability,
          states: ['West Bengal', 'Maharashtra'],
        },
      }),
    );
    expect(result.applies).toBe(false);
  });

  it('rejects missing required registrations', () => {
    const result = evaluateTrigger(
      baseProfile({ registrations: ['PAN'] }),
      baseTrigger({
        applicability: {
          ...baseTrigger().applicability,
          requiresRegistrations: ['GSTIN', 'FSSAI'],
        },
      }),
    );
    expect(result.applies).toBe(false);
    expect(result.reasons.some((r) => r.includes('Missing registrations'))).toBe(true);
  });

  it('rejects when excluding registration is present', () => {
    const result = evaluateTrigger(
      baseProfile({ registrations: ['GSTIN', 'Composition'] }),
      baseTrigger({
        applicability: {
          ...baseTrigger().applicability,
          excludesRegistrations: ['Composition'],
        },
      }),
    );
    expect(result.applies).toBe(false);
  });

  it('draft triggers are needs_review, not applicable', () => {
    const result = evaluateTrigger(
      baseProfile(),
      baseTrigger({ status: 'draft' }),
    );
    expect(result.applies).toBe(false);
    expect(result.result).toBe('needs_review');
    expect(result.reasons.some((r) => r.includes('draft'))).toBe(true);
  });
});

describe('condition DSL – unknown on missing facts', () => {
  it('returns unknown when required fact is missing', () => {
    const result = evaluateTrigger(
      baseProfile({ facts: {} }),
      baseTrigger({
        condition: {
          all: [
            { field: 'gst_max_aato_since_2017_inr', op: 'gt', value: 50_000_000 },
            { field: 'gst_registered', op: 'eq', value: true },
          ],
        },
      }),
    );
    expect(result.result).toBe('unknown');
    expect(result.missingFacts).toContain('gst_max_aato_since_2017_inr');
  });

  it('returns applicable when all condition facts pass', () => {
    const result = evaluateTrigger(
      baseProfile({
        facts: {
          gst_max_aato_since_2017_inr: 80_000_000,
          gst_registered: true,
          e_invoice_exempt: false,
        },
      }),
      baseTrigger({
        condition: {
          all: [
            { field: 'gst_max_aato_since_2017_inr', op: 'gt', value: 50_000_000 },
            { field: 'gst_registered', op: 'eq', value: true },
            { field: 'e_invoice_exempt', op: 'eq', value: false },
          ],
        },
      }),
    );
    expect(result.result).toBe('applicable');
    expect(result.applies).toBe(true);
  });

  it('returns not_applicable when condition fails with known facts', () => {
    const result = evaluateTrigger(
      baseProfile({
        facts: {
          food_turnover_inr: 1_000_000,
          special_fssai_category: false,
        },
      }),
      baseTrigger({
        condition: {
          all: [
            { field: 'food_turnover_inr', op: 'gt', value: 15_000_000 },
            { field: 'special_fssai_category', op: 'eq', value: false },
          ],
        },
      }),
    );
    expect(result.result).toBe('not_applicable');
  });

  it('any-group is true if one branch passes', () => {
    const result = evaluateTrigger(
      baseProfile({
        facts: { company_turnover_inr: 3_000_000_000, is_cpse: false },
      }),
      baseTrigger({
        condition: {
          any: [
            { field: 'company_turnover_inr', op: 'gt', value: 2_500_000_000 },
            { field: 'is_cpse', op: 'eq', value: true },
          ],
        },
      }),
    );
    expect(result.applies).toBe(true);
  });

  it('canMaterialize requires automation_enabled', async () => {
    const { canMaterialize } = await import('../matcher');
    expect(canMaterialize(baseTrigger({ automationEnabled: false }))).toBe(false);
    expect(
      canMaterialize(
        baseTrigger({
          automationEnabled: true,
          status: 'active',
          scheduleSource: 'curated_unverified',
          obligationKind: 'mandatory_if_applicable',
        }),
      ),
    ).toBe(true);
  });
});

describe('nextDueDate', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns this month due day when still upcoming', () => {
    vi.setSystemTime(new Date(2026, 2, 10, 12)); // 10 Mar 2026
    const due = nextDueDate(baseTrigger({ schedule: { frequency: 'monthly', dueRule: 'd20', dueDay: 20 } }));
    expect(due?.getFullYear()).toBe(2026);
    expect(due?.getMonth()).toBe(2);
    expect(due?.getDate()).toBe(20);
  });

  it('rolls to next month when due day has passed', () => {
    vi.setSystemTime(new Date(2026, 2, 25, 12));
    const due = nextDueDate(baseTrigger({ schedule: { frequency: 'monthly', dueRule: 'd20', dueDay: 20 } }));
    expect(due?.getMonth()).toBe(3);
    expect(due?.getDate()).toBe(20);
  });

  it('handles quarterly due months', () => {
    vi.setSystemTime(new Date(2026, 0, 5, 12)); // Jan
    const due = nextDueDate(
      baseTrigger({
        schedule: { frequency: 'quarterly', dueRule: 'q', dueDay: 11, dueMonths: [3, 6, 9, 12] },
      }),
    );
    expect(due?.getMonth()).toBe(2); // March
    expect(due?.getDate()).toBe(11);
  });

  it('handles annual due', () => {
    vi.setSystemTime(new Date(2026, 4, 1, 12)); // May
    const due = nextDueDate(
      baseTrigger({
        schedule: { frequency: 'annual', dueRule: 'a', dueDay: 30, dueMonths: [11] },
      }),
    );
    expect(due?.getFullYear()).toBe(2026);
    expect(due?.getMonth()).toBe(10); // Nov
  });

  it('returns null for event / continuous / one_time', () => {
    expect(nextDueDate(baseTrigger({ schedule: { frequency: 'event', dueRule: 'e' } }))).toBeNull();
    expect(nextDueDate(baseTrigger({ schedule: { frequency: 'continuous', dueRule: 'c' } }))).toBeNull();
    expect(nextDueDate(baseTrigger({ schedule: { frequency: 'one_time', dueRule: 'o' } }))).toBeNull();
  });

  it('clamps due day to month length', () => {
    vi.setSystemTime(new Date(2026, 1, 1, 12)); // Feb
    const due = nextDueDate(
      baseTrigger({ schedule: { frequency: 'monthly', dueRule: 'd31', dueDay: 31 } }),
    );
    expect(due?.getMonth()).toBe(1);
    expect(due?.getDate()).toBe(28);
  });
});

describe('reminderDates', () => {
  it('expands lead days relative to due date', () => {
    const due = new Date(2026, 2, 20, 12);
    const trigger = baseTrigger({
      notification: {
        leadDays: [15, 7, 1],
        channels: ['whatsapp'],
        overdueEscalation: 'ops_manager',
        messageTemplate: 'x',
      },
    });
    const dates = reminderDates(trigger, due);
    expect(dates).toHaveLength(3);
    expect(dates[0]).toContain('T-');
    expect(reminderDates(trigger, null)).toEqual([]);
  });
});

describe('formatDueDate / entityToProfile', () => {
  it('formats null as Event / ongoing', () => {
    expect(formatDueDate(null)).toBe('Event / ongoing');
  });

  it('maps entity fields to profile', () => {
    const profile = entityToProfile({
      id: 'e1',
      name: 'Acme',
      entityType: 'Pvt Ltd',
      state: 'WB',
      industry: 'Food',
      clientId: 'cli-1',
      employees: 10,
      annualTurnoverInr: 1e7,
      registrations: ['GSTIN'],
    });
    expect(profile.clientId).toBe('cli-1');
    expect(profile.registrations).toEqual(['GSTIN']);
  });
});

describe('golden fixtures – real catalogue', () => {
  it('seed integrity: departments and categories exist', () => {
    const deptIds = new Set(dataset.departments.map((d) => d.id));
    const catIds = new Set(dataset.categories.map((c) => c.id));
    const triggerIds = new Set<string>();
    for (const t of dataset.triggers) {
      expect(deptIds.has(t.departmentId), `missing dept ${t.departmentId}`).toBe(true);
      expect(catIds.has(t.categoryId), `missing cat ${t.categoryId}`).toBe(true);
      expect(triggerIds.has(t.id), `duplicate ${t.id}`).toBe(false);
      triggerIds.add(t.id);
      expect(['active', 'draft']).toContain(t.status);
    }
    expect(dataset.triggers.length).toBeGreaterThan(50);
  });

  it('ACME Retail matches a non-empty set of active triggers', () => {
    const acme = fixtureEntities.find((e) => e.id === 'ent-acme')!;
    const profile = entityToProfile(acme);
    const matches = triggersForEntity(profile, dataset);
    expect(matches.length).toBeGreaterThan(5);
    // Snapshot of sorted IDs for regression
    const ids = matches.map((m) => m.trigger.id).sort();
    expect(ids).toMatchSnapshot();
  });

  it('produces golden match sets for all fixture entities', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 8, 10, 12)); // 10 Sep 2026
    const pack: Record<string, { ids: string[]; dues: Record<string, string | null> }> = {};
    for (const entity of fixtureEntities) {
      const profile = entityToProfile(entity);
      const matches = triggersForEntity(profile, dataset);
      const ids = matches.map((m) => m.trigger.id).sort();
      const dues: Record<string, string | null> = {};
      for (const m of matches) {
        const d = nextDueDate(m.trigger);
        dues[m.trigger.id] = d ? d.toISOString().slice(0, 10) : null;
      }
      pack[entity.id] = { ids, dues };
    }
    vi.useRealTimers();
    expect(pack).toMatchSnapshot();
  });
});
