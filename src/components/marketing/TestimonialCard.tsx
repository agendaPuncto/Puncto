'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  company: string;
  avatar?: string;
  rating?: number;
}

interface TestimonialCardProps {
  testimonial: Testimonial;
  index?: number;
}

export default function TestimonialCard({ testimonial, index = 0 }: TestimonialCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-white rounded-2xl p-6 md:p-8 shadow-soft border border-slate-100"
    >
      {/* Rating stars */}
      {testimonial.rating && (
        <div className="flex gap-1 mb-4">
          {[...Array(5)].map((_, i) => (
            <svg
              key={i}
              className={`w-5 h-5 ${
                i < testimonial.rating! ? 'text-accent-400' : 'text-slate-200'
              }`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
      )}

      {/* Quote */}
      <blockquote className="text-slate-700 text-lg mb-6 leading-relaxed">
        &ldquo;{testimonial.quote}&rdquo;
      </blockquote>

      {/* Author */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center overflow-hidden">
          {testimonial.avatar ? (
            <Image
              src={testimonial.avatar}
              alt={testimonial.author}
              width={48}
              height={48}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-primary-600 font-semibold text-lg">
              {testimonial.author.charAt(0)}
            </span>
          )}
        </div>
        <div>
          <div className="font-semibold text-slate-900">{testimonial.author}</div>
          <div className="text-sm text-slate-500">
            {testimonial.role} @ {testimonial.company}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Sample testimonials data
export const testimonials: Testimonial[] = [
  {
    id: '1',
    quote:
      'O Puncto transformou completamente a forma como gerenciamos nosso salão. Reduzimos os no-shows em 70% e aumentamos nossa receita em 35%.',
    author: 'Mariana Silva',
    role: 'Proprietária',
    company: 'Studio M Beauty',
    rating: 5,
  },
  {
    id: '2',
    quote:
      'A comanda digital e o controle de mesas em tempo real salvaram nosso restaurante. Os clientes adoram fazer pedidos pelo celular.',
    author: 'Carlos Rodrigues',
    role: 'Gerente',
    company: 'Bistrô do Carlos',
    rating: 5,
  },
  {
    id: '3',
    quote:
      'O controle de ponto eletrônico nos ajudou a organizar a escala de toda a equipe. A integração com a folha de pagamento é perfeita.',
    author: 'Fernanda Costa',
    role: 'RH',
    company: 'Clínica Vida Plena',
    rating: 5,
  },
  {
    id: '4',
    quote:
      'Finalmente um sistema que entende as necessidades de uma padaria artesanal. Os pedidos personalizados ficaram muito mais fáceis de gerenciar.',
    author: 'João Pedro',
    role: 'Proprietário',
    company: 'Pão de Casa',
    rating: 5,
  },
];
