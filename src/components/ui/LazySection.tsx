'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { SectionPlaceholder } from './SectionPlaceholder';

type LazySectionProps = {
  children: ReactNode;
  /** How far before the viewport to start loading (px or CSS margin). */
  rootMargin?: string;
  className?: string;
  /** Optional placeholder height class to reduce CLS. */
  placeholderClassName?: string;
};

/**
 * Defers mounting (and thus dynamic-import fetch) until near the viewport.
 * Keeps above-the-fold JS small on long marketing pages.
 */
export function LazySection({
  children,
  rootMargin = '280px 0px',
  className = '',
  placeholderClassName = '',
}: LazySectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || visible) return;

    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin, threshold: 0.01 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [rootMargin, visible]);

  return (
    <div ref={ref} className={className}>
      {visible ? children : <SectionPlaceholder className={placeholderClassName} />}
    </div>
  );
}
