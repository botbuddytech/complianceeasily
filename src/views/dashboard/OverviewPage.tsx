import { Link } from '@/components/nav/NextNav';
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileText,
  Shield,
  Calendar,
  ArrowRight,
} from 'lucide-react';
import { PageHeader } from '../../components/dashboard/PageHeader';
import { StatCard, StatGrid } from '../../components/dashboard/StatCard';
import { HealthScoreRing } from '../../components/dashboard/HealthScoreRing';
import { StatusBadge } from '../../components/dashboard/StatusBadge';
import { LineChartCard } from '../../components/dashboard/charts/LineChartCard';
import { PRIMARY_ENTITY } from '../../data/dashboard/entities';
import { FILINGS, HEALTH_TREND } from '../../data/dashboard/filings';

export function UserOverviewPage() {
  const entity = PRIMARY_ENTITY;
  const myFilings = FILINGS.filter((f) => f.entityId === entity.id);
  const compliant = myFilings.filter((f) => f.status === 'compliant' || f.status === 'filed').length;
  const upcoming = myFilings.filter((f) => f.status === 'upcoming').length;
  const action = myFilings.filter(
    (f) => f.status === 'action_required' || f.status === 'overdue',
  ).length;
  const needInfo = myFilings.filter((f) => f.status === 'need_info').length;
  const priority = myFilings.find((f) => f.status === 'action_required') ?? myFilings[0];

  return (
    <div>
      <PageHeader
        title="Compliance Overview"
        description="Your Business Compliance Passport — health, priorities, and upcoming filings."
        actions={
          <Link to="/dashboard/filings" className="btn-primary text-sm py-2 px-4">
            View all filings
            <ArrowRight className="h-4 w-4" />
          </Link>
        }
      />

      {/* Entity + score */}
      <div className="mb-6 rounded-2xl border border-[#D5D0C6] bg-white p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="font-mono text-sm font-bold uppercase tracking-tight text-[#0E1217] sm:text-base">
                {entity.name}
              </h2>
              <span className="rounded border border-[#D5D0C6] bg-[#EBE8E2] px-2 py-0.5 font-mono text-[10px] font-semibold text-[#B89E6B]">
                {entity.entityType}
              </span>
              {entity.protectionActive && (
                <span className="inline-flex items-center gap-1 rounded-full border border-[#D5D0C6] bg-white px-2 py-0.5 font-mono text-[11px] text-[#B89E6B]">
                  <Shield className="h-3 w-3" /> Protected
                </span>
              )}
            </div>
            <p className="mt-1 font-mono text-xs text-[#6B7580]">
              {entity.state} · {entity.locations} locations · {entity.industry}
              {entity.gstin ? ` · GSTIN ${entity.gstin}` : ''}
            </p>
          </div>
          <HealthScoreRing score={entity.healthScore} label={entity.healthLabel} size="lg" />
        </div>
      </div>

      <StatGrid>
        <StatCard label="Compliant" value={compliant + 28} icon={CheckCircle2} tone="success" />
        <StatCard label="Upcoming" value={upcoming + 3} icon={Clock} />
        <StatCard label="Action Req." value={action} icon={AlertTriangle} tone="warning" />
        <StatCard label="Need Info" value={needInfo + 1} icon={FileText} />
      </StatGrid>

      {/* Priority action */}
      {priority && (
        <div className="mt-6 rounded-2xl border border-[#D5D0C6] bg-gradient-to-r from-[#EBE8E2] to-[#F4F2EE] p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-[#E4E0D8] px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-[#B89E6B]">
                  Next Priority Action
                </span>
                <StatusBadge status={priority.status} />
              </div>
              <h3 className="font-mono text-base font-bold text-[#0E1217]">
                {priority.name} ({priority.periodLabel})
              </h3>
              <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs text-[#5C6570]">
                <span className="inline-flex items-center gap-1 text-[#B89E6B]">
                  <Calendar className="h-3.5 w-3.5" />
                  Due {priority.dueDate}
                </span>
                <span>{priority.department}</span>
                {priority.notes && <span>{priority.notes}</span>}
              </p>
            </div>
            <Link
              to="/dashboard/filings"
              className="btn-primary shrink-0 text-xs font-mono uppercase tracking-wider"
            >
              Review &amp; File →
            </Link>
          </div>
        </div>
      )}

      <div className="mt-6 grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <LineChartCard title="Compliance health trend (6 months)" data={HEALTH_TREND} />
        </div>
        <div className="rounded-2xl border border-[#D5D0C6] bg-white p-5 lg:col-span-2">
          <h3 className="mb-4 text-sm font-semibold text-[#0E1217]">Recent filings</h3>
          <ul className="space-y-3">
            {myFilings.slice(0, 5).map((f) => (
              <li
                key={f.id}
                className="flex items-start justify-between gap-2 border-b border-[#EBE8E2] pb-3 last:border-0 last:pb-0"
              >
                <div className="min-w-0">
                  <div className="truncate font-mono text-sm font-semibold text-[#0E1217]">
                    {f.shortName}
                  </div>
                  <div className="font-mono text-[11px] text-[#6B7580]">Due {f.dueDate}</div>
                </div>
                <StatusBadge status={f.status} />
              </li>
            ))}
          </ul>
          <Link
            to="/dashboard/filings"
            className="mt-4 inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-[#B89E6B] hover:underline"
          >
            Full calendar <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
