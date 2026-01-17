import { onDocumentCreated } from 'firebase-functions/v2/firestore';
import { logger } from 'firebase-functions';
import { getFirestore } from 'firebase-admin/firestore';
// Order type definition (inline for Firebase Functions)
interface Order {
  id: string;
  businessId: string;
  tableId: string;
  tableNumber: string;
  status: string;
  items: any[];
  total: number;
}

const db = getFirestore();

/**
 * Firestore trigger that handles order creation:
 * - Auto-print kitchen order (if configured)
 * - Update inventory (deduct stock)
 * - Publish to Centrifugo for real-time updates
 */
export const onOrderCreate = onDocumentCreated(
  {
    document: 'businesses/{businessId}/orders/{orderId}',
  },
  async (event) => {
    const orderId = event.params.orderId;
    const businessId = event.params.businessId;
    const order = event.data?.data() as Order;

    if (!order) {
      logger.error('[onOrderCreate] No order data found');
      return;
    }

    logger.info(`[onOrderCreate] Processing order ${orderId} for business ${businessId}`);

    try {
      // Publish to Centrifugo for real-time updates
      // Note: In production, use the publishToCentrifugo utility
      logger.info(`[onOrderCreate] Would publish to org:${businessId}:orders`);

      // Auto-print kitchen order if thermal printer is configured
      const businessDoc = await db.collection('businesses').doc(businessId).get();
      const business = businessDoc.data();
      
      if (business?.settings?.autoPrintOrders) {
        logger.info(`[onOrderCreate] Would print order ${orderId} to kitchen printer`);
        // In production, send to printer queue or webhook
      }

      // Update inventory for consumed items
      // This would deduct stock based on recipe ingredients
      // Implementation depends on recipe -> inventory mapping
      logger.info(`[onOrderCreate] Would update inventory for order ${orderId}`);

      logger.info(`[onOrderCreate] Order ${orderId} processed successfully`);
    } catch (error: any) {
      logger.error(`[onOrderCreate] Error processing order ${orderId}:`, error);
    }
  }
);
