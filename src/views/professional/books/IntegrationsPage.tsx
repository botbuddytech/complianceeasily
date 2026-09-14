import { PageHeader } from '../../../components/dashboard/PageHeader';
import { BooksIntegrationsPanel } from '../../../components/books/BooksIntegrationsPanel';
import { useProfessionalBooks } from '../../../context/ProfessionalBooksContext';

export function ProfessionalBooksIntegrationsPage() {
  const { entity, entityId } = useProfessionalBooks();

  return (
    <div>
      <PageHeader
        variant="admin"
        title="Integrations"
        description={
          entity
            ? `Connect ${entity.shortName} to Tally, banks, email, and GST / Income Tax / TDS portals.`
            : 'Select a client entity to manage integrations.'
        }
      />
      {!entityId ? (
        <div className="rounded-xl border border-admin-border bg-admin-surface px-4 py-10 text-center text-sm text-admin-muted">
          Select a client entity first.
        </div>
      ) : (
        <BooksIntegrationsPanel
          entityId={entityId}
          entityLabel={entity?.shortName}
          variant="admin"
        />
      )}
    </div>
  );
}
