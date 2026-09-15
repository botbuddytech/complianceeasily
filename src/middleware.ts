import { NextResponse, type NextRequest } from 'next/server';
import { SESSION_COOKIE, verifySessionToken } from '@/lib/auth/session-token';
import { homePathForRole } from '@/lib/auth/paths';

const PROTECTED_PREFIXES = ['/dashboard', '/admin', '/professional'] as const;

function isProtected(pathname: string): boolean {
  return PROTECTED_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

function roleAllowsPath(_role: string, _pathname: string): boolean {
  // Any authenticated user may open client / admin / professional portals.
  // The RoleSwitcher drives navigation; tighten per-role later for production.
  return true;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const session = token ? await verifySessionToken(token) : null;

  if (isProtected(pathname)) {
    if (!session) {
      const login = new URL('/login', request.url);
      login.searchParams.set('next', pathname);
      return NextResponse.redirect(login);
    }
    if (!roleAllowsPath(session.role, pathname)) {
      return NextResponse.redirect(new URL(homePathForRole(session.role), request.url));
    }
    return NextResponse.next();
  }

  if (session && (pathname === '/login' || pathname === '/signup')) {
    return NextResponse.redirect(new URL(homePathForRole(session.role), request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
