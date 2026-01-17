import { NextRequest, NextResponse } from 'next/server';
import { withApiAuth } from '@/lib/api/middleware';
import { db } from '@/lib/firebaseAdmin';

// GET /api/v1/bookings - List bookings
async function handleGet(request: NextRequest, context: { apiKey: any; businessId: string }) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');
  const limit = parseInt(searchParams.get('limit') || '50');
  const offset = parseInt(searchParams.get('offset') || '0');

  try {
    let query = db
      .collection('businesses')
      .doc(context.businessId)
      .collection('bookings')
      .orderBy('scheduledDateTime', 'desc');

    if (status) {
      query = query.where('status', '==', status) as any;
    }

    if (startDate) {
      query = query.where('scheduledDateTime', '>=', new Date(startDate)) as any;
    }

    if (endDate) {
      query = query.where('scheduledDateTime', '<=', new Date(endDate)) as any;
    }

    const snapshot = await query.limit(limit).offset(offset).get();

    const bookings = snapshot.docs.map((doc) => {
      const data = doc.data();
      const scheduledDateTime = data.scheduledDateTime?.toDate
        ? data.scheduledDateTime.toDate()
        : data.scheduledDateTime;

      return {
        id: doc.id,
        ...data,
        scheduledDateTime: scheduledDateTime?.toISOString(),
        createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt,
        updatedAt: data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt,
      };
    });

    return NextResponse.json({
      data: bookings,
      pagination: {
        limit,
        offset,
        total: bookings.length,
      },
    });
  } catch (error: any) {
    console.error('[v1/bookings GET] Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bookings', message: error.message },
      { status: 500 }
    );
  }
}

// POST /api/v1/bookings - Create booking
async function handlePost(request: NextRequest, context: { apiKey: any; businessId: string }) {
  try {
    const body = await request.json();
    const { serviceId, professionalId, customerData, scheduledDateTime, notes } = body;

    if (!serviceId || !scheduledDateTime || !customerData) {
      return NextResponse.json(
        { error: 'serviceId, scheduledDateTime, and customerData are required' },
        { status: 400 }
      );
    }

    // Validate service exists
    const serviceDoc = await db
      .collection('businesses')
      .doc(context.businessId)
      .collection('services')
      .doc(serviceId)
      .get();

    if (!serviceDoc.exists) {
      return NextResponse.json(
        { error: 'Service not found' },
        { status: 404 }
      );
    }

    const service = serviceDoc.data()!;

    // Create booking
    const bookingRef = db
      .collection('businesses')
      .doc(context.businessId)
      .collection('bookings')
      .doc();

    const scheduledDate = new Date(scheduledDateTime);

    const booking = {
      businessId: context.businessId,
      serviceId,
      serviceName: service.name,
      professionalId: professionalId || null,
      professionalName: null, // Will be populated by trigger
      customerData,
      scheduledDateTime: scheduledDate,
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

    return NextResponse.json(
      {
        id: createdDoc.id,
        ...data,
        scheduledDateTime: data.scheduledDateTime?.toDate?.()?.toISOString() || data.scheduledDateTime,
        createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt,
        updatedAt: data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('[v1/bookings POST] Error:', error);
    return NextResponse.json(
      { error: 'Failed to create booking', message: error.message },
      { status: 500 }
    );
  }
}

// Export with authentication middleware
export const GET = withApiAuth(handleGet);
export const POST = withApiAuth(handlePost);
