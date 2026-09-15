'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDemoRole } from '../../context/DemoRoleContext';
import type { DashboardVariant } from './navConfig';
import type { UserRole } from '../../types/dashboard';
import { switchPortalView } from '@/lib/actions/auth';

const ROLE_PILLS: { role: UserRole; label: string; path: string; variant: DashboardVariant }[] = [
  { role: 'user', label: 'User', path: '/dashboard/overview', variant: 'client' },
  { role: 'admin', label: 'Admin', path: '/admin/overview', variant: 'admin' },
  {
    role: 'professional',
    label: 'Professional',
    path: '/professional/overview',
    variant: 'professional',
  },
];

export function RoleSwitcher({ variant }: { variant: DashboardVariant }) {
  const { currentRole, setRole } = useDemoRole();
  const router = useRouter();
  const [pending, setPending] = useState(false);

  const viewingLabel =
    variant === 'admin' ? 'Admin' : variant === 'professional' ? 'Professional' : 'User';

  const onSelect = async (pill: (typeof ROLE_PILLS)[number]) => {
    if (pending || variant === pill.variant) return;
    setPending(true);
    try {
      setRole(pill.role);
      const result = await switchPortalView(pill.role);
      if (result.ok) {
        router.push(result.redirectTo);
        router.refresh();
      } else {
        router.push(pill.path);
      }
    } finally {
      setPending(false);
    }
  };

  return (
    <div
      className={`inline-flex max-w-full items-center gap-1.5 sm:gap-2 rounded-full border px-1.5 sm:px-2 py-1 text-[10px] sm:text-[11px] font-mono ${
        variant === 'client'
          ? 'border-[#E3D7C7] bg-[#F5EFE6] text-[#5A3825]'
          : 'border-admin-border bg-white text-admin-muted'
      }`}
    >
      <span className="hidden lg:inline">
        Demo ·{' '}
        <strong className={variant === 'client' ? 'text-[#241A14]' : 'text-admin-text'}>
          {viewingLabel}
        </strong>
        <span className="opacity-60"> ({currentRole})</span>
      </span>

      <div
        className={`inline-flex rounded-full p-0.5 ${
          variant === 'client' ? 'bg-[#EAE1D3]' : 'bg-admin-bg'
        }`}
      >
        {ROLE_PILLS.map((pill) => {
          const active = variant === pill.variant;
          return (
            <button
              key={pill.role}
              type="button"
              disabled={pending}
              onClick={() => void onSelect(pill)}
              className={`rounded-full px-1.5 sm:px-2 py-0.5 font-semibold transition-colors disabled:opacity-60 ${
                active
                  ? variant === 'client'
                    ? 'bg-[#241A14] text-white'
                    : 'bg-admin-accent text-white'
                  : variant === 'client'
                    ? 'text-[#5A3825] hover:bg-[#E3D7C7]'
                    : 'text-admin-muted hover:bg-admin-border/40'
              }`}
            >
              <span className="sm:hidden">
                {pill.role === 'professional' ? 'Pro' : pill.label}
              </span>
              <span className="hidden sm:inline">{pill.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
