'use client';

import { DemoRoleProvider } from '@/context/DemoRoleContext';
import { DashboardShell } from '@/components/dashboard/DashboardShell';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <DemoRoleProvider>
      <DashboardShell variant="client">{children}</DashboardShell>
    </DemoRoleProvider>
  );
}
