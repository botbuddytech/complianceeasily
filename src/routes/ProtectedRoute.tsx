import { useEffect, type ReactNode } from 'react';
import type { UserRole } from '../types/dashboard';
import { useDemoRole } from '../context/DemoRoleContext';

/**
 * Auth seam for later: today this is a pass-through that syncs DemoRoleContext
 * with the dashboard subtree being viewed. Swap in real session / role checks here.
 */
export function ProtectedRoute({
  role,
  children,
}: {
  role: UserRole;
  children: ReactNode;
}) {
  const { setRole } = useDemoRole();

  useEffect(() => {
    setRole(role);
  }, [role, setRole]);

  // Future: if (!session || session.role !== role) return <Navigate to="/login" />;
  return <>{children}</>;
}
