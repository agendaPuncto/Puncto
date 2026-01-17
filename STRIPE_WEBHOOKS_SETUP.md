# Stripe Webhooks Configuration Guide

This guide covers setting up Stripe webhooks for both local development and production environments.

## Table of Contents

1. [Local Development (Stripe CLI)](#local-development-stripe-cli)
2. [Production Setup](#production-setup)
3. [Webhook Events](#webhook-events)
4. [Testing Webhooks](#testing-webhooks)
5. [Troubleshooting](#troubleshooting)

---

## Local Development (Stripe CLI)

For local development, use the Stripe CLI to forward webhook events to your local server.

### Step 1: Install Stripe CLI

**macOS:**
```bash
brew install stripe/stripe-cli/stripe
```

**Windows:**

**Option 1: Direct Download (Recommended)**
1. Go to: https://github.com/stripe/stripe-cli/releases/latest
2. Download `stripe_X.X.X_windows_x86_64.zip` (or `stripe_X.X.X_windows_i386.zip` for 32-bit)
3. Extract the ZIP file
4. Copy `stripe.exe` to a folder in your PATH (e.g., `C:\Program Files\stripe-cli\`)
5. Add that folder to your system PATH:
   - Open "Environment Variables" (search in Windows Start)
   - Edit "Path" in System Variables
   - Add the folder path (e.g., `C:\Program Files\stripe-cli`)
   - Restart your terminal

**Option 2: Using Scoop (if you have Scoop installed)**
```bash
scoop bucket add stripe https://github.com/stripe/scoop-stripe-cli.git
scoop install stripe
```

**Linux:**
```bash
# Debian/Ubuntu
wget https://github.com/stripe/stripe-cli/releases/latest/download/stripe_*_linux_x86_64.tar.gz
tar -xvf stripe_*_linux_x86_64.tar.gz
sudo mv stripe /usr/local/bin
```

### Step 2: Login to Stripe CLI

```bash
stripe login
```

This will open your browser to authenticate with your Stripe account.

### Step 3: Forward Webhooks to Local Server

Start your Next.js development server:
```bash
npm run dev
```

In a **separate terminal**, forward webhook events:

```bash
# Payment webhooks
stripe listen --forward-to localhost:3000/api/payments/webhook

# Subscription webhooks (if using subscriptions)
stripe listen --forward-to localhost:3000/api/subscriptions/webhook
```

The CLI will display a webhook signing secret, for example:
```
> Ready! Your webhook signing secret is whsec_xxxxxxxxxxxxx
```

### Step 4: Update .env.local

Add the webhook secret to your `.env.local`:

```env
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
```

**Note:** This secret changes each time you run `stripe listen`. Update your `.env.local` accordingly.

### Step 5: Trigger Test Events

Use Stripe CLI to trigger test events:

```bash
# Test payment successful
stripe trigger payment_intent.succeeded

# Test checkout completed
stripe trigger checkout.session.completed

# Test subscription created
stripe trigger customer.subscription.created

# Test invoice paid
stripe trigger invoice.paid
```

---

## Production Setup

For production, configure webhooks in the Stripe Dashboard.

### Step 1: Access Stripe Dashboard

1. Go to https://dashboard.stripe.com
2. Make sure you're using the correct account (test vs live)
3. Navigate to **Developers** → **Webhooks**

### Step 2: Add Webhook Endpoints

Add **two separate webhook endpoints**:

#### Endpoint 1: Payment Webhooks

1. Click **"Add endpoint"**
2. **Endpoint URL:** `https://your-domain.com/api/payments/webhook`
   - Replace `your-domain.com` with your actual domain (e.g., `puncto.app`)
3. **Description:** "Puncto Payment Webhooks"
4. **Events to send:** Select these events:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `charge.refunded`

5. Click **"Add endpoint"**

#### Endpoint 2: Subscription Webhooks

1. Click **"Add endpoint"** again
2. **Endpoint URL:** `https://your-domain.com/api/subscriptions/webhook`
3. **Description:** "Puncto Subscription Webhooks"
4. **Events to send:** Select these events:
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.paid`
   - `invoice.payment_failed`

5. Click **"Add endpoint"**

### Step 3: Get Webhook Signing Secret

1. After creating the endpoint, click on it
2. Click **"Reveal"** next to **"Signing secret"**
3. Copy the secret (starts with `whsec_`)

### Step 4: Add to Production Environment Variables

Add the webhook secret to your production environment:

**Vercel:**
1. Go to your project → **Settings** → **Environment Variables**
2. Add `STRIPE_WEBHOOK_SECRET` with the value from Step 3

**Other platforms:**
Add the environment variable through your hosting provider's dashboard.

---

## Webhook Events

### Payment Events (`/api/payments/webhook`)

| Event | Description | Handler |
|-------|-------------|---------|
| `checkout.session.completed` | Customer completed checkout | Creates payment record, updates booking |
| `payment_intent.succeeded` | Payment succeeded | Updates payment status |
| `payment_intent.payment_failed` | Payment failed | Updates payment and booking status |
| `charge.refunded` | Refund processed | Creates refund record, updates payment |

### Subscription Events (`/api/subscriptions/webhook`)

| Event | Description | Handler |
|-------|-------------|---------|
| `customer.subscription.created` | New subscription created | Updates business subscription |
| `customer.subscription.updated` | Subscription modified | Updates business subscription |
| `customer.subscription.deleted` | Subscription cancelled | Marks subscription as cancelled |
| `invoice.paid` | Invoice payment succeeded | Updates subscription status |
| `invoice.payment_failed` | Invoice payment failed | Suspends subscription |

---

## Testing Webhooks

### Test Mode vs Live Mode

- **Test Mode:** Use test API keys and webhooks for development
- **Live Mode:** Use live API keys and webhooks for production

Make sure your environment variables match the mode you're testing in.

### Testing Checklist

#### Payment Webhooks

- [ ] Create a test checkout session
- [ ] Complete payment in Stripe test checkout
- [ ] Verify webhook received (`checkout.session.completed`)
- [ ] Check Firestore: payment document created
- [ ] Check Firestore: booking status updated to `confirmed`
- [ ] Test refund webhook (`charge.refunded`)

#### Subscription Webhooks

- [ ] Create test subscription checkout
- [ ] Complete subscription in Stripe test checkout
- [ ] Verify webhook received (`customer.subscription.created`)
- [ ] Check Firestore: business subscription fields updated
- [ ] Test subscription update webhook
- [ ] Test invoice paid webhook

### Manual Webhook Testing

In Stripe Dashboard → Webhooks → Select endpoint → **"Send test webhook"**

Choose an event and click **"Send test webhook"** to manually trigger it.

---

## Troubleshooting

### Webhook Not Received

1. **Check webhook URL is correct:**
   - Local: `http://localhost:3000/api/payments/webhook`
   - Production: `https://your-domain.com/api/payments/webhook`

2. **Verify webhook secret matches:**
   ```bash
   # Check your .env.local has the correct secret
   echo $STRIPE_WEBHOOK_SECRET
   ```

3. **Check server logs:**
   - Look for webhook errors in your Next.js console
   - Check Vercel function logs in production

4. **Verify endpoint is accessible:**
   ```bash
   # Test if endpoint is reachable (production)
   curl https://your-domain.com/api/payments/webhook
   ```

### Webhook Signature Verification Failed

This usually means:
- Wrong webhook secret in environment variables
- Webhook secret from wrong mode (test vs live)
- Request body was modified before verification

**Fix:**
1. Re-copy the webhook secret from Stripe Dashboard
2. Make sure you're using the secret from the correct environment (test/live)
3. Restart your development server after updating `.env.local`

### Payment Created But Booking Not Updated

Check:
1. Webhook handler logs for errors
2. Firestore security rules allow updates to bookings
3. `bookingId` is present in checkout session metadata

### Subscription Status Not Updating

Check:
1. `businessId` is in subscription metadata
2. Firestore security rules allow business document updates
3. Subscription webhook endpoint is receiving events

---

## Security Best Practices

1. **Always verify webhook signatures** - Our implementation does this automatically
2. **Use HTTPS in production** - Stripe requires HTTPS for webhook endpoints
3. **Keep webhook secrets secure** - Never commit secrets to git
4. **Use separate webhooks for test/live** - Different secrets for each mode
5. **Monitor webhook logs** - Set up alerts for failed webhook deliveries

---

## Quick Reference

### Local Development Commands

```bash
# Start dev server
npm run dev

# Forward payment webhooks (separate terminal)
stripe listen --forward-to localhost:3000/api/payments/webhook

# Forward subscription webhooks (separate terminal)
stripe listen --forward-to localhost:3000/api/subscriptions/webhook

# Trigger test event
stripe trigger checkout.session.completed
```

### Environment Variables Needed

```env
# Required
STRIPE_SECRET_KEY=sk_test_... (or sk_live_...)
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_... (or pk_live_...)

# Optional (for subscriptions)
STRIPE_PRICE_ID_STARTER=price_...
STRIPE_PRICE_ID_GROWTH=price_...
STRIPE_PRICE_ID_PRO=price_...

# Optional (for commission splits)
STRIPE_CONNECT_CLIENT_ID=ca_...
```

---

## Next Steps

After configuring webhooks:

1. ✅ Test payment flow end-to-end
2. ✅ Test subscription creation
3. ✅ Test refund processing
4. ✅ Monitor webhook logs in Stripe Dashboard
5. ✅ Set up webhook retry notifications if needed

For more information, see the [Stripe Webhooks Documentation](https://stripe.com/docs/webhooks).
