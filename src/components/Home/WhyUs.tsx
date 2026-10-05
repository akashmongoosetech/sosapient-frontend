import React from 'react';
import { motion } from 'framer-motion';
import { Code2, Brain, Layers, HeartHandshake, Palette, ShieldCheck } from 'lucide-react';
import { SectionHead, fadeUp } from './shared';

const points = [
  { icon: Code2, title: 'Engineering First', text: 'Typed code, tested paths, reviewed pull requests. We build software your future team can extend.' },
  { icon: Brain, title: 'AI-Native Thinking', text: 'Every system designed with automation and intelligence in mind — not bolted on afterwards.' },
  { icon: Layers, title: 'Scalable Architecture', text: 'Multi-tenant patterns, queued workloads and caches from day one, so growth never needs a rewrite.' },
  { icon: HeartHandshake, title: 'Business-Focused', text: 'We start from the outcome — faster billing, fewer tickets, more bookings — and work backwards to tech.' },
  { icon: Palette, title: 'Modern UI/UX', text: 'Interfaces your users enjoy: responsive, accessible and consistent through real design systems.' },
  { icon: ShieldCheck, title: 'Security-Conscious', text: 'Encrypted data, hardened auth and audited access. Protection is part of the build, not an add-on.' },
];

const WhyUs: React.FC = () => (
  <section className="bg-white py-16 dark:bg-gray-900 sm:py-20">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <SectionHead
        eyebrow="Why SoSapient"
        title="A partner, not just a vendor"
        sub="What working with us actually feels like — in how we build, communicate and support you after launch."
      />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {points.map((p, i) => (
          <motion.div
            key={p.title}
            {...fadeUp}
            transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
            className="group rounded-2xl border border-gray-100 bg-gray-50 p-6 transition-all hover:-translate-y-1 hover:shadow-lg dark:border-gray-800 dark:bg-gray-800/60"
          >
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary-600 to-secondary-600 text-white shadow-md transition-transform group-hover:scale-105">
              <p.icon className="h-5 w-5" aria-hidden="true" />
            </span>
            <h3 className="mt-4 font-bold text-gray-900 dark:text-white">{p.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-300">{p.text}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default WhyUs;
