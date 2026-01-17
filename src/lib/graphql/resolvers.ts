import { db } from '@/lib/firebaseAdmin';

export const resolvers = {
  Query: {
    bookings: async (
      _: any,
      args: { status?: string; startDate?: string; endDate?: string; limit?: number; offset?: number },
      context: { businessId: string }
    ) => {
      const { status, startDate, endDate, limit = 50, offset = 0 } = args;

      let query = db
        .collection('businesses')
        .doc(context.businessId)
        .collection('bookings')
        .orderBy('scheduledDateTime', 'desc') as any;

      if (status) {
        query = query.where('status', '==', status);
      }

      if (startDate) {
        query = query.where('scheduledDateTime', '>=', new Date(startDate));
      }

      if (endDate) {
        query = query.where('scheduledDateTime', '<=', new Date(endDate));
      }

      const snapshot = await query.limit(limit).offset(offset).get();

      return snapshot.docs.map((doc: any) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          scheduledDateTime: data.scheduledDateTime?.toDate?.() || data.scheduledDateTime,
          createdAt: data.createdAt?.toDate?.() || data.createdAt,
          updatedAt: data.updatedAt?.toDate?.() || data.updatedAt,
        };
      });
    },

    booking: async (_: any, args: { id: string }, context: { businessId: string }) => {
      const doc = await db
        .collection('businesses')
        .doc(context.businessId)
        .collection('bookings')
        .doc(args.id)
        .get();

      if (!doc.exists) {
        return null;
      }

      const data = doc.data()!;
      return {
        id: doc.id,
        ...data,
        scheduledDateTime: data.scheduledDateTime?.toDate?.() || data.scheduledDateTime,
        createdAt: data.createdAt?.toDate?.() || data.createdAt,
        updatedAt: data.updatedAt?.toDate?.() || data.updatedAt,
      };
    },

    services: async (_: any, __: any, context: { businessId: string }) => {
      const snapshot = await db
        .collection('businesses')
        .doc(context.businessId)
        .collection('services')
        .where('active', '==', true)
        .orderBy('name', 'asc')
        .get();

      return snapshot.docs.map((doc: any) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate?.() || data.createdAt,
          updatedAt: data.updatedAt?.toDate?.() || data.updatedAt,
        };
      });
    },

    service: async (_: any, args: { id: string }, context: { businessId: string }) => {
      const doc = await db
        .collection('businesses')
        .doc(context.businessId)
        .collection('services')
        .doc(args.id)
        .get();

      if (!doc.exists) {
        return null;
      }

      const data = doc.data()!;
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.() || data.createdAt,
        updatedAt: data.updatedAt?.toDate?.() || data.updatedAt,
      };
    },

    professionals: async (_: any, __: any, context: { businessId: string }) => {
      const snapshot = await db
        .collection('businesses')
        .doc(context.businessId)
        .collection('professionals')
        .where('active', '==', true)
        .orderBy('name', 'asc')
        .get();

      return snapshot.docs.map((doc: any) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate?.() || data.createdAt,
          updatedAt: data.updatedAt?.toDate?.() || data.updatedAt,
        };
      });
    },

    professional: async (_: any, args: { id: string }, context: { businessId: string }) => {
      const doc = await db
        .collection('businesses')
        .doc(context.businessId)
        .collection('professionals')
        .doc(args.id)
        .get();

      if (!doc.exists) {
        return null;
      }

      const data = doc.data()!;
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.() || data.createdAt,
        updatedAt: data.updatedAt?.toDate?.() || data.updatedAt,
      };
    },
  },

  Mutation: {
    createBooking: async (_: any, args: { input: any }, context: { businessId: string }) => {
      const { serviceId, professionalId, customerData, scheduledDateTime, notes } = args.input;

      // Validate service exists
      const serviceDoc = await db
        .collection('businesses')
        .doc(context.businessId)
        .collection('services')
        .doc(serviceId)
        .get();

      if (!serviceDoc.exists) {
        throw new Error('Service not found');
      }

      const service = serviceDoc.data()!;

      // Create booking
      const bookingRef = db
        .collection('businesses')
        .doc(context.businessId)
        .collection('bookings')
        .doc();

      const booking = {
        businessId: context.businessId,
        serviceId,
        serviceName: service.name,
        professionalId: professionalId || null,
        professionalName: null,
        customerData,
        scheduledDateTime: new Date(scheduledDateTime),
        status: 'pending',
        price: service.price || 0,
        notes: notes || '',
        calendarEventSent: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await bookingRef.set(booking);

      const createdDoc = await bookingRef.get();
      const data = createdDoc.data()!;

      return {
        id: createdDoc.id,
        ...data,
        scheduledDateTime: data.scheduledDateTime?.toDate?.() || data.scheduledDateTime,
        createdAt: data.createdAt?.toDate?.() || data.createdAt,
        updatedAt: data.updatedAt?.toDate?.() || data.updatedAt,
      };
    },
  },
};
