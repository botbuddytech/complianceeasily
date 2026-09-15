export function RuleVersionTimeline({
  ruleId,
  effectiveFrom,
  effectiveTo,
  taxPeriod,
  verificationStatus,
}: {
  ruleId?: string | null;
  effectiveFrom?: string | null;
  effectiveTo?: string | null;
  taxPeriod?: string | null;
  verificationStatus?: string;
}) {
  if (!ruleId) {
    return (
      <p className="text-xs text-admin-muted">
        App-only trigger — not yet linked to a catalogue rule version.
      </p>
    );
  }

  const base = ruleId.replace(/-V\d+$/i, '');
  const versionMatch = ruleId.match(/-V(\d+)$/i);
  const version = versionMatch ? Number(versionMatch[1]) : 1;

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <span className="rounded-full border border-admin-border bg-admin-bg px-2.5 py-1 font-mono text-[11px] font-semibold text-admin-text">
          {ruleId}
        </span>
        <span className="text-xs text-admin-muted">family {base}</span>
      </div>
      <ol className="relative ml-2 border-l border-admin-border pl-4">
        {Array.from({ length: version }, (_, i) => {
          const v = i + 1;
          const current = v === version;
          return (
            <li key={v} className="mb-3 last:mb-0">
              <span
                className={`absolute -left-1.5 mt-1 h-3 w-3 rounded-full border ${
                  current
                    ? 'border-admin-ink bg-admin-ink'
                    : 'border-admin-border bg-admin-surface'
                }`}
              />
              <div className="text-xs font-semibold text-admin-text">
                {base}-V{v}
                {current ? ' (current)' : ''}
              </div>
              {current && (
                <ul className="mt-1 space-y-0.5 font-mono text-[10px] text-admin-muted">
                  <li>effective from: {effectiveFrom || '—'}</li>
                  <li>effective to: {effectiveTo || 'open'}</li>
                  <li>tax period: {taxPeriod || '—'}</li>
                  <li>status: {verificationStatus || '—'}</li>
                </ul>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
