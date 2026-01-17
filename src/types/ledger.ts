import { Timestamp } from 'firebase/firestore';

export type LedgerAccount = 
  | 'revenue' 
  | 'expenses' 
  | 'accounts_receivable' 
  | 'accounts_payable' 
  | 'cash' 
  | 'bank' 
  | 'commission_expense'
  | 'refunds'
  | 'other';

export type EntryType = 'debit' | 'credit';

export interface LedgerEntry {
  id: string;
  businessId: string;
  date: Timestamp | Date;
  account: LedgerAccount;
  type: EntryType;
  amount: number; // Amount in cents
  currency: string;
  description: string;
  referenceType?: 'payment' | 'refund' | 'commission' | 'expense' | 'manual';
  referenceId?: string; // Link to payment, refund, commission, etc.
  balance?: number; // Running balance for this account
  metadata?: Record<string, any>;
  createdAt: Timestamp | Date;
  createdBy?: string;
}

export interface ReconciliationMatch {
  id: string;
  businessId: string;
  bankTransactionId: string;
  ledgerEntryId: string;
  matchedAt: Timestamp | Date;
  matchedBy: string;
  notes?: string;
}
