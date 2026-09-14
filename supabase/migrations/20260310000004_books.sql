-- Bookkeeping: connections, ledgers, entries, GST/TDS/ITR returns

create type public.bank_code as enum ('HDFC', 'ICICI', 'AXIS', 'SBI', 'KOTAK', 'YES');
create type public.connection_status as enum (
  'connected', 'syncing', 'action_required', 'disconnected'
);
create type public.account_type as enum ('Current', 'Savings', 'CC/OD');
create type public.email_provider as enum ('gmail', 'outlook');
create type public.statement_status as enum ('processing', 'processed', 'failed');
create type public.ledger_group as enum (
  'Bank Accounts', 'Cash-in-Hand', 'Sundry Debtors', 'Sundry Creditors',
  'Sales Accounts', 'Purchase Accounts', 'Direct Expenses',
  'Indirect Expenses', 'Duties & Taxes'
);
create type public.voucher_type as enum (
  'Payment', 'Receipt', 'Sales', 'Purchase', 'Contra', 'Journal'
);
create type public.ledger_source as enum ('Bank Feed', 'Email', 'Manual Upload');

create table public.bank_connections (
  id text primary key,
  entity_id text not null references public.entities (id) on delete cascade,
  bank_name text not null,
  bank_code public.bank_code not null,
  account_number_masked text not null,
  account_type public.account_type not null default 'Current',
  status public.connection_status not null default 'disconnected',
  last_synced_at timestamptz,
  balance text not null default '₹0',
  created_at timestamptz not null default now()
);

create table public.email_connections (
  id text primary key,
  entity_id text not null references public.entities (id) on delete cascade,
  provider public.email_provider not null,
  email text,
  status public.connection_status not null default 'disconnected',
  last_synced_at timestamptz,
  invoices_fetched int not null default 0,
  created_at timestamptz not null default now()
);

create table public.statement_uploads (
  id text primary key,
  entity_id text not null references public.entities (id) on delete cascade,
  file_name text not null,
  bank_name text,
  uploaded_at timestamptz not null default now(),
  status public.statement_status not null default 'processing',
  transactions_found int not null default 0,
  period_label text not null default ''
);

create type public.integration_category as enum (
  'accounting', 'bank', 'email', 'portal'
);

create table public.books_integrations (
  id text primary key,
  entity_id text not null references public.entities (id) on delete cascade,
  category public.integration_category not null,
  code text not null,
  name text not null,
  description text not null default '',
  status public.connection_status not null default 'disconnected',
  last_synced_at timestamptz,
  detail text,
  portal_url text,
  entity_scoped boolean not null default true,
  unique (entity_id, code)
);

create table public.ledger_accounts (
  id text primary key,
  entity_id text not null references public.entities (id) on delete cascade,
  name text not null,
  "group" public.ledger_group not null,
  opening_balance numeric(18, 2) not null default 0,
  created_at timestamptz not null default now()
);

create index ledger_accounts_entity_idx on public.ledger_accounts (entity_id);

create table public.ledger_entries (
  id text primary key,
  entity_id text not null references public.entities (id) on delete cascade,
  ledger_account_id text references public.ledger_accounts (id) on delete set null,
  date date not null,
  particulars text not null,
  voucher_type public.voucher_type not null,
  ledger_name text not null,
  debit numeric(18, 2) not null default 0,
  credit numeric(18, 2) not null default 0,
  source public.ledger_source not null default 'Manual Upload',
  created_at timestamptz not null default now()
);

create index ledger_entries_entity_date_idx on public.ledger_entries (entity_id, date);

-- GST / TDS / ITR returns
create type public.gst_return_type as enum ('GSTR-1', 'GSTR-3B', 'GSTR-2B', 'GSTR-9', 'IFF');
create type public.gst_return_status as enum ('filed', 'draft', 'due', 'overdue', 'auto');

create table public.gst_returns (
  id text primary key,
  entity_id text not null references public.entities (id) on delete cascade,
  return_type public.gst_return_type not null,
  period_label text not null,
  period_from date not null,
  period_to date not null,
  due_date date not null,
  status public.gst_return_status not null default 'draft',
  taxable_value text not null default '₹0',
  igst text not null default '₹0',
  cgst text not null default '₹0',
  sgst text not null default '₹0',
  itc_available text,
  net_liability text,
  arn text,
  filed_at timestamptz,
  preview jsonb,
  created_at timestamptz not null default now()
);

create type public.tds_return_type as enum (
  'Form 26Q', 'Form 24Q', 'Form 27Q', 'Form 27EQ', 'Form 16', 'Form 16A'
);
create type public.tds_nature as enum ('TDS', 'TCS');
create type public.tds_return_status as enum (
  'filed', 'draft', 'due', 'overdue', 'generated'
);

create table public.tds_returns (
  id text primary key,
  entity_id text not null references public.entities (id) on delete cascade,
  return_type public.tds_return_type not null,
  nature public.tds_nature not null default 'TDS',
  period_label text not null,
  period_from date not null,
  period_to date not null,
  due_date date not null,
  status public.tds_return_status not null default 'draft',
  deductees int not null default 0,
  taxable_amount text not null default '₹0',
  tds_amount text not null default '₹0',
  challan_paid text,
  interest_late_fee text,
  acknowledgement text,
  filed_at timestamptz,
  preview jsonb,
  created_at timestamptz not null default now()
);

create type public.itr_form_type as enum (
  'ITR-1', 'ITR-2', 'ITR-3', 'ITR-4', 'ITR-5', 'ITR-6', 'ITR-7'
);
create type public.itr_return_status as enum (
  'filed', 'draft', 'due', 'overdue', 'verified'
);

create table public.itr_returns (
  id text primary key,
  entity_id text not null references public.entities (id) on delete cascade,
  form_type public.itr_form_type not null,
  ay text not null,
  fy text not null,
  period_from date not null,
  period_to date not null,
  status public.itr_return_status not null default 'draft',
  due_date date not null,
  filed_at timestamptz,
  acknowledgement text,
  total_income text not null default '₹0',
  tax_payable text not null default '₹0',
  preview jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

-- Entity tax registration metadata for books panels
create table public.entity_gst_profile (
  entity_id text primary key references public.entities (id) on delete cascade,
  gstin text not null,
  legal_name text not null,
  state text not null,
  registration_type text not null default 'Regular'
);

create table public.entity_tds_profile (
  entity_id text primary key references public.entities (id) on delete cascade,
  tan text not null,
  pan text not null,
  legal_name text not null,
  ay text not null
);

create table public.entity_itr_profile (
  entity_id text primary key references public.entities (id) on delete cascade,
  pan text not null,
  legal_name text not null
);
