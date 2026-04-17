import { NextRequest, NextResponse } from 'next/server';
import { verifyWebhookSignature } from '@/lib/stripe/webhooks';
import { db } from '@/lib/firebaseAdmin';
import { recordTuitionInvoicePaymentForConnect } from '@/lib/server/tuitionInvoicePaymentRecord';
import { Timestamp } from 'firebase-admin/firestore';
import Stripe from 'stripe';

/**
 * Webhook para eventos Stripe enviados no contexto de contas conectadas (Connect).
 * Resolução do tenant: `event.account` → Firestore `businesses` onde `stripeConnectAccountId` coincide.
 *
 * Configure no Stripe Dashboard um endpoint que receba eventos de contas conectadas apontando para esta URL.
 * O body deve ser verificado com a assinatura (raw body) — use `request.text()` abaixo.
 */
export const dynamic = 'force-dynamic';

function stripUndefined<T extends Record<string, unknown>>(obj: T): Record<string, unknown> {
  return Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined)) as Record<string, unknown>;
}

/**
 * Busca o documento do negócio cujo `stripeConnectAccountId` é o ID da conta conectada.
 * Não exige índice composto no Firestore: igualdade em um único campo usa índice automático.
 */
async function findBusinessIdByConnectedAccount(connectedAccountId: string): Promise<string | null> {
  const snap = await db
    .collection('businesses')
    .where('stripeConnectAccountId', '==', connectedAccountId)
    .limit(1)
    .get();
  if (snap.empty) return null;
  return snap.docs[0].id;
}

function getStripeSubscriptionIdFromInvoice(invoice: Stripe.Invoice): string | null {
  const inv = invoice as Stripe.Invoice & { subscription?: string | Stripe.Subscription | null };
  const sub = inv.subscription;
  if (typeof sub === 'string') return sub;
  if (sub && typeof sub === 'object' && 'id' in sub) return (sub as Stripe.Subscription).id;
  return null;
}

/**
 * Atualiza o documento em `studentSubscriptions` pelo ID do Stripe (`sub_...`).
 * Compatível com docs criados com ID = subscription id ou legados com `stripeSubscriptionId` no body.
 */
async function patchStudentSubscription(
  businessId: string,
  stripeSubscriptionId: string,
  patch: Record<string, unknown>
): Promise<boolean> {
  const col = db.collection('businesses').doc(businessId).collection('studentSubscriptions');

  const byDocId = await col.doc(stripeSubscriptionId).get();
  if (byDocId.exists) {
    await byDocId.ref.set(
      stripUndefined({
        ...patch,
        updatedAt: Timestamp.now(),
      }),
      { merge: true }
    );
    return true;
  }

  const byField = await col.where('stripeSubscriptionId', '==', stripeSubscriptionId).limit(1).get();
  if (!byField.empty) {
    await byField.docs[0].ref.set(
      stripUndefined({
        ...patch,
        updatedAt: Timestamp.now(),
      }),
      { merge: true }
    );
    return true;
  }

  console.warn(
    `[webhooks/stripe] studentSubscriptions não encontrada: businessId=${businessId} stripeSubscriptionId=${stripeSubscriptionId}`
  );
  return false;
}

function subscriptionPeriodToFirestore(sub: Stripe.Subscription): {
  currentPeriodStart?: ReturnType<typeof Timestamp.fromMillis>;
  currentPeriodEnd?: ReturnType<typeof Timestamp.fromMillis>;
} {
  const s = sub as Stripe.Subscription & { current_period_start?: number; current_period_end?: number };
  const start = s.current_period_start;
  const end = s.current_period_end;
  return {
    ...(typeof start === 'number' ? { currentPeriodStart: Timestamp.fromMillis(start * 1000) } : {}),
    ...(typeof end === 'number' ? { currentPeriodEnd: Timestamp.fromMillis(end * 1000) } : {}),
  };
}

async function handleInvoicePaid(
  invoice: Stripe.Invoice,
  businessId: string,
  stripeAccount: string,
) {
  const stripeSubscriptionId = getStripeSubscriptionIdFromInvoice(invoice);
  if (!stripeSubscriptionId) {
    console.log('[webhooks/stripe] invoice.paid sem subscription — ignorado');
    return;
  }

  const periodEnd =
    typeof invoice.period_end === 'number' && invoice.period_end > 0
      ? Timestamp.fromMillis(invoice.period_end * 1000)
      : undefined;

  await patchStudentSubscription(businessId, stripeSubscriptionId, {
    status: 'active',
    ...(periodEnd ? { currentPeriodEnd: periodEnd } : {}),
  });

  await recordTuitionInvoicePaymentForConnect({
    businessId,
    invoice,
    stripeSubscriptionId,
    stripeAccount,
  });
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice, businessId: string) {
  const stripeSubscriptionId = getStripeSubscriptionIdFromInvoice(invoice);
  if (!stripeSubscriptionId) {
    console.log('[webhooks/stripe] invoice.payment_failed sem subscription — ignorado');
    return;
  }

  await patchStudentSubscription(businessId, stripeSubscriptionId, {
    status: 'past_due',
  });
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription, businessId: string) {
  const periods = subscriptionPeriodToFirestore(subscription);
  const sub = subscription as Stripe.Subscription & { cancel_at_period_end?: boolean };
  await patchStudentSubscription(businessId, subscription.id, {
    status: subscription.status,
    cancelAtPeriodEnd: sub.cancel_at_period_end === true,
    ...stripUndefined(periods as Record<string, unknown>),
  });
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription, businessId: string) {
  const periods = subscriptionPeriodToFirestore(subscription);
  await patchStudentSubscription(businessId, subscription.id, {
    status: 'canceled',
    ...stripUndefined(periods as Record<string, unknown>),
  });
}

export async function POST(request: NextRequest) {
  let event: Stripe.Event;
  try {
    const rawBody = await request.text();
    event = await verifyWebhookSignature(request, rawBody);
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Webhook verification failed';
    console.error('[webhooks/stripe]', msg);
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  const connectedAccountId = event.account;
  if (!connectedAccountId || typeof connectedAccountId !== 'string') {
    console.warn('[webhooks/stripe] evento sem event.account (não é Connect?) — ignorado');
    return NextResponse.json({ received: true, skipped: 'no_connected_account' });
  }

  const businessId = await findBusinessIdByConnectedAccount(connectedAccountId);
  if (!businessId) {
    console.warn(`[webhooks/stripe] nenhum business com stripeConnectAccountId=${connectedAccountId}`);
    return NextResponse.json({ received: true, skipped: 'unknown_connected_account' });
  }

  try {
    switch (event.type) {
      case 'invoice.paid':
      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        await handleInvoicePaid(invoice, businessId, connectedAccountId);
        break;
      }
      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        await handleInvoicePaymentFailed(invoice, businessId);
        break;
      }
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpdated(subscription, businessId);
        break;
      }
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionDeleted(subscription, businessId);
        break;
      }
      default:
        console.log(`[webhooks/stripe] tipo não tratado: ${event.type}`);
    }
  } catch (e) {
    console.error('[webhooks/stripe] erro ao processar evento:', e);
    return NextResponse.json({ error: 'handler_failed' }, { status: 500 });
  }

  return NextResponse.json({ received: true }, { status: 200 });
}
