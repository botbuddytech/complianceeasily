import type { EntityItrBooks, ItrReturn } from '../../types/books';

function acmeItr(): EntityItrBooks {
  const entityId = 'ent-acme';
  const legalName = 'ACME Retail Private Limited';
  const pan = 'AAACA8899P';

  const returns: ItrReturn[] = [
    {
      id: 'itr-acme-6-2526',
      entityId,
      formType: 'ITR-6',
      ay: '2026-27',
      fy: '2025-26',
      periodFrom: '2025-04-01',
      periodTo: '2026-03-31',
      status: 'draft',
      dueDate: '2026-10-31',
      totalIncome: '₹12,10,600',
      taxPayable: '₹51,747',
      preview: {
        formTitle: 'ITR-6',
        formSubtitle: 'Return of income for companies · A.Y. 2026-27',
        headerLines: [
          { label: 'Assessee', value: legalName },
          { label: 'PAN', value: pan },
          { label: 'F.Y.', value: '2025-26' },
          { label: 'A.Y.', value: '2026-27' },
          { label: 'Status', value: 'DRAFT' },
        ],
        sections: [
          {
            id: 'parta',
            title: 'Part A — General',
            rows: [
              { id: 'name', label: 'Name of company', value: legalName },
              { id: 'pan', label: 'PAN', value: pan },
              { id: 'doi', label: 'Date of incorporation', value: '12/04/2014' },
              { id: 'status', label: 'Status', value: 'Domestic company' },
            ],
          },
          {
            id: 'partb',
            title: 'Part B-TI — Computation of total income',
            rows: [
              { id: 'hp', label: 'Income from house property', value: 'Nil' },
              { id: 'bp', label: 'Profits and gains of business / profession', value: '₹13,18,600' },
              { id: 'os', label: 'Income from other sources', value: '₹42,000' },
              { id: 'gti', label: 'Gross total income', value: '₹13,60,600' },
              { id: 'via', label: 'Less: Chapter VI-A deductions', value: '₹1,50,000' },
              {
                id: 'ti',
                label: 'Total income',
                value: '₹12,10,600',
                emphasis: 'total',
              },
            ],
          },
          {
            id: 'partb-tti',
            title: 'Part B-TTI — Computation of tax',
            rows: [
              { id: 'tax', label: 'Tax on total income', value: '₹1,89,180' },
              { id: 'cess', label: 'Health & education cess', value: '₹7,567' },
              { id: 'tds', label: 'Less: TDS / TCS / advance tax', value: '₹1,45,000' },
              {
                id: 'pay',
                label: 'Tax payable / (refundable)',
                value: '₹51,747',
                emphasis: 'total',
              },
            ],
          },
        ],
        footerNote: 'Illustrative ITR-6 preview for demo — not an e-filed XML.',
      },
    },
    {
      id: 'itr-acme-6-2425',
      entityId,
      formType: 'ITR-6',
      ay: '2025-26',
      fy: '2024-25',
      periodFrom: '2024-04-01',
      periodTo: '2025-03-31',
      status: 'filed',
      dueDate: '2025-10-31',
      filedAt: '2025-10-18',
      acknowledgement: 'ITR-ACK-ACME-2526-9911',
      totalIncome: '₹10,85,000',
      taxPayable: '₹28,400',
      preview: {
        formTitle: 'ITR-6',
        formSubtitle: 'Return of income for companies · A.Y. 2025-26',
        headerLines: [
          { label: 'Assessee', value: legalName },
          { label: 'PAN', value: pan },
          { label: 'F.Y.', value: '2024-25' },
          { label: 'A.Y.', value: '2025-26' },
          { label: 'Ack. no.', value: 'ITR-ACK-ACME-2526-9911' },
          { label: 'Filed on', value: '2025-10-18' },
        ],
        sections: [
          {
            id: 'ti',
            title: 'Total income & tax',
            rows: [
              { id: 'ti', label: 'Total income', value: '₹10,85,000' },
              { id: 'tax', label: 'Tax + cess', value: '₹1,73,400' },
              { id: 'credit', label: 'Less: prepaid taxes', value: '₹1,45,000' },
              {
                id: 'pay',
                label: 'Net tax paid with return',
                value: '₹28,400',
                emphasis: 'total',
              },
            ],
          },
        ],
        footerNote: 'Prior year filed ITR-6 snapshot (demo).',
      },
    },
  ];

  return { entityId, pan, legalName, returns };
}

