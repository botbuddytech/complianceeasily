/** Shared with middleware (Edge) — no Node/Prisma imports. */
export function homePathForRole(role: string): string {
  if (role === 'staff') return '/admin';
  if (role === 'professional') return '/professional';
  return '/dashboard';
}
