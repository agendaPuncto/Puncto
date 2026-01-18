'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface Stat {
  value: number;
  suffix?: string;
  prefix?: string;
  label: string;
  description?: string;
}

interface StatsCounterProps {
  stats?: Stat[];
}

const defaultStats: Stat[] = [
  {
    value: 500,
    suffix: '+',
    label: 'Negócios ativos',
    description: 'Empresas confiam no Puncto',
  },
  {
    value: 50000,
    suffix: '+',
    label: 'Agendamentos/mês',
    description: 'Processados na plataforma',
  },
  {
    value: 99.9,
    suffix: '%',
    label: 'Uptime',
    description: 'Disponibilidade garantida',
  },
  {
    value: 4.9,
    suffix: '/5',
    label: 'Avaliação',
    description: 'Nota dos clientes',
  },
];

function AnimatedNumber({
  value,
  suffix = '',
  prefix = '',
}: {
  value: number;
  suffix?: string;
  prefix?: string;
}) {
  const [displayValue, setDisplayValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;

    const duration = 2000; // 2 seconds
    const steps = 60;
    const increment = value / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue(current);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [isInView, value]);

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return Math.floor(num).toLocaleString('pt-BR');
    }
    if (num % 1 !== 0) {
      return num.toFixed(1);
    }
    return Math.floor(num).toString();
  };

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}
      {formatNumber(displayValue)}
      {suffix}
    </span>
  );
}

export default function StatsCounter({ stats = defaultStats }: StatsCounterProps) {
  return (
    <section className="section-sm bg-slate-900 text-white">
      <div className="container-marketing">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                <AnimatedNumber
                  value={stat.value}
                  suffix={stat.suffix}
                  prefix={stat.prefix}
                />
              </div>
              <div className="text-lg font-semibold text-primary-300 mb-1">
                {stat.label}
              </div>
              {stat.description && (
                <div className="text-sm text-slate-400">{stat.description}</div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
