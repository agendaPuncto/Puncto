'use client';

import { motion } from 'framer-motion';

// Security and Compliance Badges
export function SecurityBadges({ className = '' }: { className?: string }) {
  return (
    <div className={`flex flex-wrap items-center justify-center gap-6 ${className}`}>
      {/* SSL Badge */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="flex items-center gap-2 bg-white rounded-lg px-4 py-2 border border-slate-200"
      >
        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
          />
        </svg>
        <div>
          <p className="text-xs font-semibold text-slate-900">SSL Secured</p>
          <p className="text-xs text-slate-500">256-bit encryption</p>
        </div>
      </motion.div>

      {/* Stripe Badge */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        className="flex items-center gap-2 bg-white rounded-lg px-4 py-2 border border-slate-200"
      >
        <svg className="w-10 h-8" viewBox="0 0 60 25">
          <path
            fill="#635BFF"
            d="M59.64 14.28h-8.06c.19 1.93 1.6 2.55 3.2 2.55 1.64 0 2.96-.37 4.05-.95v3.32a12.7 12.7 0 01-4.56.82c-4.18 0-6.95-2.74-6.95-7.03 0-4.29 2.63-7.05 6.33-7.05 3.68 0 6.08 2.76 6.08 7.05 0 .41-.03.86-.09 1.29zm-5.99-5.52c-1.26 0-2.1.95-2.27 2.47h4.44c-.04-1.52-.83-2.47-2.17-2.47zM42.6 20.02V6.28h4.16v1.27c.88-.97 2.16-1.56 3.67-1.56V9.9c-.17-.04-.35-.04-.53-.04-1.23 0-2.4.49-3.14 1.27v8.89H42.6zM34.5 0h4.16v20.02H34.5V0zm-4.56 6.01c1.22 0 2.21.28 3.07.76v3.94a5.33 5.33 0 00-2.64-.71c-1.97 0-3.34 1.19-3.34 3.03 0 1.88 1.37 3.07 3.34 3.07 1.02 0 1.88-.25 2.64-.71v3.94a7.3 7.3 0 01-3.07.67c-4.22 0-7.05-2.8-7.05-6.97 0-4.13 2.83-7.02 7.05-7.02zM15.75 20.02V12.2c0-1.48-.71-2.1-1.88-2.1-1.26 0-2.23.62-2.85 1.27v8.65H6.86V12.2c0-1.48-.71-2.1-1.88-2.1-1.22 0-2.19.62-2.81 1.27v8.65H0V6.28h4.16v1.35c.92-1.02 2.27-1.64 3.81-1.64 1.67 0 3.04.71 3.67 2.01 1.02-1.23 2.54-2.01 4.26-2.01 2.5 0 4.01 1.48 4.01 4.34v9.69h-4.16z"
          />
        </svg>
        <div>
          <p className="text-xs font-semibold text-slate-900">Stripe</p>
          <p className="text-xs text-slate-500">Pagamentos seguros</p>
        </div>
      </motion.div>

      {/* LGPD Badge */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
        className="flex items-center gap-2 bg-white rounded-lg px-4 py-2 border border-slate-200"
      >
        <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <div>
          <p className="text-xs font-semibold text-slate-900">LGPD</p>
          <p className="text-xs text-slate-500">Conformidade total</p>
        </div>
      </motion.div>

      {/* ISO 27001 Badge */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
        className="flex items-center gap-2 bg-white rounded-lg px-4 py-2 border border-slate-200"
      >
        <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
          />
        </svg>
        <div>
          <p className="text-xs font-semibold text-slate-900">Segurança</p>
          <p className="text-xs text-slate-500">Dados protegidos</p>
        </div>
      </motion.div>
    </div>
  );
}

// Industry Certifications
interface Certification {
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

const certifications: Certification[] = [
  {
    name: 'Google Cloud Partner',
    description: 'Infraestrutura em nuvem de alta disponibilidade',
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
      </svg>
    ),
    color: 'bg-blue-50',
  },
  {
    name: 'Firebase Certified',
    description: 'Banco de dados em tempo real',
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24">
        <path fill="#FFA000" d="M3.89 15.672L6.255.461A.542.542 0 017.27.289l2.543 4.771L3.89 15.672z" />
        <path fill="#F57C00" d="M20.11 15.672L17.745.461a.542.542 0 00-1.015-.172l-2.543 4.771 5.923 10.612z" />
        <path fill="#FFCA28" d="M12 22.49L3.89 15.672l8.11-5.83 8.11 5.83L12 22.49z" />
        <path fill="#FFA000" d="M12 16.56l-8.11-.888 8.11-5.83 8.11 5.83-8.11.888z" />
      </svg>
    ),
    color: 'bg-orange-50',
  },
  {
    name: 'Stripe Verified',
    description: 'Processamento de pagamentos PCI DSS Level 1',
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24">
        <path fill="#635BFF" d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.591-7.305z" />
      </svg>
    ),
    color: 'bg-indigo-50',
  },
  {
    name: 'SOC 2 Type II',
    description: 'Controles de segurança auditados',
    icon: (
      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    color: 'bg-green-50',
  },
];

export function CertificationsBadges({ className = '' }: { className?: string }) {
  return (
    <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 ${className}`}>
      {certifications.map((cert, index) => (
        <motion.div
          key={cert.name}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.1 }}
          className={`${cert.color} rounded-xl p-4 text-center`}
        >
          <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center mx-auto mb-3 shadow-sm">
            {cert.icon}
          </div>
          <h4 className="font-semibold text-slate-900 text-sm mb-1">{cert.name}</h4>
          <p className="text-xs text-slate-600">{cert.description}</p>
        </motion.div>
      ))}
    </div>
  );
}

// Industry Awards
interface Award {
  name: string;
  organization: string;
  year: string;
  icon?: React.ReactNode;
}

const awards: Award[] = [
  {
    name: 'Melhor Startup SaaS',
    organization: 'Startup Awards Brasil',
    year: '2024',
  },
  {
    name: 'Top 10 Startups B2B',
    organization: 'Distrito',
    year: '2024',
  },
  {
    name: 'Inovação em Gestão',
    organization: 'ABF',
    year: '2023',
  },
  {
    name: 'Best UX Design',
    organization: 'UX Collective',
    year: '2023',
  },
];

export function AwardsBadges({ className = '' }: { className?: string }) {
  return (
    <div className={`flex flex-wrap items-center justify-center gap-6 ${className}`}>
      {awards.map((award, index) => (
        <motion.div
          key={award.name}
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.1 }}
          className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl px-6 py-4 text-center border border-amber-200"
        >
          <div className="w-10 h-10 bg-amber-400 rounded-full flex items-center justify-center mx-auto mb-2">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </div>
          <p className="font-semibold text-amber-900 text-sm">{award.name}</p>
          <p className="text-xs text-amber-700">{award.organization}</p>
          <p className="text-xs text-amber-600">{award.year}</p>
        </motion.div>
      ))}
    </div>
  );
}

// Partner Logos
const partners = [
  { name: 'Stripe', logo: '/partners/stripe.svg' },
  { name: 'Firebase', logo: '/partners/firebase.svg' },
  { name: 'Vercel', logo: '/partners/vercel.svg' },
  { name: 'Twilio', logo: '/partners/twilio.svg' },
  { name: 'Meta', logo: '/partners/meta.svg' },
  { name: 'Google Cloud', logo: '/partners/google-cloud.svg' },
];

export function PartnerLogos({ className = '' }: { className?: string }) {
  return (
    <div className={`flex flex-wrap items-center justify-center gap-8 ${className}`}>
      {partners.map((partner, index) => (
        <motion.div
          key={partner.name}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.1 }}
          className="grayscale hover:grayscale-0 transition-all opacity-60 hover:opacity-100"
        >
          <div className="h-8 flex items-center justify-center">
            <span className="text-lg font-semibold text-slate-400">{partner.name}</span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// Combined Trust Section
export function TrustSection() {
  return (
    <section className="section bg-slate-50">
      <div className="container-marketing">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="badge-secondary mb-4">Confiança</span>
          <h2 className="heading-lg text-slate-900 mb-4">
            Segurança e conformidade de nível empresarial
          </h2>
          <p className="body-lg max-w-2xl mx-auto">
            Seus dados estão protegidos com as melhores práticas de segurança
            do mercado.
          </p>
        </motion.div>

        {/* Security Badges */}
        <SecurityBadges className="mb-12" />

        {/* Certifications */}
        <CertificationsBadges className="mb-12" />

        {/* Partners */}
        <div className="pt-8 border-t border-slate-200">
          <p className="text-center text-sm text-slate-500 mb-6">
            Tecnologia de parceiros líderes mundiais
          </p>
          <PartnerLogos />
        </div>
      </div>
    </section>
  );
}
