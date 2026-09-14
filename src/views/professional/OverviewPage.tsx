import { Briefcase, CheckCircle2, Clock, Users } from 'lucide-react';
import { PageHeader } from '../../components/dashboard/PageHeader';
import { StatCard, StatGrid } from '../../components/dashboard/StatCard';
import { StatusBadge } from '../../components/dashboard/StatusBadge';
import { BarChartCard } from '../../components/dashboard/charts/BarChartCard';
import { DonutChartCard } from '../../components/dashboard/charts/DonutChartCard';
import {
  getCurrentProfessional,
  getMyClients,
  getMyFilings,
} from '../../lib/professionalSession';

export function ProfessionalOverviewPage() {
  const pro = getCurrentProfessional();
  const filings = getMyFilings();
  const clients = getMyClients();

  const byStatus = filings.reduce<Record<string, number>>((acc, f) => {
    acc[f.status] = (acc[f.status] ?? 0) + 1;
    return acc;
  }, {});

  const statusChart = Object.entries(byStatus).map(([label, value]) => ({ label, value }));

  const healthBuckets = [
    { name: 'Excellent (90+)', value: 0, color: '#12B76A' },
    { name: 'Good (70–89)', value: 0, color: '#0E9384' },
    { name: 'Needs attention (<70)', value: 0, color: '#F79009' },
  ];
  for (const c of clients) {
    if (c.healthScore >= 90) healthBuckets[0].value += 1;
    else if (c.healthScore >= 70) healthBuckets[1].value += 1;
    else healthBuckets[2].value += 1;
  }

  return (
    <div>
      <PageHeader
        variant="admin"
        title="Professional Overview"
        description={`${pro.name}, ${pro.type}${pro.registrationNo ? ` · ${pro.registrationNo}` : ''} — your assigned filings, clients, and capacity.`}
        actions={<StatusBadge status={pro.status} />}
      />

      <StatGrid>
        <StatCard
          tone="admin"
          label="Active assignments"
          value={pro.activeAssignments}
          hint={`${filings.length} in your queue`}
          icon={Briefcase}
        />
        <StatCard
          tone="admin"
          label="Completed this month"
          value={pro.completedThisMonth}
          icon={CheckCircle2}
        />
        <StatCard
          tone="admin"
          label="Avg turnaround"
          value={`${pro.avgTurnaroundDays}d`}
          hint="Days from assign → file"
          icon={Clock}
        />
        <StatCard
          tone="admin"
          label="My clients"
          value={clients.length}
          hint={pro.specialties.join(' · ')}
          icon={Users}
        />
      </StatGrid>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <BarChartCard
            variant="admin"
            title="My filings by status"
            data={statusChart.length ? statusChart : [{ label: 'None', value: 0 }]}
          />
        </div>
        <DonutChartCard
          variant="admin"
          title="My clients by health"
          data={
            healthBuckets.some((b) => b.value > 0)
              ? healthBuckets.filter((b) => b.value > 0)
              : [{ name: 'No clients', value: 1, color: '#A3A3A3' }]
          }
        />
      </div>
    </div>
  );
}
