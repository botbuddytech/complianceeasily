'use server';

import { prisma, isPrismaConfigured } from '@/lib/prisma';
import { hashPassword, verifyPassword } from '@/lib/auth/password';
import { clearSessionCookie, setSessionCookie, readSessionFromCookies } from '@/lib/auth/session';
import { homePathForRole } from '@/lib/auth/paths';
import type { UserRole } from '@prisma/client';
import type { SessionRole } from '@/lib/auth/session-token';

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return 'U';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export type AuthResult =
  | { ok: true; redirectTo: string }
  | { ok: false; error: string };

export async function signUp(input: {
  fullName: string;
  email: string;
  password: string;
}): Promise<AuthResult> {
  if (!isPrismaConfigured()) {
    return { ok: false, error: 'Database is not configured. Set DATABASE_URL first.' };
  }

  const email = input.email.trim().toLowerCase();
  const fullName = input.fullName.trim();
  if (!email || !fullName || input.password.length < 8) {
    return { ok: false, error: 'Name, email, and a password of at least 8 characters are required.' };
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { ok: false, error: 'An account with this email already exists.' };
  }

  const passwordHash = await hashPassword(input.password);
  const role: UserRole = 'client_user';

  const user = await prisma.$transaction(async (tx) => {
    const created = await tx.user.create({
      data: {
        email,
        passwordHash,
        fullName,
        role,
        avatarInitials: initials(fullName),
        status: 'active',
      },
    });

    const workspace = await tx.workspace.create({
      data: { name: `${fullName}'s workspace` },
    });

    await tx.workspaceMember.create({
      data: {
        workspaceId: workspace.id,
        userId: created.id,
        memberRole: 'owner',
        status: 'active',
      },
    });

    return created;
  });

  await setSessionCookie({
    sub: user.id,
    email: user.email,
    role: user.role as SessionRole,
    fullName: user.fullName,
  });

  return { ok: true, redirectTo: homePathForRole(user.role) };
}

export async function signIn(input: {
  email: string;
  password: string;
}): Promise<AuthResult> {
  if (!isPrismaConfigured()) {
    return { ok: false, error: 'Database is not configured. Set DATABASE_URL first.' };
  }

  const email = input.email.trim().toLowerCase();
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || user.status !== 'active') {
    return { ok: false, error: 'Invalid email or password.' };
  }

  const valid = await verifyPassword(input.password, user.passwordHash);
  if (!valid) {
    return { ok: false, error: 'Invalid email or password.' };
  }

  await setSessionCookie({
    sub: user.id,
    email: user.email,
    role: user.role as SessionRole,
    fullName: user.fullName,
  });

  return { ok: true, redirectTo: homePathForRole(user.role) };
}

export async function signOut(): Promise<{ ok: true }> {
  await clearSessionCookie();
  return { ok: true };
}

/** Demo portal switcher: updates session role claim without changing DB role. */
export async function switchPortalView(
  portal: 'user' | 'admin' | 'professional',
): Promise<AuthResult> {
  const session = await readSessionFromCookies();
  if (!session) {
    return { ok: false, error: 'Not signed in' };
  }

  const roleMap = {
    user: 'client_user',
    admin: 'staff',
    professional: 'professional',
  } as const;

  const role = roleMap[portal];
  await setSessionCookie({
    sub: session.sub,
    email: session.email,
    fullName: session.fullName,
    role,
  });

  return {
    ok: true,
    redirectTo:
      portal === 'admin'
        ? '/admin/overview'
        : portal === 'professional'
          ? '/professional/overview'
          : '/dashboard/overview',
  };
}

