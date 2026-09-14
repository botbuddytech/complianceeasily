import { PageHeader } from '../../../components/dashboard/PageHeader';
import { BooksIntegrationsPanel } from '../../../components/books/BooksIntegrationsPanel';

/** Client bookkeeping default entity (ACME). */
const CLIENT_ENTITY_ID = 'ent-acme';

export function BookkeepingIntegrationsPage() {
  return (
    <div>
      <PageHeader
        title="Integrations"
        description="Connect Tally, banks, email invoices, and government portals (GST, Income Tax, TDS)."
      />
      <BooksIntegrationsPanel
        entityId={CLIENT_ENTITY_ID}
        entityLabel="ACME Retail"
        variant="client"
      />
    </div>
  );
}
