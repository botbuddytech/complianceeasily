-- Documents + storage bucket policies

create type public.document_status as enum (
  'uploaded', 'pending_review', 'approved', 'rejected', 'expired'
);

create table public.documents (
  id text primary key,
  entity_id text not null references public.entities (id) on delete cascade,
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  name text not null,
  category text not null,
  file_type text not null,
  size_bytes bigint not null default 0,
  storage_path text,
  status public.document_status not null default 'uploaded',
  uploaded_by text not null,
  reviewer_professional_id text references public.professionals (id) on delete set null,
  uploaded_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index documents_entity_idx on public.documents (entity_id);
create index documents_reviewer_idx on public.documents (reviewer_professional_id);
create index documents_status_idx on public.documents (status);

create trigger documents_updated_at before update on public.documents
  for each row execute function public.set_updated_at();

-- Storage bucket (run via storage API / dashboard as well)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'documents',
  'documents',
  false,
  52428800,
  array[
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel',
    'image/png',
    'image/jpeg',
    'text/csv'
  ]
)
on conflict (id) do nothing;
