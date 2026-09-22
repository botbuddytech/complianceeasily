import type {
  FilingStatus,
  DocumentStatus,
  ClaimStatus,
  TicketStatus,
  TicketPriority,
  PlanId,
} from '../../types/dashboard';

type AnyStatus =
  | FilingStatus
  | DocumentStatus
  | ClaimStatus
  | TicketStatus
  | TicketPriority
  | PlanId
  | 'active'
  | 'trial'
  | 'churned'
  | 'suspended'
  | 'invited'
  | 'disabled'
  | 'available'
  | 'busy'
  | 'offline'
  | 'paid'
  | 'pending'
  | 'failed'
  | 'refunded'
  | 'coming_soon'
  | 'deprecated'
  | string;

const STYLES: Record<string, string> = {
  compliant: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  filed: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  approved: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  paid: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  resolved: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  closed: 'bg-slate-100 text-slate-600 border-slate-200',
  active: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  available: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  upcoming: 'bg-sky-50 text-sky-800 border-sky-200',
  in_review: 'bg-sky-50 text-sky-800 border-sky-200',
  under_review: 'bg-sky-50 text-sky-800 border-sky-200',
  pending_review: 'bg-sky-50 text-sky-800 border-sky-200',
  uploaded: 'bg-sky-50 text-sky-800 border-sky-200',
  in_progress: 'bg-sky-50 text-sky-800 border-sky-200',
  open: 'bg-sky-50 text-sky-800 border-sky-200',
  trialing: 'bg-sky-50 text-sky-800 border-sky-200',
  trial: 'bg-sky-50 text-sky-800 border-sky-200',
  invited: 'bg-sky-50 text-sky-800 border-sky-200',
  action_required: 'bg-amber-50 text-amber-800 border-amber-200',
  need_info: 'bg-amber-50 text-amber-800 border-amber-200',
  waiting: 'bg-amber-50 text-amber-800 border-amber-200',
  pending: 'bg-amber-50 text-amber-800 border-amber-200',
  busy: 'bg-amber-50 text-amber-800 border-amber-200',
  medium: 'bg-amber-50 text-amber-800 border-amber-200',
  high: 'bg-orange-50 text-orange-800 border-orange-200',
  critical: 'bg-red-50 text-red-800 border-red-200',
  draft: 'bg-slate-100 text-slate-600 border-slate-200',
  published: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  archived: 'bg-slate-100 text-slate-600 border-slate-200',
  due: 'bg-amber-50 text-amber-800 border-amber-200',
  auto: 'bg-sky-50 text-sky-800 border-sky-200',
  generated: 'bg-teal-50 text-teal-800 border-teal-200',
  verified: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  overdue: 'bg-red-50 text-red-700 border-red-200',
  rejected: 'bg-red-50 text-red-700 border-red-200',
  failed: 'bg-red-50 text-red-700 border-red-200',
  urgent: 'bg-red-50 text-red-700 border-red-200',
  suspended: 'bg-red-50 text-red-700 border-red-200',
  expired: 'bg-red-50 text-red-700 border-red-200',
  churned: 'bg-slate-100 text-slate-600 border-slate-200',
  disabled: 'bg-slate-100 text-slate-600 border-slate-200',
  offline: 'bg-slate-100 text-slate-600 border-slate-200',
  refunded: 'bg-slate-100 text-slate-600 border-slate-200',
  cancelled: 'bg-slate-100 text-slate-600 border-slate-200',
  submitted: 'bg-violet-50 text-violet-800 border-violet-200',
  eligible: 'bg-teal-50 text-teal-800 border-teal-200',
  free: 'bg-slate-100 text-slate-700 border-slate-200',
  pro: 'bg-[#EBE8E2] text-[#B89E6B] border-[#D5D0C6]',
  managed: 'bg-[#0E1217] text-[#B89E6B] border-[#1E2630]',
  coming_soon: 'bg-slate-100 text-slate-600 border-slate-200',
  deprecated: 'bg-red-50 text-red-600 border-red-200',
  low: 'bg-slate-100 text-slate-600 border-slate-200',
  // Bookkeeping connections & uploads
  connected: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  syncing: 'bg-sky-50 text-sky-800 border-sky-200',
  disconnected: 'bg-slate-100 text-slate-600 border-slate-200',
  processing: 'bg-sky-50 text-sky-800 border-sky-200',
  processed: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  // Voucher types
  Payment: 'bg-red-50 text-red-700 border-red-200',
  Receipt: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  Sales: 'bg-sky-50 text-sky-800 border-sky-200',
  Purchase: 'bg-amber-50 text-amber-800 border-amber-200',
  Contra: 'bg-violet-50 text-violet-800 border-violet-200',
  Journal: 'bg-slate-100 text-slate-700 border-slate-200',
};

function labelize(status: string) {
  return status.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

export function StatusBadge({
  status,
  className = '',
}: {
  status: AnyStatus;
  className?: string;
}) {
  const key = String(status);
  const style = STYLES[key] ?? 'bg-slate-100 text-slate-700 border-slate-200';
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-mono font-semibold whitespace-nowrap ${style} ${className}`}
    >
      {labelize(key)}
    </span>
  );
}
