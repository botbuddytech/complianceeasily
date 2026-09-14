import { BadgeCheck, Landmark, Mail, BookOpenCheck, Link2, Scale, ShieldCheck } from 'lucide-react';

export type VerifiedBadgeVariant =
  | 'ca'
  | 'cs'
  | 'advocate'
  | 'standards'
  | 'bank'
  | 'email'
  | 'integration'
  | 'professional'
  | 'contract_sync';

const VARIANT_CONFIG: Record<
  VerifiedBadgeVariant,
  { label: string; icon: typeof BadgeCheck; className: string }
> = {
  ca: {
    label: 'CA Verified',
    icon: BadgeCheck,
    className: 'bg-[#B89E6B] text-white border-[#8A7349]',
  },
  cs: {
    label: 'CS Verified',
    icon: BadgeCheck,
    className: 'bg-[#B89E6B] text-white border-[#B89E6B]',
  },
  advocate: {
    label: 'Advocate Verified',
    icon: Scale,
    className: 'bg-[#E4E0D8] text-[#B89E6B] border-[#B89E6B]',
  },
  standards: {
    label: 'AS / Ind AS Aligned',
    icon: BookOpenCheck,
    className: 'bg-[#EBE8E2] text-[#B89E6B] border-[#D5A77B]',
  },
  bank: {
    label: 'Bank Feed Verified',
    icon: Landmark,
    className: 'bg-[#EBE8E2] text-[#1E2630] border-[#D5D0C6]',
  },
  email: {
    label: 'Email Ingest Verified',
    icon: Mail,
    className: 'bg-[#EBE8E2] text-[#1E2630] border-[#D5D0C6]',
  },
  integration: {
    label: 'Software Synced',
    icon: Link2,
    className: 'bg-[#EBE8E2] text-[#B89E6B] border-[#D5D0C6]',
  },
  professional: {
    label: 'Professionally Verified',
    icon: ShieldCheck,
    className: 'bg-[#E4E0D8] text-[#0E1217] border-[#D5A77B]',
  },
  contract_sync: {
    label: 'Synced with Contract Easily',
    icon: Link2,
    className: 'bg-[#EBE8E2] text-[#B89E6B] border-[#D5D0C6]',
  },
};

interface VerifiedBadgeProps {
  variant: VerifiedBadgeVariant;
  label?: string;
  className?: string;
}

export function VerifiedBadge({ variant, label, className = '' }: VerifiedBadgeProps) {
  const config = VARIANT_CONFIG[variant];
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-semibold tracking-wide ${config.className} ${className}`}
    >
      <Icon className="w-3 h-3 shrink-0" strokeWidth={2.25} />
      <span>{label || config.label}</span>
    </span>
  );
}
