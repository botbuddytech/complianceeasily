'use client';

import { Suspense } from 'react';
import { ComplianceTriggersPage } from '@/views/admin/ComplianceTriggersPage';

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="animate-pulse space-y-4 p-2">
          <div className="h-8 w-64 rounded bg-admin-bg" />
          <div className="h-24 rounded-2xl bg-admin-bg" />
          <div className="h-96 rounded-2xl bg-admin-bg" />
        </div>
      }
    >
      <ComplianceTriggersPage />
    </Suspense>
  );
}
