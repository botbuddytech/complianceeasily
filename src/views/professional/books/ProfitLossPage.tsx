import { useMemo } from 'react';
import { PageHeader } from '../../../components/dashboard/PageHeader';
import { TAccountSheet } from '../../../components/books/TAccountSheet';
import { useProfessionalBooks } from '../../../context/ProfessionalBooksContext';
import { useBooksPeriod } from '../../../context/BooksPeriodContext';

export function ProfessionalBooksProfitLossPage() {
  const { entity, tProfitAndLoss } = useProfessionalBooks();
  const { periodLabel, periodEndedLabel } = useBooksPeriod();

  const pl = useMemo(() => {
    if (!tProfitAndLoss) return undefined;
    return {
      ...tProfitAndLoss,
      title: `Profit and Loss Account for the Year Ended ${periodEndedLabel}`,
      subtitle: periodLabel,
    };
  }, [tProfitAndLoss, periodEndedLabel, periodLabel]);

  return (
    <div>
      <PageHeader
        variant="admin"
        title="Profit & loss"
        description={
          entity
            ? `Trading & Profit and Loss Account (T-form) for ${entity.shortName} · ${periodLabel}`
            : 'Select a client entity.'
        }
      />
      {!pl ? (
        <div className="rounded-sm border-2 border-admin-border bg-admin-surface px-4 py-10 text-center text-sm text-admin-muted">
          No profit &amp; loss statement for this entity.
        </div>
      ) : (
        <TAccountSheet account={pl} variant="admin" />
      )}
    </div>
  );
}
