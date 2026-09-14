'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { isSupabaseConfigured, createServiceClient } from '@/lib/supabase/admin';
import { materializeEntity } from '@/lib/compliance/actions';
import type { Filing, ClaimStatus } from '@/types/dashboard';

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

export async function createEntity(input: CreateEntityInput): Promise<{ id: string } | { error: string }> {
  if (!isSupabaseConfigured()) {
    return { error: 'Supabase is not configured. Set env vars to persist entities.' };
  }
  const id = `ent-${input.shortName.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 24)}-${Date.now().toString(36)}`;
  const supabase = await createClient();
  const { error } = await supabase.from('entities').insert({
    id,
    client_id: input.clientId,
    workspace_id: input.workspaceId,
    name: input.name,
    short_name: input.shortName,
    entity_type: input.entityType,
    state: input.state,
    industry: input.industry,
    locations: input.locations ?? 1,
    gstin: input.gstin,
    pan: input.pan,
    cin: input.cin,
    employees: input.employees,
    annual_turnover_inr: input.annualTurnoverInr,
    registrations: input.registrations ?? [],
    activities: input.activities ?? [],
    plan_id: input.planId ?? 'free',
    health_score: 50,
    health_label: 'New',
    protection_active: input.planId === 'managed',
    radar_active: true,
  });
  if (error) return { error: error.message };

  await materializeEntity(id);
  revalidatePath('/dashboard/entities');
  revalidatePath('/dashboard/filings');
  return { id };
}

export async function updateEntity(
  entityId: string,
  patch: Partial<CreateEntityInput>,
): Promise<{ ok: true } | { error: string }> {
  if (!isSupabaseConfigured()) return { error: 'Supabase is not configured' };
  const supabase = await createClient();
  const { error } = await supabase
    .from('entities')
    .update({
      name: patch.name,
      short_name: patch.shortName,
      entity_type: patch.entityType,
      state: patch.state,
      industry: patch.industry,
      locations: patch.locations,
      gstin: patch.gstin,
      pan: patch.pan,
      cin: patch.cin,
      employees: patch.employees,
      annual_turnover_inr: patch.annualTurnoverInr,
      registrations: patch.registrations,
      activities: patch.activities,
      plan_id: patch.planId,
    })
    .eq('id', entityId);
  if (error) return { error: error.message };
  await materializeEntity(entityId);
  revalidatePath('/dashboard/entities');
  return { ok: true };
}

