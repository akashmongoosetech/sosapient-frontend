import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { SectionHead } from '../Home/shared';
import TechIcon from '../services/TechIcon';

const PILLARS = [
  { tech: 'React.js', outcome: 'Interfaces users love' },
  { tech: 'Next.js', outcome: 'SEO-ready performance' },
  { tech: 'TypeScript', outcome: 'Refactor-safe code' },
  { tech: 'Node.js', outcome: 'APIs that scale' },
  { tech: 'MongoDB', outcome: 'Flexible product data' },
  { tech: 'PostgreSQL', outcome: 'Transactions you trust' },
  { tech: 'OpenAI', outcome: 'AI that earns its keep' },
  { tech: 'AWS', outcome: 'Infra that stays up' },
];

const TechMindset: React.FC = () => (
  <section className="relative overflow-hidden bg-gray-950 py-16 sm:py-20">
    <div className="pointer-events-none absolute inset-0" aria-hidden="true">
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: 'radial-gradient(rgba(155,129,199,0.5) 1px, transparent 1px)',
          backgroundSize: '26px 26px',
        }}
      />
      <div className="absolute -left-24 top-0 h-80 w-80 rounded-full bg-violet-600/25 blur-3xl motion-reduce:animate-none animate-float-slow" />
      <div className="absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-primary-600/25 blur-3xl motion-reduce:animate-none animate-float-slower" />
    </div>
    <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <SectionHead
        inverse
        eyebrow="Technology Mindset"
        title="Right tool, real outcome"
        sub="We don't chase stacks — we match proven technology to the business result it must produce."
      />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {PILLARS.map((p, i) => (
          <motion.div
            key={p.tech}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: (i % 4) * 0.07 }}
            whileHover={{ y: -4 }}
            className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur transition-colors hover:border-violet-400/40"
          >
            <TechIcon name={p.tech} />
            <span className="min-w-0">
              <span className="block text-sm font-bold text-white">{p.tech}</span>
              <span className="block truncate text-xs text-gray-400">{p.outcome}</span>
            </span>
          </motion.div>
        ))}
      </div>
      <p className="mt-8 text-center">
        <Link
          to="/services"
          className="group inline-flex min-h-[48px] items-center gap-2 rounded-xl bg-white px-7 py-3 font-semibold text-gray-900 transition hover:bg-gray-100"
        >
          Explore Our Services
          <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
        </Link>
      </p>
    </div>
  </section>
);

export default TechMindset;
