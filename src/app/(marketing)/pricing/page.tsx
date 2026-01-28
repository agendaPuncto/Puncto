'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

import PricingCard, { pricingPlans } from '@/components/marketing/PricingCard';
import FAQAccordion from '@/components/marketing/FAQAccordion';
import CTASection from '@/components/marketing/CTASection';

const pricingFAQ = [
  {
    question: 'Posso trocar de plano a qualquer momento?',
    answer:
      'Sim! Você pode fazer upgrade ou downgrade do seu plano a qualquer momento. No upgrade, a diferença é calculada pro-rata. No downgrade, o novo valor será aplicado no próximo ciclo de faturamento.',
  },
  {
    question: 'Como funciona o período de teste?',
    answer:
      'Todos os planos incluem 14 dias de teste grátis com acesso a todas as funcionalidades. Não pedimos cartão de crédito para começar. Ao final do período, você escolhe o plano que melhor atende suas necessidades.',
  },
  {
    question: 'Existe fidelidade ou multa de cancelamento?',
    answer:
      'Não! Nossos planos são mensais e você pode cancelar a qualquer momento sem multa. Se você optou pelo plano anual e cancelar antes, fazemos a devolução proporcional dos meses restantes.',
  },
  {
    question: 'Quais formas de pagamento são aceitas?',
    answer:
      'Aceitamos PIX, cartões de crédito (Visa, Mastercard, Elo, Amex) e boleto bancário. Para o plano anual, você pode parcelar em até 12x no cartão.',
  },
  {
    question: 'O que acontece se eu ultrapassar os limites do meu plano?',
    answer:
      'Entraremos em contato para ajudar você a escolher um plano mais adequado. Não cobramos automaticamente por excedentes. Você sempre terá a opção de fazer upgrade ou ajustar seu uso.',
  },
  {
    question: 'Tenho direito a suporte durante o período de teste?',
    answer:
      'Claro! Durante o período de teste você tem acesso ao mesmo suporte do plano escolhido. Nossa equipe está disponível para ajudar na configuração inicial e tirar todas as dúvidas.',
  },
];

