'use client';

import { DemoRoleProvider } from '@/context/DemoRoleContext';
import { DashboardShell } from '@/components/dashboard/DashboardShell';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <DemoRoleProvider>
      <DashboardShell variant="admin">{children}</DashboardShell>
    </DemoRoleProvider>
  );
}
