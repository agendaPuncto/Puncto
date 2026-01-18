'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

import Hero from '@/components/marketing/Hero';
import FeatureCard from '@/components/marketing/FeatureCard';
import FAQAccordion from '@/components/marketing/FAQAccordion';
import CTASection from '@/components/marketing/CTASection';
import StatsCounter from '@/components/marketing/StatsCounter';
import TestimonialCard, { testimonials } from '@/components/marketing/TestimonialCard';
import PricingCard, { pricingPlans } from '@/components/marketing/PricingCard';

import { features } from '@/content/features';
import { faqItems } from '@/content/faq';
import { industries, industryIcons } from '@/content/industries';

export default function HomePage() {
  const [selectedIndustry, setSelectedIndustry] = useState(industries[0].id);
  const [isAnnual, setIsAnnual] = useState(true);

  const activeIndustry = industries.find((i) => i.id === selectedIndustry) || industries[0];

  return (
    <>
      {/* Hero Section */}
      <Hero />

      {/* Stats Section */}
      <StatsCounter />

      {/* Features Section */}
      <section className="section bg-white">
        <div className="container-marketing">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 md:mb-16"
          >
            <span className="badge-primary mb-4">Funcionalidades</span>
            <h2 className="heading-lg text-slate-900 mb-4">
              Tudo que você precisa em um só lugar
            </h2>
            <p className="body-lg max-w-2xl mx-auto">
              Do agendamento ao relatório financeiro, o Puncto oferece todas as
              ferramentas para gerenciar seu negócio de forma simples e eficiente.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.slice(0, 8).map((feature, index) => (
              <FeatureCard key={feature.id} feature={feature} index={index} />
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/features" className="btn-secondary">
              Ver todas as funcionalidades
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Industries Section */}
      <section className="section bg-slate-50">
        <div className="container-marketing">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="badge-secondary mb-4">Setores</span>
            <h2 className="heading-lg text-slate-900 mb-4">
              Feito para o seu tipo de negócio
            </h2>
            <p className="body-lg max-w-2xl mx-auto">
              Funcionalidades específicas para cada setor, desenvolvidas com base
              nas necessidades reais do mercado brasileiro.
            </p>
          </motion.div>

          {/* Industry tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {industries.map((industry) => (
              <button
                key={industry.id}
                onClick={() => setSelectedIndustry(industry.id)}
                className={`px-4 py-2 rounded-full font-medium transition-all ${
                  selectedIndustry === industry.id
                    ? 'bg-primary-600 text-white shadow-lg'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {industry.shortName}
              </button>
            ))}
          </div>

          {/* Active industry content */}
          <motion.div
            key={activeIndustry.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="grid lg:grid-cols-2 gap-8 items-center"
          >
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-primary-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d={industryIcons[activeIndustry.icon]}
                    />
                  </svg>
                </div>
                <h3 className="heading-md text-slate-900">{activeIndustry.name}</h3>
              </div>
              <p className="body-lg mb-6">{activeIndustry.longDescription}</p>

              <ul className="space-y-3 mb-8">
                {activeIndustry.benefits.map((benefit, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <svg
                      className="w-5 h-5 text-secondary-500 flex-shrink-0 mt-0.5"
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
                    <span className="text-slate-700">{benefit}</span>
                  </li>
                ))}
              </ul>

              <div className="flex gap-4">
                <Link href={`/industries/${activeIndustry.slug}`} className="btn-primary">
                  Saiba mais
                </Link>
                <Link href="/demo" className="btn-secondary">
                  Ver demo
                </Link>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-soft-lg border border-slate-100">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center p-4 bg-primary-50 rounded-xl">
                  <div className="text-3xl font-bold text-primary-600 mb-1">
                    {activeIndustry.stats.reduction}
                  </div>
                  <div className="text-sm text-slate-600">
                    {activeIndustry.stats.reductionLabel}
                  </div>
                </div>
                <div className="text-center p-4 bg-secondary-50 rounded-xl">
                  <div className="text-3xl font-bold text-secondary-600 mb-1">
                    {activeIndustry.stats.increase}
                  </div>
                  <div className="text-sm text-slate-600">
                    {activeIndustry.stats.increaseLabel}
                  </div>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-slate-100">
                <p className="text-sm text-slate-500 mb-3">Ideal para:</p>
                <div className="flex flex-wrap gap-2">
                  {activeIndustry.useCases.map((useCase, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-slate-100 text-slate-600 text-sm rounded-full"
                    >
                      {useCase}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="section bg-white">
        <div className="container-marketing">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="badge-accent mb-4">Depoimentos</span>
            <h2 className="heading-lg text-slate-900 mb-4">
              O que nossos clientes dizem
            </h2>
            <p className="body-lg max-w-2xl mx-auto">
              Milhares de negócios já transformaram sua gestão com o Puncto.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard
                key={testimonial.id}
                testimonial={testimonial}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Preview Section */}
      <section className="section bg-slate-50">
        <div className="container-marketing">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="badge-primary mb-4">Planos</span>
            <h2 className="heading-lg text-slate-900 mb-4">
              Escolha o plano ideal para você
            </h2>
            <p className="body-lg max-w-2xl mx-auto mb-8">
              Comece grátis por 14 dias. Sem compromisso, sem cartão de crédito.
            </p>

            {/* Billing toggle */}
            <div className="inline-flex items-center gap-4 bg-white rounded-full p-1 shadow-soft border border-slate-200">
              <button
                onClick={() => setIsAnnual(false)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  !isAnnual
                    ? 'bg-primary-600 text-white'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Mensal
              </button>
              <button
                onClick={() => setIsAnnual(true)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  isAnnual
                    ? 'bg-primary-600 text-white'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Anual
                <span className="ml-2 text-xs bg-secondary-500 text-white px-2 py-0.5 rounded-full">
                  -20%
                </span>
              </button>
            </div>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {pricingPlans.map((plan, index) => (
              <PricingCard
                key={plan.id}
                plan={plan}
                isAnnual={isAnnual}
                index={index}
              />
            ))}
          </div>

          <div className="text-center mt-8">
            <Link href="/pricing" className="link">
              Comparar todos os recursos dos planos
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section bg-white">
        <div className="container-marketing">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="badge-primary mb-4">FAQ</span>
              <h2 className="heading-lg text-slate-900 mb-4">
                Perguntas frequentes
              </h2>
              <p className="body-lg mb-8">
                Não encontrou sua resposta? Entre em contato com nossa equipe.
              </p>
              <Link href="/contact" className="btn-secondary">
                Falar com suporte
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <FAQAccordion items={faqItems.slice(0, 6)} />
              <div className="mt-4 text-center">
                <Link href="/pricing#faq" className="link text-sm">
                  Ver todas as perguntas
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <CTASection
        title="Pronto para transformar seu negócio?"
        description="Junte-se a mais de 500 empresas que já simplificaram sua gestão com o Puncto."
        primaryCTA={{ text: 'Começar Grátis', href: '/auth/signup' }}
        secondaryCTA={{ text: 'Agendar Demonstração', href: '/demo' }}
        variant="gradient"
      />
    </>
  );
}
