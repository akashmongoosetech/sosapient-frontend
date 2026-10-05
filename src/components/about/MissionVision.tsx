import React from 'react';
import { motion } from 'framer-motion';
import { Target, Zap } from 'lucide-react';
import { fadeUp } from '../Home/shared';

const MissionVision: React.FC = () => (
  <section className="bg-gray-50 py-16 dark:bg-gray-800/50 sm:py-20">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Mission — statement panel */}
        <motion.blockquote
          {...fadeUp}
          className="relative overflow-hidden rounded-3xl bg-secondary-900 p-8 text-white shadow-xl sm:p-10"
        >
          <div
            className="pointer-events-none absolute inset-0 opacity-25"
            aria-hidden="true"
            style={{
              backgroundImage: 'radial-gradient(rgba(255,255,255,0.7) 1px, transparent 1px)',
              backgroundSize: '22px 22px',
            }}
          />
          <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-primary-500/40 blur-3xl motion-reduce:animate-none animate-float-slow" aria-hidden="true" />
          <div className="relative">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/20">
              <Target className="h-6 w-6 text-white" aria-hidden="true" />
            </span>
            <p className="mt-5 text-xs font-bold uppercase tracking-widest text-white/60">Our Mission</p>
            <p className="mt-3 text-xl font-medium leading-relaxed sm:text-2xl">
              “To empower businesses with innovative technology solutions that drive growth,
              efficiency, and success in the digital age. We believe technology should be
              accessible, powerful, and transformative.”
            </p>
          </div>
        </motion.blockquote>

        {/* Vision — glass panel with orbit visual */}
        <motion.div
          {...fadeUp}
          transition={{ duration: 0.55, delay: 0.1 }}
          className="relative overflow-hidden rounded-3xl border border-gray-200/70 bg-white/85 p-8 shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-gray-900/85 sm:p-10"
        >
          <div className="flex items-start justify-between gap-6">
            <div className="min-w-0">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-600 to-secondary-600 text-white shadow-md">
                <Zap className="h-6 w-6" aria-hidden="true" />
              </span>
              <p className="mt-5 text-xs font-bold uppercase tracking-widest text-primary-600 dark:text-primary-400">
                Our Vision
              </p>
              <p className="mt-3 text-lg leading-relaxed text-gray-700 dark:text-gray-200">
                To be the world&apos;s most trusted technology partner, known for delivering
                exceptional solutions that shape the future of how businesses operate and
                connect with their customers.
              </p>
            </div>
            <div className="relative hidden h-36 w-36 shrink-0 sm:block" role="img" aria-label="Orbiting focus areas: AI, web, cloud and automation around partnership">
              <div className="absolute inset-0 animate-[spin_26s_linear_infinite] rounded-full border border-dashed border-primary-300 dark:border-primary-700 motion-reduce:animate-none" aria-hidden="true">
                {['AI', 'Web', 'Cloud', 'Auto'].map((t, i) => {
                  const a = (i / 4) * Math.PI * 2;
                  return (
                    <span
                      key={t}
                      className="absolute flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-primary-600 text-[10px] font-bold text-white shadow animate-[spin_26s_linear_infinite_reverse] motion-reduce:animate-none"
                      style={{ left: `${50 + 50 * Math.cos(a)}%`, top: `${50 + 50 * Math.sin(a)}%` }}
                    >
                      {t}
                    </span>
                  );
                })}
              </div>
              <span className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-600 to-secondary-600 text-xs font-bold text-white shadow-lg">
                Us
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);

export default MissionVision;
