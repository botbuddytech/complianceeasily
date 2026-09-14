export type BooksVariant = 'client' | 'admin';

export interface TSideRow {
  id: string;
  label: string;
  amount?: string;
  ditto?: boolean;
  isTotal?: boolean;
}

export interface TAccount {
  id: string;
  entityId: string;
  /** Entity / assessee line above the account title */
  entityLabel: string;
  title: string;
  subtitle?: string;
  leftHeader: string;
  rightHeader: string;
  left: TSideRow[];
  right: TSideRow[];
  leftTotal: string;
  rightTotal: string;
}

export type ComputationRowKind = 'section' | 'line' | 'subtotal' | 'total' | 'spacer';

export interface ComputationRow {
  id: string;
  label: string;
  workingAmount?: string;
  finalAmount?: string;
  kind: ComputationRowKind;
}

export interface ComputationDoc {
  entityId: string;
  assesseeName: string;
  address?: string;
  pan?: string;
  dob?: string;
  fy: string;
  ay: string;
  incomeRows: ComputationRow[];
  taxRows: ComputationRow[];
}

export interface LedgerIndexEntry {
  no: number;
  ledgerId: string;
  name: string;
  source: string;
  closingBalance: string;
}

export interface EntityTBooks {
  profitAndLoss?: TAccount;
  capitalAccount?: TAccount;
  balanceSheet?: TAccount;
  computation?: ComputationDoc;
  ledgers: TAccount[];
  ledgerIndex: LedgerIndexEntry[];
}

/** Paper-style return / ITR preview */
export interface ReturnPreviewRow {
  id: string;
  label: string;
  value: string;
  emphasis?: 'header' | 'total';
}

export interface ReturnPreviewSection {
  id: string;
  title: string;
  rows: ReturnPreviewRow[];
}

export interface ReturnPreviewDoc {
  formTitle: string;
  formSubtitle?: string;
  headerLines: { label: string; value: string }[];
  sections: ReturnPreviewSection[];
  footerNote?: string;
}

/** GST */
export type GstReturnType = 'GSTR-1' | 'GSTR-3B' | 'GSTR-2B' | 'GSTR-9' | 'IFF';
export type GstReturnStatus = 'filed' | 'draft' | 'due' | 'overdue' | 'auto';

export interface GstReturn {
  id: string;
  entityId: string;
  returnType: GstReturnType;
  periodLabel: string;
  periodFrom: string;
  periodTo: string;
  dueDate: string;
  status: GstReturnStatus;
  taxableValue: string;
  igst: string;
  cgst: string;
  sgst: string;
  itcAvailable?: string;
  netLiability?: string;
  arn?: string;
  filedAt?: string;
  preview?: ReturnPreviewDoc;
}

export interface EntityGstBooks {
  entityId: string;
  gstin: string;
  legalName: string;
  state: string;
  registrationType: string;
  ledgers: TAccount[];
  ledgerIndex: LedgerIndexEntry[];
  returns: GstReturn[];
}

/** TDS / TCS */
export type TdsReturnType =
  | 'Form 26Q'
  | 'Form 24Q'
  | 'Form 27Q'
  | 'Form 27EQ'
  | 'Form 16'
  | 'Form 16A';
export type TdsReturnStatus = 'filed' | 'draft' | 'due' | 'overdue' | 'generated';

export interface TdsReturn {
  id: string;
  entityId: string;
  returnType: TdsReturnType;
  nature: 'TDS' | 'TCS';
  periodLabel: string;
  periodFrom: string;
  periodTo: string;
  dueDate: string;
  status: TdsReturnStatus;
  deductees: number;
  taxableAmount: string;
  tdsAmount: string;
  challanPaid?: string;
  interestLateFee?: string;
  acknowledgement?: string;
  filedAt?: string;
  preview?: ReturnPreviewDoc;
}

export interface EntityTdsBooks {
  entityId: string;
  tan: string;
  legalName: string;
  pan: string;
  ay: string;
  ledgers: TAccount[];
  ledgerIndex: LedgerIndexEntry[];
  returns: TdsReturn[];
}

/** ITR */
export type ItrFormType = 'ITR-1' | 'ITR-2' | 'ITR-3' | 'ITR-4' | 'ITR-5' | 'ITR-6' | 'ITR-7';
export type ItrReturnStatus = 'filed' | 'draft' | 'due' | 'overdue' | 'verified';

export interface ItrReturn {
  id: string;
  entityId: string;
  formType: ItrFormType;
  ay: string;
  fy: string;
  periodFrom: string;
  periodTo: string;
  status: ItrReturnStatus;
  dueDate: string;
  filedAt?: string;
  acknowledgement?: string;
  totalIncome: string;
  taxPayable: string;
  preview: ReturnPreviewDoc;
}

export interface EntityItrBooks {
  entityId: string;
  pan: string;
  legalName: string;
  returns: ItrReturn[];
}
