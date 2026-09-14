-- ComplianceEasily trigger catalogue + matching runtime tables

create type public.trigger_priority as enum ('critical', 'high', 'medium', 'low');
create type public.trigger_status as enum ('active', 'draft');
create type public.dept_level as enum ('Central', 'State', 'Municipal', 'Sectoral');
create type public.schedule_frequency as enum (
  'monthly', 'quarterly', 'half_yearly', 'annual',
  'event', 'one_time', 'renewal', 'continuous'
);
create type public.notify_channel as enum ('whatsapp', 'email', 'sms', 'in_app');
create type public.overdue_escalation as enum ('ops_manager', 'professional', 'legal');

create table public.trigger_meta (
  id int primary key default 1 check (id = 1),
  version text not null,
  last_verified date not null,
  disclaimer text not null,
  sources jsonb not null default '[]'::jsonb
);

create table public.trigger_types (
  id text primary key,
  label text not null,
  subtitle text not null,
  description text not null,
  icon_name text not null
);

create table public.gov_departments (
  id text primary key,
  name text not null,
  short_name text not null,
  level public.dept_level not null,
  ministry text not null,
  regulator text not null,
  portal_url text not null,
  other_portals text[] not null default '{}',
  category_ids text[] not null default '{}',
  description text not null,
  icon_name text not null
);

create table public.trigger_categories (
  id text primary key,
  name text not null,
  code text not null,
  department_ids text[] not null default '{}',
  description text not null
);

create table public.compliance_triggers (
  id text primary key,
  name text not null,
  short_name text not null,
  department_id text not null references public.gov_departments (id),
  category_id text not null references public.trigger_categories (id),
  trigger_type text not null references public.trigger_types (id),
  priority public.trigger_priority not null default 'medium',
  status public.trigger_status not null default 'active',
  legal_reference text not null default '',
  forms text[] not null default '{}',
  description text not null default '',
  source_url text not null default '',
  last_verified date,
  applicability jsonb not null default '{}'::jsonb,
  schedule jsonb not null default '{}'::jsonb,
  notification jsonb not null default '{}'::jsonb,
  thresholds jsonb not null default '[]'::jsonb,
  penalty_summary jsonb not null default '{}'::jsonb,
  linked_service_ids text[] not null default '{}',
  protection_eligible boolean not null default false,
  professional_type public.professional_type not null default 'CA',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index compliance_triggers_dept_idx on public.compliance_triggers (department_id);
create index compliance_triggers_category_idx on public.compliance_triggers (category_id);
create index compliance_triggers_status_idx on public.compliance_triggers (status);

-- Runtime match results
create table public.entity_trigger_matches (
  id uuid primary key default gen_random_uuid(),
  entity_id text not null references public.entities (id) on delete cascade,
  trigger_id text not null references public.compliance_triggers (id) on delete cascade,
  applies boolean not null,
  reasons jsonb not null default '[]'::jsonb,
  evaluated_at timestamptz not null default now(),
  unique (entity_id, trigger_id)
);

create index entity_trigger_matches_entity_idx on public.entity_trigger_matches (entity_id);

-- Reminder rows for materialized filings
create type public.reminder_status as enum ('pending', 'queued', 'sent', 'failed', 'cancelled');

create table public.reminders (
  id uuid primary key default gen_random_uuid(),
  filing_id text not null references public.filings (id) on delete cascade,
  channel public.notify_channel not null,
  lead_days int not null,
  fire_at timestamptz not null,
  status public.reminder_status not null default 'pending',
  created_at timestamptz not null default now(),
  unique (filing_id, channel, lead_days)
);

create index reminders_fire_at_idx on public.reminders (fire_at) where status = 'pending';

-- Outbound notification job queue (stubbed delivery)
create type public.notification_job_status as enum (
  'pending', 'processing', 'sent', 'failed', 'skipped'
);

create table public.notification_jobs (
  id uuid primary key default gen_random_uuid(),
  reminder_id uuid references public.reminders (id) on delete set null,
  channel public.notify_channel not null,
  status public.notification_job_status not null default 'pending',
  payload jsonb not null default '{}'::jsonb,
  error text,
  created_at timestamptz not null default now(),
  processed_at timestamptz
);

create index notification_jobs_status_idx on public.notification_jobs (status);

-- Link filings.trigger_id to catalogue
alter table public.filings
  add constraint filings_trigger_id_fkey
  foreign key (trigger_id) references public.compliance_triggers (id)
  on delete set null;

create trigger compliance_triggers_updated_at before update on public.compliance_triggers
  for each row execute function public.set_updated_at();
