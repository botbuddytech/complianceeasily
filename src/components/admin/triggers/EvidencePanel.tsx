import type { EvidenceSummary } from '../../../types/complianceTriggers';

function isGovernment(sourceType?: string) {
  if (!sourceType) return false;
  const t = sourceType.toLowerCase();
  return (
    t.includes('government') ||
    t.includes('statute') ||
    t.includes('notification') ||
    t.includes('portal') ||
    t.includes('judgment') ||
    t.includes('gazette')
  );
}

export function EvidencePanel({ evidence }: { evidence: EvidenceSummary[] | undefined }) {
  if (!evidence?.length) {
    return <p className="text-xs text-admin-muted">No evidence assertions linked.</p>;
  }

  const gov = evidence.filter((e) => isGovernment(e.sourceType));
  const other = evidence.filter((e) => !isGovernment(e.sourceType));

  const Section = ({
    title,
    items,
  }: {
    title: string;
    items: EvidenceSummary[];
  }) =>
    items.length === 0 ? null : (
      <div className="space-y-2">
        <div className="font-mono text-[10px] font-semibold uppercase tracking-wider text-admin-muted">
          {title}
        </div>
        <ul className="space-y-2">
          {items.map((e) => (
            <li
              key={e.assertionId}
              className="rounded-lg border border-admin-border bg-admin-bg/40 px-2.5 py-2 text-xs"
            >
              <div className="font-semibold text-admin-text">
                {e.sourceTitle || e.sourceId || 'Source'}
              </div>
              <div className="mt-0.5 font-mono text-[10px] text-admin-muted">
                {e.sourceType || 'untyped'} · {e.fieldName || 'general'} ·{' '}
                {e.verificationStatus || 'unverified'}
              </div>
              {e.finding && (
                <p className="mt-1 leading-relaxed text-admin-muted">{e.finding}</p>
              )}
              {e.url && (
                <a
                  href={e.url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-1 inline-block break-all underline underline-offset-2"
                >
                  {e.url}
                </a>
              )}
            </li>
          ))}
        </ul>
      </div>
    );

  return (
    <div className="space-y-4">
      <Section title="Government / primary sources" items={gov} />
      <Section title="Secondary / commercial sources" items={other} />
    </div>
  );
}
