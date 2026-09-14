import type {
  GstReturn,
  GstReturnType,
  ReturnPreviewDoc,
  TdsReturn,
  TdsReturnType,
} from '../../types/books';

function gstPreview(
  r: Omit<GstReturn, 'preview'>,
  legalName: string,
  gstin: string,
): ReturnPreviewDoc {
  const taxTotal = [r.igst, r.cgst, r.sgst].join(' / ');
  const commonHeader = [
    { label: 'Legal name', value: legalName },
    { label: 'GSTIN', value: gstin },
    { label: 'Tax period', value: r.periodLabel },
    { label: 'Status', value: r.status.toUpperCase() },
  ];
  if (r.arn) commonHeader.push({ label: 'ARN', value: r.arn });
  if (r.filedAt) commonHeader.push({ label: 'Filed on', value: r.filedAt });

  const byType: Record<GstReturnType, ReturnPreviewDoc> = {
    'GSTR-1': {
      formTitle: 'GSTR-1',
      formSubtitle: `Details of outward supplies · ${r.periodLabel}`,
      headerLines: commonHeader,
      sections: [
        {
          id: 'outward',
          title: 'Outward supplies (summary)',
          rows: [
            { id: 'b2b', label: 'B2B taxable value', value: approxSplit(r.taxableValue, 0.62) },
            { id: 'b2c', label: 'B2C (large + others)', value: approxSplit(r.taxableValue, 0.38) },
            {
              id: 'tot',
              label: 'Total taxable value',
              value: r.taxableValue,
              emphasis: 'total',
            },
          ],
        },
        {
          id: 'tax',
          title: 'Tax amount',
          rows: [
            { id: 'igst', label: 'IGST', value: r.igst },
            { id: 'cgst', label: 'CGST', value: r.cgst },
            { id: 'sgst', label: 'SGST', value: r.sgst },
            { id: 'sum', label: 'Total tax (IGST / CGST / SGST)', value: taxTotal, emphasis: 'total' },
          ],
        },
      ],
      footerNote: 'Illustrative GSTR-1 preview for demo — not a filed JSON/PDF.',
    },
    'GSTR-3B': {
      formTitle: 'GSTR-3B',
      formSubtitle: `Monthly return · ${r.periodLabel}`,
      headerLines: commonHeader,
      sections: [
        {
          id: '3-1',
          title: '3.1 Outward supplies & inward supplies liable to reverse charge',
          rows: [
            { id: 'a', label: '(a) Outward taxable supplies (other than zero rated)', value: r.taxableValue },
            { id: 'b', label: '(b) Outward taxable supplies (zero rated)', value: '₹0' },
            { id: 'c', label: '(c) Other outward supplies (nil rated, exempt)', value: '₹0' },
          ],
        },
        {
          id: '4',
          title: '4. Eligible ITC',
          rows: [
            { id: 'itc', label: 'ITC available / claimed', value: r.itcAvailable ?? '—' },
            { id: 'rev', label: 'ITC reversed', value: '₹0' },
          ],
        },
        {
          id: '6',
          title: '6.1 Payment of tax',
          rows: [
            { id: 'igst', label: 'IGST', value: r.igst },
            { id: 'cgst', label: 'CGST', value: r.cgst },
            { id: 'sgst', label: 'SGST', value: r.sgst },
            {
              id: 'net',
              label: 'Net tax liability',
              value: r.netLiability ?? '—',
              emphasis: 'total',
            },
          ],
        },
      ],
      footerNote: 'Illustrative GSTR-3B preview for demo.',
    },
    'GSTR-2B': {
      formTitle: 'GSTR-2B',
      formSubtitle: `Auto-drafted ITC statement · ${r.periodLabel}`,
      headerLines: commonHeader,
      sections: [
        {
          id: 'itc',
          title: 'ITC summary',
          rows: [
            { id: 'tv', label: 'Inward taxable value (as per 2B)', value: r.taxableValue },
            { id: 'igst', label: 'IGST', value: r.igst },
            { id: 'cgst', label: 'CGST', value: r.cgst },
            { id: 'sgst', label: 'SGST', value: r.sgst },
            {
              id: 'avail',
              label: 'ITC available',
              value: r.itcAvailable ?? '—',
              emphasis: 'total',
            },
          ],
        },
      ],
      footerNote: 'GSTR-2B is system-generated; preview is illustrative.',
    },
    'GSTR-9': {
      formTitle: 'GSTR-9',
      formSubtitle: `Annual return · ${r.periodLabel}`,
      headerLines: commonHeader,
      sections: [
        {
          id: 'annual',
          title: 'Annual turnover & tax',
          rows: [
            { id: 'to', label: 'Total taxable turnover', value: r.taxableValue },
            { id: 'igst', label: 'IGST', value: r.igst },
            { id: 'cgst', label: 'CGST', value: r.cgst },
            { id: 'sgst', label: 'SGST', value: r.sgst },
            { id: 'itc', label: 'ITC availed (annual)', value: r.itcAvailable ?? '—' },
            {
              id: 'net',
              label: 'Net tax paid / payable',
              value: r.netLiability ?? '—',
              emphasis: 'total',
            },
          ],
        },
      ],
      footerNote: 'Illustrative GSTR-9 annual summary.',
    },
    IFF: {
      formTitle: 'IFF',
      formSubtitle: `Invoice Furnishing Facility · ${r.periodLabel}`,
      headerLines: commonHeader,
      sections: [
        {
          id: 'iff',
          title: 'B2B invoices furnished',
          rows: [
            { id: 'tv', label: 'Taxable value', value: r.taxableValue },
            { id: 'tax', label: 'Tax (IGST/CGST/SGST)', value: taxTotal, emphasis: 'total' },
          ],
        },
      ],
    },
  };

  return byType[r.returnType];
}

