import type { Metadata } from 'next';
import Link from 'next/link';
import { MarketingChrome } from '@/components/MarketingChrome';
import { listPublishedCategories, listPublishedPosts, blogPageSize } from '@/lib/blog/public';

export const metadata: Metadata = {
  title: 'Compliance guides',
  description:
    'Plain-language guides to Indian GST, MCA, tax, labour and state compliances — what the law says, what to keep ready, and how ComplianceEasily tracks them.',
};

export const dynamic = 'force-dynamic';

type Search = { category?: string; page?: string; q?: string };

export default async function BlogIndexPage({
  searchParams,
}: {
  searchParams: Promise<Search>;
}) {
  const params = await searchParams;
  const category = params.category || '';
  const q = params.q || '';
  const page = Math.max(1, Number(params.page) || 1);

  const [categories, result] = await Promise.all([
    listPublishedCategories(),
    listPublishedPosts({ categorySlug: category || undefined, page, q }),
  ]);

  const pageCount = Math.max(1, Math.ceil(result.total / blogPageSize()));

  const hrefFor = (next: { category?: string; page?: number; q?: string }) => {
    const sp = new URLSearchParams();
    const cat = next.category ?? category;
    const query = next.q ?? q;
    const p = next.page ?? 1;
    if (cat) sp.set('category', cat);
    if (query) sp.set('q', query);
    if (p > 1) sp.set('page', String(p));
    const s = sp.toString();
    return s ? `/blog?${s}` : '/blog';
  };

  return (
    <MarketingChrome>
      <section className="bg-[#0E1217] text-white px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto space-y-4">
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-[#B89E6B]">
            Knowledge base
          </p>
          <h1 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight">
            Compliance guides
          </h1>
          <p className="max-w-2xl text-sm sm:text-base text-[#A8B0BA] leading-relaxed">
            One guide per statutory obligation — the law, government portals, what to keep ready
            if an officer checks, and how ComplianceEasily tracks it.
          </p>
          <form action="/blog" className="flex flex-col sm:flex-row gap-2 max-w-xl pt-2">
            {category ? <input type="hidden" name="category" value={category} /> : null}
            <input
              name="q"
              defaultValue={q}
              placeholder="Search GST, AOC-4, PF…"
              className="flex-1 rounded-xl border border-[#1E2630] bg-[#12161B] px-4 py-2.5 text-sm text-white outline-none placeholder:text-[#6B7580]"
            />
            <button
              type="submit"
              className="rounded-xl bg-[#B89E6B] px-5 py-2.5 text-sm font-semibold text-[#0E1217]"
            >
              Search
            </button>
          </form>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="mb-8">
          <p className="mb-3 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-[#6B7580]">
            Browse by topic
          </p>
          <div className="flex flex-wrap gap-2">
            <Link
              href={hrefFor({ category: '', page: 1 })}
              className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-[13px] font-semibold leading-none transition-colors ${
                !category
                  ? 'border-[#0E1217] bg-[#0E1217] text-white'
                  : 'border-[#E4DFD6] bg-white text-[#3D4650] hover:border-[#B89E6B]'
              }`}
            >
              All
              <span
                className={`inline-flex min-w-[1.35rem] items-center justify-center rounded-full px-1.5 py-0.5 font-mono text-[10px] font-bold tabular-nums ${
                  !category ? 'bg-[#B89E6B] text-[#0E1217]' : 'bg-[#F3F0EA] text-[#6B7580]'
                }`}
              >
                {categories.reduce((sum, c) => sum + c.count, 0)}
              </span>
            </Link>
            {categories.map((c) => {
              const active = category === c.slug;
              return (
                <Link
                  key={c.id}
                  href={hrefFor({ category: c.slug, page: 1 })}
                  className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-[13px] font-semibold leading-none transition-colors ${
                    active
                      ? 'border-[#0E1217] bg-[#0E1217] text-white'
                      : 'border-[#E4DFD6] bg-white text-[#3D4650] hover:border-[#B89E6B]'
                  }`}
                >
                  {c.name}
                  <span
                    className={`inline-flex min-w-[1.35rem] items-center justify-center rounded-full px-1.5 py-0.5 font-mono text-[10px] font-bold tabular-nums ${
                      active ? 'bg-[#B89E6B] text-[#0E1217]' : 'bg-[#F3F0EA] text-[#6B7580]'
                    }`}
                  >
                    {c.count}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>

        <p className="mb-4 font-mono text-[11px] text-[#6B7580]">
          {result.total} published guide{result.total === 1 ? '' : 's'}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {result.posts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="flex flex-col rounded-2xl border border-[#D5D0C6] bg-white p-5 hover:border-[#B89E6B] transition-colors"
            >
              <div className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#B89E6B]">
                {post.categoryName}
              </div>
              <h2 className="mt-2 font-display text-lg font-semibold leading-snug text-[#0E1217]">
                {post.title}
              </h2>
              <p className="mt-2 line-clamp-3 text-sm text-[#5C6570] leading-relaxed">
                {post.excerpt}
              </p>
              <div className="mt-4 text-xs font-semibold text-[#0E1217]">Read guide →</div>
            </Link>
          ))}
        </div>

        {result.posts.length === 0 && (
          <p className="rounded-2xl border border-dashed border-[#D5D0C6] bg-white p-10 text-center text-sm text-[#5C6570]">
            No published guides match this filter.
          </p>
        )}

        {pageCount > 1 && (
          <div className="mt-8 flex items-center justify-between gap-3">
            {page > 1 ? (
              <Link
                href={hrefFor({ page: page - 1 })}
                className="rounded-xl border border-[#D5D0C6] bg-white px-4 py-2 text-sm font-semibold"
              >
                Previous
              </Link>
            ) : (
              <span />
            )}
            <span className="font-mono text-xs text-[#6B7580]">
              Page {page} of {pageCount}
            </span>
            {page < pageCount ? (
              <Link
                href={hrefFor({ page: page + 1 })}
                className="rounded-xl border border-[#D5D0C6] bg-white px-4 py-2 text-sm font-semibold"
              >
                Next
              </Link>
            ) : (
              <span />
            )}
          </div>
        )}
      </section>
    </MarketingChrome>
  );
}
