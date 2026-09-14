import { useMemo, useState } from 'react';
import { PageHeader } from '../../../components/dashboard/PageHeader';
import { LedgerIndex } from '../../../components/books/LedgerIndex';
import { TAccountSheet } from '../../../components/books/TAccountSheet';
import { getTBooks, T_CLIENT_ENTITY_ID } from '../../../data/dashboard/bookkeeping';
import { useBooksPeriod } from '../../../context/BooksPeriodContext';

export function BookkeepingLedgersPage() {
  const { periodLabel } = useBooksPeriod();
  const books = getTBooks(T_CLIENT_ENTITY_ID);
  const index = books?.ledgerIndex ?? [];
  const ledgers = books?.ledgers ?? [];
  const defaultId = index[0]?.ledgerId ?? '';
  const [selectedId, setSelectedId] = useState(defaultId);

  const selected = useMemo(() => {
    const base = ledgers.find((l) => l.id === selectedId) ?? ledgers[0];
    if (!base) return undefined;
    return { ...base, subtitle: periodLabel };
  }, [ledgers, selectedId, periodLabel]);

  return (
    <div>
      <PageHeader
        title="Ledgers"
        description={`Ledger index and T-accounts · ${periodLabel}`}
      />
      {index.length === 0 ? (
        <p className="text-sm text-[#5C6570]">No ledgers for this entity.</p>
      ) : (
        <div className="space-y-6">
          <LedgerIndex
            entries={index}
            selectedId={selected?.id}
            onSelect={setSelectedId}
            variant="client"
          />
          {selected && <TAccountSheet account={selected} variant="client" />}
        </div>
      )}
    </div>
  );
}
