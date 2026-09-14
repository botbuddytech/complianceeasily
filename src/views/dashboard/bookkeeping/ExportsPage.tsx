import { useState } from 'react';
import { FileText, FileSpreadsheet, FileCode2, CheckCircle2 } from 'lucide-react';
import { PageHeader } from '../../../components/dashboard/PageHeader';

const outlineBtn =
  'inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[#D5D0C6] bg-white px-4 py-3 text-sm font-semibold text-[#5C6570] hover:border-[#B89E6B] hover:bg-[#EBE8E2] transition-colors';

export function BookkeepingExportsPage() {
  const [exportFlash, setExportFlash] = useState<string | null>(null);

  const flashExport = (label: string) => {
    setExportFlash(label);
    window.setTimeout(() => setExportFlash(null), 1800);
  };

  return (
    <div>
      <PageHeader
        title="Exports"
        description="Generate PDF reports, Tally-compatible XML, or Excel workbooks. UI demo only."
      />

      {exportFlash && (
        <div className="mb-4 flex items-center gap-2 rounded-xl border border-[#D5D0C6] bg-[#EBE8E2] px-4 py-2.5 text-sm text-[#B89E6B]">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          {exportFlash} export queued (UI demo — file generation coming later).
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-[#D5D0C6] bg-white p-5">
          <FileText className="mb-3 h-6 w-6 text-[#B89E6B]" />
          <h3 className="text-sm font-semibold text-[#0E1217]">PDF report</h3>
          <p className="mt-1 text-xs text-[#6B7580]">
            Trial balance, ledger summaries, and period activity as a printable PDF.
          </p>
          <button type="button" className={`${outlineBtn} mt-4`} onClick={() => flashExport('PDF')}>
            Export PDF
          </button>
        </div>

        <div className="rounded-2xl border border-[#D5D0C6] bg-white p-5">
          <FileCode2 className="mb-3 h-6 w-6 text-[#B89E6B]" />
          <h3 className="text-sm font-semibold text-[#0E1217]">Tally (XML)</h3>
          <p className="mt-1 text-xs text-[#6B7580]">
            Tally-compatible XML for masters and vouchers — import into TallyPrime / ERP 9.
          </p>
          <button
            type="button"
            className={`${outlineBtn} mt-4`}
            onClick={() => flashExport('Tally XML')}
          >
            Export Tally XML
          </button>
        </div>

        <div className="rounded-2xl border border-[#D5D0C6] bg-gradient-to-br from-[#EBE8E2] to-white p-5">
          <FileSpreadsheet className="mb-3 h-6 w-6 text-[#B89E6B]" />
          <h3 className="text-sm font-semibold text-[#0E1217]">Excel workbook</h3>
          <p className="mt-1 text-xs text-[#6B7580]">
            Ledgers and vouchers as .xlsx sheets for offline review or CA handoff.
          </p>
          <button
            type="button"
            className="btn-primary mt-4 w-full py-3 text-sm"
            onClick={() => flashExport('Excel')}
          >
            Export Excel
          </button>
        </div>
      </div>
    </div>
  );
}
