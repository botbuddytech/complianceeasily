import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const result = await prisma.blogPost.updateMany({
    where: { status: { not: 'published' } },
    data: { status: 'published', publishedAt: new Date() },
  });
  const published = await prisma.blogPost.count({ where: { status: 'published' } });
  console.log(`updated=${result.count} published=${published}`);
}

main()
  .finally(() => prisma.$disconnect());
