'use client';

import { useMemo, useState } from 'react';
import { Zap, Building2, Layers, Users, Map as MapIcon, AlertTriangle } from 'lucide-react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { PageHeader } from '../../components/dashboard/PageHeader';
import { StatCard, StatGrid } from '../../components/dashboard/StatCard';
import { DepartmentList } from '../../components/admin/triggers/DepartmentList';
import { TriggerTable } from '../../components/admin/triggers/TriggerTable';
import { ClientMappingPanel } from '../../components/admin/triggers/ClientMappingPanel';
import { StateCoverageMatrix } from '../../components/admin/triggers/StateCoverageMatrix';
import { Tabs } from '../../components/ui/Tabs';
import { FilterBar } from '../../components/ui/FilterBar';
import rawDataset from '../../data/complianceTriggers.json';
import catalogueRaw from '../../data/complianceCatalogue.json';
import { ENTITIES } from '../../data/dashboard/entities';
import { entityToProfile } from '../../lib/triggerMatcher';
import type {
  ComplianceCatalogueDataset,
  ComplianceTriggerDataset,
  TriggerPriority,
  TriggerTypeId,
} from '../../types/complianceTriggers';

const dataset = rawDataset as ComplianceTriggerDataset;
const catalogue = catalogueRaw as ComplianceCatalogueDataset;

type ViewMode = 'department' | 'category' | 'jurisdiction' | 'coverage' | 'mapping';

function useQueryState(key: string, fallback: string) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const value = searchParams.get(key) ?? fallback;
  const setValue = (next: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (!next || next === fallback) params.delete(key);
    else params.set(key, next);
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };
  return [value, setValue] as const;
}

