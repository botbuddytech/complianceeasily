import { prisma, isPrismaConfigured } from '@/lib/prisma';
import { extractBlogSections } from '@/lib/blog/sections';

export type PublicBlogCard = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  author: string;
  categoryName: string;
  categorySlug: string;
  publishedAt: string | null;
  tags: string[];
};

export type PublicBlogSection = {
  heading: string;
  anchor: string;
  level: number;
};

export type PublicBlogPost = PublicBlogCard & {
  body: string;
  sections: PublicBlogSection[];
};

export type PublicBlogCategory = {
  id: string;
  name: string;
  slug: string;
  count: number;
};

const PAGE_SIZE = 24;

export function blogPageSize() {
  return PAGE_SIZE;
}

export async function listPublishedCategories(): Promise<PublicBlogCategory[]> {
  if (!isPrismaConfigured()) return [];
  const rows = await prisma.blogIndexEntry.groupBy({
    by: ['categoryId', 'categoryName', 'categorySlug'],
    _count: { _all: true },
    orderBy: { categoryName: 'asc' },
  });
  return rows.map((c) => ({
    id: c.categoryId,
    name: c.categoryName,
    slug: c.categorySlug,
    count: c._count._all,
  }));
}

export async function listPublishedPosts(opts: {
  categorySlug?: string;
  page?: number;
  q?: string;
}): Promise<{ posts: PublicBlogCard[]; total: number; page: number; pageSize: number }> {
  const page = Math.max(1, opts.page ?? 1);
  if (!isPrismaConfigured()) {
    return { posts: [], total: 0, page, pageSize: PAGE_SIZE };
  }

  const q = opts.q?.trim();
  const where = {
    ...(opts.categorySlug ? { categorySlug: opts.categorySlug } : {}),
    ...(q
      ? {
          OR: [
            { title: { contains: q, mode: 'insensitive' as const } },
            { excerpt: { contains: q, mode: 'insensitive' as const } },
            { slug: { contains: q, mode: 'insensitive' as const } },
          ],
        }
      : {}),
  };

  const [total, rows] = await Promise.all([
    prisma.blogIndexEntry.count({ where }),
    prisma.blogIndexEntry.findMany({
      where,
      orderBy: { position: 'asc' },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
  ]);

  return {
    total,
    page,
    pageSize: PAGE_SIZE,
    posts: rows.map((p) => ({
      id: p.postId,
      title: p.title,
      slug: p.slug,
      excerpt: p.excerpt,
      author: p.author,
      categoryName: p.categoryName,
      categorySlug: p.categorySlug,
      publishedAt: p.publishedAt ? p.publishedAt.toISOString().slice(0, 10) : null,
      tags: p.tags,
    })),
  };
}

export async function getPublishedPost(slug: string): Promise<PublicBlogPost | null> {
  if (!isPrismaConfigured()) return null;
  const p = await prisma.blogPost.findFirst({
    where: { slug, status: 'published' },
    include: {
      category: { select: { name: true, slug: true } },
      sections: { orderBy: { position: 'asc' } },
    },
  });
  if (!p) return null;
  const stored = p.sections.map((section) => ({
    heading: section.heading,
    anchor: section.anchor,
    level: section.level,
  }));
  return {
    id: p.id,
    title: p.title,
    slug: p.slug,
    excerpt: p.excerpt,
    body: p.body,
    author: p.author,
    categoryName: p.category.name,
    categorySlug: p.category.slug,
    publishedAt: p.publishedAt ? p.publishedAt.toISOString().slice(0, 10) : null,
    tags: p.tags,
    sections: stored.length ? stored : extractBlogSections(p.body),
  };
}
