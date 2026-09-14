import type { LucideIcon } from 'lucide-react';
import { Inbox } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  action?: React.ReactNode;
  variant?: 'client' | 'admin';
}

export function EmptyState({
  title,
  description,
  icon: Icon = Inbox,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#D5D0C6] bg-[#EBE8E2]/50 px-6 py-16 text-center text-[#6B7580]">
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl border border-[#D5D0C6] bg-white text-[#B89E6B]">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="text-sm font-semibold text-[#0E1217]">{title}</h3>
      {description && <p className="mt-1 max-w-sm text-xs">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}