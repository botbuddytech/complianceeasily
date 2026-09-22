import type { BlogCategory, BlogPost } from '../../types/dashboard';

export const ADMIN_BLOG_CATEGORIES: BlogCategory[] = [
  {
    id: 'cat-gst',
    name: 'GST & Indirect Tax',
    slug: 'gst-indirect-tax',
    description: 'Returns, due dates, interest, and GSTN workflow guides.',
    status: 'active',
    updatedAt: '2026-03-14',
  },
  {
    id: 'cat-mca',
    name: 'MCA & Corporate',
    slug: 'mca-corporate',
    description: 'Company / LLP annual filings, DSC, and board process.',
    status: 'active',
    updatedAt: '2026-03-01',
  },
  {
    id: 'cat-labour',
    name: 'Labour & State',
    slug: 'labour-state',
    description: 'EPFO, ESIC, shops & establishment, and state-local rules.',
    status: 'active',
    updatedAt: '2026-01-09',
  },
  {
    id: 'cat-product',
    name: 'Product & Guarantee',
    slug: 'product-guarantee',
    description: 'Platform how-tos, Managed plans, and Protection Guarantee.',
    status: 'active',
    updatedAt: '2026-03-18',
  },
];

export const ADMIN_BLOGS: BlogPost[] = [
  {
    id: 'blog-1',
    title: 'GST due dates for FY 2025–26: what founders must track',
    slug: 'gst-due-dates-fy-2025-26',
    excerpt:
      'A practical calendar of GSTR-1 / GSTR-3B windows, interest traps, and when WhatsApp reminders actually help.',
    body: 'Full article body placeholder for GST due dates guide.',
    author: 'Ops Desk',
    categoryId: 'cat-gst',
    status: 'published',
    tags: ['GST', 'Calendar'],
    publishedAt: '2026-03-12',
    updatedAt: '2026-03-14',
  },
  {
    id: 'blog-2',
    title: 'MCA annual filings checklist for private limited companies',
    slug: 'mca-annual-filings-checklist',
    excerpt:
      'AOC-4, MGT-7, and board resolution hygiene — with the handoff points where a CS must sign off.',
    body: 'Full article body placeholder for MCA checklist.',
    author: 'CS Network',
    categoryId: 'cat-mca',
    status: 'published',
    tags: ['MCA', 'Company'],
    publishedAt: '2026-02-28',
    updatedAt: '2026-03-01',
  },
  {
    id: 'blog-3',
    title: 'How our Compliance Protection Guarantee works (and when it does not)',
    slug: 'compliance-protection-guarantee-explained',
    excerpt:
      'Plain-language terms for Managed plans: eligible late fees, exclusions, and claim timelines.',
    body: 'Full article body placeholder for protection guarantee.',
    author: 'Legal Desk',
    categoryId: 'cat-product',
    status: 'draft',
    tags: ['Protection', 'Managed'],
    updatedAt: '2026-03-18',
  },
  {
    id: 'blog-4',
    title: 'Multi-state labour registrations: when opening a second branch triggers new filings',
    slug: 'multi-state-labour-registrations',
    excerpt:
      'Shops & Establishment, professional tax, and LWF — the state-local traps that calendar tools miss.',
    body: 'Full article body placeholder for multi-state labour.',
    author: 'Ops Desk',
    categoryId: 'cat-labour',
    status: 'archived',
    tags: ['Labour', 'State'],
    publishedAt: '2025-11-04',
    updatedAt: '2026-01-09',
  },
];

export function blogCategoryById(id: string): BlogCategory | undefined {
  return ADMIN_BLOG_CATEGORIES.find((c) => c.id === id);
}

export function blogsInCategory(categoryId: string): BlogPost[] {
  return ADMIN_BLOGS.filter((b) => b.categoryId === categoryId);
}
