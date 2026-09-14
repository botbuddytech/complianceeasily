import { IndianRupee, CheckCircle2, TrendingUp } from 'lucide-react';
import { PageHeader } from '../../components/dashboard/PageHeader';
import { StatCard, StatGrid } from '../../components/dashboard/StatCard';
import { StatusBadge } from '../../components/dashboard/StatusBadge';
import { DataTable, type Column } from '../../components/dashboard/DataTable';
import { getMyFilings } from '../../lib/professionalSession';
import type { Filing } from '../../types/dashboard';

/** Illustrative demo fee schedule — not a real payout engine. */
const CATEGORY_FEE_INR: Record<string, number> = {
  GST: 499,
  'Income Tax': 999,
  MCA: 1499,
  Labour: 799,
  Licences: 1499,
  Audit: 7499,
  Accounting: 1499,
};

function feeFor(f: Filing): number {
  return CATEGORY_FEE_INR[f.category] ?? 999;
}

interface EarningRow extends Filing {
  feeInr: number;
}

export function ProfessionalEarningsPage() {
  const all = getMyFilings();
  const completed = all.filter((f) => f.status === 'filed' || f.status === 'compliant');
  const rows: EarningRow[] = completed.map((f) => ({ ...f, feeInr: feeFor(f) }));
  const total = rows.reduce((s, r) => s + r.feeInr, 0);
  const avg = rows.length ? Math.round(total / rows.length) : 0;

  const columns: Column<EarningRow>[] = [
    {
      key: 'filing',
      header: 'Filing',
      render: (f) => (
        <div>
          <div className="font-semibold text-admin-text">{f.name}</div>
          <div className="font-mono text-[11px] text-admin-muted">
            {f.entityName} · {f.periodLabel}
          </div>
        </div>
      ),
    },
    {
      key: 'category',
      header: 'Category',
      render: (f) => <span className="font-mono text-xs">{f.category}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      render: (f) => <StatusBadge status={f.status} />,
    },
    {
      key: 'fee',
      header: 'Illustrative fee',
      render: (f) => (
        <span className="font-mono text-sm font-semibold">
          ₹{f.feeInr.toLocaleString('en-IN')}
        </span>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        variant="admin"
        title="Earnings"
        description="Illustrative network certification fees for completed filings assigned to you."
      />

      <StatGrid>
        <StatCard
          tone="admin"
          label="Earnings this month"
          value={`₹${total.toLocaleString('en-IN')}`}
          hint="Demo figures only"
          icon={IndianRupee}
        />
        <StatCard
          tone="admin"
          label="Completed filings"
          value={rows.length}
          icon={CheckCircle2}
        />
        <StatCard
          tone="admin"
          label="Avg fee / filing"
          value={`₹${avg.toLocaleString('en-IN')}`}
          icon={TrendingUp}
        />
        <StatCard
          tone="admin"
          label="Open queue"
          value={all.length - rows.length}
          hint="Not yet filed / compliant"
        />
      </StatGrid>

      <div className="mt-6">
        <DataTable variant="admin" columns={columns} rows={rows} rowKey={(r) => r.id} />
      </div>

      <p className="mt-4 text-[11px] leading-relaxed text-admin-muted">
        Illustrative demo figures based on catalogue starting professional fees. Not a real
        payout, invoice, or tax statement. Actual network compensation will follow separate
        commercial agreements.
      </p>
    </div>
  );
}
