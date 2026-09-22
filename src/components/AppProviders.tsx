'use client';

import { Suspense, useEffect, useState, type ReactNode } from 'react';
import dynamic from 'next/dynamic';
import { NavigationProgress } from './NavigationProgress';

const DummyChatbot = dynamic(
  () => import('./chatbot/DummyChatbot').then((m) => m.DummyChatbot),
  { ssr: false },
);

function DeferredChatbot() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const enable = () => {
      if (!cancelled) setReady(true);
    };

    const idle = (
      window as Window & {
        requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
        cancelIdleCallback?: (id: number) => void;
      }
    ).requestIdleCallback;

    if (typeof idle === 'function') {
      const id = idle(enable, { timeout: 3500 });
      return () => {
        cancelled = true;
        window.cancelIdleCallback?.(id);
      };
    }

    const timeout = window.setTimeout(enable, 2000);
    return () => {
      cancelled = true;
      window.clearTimeout(timeout);
    };
  }, []);

  if (!ready) return null;
  return <DummyChatbot />;
}

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <>
      <Suspense fallback={null}>
        <NavigationProgress />
      </Suspense>
      {children}
      <Suspense fallback={null}>
        <DeferredChatbot />
      </Suspense>
    </>
  );
}
