import { onDocumentCreated } from 'firebase-functions/v2/firestore';
import { logger } from 'firebase-functions';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';

const db = getFirestore();

/**
 * Firestore trigger that sends initial booking confirmation when a booking is created
 */
export const onBookingCreate = onDocumentCreated(
  {
    document: 'businesses/{businessId}/bookings/{bookingId}',
  },
  async (event) => {
    const bookingId = event.params.bookingId;
    const businessId = event.params.businessId;
    const booking = event.data?.data();

    if (!booking) {
      logger.error('[onBookingCreate] No booking data found');
      return;
    }

    logger.info(`[onBookingCreate] Processing booking ${bookingId} for business ${businessId}`);

    try {
      // Fetch business data
      const businessDoc = await db.collection('businesses').doc(businessId).get();
      if (!businessDoc.exists) {
        logger.error(`[onBookingCreate] Business ${businessId} not found`);
        return;
      }

      const business = businessDoc.data();

      // Check if business wants to send confirmations
      const channels = business?.settings?.confirmationChannels || ['email'];
      
      const customerName = `${booking.customerData?.firstName || ''} ${booking.customerData?.lastName || ''}`.trim();
      const scheduledDate = booking.scheduledDateTime.toDate();

      // Prepare confirmation data
      const confirmationData = {
        customerName,
        serviceName: booking.serviceName,
        professionalName: booking.professionalName,
        date: scheduledDate.toLocaleDateString('pt-BR'),
        time: scheduledDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        businessName: business?.displayName || '',
        businessPhone: business?.phone || '',
        businessAddress: business?.address
          ? `${business.address.street}, ${business.address.number} - ${business.address.city}`
          : '',
      };

      // Send via configured channels
      if (channels.includes('whatsapp') && booking.customerData?.phone) {
        // Send WhatsApp confirmation
        // Implementation would call WhatsApp API here
        logger.info(`[onBookingCreate] Would send WhatsApp to ${booking.customerData.phone}`);
      }

      if (channels.includes('email') && booking.customerData?.email) {
        // Send email confirmation
        // Implementation would call email API here
        logger.info(`[onBookingCreate] Would send email to ${booking.customerData.email}`);
      }

      // Mark calendar event as ready to send
      await event.data?.ref.update({
        calendarEventSent: false, // Client can download .ics file
        updatedAt: Timestamp.now(),
      });

      logger.info(`[onBookingCreate] Booking ${bookingId} processed successfully`);
    } catch (error: any) {
      logger.error(`[onBookingCreate] Error processing booking ${bookingId}:`, error);
    }
  }
);
