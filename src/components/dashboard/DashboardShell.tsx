'use client';

import { useState, type ReactNode } from 'react';
import type { DashboardVariant } from './navConfig';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

export function DashboardShell({
  variant,
  children,
}: {
  variant: DashboardVariant;
  children: ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-svh overflow-hidden bg-[#F4F2EE] text-[#0E1217] pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">
      <Sidebar
        variant={variant}
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed((c) => !c)}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar variant={variant} onOpenMobile={() => setMobileOpen(true)} />
        <main className="flex-1 overflow-y-auto overscroll-contain">
          <div className="mx-auto w-full max-w-7xl p-4 sm:p-6 lg:p-8 min-w-0">{children}</div>
        </main>
      </div>
    </div>
  );
}
