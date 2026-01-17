import { NextRequest, NextResponse } from 'next/server';
import { createCustomerPortalSession } from '@/lib/stripe/subscriptions';
import { db } from '@/lib/firebaseAdmin';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { businessId, returnUrl } = body;

    if (!businessId || !returnUrl) {
      return NextResponse.json(
        { error: 'Missing required fields: businessId, returnUrl' },
        { status: 400 }
      );
    }

    // Get business to get Stripe customer ID
    const businessDoc = await db.collection('businesses').doc(businessId).get();
    if (!businessDoc.exists) {
      return NextResponse.json(
        { error: 'Business not found' },
        { status: 404 }
      );
    }

    const businessData = businessDoc.data();
    const customerId = businessData?.subscription?.stripeCustomerId;

    if (!customerId) {
      return NextResponse.json(
        { error: 'Business does not have a Stripe customer ID' },
        { status: 400 }
      );
    }

    // Create portal session
    const session = await createCustomerPortalSession(customerId, returnUrl);

    return NextResponse.json({
      url: session.url,
    });
  } catch (error) {
    console.error('[create-portal-session] Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: `Failed to create portal session: ${errorMessage}` },
      { status: 500 }
    );
  }
}
