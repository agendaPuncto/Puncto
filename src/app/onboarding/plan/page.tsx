'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/contexts/AuthContext';
import { useRouter } from 'next/navigation';

interface Plan {
  id: string;
  name: string;
  stripePriceId: string;
  price: number;
  features: string[];
  popular?: boolean;
}

const PLANS: Plan[] = [
  {
    id: 'starter',
    name: 'Starter',
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_STARTER || '',
    price: 99,
    features: [
      '1 unidade',
      'Até 5 profissionais',
      'Agendamento ilimitado',
      'Lembretes WhatsApp/Email',
      'Suporte por email',
    ],
  },
  {
    id: 'growth',
    name: 'Growth',
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_GROWTH || '',
    price: 249,
    popular: true,
    features: [
      'Até 3 unidades',
      'Até 15 profissionais',
      'Pagamentos PIX e cartão',
      'Cardápio digital',
      'Suporte prioritário',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO || '',
    price: 499,
    features: [
      'Unidades ilimitadas',
      'Até 50 profissionais',
      'Ponto eletrônico',
      'CRM e campanhas',
      'API e webhooks',
      'Notas fiscais',
    ],
  },
];

export default function OnboardingPlanPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [selectedPlan, setSelectedPlan] = useState<string>('growth');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/signup');
    }
  }, [user, loading, router]);

  // Check if business data exists in sessionStorage
  useEffect(() => {
    const businessData = sessionStorage.getItem('onboarding_business');
    if (!businessData && !loading) {
      router.push('/onboarding/business');
    }
  }, [loading, router]);

  const handleSubmit = async () => {
    setError(null);
    setIsSubmitting(true);

    try {
      // Get business data from sessionStorage
      const businessDataStr = sessionStorage.getItem('onboarding_business');
      if (!businessDataStr) {
        throw new Error('Dados do negócio não encontrados');
      }

      const businessData = JSON.parse(businessDataStr);
      const selectedPlanData = PLANS.find((p) => p.id === selectedPlan);

      if (!selectedPlanData) {
        throw new Error('Plano não encontrado');
      }

      // Get user auth token
      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      const token = await (user as any).getIdToken();

      // Create business with pending_payment status
      const response = await fetch('/api/onboarding/create-business', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...businessData,
          selectedPlan: selectedPlan,
          stripePriceId: selectedPlanData.stripePriceId,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erro ao criar negócio');
      }

      const { businessId, checkoutUrl } = await response.json();

      // Clear sessionStorage
      sessionStorage.removeItem('onboarding_business');

      // Redirect to Stripe Checkout
      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      } else {
        throw new Error('URL de pagamento não foi gerada');
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao processar pagamento');
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-50">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-neutral-300 border-t-neutral-900 mx-auto"></div>
          <p className="mt-4 text-neutral-600">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 px-4 py-12">
      <div className="w-full max-w-5xl">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-2">
            <div className="flex items-center">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-600 text-white text-sm font-medium">
                ✓
              </div>
              <span className="ml-2 text-sm text-neutral-600">Informações do Negócio</span>
            </div>
            <div className="h-px w-12 bg-neutral-300"></div>
            <div className="flex items-center">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-900 text-white text-sm font-medium">
                2
              </div>
              <span className="ml-2 text-sm font-medium text-neutral-900">Escolher Plano</span>
            </div>
            <div className="h-px w-12 bg-neutral-300"></div>
            <div className="flex items-center">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-300 text-neutral-600 text-sm font-medium">
                3
              </div>
              <span className="ml-2 text-sm text-neutral-600">Pagamento</span>
            </div>
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-neutral-900">Escolha seu Plano</h1>
          <p className="mt-2 text-neutral-600">
            Selecione o plano ideal para o seu negócio. Você pode mudar a qualquer momento.
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              onClick={() => setSelectedPlan(plan.id)}
              className={`relative cursor-pointer rounded-2xl p-6 transition-all ${
                selectedPlan === plan.id
                  ? 'bg-neutral-900 text-white ring-4 ring-neutral-900 ring-offset-4'
                  : 'bg-white border-2 border-neutral-200 hover:border-neutral-400'
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-3 right-4">
                  <span className="bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                    Mais Popular
                  </span>
                </div>
              )}

              {/* Radio Button */}
              <div className="mb-4">
                <div className="flex items-center justify-between">
                  <h3 className={`text-xl font-bold ${selectedPlan === plan.id ? 'text-white' : 'text-neutral-900'}`}>
                    {plan.name}
                  </h3>
                  <div
                    className={`h-6 w-6 rounded-full border-2 flex items-center justify-center ${
                      selectedPlan === plan.id
                        ? 'border-white bg-white'
                        : 'border-neutral-300'
                    }`}
                  >
                    {selectedPlan === plan.id && (
                      <div className="h-3 w-3 rounded-full bg-neutral-900"></div>
                    )}
                  </div>
                </div>
              </div>

              {/* Price */}
              <div className="mb-6">
                <div className="flex items-baseline gap-1">
                  <span className={`text-sm ${selectedPlan === plan.id ? 'text-neutral-300' : 'text-neutral-500'}`}>
                    R$
                  </span>
                  <span className={`text-4xl font-bold ${selectedPlan === plan.id ? 'text-white' : 'text-neutral-900'}`}>
                    {plan.price}
                  </span>
                  <span className={`text-sm ${selectedPlan === plan.id ? 'text-neutral-300' : 'text-neutral-500'}`}>
                    /mês
                  </span>
                </div>
              </div>

              {/* Features */}
              <ul className="space-y-3">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <svg
                      className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                        selectedPlan === plan.id ? 'text-green-400' : 'text-green-600'
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className={`text-sm ${selectedPlan === plan.id ? 'text-neutral-200' : 'text-neutral-600'}`}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-800">
            {error}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4 max-w-2xl mx-auto">
          <button
            type="button"
            onClick={() => router.push('/onboarding/business')}
            disabled={isSubmitting}
            className="flex-1 rounded-xl border border-neutral-300 px-6 py-3 text-sm font-medium text-neutral-700 hover:bg-neutral-50 disabled:opacity-50"
          >
            Voltar
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex-1 rounded-xl bg-neutral-900 px-6 py-3 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Processando...' : 'Continuar para Pagamento'}
          </button>
        </div>

        {/* Info Note */}
        <div className="mt-6 text-center">
          <p className="text-sm text-neutral-500">
            Você será redirecionado para a página de pagamento seguro do Stripe
          </p>
        </div>
      </div>
    </div>
  );
}
