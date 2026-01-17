import { stripe } from './client';
import type { CancellationPolicy } from '@/types/business';

export interface RefundCalculation {
  refundAmount: number; // Amount in cents
  refundPercent: number;
  reason: string;
}

/**
 * Calculate refund amount based on cancellation policy
 */
export function calculateRefund(
  paidAmount: number, // Amount paid in cents
  cancellationPolicy: CancellationPolicy,
  hoursUntilService: number
): RefundCalculation {
  if (!cancellationPolicy.enabled) {
    return {
      refundAmount: paidAmount,
      refundPercent: 100,
      reason: 'No cancellation policy - full refund',
    };
  }

  // Check if within no-refund window
  if (cancellationPolicy.noRefundHours && hoursUntilService < cancellationPolicy.noRefundHours) {
    return {
      refundAmount: 0,
      refundPercent: 0,
      reason: `Cancelled within ${cancellationPolicy.noRefundHours} hours - no refund`,
    };
  }

  // Check if eligible for full refund
  if (cancellationPolicy.fullRefundHours && hoursUntilService >= cancellationPolicy.fullRefundHours) {
    return {
      refundAmount: paidAmount,
      refundPercent: 100,
      reason: `Cancelled ${hoursUntilService} hours before service - full refund`,
    };
  }

  // Calculate partial refund based on policy
  const refundPercent = cancellationPolicy.refundPercent || 0;
  const refundAmount = Math.round((paidAmount * refundPercent) / 100);

  return {
    refundAmount,
    refundPercent,
    reason: `Partial refund: ${refundPercent}% according to cancellation policy`,
  };
}

/**
 * Process refund via Stripe
 */
export async function processRefund(
  paymentIntentId: string,
  amount?: number, // Amount in cents, if undefined refunds full amount
  reason?: 'duplicate' | 'fraudulent' | 'requested_by_customer'
) {
  const refundParams: any = {
    payment_intent: paymentIntentId,
  };

  if (amount !== undefined) {
    refundParams.amount = amount;
  }

  if (reason) {
    refundParams.reason = reason;
  }

  return await stripe.refunds.create(refundParams);
}
