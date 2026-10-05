import React from 'react';
import { motion } from 'framer-motion';
import {
  Trophy, Shield, Star, Lightbulb, Heart, Users, Crown, BookOpen,
  type LucideIcon,
} from 'lucide-react';
import { SectionHead } from '../Home/shared';

interface Value {
  icon: LucideIcon;
  title: string;
  text: string;
  gradient: string;
  featured?: boolean;
}

const VALUES: Value[] = [
  { icon: Trophy, title: 'Customer Success', text: 'We measure our success by the success of our clients — every decision traces back to their outcomes.', gradient: 'from-amber-500 to-orange-500', featured: true },
  { icon: Shield, title: 'Integrity', text: 'Honesty and transparency in all our dealings.', gradient: 'from-emerald-500 to-green-600' },
  { icon: Star, title: 'Quality', text: 'Excellence in everything we deliver.', gradient: 'from-blue-500 to-cyan-500' },
  { icon: Lightbulb, title: 'Inspire', text: 'Fostering creativity and innovation.', gradient: 'from-violet-500 to-purple-600' },
  { icon: Heart, title: 'Responsibility', text: 'Taking ownership of our actions and commitments.', gradient: 'from-rose-500 to-red-500' },
  { icon: Users, title: 'Team Work', text: 'Collaboration and mutual support.', gradient: 'from-teal-500 to-emerald-500' },
  { icon: Crown, title: 'Leadership', text: 'Guiding and empowering others.', gradient: 'from-indigo-500 to-blue-600' },
  { icon: BookOpen, title: 'Continuous Learning', text: 'Always growing and improving.', gradient: 'from-fuchsia-500 to-pink-500' },
];

const ValuesBento: React.FC = () => (
  <section className="bg-white py-16 dark:bg-gray-900 sm:py-20">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <SectionHead
        eyebrow="Our Principles"
        title="The values behind the work"
        sub="At SoSapient, we are driven by the principles we truly believe in. Our values direct our growth and provide us with the discipline to do what's best for our clients consistently."
      />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {VALUES.map((v, i) => (
          <motion.div
            key={v.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: (i % 4) * 0.07 }}
            whileHover={{ y: -5 }}
            className={`group relative overflow-hidden rounded-2xl border border-gray-100 bg-gray-50 p-6 dark:border-gray-800 dark:bg-gray-800/60 ${
              v.featured ? 'sm:col-span-2 lg:col-span-2 lg:row-span-1 bg-gradient-to-br from-primary-600 to-secondary-700 !border-transparent text-white dark:!border-transparent' : ''
            }`}
          >
            <div
              className={`pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-gradient-to-br ${v.gradient} opacity-10 blur-2xl transition-opacity group-hover:opacity-25`}
              aria-hidden="true"
            />
            <span className={`inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${v.gradient} text-white shadow-md transition-transform group-hover:scale-110 group-hover:-rotate-6`}>
              <v.icon className="h-5 w-5" aria-hidden="true" />
            </span>
            <h3 className={`mt-4 font-bold ${v.featured ? 'text-xl text-white' : 'text-gray-900 dark:text-white'}`}>{v.title}</h3>
            <p className={`mt-1.5 text-sm leading-relaxed ${v.featured ? 'text-blue-100' : 'text-gray-600 dark:text-gray-300'}`}>{v.text}</p>
            {v.featured && (
              <p className="mt-3 text-xs font-semibold uppercase tracking-widest text-white/70">
                Our north star · every project, every sprint
              </p>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default ValuesBento;
