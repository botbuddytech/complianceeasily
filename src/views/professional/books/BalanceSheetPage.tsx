import { useMemo } from 'react';
import { PageHeader } from '../../../components/dashboard/PageHeader';
import { TAccountSheet } from '../../../components/books/TAccountSheet';
import { useProfessionalBooks } from '../../../context/ProfessionalBooksContext';
import { useBooksPeriod } from '../../../context/BooksPeriodContext';

export function ProfessionalBooksBalanceSheetPage() {
  const { entity, tCapitalAccount, tBalanceSheet } = useProfessionalBooks();
  const { periodLabel, periodEndedLabel } = useBooksPeriod();

  const capital = useMemo(() => {
    if (!tCapitalAccount) return undefined;
    return { ...tCapitalAccount, subtitle: `As on ${periodEndedLabel}` };
  }, [tCapitalAccount, periodEndedLabel]);

  const bs = useMemo(() => {
    if (!tBalanceSheet) return undefined;
    return {
      ...tBalanceSheet,
      title: `Balance Sheet as on ${periodEndedLabel}`,
      subtitle: periodLabel,
    };
  }, [tBalanceSheet, periodEndedLabel, periodLabel]);

  const empty = !capital && !bs;

  return (
    <div>
      <PageHeader
        variant="admin"
        title="Balance sheet"
        description={
          entity
            ? `Capital Account and Balance Sheet (T-form) for ${entity.shortName} · as on ${periodEndedLabel}`
            : 'Select a client entity.'
        }
      />
      {empty ? (
        <div className="rounded-sm border-2 border-admin-border bg-admin-surface px-4 py-10 text-center text-sm text-admin-muted">
          No balance sheet for this entity.
        </div>
      ) : (
        <div className="space-y-6">
          {capital && <TAccountSheet account={capital} variant="admin" />}
          {bs && <TAccountSheet account={bs} variant="admin" />}
        </div>
      )}
    </div>
  );
}
