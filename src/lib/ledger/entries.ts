import { db } from '@/lib/firebaseAdmin';
import { Timestamp } from 'firebase-admin/firestore';
import type { LedgerEntry, LedgerAccount, EntryType } from '@/types/ledger';

/**
 * Create a ledger entry (single side - debit or credit)
 * For double-entry bookkeeping, call this twice with opposite types
 */
export async function createLedgerEntry(params: {
  businessId: string;
  account: LedgerAccount;
  type: EntryType;
  amount: number; // Amount in cents
  currency: string;
  description: string;
  referenceType?: LedgerEntry['referenceType'];
  referenceId?: string;
  date?: Date;
  metadata?: Record<string, any>;
  createdBy?: string;
}): Promise<string> {
  const entryData = {
    businessId: params.businessId,
    date: params.date ? Timestamp.fromDate(params.date) : Timestamp.now(),
    account: params.account,
    type: params.type,
    amount: params.amount,
    currency: params.currency,
    description: params.description,
    referenceType: params.referenceType,
    referenceId: params.referenceId,
    metadata: params.metadata,
    createdAt: Timestamp.now(),
    createdBy: params.createdBy,
  };

  const entriesRef = db
    .collection('businesses')
    .doc(params.businessId)
    .collection('ledgerEntries');

  const docRef = await entriesRef.add(entryData);
  return docRef.id;
}

/**
 * Create double-entry ledger entries
 * This ensures debits always equal credits
 */
export async function createDoubleEntry(params: {
  businessId: string;
  debitAccount: LedgerAccount;
  creditAccount: LedgerAccount;
  amount: number; // Amount in cents
  currency: string;
  description: string;
  referenceType?: LedgerEntry['referenceType'];
  referenceId?: string;
  date?: Date;
  metadata?: Record<string, any>;
  createdBy?: string;
}): Promise<{ debitId: string; creditId: string }> {
  // Create debit entry
  const debitId = await createLedgerEntry({
    businessId: params.businessId,
    account: params.debitAccount,
    type: 'debit',
    amount: params.amount,
    currency: params.currency,
    description: params.description,
    referenceType: params.referenceType,
    referenceId: params.referenceId,
    date: params.date,
    metadata: { ...params.metadata, counterpartEntry: 'credit' },
    createdBy: params.createdBy,
  });

  // Create credit entry
  const creditId = await createLedgerEntry({
    businessId: params.businessId,
    account: params.creditAccount,
    type: 'credit',
    amount: params.amount,
    currency: params.currency,
    description: params.description,
    referenceType: params.referenceType,
    referenceId: params.referenceId,
    date: params.date,
    metadata: { ...params.metadata, counterpartEntry: 'debit', counterpartEntryId: debitId },
    createdBy: params.createdBy,
  });

  return { debitId, creditId };
}

/**
 * Create ledger entries for a payment
 */
export async function createPaymentLedgerEntries(params: {
  businessId: string;
  paymentId: string;
  amount: number;
  currency: string;
  date?: Date;
}): Promise<{ debitId: string; creditId: string }> {
  return await createDoubleEntry({
    businessId: params.businessId,
    debitAccount: 'cash', // Cash/Stripe balance increases
    creditAccount: 'revenue', // Revenue increases
    amount: params.amount,
    currency: params.currency,
    description: `Payment received - Payment ID: ${params.paymentId}`,
    referenceType: 'payment',
    referenceId: params.paymentId,
    date: params.date,
  });
}

/**
 * Create ledger entries for a refund
 */
export async function createRefundLedgerEntries(params: {
  businessId: string;
  refundId: string;
  paymentId: string;
  amount: number;
  currency: string;
  date?: Date;
}): Promise<{ debitId: string; creditId: string }> {
  return await createDoubleEntry({
    businessId: params.businessId,
    debitAccount: 'refunds', // Refund expense
    creditAccount: 'cash', // Cash decreases
    amount: params.amount,
    currency: params.currency,
    description: `Refund issued - Refund ID: ${params.refundId}`,
    referenceType: 'refund',
    referenceId: params.refundId,
    date: params.date,
    metadata: { paymentId: params.paymentId },
  });
}

/**
 * Create ledger entries for a commission payment
 */
export async function createCommissionLedgerEntries(params: {
  businessId: string;
  commissionId: string;
  amount: number;
  currency: string;
  date?: Date;
}): Promise<{ debitId: string; creditId: string }> {
  return await createDoubleEntry({
    businessId: params.businessId,
    debitAccount: 'commission_expense', // Commission expense
    creditAccount: 'cash', // Cash decreases (transferred to professional)
    amount: params.amount,
    currency: params.currency,
    description: `Commission paid - Commission ID: ${params.commissionId}`,
    referenceType: 'commission',
    referenceId: params.commissionId,
    date: params.date,
  });
}

/**
 * Get account balance
 */
export async function getAccountBalance(
  businessId: string,
  account: LedgerAccount
): Promise<number> {
  const entriesRef = db
    .collection('businesses')
    .doc(businessId)
    .collection('ledgerEntries');

  // Note: In production, you'd want to use Firestore aggregation queries
  // For now, we'll calculate client-side (consider caching this)
  const snapshot = await entriesRef
    .where('account', '==', account)
    .get();

  let balance = 0;
  snapshot.forEach((doc) => {
    const data = doc.data();
    if (data.type === 'debit') {
      balance += data.amount || 0;
    } else {
      balance -= data.amount || 0;
    }
  });

  return balance;
}
