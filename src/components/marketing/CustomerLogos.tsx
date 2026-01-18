'use client';

import { motion } from 'framer-motion';

interface CustomerLogosProps {
  title?: string;
  variant?: 'default' | 'marquee';
}

// Placeholder logos - in production, these would be actual customer logos
const logos = [
  { name: 'Studio Beauty', initial: 'SB' },
  { name: 'Clínica Vida', initial: 'CV' },
  { name: 'Bistrô Premium', initial: 'BP' },
  { name: 'Salão Elegance', initial: 'SE' },
  { name: 'Pão Artesanal', initial: 'PA' },
  { name: 'Spa Relaxe', initial: 'SR' },
  { name: 'Restaurante Gourmet', initial: 'RG' },
  { name: 'Barbearia Classic', initial: 'BC' },
  { name: 'Nail Design', initial: 'ND' },
  { name: 'Clínica Estética', initial: 'CE' },
];

export default function CustomerLogos({
  title = 'Empresas que confiam no Puncto',
  variant = 'default',
}: CustomerLogosProps) {
  if (variant === 'marquee') {
    return (
      <section className="py-12 bg-white overflow-hidden">
        <div className="container-marketing mb-8">
          <p className="text-center text-slate-500 font-medium">{title}</p>
        </div>
        <div className="relative">
          <div className="flex gap-8 animate-marquee">
            {[...logos, ...logos].map((logo, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-32 h-16 bg-slate-100 rounded-lg flex items-center justify-center"
              >
                <span className="text-xl font-bold text-slate-400">
                  {logo.initial}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-white">
      <div className="container-marketing">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-slate-500 font-medium mb-8"
        >
          {title}
        </motion.p>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          {logos.slice(0, 10).map((logo, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="h-16 bg-slate-50 rounded-lg flex items-center justify-center hover:bg-slate-100 transition-colors"
            >
              <span className="text-xl font-bold text-slate-400">
                {logo.initial}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Add marquee animation to tailwind.config.mjs if needed
// animation: { 'marquee': 'marquee 30s linear infinite' }
// keyframes: { marquee: { '0%': { transform: 'translateX(0)' }, '100%': { transform: 'translateX(-50%)' } } }
