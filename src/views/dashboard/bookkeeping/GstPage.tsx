import { PageHeader } from '../../../components/dashboard/PageHeader';
import { GstBooksPanel } from '../../../components/books/GstBooksPanel';
import { getGstBooks, GST_CLIENT_ENTITY_ID } from '../../../data/dashboard/gstBooks';
import { useBooksPeriod } from '../../../context/BooksPeriodContext';

export function BookkeepingGstPage() {
  const { period, periodLabel } = useBooksPeriod();
  const gst = getGstBooks(GST_CLIENT_ENTITY_ID);

  return (
    <div>
      <PageHeader
        title="GST ledgers & returns"
        description={`Output / input GST accounts, electronic ledgers, and return filings · ${periodLabel}`}
      />
      {!gst ? (
        <p className="text-sm text-[#5C6570]">No GST books for this entity.</p>
      ) : (
        <GstBooksPanel
          gst={gst}
          periodFrom={period.from}
          periodTo={period.to}
          periodLabel={periodLabel}
          variant="client"
        />
      )}
    </div>
  );
}
