'use client';

import type { BusinessProfileFieldDef } from '../../../types/complianceTriggers';

export function MissingFactsPanel({
  missingFacts,
  fieldDefs,
  values,
  onChange,
}: {
  missingFacts: string[];
  fieldDefs: BusinessProfileFieldDef[];
  values?: Record<string, string>;
  onChange?: (fieldId: string, value: string) => void;
}) {
  if (!missingFacts.length) {
    return (
      <p className="text-xs text-admin-muted">No missing facts for the current evaluation.</p>
    );
  }

  const byId = new Map(fieldDefs.map((f) => [f.fieldId, f]));

  return (
    <div className="space-y-2">
      <p className="text-xs text-admin-muted">
        Missing facts evaluate to <span className="font-semibold">unknown</span>, never
        not-applicable. Capture them to resolve the match.
      </p>
      <ul className="space-y-2">
        {missingFacts.map((fieldId) => {
          const def = byId.get(fieldId);
          const isAsset = fieldId.startsWith('asset:');
          return (
            <li
              key={fieldId}
              className="rounded-xl border border-amber-200 bg-amber-50/60 px-3 py-2.5"
            >
              <div className="font-mono text-[11px] font-semibold text-amber-900">{fieldId}</div>
              {def && (
                <>
                  <p className="mt-1 text-xs text-amber-900/80">{def.description}</p>
                  <p className="mt-0.5 font-mono text-[10px] text-amber-800/70">
                    {def.dataType} · {def.scope}
                    {def.requiredFor ? ` · for ${def.requiredFor}` : ''}
                  </p>
                </>
              )}
              {isAsset && (
                <p className="mt-1 text-xs text-amber-900/80">
                  Asset holding required (class + actor role). Record under investments / assets.
                </p>
              )}
              {onChange && !isAsset && (
                <input
                  value={values?.[fieldId] ?? ''}
                  onChange={(e) => onChange(fieldId, e.target.value)}
                  placeholder="Enter value…"
                  className="mt-2 w-full rounded-lg border border-amber-200 bg-white px-2.5 py-1.5 text-sm outline-none"
                />
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
