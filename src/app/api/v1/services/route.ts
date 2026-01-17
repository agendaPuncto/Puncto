import { NextRequest, NextResponse } from 'next/server';
import { withApiAuth } from '@/lib/api/middleware';
import { db } from '@/lib/firebaseAdmin';

// GET /api/v1/services - List services
async function handleGet(request: NextRequest, context: { apiKey: any; businessId: string }) {
  try {
    const servicesSnapshot = await db
      .collection('businesses')
      .doc(context.businessId)
      .collection('services')
      .where('active', '==', true)
      .orderBy('name', 'asc')
      .get();

    const services = servicesSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || doc.data().createdAt,
      updatedAt: doc.data().updatedAt?.toDate?.()?.toISOString() || doc.data().updatedAt,
    }));

    return NextResponse.json({
      data: services,
    });
  } catch (error: any) {
    console.error('[v1/services GET] Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch services', message: error.message },
      { status: 500 }
    );
  }
}

export const GET = withApiAuth(handleGet);
