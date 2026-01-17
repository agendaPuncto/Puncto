import { onDocumentUpdated } from 'firebase-functions/v2/firestore';
import { logger } from 'firebase-functions';
import { getFirestore } from 'firebase-admin/firestore';
// Order type definition (inline for Firebase Functions)
interface Order {
  id: string;
  businessId: string;
  customerId?: string;
  status: string;
  total: number;
}

const db = getFirestore();

/**
 * Firestore trigger that handles order payment:
 * - Generate NFC-e tax invoice
 * - Award loyalty points
 * - Update customer lifetime value
 */
export const onOrderPaid = onDocumentUpdated(
  {
    document: 'businesses/{businessId}/orders/{orderId}',
  },
  async (event) => {
    const orderId = event.params.orderId;
    const businessId = event.params.businessId;
    const before = event.data?.before.data() as Order;
    const after = event.data?.after.data() as Order;

    // Only process if status changed to 'paid'
    if (before?.status === 'paid' || after?.status !== 'paid') {
      return;
    }

    logger.info(`[onOrderPaid] Processing paid order ${orderId} for business ${businessId}`);

    try {
      // Generate NFC-e
      const businessDoc = await db.collection('businesses').doc(businessId).get();
      const business = businessDoc.data();

      if (business?.settings?.autoGenerateNFCe) {
        logger.info(`[onOrderPaid] Would generate NFC-e for order ${orderId}`);
        // In production, call /api/tax/nfce/generate
      }

      // Award loyalty points
      if (after.customerId) {
        logger.info(`[onOrderPaid] Would award loyalty points to customer ${after.customerId}`);
        // In production, call /api/loyalty/points
      }

      // Update customer total spent
      if (after.customerId) {
        const customerRef = db
          .collection('businesses')
          .doc(businessId)
          .collection('customers')
          .doc(after.customerId);

        const customerDoc = await customerRef.get();
        if (customerDoc.exists) {
          const currentTotal = customerDoc.data()?.totalSpent || 0;
          await customerRef.update({
            totalSpent: currentTotal + after.total,
            lastBookingAt: new Date(),
            updatedAt: new Date(),
          });
        }
      }

      logger.info(`[onOrderPaid] Order ${orderId} processed successfully`);
    } catch (error: any) {
      logger.error(`[onOrderPaid] Error processing order ${orderId}:`, error);
    }
  }
);
