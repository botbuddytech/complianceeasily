'use server';

import { revalidatePath } from 'next/cache';
import { prisma, isPrismaConfigured } from '@/lib/prisma';
import { materializeEntity } from '@/lib/compliance/actions';
import type { Filing, ClaimStatus } from '@/types/dashboard';
import type {
  ClaimStatus as PrismaClaimStatus,
  DocumentStatus,
  FilingStatus,
  PlanId,
  ServiceStatus,
  StaffRole,
  TicketPriority,
} from '@prisma/client';

export type CreateEntityInput = {
  workspaceId: string;
  clientId: string;
  name: string;
  shortName: string;
  entityType: string;
  state: string;
  industry: string;
  locations?: number;
  gstin?: string;
  pan?: string;
  cin?: string;
  employees?: number;
  annualTurnoverInr?: number;
  registrations?: string[];
  activities?: string[];
  planId?: 'free' | 'pro' | 'managed';
};

function requireDb(): { error: string } | null {
  if (!isPrismaConfigured()) {
    return { error: 'Database is not configured. Set DATABASE_URL (and DIRECT_URL) to persist data.' };
  }
  return null;
}

export async function createEntity(input: CreateEntityInput): Promise<{ id: string } | { error: string }> {
  const cfg = requireDb();
  if (cfg) return cfg;

  const id = `ent-${input.shortName.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 24)}-${Date.now().toString(36)}`;
  try {
    await prisma.entity.create({
      data: {
        id,
        clientId: input.clientId,
        workspaceId: input.workspaceId,
        name: input.name,
        shortName: input.shortName,
        entityType: input.entityType,
        state: input.state,
        industry: input.industry,
        locations: input.locations ?? 1,
        gstin: input.gstin,
        pan: input.pan,
        cin: input.cin,
        employees: input.employees,
        annualTurnoverInr: input.annualTurnoverInr != null ? BigInt(input.annualTurnoverInr) : null,
        registrations: input.registrations ?? [],
        activities: input.activities ?? [],
        planId: (input.planId ?? 'free') as PlanId,
        healthScore: 50,
        healthLabel: 'New',
        protectionActive: input.planId === 'managed',
        radarActive: true,
      },
    });
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Failed to create entity' };
  }

  await materializeEntity(id);
  revalidatePath('/dashboard/entities');
  revalidatePath('/dashboard/filings');
  return { id };
}

export async function updateEntity(
  entityId: string,
  patch: Partial<CreateEntityInput>,
): Promise<{ ok: true } | { error: string }> {
  const cfg = requireDb();
  if (cfg) return cfg;

  try {
    await prisma.entity.update({
      where: { id: entityId },
      data: {
        ...(patch.name != null && { name: patch.name }),
        ...(patch.shortName != null && { shortName: patch.shortName }),
        ...(patch.entityType != null && { entityType: patch.entityType }),
        ...(patch.state != null && { state: patch.state }),
        ...(patch.industry != null && { industry: patch.industry }),
        ...(patch.locations != null && { locations: patch.locations }),
        ...(patch.gstin !== undefined && { gstin: patch.gstin }),
        ...(patch.pan !== undefined && { pan: patch.pan }),
        ...(patch.cin !== undefined && { cin: patch.cin }),
        ...(patch.employees !== undefined && { employees: patch.employees }),
        ...(patch.annualTurnoverInr !== undefined && {
          annualTurnoverInr: patch.annualTurnoverInr != null ? BigInt(patch.annualTurnoverInr) : null,
        }),
        ...(patch.registrations != null && { registrations: patch.registrations }),
        ...(patch.activities != null && { activities: patch.activities }),
        ...(patch.planId != null && { planId: patch.planId as PlanId }),
      },
    });
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Failed to update entity' };
  }

  await materializeEntity(entityId);
  revalidatePath('/dashboard/entities');
  return { ok: true };
}

