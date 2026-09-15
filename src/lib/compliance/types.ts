/** Types for the Compliance Triggers knowledge base + codex catalogue. */

export type TriggerTypeId =
  | 'date'
  | 'turnover'
  | 'employee'
  | 'location'
  | 'industry'
  | 'director_partner'
  | 'licence'
  | 'notice'
  | 'law_change'
  | 'transaction';

export type DeptLevel = 'Central' | 'State' | 'Municipal' | 'Sectoral';

export type TriggerPriority = 'critical' | 'high' | 'medium' | 'low';

export type TriggerStatus = 'active' | 'draft';

export type ScheduleFrequency =
  | 'monthly'
  | 'quarterly'
  | 'half_yearly'
  | 'annual'
  | 'event'
  | 'one_time'
  | 'renewal'
  | 'continuous';

export type NotifyChannel = 'whatsapp' | 'email' | 'sms' | 'in_app';

export type OverdueEscalation = 'ops_manager' | 'professional' | 'legal';

export type ProfessionalType = 'CA' | 'CS' | 'Advocate' | 'Internal';

export type ApplicabilityResult =
  | 'applicable'
  | 'not_applicable'
  | 'unknown'
  | 'needs_review';

export type ScheduleSource = 'codex_typed' | 'curated_unverified' | 'none';

export type ObligationKind =
  | 'mandatory_if_applicable'
  | 'ongoing_duty'
  | 'optional_benefit'
  | 'due_diligence'
  | 'conditional_service'
  | 'law_change_review'
  | 'optional_exit_procedure'
  | 'conduct_restriction'
  | 'incident_duty'
  | 'optional_scheme'
  | 'optional_status_procedure'
  | 'optional_remedial_procedure'
  | 'conditional_registration_or_legal_effect'
  | string;

export type ScopeLevel =
  | 'central'
  | 'state'
  | 'state_framework'
  | 'central_or_state'
  | 'local'
  | string;

export type VerificationStatus =
  | 'researched_partial'
  | 'imported_unverified'
  | 'discovery_only'
  | 'authority_directory_confirmed'
  | 'conflict_flagged'
  | 'levy_or_service_evidenced'
  | 'directory_routing_only'
  | 'research_required'
  | 'secondary_discovery_only'
  | 'partial_rule_research'
  | 'unverified'
  | string;

export type PhysicalStepStatus =
  | 'required'
  | 'conditional'
  | 'not_required'
  | 'not_applicable'
  | 'unverified'
  | string;

export interface TriggerTypeMeta {
  id: TriggerTypeId;
  label: string;
  subtitle: string;
  description: string;
  iconName: string;
}

export interface GovDepartment {
  id: string;
  name: string;
  shortName: string;
  level: DeptLevel;
  ministry: string;
  regulator: string;
  portalUrl: string;
  otherPortals: string[];
  categoryIds: string[];
  description: string;
  iconName: string;
  navigationCategory?: string;
}

export interface TriggerCategory {
  id: string;
  name: string;
  code: string;
  departmentIds: string[];
  description: string;
}

export interface TurnoverBand {
  id: string;
  label: string;
  minInr: number;
  maxInr: number | null;
}

export interface EmployeeBand {
  id: string;
  label: string;
  min: number;
  max: number | null;
}

export interface AttributeDictionary {
  entityTypes: string[];
  turnoverBands: TurnoverBand[];
  employeeBands: EmployeeBand[];
  industries: string[];
  states: string[];
  registrations: string[];
}

export interface TriggerApplicability {
  entityTypes: string[];
  entityTypeIds?: string[];
  minTurnoverInr?: number;
  maxTurnoverInr?: number;
  minEmployees?: number;
  industries: string[] | 'all';
  states: string[] | 'all';
  jurisdictionIds?: string[];
  requiresRegistrations: string[];
  excludesRegistrations: string[];
  conditionsText: string;
}

export interface TriggerSchedule {
  frequency: ScheduleFrequency;
  dueRule: string;
  dueDay?: number;
  dueMonths?: number[];
  eventOffsetDays?: number;
  financialYearBasis?: boolean;
  deadlineJson?: Record<string, unknown>;
}

export interface TriggerNotification {
  leadDays: number[];
  channels: NotifyChannel[];
  overdueEscalation: OverdueEscalation;
  messageTemplate: string;
}

export interface TriggerThreshold {
  metric: string;
  operator: string;
  value: number;
  unit: string;
  effect: string;
}

export interface PenaltySummary {
  lateFee: string;
  interest: string;
  maxPenalty: string;
  otherConsequences: string[];
  penaltyRefId: string | null;
}

export interface ProcessProfileSummary {
  applicationUrl?: string;
  urlRole?: string;
  filingMode: PhysicalStepStatus;
  physicalSubmission: PhysicalStepStatus;
  applicantVisit: PhysicalStepStatus;
  inspection: PhysicalStepStatus;
  testingOrNotarisation: PhysicalStepStatus;
  processNotes?: string;
  verificationStatus?: VerificationStatus;
}

export interface DocumentRequirementSummary {
  documentId: string;
  documentName: string;
  entryKind: string;
  requirementStatus: string;
  conditionText?: string;
}

export interface EvidenceSummary {
  assertionId: string;
  sourceId?: string;
  sourceTitle?: string;
  sourceType?: string;
  fieldName?: string;
  finding?: string;
  verificationStatus?: string;
  url?: string;
}

export interface ConditionExpression {
  all?: ConditionNode[];
  any?: ConditionNode[];
}

export type ConditionNode =
  | ConditionExpression
  | {
      field: string;
      op: 'eq' | 'gt' | 'gte' | 'lt' | 'lte' | string;
      value: string | number | boolean;
    };

