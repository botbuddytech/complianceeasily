-- Row Level Security policies for all tables

alter table public.profiles enable row level security;
alter table public.workspaces enable row level security;
alter table public.workspace_members enable row level security;
alter table public.clients enable row level security;
alter table public.entities enable row level security;
alter table public.professionals enable row level security;
alter table public.professional_assignments enable row level security;
alter table public.filings enable row level security;
alter table public.documents enable row level security;
alter table public.compliance_triggers enable row level security;
alter table public.gov_departments enable row level security;
alter table public.trigger_categories enable row level security;
alter table public.trigger_types enable row level security;
alter table public.trigger_meta enable row level security;
alter table public.entity_trigger_matches enable row level security;
alter table public.reminders enable row level security;
alter table public.notification_jobs enable row level security;
alter table public.bank_connections enable row level security;
alter table public.email_connections enable row level security;
alter table public.statement_uploads enable row level security;
alter table public.books_integrations enable row level security;
alter table public.ledger_accounts enable row level security;
alter table public.ledger_entries enable row level security;
alter table public.gst_returns enable row level security;
alter table public.tds_returns enable row level security;
alter table public.itr_returns enable row level security;
alter table public.property_assets enable row level security;
alter table public.stock_holdings enable row level security;
alter table public.stock_ledger_entries enable row level security;
alter table public.investment_compliance_items enable row level security;
alter table public.subscriptions enable row level security;
alter table public.invoices enable row level security;
alter table public.protection_claims enable row level security;
alter table public.notification_preferences enable row level security;
alter table public.notification_preference_events enable row level security;
alter table public.services enable row level security;
alter table public.staff_users enable row level security;
alter table public.staff_permissions enable row level security;
alter table public.support_tickets enable row level security;
alter table public.plans enable row level security;
alter table public.permission_scopes enable row level security;
alter table public.service_fee_schedule enable row level security;

-- Helper: is staff?
create or replace function public.is_staff()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'staff'
  );
$$;

-- Helper: workspace membership
create or replace function public.is_workspace_member(ws uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.workspace_members wm
    where wm.workspace_id = ws
      and wm.user_id = auth.uid()
      and wm.status = 'active'
  );
$$;

-- Helper: professional assigned to entity
create or replace function public.is_assigned_professional(eid text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.professional_assignments pa
    join public.professionals pr on pr.id = pa.professional_id
    where pa.entity_id = eid
      and pa.active = true
      and pr.user_id = auth.uid()
  );
$$;

-- Profiles
create policy profiles_select_own on public.profiles
  for select using (id = auth.uid() or public.is_staff());
create policy profiles_update_own on public.profiles
  for update using (id = auth.uid());

-- Workspaces
create policy workspaces_select on public.workspaces
  for select using (public.is_workspace_member(id) or public.is_staff());

create policy workspace_members_select on public.workspace_members
  for select using (public.is_workspace_member(workspace_id) or public.is_staff());

-- Clients / entities
create policy clients_select on public.clients
  for select using (public.is_workspace_member(workspace_id) or public.is_staff());
create policy clients_write on public.clients
  for all using (public.is_workspace_member(workspace_id) or public.is_staff());

create policy entities_select on public.entities
  for select using (
    public.is_workspace_member(workspace_id)
    or public.is_assigned_professional(id)
    or public.is_staff()
  );
create policy entities_write on public.entities
  for all using (public.is_workspace_member(workspace_id) or public.is_staff());

-- Professionals
create policy professionals_select on public.professionals
  for select using (true);
create policy professional_assignments_select on public.professional_assignments
  for select using (
    public.is_staff()
    or exists (
      select 1 from public.professionals pr
      where pr.id = professional_id and pr.user_id = auth.uid()
    )
    or public.is_workspace_member(
      (select e.workspace_id from public.entities e where e.id = entity_id)
    )
  );
create policy professional_assignments_write on public.professional_assignments
  for all using (public.is_staff());

-- Filings
create policy filings_select on public.filings
  for select using (
    public.is_workspace_member(workspace_id)
    or public.is_assigned_professional(entity_id)
    or exists (
      select 1 from public.professionals pr
      where pr.id = professional_id and pr.user_id = auth.uid()
    )
    or public.is_staff()
  );
