import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  BANK_CONNECTIONS,
  BOOKKEEPING_STATS_BY_ENTITY,
  BALANCE_SHEET_BY_ENTITY,
  INCOME_TAX_COMPUTATION,
  LEDGER_ACCOUNTS,
  LEDGER_ENTRIES,
  PROFIT_AND_LOSS_BY_ENTITY,
  getTBooks,
  type StatementLine,
  type TaxComputationLine,
} from '../data/dashboard/bookkeeping';
import { getGstBooks } from '../data/dashboard/gstBooks';
import { getTdsBooks } from '../data/dashboard/tdsBooks';
import { getItrBooks } from '../data/dashboard/itrBooks';
import { getMyBookEntities } from '../lib/professionalSession';
import type {
  BankConnection,
  BusinessEntity,
  LedgerAccount,
  LedgerEntry,
} from '../types/dashboard';
import type {
  ComputationDoc,
  EntityGstBooks,
  EntityItrBooks,
  EntityTdsBooks,
  EntityTBooks,
  LedgerIndexEntry,
  TAccount,
} from '../types/books';

interface ProfessionalBooksContextValue {
  entities: BusinessEntity[];
  entityId: string;
  entity: BusinessEntity | undefined;
  setEntityId: (id: string) => void;
  ledgers: LedgerAccount[];
  entries: LedgerEntry[];
  banks: BankConnection[];
  stats: { totalLedgers: number; bankBalance: string; cashBalance: string; unreconciled: number };
  profitAndLoss: StatementLine[];
  balanceSheet: { assets: StatementLine[]; liabilities: StatementLine[] };
  incomeTax: TaxComputationLine[];
  hasBooks: boolean;
  tBooks: EntityTBooks | undefined;
  tProfitAndLoss: TAccount | undefined;
  tCapitalAccount: TAccount | undefined;
  tBalanceSheet: TAccount | undefined;
  tComputation: ComputationDoc | undefined;
  tLedgers: TAccount[];
  tLedgerIndex: LedgerIndexEntry[];
  hasTStatements: boolean;
  gstBooks: EntityGstBooks | undefined;
  tdsBooks: EntityTdsBooks | undefined;
  itrBooks: EntityItrBooks | undefined;
}

const ProfessionalBooksContext = createContext<ProfessionalBooksContextValue | null>(null);

const EMPTY_STATS = {
  totalLedgers: 0,
  bankBalance: '₹0',
  cashBalance: '₹0',
  unreconciled: 0,
};

export function ProfessionalBooksProvider({ children }: { children: ReactNode }) {
  const entities = useMemo(() => getMyBookEntities(), []);
  const defaultId =
    entities.find((e) => LEDGER_ACCOUNTS.some((l) => l.entityId === e.id))?.id ??
    entities[0]?.id ??
    '';

  const [entityId, setEntityIdState] = useState(defaultId);
  const setEntityId = useCallback((id: string) => setEntityIdState(id), []);

  const entity = entities.find((e) => e.id === entityId);

  const ledgers = useMemo(
    () => LEDGER_ACCOUNTS.filter((l) => l.entityId === entityId),
    [entityId],
  );
  const entries = useMemo(
    () => LEDGER_ENTRIES.filter((e) => e.entityId === entityId),
    [entityId],
  );
  const banks = useMemo(
    () => BANK_CONNECTIONS.filter((b) => b.entityId === entityId),
    [entityId],
  );
  const stats = BOOKKEEPING_STATS_BY_ENTITY[entityId] ?? {
    ...EMPTY_STATS,
    totalLedgers: ledgers.length,
  };
  const profitAndLoss = PROFIT_AND_LOSS_BY_ENTITY[entityId] ?? [];
  const balanceSheet = BALANCE_SHEET_BY_ENTITY[entityId] ?? { assets: [], liabilities: [] };
  const incomeTax = entityId === 'ent-acme' ? INCOME_TAX_COMPUTATION : [];
  const hasBooks = ledgers.length > 0 || entries.length > 0;

  const tBooks = useMemo(() => getTBooks(entityId), [entityId]);
  const tProfitAndLoss = tBooks?.profitAndLoss;
  const tCapitalAccount = tBooks?.capitalAccount;
  const tBalanceSheet = tBooks?.balanceSheet;
  const tComputation = tBooks?.computation;
  const tLedgers = tBooks?.ledgers ?? [];
  const tLedgerIndex = tBooks?.ledgerIndex ?? [];
  const hasTStatements = Boolean(
    tProfitAndLoss || tBalanceSheet || tComputation || tLedgers.length > 0,
  );
  const gstBooks = useMemo(() => getGstBooks(entityId), [entityId]);
  const tdsBooks = useMemo(() => getTdsBooks(entityId), [entityId]);
  const itrBooks = useMemo(() => getItrBooks(entityId), [entityId]);

  const value = useMemo(
    () => ({
      entities,
      entityId,
      entity,
      setEntityId,
      ledgers,
      entries,
      banks,
      stats,
      profitAndLoss,
      balanceSheet,
      incomeTax,
      hasBooks,
      tBooks,
      tProfitAndLoss,
      tCapitalAccount,
      tBalanceSheet,
      tComputation,
      tLedgers,
      tLedgerIndex,
      hasTStatements,
      gstBooks,
      tdsBooks,
      itrBooks,
    }),
    [
      entities,
      entityId,
      entity,
      setEntityId,
      ledgers,
      entries,
      banks,
      stats,
      profitAndLoss,
      balanceSheet,
      incomeTax,
      hasBooks,
      tBooks,
      tProfitAndLoss,
      tCapitalAccount,
      tBalanceSheet,
      tComputation,
      tLedgers,
      tLedgerIndex,
      hasTStatements,
      gstBooks,
      tdsBooks,
      itrBooks,
    ],
  );

  return (
    <ProfessionalBooksContext.Provider value={value}>
      {children}
    </ProfessionalBooksContext.Provider>
  );
}

export function useProfessionalBooks() {
  const ctx = useContext(ProfessionalBooksContext);
  if (!ctx) {
    throw new Error('useProfessionalBooks must be used within ProfessionalBooksProvider');
  }
  return ctx;
}