export interface AssetScopeSummary {
  assetClassId: string;
  assetClassName?: string;
  actorRole: string;
}

export interface ComplianceTrigger {
  id: string;
  name: string;
  shortName: string;
  departmentId: string;
  categoryId: string;
  triggerType: TriggerTypeId;
  priority: TriggerPriority;
  status: TriggerStatus;
  legalReference: string;
  forms: string[];
  description: string;
  sourceUrl: string;
  lastVerified: string;
  applicability: TriggerApplicability;
  schedule: TriggerSchedule;
  notification: TriggerNotification;
  thresholds: TriggerThreshold[];
  penaltySummary: PenaltySummary;
  linkedServiceIds: string[];
  protectionEligible: boolean;
  professionalType: ProfessionalType;
  /** Codex catalogue linkage */
  ruleId?: string | null;
  complianceId?: string | null;
  jurisdictionId?: string | null;
  obligationKind?: ObligationKind;
  scopeLevel?: ScopeLevel;
  verificationStatus?: VerificationStatus;
  deadlineText?: string;
  scheduleSource?: ScheduleSource;
  automationEnabled?: boolean;
  process?: ProcessProfileSummary | null;
  documents?: DocumentRequirementSummary[];
  condition?: ConditionExpression | null;
  evidence?: EvidenceSummary[];
  assetScopes?: AssetScopeSummary[];
  governingLaw?: string;
  formCode?: string;
  exceptionsText?: string;
  effectiveFrom?: string | null;
  effectiveTo?: string | null;
  taxPeriod?: string | null;
  turnoverBasis?: string | null;
  employeeBasis?: string | null;
}

export interface ComplianceTriggerMeta {
  version: string;
  lastVerified: string;
  disclaimer: string;
  sources: string[];
  dataRelease?: string;
  researchAsOf?: string;
  baseResearchAsOf?: string;
}

export interface ComplianceTriggerDataset {
  meta: ComplianceTriggerMeta;
  triggerTypes: TriggerTypeMeta[];
  departments: GovDepartment[];
  categories: TriggerCategory[];
  attributeDictionary: AttributeDictionary;
  triggers: ComplianceTrigger[];
}

/** Profile used to map triggers onto a client entity. */
export interface EntityComplianceProfile {
  id: string;
  name: string;
  clientId?: string;
  entityType: string;
  entityTypeId?: string;
  state: string;
  jurisdictionId?: string;
  industry: string;
  employees?: number;
  annualTurnoverInr?: number;
  registrations?: string[];
  activities?: string[];
  locations?: number;
  /** Optional bag of codex business_profile_fields */
  facts?: Record<string, string | number | boolean | null | undefined>;
  assetHoldings?: Array<{ assetClassId: string; actorRole: string }>;
}

export interface TriggerMatchResult {
  applies: boolean;
  result: ApplicabilityResult;
  reasons: string[];
  missingFacts: string[];
}

// ---------------------------------------------------------------------------
// Catalogue dimension types (for UI / ETL consumers)
// ---------------------------------------------------------------------------

export interface CatalogueEntityType {
  entityTypeId: string;
  name: string;
  uiGroup: string;
  displayLabels: string[];
}

export interface JurisdictionNode {
  jurisdictionId: string;
  name: string;
  level: string;
  parentId?: string | null;
}

export interface StateCoverageRow {
  coverageId: string;
  jurisdictionId: string;
  topic: string;
  applicabilityStatus?: string;
  authorityUrl?: string;
  applicationUrl?: string;
  coverageStatus: VerificationStatus;
  nextVerification?: string;
  linkedRuleIds?: string[];
}

export interface StatePropertyProfileSummary {
  propertyProfileId: string;
  jurisdictionId: string;
  recordTerms?: string;
  termsStatus?: string;
  rorUrl?: string;
  registrationUrl?: string;
  mutationUrl?: string;
  landRevenueUrl?: string;
  routeStatus?: string;
  physicalStepsStatus?: string;
  titleNote?: string;
}

export interface BusinessProfileFieldDef {
  fieldId: string;
  dataType: string;
  scope: string;
  description: string;
  requiredFor: string;
}

export interface ComplianceCatalogueDataset {
  meta: ComplianceTriggerMeta;
  entityTypes: CatalogueEntityType[];
  turnoverBands: TurnoverBand[];
  jurisdictions: JurisdictionNode[];
  departments: Array<{ departmentId: string; name: string; navigationCategory: string }>;
  businessProfileFields: BusinessProfileFieldDef[];
  assetClasses: Array<{ assetClassId: string; name: string; scopeNote: string }>;
  stateCoverage: StateCoverageRow[];
  statePropertyProfiles: StatePropertyProfileSummary[];
  sources: Array<{
    sourceId: string;
    url?: string;
    title?: string;
    sourceType?: string;
  }>;
}

/** Entity type display-string → codex id mapping */
export const ENTITY_TYPE_TO_ID: Record<string, string> = {
  'Pvt Ltd': 'private_company',
  'OPC': 'private_company',
  'Public Ltd': 'public_company',
  'LLP': 'llp',
  'Proprietorship': 'sole_proprietor',
  'Partnership': 'partnership',
  'Section 8': 'section8',
  'Trust': 'trust',
  'Society': 'society',
  'Individual': 'individual',
  'HUF': 'huf',
  'Other': 'other',
};

export const ENTITY_ID_TO_DISPLAY: Record<string, string[]> = {
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

export const FILING_ELIGIBLE_OBLIGATION_KINDS = new Set([
  'mandatory_if_applicable',
  'ongoing_duty',
]);

export const TYPED_DEADLINE_TYPES = new Set([
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
