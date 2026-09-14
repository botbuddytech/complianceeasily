import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { UserRole } from '../types/dashboard';

const STORAGE_KEY = 'ce-demo-role';

interface DemoRoleContextValue {
  currentRole: UserRole;
  setRole: (role: UserRole) => void;
  toggleRole: () => void;
}

const DemoRoleContext = createContext<DemoRoleContextValue | null>(null);

const ROLE_CYCLE: UserRole[] = ['user', 'admin', 'professional'];

function readStoredRole(): UserRole {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === 'admin' || raw === 'user' || raw === 'professional') return raw;
  } catch {
    /* ignore */
  }
  return 'user';
}

export function DemoRoleProvider({ children }: { children: ReactNode }) {
  const [currentRole, setCurrentRole] = useState<UserRole>(() =>
    typeof window !== 'undefined' ? readStoredRole() : 'user',
  );

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, currentRole);
    } catch {
      /* ignore */
    }
  }, [currentRole]);

  const setRole = useCallback((role: UserRole) => setCurrentRole(role), []);
  const toggleRole = useCallback(
    () =>
      setCurrentRole((r) => {
        const idx = ROLE_CYCLE.indexOf(r);
        return ROLE_CYCLE[(idx + 1) % ROLE_CYCLE.length];
      }),
    [],
  );

  const value = useMemo(
    () => ({ currentRole, setRole, toggleRole }),
    [currentRole, setRole, toggleRole],
  );

  return <DemoRoleContext.Provider value={value}>{children}</DemoRoleContext.Provider>;
}

export function useDemoRole() {
  const ctx = useContext(DemoRoleContext);
  if (!ctx) {
    throw new Error('useDemoRole must be used within DemoRoleProvider');
  }
  return ctx;
}
