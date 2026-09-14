import { useMemo } from 'react';
import { PageHeader } from '../../../components/dashboard/PageHeader';
import { TAccountSheet } from '../../../components/books/TAccountSheet';
import { getTBooks, T_CLIENT_ENTITY_ID } from '../../../data/dashboard/bookkeeping';
import { useBooksPeriod } from '../../../context/BooksPeriodContext';

export function BookkeepingBalanceSheetPage() {
  const { periodLabel, periodEndedLabel } = useBooksPeriod();
  const books = getTBooks(T_CLIENT_ENTITY_ID);

  const capital = useMemo(() => {
    if (!books?.capitalAccount) return undefined;
    return {
      ...books.capitalAccount,
      subtitle: `As on ${periodEndedLabel}`,
    };
  }, [books?.capitalAccount, periodEndedLabel]);

  const bs = useMemo(() => {
    if (!books?.balanceSheet) return undefined;
    return {
      ...books.balanceSheet,
      title: `Balance Sheet as on ${periodEndedLabel}`,
      subtitle: periodLabel,
    };
  }, [books?.balanceSheet, periodEndedLabel, periodLabel]);

  return (
    <div>
      <PageHeader
        title="Balance sheet"
        description={`Capital Account and Balance Sheet in classic T-form · as on ${periodEndedLabel}`}
      />
      <div className="space-y-6">
        {capital && <TAccountSheet account={capital} variant="client" />}
        {bs && <TAccountSheet account={bs} variant="client" />}
        {!capital && !bs && (
          <p className="text-sm text-[#5C6570]">No balance sheet for this entity.</p>
        )}
      </div>
    </div>
  );
}
