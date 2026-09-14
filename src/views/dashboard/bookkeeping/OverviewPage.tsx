import { Link } from '@/components/nav/NextNav';
import { ArrowRight, Link2, BookOpen, ArrowLeftRight } from 'lucide-react';
import { PageHeader } from '../../../components/dashboard/PageHeader';
import { StatCard, StatGrid } from '../../../components/dashboard/StatCard';
import { StatusBadge } from '../../../components/dashboard/StatusBadge';
import {
  BANK_CONNECTIONS,
  LEDGER_ENTRIES,
  BOOKKEEPING_STATS,
} from '../../../data/dashboard/bookkeeping';
import { useBooksPeriod } from '../../../context/BooksPeriodContext';

export function BookkeepingOverviewPage() {
  const { periodLabel } = useBooksPeriod();
  const connectedBanks = BANK_CONNECTIONS.filter((b) => b.status === 'connected').length;
  const recent = LEDGER_ENTRIES.slice(0, 5);

  return (
    <div>
      <PageHeader
        title="Bookkeeping overview"
        description={`Balances, connections, and recent activity · reporting period ${periodLabel}.`}
      />

      <StatGrid>
        <StatCard label="Total ledgers" value={BOOKKEEPING_STATS.totalLedgers} />
        <StatCard label="Bank balance" value={BOOKKEEPING_STATS.bankBalance} />
        <StatCard label="Cash balance" value={BOOKKEEPING_STATS.cashBalance} />
        <StatCard
          label="Unreconciled"
          value={BOOKKEEPING_STATS.unreconciled}
          tone="warning"
          hint="Need review"
        />
      </StatGrid>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <Link
          to="/dashboard/bookkeeping/connections"
          className="rounded-2xl border border-[#D5D0C6] bg-white p-4 hover:border-[#B89E6B] hover:bg-[#EBE8E2] transition-colors"
        >
          <Link2 className="mb-2 h-4 w-4 text-[#B89E6B]" />
          <div className="text-sm font-semibold text-[#0E1217]">Connections</div>
          <p className="mt-0.5 font-mono text-[11px] text-[#6B7580]">
            {connectedBanks} banks linked · manage feeds
          </p>
        </Link>
        <Link
          to="/dashboard/bookkeeping/ledgers"
          className="rounded-2xl border border-[#D5D0C6] bg-white p-4 hover:border-[#B89E6B] hover:bg-[#EBE8E2] transition-colors"
        >
          <BookOpen className="mb-2 h-4 w-4 text-[#B89E6B]" />
          <div className="text-sm font-semibold text-[#0E1217]">Ledgers</div>
          <p className="mt-0.5 font-mono text-[11px] text-[#6B7580]">
            {BOOKKEEPING_STATS.totalLedgers} accounts · Tally-style
          </p>
        </Link>
        <Link
          to="/dashboard/bookkeeping/transactions"
          className="rounded-2xl border border-[#D5D0C6] bg-white p-4 hover:border-[#B89E6B] hover:bg-[#EBE8E2] transition-colors"
        >
          <ArrowLeftRight className="mb-2 h-4 w-4 text-[#B89E6B]" />
          <div className="text-sm font-semibold text-[#0E1217]">Transactions</div>
          <p className="mt-0.5 font-mono text-[11px] text-[#6B7580]">
            {LEDGER_ENTRIES.length} recent vouchers
          </p>
        </Link>
      </div>

      <div className="mt-6 rounded-2xl border border-[#D5D0C6] bg-white p-5">
        <div className="mb-4 flex items-center justify-between gap-2">
          <h3 className="text-sm font-semibold text-[#0E1217]">Recent activity</h3>
          <Link
            to="/dashboard/bookkeeping/transactions"
            className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-[#B89E6B] hover:underline"
          >
            View all <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <ul className="space-y-3">
          {recent.map((t) => (
            <li
              key={t.id}
              className="flex items-start justify-between gap-3 border-b border-[#EBE8E2] pb-3 last:border-0 last:pb-0"
            >
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold text-[#0E1217]">{t.particulars}</div>
                <div className="font-mono text-[11px] text-[#6B7580]">
                  {t.date} · {t.ledgerName}
                </div>
              </div>
              <StatusBadge status={t.voucherType} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
