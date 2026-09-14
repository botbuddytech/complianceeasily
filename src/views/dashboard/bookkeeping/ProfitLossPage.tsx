import { useMemo } from 'react';
import { PageHeader } from '../../../components/dashboard/PageHeader';
import { TAccountSheet } from '../../../components/books/TAccountSheet';
import { getTBooks, T_CLIENT_ENTITY_ID } from '../../../data/dashboard/bookkeeping';
import { useBooksPeriod } from '../../../context/BooksPeriodContext';

export function BookkeepingProfitLossPage() {
  const { periodLabel, periodEndedLabel } = useBooksPeriod();
  const books = getTBooks(T_CLIENT_ENTITY_ID);
  const pl = useMemo(() => {
    if (!books?.profitAndLoss) return undefined;
    return {
      ...books.profitAndLoss,
      title: `Profit and Loss Account for the Year Ended ${periodEndedLabel}`,
      subtitle: periodLabel,
    };
  }, [books?.profitAndLoss, periodEndedLabel, periodLabel]);

  return (
    <div>
      <PageHeader
        title="Profit & loss"
        description={`Trading and Profit & Loss Account in classic T-form · ${periodLabel}`}
      />
      {pl ? (
        <TAccountSheet account={pl} variant="client" />
      ) : (
        <p className="text-sm text-[#5C6570]">No profit &amp; loss statement for this entity.</p>
      )}
    </div>
  );
}
