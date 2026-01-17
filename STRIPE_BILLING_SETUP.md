# Stripe Billing Setup Guide

This guide walks you through setting up subscription products and prices in Stripe Dashboard for Puncto's SaaS billing system.

## Subscription Plans Overview

Based on your README, you have these subscription tiers:

| Plan | Price (BRL/month) | Stripe Price ID Variable |
|------|-------------------|--------------------------|
| **Starter** | R$ 99 | `STRIPE_PRICE_ID_STARTER` |
| **Growth** | R$ 249 | `STRIPE_PRICE_ID_GROWTH` |
| **Pro** | R$ 499 | `STRIPE_PRICE_ID_PRO` |
| **Enterprise** | Custom | Handled separately |

---

## Step-by-Step: Creating Products in Stripe Dashboard

### Step 1: Access Stripe Dashboard

1. Go to https://dashboard.stripe.com
2. Make sure you're in **Test Mode** (toggle in top right) for development
3. Navigate to **Products** → **Add product**

### Step 2: Create Starter Plan Product

1. **Product name:** `Puncto Starter`
2. **Description:** `Starter plan for Puncto - Basic features`
3. **Pricing:**
   - **Price:** `R$ 99.00`
   - **Billing period:** `Monthly` (recurring)
   - **Currency:** `BRL`
4. Click **"Save product"**

5. **Copy the Price ID:**
   - After creating, you'll see the price ID (starts with `price_`)
   - Example: `price_1234567890abcdef`
   - **Copy this ID** - you'll need it for `STRIPE_PRICE_ID_STARTER`

### Step 3: Create Growth Plan Product

1. **Product name:** `Puncto Growth`
2. **Description:** `Growth plan for Puncto - Advanced features`
3. **Pricing:**
   - **Price:** `R$ 249.00`
   - **Billing period:** `Monthly` (recurring)
   - **Currency:** `BRL`
4. Click **"Save product"**

5. **Copy the Price ID** for `STRIPE_PRICE_ID_GROWTH`

### Step 4: Create Pro Plan Product

1. **Product name:** `Puncto Pro`
2. **Description:** `Pro plan for Puncto - Professional features`
3. **Pricing:**
   - **Price:** `R$ 499.00`
   - **Billing period:** `Monthly` (recurring)
   - **Currency:** `BRL`
4. Click **"Save product"**

5. **Copy the Price ID** for `STRIPE_PRICE_ID_PRO`

### Step 5: Verify Your Products

You should now have 3 products, each with one recurring monthly price. Your Products page should look like:

```
Products:
- Puncto Starter (R$ 99.00/month) - price_xxxxx
- Puncto Growth (R$ 249.00/month) - price_xxxxx
- Puncto Pro (R$ 499.00/month) - price_xxxxx
```

---

## Step 6: Add Price IDs to Environment Variables

Add the price IDs to your `.env.local`:

```env
# Stripe Subscription Prices
STRIPE_PRICE_ID_STARTER=price_1234567890abcdef  # Replace with your Starter price ID
STRIPE_PRICE_ID_GROWTH=price_abcdef1234567890  # Replace with your Growth price ID
STRIPE_PRICE_ID_PRO=price_9876543210fedcba    # Replace with your Pro price ID
```

**Important:** 
- Use **test mode** price IDs for development (they start with `price_` but work with test API keys)
- When you go live, create **live mode** products/prices and update environment variables in production

---

## Important Notes

### 1. Recurring vs One-Time

Make sure your prices are set to **"Recurring"** with **"Monthly"** billing period. This is required for subscriptions.

### 2. Product vs Price

- **Product**: The item you're selling (e.g., "Puncto Starter")
- **Price**: The billing amount/interval (e.g., "R$ 99/month")

For each plan, you create:
- 1 **Product** (e.g., "Puncto Starter")
- 1 **Price** attached to that product (e.g., "R$ 99/month")

The **Price ID** (not Product ID) is what you use in code.

### 3. Finding Price IDs

To find a price ID:
1. Go to **Products** in Stripe Dashboard
2. Click on a product (e.g., "Puncto Starter")
3. Under "Pricing", you'll see the price ID next to the price
4. It looks like: `price_1A2B3C4D5E6F7G8H9I0J`

---

## Verification Checklist

After creating products and prices:

- [ ] Created 3 products (Starter, Growth, Pro)
- [ ] Each product has a monthly recurring price
- [ ] Prices are in BRL (Brazilian Real)
- [ ] Copied all 3 price IDs
- [ ] Added price IDs to `.env.local`
- [ ] Restarted your dev server after updating `.env.local`

---

## Testing Your Setup

### Test Subscription Checkout

You can test by calling the subscription checkout API:

```bash
curl -X POST http://localhost:3000/api/subscriptions/create-checkout \
  -H "Content-Type: application/json" \
  -d '{
    "businessId": "your-business-id",
    "priceId": "price_xxxxxxxxxxxxx",
    "customerEmail": "test@example.com",
    "successUrl": "http://localhost:3000/success",
    "cancelUrl": "http://localhost:3000/cancel"
  }'
```

Replace `price_xxxxxxxxxxxxx` with one of your actual price IDs.

### Expected Behavior

1. API returns a checkout session URL
2. Customer completes checkout in Stripe
3. Webhook `customer.subscription.created` is received
4. Business document is updated with subscription details
5. Subscription status becomes `active`

---

## Webhook Events You'll See

When you create products/prices, Stripe automatically sends webhook events:
- `product.created`
- `price.created`
- `product.updated`

These are **normal** and you can ignore them. Your webhook handlers will process:
- `customer.subscription.created`
- `customer.subscription.updated`
- `invoice.paid`
- etc.

---

## Troubleshooting

### "Price not found" error

- Check that the price ID exists in Stripe Dashboard
- Verify you're using the **Price ID** (starts with `price_`), not Product ID
- Make sure you're using test mode price IDs with test API keys

### Subscription not updating after checkout

- Check webhook endpoint is receiving `customer.subscription.created`
- Verify `businessId` is in checkout session metadata
- Check Firestore security rules allow business document updates

### Price ID environment variable not working

- Make sure `.env.local` is updated (not just `.env`)
- Restart your dev server after changing environment variables
- Verify no typos in variable names

---

## Quick Reference

### Price ID Format

```
Test Mode:  price_xxxxxxxxxxxxx
Live Mode:  price_yyyyyyyyyyyyy
```

### Environment Variables Template

```env
# Required for subscriptions
STRIPE_PRICE_ID_STARTER=price_xxxxx
STRIPE_PRICE_ID_GROWTH=price_xxxxx
STRIPE_PRICE_ID_PRO=price_xxxxx
```

### Code Mapping

The webhook handler maps price IDs to tiers:
- `STRIPE_PRICE_ID_STARTER` → `basic` tier
- `STRIPE_PRICE_ID_GROWTH` → `pro` tier  
- `STRIPE_PRICE_ID_PRO` → `enterprise` tier

---

## Next Steps

1. ✅ Create products in Stripe Dashboard
2. ✅ Copy price IDs to `.env.local`
3. ✅ Test subscription checkout
4. ✅ Monitor webhook events
5. ✅ Test subscription lifecycle (create, update, cancel)

For more information, see [Stripe Products & Prices Documentation](https://stripe.com/docs/billing/subscriptions/products-prices).