create policy filings_write on public.filings
  for all using (public.is_workspace_member(workspace_id) or public.is_staff());

-- Documents
create policy documents_select on public.documents
  for select using (
    public.is_workspace_member(workspace_id)
    or public.is_assigned_professional(entity_id)
    or exists (
      select 1 from public.professionals pr
      where pr.id = reviewer_professional_id and pr.user_id = auth.uid()
    )
    or public.is_staff()
  );
create policy documents_write on public.documents
  for all using (
    public.is_workspace_member(workspace_id)
    or public.is_staff()
    or exists (
      select 1 from public.professionals pr
      where pr.id = reviewer_professional_id and pr.user_id = auth.uid()
    )
  );

-- Trigger catalogue: readable by authenticated users
create policy trigger_meta_select on public.trigger_meta for select to authenticated using (true);
create policy trigger_types_select on public.trigger_types for select to authenticated using (true);
create policy gov_departments_select on public.gov_departments for select to authenticated using (true);
create policy trigger_categories_select on public.trigger_categories for select to authenticated using (true);
create policy compliance_triggers_select on public.compliance_triggers for select to authenticated using (true);
create policy compliance_triggers_write on public.compliance_triggers for all using (public.is_staff());

create policy entity_trigger_matches_select on public.entity_trigger_matches
  for select using (
    public.is_staff()
    or public.is_assigned_professional(entity_id)
    or public.is_workspace_member(
      (select e.workspace_id from public.entities e where e.id = entity_id)
    )
  );

create policy reminders_select on public.reminders
  for select using (
    public.is_staff()
    or exists (
      select 1 from public.filings f
      where f.id = filing_id
        and (
          public.is_workspace_member(f.workspace_id)
          or public.is_assigned_professional(f.entity_id)
        )
    )
  );

-- Books
create policy bank_connections_access on public.bank_connections
  for all using (
    public.is_staff()
    or public.is_assigned_professional(entity_id)
    or public.is_workspace_member(
      (select e.workspace_id from public.entities e where e.id = entity_id)
    )
  );
create policy email_connections_access on public.email_connections
  for all using (
    public.is_staff()
    or public.is_assigned_professional(entity_id)
    or public.is_workspace_member(
      (select e.workspace_id from public.entities e where e.id = entity_id)
    )
  );
create policy statement_uploads_access on public.statement_uploads
  for all using (
    public.is_staff()
    or public.is_assigned_professional(entity_id)
    or public.is_workspace_member(
      (select e.workspace_id from public.entities e where e.id = entity_id)
    )
  );
create policy books_integrations_access on public.books_integrations
  for all using (
    public.is_staff()
    or public.is_assigned_professional(entity_id)
    or public.is_workspace_member(
      (select e.workspace_id from public.entities e where e.id = entity_id)
    )
  );
create policy ledger_accounts_access on public.ledger_accounts
  for all using (
    public.is_staff()
    or public.is_assigned_professional(entity_id)
    or public.is_workspace_member(
      (select e.workspace_id from public.entities e where e.id = entity_id)
    )
  );
create policy ledger_entries_access on public.ledger_entries
  for all using (
    public.is_staff()
    or public.is_assigned_professional(entity_id)
    or public.is_workspace_member(
      (select e.workspace_id from public.entities e where e.id = entity_id)
    )
  );
create policy gst_returns_access on public.gst_returns
  for all using (
    public.is_staff()
    or public.is_assigned_professional(entity_id)
    or public.is_workspace_member(
      (select e.workspace_id from public.entities e where e.id = entity_id)
    )
  );
create policy tds_returns_access on public.tds_returns
  for all using (
    public.is_staff()
    or public.is_assigned_professional(entity_id)
    or public.is_workspace_member(
      (select e.workspace_id from public.entities e where e.id = entity_id)
    )
  );
create policy itr_returns_access on public.itr_returns
  for all using (
    public.is_staff()
    or public.is_assigned_professional(entity_id)
    or public.is_workspace_member(
      (select e.workspace_id from public.entities e where e.id = entity_id)
    )
  );

