import { StatusBadge } from './StatusBadge';

const VERIFICATION_LABELS: Record<string, string> = {
  researched_partial: 'Partial research',
  imported_unverified: 'Imported unverified',
  discovery_only: 'Discovery only',
  authority_directory_confirmed: 'Directory confirmed',
  conflict_flagged: 'Conflict flagged',
  levy_or_service_evidenced: 'Service evidenced',
  directory_routing_only: 'Directory routing',
  research_required: 'Research required',
  secondary_discovery_only: 'Secondary discovery',
  partial_rule_research: 'Partial rule research',
  unverified: 'Not verified',
};

const PHYSICAL_LABELS: Record<string, string> = {
  required: 'Required',
  conditional: 'Conditional',
  not_required: 'Not required',
  not_applicable: 'N/A',
  unverified: 'Not verified',
};

/**
 * Verification / physical-step badge.
 * `unverified` is always a neutral "not verified" — never a red "no".
 */
export function VerificationBadge({
  status,
  kind = 'verification',
  className = '',
}: {
  status: string;
  kind?: 'verification' | 'physical';
  className?: string;
}) {
  const key = status || 'unverified';
  const label =
    kind === 'physical'
      ? PHYSICAL_LABELS[key] || key.replace(/_/g, ' ')
      : VERIFICATION_LABELS[key] || key.replace(/_/g, ' ');

  let style =
    'bg-slate-100 text-slate-700 border-slate-200';
  if (key === 'researched_partial' || key === 'partial_rule_research') {
    style = 'bg-amber-50 text-amber-800 border-amber-200';
  } else if (key === 'authority_directory_confirmed' || key === 'levy_or_service_evidenced') {
    style = 'bg-emerald-50 text-emerald-800 border-emerald-200';
  } else if (key === 'conflict_flagged') {
    style = 'bg-orange-50 text-orange-800 border-orange-200';
  } else if (key === 'required') {
    style = 'bg-sky-50 text-sky-800 border-sky-200';
  } else if (key === 'conditional') {
    style = 'bg-amber-50 text-amber-800 border-amber-200';
  } else if (key === 'not_required' || key === 'not_applicable') {
    style = 'bg-emerald-50 text-emerald-800 border-emerald-200';
  } else if (key === 'unverified' || key === 'imported_unverified' || key === 'discovery_only') {
    style = 'bg-slate-100 text-slate-600 border-slate-200';
  }

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-mono font-semibold whitespace-nowrap ${style} ${className}`}
      title={key}
    >
      {label}
    </span>
  );
}

export function AutomationBadge({ enabled }: { enabled: boolean }) {
  return (
    <StatusBadge status={enabled ? 'active' : 'draft'} className={!enabled ? 'opacity-80' : ''} />
  );
}

export function ResultBadge({ result }: { result: string }) {
  const map: Record<string, string> = {
    applicable: 'active',
    not_applicable: 'disabled',
    unknown: 'pending',
    needs_review: 'need_info',
  };
  return <StatusBadge status={map[result] || result} />;
}