function medicareItr(): EntityItrBooks {
  const entityId = 'ent-medicare';
  const legalName = 'MediCare Clinics Pvt Ltd';
  const pan = 'AADCM9087K';
  const returns: ItrReturn[] = [
    {
      id: 'itr-mc-6-2526',
      entityId,
      formType: 'ITR-6',
      ay: '2026-27',
      fy: '2025-26',
      periodFrom: '2025-04-01',
      periodTo: '2026-03-31',
      status: 'due',
      dueDate: '2026-10-31',
      totalIncome: '₹1,58,000',
      taxPayable: '₹32,864',
      preview: {
        formTitle: 'ITR-6',
        formSubtitle: 'A.Y. 2026-27 · MediCare Clinics',
        headerLines: [
          { label: 'Assessee', value: legalName },
          { label: 'PAN', value: pan },
          { label: 'A.Y.', value: '2026-27' },
          { label: 'Status', value: 'DUE' },
        ],
        sections: [
          {
            id: 'sum',
            title: 'Income & tax summary',
            rows: [
              { id: 'bp', label: 'Business income', value: '₹1,58,000' },
              { id: 'ti', label: 'Total income', value: '₹1,58,000', emphasis: 'total' },
              { id: 'tax', label: 'Tax payable (approx.)', value: '₹32,864' },
            ],
          },
        ],
        footerNote: 'Illustrative ITR-6 draft preview.',
      },
    },
  ];
  return { entityId, pan, legalName, returns };
}

function brightpathItr(): EntityItrBooks {
  const entityId = 'ent-brightpath';
  const legalName = 'BrightPath Education LLP';
  const pan = 'AAEFB4412P';
  const returns: ItrReturn[] = [
    {
      id: 'itr-bp-5-2526',
      entityId,
      formType: 'ITR-5',
      ay: '2026-27',
      fy: '2025-26',
      periodFrom: '2025-04-01',
      periodTo: '2026-03-31',
      status: 'draft',
      dueDate: '2026-07-31',
      totalIncome: '₹1,15,000',
      taxPayable: '₹23,920',
      preview: {
        formTitle: 'ITR-5',
        formSubtitle: 'Return for firms / LLPs · A.Y. 2026-27',
        headerLines: [
          { label: 'Assessee', value: legalName },
          { label: 'PAN', value: pan },
          { label: 'A.Y.', value: '2026-27' },
          { label: 'Status', value: 'DRAFT' },
        ],
        sections: [
          {
            id: 'sum',
            title: 'Income & tax summary',
            rows: [
              { id: 'bp', label: 'Business income (course fees)', value: '₹1,15,000' },
              { id: 'ti', label: 'Total income', value: '₹1,15,000', emphasis: 'total' },
              { id: 'tax', label: 'Tax payable (approx.)', value: '₹23,920' },
            ],
          },
        ],
        footerNote: 'Illustrative ITR-5 draft preview.',
      },
    },
  ];
  return { entityId, pan, legalName, returns };
}

export const ITR_BOOKS_BY_ENTITY: Record<string, EntityItrBooks> = {
  'ent-acme': acmeItr(),
  'ent-medicare': medicareItr(),
  'ent-brightpath': brightpathItr(),
};

export const ITR_CLIENT_ENTITY_ID = 'ent-acme';

export function getItrBooks(entityId: string): EntityItrBooks | undefined {
  return ITR_BOOKS_BY_ENTITY[entityId];
}

/** ITRs whose FY window overlaps the reporting period. */
export function filterItrReturns(
  returns: ItrReturn[],
  from: string,
  to: string,
): ItrReturn[] {
  return returns.filter((r) => r.periodFrom <= to && r.periodTo >= from);
}
