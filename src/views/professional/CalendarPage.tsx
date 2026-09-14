import { PageHeader } from '../../components/dashboard/PageHeader';
import { FilingsCalendar } from '../../components/dashboard/FilingsCalendar';
import { getMyFilings } from '../../lib/professionalSession';

export function ProfessionalCalendarPage() {
  const filings = getMyFilings();

  return (
    <div>
      <PageHeader
        variant="admin"
        title="Calendar"
        description="Due dates for filings assigned to you."
      />
      <FilingsCalendar filings={filings} />
    </div>
  );
}
