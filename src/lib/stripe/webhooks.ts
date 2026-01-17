import { NextRequest } from 'next/server';
import { stripe } from './client';
import Stripe from 'stripe';

export async function verifyWebhookSignature(
  request: NextRequest,
  body: string
): Promise<Stripe.Event> {
  const signature = request.headers.get('stripe-signature');
  
  if (!signature) {
    throw new Error('Missing stripe-signature header');
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    throw new Error('STRIPE_WEBHOOK_SECRET is not set');
  }

  try {
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      webhookSecret
    );
    return event;
  } catch (err) {
    const error = err as Error;
    throw new Error(`Webhook signature verification failed: ${error.message}`);
  }
}

export type StripeWebhookEvent = Stripe.Event;
