'use client';
import { ProfessionalInvestmentsLayout } from '@/views/professional/investments/InvestmentsLayout';
export default function Layout({ children }: { children: React.ReactNode }) {
  return <ProfessionalInvestmentsLayout>{children}</ProfessionalInvestmentsLayout>;
}
