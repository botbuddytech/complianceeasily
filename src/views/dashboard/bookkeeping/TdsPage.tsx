import { PageHeader } from '../../../components/dashboard/PageHeader';
import { TdsBooksPanel } from '../../../components/books/TdsBooksPanel';
import { getTdsBooks, TDS_CLIENT_ENTITY_ID } from '../../../data/dashboard/tdsBooks';
import { useBooksPeriod } from '../../../context/BooksPeriodContext';

export function BookkeepingTdsPage() {
  const { period, periodLabel } = useBooksPeriod();
  const tds = getTdsBooks(TDS_CLIENT_ENTITY_ID);

  return (
    <div>
      <PageHeader
        title="TDS / TCS ledgers & returns"
        description={`Section-wise TDS/TCS accounts and quarterly statements · ${periodLabel}`}
      />
      {!tds ? (
        <p className="text-sm text-[#5C6570]">No TDS / TCS books for this entity.</p>
      ) : (
        <TdsBooksPanel
          tds={tds}
          periodFrom={period.from}
          periodTo={period.to}
          periodLabel={periodLabel}
          variant="client"
        />
      )}
    </div>
  );
}
