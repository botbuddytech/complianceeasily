import { PageHeader } from '../../../components/dashboard/PageHeader';
import { GstBooksPanel } from '../../../components/books/GstBooksPanel';
import { useProfessionalBooks } from '../../../context/ProfessionalBooksContext';
import { useBooksPeriod } from '../../../context/BooksPeriodContext';

export function ProfessionalBooksGstPage() {
  const { entity, gstBooks } = useProfessionalBooks();
  const { period, periodLabel } = useBooksPeriod();

  return (
    <div>
      <PageHeader
        variant="admin"
        title="GST ledgers & returns"
        description={
          entity
            ? `GST accounts and returns for ${entity.shortName} · ${periodLabel}`
            : 'Select a client entity.'
        }
      />
      {!gstBooks ? (
        <div className="rounded-sm border-2 border-admin-border bg-admin-surface px-4 py-10 text-center text-sm text-admin-muted">
          No GST ledgers or returns for this entity.
        </div>
      ) : (
        <GstBooksPanel
          gst={gstBooks}
          periodFrom={period.from}
          periodTo={period.to}
          periodLabel={periodLabel}
          variant="admin"
        />
      )}
    </div>
  );
}
