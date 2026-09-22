'use client';

import { FormEvent, useEffect, useMemo, useState, useTransition } from 'react';
import { FolderPlus, Pencil, Search } from 'lucide-react';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { StatusBadge } from '@/components/dashboard/StatusBadge';
import { DataTable, type Column } from '@/components/dashboard/DataTable';
import { ADMIN_BLOG_CATEGORIES, ADMIN_BLOGS } from '@/data/dashboard/blogs';
import {
  listBlogCategories,
  listBlogPosts,
  upsertBlogCategory,
} from '@/lib/actions/blog';
import type { BlogCategory, BlogPost } from '@/types/dashboard';

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export function BlogCategoriesPage() {
  const [categories, setCategories] = useState<BlogCategory[]>(ADMIN_BLOG_CATEGORIES);
  const [posts, setPosts] = useState<BlogPost[]>(ADMIN_BLOGS);
  const [q, setQ] = useState('');
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [slugTouched, setSlugTouched] = useState(false);
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const refresh = () => {
    startTransition(() => {
      void Promise.all([listBlogCategories(), listBlogPosts()]).then(([c, p]) => {
        setCategories(c);
        setPosts(p);
      });
    });
  };

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const previewSlug = useMemo(
    () => (slugTouched ? slug : slugify(name)),
    [name, slug, slugTouched],
  );

  const postCount = useMemo(() => {
    const map = new Map<string, number>();
    for (const b of posts) {
      map.set(b.categoryId, (map.get(b.categoryId) ?? 0) + 1);
    }
    return map;
  }, [posts]);

  const rows = useMemo(() => {
    return categories.filter((c) => {
      const hay = `${c.name} ${c.slug} ${c.description}`.toLowerCase();
      return !q || hay.includes(q.toLowerCase());
    });
  }, [categories, q]);

  const resetForm = () => {
    setName('');
    setSlug('');
    setSlugTouched(false);
    setDescription('');
    setEditingId(null);
  };

  const onEdit = (cat: BlogCategory) => {
    setEditingId(cat.id);
    setName(cat.name);
    setSlug(cat.slug);
    setSlugTouched(true);
    setDescription(cat.description);
    setMessage(null);
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !previewSlug) {
      setMessage('Name and slug are required.');
      return;
    }

    startTransition(() => {
      void upsertBlogCategory({
        id: editingId ?? undefined,
        name,
        slug: previewSlug,
        description,
      }).then((result) => {
        if ('error' in result) {
          setMessage(result.error);
          return;
        }
        setMessage(
          editingId
            ? `Updated category “${name.trim()}”.`
            : `Created category “${name.trim()}”.`,
        );
        resetForm();
        refresh();
      });
    });
  };

  const columns: Column<BlogCategory>[] = [
    {
      key: 'name',
      header: 'Category',
      render: (c) => (
        <div>
          <div className="font-semibold text-admin-text">{c.name}</div>
          <div className="max-w-sm truncate text-xs text-admin-muted">{c.description || '—'}</div>
        </div>
      ),
    },
    {
      key: 'slug',
      header: 'Slug',
      render: (c) => <span className="font-mono text-xs text-admin-muted">{c.slug}</span>,
    },
    {
      key: 'posts',
      header: 'Posts',
      render: (c) => (
        <span className="font-mono text-sm font-semibold text-admin-text">
          {postCount.get(c.id) ?? 0}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (c) => <StatusBadge status={c.status} />,
    },
    {
      key: 'updated',
      header: 'Updated',
      render: (c) => (
        <span className="font-mono text-xs text-admin-muted">{c.updatedAt}</span>
      ),
    },
    {
      key: 'actions',
      header: '',
      render: (c) => (
        <button
          type="button"
          onClick={() => onEdit(c)}
          className="inline-flex items-center gap-1.5 rounded-lg border border-admin-border bg-admin-bg px-2.5 py-1.5 text-xs font-semibold text-admin-text hover:bg-admin-surface"
        >
          <Pencil className="h-3.5 w-3.5" />
          Edit
        </button>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        variant="admin"
        title="Blog categories"
        description="Group posts under GST, MCA, labour, product, and custom topics."
      />

      <div className="mb-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
        <form
          onSubmit={onSubmit}
          className="space-y-4 rounded-2xl border border-admin-border bg-admin-surface p-5"
        >
          <div className="flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-wider text-admin-muted">
            <FolderPlus className="h-3.5 w-3.5" />
            {editingId ? 'Edit category' : 'New category'}
          </div>

          <div className="space-y-1.5">
            <label className="font-mono text-[10px] font-bold uppercase tracking-wider text-admin-muted">
              Name *
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Income Tax"
              className="w-full rounded-xl border border-admin-border bg-admin-bg px-3 py-2.5 text-sm outline-none focus:border-admin-accent"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-mono text-[10px] font-bold uppercase tracking-wider text-admin-muted">
              Slug *
            </label>
            <input
              value={previewSlug}
              onChange={(e) => {
                setSlugTouched(true);
                setSlug(slugify(e.target.value));
              }}
              placeholder="income-tax"
              className="w-full rounded-xl border border-admin-border bg-admin-bg px-3 py-2.5 font-mono text-sm outline-none focus:border-admin-accent"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-mono text-[10px] font-bold uppercase tracking-wider text-admin-muted">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Short blurb for editors and public archive pages."
              className="w-full resize-y rounded-xl border border-admin-border bg-admin-bg px-3 py-2.5 text-sm outline-none focus:border-admin-accent"
            />
          </div>

          {message && (
            <p className="rounded-xl border border-admin-border bg-admin-bg px-3 py-2 text-sm text-admin-text">
              {message}
            </p>
          )}

          <div className="flex flex-wrap gap-2">
            <button
              type="submit"
              disabled={pending}
              className="rounded-xl bg-[#0E1217] px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60"
            >
              {pending ? 'Saving…' : editingId ? 'Save changes' : 'Add category'}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  resetForm();
                  setMessage(null);
                }}
                className="rounded-xl border border-admin-border bg-admin-bg px-4 py-2.5 text-sm font-semibold text-admin-text hover:bg-admin-surface"
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        <div>
          <div className="mb-3 flex items-center gap-2 rounded-xl border border-admin-border bg-admin-surface px-3 py-2">
            <Search className="h-4 w-4 text-admin-muted" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search categories…"
              className="w-full bg-transparent text-sm outline-none placeholder:text-admin-muted"
            />
          </div>
          <DataTable variant="admin" columns={columns} rows={rows} rowKey={(r) => r.id} />
        </div>
      </div>
    </div>
  );
}
