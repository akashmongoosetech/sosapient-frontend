import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, MapPin } from 'lucide-react';
import { SectionHead, useCountUp, useSectionInView } from '../Home/shared';

const stats = [
  { value: 50, suffix: '+', label: 'Projects Delivered' },
  { value: 20, suffix: '+', label: 'Happy Clients' },
  { value: 25, suffix: '+', label: 'Team Members' },
  { value: 98, suffix: '%', label: 'Client Satisfaction' },
];

const AboutIntro: React.FC = () => {
  const { ref, inView } = useSectionInView<HTMLDivElement>(0.35);
  return (
    <section className="relative overflow-hidden bg-white py-16 dark:bg-gray-900 sm:py-20">
      <div
        className="pointer-events-none absolute inset-0 opacity-40 dark:opacity-20"
        aria-hidden="true"
        style={{
          backgroundImage: 'radial-gradient(rgba(109,77,148,0.25) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <SectionHead
              align="left"
              eyebrow="Who we are"
              title={
                <>
                  A technology partner from Ujjain,{' '}
                  <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                    building for the world
                  </span>
                </>
              }
              sub="SoSapient is a software company crafting custom websites, MERN stack applications, AI automation and CRM/ERP solutions — practical technology, delivered with senior-level care, for clients far beyond our hometown."
            />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mt-2 flex flex-col gap-3 sm:flex-row"
            >
              <Link
                to="/contact"
                className="group inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-primary-600 px-7 py-3 font-semibold text-white shadow-lg shadow-primary-600/25 transition hover:bg-primary-700"
              >
                Work With Us
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </Link>
              <Link
                to="/case-studies"
                className="inline-flex min-h-[48px] items-center justify-center rounded-xl border-2 border-primary-600 px-7 py-3 font-semibold text-primary-700 transition hover:bg-primary-50 dark:text-primary-300 dark:hover:bg-primary-800/20"
              >
                See Our Work
              </Link>
            </motion.div>
          </div>

          <div ref={ref} className="grid grid-cols-2 gap-4">
            {stats.map((s, i) => (
              <Stat key={s.label} stat={s} started={inView} index={i} />
            ))}
            <div className="col-span-2 flex items-center gap-2 rounded-2xl border border-gray-100 bg-gray-50 px-5 py-4 text-sm text-gray-600 dark:border-gray-800 dark:bg-gray-800/60 dark:text-gray-300">
              <MapPin className="h-4 w-4 shrink-0 text-primary-600 dark:text-primary-400" aria-hidden="true" />
              Based in Ujjain, Madhya Pradesh, India — collaborating with clients worldwide across time zones.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

function Stat({ stat, started, index }: { stat: (typeof stats)[number]; started: boolean; index: number }) {
  const v = useCountUp(stat.value, started);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={started ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="rounded-2xl border border-gray-100 bg-gray-50 p-5 text-center dark:border-gray-800 dark:bg-gray-800/60"
    >
      <p className="text-3xl font-bold text-gray-900 dark:text-white">
        {v}
        {stat.suffix}
      </p>
      <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">{stat.label}</p>
    </motion.div>
  );
}

export default AboutIntro;
