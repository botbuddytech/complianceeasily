-- Investments (client-scoped, not entity-scoped)

create type public.property_type as enum (
  'Residential', 'Commercial', 'Agricultural', 'Industrial', 'Land'
);
create type public.ownership_type as enum ('Owned', 'Co-owned', 'Leased');
create type public.exchange as enum ('NSE', 'BSE');
create type public.holding_type as enum ('Equity', 'Mutual Fund', 'ETF');
create type public.stock_txn_type as enum ('Buy', 'Sell', 'Dividend', 'Bonus');
create type public.investment_domain as enum ('Property', 'Stocks');

create table public.property_assets (
  id text primary key,
  client_id text not null references public.clients (id) on delete cascade,
  name text not null,
  type public.property_type not null,
  ownership_type public.ownership_type not null,
  address text not null,
  state text not null,
  area_sqft numeric,
  registration_no text not null,
  purchase_date date not null,
  purchase_value_inr bigint not null,
  current_value_inr bigint not null,
  created_at timestamptz not null default now()
);

create index property_assets_client_idx on public.property_assets (client_id);

create table public.stock_holdings (
  id text primary key,
  client_id text not null references public.clients (id) on delete cascade,
  broker_name text not null,
  symbol text not null,
  company_name text not null,
  exchange public.exchange not null,
  holding_type public.holding_type not null,
  quantity numeric(18, 4) not null,
  avg_buy_price_inr numeric(18, 4) not null,
  current_price_inr numeric(18, 4) not null,
  created_at timestamptz not null default now()
);

create index stock_holdings_client_idx on public.stock_holdings (client_id);

create table public.stock_ledger_entries (
  id text primary key,
  client_id text not null references public.clients (id) on delete cascade,
  date date not null,
  symbol text not null,
  company_name text not null,
  txn_type public.stock_txn_type not null,
  quantity numeric(18, 4) not null,
  price_inr numeric(18, 4) not null default 0,
  amount_inr numeric(18, 2) not null default 0,
  broker_name text not null,
  created_at timestamptz not null default now()
);

create index stock_ledger_client_idx on public.stock_ledger_entries (client_id);

create table public.investment_compliance_items (
  id text primary key,
  client_id text not null references public.clients (id) on delete cascade,
  domain public.investment_domain not null,
  asset_label text not null,
  name text not null,
  authority text not null,
  due_date date not null,
  period_label text,
  status public.filing_status not null default 'upcoming',
  notes text,
  created_at timestamptz not null default now()
);

create index investment_compliance_client_idx on public.investment_compliance_items (client_id);
