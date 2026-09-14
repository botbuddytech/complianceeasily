import { ReactNode, HTMLAttributes } from 'react';
import { useSectionTone } from './Section';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  hover?: boolean;
  featured?: boolean;
  as?: 'div' | 'article' | 'a';
  href?: string;
  target?: string;
  rel?: string;
}

export function Card({
  children,
  hover = true,
  featured = false,
  className = '',
  as = 'div',
  href,
  target,
  rel,
  ...rest
}: CardProps) {
  const tone = useSectionTone();
  const isDark = tone === 'espresso';
  const base = hover
    ? isDark
      ? 'card-on-dark'
      : 'card-elevated'
    : isDark
      ? 'card-on-dark'
      : 'card-static';

  const padding = className.includes('p-') ? '' : 'p-6';
  // Cards are almost always rendered as items inside an equal-height grid row
  // (RevealGroup wraps each item in a `h-full` motion.div). Without stretching
  // the visible card itself to fill that wrapper, cards with less content
  // (fewer list items, shorter copy) render shorter than their siblings,
  // producing uneven, misaligned rows across the page. `h-full` here makes
  // every card fill its grid cell so footers/badges line up across a row,
  // while remaining a no-op when a Card is used standalone (no definite
  // parent height to resolve the percentage against).
  const combined = `${base} h-full ${padding} ${className}`.trim();

  if (featured) {
    return (
      <div className="gradient-border h-full">
        <div className={`gradient-border-inner ${padding} ${className}`.trim()}>{children}</div>
      </div>
    );
  }

  if (as === 'a') {
    return (
      <a className={combined} href={href} target={target} rel={rel}>
        {children}
      </a>
    );
  }

  if (as === 'article') {
    return (
      <article className={combined} {...rest}>
        {children}
      </article>
    );
  }

  return (
    <div className={combined} {...rest}>
      {children}
    </div>
  );
}
