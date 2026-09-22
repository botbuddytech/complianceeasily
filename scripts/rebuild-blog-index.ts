/**
 * Rebuild public.blog_index from every published blog post.
 * Usage: npx tsx scripts/rebuild-blog-index.ts
 */
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  if (!process.env.DATABASE_URL || process.env.DATABASE_URL.includes('YOUR_PASSWORD')) {
    console.error('Set DATABASE_URL in .env first.');
    process.exit(1);
  }

  const posts = await prisma.blogPost.findMany({
    where: { status: 'published' },
    include: { category: { select: { id: true, name: true, slug: true } } },
    orderBy: [{ category: { name: 'asc' } }, { title: 'asc' }],
  });

  const indexedAt = new Date();
  await prisma.blogIndexEntry.deleteMany();
  await prisma.blogIndexEntry.createMany({
    data: posts.map((post, i) => ({
      id: post.id,
      postId: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      author: post.author,
      categoryId: post.category.id,
      categoryName: post.category.name,
      categorySlug: post.category.slug,
      tags: post.tags,
      position: i + 1,
      publishedAt: post.publishedAt,
      indexedAt,
    })),
  });

  const count = await prisma.blogIndexEntry.count();
  console.log(`Indexed ${count} published blogs.`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