export async function assignProfessionalToFiling(
  filingId: string,
  professionalId: string | null,
): Promise<{ ok: true } | { error: string }> {
  if (!isSupabaseConfigured()) return { error: 'Supabase is not configured' };
  const supabase = await createClient();
  const { error } = await supabase
    .from('filings')
    .update({ professional_id: professionalId })
    .eq('id', filingId);
  if (error) return { error: error.message };

  if (professionalId) {
    const { data: filing } = await supabase.from('filings').select('entity_id').eq('id', filingId).maybeSingle();
    if (filing?.entity_id) {
      await supabase.from('professional_assignments').upsert(
        {
          professional_id: professionalId,
          entity_id: filing.entity_id,
          active: true,
        },
        { onConflict: 'professional_id,entity_id' },
      );
    }
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
  if (!isSupabaseConfigured()) return { error: 'Supabase is not configured' };
  const supabase = await createClient();
  const { error } = await supabase
    .from('filings')
    .update({ status, notes: notes ?? undefined })
    .eq('id', filingId);
  if (error) return { error: error.message };
  revalidatePath('/dashboard/filings');
  revalidatePath('/professional/queue');
  return { ok: true };
}

export async function reviewDocument(
  documentId: string,
  status: 'approved' | 'rejected',
): Promise<{ ok: true } | { error: string }> {
  if (!isSupabaseConfigured()) return { error: 'Supabase is not configured' };
  const supabase = await createClient();
  const { error } = await supabase.from('documents').update({ status }).eq('id', documentId);
  if (error) return { error: error.message };
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
  if (!isSupabaseConfigured()) return { error: 'Supabase is not configured' };
  const id = `doc-${Date.now().toString(36)}`;
  const supabase = await createClient();
  const { error } = await supabase.from('documents').insert({
    id,
    workspace_id: input.workspaceId,
    entity_id: input.entityId,
    name: input.name,
    category: input.category,
    file_type: input.fileType,
    size_bytes: input.sizeBytes,
    storage_path: input.storagePath,
    status: 'pending_review',
    uploaded_by: input.uploadedBy,
    reviewer_professional_id: input.reviewerProfessionalId,
  });
  if (error) return { error: error.message };
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
  if (!isSupabaseConfigured()) return { error: 'Supabase is not configured' };
  const id = `clm-${Date.now().toString(36)}`;
  const supabase = await createClient();
  const { error } = await supabase.from('protection_claims').insert({
    id,
    workspace_id: input.workspaceId,
    entity_id: input.entityId,
    filing_id: input.filingId,
    filing_name: input.filingName,
    amount_claimed: input.amountClaimed,
    reason: input.reason,
    status: 'submitted',
    evidence_document_ids: input.evidenceDocumentIds ?? [],
  });
  if (error) return { error: error.message };
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
  if (!isSupabaseConfigured()) return { error: 'Supabase is not configured' };
  const supabase = await createClient();
  const { error } = await supabase
    .from('protection_claims')
    .update({
      status,
      reviewed_by: reviewedBy,
      review_note: reviewNote,
    })
    .eq('id', claimId);
  if (error) return { error: error.message };
  revalidatePath('/admin/protection-claims');
  return { ok: true };
}

export async function updateNotificationPreference(input: {
  preferenceId: string;
  enabled?: boolean;
  eventId?: string;
  eventEnabled?: boolean;
}): Promise<{ ok: true } | { error: string }> {
  if (!isSupabaseConfigured()) return { error: 'Supabase is not configured' };
  const supabase = await createClient();
  if (input.enabled != null) {
    const { error } = await supabase
      .from('notification_preferences')
      .update({ enabled: input.enabled })
      .eq('id', input.preferenceId);
    if (error) return { error: error.message };
  }
  if (input.eventId != null && input.eventEnabled != null) {
    const { error } = await supabase
      .from('notification_preference_events')
      .update({ enabled: input.eventEnabled })
      .eq('id', input.eventId);
    if (error) return { error: error.message };
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
  if (!isSupabaseConfigured()) return { error: 'Supabase is not configured' };
  const id = `tkt-${Date.now().toString(36)}`;
  const supabase = await createClient();
  const { error } = await supabase.from('support_tickets').insert({
    id,
    workspace_id: input.workspaceId,
    subject: input.subject,
    category: input.category,
    priority: input.priority,
    requester_name: input.requesterName,
    requester_email: input.requesterEmail,
    entity_name: input.entityName,
    body: input.body,
    status: 'open',
  });
  if (error) return { error: error.message };
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
  if (!isSupabaseConfigured()) return { error: 'Supabase is not configured' };
  const id = `staff-${Date.now().toString(36)}`;
  const admin = createServiceClient();
  const { error } = await admin.from('staff_users').insert({
    id,
    name: input.name,
    email: input.email,
    role: input.role,
    status: 'invited',
  });
  if (error) return { error: error.message };
  if (input.scopes.length) {
    await admin.from('staff_permissions').insert(
      input.scopes.map((scope) => ({ staff_user_id: id, scope })),
    );
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
  if (!isSupabaseConfigured()) return { error: 'Supabase is not configured' };
  const id = input.id ?? `svc-${Date.now().toString(36)}`;
  const supabase = await createClient();
  const { error } = await supabase.from('services').upsert({
    id,
    name: input.name,
    short_name: input.shortName,
    category: input.category,
    department: input.department,
    price: input.price,
    government_fees: input.governmentFees,
    status: input.status,
    protection_eligible: input.protectionEligible,
    is_public: input.isPublic ?? true,
  });
  if (error) return { error: error.message };
  revalidatePath('/admin/catalogue');
  return { id };
}
