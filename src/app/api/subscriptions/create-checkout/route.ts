import { NextRequest, NextResponse } from 'next/server';
import { createSubscriptionCheckout, getOrCreateCustomer } from '@/lib/stripe/subscriptions';
import { db } from '@/lib/firebaseAdmin';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      businessId,
      priceId,
      customerEmail,
      successUrl,
      cancelUrl,
      metadata = {},
    } = body;

    if (!businessId || !priceId || !successUrl || !cancelUrl) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get or create Stripe customer
    let customerId: string | undefined;
    if (customerEmail) {
      const customer = await getOrCreateCustomer({
        email: customerEmail,
        metadata: {
          ...metadata,
          businessId,
        },
      });
      customerId = customer.id;

      // Update business with customer ID
      const businessRef = db.collection('businesses').doc(businessId);
      await businessRef.update({
        'subscription.stripeCustomerId': customerId,
      });
    }

    // Create checkout session
    const session = await createSubscriptionCheckout({
      customerId,
      customerEmail,
      priceId,
      successUrl,
      cancelUrl,
      metadata: {
        ...metadata,
        businessId,
      },
    });

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
    });
  } catch (error) {
    console.error('[create-subscription-checkout] Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: `Failed to create subscription checkout: ${errorMessage}` },
      { status: 500 }
    );
  }
}
