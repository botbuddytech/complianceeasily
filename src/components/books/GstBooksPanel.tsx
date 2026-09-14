import { useEffect, useMemo, useState } from 'react';
import { Receipt } from 'lucide-react';
import { LedgerIndex } from './LedgerIndex';
import { TAccountSheet } from './TAccountSheet';
import { ReturnPreviewSheet } from './ReturnPreviewSheet';
import { StatusBadge } from '../dashboard/StatusBadge';
import { filterGstReturns } from '../../data/dashboard/gstBooks';
import type { BooksVariant, EntityGstBooks } from '../../types/books';

interface GstBooksPanelProps {
  gst: EntityGstBooks;
  periodFrom: string;
  periodTo: string;
  periodLabel: string;
  variant?: BooksVariant;
}

export function GstBooksPanel({
  gst,
  periodFrom,
  periodTo,
  periodLabel,
  variant = 'client',
}: GstBooksPanelProps) {
  const isAdmin = variant === 'admin';
  const [selectedId, setSelectedId] = useState(gst.ledgerIndex[0]?.ledgerId ?? '');
  const [selectedReturnId, setSelectedReturnId] = useState('');

  const returns = useMemo(
    () => filterGstReturns(gst.returns, periodFrom, periodTo),
    [gst.returns, periodFrom, periodTo],
  );
  const firstReturnId = returns[0]?.id ?? '';

  useEffect(() => {
    setSelectedId(gst.ledgerIndex[0]?.ledgerId ?? '');
  }, [gst.entityId]);

  useEffect(() => {
    setSelectedReturnId(firstReturnId);
  }, [gst.entityId, firstReturnId]);

  const selected = useMemo(() => {
    const base = gst.ledgers.find((l) => l.id === selectedId) ?? gst.ledgers[0];
    if (!base) return undefined;
    return { ...base, subtitle: `${base.subtitle ?? 'GST'} · ${periodLabel}` };
  }, [gst.ledgers, selectedId, periodLabel]);

  const selectedReturn = useMemo(
    () => returns.find((r) => r.id === selectedReturnId) ?? returns[0],
    [returns, selectedReturnId],
  );

  const shell = isAdmin
    ? 'border-admin-border bg-admin-surface'
    : 'border-[#D5D0C6] bg-white';
  const muted = isAdmin ? 'text-admin-muted' : 'text-[#6B7580]';
  const ink = isAdmin ? 'text-admin-text' : 'text-[#0E1217]';
  const head = isAdmin ? 'bg-admin-bg' : 'bg-[#EBE8E2]';
  const border = isAdmin ? 'border-admin-border' : 'border-[#D5D0C6]';
  const activeRow = isAdmin ? 'bg-admin-bg' : 'bg-[#EBE8E2]';

  return (
    <div className="space-y-8">
      <div className={`rounded-xl border px-4 py-3 sm:px-5 ${shell}`}>
        <div className={`flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-wider ${muted}`}>
          <Receipt className="h-3.5 w-3.5" />
          GST registration
        </div>
        <div className={`mt-1 font-display text-lg font-semibold ${ink}`}>{gst.legalName}</div>
        <div className={`mt-1 flex flex-wrap gap-x-4 gap-y-1 font-mono text-xs ${muted}`}>
          <span>GSTIN {gst.gstin}</span>
          <span>{gst.state}</span>
          <span>{gst.registrationType}</span>
        </div>
      </div>

      <section className="space-y-4">
        <div>
          <h2 className={`font-display text-lg font-semibold ${ink}`}>GST ledgers</h2>
          <p className={`mt-0.5 text-sm ${muted}`}>
            Output / input tax accounts and GSTN electronic cash &amp; credit ledgers.
          </p>
        </div>
        {gst.ledgerIndex.length === 0 ? (
          <p className={`text-sm ${muted}`}>No GST ledgers for this entity.</p>
        ) : (
          <div className="space-y-6">
            <LedgerIndex
              entries={gst.ledgerIndex}
              selectedId={selected?.id}
              onSelect={setSelectedId}
              variant={variant}
            />
            {selected && <TAccountSheet account={selected} variant={variant} />}
          </div>
        )}
      </section>

      <section className="space-y-4">
        <div>
          <h2 className={`font-display text-lg font-semibold ${ink}`}>GST returns</h2>
          <p className={`mt-0.5 text-sm ${muted}`}>
            Click a row to preview GSTR-1 / 3B / 2B / 9 for {periodLabel}.
          </p>
        </div>
        {returns.length === 0 ? (
          <div className={`rounded-xl border px-4 py-10 text-center text-sm ${shell} ${muted}`}>
            No GST returns in this reporting period. Widen From / To or pick another preset.
          </div>
        ) : (
          <>
            <div className={`overflow-hidden rounded-xl border ${shell}`}>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[720px] border-collapse text-sm">
                  <thead>
                    <tr className={`border-b ${border} ${head}`}>
                      {[
                        'Return',
                        'Tax period',
                        'Due',
                        'Status',
                        'Taxable value',
                        'IGST',
                        'CGST',
                        'SGST',
                        'ITC / Net',
                        'ARN',
                      ].map((h) => (
                        <th
                          key={h}
                          className={`px-3 py-2.5 text-left font-mono text-[10px] font-bold uppercase tracking-wider ${muted} ${
                            h === 'Taxable value' ||
                            h === 'IGST' ||
                            h === 'CGST' ||
                            h === 'SGST' ||
                            h === 'ITC / Net'
                              ? 'text-right'
                              : ''
                          }`}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {returns.map((r) => {
                      const active = r.id === selectedReturn?.id;
                      return (
                        <tr
                          key={r.id}
                          onClick={() => setSelectedReturnId(r.id)}
                          className={`cursor-pointer border-b ${border} last:border-0 ${
                            active
                              ? activeRow
                              : isAdmin
                                ? 'hover:bg-admin-bg/60'
                                : 'hover:bg-[#F4F2EE]'
                          }`}
                        >
                          <td className={`px-3 py-2.5 font-semibold ${ink}`}>{r.returnType}</td>
                          <td className={`px-3 py-2.5 font-mono text-xs ${muted}`}>{r.periodLabel}</td>
                          <td className={`px-3 py-2.5 font-mono text-xs ${muted}`}>{r.dueDate}</td>
                          <td className="px-3 py-2.5">
                            <StatusBadge status={r.status} />
                          </td>
                          <td className={`px-3 py-2.5 text-right font-mono text-xs font-semibold ${ink}`}>
                            {r.taxableValue}
                          </td>
                          <td className={`px-3 py-2.5 text-right font-mono text-xs ${ink}`}>{r.igst}</td>
                          <td className={`px-3 py-2.5 text-right font-mono text-xs ${ink}`}>{r.cgst}</td>
                          <td className={`px-3 py-2.5 text-right font-mono text-xs ${ink}`}>{r.sgst}</td>
                          <td className={`px-3 py-2.5 text-right font-mono text-xs ${muted}`}>
                            {r.netLiability
                              ? `Net ${r.netLiability}`
                              : r.itcAvailable
                                ? `ITC ${r.itcAvailable}`
                                : '—'}
                          </td>
                          <td className={`px-3 py-2.5 font-mono text-[11px] ${muted}`}>
                            {r.arn ?? '—'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
            <div>
              <h3 className={`mb-2 font-mono text-[10px] font-bold uppercase tracking-wider ${muted}`}>
                Return preview
                {selectedReturn ? ` · ${selectedReturn.returnType} · ${selectedReturn.periodLabel}` : ''}
              </h3>
              <ReturnPreviewSheet doc={selectedReturn?.preview} variant={variant} />
            </div>
          </>
        )}
      </section>
    </div>
  );
}
