export type ProfessionalBadge =
  | 'AI Assisted'
  | 'Professional Review Available'
  | 'CA Review'
  | 'CS Review'
  | 'Advocate Review'
  | 'CA Required'
  | 'CS Required'
  | 'CS Required where applicable'
  | 'CA / Advocate Review'
  | 'CA Verified'
  | 'AS / Ind AS Aligned';

export interface ComplianceService {
  id: string;
  name: string;
  shortName: string;
  category: string;
  department: string;
  description: string;
  frequency: string;
  entityTypes: string[];
  states?: string[];
  industry?: string[];
  price: string;
  governmentFees: string;
  status: 'active' | 'coming_soon';
  protectionEligible: boolean;
  professionalBadge: ProfessionalBadge;
  slug: string;
}

export interface ComplianceCategory {
  id: string;
  name: string;
  code: string;
  department: string;
  description: string;
  iconName: string;
  count: number;
}

export interface PenaltyItem {
  id: string;
  compliance: string;
  department: string;
  category: string;
  typicalDeadline: string;
  whatCanHappenIfMissed: string;
  penaltyType: string;
  lateFee: string;
  interest: string;
  financialPenalty: string;
  minimumPenalty?: string;
  maximumPenalty?: string;
  otherConsequences: string[];
  prosecutionPossible: boolean;
  licenceImpact: string;
  directorImpact: string;
  howComplianceEasilyHelps: string[];
  protectionEligibility: string;
  source: string;
  sourceUrl?: string;
  lastVerified: string;
  legalNotes: string;
  illustrativeAction: {
    statusText: string;
    actionLabel: string;
  };
}

export interface IndustryPack {
  id: string;
  name: string;
  badge: string;
  description: string;
  potentialCompliances: Array<{
    title: string;
    description: string;
    regulatoryBody: string;
    conditionalNote?: string;
  }>;
  ctaText: string;
}

export interface IndustryItem {
  id: string;
  name: string;
  category: string;
  subcategories: string[];
  iconName: string;
  packId?: string;
}

export interface StateComplianceData {
  code: string;
  name: string;
  isDetailed: boolean;
  capital?: string;
  localRegulators: string[];
  compliances: Array<{
    name: string;
    department: string;
    frequency: string;
    applicabilityNotes: string;
    mandatoryLevel: 'Mandatory' | 'Conditional' | 'Applicability Check Needed';
  }>;
}

export interface PricingPlan {
  id: string;
  name: string;
  price: number;
  priceDisplay: string;
  period: string;
  tagline: string;
  badge?: string;
  highlight?: boolean;
  features: string[];
  ctaText: string;
  note?: string;
}

export interface IndividualServicePrice {
  id: string;
  service: string;
  category: string;
  professionalFee: string;
  governmentFee: string;
  typicalFrequency: string;
  protection: boolean;
  action: string;
}

export interface FAQItem {
  question: string;
  answer: string;
  category?: string;
}

export interface BusinessProfileFormData {
  entityType: string;
  employees: string;
  turnover: string;
  locations: string;
  activity: string;
  state: string;
  existingRegistrations: string[];
  fullName: string;
  businessName: string;
  phone: string;
  email: string;
  agreedToWhatsApp: boolean;
}