-- Investments (client-scoped)
create policy property_assets_access on public.property_assets
  for all using (
    public.is_staff()
    or public.is_workspace_member(
      (select c.workspace_id from public.clients c where c.id = client_id)
    )
    or exists (
      select 1
      from public.entities e
      join public.professional_assignments pa on pa.entity_id = e.id and pa.active
      join public.professionals pr on pr.id = pa.professional_id
      where e.client_id = property_assets.client_id and pr.user_id = auth.uid()
    )
  );
create policy stock_holdings_access on public.stock_holdings
  for all using (
    public.is_staff()
    or public.is_workspace_member(
      (select c.workspace_id from public.clients c where c.id = client_id)
    )
    or exists (
      select 1
      from public.entities e
      join public.professional_assignments pa on pa.entity_id = e.id and pa.active
      join public.professionals pr on pr.id = pa.professional_id
      where e.client_id = stock_holdings.client_id and pr.user_id = auth.uid()
    )
  );
create policy stock_ledger_access on public.stock_ledger_entries
  for all using (
    public.is_staff()
    or public.is_workspace_member(
      (select c.workspace_id from public.clients c where c.id = client_id)
    )
    or exists (
      select 1
      from public.entities e
      join public.professional_assignments pa on pa.entity_id = e.id and pa.active
      join public.professionals pr on pr.id = pa.professional_id
      where e.client_id = stock_ledger_entries.client_id and pr.user_id = auth.uid()
    )
  );
create policy investment_compliance_access on public.investment_compliance_items
  for all using (
    public.is_staff()
    or public.is_workspace_member(
      (select c.workspace_id from public.clients c where c.id = client_id)
    )
    or exists (
      select 1
      from public.entities e
      join public.professional_assignments pa on pa.entity_id = e.id and pa.active
      join public.professionals pr on pr.id = pa.professional_id
      where e.client_id = investment_compliance_items.client_id and pr.user_id = auth.uid()
    )
  );

-- Billing
create policy subscriptions_access on public.subscriptions
  for all using (public.is_workspace_member(workspace_id) or public.is_staff());
create policy invoices_access on public.invoices
  for all using (public.is_workspace_member(workspace_id) or public.is_staff());
create policy protection_claims_access on public.protection_claims
  for all using (public.is_workspace_member(workspace_id) or public.is_staff());

create policy notification_prefs_access on public.notification_preferences
  for all using (public.is_workspace_member(workspace_id) or public.is_staff());
create policy notification_pref_events_access on public.notification_preference_events
  for all using (
    public.is_staff()
    or exists (
      select 1 from public.notification_preferences np
      where np.id = preference_id and public.is_workspace_member(np.workspace_id)
    )
  );

-- Catalogue / staff / tickets
create policy services_select on public.services for select to authenticated using (true);
create policy services_write on public.services for all using (public.is_staff());
create policy plans_select on public.plans for select to authenticated using (true);
create policy permission_scopes_select on public.permission_scopes for select to authenticated using (true);
create policy service_fee_schedule_select on public.service_fee_schedule for select to authenticated using (true);

create policy staff_users_select on public.staff_users
  for select using (public.is_staff());
create policy staff_users_write on public.staff_users
  for all using (public.is_staff());
create policy staff_permissions_access on public.staff_permissions
  for all using (public.is_staff());

create policy support_tickets_select on public.support_tickets
  for select using (
    public.is_staff()
    or (workspace_id is not null and public.is_workspace_member(workspace_id))
  );
create policy support_tickets_write on public.support_tickets
  for all using (
    public.is_staff()
    or (workspace_id is not null and public.is_workspace_member(workspace_id))
  );

-- Storage RLS for documents bucket
create policy documents_storage_select on storage.objects
  for select to authenticated
  using (bucket_id = 'documents');

create policy documents_storage_insert on storage.objects
  for insert to authenticated
  with check (bucket_id = 'documents');

create policy documents_storage_update on storage.objects
  for update to authenticated
  using (bucket_id = 'documents');
