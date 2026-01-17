import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebaseAdmin';
import { ClockIn, ClockInType } from '@/types/timeClock';

// POST - Clock in/out
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { businessId, userId, type, location, deviceId, ipAddress, notes } = body;

    if (!businessId || !userId || !type) {
      return NextResponse.json(
        { error: 'businessId, userId, and type are required' },
        { status: 400 }
      );
    }

    const validTypes: ClockInType[] = ['in', 'out', 'break_start', 'break_end'];
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { error: 'Invalid clock type' },
        { status: 400 }
      );
    }

    const clockInsRef = db.collection('businesses').doc(businessId).collection('clockIns');
    const now = new Date();

    const clockInData: Omit<ClockIn, 'id'> = {
      businessId,
      userId,
      type,
      timestamp: now,
      location: location
        ? {
            lat: location.lat,
            lng: location.lng,
          }
        : undefined,
      deviceId,
      ipAddress,
      validated: false, // Requires manager approval
      notes,
      createdAt: now,
    };

    const docRef = await clockInsRef.add(clockInData);

    // TODO: Auto-create or update shift if needed

    return NextResponse.json({
      id: docRef.id,
      ...clockInData,
    });
  } catch (error) {
    console.error('[time-clock clock POST] Error:', error);
    return NextResponse.json(
      { error: 'Failed to clock in/out' },
      { status: 500 }
    );
  }
}
