'use client';

import { BlogLayout } from '@/views/admin/blog/BlogLayout';

export default function Layout({ children }: { children: React.ReactNode }) {
  return <BlogLayout>{children}</BlogLayout>;
}
