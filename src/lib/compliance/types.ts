/** Types for the Compliance Triggers JSON knowledge base. */

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
  minTurnoverInr?: number;
  maxTurnoverInr?: number;
  minEmployees?: number;
  industries: string[] | 'all';
  states: string[] | 'all';
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
}

export interface ComplianceTriggerMeta {
  version: string;
  lastVerified: string;
  disclaimer: string;
  sources: string[];
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
  state: string;
  industry: string;
  employees?: number;
  annualTurnoverInr?: number;
  registrations?: string[];
  activities?: string[];
  locations?: number;
}

export interface TriggerMatchResult {
  applies: boolean;
  reasons: string[];
}
