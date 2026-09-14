import { PROFESSIONALS } from '../data/dashboard/professionals';
import { FILINGS } from '../data/dashboard/filings';
import { DOCUMENTS } from '../data/dashboard/documents';
import { ENTITIES } from '../data/dashboard/entities';
import { CLIENTS } from '../data/dashboard/clients';
import {
  PROPERTY_ASSETS,
  STOCK_HOLDINGS,
  STOCK_LEDGER,
  INVESTMENT_COMPLIANCES,
} from '../data/dashboard/investments';
import type {
  BusinessEntity,
  ClientSummary,
  ComplianceDocument,
  Filing,
  ProfessionalProfile,
} from '../types/dashboard';
import type {
  PropertyAsset,
  StockHolding,
  StockLedgerEntry,
  InvestmentComplianceItem,
} from '../types/investments';

/** Fixed demo identity for the Professional workspace (Priya Sharma, CA). */
export const CURRENT_PROFESSIONAL_ID = 'pro-1';

/**
 * Explicit professional ↔ entity assignments (source of truth).
 * Mirrors `professional_assignments` table. Demo seed derived from filings/docs
 * once, then treated as the assignment list going forward.
 */
export const PROFESSIONAL_ASSIGNMENTS: Array<{
  professionalId: string;
  entityId: string;
  active: boolean;
}> = (() => {
  const pairs = new Set<string>();
  for (const f of FILINGS) {
    if (f.professionalId) pairs.add(`${f.professionalId}::${f.entityId}`);
  }
  for (const d of DOCUMENTS) {
    if (d.reviewerProfessionalId) {
      pairs.add(`${d.reviewerProfessionalId}::${d.entityId}`);
    }
  }
  return [...pairs].map((key) => {
    const [professionalId, entityId] = key.split('::');
    return { professionalId, entityId, active: true };
  });
})();

export function getCurrentProfessional(): ProfessionalProfile {
  const pro = PROFESSIONALS.find((p) => p.id === CURRENT_PROFESSIONAL_ID);
  if (!pro) {
    throw new Error(`Professional ${CURRENT_PROFESSIONAL_ID} not found in mock data`);
  }
  return pro;
}

export function getMyAssignedEntityIds(professionalId = CURRENT_PROFESSIONAL_ID): Set<string> {
  return new Set(
    PROFESSIONAL_ASSIGNMENTS.filter(
      (a) => a.professionalId === professionalId && a.active,
    ).map((a) => a.entityId),
  );
}

export function getMyFilings(): Filing[] {
  return FILINGS.filter((f) => f.professionalId === CURRENT_PROFESSIONAL_ID);
}

export function getMyDocuments(): ComplianceDocument[] {
  return DOCUMENTS.filter((d) => d.reviewerProfessionalId === CURRENT_PROFESSIONAL_ID);
}

/** Entities from explicit assignments (not inferred from name matching). */
export function getMyEntities(): BusinessEntity[] {
  const entityIds = getMyAssignedEntityIds();
  return ENTITIES.filter((e) => entityIds.has(e.id));
}

export function getMyClients(): ClientSummary[] {
  const clientIds = new Set(
    getMyEntities()
      .map((e) => e.clientId)
      .filter((id): id is string => Boolean(id)),
  );
  return CLIENTS.filter((c) => clientIds.has(c.id));
}

export function getMyBookEntities(): BusinessEntity[] {
  return getMyEntities();
}

function getMyClientIds(): Set<string> {
  return new Set(getMyClients().map((c) => c.id));
}

export function getMyPropertyAssets(): PropertyAsset[] {
  const ids = getMyClientIds();
  return PROPERTY_ASSETS.filter((p) => ids.has(p.clientId));
}

export function getMyStockHoldings(): StockHolding[] {
  const ids = getMyClientIds();
  return STOCK_HOLDINGS.filter((h) => ids.has(h.clientId));
}

export function getMyStockLedger(): StockLedgerEntry[] {
  const ids = getMyClientIds();
  return STOCK_LEDGER.filter((e) => ids.has(e.clientId));
}

export function getMyInvestmentCompliances(): InvestmentComplianceItem[] {
  const ids = getMyClientIds();
  return INVESTMENT_COMPLIANCES.filter((c) => ids.has(c.clientId));
}

/** Filing count for a client via entity.clientId join (replaces name heuristic). */
export function countMyFilingsForClient(clientId: string): number {
  const entityIds = new Set(
    ENTITIES.filter((e) => e.clientId === clientId).map((e) => e.id),
  );
  return getMyFilings().filter((f) => entityIds.has(f.entityId)).length;
}
