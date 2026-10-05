import React from 'react';
import { motion } from 'framer-motion';
import { SectionHead } from '../Home/shared';

const TEAM = [
  { name: 'Akash Raikwar', position: 'CEO & Founder', bio: 'Visionary leader with 5+ years in tech industry', gradient: 'from-blue-500 to-cyan-500' },
  { name: 'Ritu Chouhan', position: 'CTO & Head of Operations', bio: 'Technical expert specializing in scalable architectures', gradient: 'from-violet-500 to-purple-600' },
  { name: 'Prakash Bankhede', position: 'Head of Marketing & Design', bio: 'Creative designer focused on user-centered solutions', gradient: 'from-orange-500 to-red-500' },
];

function initials(name: string): string {
  return name
    .split(' ')
    .map((w) => w.charAt(0))
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

const Leadership: React.FC = () => (
  <section className="bg-gray-50 py-16 dark:bg-gray-800/50 sm:py-20">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <SectionHead
        eyebrow="Leadership"
        title="Meet our leadership"
        sub="Experienced leaders combining technical expertise with strategic vision to guide Sosapient's mission."
      />
      <div className="grid gap-6 md:grid-cols-3">
        {TEAM.map((m, i) => (
          <motion.div
            key={m.name}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            whileHover={{ y: -6 }}
            className="rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-sm transition-shadow hover:shadow-xl dark:border-gray-700 dark:bg-gray-800"
          >
            <span
              className={`mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br ${m.gradient} font-display text-3xl font-bold text-white shadow-lg ring-4 ring-white dark:ring-gray-700`}
              role="img"
              aria-label={`Portrait placeholder for ${m.name}`}
            >
              {initials(m.name)}
            </span>
            <h3 className="mt-5 font-display text-lg font-bold text-gray-900 dark:text-white">{m.name}</h3>
            <p className="mt-1 text-sm font-semibold text-primary-600 dark:text-primary-400">{m.position}</p>
            <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-300">{m.bio}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default Leadership;
