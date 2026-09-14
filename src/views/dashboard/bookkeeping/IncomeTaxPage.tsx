import { useMemo } from 'react';
import { PageHeader } from '../../../components/dashboard/PageHeader';
import { ComputationSheet } from '../../../components/books/ComputationSheet';
import { ItrReturnsPanel } from '../../../components/books/ItrReturnsPanel';
import { getTBooks, T_CLIENT_ENTITY_ID } from '../../../data/dashboard/bookkeeping';
import { getItrBooks, ITR_CLIENT_ENTITY_ID } from '../../../data/dashboard/itrBooks';
import { useBooksPeriod } from '../../../context/BooksPeriodContext';

function fyFromPeriod(from: string, to: string): { fy: string; ay: string } {
  const startYear = Number(from.slice(0, 4));
  const endYear = Number(to.slice(0, 4));
  if (from.endsWith('-04-01') && to.endsWith('-03-31') && endYear === startYear + 1) {
    const fy = `${startYear}-${String(endYear).slice(2)}`;
    const ay = `${endYear}-${String(endYear + 1).slice(2)}`;
    return { fy, ay };
  }
  return {
    fy: `${from} to ${to}`,
    ay: `A.Y. ending ${to}`,
  };
}

export function BookkeepingIncomeTaxPage() {
  const { period, periodLabel } = useBooksPeriod();
  const books = getTBooks(T_CLIENT_ENTITY_ID);
  const itr = getItrBooks(ITR_CLIENT_ENTITY_ID);
  const doc = useMemo(() => {
    if (!books?.computation) return undefined;
    const { fy, ay } = fyFromPeriod(period.from, period.to);
    return { ...books.computation, fy, ay };
  }, [books?.computation, period.from, period.to]);

  return (
    <div>
      <PageHeader
        title="Computation of income tax"
        description={`Computation of Total Income and ITR previews · ${periodLabel}`}
      />
      <div className="space-y-8">
        {doc ? (
          <ComputationSheet doc={doc} variant="client" />
        ) : (
          <p className="text-sm text-[#5C6570]">No tax computation for this entity.</p>
        )}
        {itr && (
          <ItrReturnsPanel
            itr={itr}
            periodFrom={period.from}
            periodTo={period.to}
            periodLabel={periodLabel}
            variant="client"
          />
        )}
      </div>
    </div>
  );
}
