/**
 * Import codex-data-triggers-schema CSVs into app JSON catalogues.
 *
 * Merge policy (codex wins, schedule carve-out):
 * - Codex authoritative for legal basis, applicability, jurisdiction, entity types,
 *   documents, process, sources, verification_status.
 * - App preserves notification, protectionEligible, professionalType, linkedServiceIds,
 *   priority, shortName, penaltySummary.
 * - Schedule: overwrite only when deadline_json.type is a typed deadline; else keep
 *   curated schedule with schedule_source = curated_unverified.
 * - Codex-only rules import as draft with automation_enabled = false.
 *
 * Usage: npx tsx scripts/etl/import-codex-catalogue.ts
 */
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const CODEX = resolve(ROOT, 'codex-data-triggers-schema/outputs');
const OUT_TRIGGERS = resolve(ROOT, 'src/data/complianceTriggers.json');
const OUT_CATALOGUE = resolve(ROOT, 'src/data/complianceCatalogue.json');
const CROSSWALK = resolve(ROOT, 'src/data/trigger-crosswalk.csv');

const TYPED_DEADLINE_TYPES = new Set([
  'selected_calendar',
  'year_end_offset',
  'event_offset',
  'fixed_date',
  'period_offset',
  'calendar_annual',
  'year_end_months',
  'notice_supplied',
  'event_hours',
  'year_end_offset_then_days',
]);

const ENTITY_ID_TO_DISPLAY: Record<string, string[]> = {
  private_company: ['Pvt Ltd', 'OPC'],
  public_company: ['Public Ltd'],
  llp: ['LLP'],
  sole_proprietor: ['Proprietorship'],
  partnership: ['Partnership'],
  section8: ['Section 8'],
  trust: ['Trust'],
  society: ['Society'],
  individual: ['Individual'],
  huf: ['HUF'],
  other: ['Other'],
};

const DEPT_ICON: Record<string, string> = {
  MCA: 'Building2',
  LLP: 'Building2',
  NGO: 'Heart',
  GST: 'Receipt',
  INCOME_TAX: 'Calculator',
  TDS_TCS: 'Calculator',
  EPFO: 'Users',
  ESIC: 'Users',
  LABOUR: 'Users',
  POSH: 'Shield',
  PT: 'MapPin',
  SHOPS: 'Store',
  LWF: 'Users',
  FACTORY: 'Factory',
  POLLUTION: 'Leaf',
  WASTE: 'Trash2',
  MUNICIPAL: 'Landmark',
  FIRE: 'Flame',
  FSSAI: 'Utensils',
  DGFT: 'Ship',
  CUSTOMS: 'Ship',
  MSME: 'Briefcase',
  AUDIT: 'FileCheck',
  IP: 'Copyright',
  BOOKS: 'BookOpen',
  FEMA: 'Globe',
  LEGAL_METROLOGY: 'Scale',
  BIS: 'BadgeCheck',
  DRUGS_HEALTH: 'HeartPulse',
  RERA: 'Home',
  TRANSPORT: 'Truck',
  TELECOM: 'Radio',
  DATA_CYBER: 'Lock',
  ENERGY_PESO: 'Zap',
  AGRI_MINING: 'Mountain',
  EXCISE: 'Wine',
  SECURITIES: 'TrendingUp',
  LAND_RECORDS: 'Map',
  PROPERTY_REGISTRATION: 'FileText',
};

const DEPT_LEVEL: Record<string, string> = {
  PT: 'State',
  SHOPS: 'State',
  MUNICIPAL: 'Municipal',
  FIRE: 'State',
  EXCISE: 'State',
  LAND_RECORDS: 'State',
  PROPERTY_REGISTRATION: 'State',
  LWF: 'State',
  FACTORY: 'State',
  POLLUTION: 'State',
};

function parseCsv(text: string): Record<string, string>[] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += c;
      }
    } else if (c === '"') {
      inQuotes = true;
    } else if (c === ',') {
      row.push(field);
      field = '';
    } else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i++;
      row.push(field);
      field = '';
      if (row.length > 1 || row[0] !== '') rows.push(row);
      row = [];
    } else {
      field += c;
    }
  }
  if (field.length || row.length) {
    row.push(field);
    rows.push(row);
  }
  if (!rows.length) return [];
  const headers = rows[0];
  return rows.slice(1).map((r) => {
    const obj: Record<string, string> = {};
    headers.forEach((h, i) => {
      obj[h] = r[i] ?? '';
    });
    return obj;
  });
}

