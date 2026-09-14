import type { LucideIcon } from 'lucide-react';
import {
  LayoutDashboard,
  Building2,
  Landmark,
  CalendarCheck,
  FolderOpen,
  Bell,
  CreditCard,
  Users,
  ShieldCheck,
  Settings,
  LifeBuoy,
  Building,
  ListTodo,
  UserCog,
  FileSearch,
  BookOpen,
  Shield,
  KeyRound,
  Zap,
  Briefcase,
  CalendarDays,
  IndianRupee,
  UserRound,
  Wallet,
} from 'lucide-react';

export type DashboardVariant = 'client' | 'admin' | 'professional';

export interface NavItem {
  label: string;
  to: string;
  icon: LucideIcon;
}

export const CLIENT_NAV: NavItem[] = [
  { label: 'Overview', to: '/dashboard/overview', icon: LayoutDashboard },
  { label: 'Entities', to: '/dashboard/entities', icon: Building2 },
  { label: 'Bookkeeping', to: '/dashboard/bookkeeping', icon: Landmark },
  { label: 'Filings', to: '/dashboard/filings', icon: CalendarCheck },
  { label: 'Documents', to: '/dashboard/documents', icon: FolderOpen },
  { label: 'Investments', to: '/dashboard/investments', icon: Wallet },
  { label: 'Notifications', to: '/dashboard/notifications', icon: Bell },
  { label: 'Billing', to: '/dashboard/billing', icon: CreditCard },
  { label: 'Team', to: '/dashboard/team', icon: Users },
  { label: 'Protection', to: '/dashboard/protection', icon: ShieldCheck },
  { label: 'Settings', to: '/dashboard/settings', icon: Settings },
  { label: 'Support', to: '/dashboard/support', icon: LifeBuoy },
];

export const ADMIN_NAV: NavItem[] = [
  { label: 'Overview', to: '/admin/overview', icon: LayoutDashboard },
  { label: 'Compliance Triggers', to: '/admin/compliance-triggers', icon: Zap },
  { label: 'Clients', to: '/admin/clients', icon: Building },
  { label: 'Filing Queue', to: '/admin/filing-queue', icon: ListTodo },
  { label: 'Professionals', to: '/admin/professionals', icon: UserCog },
  { label: 'Protection Claims', to: '/admin/protection-claims', icon: Shield },
  { label: 'Catalogue', to: '/admin/catalogue', icon: BookOpen },
  { label: 'Users & Roles', to: '/admin/users', icon: KeyRound },
  { label: 'Support', to: '/admin/support', icon: LifeBuoy },
];

export const PROFESSIONAL_NAV: NavItem[] = [
  { label: 'Overview', to: '/professional/overview', icon: LayoutDashboard },
  { label: 'My Queue', to: '/professional/queue', icon: ListTodo },
  { label: 'Document Review', to: '/professional/document-review', icon: FileSearch },
  { label: 'My Clients', to: '/professional/clients', icon: Briefcase },
  { label: 'Books of Accounts', to: '/professional/books', icon: Landmark },
  { label: 'Investments', to: '/professional/investments', icon: Wallet },
  { label: 'Compliance Triggers', to: '/professional/compliance-triggers', icon: Zap },
  { label: 'Calendar', to: '/professional/calendar', icon: CalendarDays },
  { label: 'Earnings', to: '/professional/earnings', icon: IndianRupee },
  { label: 'Profile', to: '/professional/profile', icon: UserRound },
  { label: 'Support', to: '/professional/support', icon: LifeBuoy },
];

export function navFor(variant: DashboardVariant): NavItem[] {
  if (variant === 'admin') return ADMIN_NAV;
  if (variant === 'professional') return PROFESSIONAL_NAV;
  return CLIENT_NAV;
}
