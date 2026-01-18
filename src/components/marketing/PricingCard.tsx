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
  const price = isAnnual ? plan.price.annually : plan.price.monthly;
  const savings = plan.price.monthly * 12 - plan.price.annually * 12;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`relative rounded-2xl p-6 md:p-8 ${
        plan.popular
          ? 'bg-primary-600 text-white ring-4 ring-primary-600 ring-offset-4'
          : 'bg-white border border-slate-200'
      }`}
    >
      {/* Popular badge */}
      {plan.popular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <span className="bg-accent-500 text-white text-sm font-semibold px-4 py-1 rounded-full shadow-lg">
            Mais Popular
          </span>
        </div>
      )}

      {/* Plan name */}
      <h3
        className={`text-xl font-bold mb-2 ${
          plan.popular ? 'text-white' : 'text-slate-900'
        }`}
      >
        {plan.name}
      </h3>

      {/* Description */}
      <p
        className={`text-sm mb-6 ${
          plan.popular ? 'text-primary-100' : 'text-slate-500'
        }`}
      >
        {plan.description}
      </p>

      {/* Price */}
      <div className="mb-6">
        <div className="flex items-baseline gap-1">
          <span
            className={`text-sm ${plan.popular ? 'text-primary-200' : 'text-slate-500'}`}
          >
            R$
          </span>
          <span
            className={`text-4xl font-bold ${
              plan.popular ? 'text-white' : 'text-slate-900'
            }`}
          >
            {price}
          </span>
          <span
            className={`text-sm ${plan.popular ? 'text-primary-200' : 'text-slate-500'}`}
          >
            /mês
          </span>
        </div>
        {isAnnual && savings > 0 && (
          <p
            className={`text-sm mt-1 ${
              plan.popular ? 'text-secondary-300' : 'text-secondary-600'
            }`}
          >
            Economia de R$ {savings.toLocaleString('pt-BR')}/ano
          </p>
        )}
      </div>

      {/* CTA Button */}
      <Link
        href={plan.cta.href}
        className={`btn w-full mb-6 ${
          plan.popular
            ? 'bg-white text-primary-600 hover:bg-slate-100'
            : 'btn-primary'
        }`}
      >
        {plan.cta.text}
      </Link>

      {/* Features */}
      <ul className="space-y-3">
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
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span
              className={`text-sm ${
                plan.popular ? 'text-primary-100' : 'text-slate-600'
              }`}
            >
              {feature}
            </span>
          </li>
        ))}
        {plan.limitations?.map((limitation, i) => (
          <li key={`limit-${i}`} className="flex items-start gap-3">
            <svg
              className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                plan.popular ? 'text-primary-300' : 'text-slate-300'
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            <span
              className={`text-sm ${
                plan.popular ? 'text-primary-300' : 'text-slate-400'
              }`}
            >
              {limitation}
            </span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

// Pricing plans data
export const pricingPlans: PricingPlan[] = [
  {
    id: 'starter',
    name: 'Starter',
    description: 'Ideal para começar a digitalizar seu negócio',
    price: {
      monthly: 99,
      annually: 79,
    },
    features: [
      '1 unidade',
      'Até 5 profissionais',
      'Agendamento ilimitado',
      'Lembretes por WhatsApp e email',
      'Sincronização de calendário',
      'Suporte por email',
    ],
    limitations: [
      'Sem pagamentos integrados',
      'Sem controle de estoque',
    ],
    cta: {
      text: 'Começar Grátis',
      href: '/auth/signup?plan=starter',
    },
  },
  {
    id: 'growth',
    name: 'Growth',
    description: 'Para negócios em crescimento que precisam de mais',
    price: {
      monthly: 249,
      annually: 199,
    },
    popular: true,
    features: [
      'Até 3 unidades',
      'Até 15 profissionais',
      'Tudo do Starter',
      'Pagamentos PIX e cartão',
      'Divisão de comissões',
      'Cardápio digital',
      'Comanda virtual',
      'Suporte prioritário',
    ],
    cta: {
      text: 'Começar Grátis',
      href: '/auth/signup?plan=growth',
    },
  },
  {
    id: 'pro',
    name: 'Pro',
    description: 'Para operações completas com todas as funcionalidades',
    price: {
      monthly: 499,
      annually: 399,
    },
    features: [
      'Unidades ilimitadas',
      'Até 50 profissionais',
      'Tudo do Growth',
      'Ponto eletrônico',
      'Controle de estoque',
      'Notas fiscais (NFS-e/NFC-e)',
      'CRM e campanhas',
      'API e webhooks',
      'Relatórios avançados',
    ],
    cta: {
      text: 'Começar Grátis',
      href: '/auth/signup?plan=pro',
    },
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'Para grandes redes e franquias com necessidades específicas',
    price: {
      monthly: 0,
      annually: 0,
    },
    features: [
      'Profissionais ilimitados',
      'Tudo do Pro',
      'White-label completo',
      'Gestão de franquias',
      'SLA garantido',
      'Gerente de sucesso dedicado',
      'Integrações customizadas',
      'Treinamento presencial',
    ],
    cta: {
      text: 'Falar com Vendas',
      href: '/contact?plan=enterprise',
    },
  },
];
