import type { FilingStatus } from './dashboard';

export interface PropertyAsset {
  id: string;
  clientId: string;
  name: string;
  type: 'Residential' | 'Commercial' | 'Agricultural' | 'Industrial' | 'Land';
  ownershipType: 'Owned' | 'Co-owned' | 'Leased';
  address: string;
  state: string;
  areaSqft?: number;
  registrationNo: string;
  purchaseDate: string;
  purchaseValueInr: number;
  currentValueInr: number;
}

export interface StockHolding {
  id: string;
  clientId: string;
  brokerName: string;
  symbol: string;
  companyName: string;
  exchange: 'NSE' | 'BSE';
  holdingType: 'Equity' | 'Mutual Fund' | 'ETF';
  quantity: number;
  avgBuyPriceInr: number;
  currentPriceInr: number;
}

export interface StockLedgerEntry {
  id: string;
  clientId: string;
  date: string;
  symbol: string;
  companyName: string;
  txnType: 'Buy' | 'Sell' | 'Dividend' | 'Bonus';
  quantity: number;
  priceInr: number;
  amountInr: number;
  brokerName: string;
}

/** Unified compliance item for both property and stock-market domains. */
export interface InvestmentComplianceItem {
  id: string;
  clientId: string;
  domain: 'Property' | 'Stocks';
  assetLabel: string;
  name: string;
  authority: string;
  dueDate: string;
  periodLabel?: string;
  status: FilingStatus;
  notes?: string;
}
