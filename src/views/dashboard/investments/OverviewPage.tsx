import { Home, TrendingUp, AlertTriangle, CalendarClock } from 'lucide-react';
import { PageHeader } from '../../../components/dashboard/PageHeader';
import {
  getClientPropertyAssets,
  getClientStockHoldings,
  getClientInvestmentCompliances,
  formatInr,
} from '../../../data/dashboard/investments';

export function InvestmentsOverviewPage() {
  const properties = getClientPropertyAssets();
  const holdings = getClientStockHoldings();
  const compliances = getClientInvestmentCompliances();

  const totalPropertyValue = properties.reduce((sum, p) => sum + p.currentValueInr, 0);
  const totalPortfolioValue = holdings.reduce(
    (sum, h) => sum + h.quantity * h.currentPriceInr,
    0,
  );
  const totalInvested = holdings.reduce((sum, h) => sum + h.quantity * h.avgBuyPriceInr, 0);
  const unrealizedPnl = totalPortfolioValue - totalInvested;
  const upcoming = compliances.filter((c) => c.status === 'upcoming').length;
  const overdue = compliances.filter((c) =>
    ['overdue', 'action_required'].includes(c.status),
  ).length;

  const cards = [
    {
      label: 'Property value',
      value: formatInr(totalPropertyValue),
      sub: `${properties.length} assets`,
      icon: Home,
    },
    {
      label: 'Stock portfolio',
      value: formatInr(totalPortfolioValue),
      sub: `P&L ${unrealizedPnl >= 0 ? '+' : ''}${formatInr(unrealizedPnl)}`,
      icon: TrendingUp,
    },
    {
      label: 'Upcoming compliances',
      value: String(upcoming),
      sub: 'Next 90 days',
      icon: CalendarClock,
    },
    {
      label: 'Needs attention',
      value: String(overdue),
      sub: 'Overdue / action required',
      icon: AlertTriangle,
    },
  ];

  return (
    <div>
      <PageHeader
        title="Investments Overview"
        description="Personal property and stock-market investments, documents, and compliances."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <article
              key={card.label}
              className="rounded-2xl border border-[#D5D0C6] bg-white p-5 shadow-sm"
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#6B7580]">
                  {card.label}
                </span>
                <Icon className="h-4 w-4 text-[#B89E6B]" />
              </div>
              <div className="font-display text-2xl font-semibold text-[#0E1217]">{card.value}</div>
              <p className="mt-1 font-mono text-xs text-[#5C6570]">{card.sub}</p>
            </article>
          );
        })}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <section className="rounded-2xl border border-[#D5D0C6] bg-white p-5 shadow-sm">
          <h2 className="mb-3 font-semibold text-[#0E1217]">Property snapshot</h2>
          <ul className="space-y-3">
            {properties.map((p) => (
              <li
                key={p.id}
                className="flex items-start justify-between gap-3 border-b border-[#EBE8E2] pb-3 last:border-0 last:pb-0"
              >
                <div className="min-w-0">
                  <div className="truncate font-medium text-[#0E1217]">{p.name}</div>
                  <div className="font-mono text-[11px] text-[#6B7580]">
                    {p.type} · {p.ownershipType} · {p.state}
                  </div>
                </div>
                <div className="shrink-0 font-mono text-sm font-semibold text-[#0E1217]">
                  {formatInr(p.currentValueInr)}
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border border-[#D5D0C6] bg-white p-5 shadow-sm">
          <h2 className="mb-3 font-semibold text-[#0E1217]">Top holdings</h2>
          <ul className="space-y-3">
            {holdings.slice(0, 5).map((h) => {
              const value = h.quantity * h.currentPriceInr;
              return (
                <li
                  key={h.id}
                  className="flex items-start justify-between gap-3 border-b border-[#EBE8E2] pb-3 last:border-0 last:pb-0"
                >
                  <div className="min-w-0">
                    <div className="font-medium text-[#0E1217]">{h.symbol}</div>
                    <div className="truncate font-mono text-[11px] text-[#6B7580]">
                      {h.companyName} · {h.quantity} units
                    </div>
                  </div>
                  <div className="shrink-0 font-mono text-sm font-semibold text-[#0E1217]">
                    {formatInr(value)}
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      </div>
    </div>
  );
}
