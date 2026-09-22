'use client';

import { FormEvent, useEffect, useMemo, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { Link } from '@/components/nav/NextNav';
import { ADMIN_BLOG_CATEGORIES } from '@/data/dashboard/blogs';
import { createBlogPost, listBlogCategories } from '@/lib/actions/blog';
import type { BlogCategory, BlogStatus } from '@/types/dashboard';

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export function BlogCreatePage() {
  const router = useRouter();
  const [categories, setCategories] = useState<BlogCategory[]>(ADMIN_BLOG_CATEGORIES);
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [slugTouched, setSlugTouched] = useState(false);
  const [excerpt, setExcerpt] = useState('');
  const [body, setBody] = useState('');
  const [author, setAuthor] = useState('Ops Desk');
  const [categoryId, setCategoryId] = useState(ADMIN_BLOG_CATEGORIES[0]?.id ?? '');
  const [tags, setTags] = useState('');
  const [status, setStatus] = useState<BlogStatus>('draft');
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    void listBlogCategories().then((cats) => {
      setCategories(cats);
      if (cats.length && !cats.some((c) => c.id === categoryId)) {
        setCategoryId(cats[0].id);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- load once
  }, []);

  const previewSlug = useMemo(
    () => (slugTouched ? slug : slugify(title)),
    [slug, slugTouched, title],
  );

  const categoryName = categories.find((c) => c.id === categoryId)?.name ?? 'Uncategorized';

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !previewSlug || !body.trim()) {
      setMessage('Title, slug, and body are required.');
      return;
    }
    if (!categoryId) {
      setMessage('Pick a category for this post.');
      return;
    }

    startTransition(() => {
      void createBlogPost({
        title,
        slug: previewSlug,
        excerpt,
        body,
        author,
        categoryId,
        status,
        tags: tags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
      }).then((result) => {
        if ('error' in result) {
          setMessage(result.error);
          return;
        }
        setMessage(`Saved “${title.trim()}” under ${categoryName} as ${status}.`);
        router.push('/admin/blog/all');
        router.refresh();
      });
    });
  };

  return (
    <div>
      <PageHeader
        variant="admin"
        title="Create blog"
        description="Draft a new post and place it under a blog category."
        actions={
          <div className="flex flex-wrap gap-2">
            <Link
              to="/admin/blog/categories"
              className="inline-flex items-center rounded-xl border border-admin-border bg-admin-surface px-4 py-2.5 text-sm font-semibold text-admin-text hover:bg-admin-bg"
            >
              Manage categories
            </Link>
            <Link
              to="/admin/blog/all"
              className="inline-flex items-center rounded-xl border border-admin-border bg-admin-surface px-4 py-2.5 text-sm font-semibold text-admin-text hover:bg-admin-bg"
            >
              View all blogs
            </Link>
          </div>
        }
      />

      <form
        onSubmit={onSubmit}
        className="max-w-3xl space-y-5 rounded-2xl border border-admin-border bg-admin-surface p-5 sm:p-6"
      >
        <div className="space-y-1.5">
          <label className="font-mono text-[10px] font-bold uppercase tracking-wider text-admin-muted">
            Title *
          </label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. GST due dates for FY 2025–26"
            className="w-full rounded-xl border border-admin-border bg-admin-bg px-3 py-2.5 text-sm outline-none focus:border-admin-accent"
            required
          />
        </div>

        <div className="space-y-1.5">
          <label className="font-mono text-[10px] font-bold uppercase tracking-wider text-admin-muted">
            Category *
          </label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full rounded-xl border border-admin-border bg-admin-bg px-3 py-2.5 text-sm outline-none focus:border-admin-accent"
            required
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
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
            placeholder="gst-due-dates-fy-2025-26"
            className="w-full rounded-xl border border-admin-border bg-admin-bg px-3 py-2.5 font-mono text-sm outline-none focus:border-admin-accent"
            required
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label className="font-mono text-[10px] font-bold uppercase tracking-wider text-admin-muted">
              Author
            </label>
            <input
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="w-full rounded-xl border border-admin-border bg-admin-bg px-3 py-2.5 text-sm outline-none focus:border-admin-accent"
            />
          </div>
          <div className="space-y-1.5">
            <label className="font-mono text-[10px] font-bold uppercase tracking-wider text-admin-muted">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as BlogStatus)}
              className="w-full rounded-xl border border-admin-border bg-admin-bg px-3 py-2.5 text-sm outline-none focus:border-admin-accent"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="font-mono text-[10px] font-bold uppercase tracking-wider text-admin-muted">
            Tags
          </label>
          <input
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="GST, Calendar, MCA (comma-separated)"
            className="w-full rounded-xl border border-admin-border bg-admin-bg px-3 py-2.5 text-sm outline-none focus:border-admin-accent"
          />
        </div>

        <div className="space-y-1.5">
          <label className="font-mono text-[10px] font-bold uppercase tracking-wider text-admin-muted">
            Excerpt
          </label>
          <textarea
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            rows={2}
            placeholder="One or two lines for cards and SEO."
            className="w-full resize-y rounded-xl border border-admin-border bg-admin-bg px-3 py-2.5 text-sm outline-none focus:border-admin-accent"
          />
        </div>

        <div className="space-y-1.5">
          <label className="font-mono text-[10px] font-bold uppercase tracking-wider text-admin-muted">
            Body *
          </label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={12}
            placeholder="Write the full post (Markdown or plain text for now)."
            className="w-full resize-y rounded-xl border border-admin-border bg-admin-bg px-3 py-2.5 text-sm outline-none focus:border-admin-accent"
            required
          />
        </div>

        {message && (
          <p className="rounded-xl border border-admin-border bg-admin-bg px-3 py-2 text-sm text-admin-text">
            {message}
          </p>
        )}

        <div className="flex flex-wrap gap-2 pt-1">
          <button
            type="submit"
            disabled={pending}
            className="rounded-xl bg-[#0E1217] px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60"
          >
            {pending ? 'Saving…' : 'Save post'}
          </button>
          <button
            type="button"
            onClick={() => {
              setStatus('draft');
              setMessage(null);
            }}
            className="rounded-xl border border-admin-border bg-admin-bg px-5 py-2.5 text-sm font-semibold text-admin-text hover:bg-admin-surface"
          >
            Keep as draft
          </button>
        </div>
      </form>
    </div>
  );
}
