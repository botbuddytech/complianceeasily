-- Blog categories and posts (admin CMS)

create type public.blog_category_status as enum ('active', 'archived');
create type public.blog_post_status as enum ('draft', 'published', 'archived');

create table public.blog_categories (
  id text primary key,
  name text not null,
  slug text not null unique,
  description text not null default '',
  status public.blog_category_status not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.blog_posts (
  id text primary key,
  title text not null,
  slug text not null unique,
  excerpt text not null default '',
  body text not null default '',
  author text not null default '',
  category_id text not null references public.blog_categories (id) on delete restrict,
  status public.blog_post_status not null default 'draft',
  tags text[] not null default '{}',
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index blog_posts_category_id_idx on public.blog_posts (category_id);
create index blog_posts_status_idx on public.blog_posts (status);