function approxSplit(amount: string, ratio: number): string {
  const n = Number(String(amount).replace(/[₹,\s]/g, ''));
  if (!Number.isFinite(n)) return amount;
  return `₹${Math.round(n * ratio).toLocaleString('en-IN')}`;
}

export function withGstPreview(
  r: Omit<GstReturn, 'preview'>,
  legalName: string,
  gstin: string,
): GstReturn {
  return { ...r, preview: gstPreview(r, legalName, gstin) };
}

function tdsPreview(
  r: Omit<TdsReturn, 'preview'>,
  legalName: string,
  tan: string,
  pan: string,
): ReturnPreviewDoc {
  const header = [
    { label: 'Deductor / collector', value: legalName },
    { label: 'TAN', value: tan },
    { label: 'PAN', value: pan },
    { label: 'Period', value: r.periodLabel },
    { label: 'Nature', value: r.nature },
    { label: 'Status', value: r.status.toUpperCase() },
  ];
  if (r.acknowledgement) header.push({ label: 'Acknowledgement', value: r.acknowledgement });
  if (r.filedAt) header.push({ label: 'Filed on', value: r.filedAt });

  if (r.returnType === 'Form 16A' || r.returnType === 'Form 16') {
    return {
      formTitle: r.returnType,
      formSubtitle: `TDS certificate · ${r.periodLabel}`,
      headerLines: header,
      sections: [
        {
          id: 'cert',
          title: 'Certificate particulars',
          rows: [
            { id: 'ded', label: 'No. of deductees / certificates', value: String(r.deductees) },
            { id: 'taxable', label: 'Total amount paid / credited', value: r.taxableAmount },
            { id: 'tds', label: 'Total tax deducted', value: r.tdsAmount, emphasis: 'total' },
          ],
        },
      ],
      footerNote: 'Illustrative TDS certificate summary for demo.',
    };
  }

  const formLabels: Record<TdsReturnType, string> = {
    'Form 26Q': 'Form 26Q — TDS on payments other than salary',
    'Form 24Q': 'Form 24Q — TDS on salaries',
    'Form 27Q': 'Form 27Q — TDS on payments to non-residents',
    'Form 27EQ': 'Form 27EQ — TCS statement',
    'Form 16': 'Form 16',
    'Form 16A': 'Form 16A',
  };

  return {
    formTitle: r.returnType,
    formSubtitle: `${formLabels[r.returnType]} · ${r.periodLabel}`,
    headerLines: header,
    sections: [
      {
        id: 'summary',
        title: 'Statement summary',
        rows: [
          { id: 'ded', label: 'No. of deductees / collectees', value: String(r.deductees) },
          { id: 'taxable', label: 'Total amount paid / credited', value: r.taxableAmount },
          { id: 'tds', label: `${r.nature} amount`, value: r.tdsAmount },
          { id: 'challan', label: 'Challan / deposit', value: r.challanPaid ?? '—' },
          {
            id: 'fee',
            label: 'Interest / late fee',
            value: r.interestLateFee ?? '—',
          },
          {
            id: 'bal',
            label: 'Balance payable (approx.)',
            value: balanceHint(r.tdsAmount, r.challanPaid),
            emphasis: 'total',
          },
        ],
      },
    ],
    footerNote: 'Illustrative TRACES statement preview for demo.',
  };
}

function balanceHint(tds: string, challan?: string): string {
  if (!challan) return tds;
  const a = Number(String(tds).replace(/[₹,\s]/g, ''));
  const b = Number(String(challan).replace(/[₹,\s]/g, ''));
  if (!Number.isFinite(a) || !Number.isFinite(b)) return '—';
  const d = a - b;
  if (d <= 0) return '₹0';
  return `₹${d.toLocaleString('en-IN')}`;
}

export function withTdsPreview(
  r: Omit<TdsReturn, 'preview'>,
  legalName: string,
  tan: string,
  pan: string,
): TdsReturn {
  return { ...r, preview: tdsPreview(r, legalName, tan, pan) };
}
