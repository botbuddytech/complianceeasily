import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MarketingChrome } from '@/components/MarketingChrome';
import { BlogSectionIndex } from '@/components/blog/BlogSectionIndex';
import { renderBlogMarkdown } from '@/components/blog/renderBlogMarkdown';
import { getPublishedPost } from '@/lib/blog/public';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedPost(slug);
  if (!post) return { title: 'Guide not found' };
  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPublishedPost(slug);
  if (!post) notFound();

  return (
    <MarketingChrome>
      <article>
        <header className="bg-[#0E1217] text-white px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="max-w-6xl mx-auto lg:grid lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-10 xl:gap-14">
            <div className="lg:col-start-2 space-y-4">
              <Link
                href={`/blog?category=${encodeURIComponent(post.categorySlug)}`}
                className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-[#B89E6B] hover:underline"
              >
                {post.categoryName}
              </Link>
              <h1 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight leading-tight">
                {post.title}
              </h1>
              <p className="text-sm text-[#A8B0BA] leading-relaxed">{post.excerpt}</p>
              <div className="flex flex-wrap gap-x-3 gap-y-1 font-mono text-[11px] text-[#8B95A1]">
                <span>{post.author}</span>
                {post.publishedAt ? (
                  <>
                    <span>·</span>
                    <span>{post.publishedAt}</span>
                  </>
                ) : null}
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <div className="lg:grid lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-10 xl:gap-14">
            <aside className="mb-8 lg:mb-0">
              <div className="lg:sticky lg:top-24">
                <BlogSectionIndex sections={post.sections} />
              </div>
            </aside>
            <div className="min-w-0 space-y-4">
              {renderBlogMarkdown(post.body)}
              <div className="pt-6">
                <Link href="/blog" className="text-sm font-semibold text-[#8A7344] hover:underline">
                  ← All guides
                </Link>
              </div>
            </div>
          </div>
        </div>
      </article>
    </MarketingChrome>
  );
}
