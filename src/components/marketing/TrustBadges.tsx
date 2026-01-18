'use client';

import { motion } from 'framer-motion';

interface TrustBadgesProps {
  variant?: 'default' | 'compact';
}

export default function TrustBadges({ variant = 'default' }: TrustBadgesProps) {
  const badges = [
    {
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" />
        </svg>
      ),
      title: 'SSL Seguro',
      description: 'Conexão criptografada',
    },
    {
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 32 32" fill="currentColor">
          <path d="M16 4c-6.617 0-12 5.383-12 12s5.383 12 12 12c1.671 0 3.266-.347 4.719-.969l1.219 1.719c.18.252.47.406.781.406h2.281c.552 0 1-.448 1-1v-2.281c0-.311-.154-.601-.406-.781l-1.719-1.219c.622-1.453.969-3.048.969-4.719 0-6.617-5.383-12-12-12zm0 2c5.535 0 10 4.465 10 10 0 1.35-.281 2.631-.781 3.813l-.156.312.219.25 1.719 1.219v1.406h-1.406l-1.219-1.719-.25-.219-.312.156c-1.182.5-2.463.781-3.813.781-5.535 0-10-4.465-10-10s4.465-10 10-10z" />
        </svg>
      ),
      title: 'LGPD',
      description: 'Dados protegidos',
    },
    {
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 32 32" fill="currentColor">
          <path d="M16 2a6 6 0 0 0-6 6v4H8a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V14a2 2 0 0 0-2-2h-2V8a6 6 0 0 0-6-6zm0 2a4 4 0 0 1 4 4v4h-8V8a4 4 0 0 1 4-4zm0 12a2 2 0 0 1 1 3.73V22a1 1 0 1 1-2 0v-2.27A2 2 0 0 1 16 16z" />
        </svg>
      ),
      title: 'Dados Seguros',
      description: 'Backup automático',
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M13 9h-2v2H9v2h2v2h2v-2h2v-2h-2V9zm7.999-1.5V4.994A1.997 1.997 0 0 0 19.006 3h-2.5l-2.5-2H10L7.5 3h-2.5A1.997 1.997 0 0 0 3 4.994V7.5L1 10v4l2 2.5v2.506A1.997 1.997 0 0 0 4.994 21h2.5l2.5 2h4l2.5-2h2.506A1.997 1.997 0 0 0 21 19.006V16.5l2-2.5v-4l-2-2.5zM20 14.69l-1.31 1.64v2.67h-2.67L14.38 20.31H9.62L8.27 19H5.73v-2.67L4.42 14.69V9.31L5.73 7.96V5.29h2.67L9.62 3.69h4.76l1.35 1.6h2.27v2.67l1.31 1.35v5.38z" />
        </svg>
      ),
      title: 'Stripe',
      description: 'Pagamentos seguros',
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
        </svg>
      ),
      title: '99.9% Uptime',
      description: 'Disponibilidade garantida',
    },
  ];

  if (variant === 'compact') {
    return (
      <div className="flex flex-wrap justify-center gap-6">
        {badges.slice(0, 4).map((badge, index) => (
          <div
            key={index}
            className="flex items-center gap-2 text-slate-500"
          >
            <span className="text-slate-400">{badge.icon}</span>
            <span className="text-sm font-medium">{badge.title}</span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <section className="py-8 bg-slate-50 border-y border-slate-200">
      <div className="container-marketing">
        <div className="flex flex-wrap justify-center gap-8 md:gap-12">
          {badges.map((badge, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center gap-3"
            >
              <div className="w-10 h-10 bg-white rounded-lg shadow-sm flex items-center justify-center text-slate-400">
                {badge.icon}
              </div>
              <div>
                <p className="font-semibold text-slate-900 text-sm">
                  {badge.title}
                </p>
                <p className="text-slate-500 text-xs">{badge.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
