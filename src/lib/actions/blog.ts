'use server';

import { revalidatePath } from 'next/cache';
import { prisma, isPrismaConfigured } from '@/lib/prisma';
import {
  ADMIN_BLOG_CATEGORIES,
  ADMIN_BLOGS,
} from '@/data/dashboard/blogs';
import type { BlogCategory, BlogPost, BlogStatus } from '@/types/dashboard';
import type {
  BlogCategoryStatus as PrismaBlogCategoryStatus,
  BlogPostStatus as PrismaBlogPostStatus,
} from '@prisma/client';

function requireDb(): { error: string } | null {
  if (!isPrismaConfigured()) {
    return {
      error: 'Database is not configured. Set DATABASE_URL (and DIRECT_URL) to persist data.',
    };
  }
  return null;
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function mapCategory(row: {
  id: string;
  name: string;
  slug: string;
  description: string;
  status: PrismaBlogCategoryStatus;
  updatedAt: Date;
}): BlogCategory {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    status: row.status,
    updatedAt: row.updatedAt.toISOString().slice(0, 10),
  };
}

function mapPost(row: {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  author: string;
  categoryId: string;
  status: PrismaBlogPostStatus;
  tags: string[];
  publishedAt: Date | null;
  updatedAt: Date;
}): BlogPost {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    excerpt: row.excerpt,
    body: row.body,
    author: row.author,
    categoryId: row.categoryId,
    status: row.status,
    tags: row.tags,
    publishedAt: row.publishedAt ? row.publishedAt.toISOString().slice(0, 10) : undefined,
    updatedAt: row.updatedAt.toISOString().slice(0, 10),
  };
}

export async function listBlogCategories(): Promise<BlogCategory[]> {
  if (!isPrismaConfigured()) return ADMIN_BLOG_CATEGORIES;
  try {
    const rows = await prisma.blogCategory.findMany({
      orderBy: { name: 'asc' },
    });
    return rows.map(mapCategory);
  } catch {
    return ADMIN_BLOG_CATEGORIES;
  }
}

export async function listBlogPosts(filters?: {
  q?: string;
  status?: string;
  categoryId?: string;
}): Promise<BlogPost[]> {
  const q = filters?.q?.trim().toLowerCase() ?? '';
  const status = filters?.status && filters.status !== 'all' ? filters.status : undefined;
  const categoryId =
    filters?.categoryId && filters.categoryId !== 'all' ? filters.categoryId : undefined;

  if (!isPrismaConfigured()) {
    return ADMIN_BLOGS.filter((b) => {
      const hay = `${b.title} ${b.slug} ${b.author} ${b.tags.join(' ')}`.toLowerCase();
      const matchesQ = !q || hay.includes(q);
      const matchesStatus = !status || b.status === status;
      const matchesCategory = !categoryId || b.categoryId === categoryId;
      return matchesQ && matchesStatus && matchesCategory;
    });
  }

  try {
    const rows = await prisma.blogPost.findMany({
      where: {
        ...(status ? { status: status as PrismaBlogPostStatus } : {}),
        ...(categoryId ? { categoryId } : {}),
        ...(q
          ? {
              OR: [
                { title: { contains: q, mode: 'insensitive' } },
                { slug: { contains: q, mode: 'insensitive' } },
                { author: { contains: q, mode: 'insensitive' } },
                { excerpt: { contains: q, mode: 'insensitive' } },
              ],
            }
          : {}),
      },
      orderBy: { updatedAt: 'desc' },
    });
    return rows.map(mapPost);
  } catch {
    return ADMIN_BLOGS;
  }
}

export async function upsertBlogCategory(input: {
  id?: string;
  name: string;
  slug?: string;
  description?: string;
  status?: 'active' | 'archived';
}): Promise<{ id: string } | { error: string }> {
  const cfg = requireDb();
  if (cfg) return cfg;

  const name = input.name.trim();
  const slug = (input.slug?.trim() || slugify(name)).slice(0, 120);
  if (!name || !slug) return { error: 'Name and slug are required.' };

  const id = input.id ?? `cat-${slug}-${Date.now().toString(36)}`;
  try {
    await prisma.blogCategory.upsert({
      where: { id },
      create: {
        id,
        name,
        slug,
        description: input.description?.trim() ?? '',
        status: (input.status ?? 'active') as PrismaBlogCategoryStatus,
      },
      update: {
        name,
        slug,
        description: input.description?.trim() ?? '',
        ...(input.status ? { status: input.status as PrismaBlogCategoryStatus } : {}),
      },
    });
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Failed to save category' };
  }

  revalidatePath('/admin/blog/categories');
  revalidatePath('/admin/blog/all');
  revalidatePath('/admin/blog/create');
  return { id };
}

export async function createBlogPost(input: {
  title: string;
  slug?: string;
  excerpt?: string;
  body: string;
  author?: string;
  categoryId: string;
  status?: BlogStatus;
  tags?: string[];
}): Promise<{ id: string } | { error: string }> {
  const cfg = requireDb();
  if (cfg) return cfg;

  const title = input.title.trim();
  const slug = (input.slug?.trim() || slugify(title)).slice(0, 160);
  const body = input.body.trim();
  if (!title || !slug || !body) return { error: 'Title, slug, and body are required.' };
  if (!input.categoryId) return { error: 'Category is required.' };

  const status = (input.status ?? 'draft') as PrismaBlogPostStatus;
  const id = `blog-${slug.slice(0, 40)}-${Date.now().toString(36)}`;

  try {
    await prisma.blogPost.create({
      data: {
        id,
        title,
        slug,
        excerpt: input.excerpt?.trim() ?? '',
        body,
        author: input.author?.trim() || 'Ops Desk',
        categoryId: input.categoryId,
        status,
        tags: input.tags ?? [],
        publishedAt: status === 'published' ? new Date() : null,
      },
    });
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Failed to create post' };
  }

  revalidatePath('/admin/blog/all');
  revalidatePath('/admin/blog/create');
  revalidatePath('/admin/blog/categories');
  return { id };
}