export async function assignProfessionalToFiling(
  filingId: string,
  professionalId: string | null,
): Promise<{ ok: true } | { error: string }> {
  const cfg = requireDb();
  if (cfg) return cfg;

  try {
    const filing = await prisma.filing.update({
      where: { id: filingId },
      data: { professionalId },
      select: { entityId: true },
    });

    if (professionalId) {
      await prisma.professionalAssignment.upsert({
        where: {
          professionalId_entityId: {
            professionalId,
            entityId: filing.entityId,
          },
        },
        create: {
          professionalId,
          entityId: filing.entityId,
          active: true,
        },
        update: { active: true },
      });
    }
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Failed to assign professional' };
  }

  revalidatePath('/admin/filing-queue');
  revalidatePath('/professional/queue');
  return { ok: true };
}

export async function updateFilingStatus(
  filingId: string,
  status: Filing['status'],
  notes?: string,
): Promise<{ ok: true } | { error: string }> {
  const cfg = requireDb();
  if (cfg) return cfg;

  try {
    await prisma.filing.update({
      where: { id: filingId },
      data: {
        status: status as FilingStatus,
        ...(notes !== undefined && { notes }),
      },
    });
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Failed to update filing' };
  }

  revalidatePath('/dashboard/filings');
  revalidatePath('/professional/queue');
  return { ok: true };
}

export async function reviewDocument(
  documentId: string,
  status: 'approved' | 'rejected',
): Promise<{ ok: true } | { error: string }> {
  const cfg = requireDb();
  if (cfg) return cfg;

  try {
    await prisma.document.update({
      where: { id: documentId },
      data: { status: status as DocumentStatus },
    });
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Failed to review document' };
  }

  revalidatePath('/professional/document-review');
  revalidatePath('/dashboard/documents');
  return { ok: true };
}

export async function uploadDocumentMeta(input: {
  workspaceId: string;
  entityId: string;
  name: string;
  category: string;
  fileType: string;
  sizeBytes: number;
  storagePath: string;
  uploadedBy: string;
  reviewerProfessionalId?: string;
}): Promise<{ id: string } | { error: string }> {
  const cfg = requireDb();
  if (cfg) return cfg;

  const id = `doc-${Date.now().toString(36)}`;
  try {
    await prisma.document.create({
      data: {
        id,
        workspaceId: input.workspaceId,
        entityId: input.entityId,
        name: input.name,
        category: input.category,
        fileType: input.fileType,
        sizeBytes: BigInt(input.sizeBytes),
        storagePath: input.storagePath,
        status: 'pending_review',
        uploadedBy: input.uploadedBy,
        reviewerProfessionalId: input.reviewerProfessionalId,
      },
    });
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Failed to save document meta' };
  }

  revalidatePath('/dashboard/documents');
  return { id };
}

export async function submitProtectionClaim(input: {
  workspaceId: string;
  entityId: string;
  filingId?: string;
  filingName: string;
  amountClaimed: string;
  reason: string;
  evidenceDocumentIds?: string[];
}): Promise<{ id: string } | { error: string }> {
  const cfg = requireDb();
  if (cfg) return cfg;

  const id = `clm-${Date.now().toString(36)}`;
  try {
    await prisma.protectionClaim.create({
      data: {
        id,
        workspaceId: input.workspaceId,
        entityId: input.entityId,
        filingId: input.filingId,
        filingName: input.filingName,
        amountClaimed: input.amountClaimed,
        reason: input.reason,
        status: 'submitted',
        evidenceDocumentIds: input.evidenceDocumentIds ?? [],
      },
    });
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Failed to submit claim' };
  }

  revalidatePath('/dashboard/protection');
  revalidatePath('/admin/protection-claims');
  return { id };
}

export async function reviewProtectionClaim(
  claimId: string,
  status: Extract<ClaimStatus, 'approved' | 'rejected' | 'under_review' | 'paid'>,
  reviewedBy: string,
  reviewNote?: string,
): Promise<{ ok: true } | { error: string }> {
  const cfg = requireDb();
  if (cfg) return cfg;

  try {
    await prisma.protectionClaim.update({
      where: { id: claimId },
      data: {
        status: status as PrismaClaimStatus,
        reviewedBy,
        reviewNote,
      },
    });
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Failed to review claim' };
  }

  revalidatePath('/admin/protection-claims');
  return { ok: true };
}

