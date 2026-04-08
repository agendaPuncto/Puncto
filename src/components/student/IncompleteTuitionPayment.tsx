'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import type { StripeElements } from '@stripe/stripe-js';
import { getStripePublishableKey } from '@/lib/stripe/publishable';
import type { StudentSubscription } from '@/types/studentSubscription';

type Phase = 'idle' | 'loading_keys' | 'mounting' | 'ready' | 'submitting' | 'error';

interface IncompleteTuitionPaymentProps {
  businessId: string;
  subscription: StudentSubscription;
  getIdToken: () => Promise<string>;
}

export function IncompleteTuitionPayment({ businessId, subscription, getIdToken }: IncompleteTuitionPaymentProps) {
  const [phase, setPhase] = useState<Phase>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const shellRef = useRef<HTMLDivElement>(null);
  const stripeRef = useRef<Awaited<ReturnType<typeof loadStripe>>>(null);
  const elementsRef = useRef<StripeElements | null>(null);
  const paymentElementRef = useRef<{ destroy: () => void } | null>(null);

  const teardown = useCallback(() => {
    try {
      paymentElementRef.current?.destroy();
    } catch {
      /* ignore */
    }
    paymentElementRef.current = null;
    elementsRef.current = null;
    stripeRef.current = null;
    if (shellRef.current) shellRef.current.innerHTML = '';
  }, []);

  useEffect(() => () => teardown(), [teardown]);

  const startPayment = async () => {
    setErrorMessage(null);
    setPhase('loading_keys');
    try {
      const token = await getIdToken();
      const res = await fetch('/api/students/subscriptions/manage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          action: 'prepare_incomplete_payment',
          businessId,
          subscriptionId: subscription.id,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string; clientSecret?: string; stripeConnectAccountId?: string };
      if (!res.ok) {
        throw new Error(typeof data.error === 'string' ? data.error : 'Nao foi possivel preparar o pagamento');
      }
      if (!data.clientSecret || !data.stripeConnectAccountId) {
        throw new Error('Resposta invalida do servidor');
      }
      await mountElements(data.clientSecret, data.stripeConnectAccountId);
      setPhase('ready');
    } catch (e) {
      setErrorMessage(e instanceof Error ? e.message : 'Erro ao preparar pagamento');
      setPhase('error');
    }
  };

  const mountElements = async (clientSecret: string, stripeConnectAccountId: string) => {
    setPhase('mounting');
    teardown();
    const shell = shellRef.current;
    if (!shell) throw new Error('Container indisponivel');

    const stripe = await loadStripe(getStripePublishableKey(), { stripeAccount: stripeConnectAccountId });
    if (!stripe) throw new Error('Falha ao carregar Stripe.js');

    const elements = stripe.elements({
      clientSecret,
      appearance: { theme: 'stripe' },
    });
    const paymentElement = elements.create('payment');
    paymentElement.mount(shell);

    stripeRef.current = stripe;
    elementsRef.current = elements;
    paymentElementRef.current = paymentElement;
  };

  const handleConfirm = async () => {
    const stripe = stripeRef.current;
    const elements = elementsRef.current;
    if (!stripe || !elements) {
      setErrorMessage('Abra o formulario de pagamento primeiro.');
      return;
    }
    setErrorMessage(null);
    setPhase('submitting');
    try {
      const returnUrl =
        typeof window !== 'undefined' ? `${window.location.origin}${window.location.pathname}` : '';
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: returnUrl,
        },
      });
      if (error) {
        setErrorMessage(error.message ?? 'Pagamento nao concluido');
        setPhase('ready');
      }
    } catch (e) {
      setErrorMessage(e instanceof Error ? e.message : 'Erro ao confirmar pagamento');
      setPhase('ready');
    }
  };

  if (subscription.status !== 'incomplete') return null;

  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50/80 p-4">
      <p className="text-sm font-medium text-amber-950">Mensalidade pendente de pagamento</p>
      <p className="mt-1 text-sm text-amber-900/90">
        Conclua o primeiro pagamento com cartao para ativar a assinatura.
      </p>
      {phase === 'idle' || phase === 'error' ? (
        <button
          type="button"
          onClick={() => void startPayment()}
          className="mt-3 rounded-lg bg-amber-900 px-4 py-2 text-sm font-medium text-white hover:bg-amber-800 disabled:opacity-50"
        >
          Pagar agora
        </button>
      ) : null}
      {(phase === 'loading_keys' || phase === 'mounting') && (
        <p className="mt-3 text-sm text-amber-900/80">Preparando formulario seguro…</p>
      )}
      <div ref={shellRef} className="mt-4 min-h-[120px]" />
      {phase === 'ready' || phase === 'submitting' ? (
        <button
          type="button"
          onClick={() => void handleConfirm()}
          disabled={phase === 'submitting'}
          className="mt-4 w-full rounded-lg bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-50"
        >
          {phase === 'submitting' ? 'Processando…' : 'Confirmar pagamento'}
        </button>
      ) : null}
      {errorMessage ? <p className="mt-2 text-sm text-red-700">{errorMessage}</p> : null}
    </div>
  );
}
