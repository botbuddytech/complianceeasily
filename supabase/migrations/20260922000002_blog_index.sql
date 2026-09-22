-- Published-blog catalogue. One row per published post.

create table public.blog_index (
  id text primary key,
  post_id text not null unique references public.blog_posts (id) on delete cascade,
  title text not null,
  slug text not null unique,
  excerpt text not null default '',
  author text not null default '',
  category_id text not null,
  category_name text not null,
  category_slug text not null,
  tags text[] not null default '{}',
  position int not null,
  published_at timestamptz,
  indexed_at timestamptz not null default now()
);

create index blog_index_category_slug_position_idx on public.blog_index (category_slug, position);
create index blog_index_title_idx on public.blog_index (title);
