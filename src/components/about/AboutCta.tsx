import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { fadeUp } from '../Home/shared';

const AboutCta: React.FC = () => (
  <section className="bg-white px-4 pb-16 dark:bg-gray-900 sm:px-6 sm:pb-20 lg:px-8">
    <motion.div
      {...fadeUp}
      className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl bg-secondary-900 px-6 py-14 text-center shadow-2xl sm:px-12"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-20"
        aria-hidden="true"
        style={{
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.7) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />
      <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-primary-500/40 blur-3xl motion-reduce:animate-none animate-float-slow" aria-hidden="true" />
      <div className="absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-secondary-500/40 blur-3xl motion-reduce:animate-none animate-float-slower" aria-hidden="true" />
      <div className="relative">
        <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-violet-200 ring-1 ring-white/15">
          <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
          Work with us
        </p>
        <h2 className="mx-auto mt-4 max-w-2xl text-3xl font-bold text-white sm:text-4xl">
          Let&apos;s Build What Comes Next
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-gray-300">
          Now that you know who we are — tell us where you want to go. We&apos;ll help you
          determine the right technology approach.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            to="/contact"
            className="group inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-white px-8 py-3 font-semibold text-secondary-900 shadow-lg transition hover:bg-gray-100"
          >
            Start a Project
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </Link>
          <Link
            to="/services"
            className="inline-flex min-h-[48px] items-center justify-center rounded-xl border-2 border-white/30 px-8 py-3 font-semibold text-white transition hover:bg-white/10"
          >
            Explore Services
          </Link>
        </div>
      </div>
    </motion.div>
  </section>
);

export default AboutCta;