export async function updateNotificationPreference(input: {
  preferenceId: string;
  enabled?: boolean;
  eventId?: string;
  eventEnabled?: boolean;
}): Promise<{ ok: true } | { error: string }> {
  const cfg = requireDb();
  if (cfg) return cfg;

  try {
    if (input.enabled != null) {
      await prisma.notificationPreference.update({
        where: { id: input.preferenceId },
        data: { enabled: input.enabled },
      });
    }
    if (input.eventId != null && input.eventEnabled != null) {
      await prisma.notificationPreferenceEvent.update({
        where: { id: input.eventId },
        data: { enabled: input.eventEnabled },
      });
    }
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Failed to update preferences' };
  }

  revalidatePath('/dashboard/notifications');
  return { ok: true };
}

export async function createSupportTicket(input: {
  workspaceId?: string;
  subject: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  requesterName: string;
  requesterEmail: string;
  entityName?: string;
  body?: string;
}): Promise<{ id: string } | { error: string }> {
  const cfg = requireDb();
  if (cfg) return cfg;

  const id = `tkt-${Date.now().toString(36)}`;
  try {
    await prisma.supportTicket.create({
      data: {
        id,
        workspaceId: input.workspaceId,
        subject: input.subject,
        category: input.category,
        priority: input.priority as TicketPriority,
        requesterName: input.requesterName,
        requesterEmail: input.requesterEmail,
        entityName: input.entityName,
        body: input.body,
        status: 'open',
      },
    });
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Failed to create ticket' };
  }

  revalidatePath('/dashboard/support');
  revalidatePath('/admin/support');
  return { id };
}

export async function inviteStaffUser(input: {
  name: string;
  email: string;
  role: 'super_admin' | 'ops_manager' | 'reviewer' | 'support' | 'viewer';
  scopes: string[];
}): Promise<{ id: string } | { error: string }> {
  const cfg = requireDb();
  if (cfg) return cfg;

  const id = `staff-${Date.now().toString(36)}`;
  try {
    await prisma.staffUser.create({
      data: {
        id,
        name: input.name,
        email: input.email,
        role: input.role as StaffRole,
        status: 'invited',
        permissions: input.scopes.length
          ? {
              create: input.scopes.map((scope) => ({ scope })),
            }
          : undefined,
      },
    });
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Failed to invite staff' };
  }

  revalidatePath('/admin/users');
  return { id };
}

export async function upsertService(input: {
  id?: string;
  name: string;
  shortName: string;
  category: string;
  department: string;
  price: string;
  governmentFees: string;
  status: 'active' | 'coming_soon' | 'deprecated';
  protectionEligible: boolean;
  isPublic?: boolean;
}): Promise<{ id: string } | { error: string }> {
  const cfg = requireDb();
  if (cfg) return cfg;

  const id = input.id ?? `svc-${Date.now().toString(36)}`;
  try {
    await prisma.service.upsert({
      where: { id },
      create: {
        id,
        name: input.name,
        shortName: input.shortName,
        category: input.category,
        department: input.department,
        price: input.price,
        governmentFees: input.governmentFees,
        status: input.status as ServiceStatus,
        protectionEligible: input.protectionEligible,
        isPublic: input.isPublic ?? true,
      },
      update: {
        name: input.name,
        shortName: input.shortName,
        category: input.category,
        department: input.department,
        price: input.price,
        governmentFees: input.governmentFees,
        status: input.status as ServiceStatus,
        protectionEligible: input.protectionEligible,
        isPublic: input.isPublic ?? true,
      },
    });
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Failed to upsert service' };
  }

  revalidatePath('/admin/catalogue');
  return { id };
}
