'use client';

import { DemoRoleProvider } from '@/context/DemoRoleContext';
import { DashboardShell } from '@/components/dashboard/DashboardShell';

export default function ProfessionalLayout({ children }: { children: React.ReactNode }) {
  return (
    <DemoRoleProvider>
      <DashboardShell variant="professional">{children}</DashboardShell>
    </DemoRoleProvider>
  );
}
