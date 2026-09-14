-- Billing, protection claims, notifications, admin ops

create type public.subscription_status as enum (
  'active', 'trialing', 'past_due', 'cancelled'
);
create type public.invoice_status as enum (
  'paid', 'pending', 'failed', 'refunded'
);

create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  plan_id public.plan_id not null references public.plans (id),
  status public.subscription_status not null default 'active',
  price_display text not null,
  period text not null default 'month',
  entity_count int not null default 1,
  renewal_date date not null,
  features jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (workspace_id)
);

create table public.invoices (
  id text primary key,
  subscription_id uuid not null references public.subscriptions (id) on delete cascade,
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  date date not null,
  amount text not null,
  status public.invoice_status not null default 'pending',
  description text not null,
  download_url text,
  payment_provider_ref text,
  created_at timestamptz not null default now()
);

-- Protection claims status machine
create type public.claim_status as enum (
  'eligible', 'submitted', 'under_review', 'approved', 'rejected', 'paid'
);

create table public.protection_claims (
  id text primary key,
  entity_id text not null references public.entities (id) on delete cascade,
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  filing_id text references public.filings (id) on delete set null,
  filing_name text not null,
  amount_claimed text not null,
  submitted_at date not null default current_date,
  status public.claim_status not null default 'submitted',
  reason text not null,
  reviewed_by text,
  review_note text,
  evidence_document_ids text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index protection_claims_workspace_idx on public.protection_claims (workspace_id);
create index protection_claims_status_idx on public.protection_claims (status);

-- Notification preferences (exact channel/event structure from UI)
create table public.notification_preferences (
  id text primary key,
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  channel public.notify_channel not null,
  label text not null,
  description text not null,
  enabled boolean not null default true,
  unique (workspace_id, channel)
);

create table public.notification_preference_events (
  id text primary key,
  preference_id text not null references public.notification_preferences (id) on delete cascade,
  event_key text not null,
  label text not null,
  enabled boolean not null default true,
  unique (preference_id, event_key)
);

-- Unified services catalogue (marketing + admin)
create type public.service_status as enum ('active', 'coming_soon', 'deprecated');

create table public.services (
  id text primary key,
  name text not null,
  short_name text not null,
  category text not null,
  department text not null,
  price text not null,
  government_fees text not null default '₹0',
  status public.service_status not null default 'active',
  protection_eligible boolean not null default false,
  is_public boolean not null default true,
  filings_this_month int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Staff RBAC
create type public.staff_role as enum (
  'super_admin', 'ops_manager', 'reviewer', 'support', 'viewer'
);

create table public.staff_users (
  id text primary key,
  user_id uuid references public.profiles (id) on delete set null,
  name text not null,
  email text not null,
  role public.staff_role not null default 'viewer',
  status public.member_status not null default 'active',
  last_active timestamptz,
  created_at timestamptz not null default now()
);

create table public.permission_scopes (
  scope text primary key,
  description text not null default ''
);

insert into public.permission_scopes (scope, description) values
  ('all', 'Full access'),
  ('clients', 'Manage clients'),
  ('clients:read', 'Read clients'),
  ('filings', 'Manage filings'),
  ('filings:review', 'Review filings'),
  ('claims', 'Manage claims'),
  ('claims:review', 'Review protection claims'),
  ('professionals', 'Manage professionals'),
  ('support', 'Support tickets'),
  ('catalogue', 'Manage catalogue'),
  ('catalogue:read', 'Read catalogue'),
  ('users', 'Manage staff users');

create table public.staff_permissions (
  staff_user_id text not null references public.staff_users (id) on delete cascade,
  scope text not null references public.permission_scopes (scope) on delete cascade,
  primary key (staff_user_id, scope)
);

-- Support tickets
create type public.ticket_status as enum (
  'open', 'in_progress', 'waiting', 'resolved', 'closed'
);
create type public.ticket_priority as enum ('low', 'medium', 'high', 'urgent');

create table public.support_tickets (
  id text primary key,
  workspace_id uuid references public.workspaces (id) on delete set null,
  subject text not null,
  category text not null,
  status public.ticket_status not null default 'open',
  priority public.ticket_priority not null default 'medium',
  requester_name text not null,
  requester_email text not null,
  entity_name text,
  assignee_staff_id text references public.staff_users (id) on delete set null,
  body text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index support_tickets_status_idx on public.support_tickets (status);

-- Professional earnings fee schedule (replaces hardcoded map)
create table public.service_fee_schedule (
  category text primary key,
  fee_inr int not null
);

insert into public.service_fee_schedule (category, fee_inr) values
  ('GST', 499),
  ('Income Tax', 999),
  ('MCA', 1499),
  ('Labour', 799),
  ('Licences', 1499),
  ('Audit', 7499),
  ('Accounting', 1499);

create trigger subscriptions_updated_at before update on public.subscriptions
  for each row execute function public.set_updated_at();
create trigger protection_claims_updated_at before update on public.protection_claims
  for each row execute function public.set_updated_at();
create trigger services_updated_at before update on public.services
  for each row execute function public.set_updated_at();
create trigger support_tickets_updated_at before update on public.support_tickets
  for each row execute function public.set_updated_at();
