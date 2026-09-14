import type { BooksVariant, ComputationDoc, ComputationRow } from '../../types/books';

interface ComputationSheetProps {
  doc: ComputationDoc;
  variant?: BooksVariant;
  className?: string;
}

function Row({
  row,
  border,
  ink,
  muted,
  headBg,
  isAdmin,
}: {
  row: ComputationRow;
  border: string;
  ink: string;
  muted: string;
  headBg: string;
  isAdmin: boolean;
}) {
  if (row.kind === 'spacer') {
    return (
      <tr>
        <td colSpan={3} className="h-3" />
      </tr>
    );
  }

  if (row.kind === 'section') {
    return (
      <tr className={headBg}>
        <td
          colSpan={3}
          className={`border-y ${border} px-3 py-2 font-mono text-[11px] font-bold uppercase tracking-wider ${muted}`}
        >
          {row.label}
        </td>
      </tr>
    );
  }

  const strong = row.kind === 'subtotal' || row.kind === 'total';
  const totalRow = row.kind === 'total';
  const rowBg = totalRow
    ? isAdmin
      ? 'bg-admin-text text-white'
      : 'bg-[#0E1217] text-white'
    : strong
      ? headBg
      : '';

  return (
    <tr className={rowBg}>
      <td
        className={`border-r ${border} px-3 py-1.5 ${
          totalRow ? 'font-semibold text-white' : strong ? `font-semibold ${ink}` : muted
        }`}
      >
        {row.label}
      </td>
      <td
        className={`border-r ${border} px-3 py-1.5 text-right font-mono text-xs tabular-nums ${
          totalRow ? 'font-bold text-white' : strong ? `font-bold ${ink}` : `font-semibold ${ink}`
        }`}
      >
        {row.workingAmount ?? ''}
      </td>
      <td
        className={`px-3 py-1.5 text-right font-mono text-xs tabular-nums ${
          totalRow ? 'font-bold text-white' : strong ? `font-bold ${ink}` : `font-semibold ${ink}`
        }`}
      >
        {row.finalAmount ?? ''}
      </td>
    </tr>
  );
}

export function ComputationSheet({ doc, variant = 'client', className = '' }: ComputationSheetProps) {
  const isAdmin = variant === 'admin';
  const border = isAdmin ? 'border-admin-border' : 'border-[#0E1217]';
  const ink = isAdmin ? 'text-admin-text' : 'text-[#0E1217]';
  const muted = isAdmin ? 'text-admin-muted' : 'text-[#5C6570]';
  const paper = isAdmin ? 'bg-admin-surface' : 'bg-white';
  const headBg = isAdmin ? 'bg-admin-bg' : 'bg-[#F4F2EE]';

  return (
    <div className={`overflow-hidden rounded-sm border-2 ${border} ${paper} ${className}`}>
      <div className={`border-b ${border} px-4 py-4 text-center sm:px-6`}>
        <div className={`font-display text-base font-bold tracking-wide ${ink} sm:text-lg`}>
          {doc.assesseeName}
        </div>
        {doc.address && <div className={`mt-1 text-xs ${muted}`}>{doc.address}</div>}
        <div className={`mt-3 flex flex-wrap items-center justify-center gap-x-6 gap-y-1 font-mono text-[11px] ${muted}`}>
          {doc.pan && <span>PAN: {doc.pan}</span>}
          {doc.dob && <span>D.O.B: {doc.dob}</span>}
          <span>F.Y. : {doc.fy}</span>
          <span>A.Y. : {doc.ay}</span>
        </div>
      </div>

      <div className={`border-b ${border} px-4 py-2 text-center ${headBg}`}>
        <div className={`font-display text-sm font-bold uppercase tracking-wide ${ink}`}>
          Computation of Total Income
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] border-collapse text-sm">
          <thead>
            <tr className={`border-b ${border} ${headBg}`}>
              <th
                className={`w-[55%] border-r ${border} px-3 py-2 text-left font-mono text-[10px] font-bold uppercase tracking-wider ${muted}`}
              >
                Particulars
              </th>
              <th
                className={`w-[22.5%] border-r ${border} px-3 py-2 text-right font-mono text-[10px] font-bold uppercase tracking-wider ${muted}`}
              >
                Amount (Rs.)
              </th>
              <th
                className={`w-[22.5%] px-3 py-2 text-right font-mono text-[10px] font-bold uppercase tracking-wider ${muted}`}
              >
                Amount (Rs.)
              </th>
            </tr>
          </thead>
          <tbody>
            {doc.incomeRows.map((row) => (
              <Row
                key={row.id}
                row={row}
                border={border}
                ink={ink}
                muted={muted}
                headBg={headBg}
                isAdmin={isAdmin}
              />
            ))}
          </tbody>
        </table>
      </div>

      <div className={`border-y ${border} px-4 py-2 text-center ${headBg}`}>
        <div className={`font-display text-sm font-bold uppercase tracking-wide ${ink}`}>
          Computation of Tax on Total Income
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] border-collapse text-sm">
          <thead>
            <tr className={`border-b ${border} ${headBg}`}>
              <th
                className={`w-[55%] border-r ${border} px-3 py-2 text-left font-mono text-[10px] font-bold uppercase tracking-wider ${muted}`}
              >
                Particulars
              </th>
              <th
                className={`w-[22.5%] border-r ${border} px-3 py-2 text-right font-mono text-[10px] font-bold uppercase tracking-wider ${muted}`}
              >
                Amount (Rs.)
              </th>
              <th
                className={`w-[22.5%] px-3 py-2 text-right font-mono text-[10px] font-bold uppercase tracking-wider ${muted}`}
              >
                Amount (Rs.)
              </th>
            </tr>
          </thead>
          <tbody>
            {doc.taxRows.map((row) => (
              <Row
                key={row.id}
                row={row}
                border={border}
                ink={ink}
                muted={muted}
                headBg={headBg}
                isAdmin={isAdmin}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
