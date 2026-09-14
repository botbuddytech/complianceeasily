import { ProtectionClaim } from '../../types/dashboard';

export const PROTECTION_CLAIMS: ProtectionClaim[] = [
  {
    id: 'clm-1',
    entityId: 'ent-acme',
    entityName: 'ACME Retail Pvt Ltd',
    filingName: 'GSTR-3B — May 2026',
    amountClaimed: '₹2,400',
    submittedAt: '2026-06-22',
    status: 'paid',
    reason: 'Late fee due to portal downtime during filing window; Managed plan SLA met.',
    reviewedBy: 'Ops — Kavita Nair',
  },
  {
    id: 'clm-2',
    entityId: 'ent-spice',
    entityName: 'Spice Route Foods',
    filingName: 'PF ECR — Jul 2026',
    amountClaimed: '₹850',
    submittedAt: '2026-08-18',
    status: 'under_review',
    reason: 'Interest charged after delayed employer contribution upload.',
  },
  {
    id: 'clm-3',
    entityId: 'ent-acme',
    entityName: 'ACME Retail Pvt Ltd',
    filingName: 'TDS Form 26Q — Q1 FY26',
    amountClaimed: '₹1,200',
    submittedAt: '2026-08-02',
    status: 'approved',
    reason: 'Late filing fee reimbursable under Protection Guarantee.',
    reviewedBy: 'Ops — Kavita Nair',
  },
  {
    id: 'clm-4',
    entityId: 'ent-nova',
    entityName: 'Nova Tech Solutions LLP',
    filingName: 'GSTR-3B — Apr 2026',
    amountClaimed: '₹500',
    submittedAt: '2026-05-10',
    status: 'rejected',
    reason: 'Entity not on Managed + Protected plan at time of late fee.',
    reviewedBy: 'Ops — Kavita Nair',
  },
];

export const PROTECTION_ELIGIBILITY = {
  activeEntities: 2,
  coveredFilingsThisMonth: 14,
  claimsPaidYTD: '₹3,600',
  guaranteeNote:
    'Late government fees reimbursed when we miss a managed filing deadline under plan terms.',
};
