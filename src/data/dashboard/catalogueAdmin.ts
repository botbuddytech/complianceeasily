import { COMPLIANCE_SERVICES } from '../compliances';
import { CatalogueServiceAdmin } from '../../types/dashboard';

/** Admin catalogue view — extends static compliance services with ops metrics. */
export const CATALOGUE_ADMIN: CatalogueServiceAdmin[] = COMPLIANCE_SERVICES.slice(0, 24).map(
  (s, i) => ({
    id: s.id,
    name: s.name,
    shortName: s.shortName,
    category: s.category,
    department: s.department,
    price: s.price,
    governmentFees: s.governmentFees,
    status: s.status === 'coming_soon' ? 'coming_soon' : i === 7 ? 'deprecated' : 'active',
    protectionEligible: s.protectionEligible,
    filingsThisMonth: [42, 38, 31, 28, 24, 19, 15, 0, 12, 11, 9, 8, 7, 6, 5, 4, 3, 2, 14, 10, 8, 6, 5, 3][
      i
    ] ?? 0,
  }),
);
