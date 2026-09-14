import { Link } from '@/components/nav/NextNav';
import { ArrowRight, BookOpen, ArrowLeftRight, Landmark } from 'lucide-react';
import { PageHeader } from '../../../components/dashboard/PageHeader';
import { StatCard, StatGrid } from '../../../components/dashboard/StatCard';
import { StatusBadge } from '../../../components/dashboard/StatusBadge';
import { useProfessionalBooks } from '../../../context/ProfessionalBooksContext';
import { useBooksPeriod } from '../../../context/BooksPeriodContext';

export function ProfessionalBooksOverviewPage() {
  const { entity, ledgers, entries, banks, stats, hasBooks } = useProfessionalBooks();
  const { periodLabel } = useBooksPeriod();
  const recent = entries.slice(0, 5);

  return (
    <div>
      <PageHeader
        variant="admin"
        title="Books overview"
        description={
          entity
            ? `Read-only books for ${entity.name} — ledgers, vouchers, and balances · ${periodLabel}.`
            : 'Select a client entity to view books.'
        }
      />

      {!hasBooks ? (
        <div className="rounded-2xl border border-admin-border bg-admin-surface px-4 py-10 text-center text-sm text-admin-muted">
          No books of accounts uploaded for this entity yet.
        </div>
      ) : (
        <>
          <StatGrid>
            <StatCard tone="admin" label="Total ledgers" value={stats.totalLedgers} />
            <StatCard tone="admin" label="Bank balance" value={stats.bankBalance} />
            <StatCard tone="admin" label="Cash balance" value={stats.cashBalance} />
            <StatCard
              tone="warning"
              label="Unreconciled"
              value={stats.unreconciled}
              hint="Need review"
            />
          </StatGrid>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <Link
              to="/professional/books/ledgers"
              className="rounded-2xl border border-admin-border bg-admin-surface p-4 transition-colors hover:bg-admin-bg"
            >
              <BookOpen className="mb-2 h-4 w-4 text-admin-muted" />
              <div className="text-sm font-semibold text-admin-text">Ledgers</div>
              <p className="mt-0.5 font-mono text-[11px] text-admin-muted">
                {ledgers.length} accounts
              </p>
            </Link>
            <Link
              to="/professional/books/transactions"
              className="rounded-2xl border border-admin-border bg-admin-surface p-4 transition-colors hover:bg-admin-bg"
            >
              <ArrowLeftRight className="mb-2 h-4 w-4 text-admin-muted" />
              <div className="text-sm font-semibold text-admin-text">Transactions</div>
              <p className="mt-0.5 font-mono text-[11px] text-admin-muted">
                {entries.length} vouchers
              </p>
            </Link>
            <div className="rounded-2xl border border-admin-border bg-admin-surface p-4">
              <Landmark className="mb-2 h-4 w-4 text-admin-muted" />
              <div className="text-sm font-semibold text-admin-text">Bank feeds</div>
              <p className="mt-0.5 font-mono text-[11px] text-admin-muted">
                {banks.filter((b) => b.status === 'connected').length} connected
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-admin-border bg-admin-surface p-5">
            <div className="mb-4 flex items-center justify-between gap-2">
              <h3 className="text-sm font-semibold text-admin-text">Recent activity</h3>
              <Link
                to="/professional/books/transactions"
                className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-admin-muted hover:underline"
              >
                View all <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            {recent.length === 0 ? (
              <p className="text-sm text-admin-muted">No recent vouchers.</p>
            ) : (
              <ul className="space-y-3">
                {recent.map((t) => (
                  <li
                    key={t.id}
                    className="flex items-start justify-between gap-3 border-b border-admin-border pb-3 last:border-0 last:pb-0"
                  >
                    <div className="min-w-0">
                      <div className="truncate text-sm font-semibold text-admin-text">
                        {t.particulars}
                      </div>
                      <div className="font-mono text-[11px] text-admin-muted">
                        {t.date} · {t.ledgerName}
                      </div>
                    </div>
                    <StatusBadge status={t.voucherType} />
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  );
}
