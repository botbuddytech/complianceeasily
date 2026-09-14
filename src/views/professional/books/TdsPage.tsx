import { PageHeader } from '../../../components/dashboard/PageHeader';
import { TdsBooksPanel } from '../../../components/books/TdsBooksPanel';
import { useProfessionalBooks } from '../../../context/ProfessionalBooksContext';
import { useBooksPeriod } from '../../../context/BooksPeriodContext';

export function ProfessionalBooksTdsPage() {
  const { entity, tdsBooks } = useProfessionalBooks();
  const { period, periodLabel } = useBooksPeriod();

  return (
    <div>
      <PageHeader
        variant="admin"
        title="TDS / TCS ledgers & returns"
        description={
          entity
            ? `TDS / TCS accounts and returns for ${entity.shortName} · ${periodLabel}`
            : 'Select a client entity.'
        }
      />
      {!tdsBooks ? (
        <div className="rounded-sm border-2 border-admin-border bg-admin-surface px-4 py-10 text-center text-sm text-admin-muted">
          No TDS / TCS ledgers or returns for this entity.
        </div>
      ) : (
        <TdsBooksPanel
          tds={tdsBooks}
          periodFrom={period.from}
          periodTo={period.to}
          periodLabel={periodLabel}
          variant="admin"
        />
      )}
    </div>
  );
}
