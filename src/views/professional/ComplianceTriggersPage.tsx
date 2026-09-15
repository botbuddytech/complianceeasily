import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { PageHeader } from '../../components/dashboard/PageHeader';
import { TriggerTable } from '../../components/admin/triggers/TriggerTable';
import rawDataset from '../../data/complianceTriggers.json';
import {
  getCurrentProfessional,
  getMyEntities,
} from '../../lib/professionalSession';
import { entityToProfile } from '../../lib/triggerMatcher';
import type { ComplianceTriggerDataset } from '../../types/complianceTriggers';

const dataset = rawDataset as ComplianceTriggerDataset;

export function ProfessionalComplianceTriggersPage() {
  const pro = getCurrentProfessional();
  const profiles = useMemo(() => getMyEntities().map(entityToProfile), []);
  const [q, setQ] = useState('');
  const [categoryId, setCategoryId] = useState('all');

  const triggers = useMemo(() => {
    return dataset.triggers.filter((t) => {
      if (t.professionalType !== pro.type) return false;
      if (t.status !== 'active') return false;
      if (categoryId !== 'all' && t.categoryId !== categoryId) return false;
      if (q) {
        const hay = `${t.name} ${t.shortName} ${t.id} ${t.legalReference}`.toLowerCase();
        if (!hay.includes(q.toLowerCase())) return false;
      }
      return true;
    });
  }, [pro.type, q, categoryId]);

  const categoriesForPro = useMemo(() => {
    const ids = new Set(
      dataset.triggers
        .filter((t) => t.professionalType === pro.type && t.status === 'active')
        .map((t) => t.categoryId),
    );
    return dataset.categories.filter((c) => ids.has(c.id));
  }, [pro.type]);

  return (
    <div>
      <PageHeader
        variant="admin"
        title="Compliance Triggers"
        description={`Triggers mapped to your type (${pro.type}) and assigned entities. Catalogue is research-staging — no rule is automation-enabled.`}
      />

      <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50/80 px-3 py-2 text-xs text-amber-900">
        Research staging dataset v{dataset.meta.version}. Review required before any filing.
      </div>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex flex-1 items-center gap-2 rounded-xl border border-admin-border bg-admin-surface px-3 py-2">
          <Search className="h-4 w-4 text-admin-muted" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search triggers…"
            className="w-full bg-transparent text-sm outline-none placeholder:text-admin-muted"
          />
        </div>
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="rounded-xl border border-admin-border bg-admin-surface px-3 py-2 text-sm"
        >
          <option value="all">All categories</option>
          {categoriesForPro.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-2 font-mono text-[10px] font-semibold uppercase tracking-wider text-admin-muted">
        Showing {triggers.length} · {profiles.length} entity profile
        {profiles.length === 1 ? '' : 's'}
      </div>

      <TriggerTable
        triggers={triggers}
        departments={dataset.departments}
        profiles={profiles}
      />
    </div>
  );
}
