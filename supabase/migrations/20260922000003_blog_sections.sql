-- Per-post table of contents. One row per heading in a blog body.

create table public.blog_sections (
  id text primary key,
  post_id text not null references public.blog_posts (id) on delete cascade,
  heading text not null,
  anchor text not null,
  level int not null,
  position int not null,
  unique (post_id, position)
);

create index blog_sections_post_id_idx on public.blog_sections (post_id);