const featureComparison = [
  {
    category: 'Agendamento',
    features: [
      { name: 'Agendamentos ilimitados', starter: true, growth: true, pro: true, enterprise: true },
      { name: 'Lembretes WhatsApp/Email', starter: true, growth: true, pro: true, enterprise: true },
      { name: 'Sincronização de calendário', starter: true, growth: true, pro: true, enterprise: true },
      { name: 'Lista de espera automática', starter: true, growth: true, pro: true, enterprise: true },
      { name: 'Bloqueio de horários', starter: true, growth: true, pro: true, enterprise: true },
    ],
  },
  {
    category: 'Pagamentos',
    features: [
      { name: 'PIX instantâneo', starter: false, growth: true, pro: true, enterprise: true },
      { name: 'Cartões de crédito/débito', starter: false, growth: true, pro: true, enterprise: true },
      { name: 'Links de pagamento', starter: false, growth: true, pro: true, enterprise: true },
      { name: 'Divisão de comissões', starter: false, growth: true, pro: true, enterprise: true },
      { name: 'Relatórios financeiros', starter: false, growth: true, pro: true, enterprise: true },
    ],
  },
  {
    category: 'Restaurante',
    features: [
      { name: 'Cardápio digital', starter: false, growth: true, pro: true, enterprise: true },
      { name: 'Comanda virtual', starter: false, growth: true, pro: true, enterprise: true },
      { name: 'Gestão de mesas', starter: false, growth: true, pro: true, enterprise: true },
      { name: 'Divisão de conta', starter: false, growth: true, pro: true, enterprise: true },
      { name: 'Impressão térmica', starter: false, growth: true, pro: true, enterprise: true },
    ],
  },
  {
    category: 'Equipe e Operações',
    features: [
      { name: 'Ponto eletrônico', starter: false, growth: false, pro: true, enterprise: true },
      { name: 'Gestão de turnos', starter: false, growth: false, pro: true, enterprise: true },
      { name: 'Banco de horas', starter: false, growth: false, pro: true, enterprise: true },
      { name: 'Controle de estoque', starter: false, growth: false, pro: true, enterprise: true },
      { name: 'Custeio de receitas', starter: false, growth: false, pro: true, enterprise: true },
    ],
  },
  {
    category: 'CRM e Marketing',
    features: [
      { name: 'Histórico de clientes', starter: true, growth: true, pro: true, enterprise: true },
      { name: 'Programa de fidelidade', starter: false, growth: false, pro: true, enterprise: true },
      { name: 'Campanhas de marketing', starter: false, growth: false, pro: true, enterprise: true },
      { name: 'Segmentação avançada', starter: false, growth: false, pro: true, enterprise: true },
      { name: 'Automações', starter: false, growth: false, pro: true, enterprise: true },
    ],
  },
  {
    category: 'Avançado',
    features: [
      { name: 'API REST/GraphQL', starter: false, growth: false, pro: true, enterprise: true },
      { name: 'Webhooks', starter: false, growth: false, pro: true, enterprise: true },
      { name: 'Notas fiscais (NFS-e/NFC-e)', starter: false, growth: false, pro: true, enterprise: true },
      { name: 'White-label', starter: false, growth: false, pro: false, enterprise: true },
      { name: 'Gestão de franquias', starter: false, growth: false, pro: false, enterprise: true },
    ],
  },
  {
    category: 'Suporte',
    features: [
      { name: 'Suporte por email', starter: true, growth: true, pro: true, enterprise: true },
      { name: 'Suporte prioritário', starter: false, growth: true, pro: true, enterprise: true },
      { name: 'Chat ao vivo', starter: false, growth: true, pro: true, enterprise: true },
      { name: 'Gerente de sucesso', starter: false, growth: false, pro: false, enterprise: true },
      { name: 'SLA garantido', starter: false, growth: false, pro: false, enterprise: true },
    ],
  },
];

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(true);

  return (
    <>
      {/* Hero Section */}
      <section className="section bg-gradient-to-b from-primary-50 to-white">
        <div className="container-marketing">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <span className="badge-primary mb-4">Preços transparentes</span>
            <h1 className="heading-xl text-slate-900 mb-6">
              Planos para cada fase do seu negócio
            </h1>
            <p className="body-lg mb-8">
              Comece grátis e cresça no seu ritmo. Todos os planos incluem 14 dias de
              teste sem compromisso.
            </p>

            {/* Billing toggle */}
            <div className="inline-flex items-center gap-4 bg-white rounded-full p-1.5 shadow-soft border border-slate-200">
              <button
                onClick={() => setIsAnnual(false)}
                className={`px-6 py-2.5 rounded-full font-medium transition-all ${
                  !isAnnual
                    ? 'bg-primary-600 text-white shadow-lg'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Mensal
              </button>
              <button
                onClick={() => setIsAnnual(true)}
                className={`px-6 py-2.5 rounded-full font-medium transition-all flex items-center gap-2 ${
                  isAnnual
                    ? 'bg-primary-600 text-white shadow-lg'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Anual
                <span className="text-xs bg-secondary-500 text-white px-2 py-0.5 rounded-full">
                  Economize 20%
                </span>
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="section-sm bg-white -mt-8">
        <div className="container-marketing">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-4 max-w-5xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <PricingCard
                key={plan.id}
                plan={plan}
                isAnnual={isAnnual}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Feature Comparison Table */}
      <section className="section bg-slate-50">
        <div className="container-marketing">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="heading-lg text-slate-900 mb-4">
              Compare todos os recursos
            </h2>
            <p className="body-lg max-w-2xl mx-auto">
              Veja exatamente o que está incluído em cada plano.
            </p>
          </motion.div>

          <div className="bg-white rounded-2xl shadow-soft border border-slate-200 overflow-hidden">
            {/* Header */}
            <div className="grid grid-cols-5 bg-slate-50 border-b border-slate-200">
              <div className="p-4 font-semibold text-slate-900">Recurso</div>
              <div className="p-4 text-center font-semibold text-slate-900">Starter</div>
              <div className="p-4 text-center font-semibold text-slate-900">Growth</div>
              <div className="p-4 text-center font-semibold text-slate-900">Pro</div>
              <div className="p-4 text-center font-semibold text-slate-900">Enterprise</div>
            </div>

            {/* Feature rows */}
            {featureComparison.map((category, catIndex) => (
              <div key={catIndex}>
                {/* Category header */}
                <div className="grid grid-cols-5 bg-slate-100 border-b border-slate-200">
                  <div className="col-span-5 p-3 font-semibold text-primary-600">
                    {category.category}
                  </div>
                </div>
                {/* Features */}
                {category.features.map((feature, featIndex) => (
                  <div
                    key={featIndex}
                    className="grid grid-cols-5 border-b border-slate-100 hover:bg-slate-50 transition-colors"
                  >
                    <div className="p-4 text-slate-700 text-sm">{feature.name}</div>
                    <div className="p-4 flex justify-center">
                      {feature.starter ? (
                        <svg className="w-5 h-5 text-secondary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      )}
                    </div>
                    <div className="p-4 flex justify-center">
                      {feature.growth ? (
                        <svg className="w-5 h-5 text-secondary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      )}
                    </div>
                    <div className="p-4 flex justify-center">
                      {feature.pro ? (
                        <svg className="w-5 h-5 text-secondary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      )}
                    </div>
                    <div className="p-4 flex justify-center">
                      {feature.enterprise ? (
                        <svg className="w-5 h-5 text-secondary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="section bg-white">
        <div className="container-marketing">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="heading-lg text-slate-900 mb-4">
              Dúvidas sobre preços
            </h2>
            <p className="body-lg max-w-2xl mx-auto">
              Respostas para as perguntas mais comuns sobre nossos planos.
            </p>
          </motion.div>

          <div className="max-w-3xl mx-auto">
            <FAQAccordion items={pricingFAQ} />
          </div>
        </div>
      </section>

      {/* Enterprise CTA */}
      <section className="section-sm bg-slate-900 text-white">
        <div className="container-marketing">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="heading-lg text-white mb-4">
                Desenvolvimento Customizado
              </h2>
              <p className="text-slate-300 text-lg mb-6">
                Para indústrias, fábricas e grandes empresas, desenvolvemos sistemas 
                sob medida que se integram aos seus processos existentes e resolvem 
                desafios específicos do seu negócio.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  'Sistemas desenvolvidos sob medida',
                  'Integração com sistemas legados',
                  'Automação de processos industriais',
                  'Dashboards e relatórios personalizados',
                  'Suporte e evolução contínua',
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Link href="https://wa.me/5541991626161" target="_blank" className="btn bg-white text-slate-900 hover:bg-slate-100">
                Solicitar Orçamento
              </Link>
            </div>
            <div className="bg-slate-800 rounded-2xl p-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Customizado</h3>
                <p className="text-slate-400 mb-6">
                  Desenvolvimento sob medida para indústrias e grandes empresas
                </p>
                <div className="text-4xl font-bold text-white mb-2">Sob Medida</div>
                <p className="text-slate-400 text-sm">
                  Orçamento baseado no escopo do projeto
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <CTASection
        title="Comece sua transformação hoje"
        description="14 dias grátis, sem cartão de crédito, sem compromisso."
        variant="gradient"
      />
    </>
  );
}
