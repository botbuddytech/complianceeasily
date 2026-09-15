'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { BrandMark } from '@/components/BrandMark';

function isInternalNavLink(anchor: HTMLAnchorElement) {
  if (anchor.target && anchor.target !== '_self') return false;
  if (anchor.hasAttribute('download')) return false;
  const href = anchor.getAttribute('href');
  if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) {
    return false;
  }
  try {
    const url = new URL(href, window.location.href);
    if (url.origin !== window.location.origin) return false;
    if (
      url.pathname === window.location.pathname &&
      url.search === window.location.search
    ) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

function isAuthPath(path: string) {
  return (
    path === '/login' ||
    path === '/signup' ||
    path.startsWith('/login/') ||
    path.startsWith('/signup/')
  );
}

/**
 * Global route-change indicator: slim brass progress bar + blurred page backdrop.
 */
export function NavigationProgress() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [active, setActive] = useState(false);
  const [visible, setVisible] = useState(false);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const safetyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const routeKey = `${pathname}?${searchParams?.toString() ?? ''}`;

  const clearTimers = useCallback(() => {
    if (hideTimer.current) clearTimeout(hideTimer.current);
    if (safetyTimer.current) clearTimeout(safetyTimer.current);
    hideTimer.current = null;
    safetyTimer.current = null;
  }, []);

  const finish = useCallback(() => {
    clearTimers();
    setActive(false);
    hideTimer.current = setTimeout(() => {
      setVisible(false);
    }, 280);
  }, [clearTimers]);

  const start = useCallback(
    (destinationPath?: string) => {
      clearTimers();
      const dest = destinationPath ?? '';
      const light = isAuthPath(dest) || isAuthPath(pathname);
      setActive(true);
      setVisible(true);
      safetyTimer.current = setTimeout(() => finish(), light ? 2500 : 4500);
    },
    [clearTimers, finish, pathname],
  );

  useEffect(() => {
    finish();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- settle only when URL changes
  }, [routeKey]);

  useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const target = event.target;
      if (!(target instanceof Element)) return;
      const anchor = target.closest('a[href]');
      if (!(anchor instanceof HTMLAnchorElement)) return;
      if (!isInternalNavLink(anchor)) return;
      try {
        const url = new URL(anchor.href, window.location.href);
        start(url.pathname);
      } catch {
        start();
      }
    };

    const onPopState = () => start();

    document.addEventListener('click', onPointerDown, true);
    window.addEventListener('popstate', onPopState);
    return () => {
      document.removeEventListener('click', onPointerDown, true);
      window.removeEventListener('popstate', onPopState);
      clearTimers();
    };
  }, [start, clearTimers]);

  if (!visible) return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[100] flex flex-col"
      aria-live="polite"
      aria-busy={active}
      role="status"
    >
      {/* Blurred / frosted backdrop over the outgoing page */}
      <div
        className={`absolute inset-0 transition-[opacity,backdrop-filter] duration-300 ease-out ${
          active
            ? 'opacity-100 bg-[#F4F2EE]/45 backdrop-blur-md supports-[backdrop-filter]:bg-[#F4F2EE]/30'
            : 'opacity-0 bg-transparent backdrop-blur-none'
        }`}
        style={
          active
            ? {
                WebkitBackdropFilter: 'blur(10px)',
                backdropFilter: 'blur(10px)',
              }
            : undefined
        }
      />

      {/* Slim progress rail — above the blur */}
      <div className="relative z-10 h-[2px] w-full shrink-0 overflow-hidden bg-[#D5D0C6]/40">
        <div
          className={`absolute inset-y-0 left-0 bg-[#B89E6B] shadow-[0_0_12px_rgba(184,158,107,0.55)] transition-[width] duration-300 ease-out ${
            active ? 'nav-progress-bar w-[78%]' : 'w-full'
          }`}
        />
      </div>

      {/* Centered loader card */}
      <div
        className={`absolute inset-0 z-10 flex items-center justify-center px-4 transition-opacity duration-300 ${
          active ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="w-full max-w-sm rounded-2xl border border-[#D5D0C6]/90 bg-[#F4F2EE]/92 px-5 py-5 shadow-[0_16px_48px_-24px_rgba(14,18,23,0.45)] backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#0E1217]">
              <BrandMark size="xs" framed={false} className="!h-9 !w-9" />
              <span className="absolute inset-0 rounded-xl border border-[#B89E6B]/35 animate-pulse" />
            </div>
            <div className="min-w-0">
              <div className="font-display text-sm font-semibold tracking-tight text-[#0E1217]">
                ComplianceEasily
              </div>
              <div className="mt-0.5 font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-[#6B7580]">
                Preparing your workspace…
              </div>
            </div>
          </div>
          <div className="mt-3 h-1 overflow-hidden rounded-full bg-[#E4E0D8]">
            <div
              className={`h-full rounded-full bg-[#B89E6B] ${
                active ? 'nav-progress-fill' : 'w-full'
              }`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
