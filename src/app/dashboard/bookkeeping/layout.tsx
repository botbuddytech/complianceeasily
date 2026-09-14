'use client';
import { BookkeepingLayout } from '@/views/dashboard/bookkeeping/BookkeepingLayout';
export default function Layout({ children }: { children: React.ReactNode }) {
  return <BookkeepingLayout>{children}</BookkeepingLayout>;
}
