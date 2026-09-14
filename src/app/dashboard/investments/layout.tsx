'use client';
import { InvestmentsLayout } from '@/views/dashboard/investments/InvestmentsLayout';
export default function Layout({ children }: { children: React.ReactNode }) {
  return <InvestmentsLayout>{children}</InvestmentsLayout>;
}
