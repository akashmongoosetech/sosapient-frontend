import React from 'react';
import { motion } from 'framer-motion';
import { Layers } from 'lucide-react';
import { TECHNOLOGIES } from './TechStack';
import { SectionHead, fadeUp } from './shared';

const picks = [
  'React', 'Next.js', 'TypeScript', 'Node.js', 'Python', 'MongoDB',
  'PostgreSQL', 'Docker', 'AWS', 'OpenAI',
];

function tech(name: string) {
  return TECHNOLOGIES.find((t) => t.name === name) ?? TECHNOLOGIES[0];
}

const groups = [
  { label: 'Frontend', items: ['React', 'Next.js', 'TypeScript'] },
  { label: 'Backend', items: ['Node.js', 'Python'] },
  { label: 'Data', items: ['MongoDB', 'PostgreSQL'] },
  { label: 'Cloud', items: ['Docker', 'AWS'] },
  { label: 'AI', items: ['OpenAI'] },
];

const TechEcosystem: React.FC = () => {
  const ring1 = picks.slice(0, 5);
  const ring2 = picks.slice(5);
  return (
    <section className="relative overflow-hidden bg-gray-950 py-16 sm:py-20">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute left-1/2 top-1/2 h-[560px] w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-600/15 blur-3xl" />
      </div>
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHead
          inverse
          eyebrow="Ecosystem"
          title="One stack, end to end"
          sub="A curated set of technologies we know deeply — so your product never depends on a tool we barely understand."
        />
        <div className="grid items-center gap-10 lg:grid-cols-2">
          {/* Orbit visual */}
          <motion.div
            {...fadeUp}
            className="relative mx-auto aspect-square w-full max-w-[440px]"
            role="img"
            aria-label="Orbit diagram of our core technology stack"
          >
            <div className="absolute inset-0 animate-[spin_46s_linear_infinite] rounded-full border border-dashed border-white/15 motion-reduce:animate-none" aria-hidden="true">
              {ring1.map((n, i) => {
                const t = tech(n);
                const a = (i / ring1.length) * Math.PI * 2;
                return (
                  <span
                    key={n}
                    className="absolute flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-xl border border-white/10 bg-gray-900 p-2 shadow-lg animate-[spin_46s_linear_infinite_reverse] motion-reduce:animate-none"
                    style={{ left: `${50 + 50 * Math.cos(a)}%`, top: `${50 + 50 * Math.sin(a)}%` }}
                    title={t.name}
                  >
                    <img src={t.logo} alt={t.name} loading="lazy" decoding="async" className="h-full w-full object-contain" />
                  </span>
                );
              })}
            </div>
            <div className="absolute inset-[15%] animate-[spin_64s_linear_infinite_reverse] rounded-full border border-dashed border-white/10 motion-reduce:animate-none" aria-hidden="true">
              {ring2.map((n, i) => {
                const t = tech(n);
                const a = (i / ring2.length) * Math.PI * 2;
                return (
                  <span
                    key={n}
                    className="absolute flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-xl border border-white/10 bg-gray-900 p-2 shadow-lg animate-[spin_64s_linear_infinite] motion-reduce:animate-none"
                    style={{ left: `${50 + 50 * Math.cos(a)}%`, top: `${50 + 50 * Math.sin(a)}%` }}
                    title={t.name}
                  >
                    <img src={t.logo} alt={t.name} loading="lazy" decoding="async" className="h-full w-full object-contain" />
                  </span>
                );
              })}
            </div>
            <div className="absolute left-1/2 top-1/2 flex h-28 w-28 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-3xl bg-gradient-to-br from-primary-600 to-secondary-600 text-white shadow-2xl">
              <Layers className="h-7 w-7" aria-hidden="true" />
              <span className="mt-1 text-xs font-bold">Our Stack</span>
            </div>
          </motion.div>

          {/* Groups */}
          <div className="flex flex-col gap-3">
            {groups.map((g, gi) => (
              <motion.div
                key={g.label}
                {...fadeUp}
                transition={{ duration: 0.5, delay: gi * 0.07 }}
                className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur"
              >
                <p className="text-xs font-bold uppercase tracking-widest text-violet-300">{g.label}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {g.items.map((n) => {
                    const t = tech(n);
                    return (
                      <span key={n} className="inline-flex items-center gap-2 rounded-full bg-white/10 py-1.5 pl-1.5 pr-3 text-sm font-semibold text-white">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white p-1">
                          <img src={t.logo} alt={`${t.name} logo`} loading="lazy" decoding="async" className="h-full w-full object-contain" />
                        </span>
                        {t.name}
                      </span>
                    );
                  })}
                </div>
              </motion.div>
            ))}
            <p className="text-sm text-gray-400">
              Plus {TECHNOLOGIES.length - picks.length} more across mobile, DevOps and automation — see the full strip above.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TechEcosystem;
