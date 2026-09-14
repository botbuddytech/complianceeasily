import { Users, Building2, AlertTriangle, IndianRupee } from 'lucide-react';
import { PageHeader } from '../../components/dashboard/PageHeader';
import { StatCard, StatGrid } from '../../components/dashboard/StatCard';
import { LineChartCard } from '../../components/dashboard/charts/LineChartCard';
import { BarChartCard } from '../../components/dashboard/charts/BarChartCard';
import { DonutChartCard } from '../../components/dashboard/charts/DonutChartCard';
import {
  CLIENTS,
  ADMIN_KPI_TREND,
  PLAN_DISTRIBUTION,
  FILINGS_BY_CATEGORY,
} from '../../data/dashboard/clients';
import { FILINGS } from '../../data/dashboard/filings';
import { PROTECTION_CLAIMS } from '../../data/dashboard/protectionClaims';

export function AdminOverviewPage() {
  const activeClients = CLIENTS.filter((c) => c.status === 'active').length;
  const dueThisWeek = CLIENTS.reduce((s, c) => s + c.filingsDueThisWeek, 0);
  const overdue = FILINGS.filter((f) => f.status === 'overdue').length;
  const openClaims = PROTECTION_CLAIMS.filter((c) =>
    ['submitted', 'under_review'].includes(c.status),
  ).length;

  return (
    <div>
      <PageHeader
        variant="admin"
        title="Admin Overview"
        description="Cross-client KPIs, filing workload, and plan mix."
      />

      <StatGrid>
        <StatCard
          label="Active clients"
          value={activeClients}
          icon={Users}
          tone="admin"
          hint={`${CLIENTS.length} total accounts`}
        />
        <StatCard
          label="Filings due this week"
          value={dueThisWeek}
          icon={Building2}
          tone="admin"
        />
        <StatCard label="Overdue filings" value={overdue} icon={AlertTriangle} tone="warning" />
        <StatCard
          label="Open protection claims"
          value={openClaims}
          icon={IndianRupee}
          tone="admin"
        />
      </StatGrid>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <LineChartCard
            variant="admin"
            title="Active entities under management"
            data={ADMIN_KPI_TREND}
          />
        </div>
        <DonutChartCard variant="admin" title="Plan distribution" data={PLAN_DISTRIBUTION} />
      </div>

      <div className="mt-6">
        <BarChartCard
          variant="admin"
          title="Filings queued by category (this month)"
          data={FILINGS_BY_CATEGORY}
        />
      </div>
    </div>
  );
}
