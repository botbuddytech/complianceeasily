import type { BooksVariant, ReturnPreviewDoc } from '../../types/books';

interface ReturnPreviewSheetProps {
  doc?: ReturnPreviewDoc;
  variant?: BooksVariant;
  className?: string;
  emptyMessage?: string;
}

export function ReturnPreviewSheet({
  doc,
  variant = 'client',
  className = '',
  emptyMessage = 'Select a return to preview.',
}: ReturnPreviewSheetProps) {
  const isAdmin = variant === 'admin';
  const border = isAdmin ? 'border-admin-border' : 'border-[#0E1217]';
  const ink = isAdmin ? 'text-admin-text' : 'text-[#0E1217]';
  const muted = isAdmin ? 'text-admin-muted' : 'text-[#5C6570]';
  const paper = isAdmin ? 'bg-admin-surface' : 'bg-white';
  const headBg = isAdmin ? 'bg-admin-bg' : 'bg-[#F4F2EE]';

  if (!doc) {
    return (
      <div
        className={`rounded-sm border-2 border-dashed px-4 py-10 text-center text-sm ${border} ${paper} ${muted} ${className}`}
      >
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className={`overflow-hidden rounded-sm border-2 ${border} ${paper} ${className}`}>
      <div className={`border-b ${border} px-4 py-4 text-center sm:px-6`}>
        <div className={`font-display text-base font-bold uppercase tracking-wide ${ink} sm:text-lg`}>
          {doc.formTitle}
        </div>
        {doc.formSubtitle && (
          <div className={`mt-1 font-mono text-[11px] uppercase tracking-wider ${muted}`}>
            {doc.formSubtitle}
          </div>
        )}
        <div className={`mt-3 grid gap-1 text-left sm:grid-cols-2`}>
          {doc.headerLines.map((h) => (
            <div key={`${h.label}-${h.value}`} className="flex gap-2 text-xs">
              <span className={`shrink-0 font-mono font-bold uppercase tracking-wider ${muted}`}>
                {h.label}:
              </span>
              <span className={`font-semibold ${ink}`}>{h.value}</span>
            </div>
          ))}
        </div>
      </div>

      {doc.sections.map((section) => (
        <div key={section.id}>
          <div className={`border-b ${border} px-4 py-2 ${headBg}`}>
            <div className={`font-mono text-[11px] font-bold uppercase tracking-wider ${muted}`}>
              {section.title}
            </div>
          </div>
          <table className="w-full border-collapse text-sm">
            <tbody>
              {section.rows.map((row) => {
                const isTotal = row.emphasis === 'total';
                return (
                  <tr
                    key={row.id}
                    className={`border-b ${border} last:border-0 ${isTotal ? headBg : ''}`}
                  >
                    <td
                      className={`w-[65%] border-r ${border} px-4 py-2 ${
                        isTotal ? `font-semibold ${ink}` : muted
                      }`}
                    >
                      {row.label}
                    </td>
                    <td
                      className={`w-[35%] px-4 py-2 text-right font-mono text-xs tabular-nums ${
                        isTotal ? `font-bold ${ink}` : `font-semibold ${ink}`
                      }`}
                    >
                      {row.value}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ))}

      {doc.footerNote && (
        <div className={`border-t ${border} px-4 py-2 font-mono text-[10px] ${muted}`}>
          {doc.footerNote}
        </div>
      )}
    </div>
  );
}
