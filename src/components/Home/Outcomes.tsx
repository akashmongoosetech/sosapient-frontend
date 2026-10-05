import React from 'react';
import { motion } from 'framer-motion';
import { SectionHead, useCountUp, useSectionInView } from './shared';

const metrics = [
  { value: 50, suffix: '+', label: 'Projects Delivered', sub: 'across web, mobile, AI and automation' },
  { value: 20, suffix: '+', label: 'Happy Clients', sub: 'startups to enterprises, worldwide' },
  { value: 98, suffix: '%', label: 'Client Satisfaction', sub: 'measured on delivery and support' },
  { value: 25, suffix: '+', label: 'Expert Developers', sub: 'engineering, design, AI and growth' },
];

const Outcomes: React.FC = () => {
  const { ref, inView } = useSectionInView<HTMLDivElement>(0.35);
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 to-secondary-700 py-16 sm:py-20">
      <div
        className="pointer-events-none absolute inset-0 opacity-20"
        aria-hidden="true"
        style={{
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.7) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHead
          inverse
          eyebrow="Outcomes"
          title="Numbers we stand behind"
          sub="The same figures you'll find across our site — no inflated claims, just the track record."
        />
        <div ref={ref} className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {metrics.map((m, i) => (
            <Metric key={m.label} metric={m} started={inView} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

function Metric({ metric, started, index }: { metric: (typeof metrics)[number]; started: boolean; index: number }) {
  const v = useCountUp(metric.value, started);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={started ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="rounded-2xl bg-white/10 p-6 text-center backdrop-blur ring-1 ring-white/20"
    >
      <p className="text-3xl font-bold text-white sm:text-4xl">
        {v}
        {metric.suffix}
      </p>
      <p className="mt-1 font-semibold text-white">{metric.label}</p>
      <p className="mt-1 text-xs text-blue-100">{metric.sub}</p>
    </motion.div>
  );
}

export default Outcomes;
