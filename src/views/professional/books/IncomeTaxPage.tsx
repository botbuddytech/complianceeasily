import { useMemo } from 'react';
import { PageHeader } from '../../../components/dashboard/PageHeader';
import { ComputationSheet } from '../../../components/books/ComputationSheet';
import { ItrReturnsPanel } from '../../../components/books/ItrReturnsPanel';
import { useProfessionalBooks } from '../../../context/ProfessionalBooksContext';
import { useBooksPeriod } from '../../../context/BooksPeriodContext';

function fyFromPeriod(from: string, to: string): { fy: string; ay: string } {
  const startYear = Number(from.slice(0, 4));
  const endYear = Number(to.slice(0, 4));
  if (from.endsWith('-04-01') && to.endsWith('-03-31') && endYear === startYear + 1) {
    return {
      fy: `${startYear}-${String(endYear).slice(2)}`,
      ay: `${endYear}-${String(endYear + 1).slice(2)}`,
    };
  }
  return {
    fy: `${from} to ${to}`,
    ay: `ending ${to}`,
  };
}

export function ProfessionalBooksIncomeTaxPage() {
  const { entity, tComputation, itrBooks } = useProfessionalBooks();
  const { period, periodLabel } = useBooksPeriod();

  const doc = useMemo(() => {
    if (!tComputation) return undefined;
    const { fy, ay } = fyFromPeriod(period.from, period.to);
    return { ...tComputation, fy, ay };
  }, [tComputation, period.from, period.to]);

  return (
    <div>
      <PageHeader
        variant="admin"
        title="Income tax computation"
        description={
          entity
            ? `Computation of Total Income and ITR for ${entity.shortName} · ${periodLabel}`
            : 'Select a client entity.'
        }
      />
      <div className="space-y-8">
        {!doc ? (
          <div className="rounded-sm border-2 border-admin-border bg-admin-surface px-4 py-10 text-center text-sm text-admin-muted">
            No tax computation sheet for this entity.
          </div>
        ) : (
          <ComputationSheet doc={doc} variant="admin" />
        )}
        {itrBooks ? (
          <ItrReturnsPanel
            itr={itrBooks}
            periodFrom={period.from}
            periodTo={period.to}
            periodLabel={periodLabel}
            variant="admin"
          />
        ) : (
          <div className="rounded-sm border-2 border-admin-border bg-admin-surface px-4 py-10 text-center text-sm text-admin-muted">
            No ITR filings for this entity.
          </div>
        )}
      </div>
    </div>
  );
}
