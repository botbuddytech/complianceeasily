import { prisma, isPrismaConfigured } from '@/lib/prisma';
import { readSessionFromCookies, type SessionPayload } from '@/lib/auth/session';
import type { SessionRole } from '@/lib/auth/session-token';

export { homePathForRole } from '@/lib/auth/paths';

export type CurrentUser = SessionPayload & {
  id: string;
};

export async function getCurrentUser(): Promise<CurrentUser | null> {
  const session = await readSessionFromCookies();
  if (!session) return null;
  if (!isPrismaConfigured()) {
    return { ...session, id: session.sub };
  }
  const user = await prisma.user.findUnique({
    where: { id: session.sub },
    select: { id: true, email: true, role: true, fullName: true, status: true },
  });
  if (!user || user.status !== 'active') return null;
  return {
    id: user.id,
    sub: user.id,
    email: user.email,
    role: user.role as SessionRole,
    fullName: user.fullName,
  };
}

export async function requireUser(): Promise<CurrentUser> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('Unauthorized');
  }
  return user;
}

export async function requireRole(...roles: SessionRole[]): Promise<CurrentUser> {
  const user = await requireUser();
  if (!roles.includes(user.role)) {
    throw new Error('Forbidden');
  }
  return user;
}
