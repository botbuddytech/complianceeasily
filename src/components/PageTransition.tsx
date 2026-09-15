'use client';

import type { ReactNode } from 'react';

/**
 * Soft enter animation for route segments. Remounts on navigation via Next.js templates.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  return <div className="page-enter min-w-0">{children}</div>;
}
