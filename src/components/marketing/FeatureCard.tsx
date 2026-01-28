'use client';

import { motion } from 'framer-motion';
import { Feature, iconComponents } from '@/content/features';

interface FeatureCardProps {
  feature: Feature;
  index: number;
}

export default function FeatureCard({ feature, index }: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group bg-white rounded-2xl p-6 md:p-8 shadow-soft border border-slate-100 hover:shadow-soft-xl hover:-translate-y-1 transition-all duration-300"
    >
      <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary-100 transition-colors">
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
            d={iconComponents[feature.icon]}
          />
        </svg>
      </div>

      <h3 className="heading-md text-slate-900 mb-3">{feature.title}</h3>
      <p className="body text-slate-500 mb-6">{feature.description}</p>

      <ul className="space-y-3 mb-6">
        {feature.benefits.map((benefit, i) => (
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
            <span className="text-sm text-slate-600">{benefit}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}