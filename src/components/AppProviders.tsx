'use client';

import { Suspense, type ReactNode } from 'react';
import dynamic from 'next/dynamic';
import { NavigationProgress } from './NavigationProgress';

const DummyChatbot = dynamic(
  () => import('./chatbot/DummyChatbot').then((m) => m.DummyChatbot),
  { ssr: false },
);

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <>
      <Suspense fallback={null}>
        <NavigationProgress />
      </Suspense>
      {children}
      <Suspense fallback={null}>
        <DummyChatbot />
      </Suspense>
    </>
  );
}
