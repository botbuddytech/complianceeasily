import { Home, TrendingUp, AlertTriangle, CalendarClock } from 'lucide-react';
import { PageHeader } from '../../../components/dashboard/PageHeader';
import {
  getMyPropertyAssets,
  getMyStockHoldings,
  getMyInvestmentCompliances,
  getMyClients,
} from '../../../lib/professionalSession';
import { formatInr } from '../../../data/dashboard/investments';

export function ProfessionalInvestmentsOverviewPage() {
  const properties = getMyPropertyAssets();
  const holdings = getMyStockHoldings();
  const compliances = getMyInvestmentCompliances();
  const clients = getMyClients();

  const totalPropertyValue = properties.reduce((sum, p) => sum + p.currentValueInr, 0);
  const totalPortfolioValue = holdings.reduce(
    (sum, h) => sum + h.quantity * h.currentPriceInr,
    0,
  );
  const upcoming = compliances.filter((c) => c.status === 'upcoming').length;
  const overdue = compliances.filter((c) =>
    ['overdue', 'action_required'].includes(c.status),
  ).length;

  const cards = [
    {
      label: 'Property value',
      value: formatInr(totalPropertyValue),
      sub: `${properties.length} assets · ${clients.length} clients`,
      icon: Home,
    },
    {
      label: 'Stock portfolio',
      value: formatInr(totalPortfolioValue),
      sub: `${holdings.length} holdings`,
      icon: TrendingUp,
    },
    {
      label: 'Upcoming',
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
        variant="admin"
        title="Client Investments"
        description="Read-only view of personal property and stock investments for clients assigned to you."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <article
              key={card.label}
              className="rounded-2xl border border-admin-border bg-admin-surface p-5"
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-admin-muted">
                  {card.label}
                </span>
                <Icon className="h-4 w-4 text-admin-accent" />
              </div>
              <div className="font-display text-2xl font-semibold text-admin-text">{card.value}</div>
              <p className="mt-1 font-mono text-xs text-admin-muted">{card.sub}</p>
            </article>
          );
        })}
      </div>
    </div>
  );
}
