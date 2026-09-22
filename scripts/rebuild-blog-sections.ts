/**
 * Rebuild public.blog_sections from each blog post body.
 * Usage: npx tsx scripts/rebuild-blog-sections.ts
 */
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { extractBlogSections } from '../src/lib/blog/sections';

const prisma = new PrismaClient();

async function main() {
  if (!process.env.DATABASE_URL || process.env.DATABASE_URL.includes('YOUR_PASSWORD')) {
    console.error('Set DATABASE_URL in .env first.');
    process.exit(1);
  }

  const posts = await prisma.blogPost.findMany({
    select: { id: true, body: true },
    orderBy: { title: 'asc' },
  });

  const rows = posts.flatMap((post) =>
    extractBlogSections(post.body).map((section) => ({
      id: `${post.id}-s${String(section.position).padStart(2, '0')}`,
      postId: post.id,
      heading: section.heading,
      anchor: section.anchor,
      level: section.level,
      position: section.position,
    })),
  );

  await prisma.blogSection.deleteMany();
  if (rows.length) {
    await prisma.blogSection.createMany({ data: rows });
  }

  console.log(`Indexed ${posts.length} blogs (${rows.length} sections).`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
