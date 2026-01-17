import { onSchedule } from "firebase-functions/v2/scheduler";
import { logger } from "firebase-functions";
import { getFirestore, Timestamp } from "firebase-admin/firestore";

const db = getFirestore();

/**
 * Generate daily financial summary for all businesses
 * Runs daily at 23:00 (11 PM) UTC
 */
export const generateDailyFinancialSummary = onSchedule(
  {
    schedule: "0 23 * * *", // Daily at 11 PM UTC
    timeZone: "America/Sao_Paulo",
  },
  async () => {
    logger.info("[generateDailyFinancialSummary] Starting daily financial summary generation");

    try {
      // Get all active businesses
      const businessesRef = db.collection("businesses");
      const businessesSnapshot = await businessesRef
        .where("subscription.status", "in", ["active", "trial"])
        .get();

      if (businessesSnapshot.empty) {
        logger.info("[generateDailyFinancialSummary] No active businesses found");
        return;
      }

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const startOfDay = Timestamp.fromDate(today);
      const endOfDay = Timestamp.fromDate(tomorrow);

      for (const businessDoc of businessesSnapshot.docs) {
        const businessId = businessDoc.id;

        try {
          // Calculate daily revenue
          const paymentsRef = db
            .collection("businesses")
            .doc(businessId)
            .collection("payments");

          const paymentsSnapshot = await paymentsRef
            .where("status", "==", "succeeded")
            .where("succeededAt", ">=", startOfDay)
            .where("succeededAt", "<", endOfDay)
            .get();

          let revenue = 0;
          paymentsSnapshot.forEach((doc) => {
            const data = doc.data();
            revenue += data.amount || 0;
          });

          // Count bookings
          const bookingsRef = db
            .collection("businesses")
            .doc(businessId)
            .collection("bookings");

          const bookingsSnapshot = await bookingsRef
            .where("scheduledDateTime", ">=", startOfDay)
            .where("scheduledDateTime", "<", endOfDay)
            .get();

          const bookingsCount = bookingsSnapshot.size;

          // Create summary document
          const summaryData = {
            businessId,
            date: Timestamp.fromDate(today),
            revenue,
            bookingsCount,
            createdAt: Timestamp.now(),
          };

          const summariesRef = db
            .collection("businesses")
            .doc(businessId)
            .collection("dailySummaries");

          await summariesRef.add(summaryData);

          logger.info(`[generateDailyFinancialSummary] Created summary for business ${businessId}`);
        } catch (error) {
          logger.error(`[generateDailyFinancialSummary] Error processing business ${businessId}: ${error}`);
        }
      }

      logger.info("[generateDailyFinancialSummary] Completed daily financial summary generation");
    } catch (error) {
      logger.error(`[generateDailyFinancialSummary] Error: ${error}`);
    }
  }
);
