import type { ProcessProfileSummary } from '../../../types/complianceTriggers';
import { VerificationBadge } from '../../dashboard/VerificationBadge';

const STEPS: Array<{ key: keyof ProcessProfileSummary; label: string }> = [
  { key: 'filingMode', label: 'Filing mode' },
  { key: 'physicalSubmission', label: 'Physical submission' },
  { key: 'applicantVisit', label: 'Applicant visit' },
  { key: 'inspection', label: 'Inspection' },
  { key: 'testingOrNotarisation', label: 'Testing / notarisation' },
];

export function ProcessStepsPanel({ process }: { process: ProcessProfileSummary | null | undefined }) {
  if (!process) {
    return <p className="text-xs text-admin-muted">No process profile recorded.</p>;
  }

  return (
    <div className="space-y-3">
      <div className="grid gap-2 sm:grid-cols-2">
        {STEPS.map(({ key, label }) => {
          const value = String(process[key] ?? 'unverified');
          const isMode = key === 'filingMode';
          return (
            <div
              key={key}
              className="flex items-center justify-between gap-2 rounded-lg border border-admin-border bg-admin-bg/40 px-2.5 py-2"
            >
              <span className="text-xs text-admin-muted">{label}</span>
              {isMode ? (
                <span className="font-mono text-[11px] font-semibold text-admin-text">
                  {value.replace(/_/g, ' ')}
                </span>
              ) : (
                <VerificationBadge status={value} kind="physical" />
              )}
            </div>
          );
        })}
      </div>
      {process.applicationUrl && (
        <a
          href={process.applicationUrl}
          target="_blank"
          rel="noreferrer"
          className="block break-all text-xs underline underline-offset-2 text-admin-text"
        >
          {process.applicationUrl}
          {process.urlRole ? ` (${process.urlRole})` : ''}
        </a>
      )}
      {process.processNotes && (
        <p className="text-xs leading-relaxed text-admin-muted">{process.processNotes}</p>
      )}
    </div>
  );
}
