'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/lib/contexts/AuthContext';
import { useBusiness } from '@/lib/contexts/BusinessContext';
import { useStudentCustomerProfile, useStudentSubscriptions } from '@/lib/queries/studentPortal';
import { useTuitionTypes } from '@/lib/queries/tuitionTypes';
import { IncompleteTuitionPayment } from '@/components/student/IncompleteTuitionPayment';
import { ensureStudentTuitionSubscription } from '@/lib/student/ensureTuitionSubscription';
import { getStudentCustomerId } from '@/lib/student/studentSession';

const BLOCKING_STATUSES = new Set(['active', 'past_due', 'incomplete', 'pending_checkout']);

export default function StudentFinanceiroPage() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, firebaseUser } = useAuth();
  const { business } = useBusiness();
  const studentCustomerId = getStudentCustomerId(user);
  const isEducation = business?.industry === 'education';

  const {
    data: subscriptions = [],
    refetch: refetchSubs,
    isError: subsError,
    error: subsErrObj,
  } = useStudentSubscriptions(business.id, studentCustomerId);

  useEffect(() => {
    const redirectStatus = searchParams.get('redirect_status');
    if (redirectStatus !== 'succeeded' || !searchParams.get('payment_intent')) return;
    if (!firebaseUser || !business?.id || !studentCustomerId) return;

    let cancelled = false;
    void (async () => {
      try {
        const token = await firebaseUser.getIdToken();
        const res = await fetch('/api/students/subscriptions/manage', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ action: 'sync_from_stripe', businessId: business.id }),
        });
        if (!res.ok && !cancelled) {
          console.warn('[financeiro] sync_from_stripe', await res.text());
        }
        if (cancelled) return;
        await queryClient.invalidateQueries({ queryKey: ['studentSubscriptions', business.id, studentCustomerId] });
        await refetchSubs();
        router.replace('/tenant/student/financeiro');
      } catch (e) {
        if (!cancelled) console.warn('[financeiro] pos-pagamento', e);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [searchParams, firebaseUser, business?.id, studentCustomerId, queryClient, router, refetchSubs]);
  const { data: customerProfile, isLoading: profileLoading } = useStudentCustomerProfile(
    business.id,
    studentCustomerId,
  );
  const { data: tuitionTypes = [] } = useTuitionTypes(business.id, isEducation);

  const [ensureLoading, setEnsureLoading] = useState(false);
  const [ensureError, setEnsureError] = useState<string | null>(null);

  const hasBlockingSubscription = useMemo(
    () => subscriptions.some((s) => BLOCKING_STATUSES.has(s.status)),
    [subscriptions],
  );

  const assignedTuitionType = useMemo(() => {
    const id = customerProfile?.tuitionTypeId;
    if (!id) return null;
    return tuitionTypes.find((t) => t.id === id) ?? null;
  }, [customerProfile?.tuitionTypeId, tuitionTypes]);

  const showStartTuitionCta =
    isEducation &&
    !profileLoading &&
    Boolean(customerProfile?.tuitionTypeId) &&
    !hasBlockingSubscription;

  const incompleteSubs = subscriptions.filter((s) => s.status === 'incomplete');
  const activeSub =
    subscriptions.find((s) => s.status === 'active' || s.status === 'past_due') ||
    subscriptions.find((s) => !BLOCKING_STATUSES.has(s.status) && s.status !== 'canceled') ||
    subscriptions[0];

  const openBillingPortal = async () => {
    if (!firebaseUser || !activeSub) return;
    const token = await firebaseUser.getIdToken();
    const res = await fetch('/api/students/subscriptions/manage', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        action: 'portal',
        businessId: business.id,
        subscriptionId: activeSub.id,
      }),
    });
    const data = await res.json();
    if (res.ok && data?.url) window.location.href = data.url;
  };

  const getIdToken = () => {
    if (!firebaseUser) throw new Error('Sessao expirada');
    return firebaseUser.getIdToken();
  };

  const handlePrepareTuition = async () => {
    if (!firebaseUser || !studentCustomerId) return;
    setEnsureError(null);
    setEnsureLoading(true);
    try {
      const result = await ensureStudentTuitionSubscription(getIdToken, {
        businessId: business.id,
        customerId: studentCustomerId,
      });
      if (!result.ok) {
        setEnsureError(result.error);
        return;
      }
      await queryClient.invalidateQueries({ queryKey: ['studentSubscriptions', business.id, studentCustomerId] });
      await refetchSubs();
    } finally {
      setEnsureLoading(false);
    }
  };

  const loadError = (() => {
    if (!subsError || subsErrObj == null) return null;
    return subsErrObj instanceof Error ? subsErrObj.message : String(subsErrObj);
  })();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-neutral-900">Financeiro</h1>

      {loadError ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
          Não foi possível carregar dados financeiros. Se o problema continuar, saia e entre de novo. ({loadError})
        </p>
      ) : null}

      {showStartTuitionCta && incompleteSubs.length === 0 && (
        <div className="rounded-xl border border-blue-200 bg-blue-50/80 p-4">
          <p className="text-sm font-medium text-blue-950">Mensalidade da escola</p>
          <p className="mt-1 text-sm text-blue-900/90">
            {assignedTuitionType ? (
              <>
                Seu plano: <strong>{assignedTuitionType.name}</strong>
                {typeof assignedTuitionType.suggestedAmountCents === 'number' &&
                assignedTuitionType.suggestedAmountCents > 0 ? (
                  <>
                    {' '}
                    —{' '}
                    {(assignedTuitionType.suggestedAmountCents / 100).toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    })}{' '}
                    / mês
                  </>
                ) : null}
                . Toque abaixo para gerar o pagamento seguro e iniciar a cobrança mensal.
              </>
            ) : (
              <>Sua escola definiu um tipo de mensalidade para você. Gere o pagamento para iniciar a recorrência.</>
            )}
          </p>
          <button
            type="button"
            onClick={() => void handlePrepareTuition()}
            disabled={ensureLoading}
            className="mt-3 rounded-lg bg-blue-900 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800 disabled:opacity-50"
          >
            {ensureLoading ? 'Preparando…' : 'Pagar mensalidade e ativar recorrência'}
          </button>
          {ensureError ? <p className="mt-2 text-sm text-red-700">{ensureError}</p> : null}
        </div>
      )}

      {incompleteSubs.length > 0 && firebaseUser && (
        <div className="space-y-4">
          {incompleteSubs.map((sub) => (
            <IncompleteTuitionPayment
              key={sub.id}
              businessId={business.id}
              subscription={sub}
              getIdToken={getIdToken}
            />
          ))}
        </div>
      )}

      <div className="rounded-xl border border-neutral-200 bg-white p-4">
        <p className="text-sm text-neutral-500">Assinatura e cobrança</p>
        <p className="mt-1 text-base font-medium text-neutral-900">{activeSub?.status || 'Sem assinatura ativa'}</p>
        <p className="mt-2 text-sm text-neutral-600 leading-relaxed">
          O histórico de faturas, comprovantes e a troca do cartão ficam no{' '}
          <span className="font-medium text-neutral-800">portal seguro da Stripe</span>, parceira de pagamentos da escola.
          Use o botão abaixo sempre que precisar ver detalhes da assinatura ou baixar uma fatura.
        </p>
        <button
          type="button"
          onClick={openBillingPortal}
          disabled={!activeSub || activeSub.status === 'incomplete'}
          className="mt-4 rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-50"
        >
          Abrir portal de cobrança (faturas e cartão)
        </button>
        {activeSub?.status === 'incomplete' && (
          <p className="mt-2 text-xs text-neutral-500">
            Conclua o primeiro pagamento no bloco acima; depois você poderá abrir o portal para gerenciar a forma de
            pagamento e ver as faturas.
          </p>
        )}
      </div>
    </div>
  );
}
