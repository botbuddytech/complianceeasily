import { Subscription } from '../../types/dashboard';
import { PRICING_PLANS } from '../pricing';

const managed = PRICING_PLANS.find((p) => p.id === 'managed')!;

export const SUBSCRIPTION: Subscription = {
  planId: 'managed',
  planName: managed.name,
  priceDisplay: managed.priceDisplay,
  period: managed.period,
  entityCount: 3,
  renewalDate: '2026-10-05',
  status: 'active',
  features: managed.features.slice(0, 8),
  invoices: [
    {
      id: 'inv-2026-09',
      date: '2026-09-05',
      amount: '₹8,997',
      status: 'paid',
      description: 'Managed + Protected — 3 entities (Sep 2026)',
    },
    {
      id: 'inv-2026-08',
      date: '2026-08-05',
      amount: '₹8,997',
      status: 'paid',
      description: 'Managed + Protected — 3 entities (Aug 2026)',
    },
    {
      id: 'inv-2026-07',
      date: '2026-07-05',
      amount: '₹5,998',
      status: 'paid',
      description: 'Managed + Protected — 2 entities (Jul 2026)',
    },
    {
      id: 'inv-2026-06',
      date: '2026-06-05',
      amount: '₹5,998',
      status: 'refunded',
      description: 'Partial refund — entity removed mid-cycle',
    },
  ],
};