export function ComplianceTriggersPage() {
  const profiles = useMemo(() => ENTITIES.map(entityToProfile), []);

  const [view, setView] = useQueryState('view', 'department');
  const [selectedDeptId, setSelectedDeptId] = useQueryState(
    'dept',
    dataset.departments[0]?.id ?? '',
  );
  const [selectedCategoryId, setSelectedCategoryId] = useQueryState(
    'cat',
    dataset.categories[0]?.id ?? '',
  );
  const [selectedJurisdictionId, setSelectedJurisdictionId] = useQueryState('jur', 'IN');
  const [q, setQ] = useQueryState('q', '');
  const [triggerType, setTriggerType] = useQueryState('type', 'all');
  const [frequency, setFrequency] = useQueryState('freq', 'all');
  const [entityType, setEntityType] = useQueryState('entity', 'all');
  const [stateFilter, setStateFilter] = useQueryState('state', 'all');
  const [priority, setPriority] = useQueryState('priority', 'all');
  const [verification, setVerification] = useQueryState('verification', 'all');
  const [automation, setAutomation] = useQueryState('automation', 'all');
  const [obligationKind, setObligationKind] = useQueryState('obligation', 'all');
  const [scopeLevel, setScopeLevel] = useQueryState('scope', 'all');
  const [scheduleSource, setScheduleSource] = useQueryState('schedule', 'all');
  const [statusFilter, setStatusFilter] = useQueryState('status', 'all');

  const viewMode = (['department', 'category', 'jurisdiction', 'coverage', 'mapping'].includes(view)
    ? view
    : 'department') as ViewMode;

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

  const jurisdictionCounts = useMemo(() => {
    const map = new Map<string, number>();
    for (const t of dataset.triggers) {
      const id = t.jurisdictionId || 'IN';
      map.set(id, (map.get(id) ?? 0) + 1);
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

  const jurisdictionItems = useMemo(
    () =>
      catalogue.jurisdictions
        .filter((j) => jurisdictionCounts.has(j.jurisdictionId) || j.jurisdictionId === 'IN')
        .map((j) => ({
          id: j.jurisdictionId,
          name: j.name,
          shortName: j.jurisdictionId,
          level: j.level,
          triggerCount: jurisdictionCounts.get(j.jurisdictionId) ?? 0,
        }))
        .sort((a, b) => b.triggerCount - a.triggerCount),
    [jurisdictionCounts],
  );

  const filteredTriggers = useMemo(() => {
    return dataset.triggers.filter((t) => {
      if (viewMode === 'department' && t.departmentId !== selectedDeptId) return false;
      if (viewMode === 'category' && t.categoryId !== selectedCategoryId) return false;
      if (viewMode === 'jurisdiction') {
        const jid = t.jurisdictionId || 'IN';
        if (selectedJurisdictionId === 'IN') {
          // show central + all when IN selected? Prefer exact match for IN, else filter
          if (jid !== 'IN' && selectedJurisdictionId === 'IN') {
            // allow only central when IN selected
            if (jid !== 'IN') return false;
          }
        } else if (jid !== selectedJurisdictionId) {
          return false;
        }
      }

      const hay = `${t.name} ${t.shortName} ${t.id} ${t.legalReference} ${t.description} ${t.ruleId || ''}`.toLowerCase();
      if (q && !hay.includes(q.toLowerCase())) return false;
      if (triggerType !== 'all' && t.triggerType !== (triggerType as TriggerTypeId)) return false;
      if (frequency !== 'all' && t.schedule.frequency !== frequency) return false;
      if (priority !== 'all' && t.priority !== (priority as TriggerPriority)) return false;
      if (statusFilter !== 'all' && t.status !== statusFilter) return false;
      if (verification !== 'all' && (t.verificationStatus || '') !== verification) return false;
      if (automation === 'enabled' && !t.automationEnabled) return false;
      if (automation === 'disabled' && t.automationEnabled) return false;
      if (obligationKind !== 'all' && (t.obligationKind || '') !== obligationKind) return false;
      if (scopeLevel !== 'all' && (t.scopeLevel || '') !== scopeLevel) return false;
      if (scheduleSource !== 'all' && (t.scheduleSource || '') !== scheduleSource) return false;
      if (entityType !== 'all' && !t.applicability.entityTypes.includes(entityType)) return false;
      if (stateFilter !== 'all') {
        const states = t.applicability.states;
        if (states !== 'all' && !states.includes(stateFilter)) return false;
      }
      return true;
    });
  }, [
    viewMode,
    selectedDeptId,
    selectedCategoryId,
    selectedJurisdictionId,
    q,
    triggerType,
    frequency,
    entityType,
    stateFilter,
    priority,
    verification,
    automation,
    obligationKind,
    scopeLevel,
    scheduleSource,
    statusFilter,
  ]);

  const activeCount = dataset.triggers.filter((t) => t.status === 'active').length;
  const draftCount = dataset.triggers.filter((t) => t.status === 'draft').length;

  const views = [
    { id: 'department', label: 'By Department', count: dataset.departments.length },
    { id: 'category', label: 'By Category', count: dataset.categories.length },
    { id: 'jurisdiction', label: 'By Jurisdiction', count: catalogue.jurisdictions.length },
    { id: 'coverage', label: 'Coverage matrix', count: catalogue.stateCoverage.length },
    { id: 'mapping', label: 'Client Mapping', count: profiles.length },
  ];

  return (
    <div>
      <PageHeader
        variant="admin"
        title="Compliance Triggers"
        description={`Catalogue v${dataset.meta.version} · data release ${dataset.meta.dataRelease || '1.2.0'} · ${dataset.triggers.length} obligations`}
      />

      <div className="mb-4 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50/80 px-4 py-3 text-sm text-amber-950">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
        <div>
          <div className="font-semibold">Research staging — no rule is automation-enabled</div>
          <p className="mt-0.5 text-xs leading-relaxed text-amber-900/80">
            {dataset.meta.disclaimer}
            {dataset.meta.baseResearchAsOf
              ? ` Base research cutoff ${dataset.meta.baseResearchAsOf}; IndiaFilings review ${dataset.meta.researchAsOf}.`
              : ''}
          </p>
        </div>
      </div>

      <StatGrid>
        <StatCard
          label="Triggers"
          value={String(dataset.triggers.length)}
          hint={`${activeCount} active · ${draftCount} draft`}
          icon={Zap}
        />
        <StatCard
          label="Departments"
          value={String(dataset.departments.length)}
          hint={`${dataset.categories.length} categories`}
          icon={Building2}
        />
        <StatCard
          label="Jurisdictions"
          value={String(catalogue.jurisdictions.length)}
          hint={`${catalogue.stateCoverage.length} coverage cells`}
          icon={MapIcon}
        />
        <StatCard
          label="Entities mapped"
          value={String(profiles.length)}
          hint="Demo profiles"
          icon={Users}
        />
      </StatGrid>

      <div className="mt-6 mb-4">
        <Tabs items={views} value={viewMode} onChange={setView} />
      </div>

      {viewMode !== 'mapping' && viewMode !== 'coverage' && (
        <FilterBar
          search={q}
          onSearchChange={setQ}
          searchPlaceholder="Search triggers, forms, legal refs, rule ids…"
          selects={[
            {
              id: 'type',
              label: 'Type',
              value: triggerType,
              onChange: setTriggerType,
              options: [
                { value: 'all', label: 'All types' },
                ...dataset.triggerTypes.map((t) => ({ value: t.id, label: t.label })),
              ],
            },
            {
              id: 'freq',
              label: 'Frequency',
              value: frequency,
              onChange: setFrequency,
              options: [
                { value: 'all', label: 'All frequencies' },
                { value: 'monthly', label: 'Monthly' },
                { value: 'quarterly', label: 'Quarterly' },
                { value: 'half_yearly', label: 'Half-yearly' },
                { value: 'annual', label: 'Annual' },
                { value: 'event', label: 'Event' },
                { value: 'one_time', label: 'One-time' },
                { value: 'renewal', label: 'Renewal' },
                { value: 'continuous', label: 'Continuous' },
              ],
            },
            {
              id: 'priority',
              label: 'Priority',
              value: priority,
              onChange: setPriority,
              options: [
                { value: 'all', label: 'All priorities' },
                { value: 'critical', label: 'Critical' },
                { value: 'high', label: 'High' },
                { value: 'medium', label: 'Medium' },
                { value: 'low', label: 'Low' },
              ],
            },
            {
              id: 'status',
              label: 'Status',
              value: statusFilter,
              onChange: setStatusFilter,
              options: [
                { value: 'all', label: 'All statuses' },
                { value: 'active', label: 'Active' },
                { value: 'draft', label: 'Draft' },
              ],
            },
            {
              id: 'verification',
              label: 'Verification',
              value: verification,
              onChange: setVerification,
              options: [
                { value: 'all', label: 'All verification' },
                { value: 'researched_partial', label: 'Partial research' },
                { value: 'imported_unverified', label: 'Imported unverified' },
                { value: 'conflict_flagged', label: 'Conflict flagged' },
              ],
            },
            {
              id: 'automation',
              label: 'Automation',
              value: automation,
              onChange: setAutomation,
              options: [
                { value: 'all', label: 'All automation' },
                { value: 'enabled', label: 'Enabled' },
                { value: 'disabled', label: 'Disabled' },
              ],
            },
            {
              id: 'obligation',
              label: 'Obligation',
              value: obligationKind,
              onChange: setObligationKind,
              options: [
                { value: 'all', label: 'All obligations' },
                { value: 'mandatory_if_applicable', label: 'Mandatory if applicable' },
                { value: 'ongoing_duty', label: 'Ongoing duty' },
                { value: 'optional_benefit', label: 'Optional benefit' },
                { value: 'due_diligence', label: 'Due diligence' },
                { value: 'conduct_restriction', label: 'Conduct restriction' },
              ],
            },
            {
              id: 'scope',
              label: 'Scope',
              value: scopeLevel,
              onChange: setScopeLevel,
              options: [
                { value: 'all', label: 'All scopes' },
                { value: 'central', label: 'Central' },
                { value: 'state', label: 'State' },
                { value: 'state_framework', label: 'State framework' },
                { value: 'local', label: 'Local' },
              ],
            },
            {
              id: 'schedule',
              label: 'Schedule',
              value: scheduleSource,
              onChange: setScheduleSource,
              options: [
                { value: 'all', label: 'All schedules' },
                { value: 'codex_typed', label: 'Codex typed' },
                { value: 'curated_unverified', label: 'Curated unverified' },
                { value: 'none', label: 'None' },
              ],
            },
            {
              id: 'entity',
              label: 'Entity',
              value: entityType,
              onChange: setEntityType,
              options: [
                { value: 'all', label: 'All entities' },
                ...dataset.attributeDictionary.entityTypes.map((e) => ({ value: e, label: e })),
              ],
            },
            {
              id: 'state',
              label: 'State',
              value: stateFilter,
              onChange: setStateFilter,
              options: [
                { value: 'all', label: 'All states' },
                ...dataset.attributeDictionary.states.slice(0, 40).map((s) => ({
                  value: s,
                  label: s,
                })),
              ],
            },
          ]}
        />
      )}

      {viewMode === 'mapping' && <ClientMappingPanel dataset={dataset} profiles={profiles} />}

      {viewMode === 'coverage' && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-admin-muted">
            <Layers className="h-4 w-4" />
            36 jurisdictions × 27 topics — discovery-only cells are expected, not verified obligations.
          </div>
          <StateCoverageMatrix catalogue={catalogue} />
        </div>
      )}

      {(viewMode === 'department' ||
        viewMode === 'category' ||
        viewMode === 'jurisdiction') && (
        <div className="grid gap-4 lg:grid-cols-12">
          <div className="lg:col-span-3">
            {viewMode === 'department' && (
              <DepartmentList
                items={departmentItems}
                selectedId={selectedDeptId}
                onSelect={setSelectedDeptId}
                mode="department"
              />
            )}
            {viewMode === 'category' && (
              <DepartmentList
                items={categoryItems}
                selectedId={selectedCategoryId}
                onSelect={setSelectedCategoryId}
                mode="category"
              />
            )}
            {viewMode === 'jurisdiction' && (
              <DepartmentList
                items={jurisdictionItems}
                selectedId={selectedJurisdictionId}
                onSelect={setSelectedJurisdictionId}
                mode="department"
              />
            )}
          </div>
          <div className="lg:col-span-9 space-y-3">
            {viewMode === 'department' && (
              <p className="text-xs text-admin-muted">
                {departmentItems.find((d) => d.id === selectedDeptId)?.description}
              </p>
            )}
            <div className="font-mono text-[11px] uppercase tracking-wider text-admin-muted">
              {filteredTriggers.length} triggers
            </div>
            <TriggerTable
              triggers={filteredTriggers}
              departments={dataset.departments}
              profiles={profiles}
            />
          </div>
        </div>
      )}
    </div>
  );
}
