import { stripe } from './client';

export interface CreateSubscriptionParams {
  customerId: string;
  priceId: string;
  metadata?: Record<string, string>;
  trialPeriodDays?: number;
}

/**
 * Create a subscription for a customer
 */
export async function createSubscription(params: CreateSubscriptionParams) {
  const subscriptionParams: any = {
    customer: params.customerId,
    items: [{ price: params.priceId }],
    metadata: params.metadata || {},
    expand: ['latest_invoice.payment_intent'],
  };

  if (params.trialPeriodDays) {
    subscriptionParams.trial_period_days = params.trialPeriodDays;
  }

  return await stripe.subscriptions.create(subscriptionParams);
}

/**
 * Create or retrieve a Stripe customer
 */
export async function getOrCreateCustomer(params: {
  email: string;
  name?: string;
  metadata?: Record<string, string>;
}) {
  // Try to find existing customer by email
  const customers = await stripe.customers.list({
    email: params.email,
    limit: 1,
  });

  if (customers.data.length > 0) {
    return customers.data[0];
  }

  // Create new customer
  return await stripe.customers.create({
    email: params.email,
    name: params.name,
    metadata: params.metadata || {},
  });
}

/**
 * Create a checkout session for subscription
 */
export async function createSubscriptionCheckout(params: {
  customerId?: string;
  customerEmail?: string;
  priceId: string;
  successUrl: string;
  cancelUrl: string;
  metadata?: Record<string, string>;
}) {
  const sessionParams: any = {
    mode: 'subscription',
    line_items: [
      {
        price: params.priceId,
        quantity: 1,
      },
    ],
    success_url: params.successUrl,
    cancel_url: params.cancelUrl,
    metadata: params.metadata || {},
  };

  if (params.customerId) {
    sessionParams.customer = params.customerId;
  } else if (params.customerEmail) {
    sessionParams.customer_email = params.customerEmail;
  }

  return await stripe.checkout.sessions.create(sessionParams);
}

/**
 * Create a customer portal session
 */
export async function createCustomerPortalSession(
  customerId: string,
  returnUrl: string
) {
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  });

  return session;
}

/**
 * Cancel a subscription
 */
export async function cancelSubscription(
  subscriptionId: string,
  immediately: boolean = false
) {
  if (immediately) {
    return await stripe.subscriptions.cancel(subscriptionId);
  } else {
    // Cancel at period end
    return await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: true,
    });
  }
}
