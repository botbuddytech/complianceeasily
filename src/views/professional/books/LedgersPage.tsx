import { useEffect, useMemo, useState } from 'react';
import { PageHeader } from '../../../components/dashboard/PageHeader';
import { LedgerIndex } from '../../../components/books/LedgerIndex';
import { TAccountSheet } from '../../../components/books/TAccountSheet';
import { useProfessionalBooks } from '../../../context/ProfessionalBooksContext';
import { useBooksPeriod } from '../../../context/BooksPeriodContext';

export function ProfessionalBooksLedgersPage() {
  const { entity, entityId, tLedgers, tLedgerIndex } = useProfessionalBooks();
  const { periodLabel } = useBooksPeriod();
  const [selectedId, setSelectedId] = useState(tLedgerIndex[0]?.ledgerId ?? '');

  useEffect(() => {
    setSelectedId(tLedgerIndex[0]?.ledgerId ?? '');
    // eslint-disable-next-line react-hooks/exhaustive-deps -- reset when entity changes
  }, [entityId]);

  const selected = useMemo(() => {
    const base = tLedgers.find((l) => l.id === selectedId) ?? tLedgers[0];
    if (!base) return undefined;
    return { ...base, subtitle: periodLabel };
  }, [tLedgers, selectedId, periodLabel]);

  return (
    <div>
      <PageHeader
        variant="admin"
        title="Ledgers"
        description={
          entity
            ? `Ledger index and T-accounts for ${entity.shortName} · ${periodLabel}`
            : 'Select a client entity.'
        }
      />
      {tLedgerIndex.length === 0 ? (
        <div className="rounded-sm border-2 border-admin-border bg-admin-surface px-4 py-10 text-center text-sm text-admin-muted">
          No ledgers for this entity.
        </div>
      ) : (
        <div className="space-y-6">
          <LedgerIndex
            entries={tLedgerIndex}
            selectedId={selected?.id}
            onSelect={setSelectedId}
            variant="admin"
          />
          {selected && <TAccountSheet account={selected} variant="admin" />}
        </div>
      )}
    </div>
  );
}
