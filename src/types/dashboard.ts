/** Shared role for demo auth seam — swap for real auth later. */
export type UserRole = 'user' | 'admin' | 'professional';

export type FilingStatus =
  | 'compliant'
  | 'upcoming'
  | 'action_required'
  | 'overdue'
  | 'need_info'
  | 'filed'
  | 'in_review';

export type DocumentStatus = 'uploaded' | 'pending_review' | 'approved' | 'rejected' | 'expired';

export type ClaimStatus = 'eligible' | 'submitted' | 'under_review' | 'approved' | 'rejected' | 'paid';

export type TicketStatus = 'open' | 'in_progress' | 'waiting' | 'resolved' | 'closed';

export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';

export type PlanId = 'free' | 'pro' | 'managed';

export type StaffRole = 'super_admin' | 'ops_manager' | 'reviewer' | 'support' | 'viewer';

export interface BusinessEntity {
  id: string;
  name: string;
  shortName: string;
  entityType: string;
  gstin?: string;
  pan?: string;
  cin?: string;
  state: string;
  locations: number;
  industry: string;
  healthScore: number;
  healthLabel: string;
  planId: PlanId;
  protectionActive: boolean;
  radarActive: boolean;
  createdAt: string;
  /** Optional link to admin ClientSummary.id for trigger mapping */
  clientId?: string;
  /** Headcount used by employee / labour triggers */
  employees?: number;
  /** Aggregate annual turnover in INR for threshold triggers */
  annualTurnoverInr?: number;
  /** Active registrations / licences (GSTIN, FSSAI, EPF, …) */
  registrations?: string[];
  /** Business activity tags for industry matching */
  activities?: string[];
}

export interface Filing {
  id: string;
  entityId: string;
  entityName: string;
  name: string;
  shortName: string;
  department: string;
  category: string;
  dueDate: string;
  periodLabel: string;
  status: FilingStatus;
  protectionEligible: boolean;
  assignedProfessional?: string;
  /** FK to ProfessionalProfile.id */
  professionalId?: string;
  notes?: string;
}

export interface ComplianceDocument {
  id: string;
  entityId: string;
  entityName: string;
  name: string;
  category: string;
  fileType: string;
  sizeLabel: string;
  uploadedAt: string;
  status: DocumentStatus;
  uploadedBy: string;
  /** FK to ProfessionalProfile.id for review assignment */
  reviewerProfessionalId?: string;
}

export interface NotificationPreference {
  id: string;
  channel: 'whatsapp' | 'email' | 'sms' | 'in_app';
  label: string;
  description: string;
  enabled: boolean;
  events: { id: string; label: string; enabled: boolean }[];
}

export interface Invoice {
  id: string;
  date: string;
  amount: string;
  status: 'paid' | 'pending' | 'failed' | 'refunded';
  description: string;
  downloadUrl?: string;
}

export interface Subscription {
  planId: PlanId;
  planName: string;
  priceDisplay: string;
  period: string;
  entityCount: number;
  renewalDate: string;
  status: 'active' | 'trialing' | 'past_due' | 'cancelled';
  features: string[];
  invoices: Invoice[];
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'admin' | 'collaborator' | 'viewer' | 'ca' | 'cs' | 'advocate';
  avatarInitials: string;
  status: 'active' | 'invited' | 'disabled';
  lastActive?: string;
}

export interface ProtectionClaim {
  id: string;
  entityId: string;
  entityName: string;
  filingName: string;
  amountClaimed: string;
  submittedAt: string;
  status: ClaimStatus;
  reason: string;
  reviewedBy?: string;
}

export interface SupportTicket {
  id: string;
  subject: string;
  category: string;
  status: TicketStatus;
  priority: TicketPriority;
  createdAt: string;
  updatedAt: string;
  requesterName: string;
  requesterEmail: string;
  entityName?: string;
  assignee?: string;
}

/** Admin-side client rollup */
export interface ClientSummary {
  id: string;
  businessName: string;
  contactName: string;
  email: string;
  entityCount: number;
  planId: PlanId;
  healthScore: number;
  filingsDueThisWeek: number;
  protectionActive: boolean;
  state: string;
  joinedAt: string;
  status: 'active' | 'trial' | 'churned' | 'suspended';
}

export interface ProfessionalProfile {
  id: string;
  name: string;
  email: string;
  type: 'CA' | 'CS' | 'Advocate' | 'Internal';
  registrationNo?: string;
  activeAssignments: number;
  completedThisMonth: number;
  avgTurnaroundDays: number;
  status: 'available' | 'busy' | 'offline';
  specialties: string[];
}

export interface CatalogueServiceAdmin {
  id: string;
  name: string;
  shortName: string;
  category: string;
  department: string;
  price: string;
  governmentFees: string;
  status: 'active' | 'coming_soon' | 'deprecated';
  protectionEligible: boolean;
  filingsThisMonth: number;
}

export type BlogStatus = 'draft' | 'published' | 'archived';

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  status: 'active' | 'archived';
  updatedAt: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  author: string;
  categoryId: string;
  status: BlogStatus;
  tags: string[];
  publishedAt?: string;
  updatedAt: string;
}

export interface StaffUser {
  id: string;
  name: string;
  email: string;
  role: StaffRole;
  status: 'active' | 'invited' | 'disabled';
  lastActive?: string;
  permissions: string[];
}

export interface ChartPoint {
  label: string;
  value: number;
}

export interface NamedValue {
  name: string;
  value: number;
  color?: string;
}

/** Bookkeeping */
export type BankCode = 'HDFC' | 'ICICI' | 'AXIS' | 'SBI' | 'KOTAK' | 'YES';
export type ConnectionStatus = 'connected' | 'syncing' | 'action_required' | 'disconnected';
export type LedgerGroup =
  | 'Bank Accounts'
  | 'Cash-in-Hand'
  | 'Sundry Debtors'
  | 'Sundry Creditors'
  | 'Sales Accounts'
  | 'Purchase Accounts'
  | 'Direct Expenses'
  | 'Indirect Expenses'
  | 'Duties & Taxes';
export type VoucherType = 'Payment' | 'Receipt' | 'Sales' | 'Purchase' | 'Contra' | 'Journal';

export interface BankConnection {
  id: string;
  entityId: string;
  bankName: string;
  bankCode: BankCode;
  accountNumberMasked: string;
  accountType: 'Current' | 'Savings' | 'CC/OD';
  status: ConnectionStatus;
  lastSyncedAt?: string;
  balance: string;
}

export interface EmailConnection {
  id: string;
  provider: 'gmail' | 'outlook';
  email?: string;
  status: ConnectionStatus;
  lastSyncedAt?: string;
  invoicesFetched: number;
}

export interface StatementUpload {
  id: string;
  entityId: string;
  fileName: string;
  bankName?: string;
  uploadedAt: string;
  status: 'processing' | 'processed' | 'failed';
  transactionsFound: number;
  periodLabel: string;
}

export interface LedgerAccount {
  id: string;
  entityId: string;
  name: string;
  group: LedgerGroup;
  openingBalance: string;
  debit: string;
  credit: string;
  closingBalance: string;
}

export interface LedgerEntry {
  id: string;
  entityId: string;
  date: string;
  particulars: string;
  voucherType: VoucherType;
  ledgerName: string;
  debit: string;
  credit: string;
  source: 'Bank Feed' | 'Email' | 'Manual Upload';
}
