import { onDocumentCreated } from "firebase-functions/v2/firestore";
import { logger } from "firebase-functions";
import { getFirestore, Timestamp } from "firebase-admin/firestore";

const db = getFirestore();

/**
 * Process commission when a payment is completed
 */
export const processCommission = onDocumentCreated(
  {
    document: "businesses/{businessId}/payments/{paymentId}",
  },
  async (event) => {
    const paymentId = event.params.paymentId;
    const businessId = event.params.businessId;
    const payment = event.data?.data();

    if (!payment) {
      logger.error("[processCommission] No payment data found");
      return;
    }

    // Only process if payment succeeded
    if (payment.status !== "succeeded") {
      logger.info(`[processCommission] Payment ${paymentId} status is ${payment.status}, skipping commission`);
      return;
    }

    // Check if payment is linked to a booking
    if (!payment.bookingId) {
      logger.info(`[processCommission] Payment ${paymentId} not linked to booking, skipping commission`);
      return;
    }

    try {
      // Get booking to find professional
      const bookingRef = db
        .collection("businesses")
        .doc(businessId)
        .collection("bookings")
        .doc(payment.bookingId);

      const bookingDoc = await bookingRef.get();
      if (!bookingDoc.exists) {
        logger.error(`[processCommission] Booking ${payment.bookingId} not found`);
        return;
      }

      const booking = bookingDoc.data();
      if (!booking?.professionalId) {
        logger.info(`[processCommission] Booking ${payment.bookingId} has no professional, skipping commission`);
        return;
      }

      // Get professional to check commission rate
      const professionalRef = db
        .collection("businesses")
        .doc(businessId)
        .collection("professionals")
        .doc(booking.professionalId);

      const professionalDoc = await professionalRef.get();
      if (!professionalDoc.exists) {
        logger.error(`[processCommission] Professional ${booking.professionalId} not found`);
        return;
      }

      const professional = professionalDoc.data();
      const commissionPercent = professional?.commissionPercent || 0;

      if (commissionPercent <= 0) {
        logger.info(`[processCommission] Professional ${booking.professionalId} has no commission rate`);
        return;
      }

      // Calculate commission amount
      const commissionAmount = Math.round((payment.amount * commissionPercent) / 100);

      // Check if professional has Stripe Connect account
      if (!professional.stripeConnectAccountId) {
        logger.info(`[processCommission] Professional ${booking.professionalId} has no Stripe Connect account, commission will be processed manually`);
        // Create commission record but mark as pending
        const commissionData = {
          paymentId,
          bookingId: payment.bookingId,
          businessId,
          professionalId: booking.professionalId,
          professionalName: professional.name || "",
          amount: commissionAmount,
          percentage: commissionPercent,
          status: "pending",
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        };

        const commissionsRef = db
          .collection("businesses")
          .doc(businessId)
          .collection("commissions");

        await commissionsRef.add(commissionData);
        return;
      }

      // Create transfer via API (this would be called from the API route, not directly from function)
      // For now, create commission record that can be processed by API
      const commissionData = {
        paymentId,
        bookingId: payment.bookingId,
        businessId,
        professionalId: booking.professionalId,
        professionalName: professional.name || "",
        amount: commissionAmount,
        percentage: commissionPercent,
        stripeConnectAccountId: professional.stripeConnectAccountId,
        status: "pending",
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };

      const commissionsRef = db
        .collection("businesses")
        .doc(businessId)
        .collection("commissions");

      await commissionsRef.add(commissionData);

      logger.info(`[processCommission] Created commission record for professional ${booking.professionalId}, amount: ${commissionAmount}`);
    } catch (error) {
      logger.error(`[processCommission] Error processing commission: ${error}`);
    }
  }
);
