'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export interface PricingPlan {
  id: string;
  name: string;
  description: string;
  price: {
    monthly: number;
    annually: number;
  };
  customPrice?: string;
  popular?: boolean;
  features: string[];
  limitations?: string[];
  cta: {
    text: string;
    href: string;
  };
}

interface PricingCardProps {
  plan: PricingPlan;
  isAnnual: boolean;
  index?: number;
}

export default function PricingCard({ plan, isAnnual, index = 0 }: PricingCardProps) {
  const priceDisplay = plan.customPrice 
    ? plan.customPrice 
    : isAnnual ? plan.price.annually : plan.price.monthly;

  const showCurrency = !plan.customPrice;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`relative rounded-2xl p-6 md:p-8 flex flex-col h-full ${
        plan.popular
          ? 'bg-primary-600 text-white ring-4 ring-primary-600 ring-offset-4'
          : 'bg-white border border-slate-200'
      }`}
    >
      {plan.popular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <span className="bg-accent-500 text-white text-sm font-semibold px-4 py-1 rounded-full shadow-lg">
            Recomendado
          </span>
        </div>
      )}

      <h3 className={`text-xl font-bold mb-2 ${plan.popular ? 'text-white' : 'text-slate-900'}`}>
        {plan.name}
      </h3>

      <p className={`text-sm mb-6 ${plan.popular ? 'text-primary-100' : 'text-slate-500'}`}>
        {plan.description}
      </p>

      <div className="mb-6">
        <div className="flex items-baseline gap-1">
          {showCurrency && (
            <span className={`text-sm ${plan.popular ? 'text-primary-200' : 'text-slate-500'}`}>
              R$
            </span>
          )}
          <span className={`text-3xl font-bold ${plan.popular ? 'text-white' : 'text-slate-900'}`}>
            {priceDisplay}
          </span>
          {showCurrency && (
            <span className={`text-sm ${plan.popular ? 'text-primary-200' : 'text-slate-500'}`}>
              /mês
            </span>
          )}
        </div>
      </div>

      {/* Botão */}
      <Link
        href={plan.cta.href}
        className={`btn w-full mb-6 text-center ${
          plan.popular
            ? 'bg-white text-primary-600 hover:bg-slate-100'
            : 'btn-primary'
        }`}
      >
        {plan.cta.text}
      </Link>

      <ul className="space-y-3 mt-auto">
        {plan.features.map((feature, i) => (
          <li key={i} className="flex items-start gap-3">
            <svg
              className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                plan.popular ? 'text-secondary-300' : 'text-secondary-500'
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className={`text-sm ${plan.popular ? 'text-primary-100' : 'text-slate-600'}`}>
              {feature}
            </span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

export const pricingPlans: PricingPlan[] = [
  {
    id: 'starter',
    name: 'Starter',
    description: 'Perfeito para começar. Agendamento completo e gestão básica.',
    price: { monthly: 99, annually: 79 },
    features: [
      'Agendamentos ilimitados',
      'Lembretes WhatsApp/Email',
      'Sincronização de calendário',
      'Histórico de clientes',
      'Suporte por email',
    ],
    cta: {
      text: 'Começar Grátis',
      href: '/auth/signup',
    },
  },
  {
    id: 'growth',
    name: 'Growth',
    description: 'Para negócios em crescimento. Pagamentos e restaurante incluídos.',
    price: { monthly: 199, annually: 159 },
    popular: true,
    features: [
      'Tudo do Starter',
      'Pagamentos PIX e cartão',
      'Cardápio digital',
      'Comanda virtual',
      'Gestão de mesas',
      'Suporte prioritário',
    ],
    cta: {
      text: 'Começar Grátis',
      href: '/auth/signup',
    },
  },
  {
    id: 'pro',
    name: 'Pro',
    description: 'Solução completa com estoque, ponto eletrônico e relatórios avançados.',
    price: { monthly: 399, annually: 319 },
    features: [
      'Tudo do Growth',
      'Ponto eletrônico',
      'Controle de estoque',
      'Relatórios financeiros',
      'Programa de fidelidade',
      'API e webhooks',
    ],
    cta: {
      text: 'Começar Grátis',
      href: '/auth/signup',
    },
  },
];