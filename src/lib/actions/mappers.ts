import type { BusinessEntity, Filing, ComplianceDocument } from '@/types/dashboard';

/** Map DB entity row → BusinessEntity shape used by UI */
export function mapEntityRow(row: Record<string, unknown>): BusinessEntity {
  return {
    id: row.id as string,
    name: row.name as string,
    shortName: (row.short_name as string) ?? (row.shortName as string),
    entityType: (row.entity_type as string) ?? (row.entityType as string),
    gstin: row.gstin as string | undefined,
    pan: row.pan as string | undefined,
    cin: row.cin as string | undefined,
    state: row.state as string,
    locations: row.locations as number,
    industry: row.industry as string,
    healthScore: (row.health_score as number) ?? (row.healthScore as number) ?? 0,
    healthLabel: (row.health_label as string) ?? (row.healthLabel as string) ?? '',
    planId: (row.plan_id as BusinessEntity['planId']) ?? (row.planId as BusinessEntity['planId']),
    protectionActive: (row.protection_active as boolean) ?? (row.protectionActive as boolean) ?? false,
    radarActive: (row.radar_active as boolean) ?? (row.radarActive as boolean) ?? true,
    createdAt: (row.created_at as string) ?? (row.createdAt as string) ?? '',
    clientId: (row.client_id as string) ?? (row.clientId as string),
    employees: (row.employees as number) ?? undefined,
    annualTurnoverInr: (row.annual_turnover_inr as number) ?? (row.annualTurnoverInr as number),
    registrations: (row.registrations as string[]) ?? [],
    activities: (row.activities as string[]) ?? [],
  };
}

export function mapFilingRow(row: Record<string, unknown>): Filing {
  return {
    id: row.id as string,
    entityId: (row.entity_id as string) ?? (row.entityId as string),
    entityName: (row.entity_name as string) ?? (row.entityName as string) ?? '',
    name: row.name as string,
    shortName: (row.short_name as string) ?? (row.shortName as string),
    department: row.department as string,
    category: row.category as string,
    dueDate: (row.due_date as string) ?? (row.dueDate as string),
    periodLabel: (row.period_label as string) ?? (row.periodLabel as string),
    status: row.status as Filing['status'],
    protectionEligible: (row.protection_eligible as boolean) ?? (row.protectionEligible as boolean) ?? false,
    assignedProfessional: row.assigned_professional as string | undefined,
    professionalId: (row.professional_id as string) ?? (row.professionalId as string),
    notes: row.notes as string | undefined,
  };
}

export function mapDocumentRow(row: Record<string, unknown>): ComplianceDocument {
  return {
    id: row.id as string,
    entityId: (row.entity_id as string) ?? (row.entityId as string),
    entityName: (row.entity_name as string) ?? (row.entityName as string) ?? '',
    name: row.name as string,
    category: row.category as string,
    fileType: (row.file_type as string) ?? (row.fileType as string),
    sizeLabel:
      (row.size_label as string) ??
      `${Math.round(((row.size_bytes as number) ?? 0) / 1024)} KB`,
    uploadedAt: (row.uploaded_at as string) ?? (row.uploadedAt as string),
    status: row.status as ComplianceDocument['status'],
    uploadedBy: (row.uploaded_by as string) ?? (row.uploadedBy as string),
    reviewerProfessionalId:
      (row.reviewer_professional_id as string) ?? (row.reviewerProfessionalId as string),
  };
}
