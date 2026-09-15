-- Replace Supabase Auth-linked profiles with app-managed users table

create extension if not exists "pgcrypto";

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

do $$ begin
  create type public.user_account_status as enum ('active', 'disabled');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.user_role as enum ('client_user', 'professional', 'staff');
exception when duplicate_object then null;
end $$;

create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  password_hash text not null,
  full_name text not null default '',
  role public.user_role not null default 'client_user',
  status public.user_account_status not null default 'active',
  phone text,
  avatar_initials text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint users_email_unique unique (email)
);

-- Migrate existing profiles if present (placeholder emails / passwords)
do $$
begin
  if exists (
    select 1 from information_schema.tables
    where table_schema = 'public' and table_name = 'profiles'
  ) then
    insert into public.users (id, email, password_hash, full_name, role, phone, avatar_initials, created_at, updated_at)
    select
      p.id,
      lower(p.id::text) || '@migrated.local',
      '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.G2oQ.eKzqKxqO.',
      p.full_name,
      p.role,
      p.phone,
      p.avatar_initials,
      p.created_at,
      p.updated_at
    from public.profiles p
    on conflict (id) do nothing;
  end if;
end $$;

-- Drop auth.users → profiles trigger if it exists
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user();

-- Retarget FKs from profiles → users (only when source tables exist)
do $$
begin
  if exists (select 1 from information_schema.tables where table_schema='public' and table_name='workspace_members') then
    alter table public.workspace_members drop constraint if exists workspace_members_user_id_fkey;
    alter table public.workspace_members
      add constraint workspace_members_user_id_fkey
      foreign key (user_id) references public.users (id) on delete cascade;
  end if;

  if exists (select 1 from information_schema.tables where table_schema='public' and table_name='professionals') then
    alter table public.professionals drop constraint if exists professionals_user_id_fkey;
    alter table public.professionals
      add constraint professionals_user_id_fkey
      foreign key (user_id) references public.users (id) on delete set null;
  end if;

  if exists (select 1 from information_schema.tables where table_schema='public' and table_name='professional_assignments') then
    alter table public.professional_assignments drop constraint if exists professional_assignments_assigned_by_fkey;
    alter table public.professional_assignments
      add constraint professional_assignments_assigned_by_fkey
      foreign key (assigned_by) references public.users (id);
  end if;

  if exists (select 1 from information_schema.tables where table_schema='public' and table_name='staff_users') then
    alter table public.staff_users drop constraint if exists staff_users_user_id_fkey;
    alter table public.staff_users
      add constraint staff_users_user_id_fkey
      foreign key (user_id) references public.users (id) on delete set null;
  end if;
end $$;

drop trigger if exists profiles_updated_at on public.profiles;
drop table if exists public.profiles cascade;

drop trigger if exists users_updated_at on public.users;
create trigger users_updated_at before update on public.users
  for each row execute function public.set_updated_at();

alter table public.users enable row level security;
