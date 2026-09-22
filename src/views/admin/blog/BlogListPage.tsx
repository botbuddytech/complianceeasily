'use client';

import { useEffect, useMemo, useState, useTransition } from 'react';
import { Search, Plus } from 'lucide-react';
import { Link } from '@/components/nav/NextNav';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { StatusBadge } from '@/components/dashboard/StatusBadge';
import { DataTable, type Column } from '@/components/dashboard/DataTable';
import { blogCategoryById } from '@/data/dashboard/blogs';
import { listBlogCategories, listBlogPosts } from '@/lib/actions/blog';
import type { BlogCategory, BlogPost } from '@/types/dashboard';

export function BlogListPage() {
  const [q, setQ] = useState('');
  const [status, setStatus] = useState<string>('all');
  const [categoryId, setCategoryId] = useState<string>('all');
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    startTransition(() => {
      void Promise.all([listBlogPosts(), listBlogCategories()]).then(([p, c]) => {
        setPosts(p);
        setCategories(c);
      });
    });
  }, []);

  useEffect(() => {
    startTransition(() => {
      void listBlogPosts({ q, status, categoryId }).then(setPosts);
    });
  }, [q, status, categoryId]);

  const categoryName = (id: string) =>
    categories.find((c) => c.id === id)?.name ?? blogCategoryById(id)?.name ?? '—';

  const columns: Column<BlogPost>[] = useMemo(
    () => [
      {
        key: 'title',
        header: 'Post',
        render: (b) => (
          <div>
            <a
              href={`/blog/${b.slug}`}
              target="_blank"
              rel="noreferrer"
              className="font-semibold text-admin-text underline-offset-2 hover:text-[#8A7344] hover:underline"
            >
              {b.title}
            </a>
            <div className="max-w-md truncate text-xs text-admin-muted">{b.excerpt}</div>
          </div>
        ),
      },
      {
        key: 'category',
        header: 'Category',
        render: (b) => (
          <span className="text-sm font-medium text-admin-text">{categoryName(b.categoryId)}</span>
        ),
      },
      {
        key: 'slug',
        header: 'Slug',
        render: (b) => <span className="font-mono text-xs text-admin-muted">{b.slug}</span>,
      },
      {
        key: 'author',
        header: 'Author',
        render: (b) => <span className="text-sm text-admin-text">{b.author}</span>,
      },
      {
        key: 'status',
        header: 'Status',
        render: (b) => <StatusBadge status={b.status} />,
      },
      {
        key: 'updated',
        header: 'Updated',
        render: (b) => (
          <span className="font-mono text-xs text-admin-muted">{b.updatedAt}</span>
        ),
      },
      {
        key: 'tags',
        header: 'Tags',
        render: (b) => (
          <div className="flex flex-wrap gap-1">
            {b.tags.map((t) => (
              <span
                key={t}
                className="rounded-full border border-admin-border bg-admin-bg px-2 py-0.5 font-mono text-[10px] text-admin-muted"
              >
                {t}
              </span>
            ))}
          </div>
        ),
      },
    ],
    [categories],
  );

  return (
    <div>
      <PageHeader
        variant="admin"
        title="All blogs"
        description="Draft, publish, and archive ComplianceEasily content by category."
        actions={
          <Link
            to="/admin/blog/create"
            className="inline-flex items-center gap-2 rounded-xl bg-[#0E1217] px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90"
          >
            <Plus className="h-4 w-4" />
            Create blog
          </Link>
        }
      />

      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="flex flex-1 items-center gap-2 rounded-xl border border-admin-border bg-admin-surface px-3 py-2">
          <Search className="h-4 w-4 text-admin-muted" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search title, slug, author, category, tags…"
            className="w-full bg-transparent text-sm outline-none placeholder:text-admin-muted"
          />
        </div>
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="rounded-xl border border-admin-border bg-admin-surface px-3 py-2 text-sm"
        >
          <option value="all">All categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="rounded-xl border border-admin-border bg-admin-surface px-3 py-2 text-sm"
        >
          <option value="all">All statuses</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      {pending && (
        <p className="mb-2 font-mono text-[10px] uppercase tracking-wider text-admin-muted">
          Refreshing…
        </p>
      )}

      <DataTable variant="admin" columns={columns} rows={posts} rowKey={(r) => r.id} />
    </div>
  );
}
