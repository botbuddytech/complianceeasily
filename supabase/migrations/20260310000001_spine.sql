-- ComplianceEasily P0 spine schema
-- profiles, workspaces, workspace_members, clients, entities,
-- professionals, professional_assignments, filings

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Profiles (extends auth.users)
-- ---------------------------------------------------------------------------
create type public.user_role as enum ('client_user', 'professional', 'staff');

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null default '',
  role public.user_role not null default 'client_user',
  phone text,
  avatar_initials text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Workspaces + members
-- ---------------------------------------------------------------------------
create type public.member_role as enum (
  'owner', 'admin', 'collaborator', 'viewer', 'ca', 'cs', 'advocate'
);

create type public.member_status as enum ('active', 'invited', 'disabled');

create table public.workspaces (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.workspace_members (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  member_role public.member_role not null default 'collaborator',
  status public.member_status not null default 'active',
  last_active timestamptz,
  created_at timestamptz not null default now(),
  unique (workspace_id, user_id)
);

-- ---------------------------------------------------------------------------
-- Plans (referenced early by clients/entities)
-- ---------------------------------------------------------------------------
create type public.plan_id as enum ('free', 'pro', 'managed');

create table public.plans (
  id public.plan_id primary key,
  name text not null,
  price_display text not null,
  period text not null default 'month',
  features jsonb not null default '[]'::jsonb,
  is_public boolean not null default true
);

insert into public.plans (id, name, price_display, period, features) values
  ('free', 'Compliance Radar', '₹0', 'month', '["WhatsApp reminders","1 entity"]'::jsonb),
  ('pro', 'Compliance Pro', '₹999', 'month', '["Multi-entity","Document vault","Professional network"]'::jsonb),
  ('managed', 'Managed + Protected', '₹4,999', 'month', '["Managed filings","Protection guarantee","Dedicated CA"]'::jsonb);

-- ---------------------------------------------------------------------------
-- Clients
-- ---------------------------------------------------------------------------
create type public.client_status as enum ('active', 'trial', 'churned', 'suspended');

create table public.clients (
  id text primary key,
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  business_name text not null,
  contact_name text not null,
  email text not null,
  entity_count int not null default 0,
  plan_id public.plan_id not null default 'free',
  health_score int not null default 0,
  filings_due_this_week int not null default 0,
  protection_active boolean not null default false,
  state text not null,
  joined_at date not null default current_date,
  status public.client_status not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index clients_workspace_idx on public.clients (workspace_id);

-- ---------------------------------------------------------------------------
-- Entities
-- ---------------------------------------------------------------------------
create table public.entities (
  id text primary key,
  client_id text not null references public.clients (id) on delete cascade,
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  name text not null,
  short_name text not null,
  entity_type text not null,
  gstin text,
  pan text,
  cin text,
  state text not null,
  locations int not null default 1,
  industry text not null,
  health_score int not null default 0,
  health_label text not null default 'New',
  plan_id public.plan_id not null default 'free',
  protection_active boolean not null default false,
  radar_active boolean not null default true,
  employees int,
  annual_turnover_inr bigint,
  registrations text[] not null default '{}',
  activities text[] not null default '{}',
  created_at date not null default current_date,
  updated_at timestamptz not null default now()
);

create index entities_client_idx on public.entities (client_id);
create index entities_workspace_idx on public.entities (workspace_id);

-- ---------------------------------------------------------------------------
-- Professionals
-- ---------------------------------------------------------------------------
create type public.professional_type as enum ('CA', 'CS', 'Advocate', 'Internal');
create type public.professional_status as enum ('available', 'busy', 'offline');

create table public.professionals (
  id text primary key,
  user_id uuid references public.profiles (id) on delete set null,
  name text not null,
  email text not null,
  type public.professional_type not null,
  registration_no text,
  status public.professional_status not null default 'available',
  specialties text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Explicit assignment source of truth
create table public.professional_assignments (
  id uuid primary key default gen_random_uuid(),
  professional_id text not null references public.professionals (id) on delete cascade,
  entity_id text not null references public.entities (id) on delete cascade,
  assigned_by uuid references public.profiles (id),
  assigned_at timestamptz not null default now(),
  active boolean not null default true,
  unique (professional_id, entity_id)
);

create index professional_assignments_pro_idx on public.professional_assignments (professional_id);
create index professional_assignments_entity_idx on public.professional_assignments (entity_id);

-- ---------------------------------------------------------------------------
-- Filings
-- ---------------------------------------------------------------------------
create type public.filing_status as enum (
  'compliant', 'upcoming', 'action_required', 'overdue',
  'need_info', 'filed', 'in_review'
);

create table public.filings (
  id text primary key,
  entity_id text not null references public.entities (id) on delete cascade,
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  trigger_id text,
  name text not null,
  short_name text not null,
  department text not null,
  category text not null,
  due_date date not null,
  period_label text not null,
  status public.filing_status not null default 'upcoming',
  protection_eligible boolean not null default false,
  professional_id text references public.professionals (id) on delete set null,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index filings_entity_idx on public.filings (entity_id);
create index filings_professional_idx on public.filings (professional_id);
create index filings_due_date_idx on public.filings (due_date);
create index filings_status_idx on public.filings (status);

-- Unique constraint for materialized calendar filings
create unique index filings_materialize_uq
  on public.filings (entity_id, trigger_id, period_label)
  where trigger_id is not null;

-- ---------------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();
create trigger workspaces_updated_at before update on public.workspaces
  for each row execute function public.set_updated_at();
create trigger clients_updated_at before update on public.clients
  for each row execute function public.set_updated_at();
create trigger entities_updated_at before update on public.entities
  for each row execute function public.set_updated_at();
create trigger professionals_updated_at before update on public.professionals
  for each row execute function public.set_updated_at();
create trigger filings_updated_at before update on public.filings
  for each row execute function public.set_updated_at();

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.email, ''),
    coalesce((new.raw_user_meta_data->>'role')::public.user_role, 'client_user')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Professional workload view (computed, not stored)
create or replace view public.professional_workload as
select
  p.id,
  p.name,
  p.email,
  p.type,
  p.status,
  p.specialties,
  p.registration_no,
  count(f.id) filter (
    where f.status in ('upcoming', 'action_required', 'overdue', 'need_info', 'in_review')
  )::int as active_assignments,
  count(f.id) filter (
    where f.status in ('filed', 'compliant')
      and f.updated_at >= date_trunc('month', now())
  )::int as completed_this_month,
  coalesce(
    avg(
      extract(epoch from (f.updated_at - f.created_at)) / 86400.0
    ) filter (where f.status in ('filed', 'compliant')),
    0
  )::numeric(10, 1) as avg_turnaround_days
from public.professionals p
left join public.filings f on f.professional_id = p.id
group by p.id;
