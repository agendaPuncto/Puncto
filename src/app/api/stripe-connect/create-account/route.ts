import { NextRequest, NextResponse } from 'next/server';
import { createConnectAccount, createAccountLink } from '@/lib/stripe/connect';
import { db } from '@/lib/firebaseAdmin';
import { Timestamp } from 'firebase-admin/firestore';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { businessId, professionalId, email, country = 'BR' } = body;

    if (!businessId || !professionalId || !email) {
      return NextResponse.json(
        { error: 'Missing required fields: businessId, professionalId, email' },
        { status: 400 }
      );
    }

    // Create Stripe Connect account
    const account = await createConnectAccount({
      email,
      country,
      type: 'express',
    });

    // Update professional with Connect account ID
    const professionalRef = db
      .collection('businesses')
      .doc(businessId)
      .collection('professionals')
      .doc(professionalId);

    await professionalRef.update({
      stripeConnectAccountId: account.id,
      updatedAt: Timestamp.now(),
    });

    // Create account link for onboarding
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const accountLink = await createAccountLink(
      account.id,
      `${baseUrl}/tenant/admin/professionals?onboarding=complete`,
      `${baseUrl}/tenant/admin/professionals?onboarding=refresh`
    );

    return NextResponse.json({
      accountId: account.id,
      onboardingUrl: accountLink.url,
    });
  } catch (error) {
    console.error('[create-connect-account] Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: `Failed to create Connect account: ${errorMessage}` },
      { status: 500 }
    );
  }
}
