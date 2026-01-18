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
      className="card-hover p-6 md:p-8 group"
    >
      {/* Icon */}
      <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary-500 transition-colors">
        <svg
          className="w-6 h-6 text-primary-600 group-hover:text-white transition-colors"
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

      {/* Title */}
      <h3 className="heading-sm text-slate-900 mb-2">{feature.title}</h3>

      {/* Description */}
      <p className="body-md mb-4">{feature.description}</p>

      {/* Stats badge */}
      <div className="inline-flex items-center gap-2 bg-secondary-50 text-secondary-700 px-3 py-1.5 rounded-lg text-sm font-medium">
        <span className="text-lg font-bold">{feature.stats.value}</span>
        <span>{feature.stats.label}</span>
      </div>
    </motion.div>
  );
}

// Compact version for grids
export function FeatureCardCompact({ feature, index }: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className="flex items-start gap-4 p-4"
    >
      <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
        <svg
          className="w-5 h-5 text-primary-600"
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
      <div>
        <h4 className="font-semibold text-slate-900 mb-1">{feature.title}</h4>
        <p className="text-sm text-slate-600">{feature.description}</p>
      </div>
    </motion.div>
  );
}
