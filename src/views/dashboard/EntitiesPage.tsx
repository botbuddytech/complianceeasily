'use client';

import { MapPin, Shield } from 'lucide-react';
import { PageHeader } from '../../components/dashboard/PageHeader';
import { HealthScoreRing } from '../../components/dashboard/HealthScoreRing';
import { StatusBadge } from '../../components/dashboard/StatusBadge';
import { CreateEntityForm } from '../../components/dashboard/CreateEntityForm';
import { ENTITIES } from '../../data/dashboard/entities';

export function EntitiesPage() {
  return (
    <div>
      <PageHeader
        title="Business Entities"
        description="Manage GSTINs, locations, and plans for each Indian business entity. Creating an entity rematches compliance triggers."
        actions={
          <CreateEntityForm
            workspaceId="ws-demo"
            clientId="cli-1"
            onDone={() => window.location.reload()}
          />
        }
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {ENTITIES.map((e) => (
          <article
            key={e.id}
            className="flex flex-col rounded-2xl border border-[#D5D0C6] bg-white p-5 shadow-sm"
          >
            <div className="mb-4 flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h2 className="truncate font-semibold text-[#0E1217]">{e.shortName}</h2>
                <p className="mt-0.5 truncate font-mono text-[11px] text-[#6B7580]">{e.name}</p>
              </div>
              <StatusBadge status={e.planId} />
            </div>

            <HealthScoreRing score={e.healthScore} label={e.healthLabel} size="sm" />

            <dl className="mt-4 space-y-2 font-mono text-xs text-[#5C6570]">
              <div className="flex justify-between gap-2">
                <dt className="text-[#6B7580]">Type</dt>
                <dd className="font-semibold">{e.entityType}</dd>
              </div>
              {e.gstin && (
                <div className="flex justify-between gap-2">
                  <dt className="text-[#6B7580]">GSTIN</dt>
                  <dd className="truncate font-semibold">{e.gstin}</dd>
                </div>
              )}
              <div className="flex items-center justify-between gap-2">
                <dt className="flex items-center gap-1 text-[#6B7580]">
                  <MapPin className="h-3 w-3" /> State
                </dt>
                <dd className="font-semibold">
                  {e.state} · {e.locations} loc
                </dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-[#6B7580]">Industry</dt>
                <dd className="truncate font-semibold">{e.industry}</dd>
              </div>
            </dl>

            <div className="mt-4 flex items-center justify-between border-t border-[#EBE8E2] pt-3">
              <span className="inline-flex items-center gap-1 font-mono text-[11px] text-[#B89E6B]">
                {e.protectionActive ? (
                  <>
                    <Shield className="h-3.5 w-3.5" /> Protected
                  </>
                ) : (
                  'No protection'
                )}
              </span>
              <button
                type="button"
                className="rounded-lg border border-[#D5D0C6] px-2.5 py-1 text-xs font-semibold text-[#5C6570] hover:border-[#B89E6B] hover:bg-[#EBE8E2]"
              >
                Manage
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
