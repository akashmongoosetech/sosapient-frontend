import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { INDUSTRIES } from '../../data/industries';
import { IndustryCard } from '../industries/IndustrySections';
import { SectionHead } from './shared';

const IndustriesGrid: React.FC = () => (
  <section className="bg-gray-50 py-16 dark:bg-gray-800/50 sm:py-20">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <SectionHead
        eyebrow="Industries"
        title="Software shaped for your sector"
        sub="Seventeen industries, one approach: learn the domain first, then build software that fits how it really works."
      />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {INDUSTRIES.slice(0, 8).map((industry, i) => (
          <IndustryCard key={industry.slug} industry={industry} index={i} />
        ))}
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mt-10 text-center"
      >
        <Link
          to="/industries"
          className="group inline-flex min-h-[48px] items-center gap-2 rounded-xl bg-primary-600 px-8 py-3 font-semibold text-white shadow-lg shadow-primary-600/25 transition hover:bg-primary-700"
        >
          Explore All {INDUSTRIES.length} Industries
          <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
        </Link>
      </motion.div>
    </div>
  </section>
);

export default IndustriesGrid;
