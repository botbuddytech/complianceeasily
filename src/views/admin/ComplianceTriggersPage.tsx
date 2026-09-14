import { useMemo, useState } from 'react';
import { Search, Zap, Building2, Layers, Users } from 'lucide-react';
import { PageHeader } from '../../components/dashboard/PageHeader';
import { StatCard, StatGrid } from '../../components/dashboard/StatCard';
import { DepartmentList } from '../../components/admin/triggers/DepartmentList';
import { TriggerTable } from '../../components/admin/triggers/TriggerTable';
import { ClientMappingPanel } from '../../components/admin/triggers/ClientMappingPanel';
import rawDataset from '../../data/complianceTriggers.json';
import { ENTITIES } from '../../data/dashboard/entities';
import { entityToProfile } from '../../lib/triggerMatcher';
import type {
  ComplianceTriggerDataset,
  TriggerPriority,
  TriggerTypeId,
} from '../../types/complianceTriggers';

const dataset = rawDataset as ComplianceTriggerDataset;

type ViewMode = 'department' | 'category' | 'mapping';

export function ComplianceTriggersPage() {
  const profiles = useMemo(() => ENTITIES.map(entityToProfile), []);

  const [view, setView] = useState<ViewMode>('department');
  const [selectedDeptId, setSelectedDeptId] = useState(dataset.departments[0]?.id ?? '');
  const [selectedCategoryId, setSelectedCategoryId] = useState(dataset.categories[0]?.id ?? '');
  const [q, setQ] = useState('');
  const [triggerType, setTriggerType] = useState<string>('all');
  const [frequency, setFrequency] = useState<string>('all');
  const [entityType, setEntityType] = useState<string>('all');
  const [stateFilter, setStateFilter] = useState<string>('all');
  const [priority, setPriority] = useState<string>('all');

  const deptCounts = useMemo(() => {
    const map = new Map<string, number>();
    for (const t of dataset.triggers) {
      map.set(t.departmentId, (map.get(t.departmentId) ?? 0) + 1);
    }
    return map;
  }, []);

  const categoryCounts = useMemo(() => {
    const map = new Map<string, number>();
    for (const t of dataset.triggers) {
      map.set(t.categoryId, (map.get(t.categoryId) ?? 0) + 1);
    }
    return map;
  }, []);

  const departmentItems = useMemo(
    () =>
      dataset.departments.map((d) => ({
        ...d,
        triggerCount: deptCounts.get(d.id) ?? 0,
      })),
    [deptCounts],
  );

  const categoryItems = useMemo(
    () =>
      dataset.categories.map((c) => ({
        ...c,
        triggerCount: categoryCounts.get(c.id) ?? 0,
        shortName: c.code,
        level: c.code,
      })),
    [categoryCounts],
  );

  const filteredTriggers = useMemo(() => {
    const scopeId = view === 'department' ? selectedDeptId : selectedCategoryId;
    return dataset.triggers.filter((t) => {
      if (view === 'department' && t.departmentId !== scopeId) return false;
      if (view === 'category' && t.categoryId !== scopeId) return false;

      const hay = `${t.name} ${t.shortName} ${t.id} ${t.legalReference} ${t.description}`.toLowerCase();
      if (q && !hay.includes(q.toLowerCase())) return false;
      if (triggerType !== 'all' && t.triggerType !== (triggerType as TriggerTypeId)) return false;
      if (frequency !== 'all' && t.schedule.frequency !== frequency) return false;
      if (priority !== 'all' && t.priority !== (priority as TriggerPriority)) return false;
      if (
        entityType !== 'all' &&
        !t.applicability.entityTypes.includes(entityType)
      ) {
        return false;
      }
      if (stateFilter !== 'all') {
        const states = t.applicability.states;
        if (states !== 'all' && !states.includes(stateFilter)) return false;
      }
      return true;
    });
  }, [
    view,
    selectedDeptId,
    selectedCategoryId,
    q,
    triggerType,
    frequency,
    entityType,
    stateFilter,
    priority,
  ]);

  const mappedEntityCount = useMemo(() => {
    return profiles.filter((p) =>
      dataset.triggers.some((t) => {
        // light check: at least one active trigger could apply via entity type
        return t.status === 'active' && t.applicability.entityTypes.includes(p.entityType);
      }),
    ).length;
  }, [profiles]);

  const views: { id: ViewMode; label: string }[] = [
    { id: 'department', label: 'By Department' },
    { id: 'category', label: 'By Category' },
    { id: 'mapping', label: 'Client Mapping' },
  ];

  return (
    <div>
      <PageHeader
        variant="admin"
        title="Compliance Triggers"
        description="Government department–wise and category–wise triggers mapped to client entities for WhatsApp, email and in-app compliance reminders."
      />

      <StatGrid>
        <StatCard
          tone="admin"
          label="Triggers"
          value={dataset.triggers.length}
          hint={`v${dataset.meta.version} · verified ${dataset.meta.lastVerified}`}
          icon={Zap}
        />
        <StatCard
          tone="admin"
          label="Departments"
          value={dataset.departments.length}
          hint="Central · State · Municipal · Sectoral"
          icon={Building2}
        />
        <StatCard
          tone="admin"
          label="Categories"
          value={dataset.categories.length}
          hint="Aligned to service catalogue"
          icon={Layers}
        />
        <StatCard
          tone="admin"
          label="Entities mapped"
          value={mappedEntityCount}
          hint={`${profiles.length} profiles in demo data`}
          icon={Users}
        />
      </StatGrid>

      <div className="mt-6 mb-4 flex flex-wrap gap-2">
        {views.map((v) => (
          <button
            key={v.id}
            type="button"
            onClick={() => setView(v.id)}
            className={`rounded-full border px-3 py-1.5 font-mono text-xs font-semibold uppercase tracking-wider transition-colors ${
              view === v.id
                ? 'border-admin-accent bg-admin-accent text-white'
                : 'border-admin-border bg-admin-surface text-admin-muted hover:bg-admin-bg'
            }`}
          >
            {v.label}
          </button>
        ))}
      </div>

      {view !== 'mapping' && (
        <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:flex-wrap lg:items-center">
          <div className="flex flex-1 items-center gap-2 rounded-xl border border-admin-border bg-admin-surface px-3 py-2">
            <Search className="h-4 w-4 text-admin-muted" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search triggers, forms, legal refs…"
              className="w-full bg-transparent text-sm outline-none placeholder:text-admin-muted"
            />
          </div>
          <select
            value={triggerType}
            onChange={(e) => setTriggerType(e.target.value)}
            className="rounded-xl border border-admin-border bg-admin-surface px-3 py-2 text-sm"
          >
            <option value="all">All trigger types</option>
            {dataset.triggerTypes.map((tt) => (
              <option key={tt.id} value={tt.id}>
                {tt.label}
              </option>
            ))}
          </select>
          <select
            value={frequency}
            onChange={(e) => setFrequency(e.target.value)}
            className="rounded-xl border border-admin-border bg-admin-surface px-3 py-2 text-sm"
          >
            <option value="all">All frequencies</option>
            {[
              'monthly',
              'quarterly',
              'half_yearly',
              'annual',
              'event',
              'one_time',
              'renewal',
              'continuous',
            ].map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="rounded-xl border border-admin-border bg-admin-surface px-3 py-2 text-sm"
          >
            <option value="all">All priorities</option>
            {['critical', 'high', 'medium', 'low'].map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
          <select
            value={entityType}
            onChange={(e) => setEntityType(e.target.value)}
            className="rounded-xl border border-admin-border bg-admin-surface px-3 py-2 text-sm"
          >
            <option value="all">All entity types</option>
            {dataset.attributeDictionary.entityTypes.map((et) => (
              <option key={et} value={et}>
                {et}
              </option>
            ))}
          </select>
          <select
            value={stateFilter}
            onChange={(e) => setStateFilter(e.target.value)}
            className="rounded-xl border border-admin-border bg-admin-surface px-3 py-2 text-sm"
          >
            <option value="all">All states</option>
            {dataset.attributeDictionary.states.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      )}

      {view === 'mapping' ? (
        <ClientMappingPanel dataset={dataset} profiles={profiles} />
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="lg:col-span-3">
            {view === 'department' ? (
              <DepartmentList
                mode="department"
                items={departmentItems}
                selectedId={selectedDeptId}
                onSelect={setSelectedDeptId}
              />
            ) : (
              <DepartmentList
                mode="category"
                items={categoryItems}
                selectedId={selectedCategoryId}
                onSelect={setSelectedCategoryId}
              />
            )}
            {view === 'department' && (
              <div className="mt-4 rounded-xl border border-admin-border bg-admin-surface p-3 text-xs text-admin-muted">
                {(() => {
                  const d = dataset.departments.find((x) => x.id === selectedDeptId);
                  if (!d) return null;
                  return (
                    <>
                      <div className="font-semibold text-admin-text">{d.name}</div>
                      <p className="mt-1">{d.description}</p>
                      <a
                        href={d.portalUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-2 inline-block underline underline-offset-2"
                      >
                        Open portal →
                      </a>
                    </>
                  );
                })()}
              </div>
            )}
          </div>
          <div className="lg:col-span-9">
            <div className="mb-2 font-mono text-[10px] font-semibold uppercase tracking-wider text-admin-muted">
              Showing {filteredTriggers.length} trigger
              {filteredTriggers.length === 1 ? '' : 's'}
            </div>
            <TriggerTable
              triggers={filteredTriggers}
              departments={dataset.departments}
              profiles={profiles}
            />
          </div>
        </div>
      )}

      <p className="mt-6 text-[11px] leading-relaxed text-admin-muted">
        {dataset.meta.disclaimer}
      </p>
    </div>
  );
}
