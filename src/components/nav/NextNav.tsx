'use client';

import NextLink from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode, CSSProperties, MouseEventHandler } from 'react';

type LinkProps = {
  to?: string;
  href?: string;
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
  title?: string;
  'aria-label'?: string;
};

/** Drop-in replacement for react-router-dom Link (supports `to` or `href`). */
export function Link({ to, href, children, ...rest }: LinkProps) {
  const target = href ?? to ?? '/';
  return (
    <NextLink href={target} {...rest}>
      {children}
    </NextLink>
  );
}

type NavLinkProps = Omit<LinkProps, 'className'> & {
  className?: string | ((args: { isActive: boolean }) => string);
  end?: boolean;
};

/** Drop-in replacement for react-router-dom NavLink. */
export function NavLink({ to, href, className, end, children, ...rest }: NavLinkProps) {
  const pathname = usePathname();
  const target = href ?? to ?? '/';
  const isActive = end
    ? pathname === target
    : pathname === target || pathname.startsWith(`${target}/`);

  const resolvedClass =
    typeof className === 'function' ? className({ isActive }) : className;

  return (
    <NextLink href={target} className={resolvedClass} {...rest}>
      {children}
    </NextLink>
  );
}