function loadCsv(name: string): Record<string, string>[] {
  return parseCsv(readFileSync(resolve(CODEX, name), 'utf8'));
}

function slug(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function freqFromCodex(freq: string): string {
  const f = (freq || '').toLowerCase();
  if (f.includes('monthly') && f.includes('quarter')) return 'monthly';
  if (f.includes('monthly')) return 'monthly';
  if (f.includes('quarter')) return 'quarterly';
  if (f.includes('half')) return 'half_yearly';
  if (f.includes('annual') || f.includes('yearly') || f === 'annual') return 'annual';
  if (f.includes('renew')) return 'renewal';
  if (f.includes('ongoing') || f.includes('continuous') || f.includes('perpetual')) return 'continuous';
  if (f.includes('one-time') || f.includes('one_time') || f.includes('registration')) return 'one_time';
  if (f.includes('event') || f.includes('transaction') || f.includes('real-time')) return 'event';
  return 'event';
}

function parseJsonSafe<T>(raw: string, fallback: T): T {
  if (!raw || !raw.trim()) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function shortNameFrom(name: string, formCode: string): string {
  if (formCode && formCode.length <= 24) return formCode.split(/[,;/]/)[0].trim();
  if (name.length <= 28) return name;
  return name.slice(0, 25) + '…';
}

function entityDisplays(entityIds: string[]): string[] {
  const out: string[] = [];
  for (const id of entityIds) {
    const labels = ENTITY_ID_TO_DISPLAY[id];
    if (labels) out.push(...labels);
    else out.push(id);
  }
  return [...new Set(out)];
}

function jurisdictionToStates(
  jurisdictionId: string,
  jurisdictions: Record<string, string>[],
): string[] | 'all' {
  if (!jurisdictionId || jurisdictionId === 'IN') return 'all';
  const j = jurisdictions.find((x) => x.jurisdiction_id === jurisdictionId);
  if (!j) return 'all';
  if (j.level === 'country') return 'all';
  return [j.name];
}

function defaultNotification() {
  return {
    leadDays: [30, 14, 7, 3, 1],
    channels: ['whatsapp', 'email', 'in_app'] as const,
    overdueEscalation: 'professional' as const,
    messageTemplate:
      'Reminder: {entity} — {name} is due on {dueDate}. Submit documents in ComplianceEasily to stay protected.',
  };
}

function defaultPenalty() {
  return {
    lateFee: 'See governing law / portal fee schedule',
    interest: 'N/A',
    maxPenalty: 'Unverified — review official source',
    otherConsequences: [] as string[],
    penaltyRefId: null as string | null,
  };
}

function categoryIdFromNav(nav: string): string {
  const map: Record<string, string> = {
    'MCA / ROC': 'mca',
    'GST & Indirect Tax': 'gst',
    'Income Tax & TDS': 'income-tax',
    'Labour, HR & Payroll': 'labour',
    'State & Local': 'state-local',
    'Business Licences': 'licences',
    'Food / FSSAI': 'fssai',
    'Import & Export': 'trade',
    'Audit & Assurance': 'audit',
    'Intellectual Property': 'ip',
    'Accounting & Books': 'books',
    'Notices & Responses': 'notices',
    'Investments & Property': 'investments',
  };
  return map[nav] || slug(nav) || 'other';
}

function main() {
  console.log('Loading codex CSVs…');
  const departments = loadCsv('departments.csv');
  const jurisdictions = loadCsv('jurisdictions.csv');
  const entityTypes = loadCsv('entity_types.csv');
  const turnoverBands = loadCsv('turnover_bands.csv');
  const triggerTypesCsv = loadCsv('trigger_types.csv');
  const sources = loadCsv('sources.csv');
  const authorities = loadCsv('authorities.csv');
  const compliances = loadCsv('compliances.csv');
  const ruleVersions = loadCsv('rule_versions.csv');
  const ruleTriggers = loadCsv('rule_triggers.csv');
  const ruleEntities = loadCsv('rule_entities.csv');
  const conditions = loadCsv('applicability_conditions.csv');
  const documents = loadCsv('document_requirements.csv');
  const processes = loadCsv('process_profiles.csv');
  const evidence = loadCsv('evidence_assertions.csv');
  const stateCoverage = loadCsv('state_coverage.csv');
  const coverageRules = loadCsv('coverage_rules.csv');
  const assetClasses = loadCsv('asset_classes.csv');
  const ruleAssetScopes = loadCsv('rule_asset_scopes.csv');
  const propertyProfiles = loadCsv('state_property_profiles.csv');
  const profileFields = loadCsv('business_profile_fields.csv');

  const existing = JSON.parse(readFileSync(OUT_TRIGGERS, 'utf8')) as {
    meta: Record<string, unknown>;
    triggerTypes: Array<Record<string, unknown>>;
    departments: Array<Record<string, unknown>>;
    categories: Array<Record<string, unknown>>;
    attributeDictionary: Record<string, unknown>;
    triggers: Array<Record<string, unknown>>;
  };

  const crosswalk = parseCsv(readFileSync(CROSSWALK, 'utf8'));
  const crosswalkByApp = new Map(
    crosswalk
      .filter((r) => r.rule_id && (r.reviewed === 'yes' || Number(r.confidence) >= 0.5))
      .map((r) => [r.app_trigger_id, r]),
  );
  const mappedRuleIds = new Set([...crosswalkByApp.values()].map((r) => r.rule_id));

  const complianceById = new Map(compliances.map((c) => [c.compliance_id, c]));
  const ruleById = new Map(ruleVersions.map((r) => [r.rule_id, r]));
  const processByRule = new Map(processes.map((p) => [p.rule_id, p]));
  const docsByRule = new Map<string, Record<string, string>[]>();
  for (const d of documents) {
    const list = docsByRule.get(d.rule_id) ?? [];
    list.push(d);
    docsByRule.set(d.rule_id, list);
  }
  const condByRule = new Map(conditions.map((c) => [c.rule_id, c]));
  const triggersByRule = new Map<string, string[]>();
  for (const rt of ruleTriggers) {
    const list = triggersByRule.get(rt.rule_id) ?? [];
    list.push(rt.trigger_id);
    triggersByRule.set(rt.rule_id, list);
  }
  const entitiesByRule = new Map<string, string[]>();
  for (const re of ruleEntities) {
    const list = entitiesByRule.get(re.rule_id) ?? [];
    list.push(re.entity_type_id);
    entitiesByRule.set(re.rule_id, list);
  }
  const evidenceByRule = new Map<string, Record<string, string>[]>();
  for (const e of evidence) {
    const list = evidenceByRule.get(e.rule_id) ?? [];
    list.push(e);
    evidenceByRule.set(e.rule_id, list);
  }
  const assetsByRule = new Map<string, Record<string, string>[]>();
  for (const a of ruleAssetScopes) {
    const list = assetsByRule.get(a.rule_id) ?? [];
    list.push(a);
    assetsByRule.set(a.rule_id, list);
  }
  const sourceById = new Map(sources.map((s) => [s.source_id, s]));
  const deptById = new Map(departments.map((d) => [d.department_id, d]));
  const assetClassById = new Map(assetClasses.map((a) => [a.asset_class_id, a]));

  const coverageLinks = new Map<string, string[]>();
  for (const cr of coverageRules) {
    const list = coverageLinks.get(cr.coverage_id) ?? [];
    list.push(cr.rule_id);
    coverageLinks.set(cr.coverage_id, list);
  }

  // --- Build runtime departments from codex (keep app portal metadata when ids overlap) ---
  const existingDeptById = new Map(
    existing.departments.map((d) => [String(d.id).toUpperCase().replace(/-/g, '_'), d]),
  );
  const existingDeptByLegacy = new Map(existing.departments.map((d) => [String(d.id), d]));

  const appDeptIdMap: Record<string, string> = {
    mca: 'MCA',
    gst: 'GST',
    'income-tax': 'INCOME_TAX',
    tds: 'TDS_TCS',
    epfo: 'EPFO',
    esic: 'ESIC',
    labour: 'LABOUR',
    posh: 'POSH',
    'professional-tax': 'PT',
    municipal: 'MUNICIPAL',
    spcb: 'POLLUTION',
    fssai: 'FSSAI',
    dgft: 'DGFT',
    msme: 'MSME',
    'legal-metrology': 'LEGAL_METROLOGY',
    ip: 'IP',
    rbi: 'FEMA',
    accounting: 'BOOKS',
    general: 'MCA',
  };

  const runtimeDepartments = departments.map((d) => {
    const legacy =
      existingDeptById.get(d.department_id) ||
      existingDeptByLegacy.get(d.department_id.toLowerCase()) ||
      existingDeptByLegacy.get(slug(d.department_id));
    const nav = d.navigation_category || '';
    return {
      id: d.department_id.toLowerCase().replace(/_/g, '-'),
      name: (legacy?.name as string) || d.name,
      shortName: (legacy?.shortName as string) || d.name,
      level: (legacy?.level as string) || DEPT_LEVEL[d.department_id] || 'Central',
      ministry: (legacy?.ministry as string) || d.name,
      regulator: (legacy?.regulator as string) || d.name,
      portalUrl: (legacy?.portalUrl as string) || '',
      otherPortals: (legacy?.otherPortals as string[]) || [],
      categoryIds: [categoryIdFromNav(nav)],
      description: (legacy?.description as string) || d.taxonomy_note || d.name,
      iconName: (legacy?.iconName as string) || DEPT_ICON[d.department_id] || 'FileText',
      navigationCategory: nav,
    };
  });

  // Categories from navigation_category
  const navCats = [...new Set(departments.map((d) => d.navigation_category).filter(Boolean))];
  const runtimeCategories = navCats.map((nav) => {
    const id = categoryIdFromNav(nav);
    const deptIds = departments
      .filter((d) => d.navigation_category === nav)
      .map((d) => d.department_id.toLowerCase().replace(/_/g, '-'));
    return {
      id,
      name: nav,
      code: id.toUpperCase().replace(/-/g, '_'),
      departmentIds: deptIds,
      description: `${nav} compliance obligations`,
    };
  });

  const existingById = new Map(existing.triggers.map((t) => [String(t.id), t]));

  function enrichFromRule(
    base: Record<string, unknown>,
    rule: Record<string, string>,
    compliance: Record<string, string>,
  ): Record<string, unknown> {
    const deadlineJson = parseJsonSafe<Record<string, unknown>>(rule.deadline_json, {});
    const deadlineType = String(deadlineJson.type || 'manual_review');
    const typed = TYPED_DEADLINE_TYPES.has(deadlineType);
    const entityIds = entitiesByRule.get(rule.rule_id) ?? [];
    const triggerIds = triggersByRule.get(rule.rule_id) ?? [];
    const process = processByRule.get(rule.rule_id);
    const docs = docsByRule.get(rule.rule_id) ?? [];
    const cond = condByRule.get(rule.rule_id);
    const ev = evidenceByRule.get(rule.rule_id) ?? [];
    const assets = assetsByRule.get(rule.rule_id) ?? [];
    const deptId = (compliance.department_id || 'MCA').toLowerCase().replace(/_/g, '-');
    const dept = deptById.get(compliance.department_id || '');
    const catId = categoryIdFromNav(dept?.navigation_category || 'MCA / ROC');
    const states = jurisdictionToStates(rule.jurisdiction_id, jurisdictions);

    const curatedSchedule = (base.schedule as Record<string, unknown>) || null;
    let schedule: Record<string, unknown>;
    let scheduleSource: string;
    if (typed) {
      schedule = {
        frequency: freqFromCodex(rule.frequency),
        dueRule: rule.deadline_text || 'See deadline_json',
        financialYearBasis: true,
        deadlineJson,
      };
      scheduleSource = 'codex_typed';
    } else if (curatedSchedule && curatedSchedule.frequency) {
      schedule = { ...curatedSchedule, deadlineJson };
      scheduleSource = 'curated_unverified';
    } else {
      schedule = {
        frequency: freqFromCodex(rule.frequency),
        dueRule: rule.deadline_text || 'Manual review required',
        deadlineJson,
      };
      scheduleSource = 'none';
    }

    const forms = rule.form_code
      ? rule.form_code.split(/[,;/]/).map((s) => s.trim()).filter(Boolean)
      : ((base.forms as string[]) ?? []);

    return {
      ...base,
      name: compliance.name || base.name,
      shortName: (base.shortName as string) || shortNameFrom(compliance.name, rule.form_code),
      departmentId: deptId,
      categoryId: catId,
      triggerType: (triggerIds[0] || base.triggerType || 'date') as string,
      legalReference: rule.governing_law || (base.legalReference as string) || '',
      forms,
      description:
        rule.applicability_text ||
        (base.description as string) ||
        compliance.name,
      sourceUrl:
        process?.application_url ||
        (base.sourceUrl as string) ||
        '',
      lastVerified: rule.checked_on || (base.lastVerified as string) || '2026-09-14',
      applicability: {
        entityTypes: entityDisplays(entityIds),
        entityTypeIds: entityIds,
        industries: 'all',
        states,
        jurisdictionIds: rule.jurisdiction_id ? [rule.jurisdiction_id] : ['IN'],
        requiresRegistrations: ((base.applicability as Record<string, unknown>)?.requiresRegistrations as string[]) || [],
        excludesRegistrations: ((base.applicability as Record<string, unknown>)?.excludesRegistrations as string[]) || [],
        conditionsText: rule.applicability_text || '',
        minTurnoverInr: (base.applicability as Record<string, unknown>)?.minTurnoverInr,
        maxTurnoverInr: (base.applicability as Record<string, unknown>)?.maxTurnoverInr,
        minEmployees: (base.applicability as Record<string, unknown>)?.minEmployees,
      },
      schedule,
      notification: (base.notification as Record<string, unknown>) || defaultNotification(),
      thresholds: (base.thresholds as unknown[]) || [],
      penaltySummary: (base.penaltySummary as Record<string, unknown>) || defaultPenalty(),
      linkedServiceIds: (base.linkedServiceIds as string[]) || [],
      protectionEligible: Boolean(base.protectionEligible),
      professionalType: (base.professionalType as string) || 'CA',
      priority: (base.priority as string) || 'medium',
      status: base.status || (scheduleSource === 'none' ? 'draft' : 'active'),
      ruleId: rule.rule_id,
      complianceId: compliance.compliance_id,
      jurisdictionId: rule.jurisdiction_id || 'IN',
      obligationKind: compliance.obligation_kind || 'mandatory_if_applicable',
      scopeLevel: compliance.scope_level || 'central',
      verificationStatus: rule.verification_status || 'imported_unverified',
      deadlineText: rule.deadline_text || '',
      scheduleSource,
      automationEnabled: false,
      governingLaw: rule.governing_law || '',
      formCode: rule.form_code || '',
      exceptionsText: rule.exceptions_text || '',
      effectiveFrom: rule.effective_from || null,
      effectiveTo: rule.effective_to || null,
      taxPeriod: rule.tax_period || null,
      turnoverBasis: rule.turnover_basis || null,
      employeeBasis: rule.employee_basis || null,
      process: process
        ? {
            applicationUrl: process.application_url,
            urlRole: process.url_role,
            filingMode: process.filing_mode || 'unverified',
            physicalSubmission: process.physical_submission || 'unverified',
            applicantVisit: process.applicant_visit || 'unverified',
            inspection: process.inspection || 'unverified',
            testingOrNotarisation: process.testing_or_notarisation || 'unverified',
            processNotes: process.process_notes,
            verificationStatus: process.verification_status,
          }
        : null,
      documents: docs.map((d) => ({
        documentId: d.document_id,
        documentName: d.document_name,
        entryKind: d.entry_kind || 'compound_checklist',
        requirementStatus: d.requirement_status || 'indicative',
        conditionText: d.condition_text,
      })),
      condition: cond
        ? parseJsonSafe(cond.expression_json, null)
        : null,
      evidence: ev.map((e) => {
        const src = e.source_id ? sourceById.get(e.source_id) : undefined;
        return {
          assertionId: e.assertion_id,
          sourceId: e.source_id,
          sourceTitle: src?.title,
          sourceType: src?.source_type,
          fieldName: e.field_name,
          finding: e.finding,
          verificationStatus: e.verification_status,
          url: src?.url,
        };
      }),
      assetScopes: assets.map((a) => ({
        assetClassId: a.asset_class_id,
        assetClassName: assetClassById.get(a.asset_class_id)?.name,
        actorRole: a.actor_role,
      })),
    };
  }

  const runtimeTriggers: Record<string, unknown>[] = [];

  // 1) Existing app triggers — enrich via crosswalk when reviewed
  for (const t of existing.triggers) {
    const id = String(t.id);
    const xw = crosswalkByApp.get(id);
    if (xw) {
      const rule = ruleById.get(xw.rule_id);
      const compliance = rule ? complianceById.get(rule.compliance_id) : undefined;
      if (rule && compliance) {
        // Remap department id from legacy to new slug
        const remapped = { ...t };
        const legacyDept = String(t.departmentId || '');
        if (appDeptIdMap[legacyDept]) {
          remapped.departmentId = appDeptIdMap[legacyDept].toLowerCase().replace(/_/g, '-');
        }
        runtimeTriggers.push(enrichFromRule(remapped, rule, compliance));
        continue;
      }
    }
    // Unmatched app-only trigger — keep with catalogue metadata defaults
    const legacyDept = String(t.departmentId || 'mca');
    const newDept = (appDeptIdMap[legacyDept] || 'MCA').toLowerCase().replace(/_/g, '-');
    runtimeTriggers.push({
      ...t,
      departmentId: newDept,
      categoryId: (runtimeDepartments.find((d) => d.id === newDept)?.categoryIds[0]) || t.categoryId,
      ruleId: null,
      complianceId: null,
      jurisdictionId: 'IN',
      obligationKind: 'mandatory_if_applicable',
      scopeLevel: 'central',
      verificationStatus: 'imported_unverified',
      deadlineText: (t.schedule as { dueRule?: string })?.dueRule || '',
      scheduleSource: 'curated_unverified',
      automationEnabled: false,
      process: null,
      documents: [],
      condition: null,
      evidence: [],
      assetScopes: [],
    });
  }

  // 2) Codex-only rules not mapped from app
  for (const rule of ruleVersions) {
    if (mappedRuleIds.has(rule.rule_id)) continue;
    const compliance = complianceById.get(rule.compliance_id);
    if (!compliance) continue;
    const id = `codex-${rule.rule_id.toLowerCase()}`;
    const draft = enrichFromRule(
      {
        id,
        name: compliance.name,
        shortName: shortNameFrom(compliance.name, rule.form_code),
        priority: 'medium',
        status: 'draft',
        protectionEligible: false,
        professionalType: 'CA',
        linkedServiceIds: [],
        thresholds: [],
        notification: defaultNotification(),
        penaltySummary: defaultPenalty(),
        forms: [],
        applicability: {
          entityTypes: [],
          industries: 'all',
          states: 'all',
          requiresRegistrations: [],
          excludesRegistrations: [],
          conditionsText: '',
        },
        schedule: {
          frequency: freqFromCodex(rule.frequency),
          dueRule: rule.deadline_text || 'Manual review required',
        },
      },
      rule,
      compliance,
    );
    draft.status = 'draft';
    draft.scheduleSource =
      draft.scheduleSource === 'codex_typed' ? 'codex_typed' : 'none';
    runtimeTriggers.push(draft);
  }

  const allEntityDisplays = [
    ...new Set(Object.values(ENTITY_ID_TO_DISPLAY).flat()),
  ];

  const stateNames = jurisdictions
    .filter((j) => j.level === 'state' || j.level === 'union_territory')
    .map((j) => j.name)
    .sort();

  const triggerDataset = {
    meta: {
      version: '2.0.0',
      lastVerified: '2026-09-15',
      dataRelease: '1.2.0',
      researchAsOf: '2026-09-15',
      baseResearchAsOf: '2026-09-14',
      disclaimer:
        'Research staging dataset (codex v1.2.0). Deadlines, thresholds and penalties are indicative. No rule is automation-enabled. Always re-verify against the official government portal and latest gazette before acting. ComplianceEasily uses this dataset to map and remind — it is not a substitute for professional legal advice.',
      sources: sources
        .filter((s) => s.url)
        .slice(0, 40)
        .map((s) => s.url),
    },
    triggerTypes: existing.triggerTypes.length
      ? existing.triggerTypes
      : triggerTypesCsv.map((t) => ({
          id: t.trigger_id,
          label: t.name,
          subtitle: t.name,
          description: t.description,
          iconName: 'FileText',
        })),
    departments: runtimeDepartments,
    categories: runtimeCategories,
    attributeDictionary: {
      entityTypes: allEntityDisplays,
      turnoverBands: turnoverBands.map((b) => ({
        id: b.band_id,
        label: b.label,
        minInr: b.min_inr ? Number(b.min_inr) : 0,
        maxInr: b.max_inr ? Number(b.max_inr) : null,
      })),
      employeeBands: (existing.attributeDictionary.employeeBands as unknown[]) || [],
      industries: (existing.attributeDictionary.industries as string[]) || [],
      states: stateNames,
      registrations: (existing.attributeDictionary.registrations as string[]) || [],
    },
    triggers: runtimeTriggers,
  };

  const catalogueDataset = {
    meta: triggerDataset.meta,
    entityTypes: entityTypes.map((e) => ({
      entityTypeId: e.entity_type_id,
      name: e.name,
      uiGroup: e.ui_group,
      displayLabels: ENTITY_ID_TO_DISPLAY[e.entity_type_id] || [e.name],
    })),
    turnoverBands: triggerDataset.attributeDictionary.turnoverBands,
    jurisdictions: jurisdictions.map((j) => ({
      jurisdictionId: j.jurisdiction_id,
      name: j.name,
      level: j.level,
      parentId: j.parent_id || null,
    })),
    departments: departments.map((d) => ({
      departmentId: d.department_id,
      name: d.name,
      navigationCategory: d.navigation_category,
    })),
    businessProfileFields: profileFields.map((f) => ({
      fieldId: f.field_id,
      dataType: f.data_type,
      scope: f.scope,
      description: f.description,
      requiredFor: f.required_for,
    })),
    assetClasses: assetClasses.map((a) => ({
      assetClassId: a.asset_class_id,
      name: a.name,
      scopeNote: a.scope_note,
    })),
    stateCoverage: stateCoverage.map((c) => ({
      coverageId: c.coverage_id,
      jurisdictionId: c.jurisdiction_id,
      topic: c.topic,
      applicabilityStatus: c.applicability_status,
      authorityUrl: c.authority_url,
      applicationUrl: c.application_url,
      coverageStatus: c.coverage_status,
      nextVerification: c.next_verification,
      linkedRuleIds: coverageLinks.get(c.coverage_id) || [],
    })),
    statePropertyProfiles: propertyProfiles.map((p) => ({
      propertyProfileId: p.property_profile_id,
      jurisdictionId: p.jurisdiction_id,
      recordTerms: p.record_terms,
      termsStatus: p.terms_status,
      rorUrl: p.ror_url,
      registrationUrl: p.registration_url,
      mutationUrl: p.mutation_url,
      landRevenueUrl: p.land_revenue_url,
      routeStatus: p.route_status,
      physicalStepsStatus: p.physical_steps_status,
      titleNote: p.title_note,
    })),
    sources: sources.map((s) => ({
      sourceId: s.source_id,
      url: s.url,
      title: s.title,
      sourceType: s.source_type,
    })),
    authorities: authorities.map((a) => ({
      authorityId: a.authority_id,
      name: a.name,
      jurisdictionId: a.jurisdiction_id,
      websiteUrl: a.website_url,
      verificationStatus: a.verification_status,
    })),
    ruleCount: ruleVersions.length,
    complianceCount: compliances.length,
  };

  mkdirSync(dirname(OUT_TRIGGERS), { recursive: true });
  writeFileSync(OUT_TRIGGERS, JSON.stringify(triggerDataset, null, 2) + '\n', 'utf8');
  writeFileSync(OUT_CATALOGUE, JSON.stringify(catalogueDataset, null, 2) + '\n', 'utf8');

  // Also refresh fixtures used by tests
  const fixtures = resolve(ROOT, 'src/lib/compliance/fixtures/complianceTriggers.json');
  try {
    writeFileSync(fixtures, JSON.stringify(triggerDataset, null, 2) + '\n', 'utf8');
  } catch {
    /* optional */
  }

  const active = runtimeTriggers.filter((t) => t.status === 'active').length;
  const draft = runtimeTriggers.filter((t) => t.status === 'draft').length;
  const typed = runtimeTriggers.filter((t) => t.scheduleSource === 'codex_typed').length;
  console.log(
    `Wrote ${runtimeTriggers.length} triggers (${active} active, ${draft} draft, ${typed} typed schedules)`,
  );
  console.log(
    `Catalogue: ${compliances.length} compliances, ${ruleVersions.length} rules, ${stateCoverage.length} coverage rows, ${jurisdictions.length} jurisdictions`,
  );
}

main();
