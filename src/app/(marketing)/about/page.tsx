'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

import CTASection from '@/components/marketing/CTASection';
import StatsCounter from '@/components/marketing/StatsCounter';

// Team information will be added when available
const teamMembers: Array<{ name: string; role: string; bio: string }> = [];

const values = [
  {
    title: 'Simplicidade',
    description:
      'Acreditamos que a tecnologia deve simplificar a vida, não complicar. Por isso, criamos soluções intuitivas.',
    icon: 'M13 10V3L4 14h7v7l9-11h-7z',
  },
  {
    title: 'Parceria',
    description:
      'O sucesso do nosso cliente é o nosso sucesso. Trabalhamos lado a lado para alcançar resultados.',
    icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z',
  },
  {
    title: 'Inovação',
    description:
      'Buscamos constantemente novas formas de resolver problemas antigos e criar valor para nossos clientes.',
    icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z',
  },
  {
    title: 'Transparência',
    description:
      'Preços claros, comunicação honesta e compromisso com a verdade em todas as interações.',
    icon: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z',
  },
];

const milestones = [
  { year: '2023', title: 'Fundação', description: 'Puncto nasce para simplificar a gestão de negócios de serviços no Brasil' },
  { year: '2024', title: 'Lançamento', description: 'Primeira versão da plataforma com agendamento e pagamentos integrados' },
];

export default function AboutPage() {
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
            <span className="badge-primary mb-4">Sobre nós</span>
            <h1 className="heading-xl text-slate-900 mb-6">
              Simplificando a gestão de negócios no Brasil
            </h1>
            <p className="body-lg">
              Nascemos da frustração de empreendedores que perdiam tempo com
              sistemas complicados. Nossa missão é trazer tecnologia de ponta para
              pequenos e médios negócios de forma simples e acessível.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <StatsCounter />

      {/* Our Story */}
      <section className="section bg-white">
        <div className="container-marketing">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="heading-lg text-slate-900 mb-6">Nossa história</h2>
              <div className="space-y-4 text-slate-600">
                <p>
                  O Puncto nasceu em 2023 com uma visão dupla: oferecer uma plataforma 
                  SaaS acessível para pequenos e médios negócios de serviços, e também 
                  desenvolver sistemas customizados para grandes empresas e indústrias.
                </p>
                <p>
                  Para pequenos negócios, criamos uma plataforma completa que reúne 
                  agendamento, pagamentos, estoque e gestão em um único sistema simples 
                  e acessível. Para grandes empresas, desenvolvemos soluções sob medida 
                  que se integram aos processos existentes e resolvem desafios específicos.
                </p>
                <p>
                  Nossa missão é tornar a tecnologia acessível para todos os tamanhos 
                  de negócio, seja através de nossa plataforma SaaS pronta para uso ou 
                  através de desenvolvimento customizado para necessidades específicas.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl aspect-square flex items-center justify-center"
            >
              <div className="text-center text-slate-400">
                <svg
                  className="w-24 h-24 mx-auto mb-4 text-slate-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
                <p className="font-medium">Foto do escritório</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section bg-slate-50">
        <div className="container-marketing">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="heading-lg text-slate-900 mb-4">Nossos valores</h2>
            <p className="body-lg max-w-2xl mx-auto">
              Os princípios que guiam tudo o que fazemos.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-soft border border-slate-100"
              >
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mb-4">
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
                      d={value.icon}
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  {value.title}
                </h3>
                <p className="text-slate-600 text-sm">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section bg-white">
        <div className="container-marketing">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="heading-lg text-slate-900 mb-4">Nossa jornada</h2>
          </motion.div>

          <div className="max-w-3xl mx-auto">
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-primary-200 transform md:-translate-x-1/2" />

              {milestones.map((milestone, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={`relative flex items-center mb-8 ${
                    index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                >
                  {/* Dot */}
                  <div className="absolute left-4 md:left-1/2 w-4 h-4 bg-primary-500 rounded-full transform -translate-x-1/2 z-10 ring-4 ring-white" />

                  {/* Content */}
                  <div
                    className={`ml-12 md:ml-0 md:w-1/2 ${
                      index % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12'
                    }`}
                  >
                    <span className="badge-primary mb-2">{milestone.year}</span>
                    <h3 className="text-lg font-semibold text-slate-900">
                      {milestone.title}
                    </h3>
                    <p className="text-slate-600 text-sm">
                      {milestone.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section id="team" className="section bg-slate-50">
        <div className="container-marketing">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="heading-lg text-slate-900 mb-4">Nosso time</h2>
            <p className="body-lg max-w-2xl mx-auto">
              Uma equipe apaixonada por resolver problemas reais de empreendedores
              brasileiros.
            </p>
          </motion.div>

          {teamMembers.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {teamMembers.map((member, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl p-6 shadow-soft border border-slate-100 text-center"
                >
                  <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-primary-600">
                      {member.name.charAt(0)}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900">
                    {member.name}
                  </h3>
                  <p className="text-primary-600 text-sm font-medium mb-2">
                    {member.role}
                  </p>
                  <p className="text-slate-600 text-sm">{member.bio}</p>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-slate-600">
                Informações da equipe serão adicionadas em breve.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Careers */}
      <section id="careers" className="section bg-white">
        <div className="container-marketing">
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-8 md:p-12 text-white text-center">
            <h2 className="text-3xl font-bold mb-4">Junte-se ao time</h2>
            <p className="text-primary-100 text-lg mb-8 max-w-2xl mx-auto">
              Estamos sempre buscando pessoas talentosas e apaixonadas por
              tecnologia e inovação. Confira nossas vagas abertas.
            </p>
            <Link
              href="/contact?subject=careers"
              className="btn bg-white text-primary-600 hover:bg-slate-100"
            >
              Ver vagas abertas
            </Link>
          </div>
        </div>
      </section>

      {/* Press */}
      <section id="press" className="section bg-slate-50">
        <div className="container-marketing">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="heading-lg text-slate-900 mb-4">Na imprensa</h2>
            <p className="body-lg max-w-2xl mx-auto">
              O que estão dizendo sobre o Puncto.
            </p>
          </motion.div>

          <div className="text-center py-12">
            <p className="text-slate-600 mb-4">
              Materiais de imprensa serão adicionados quando disponíveis.
            </p>
            <p className="text-sm text-slate-500">
              Para solicitações de imprensa, entre em contato através do formulário abaixo.
            </p>
          </div>

          <div className="text-center mt-8">
            <Link href="/contact?subject=press" className="btn-secondary">
              Contato para imprensa
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <CTASection variant="gradient" />
    </>
  );
}
