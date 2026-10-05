import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, ArrowRight } from 'lucide-react';
import { fadeUp } from '../Home/shared';

const CHECKLIST = ['Business Support', 'Software Development', 'App Development', 'Web Development'];

const CollaborationSplit: React.FC = () => (
  <section className="bg-gray-50 py-16 dark:bg-gray-800/50 sm:py-20">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
        <motion.div {...fadeUp} className="relative min-w-0">
          <div className="overflow-hidden rounded-3xl shadow-xl">
            <img
              src="/about/alt-services-pic1.jpg"
              alt="Designer and developers building a responsive website"
              loading="lazy"
              className="aspect-[4/3] w-full object-cover transition-transform duration-500 hover:scale-105"
            />
          </div>
          <div className="absolute -bottom-5 -right-3 hidden items-center gap-2.5 rounded-2xl border border-white/60 bg-white/95 p-3.5 pr-5 shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-gray-800/95 sm:flex motion-reduce:animate-none animate-float">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary-600 to-secondary-600 text-white shadow">
              <Check className="h-5 w-5" strokeWidth={3} aria-hidden="true" />
            </span>
            <span>
              <span className="block text-xs font-bold text-gray-900 dark:text-white">Direct collaboration</span>
              <span className="block text-[11px] text-gray-500 dark:text-gray-400">no layers, no lost context</span>
            </span>
          </div>
        </motion.div>

        <motion.div {...fadeUp} transition={{ duration: 0.55, delay: 0.1 }} className="min-w-0">
          <p className="text-sm font-bold uppercase tracking-widest text-primary-600 dark:text-primary-400">
            How we work with you
          </p>
          <h2 className="mt-2 text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
            Elevate Your Business with Exceptional Design & Development
          </h2>
          <p className="mt-4 leading-relaxed text-gray-600 dark:text-gray-300">
            To bring your vision to life, we collaborate with talented designers, frontend developers,
            backend developers, software architects, and experts in web and app development.
          </p>
          <p className="mt-3 leading-relaxed text-gray-600 dark:text-gray-300">
            At Sosapient, we take our role as a technical partner seriously, striving to help our
            clients find the perfect technological solutions. Unlike traditional agencies, we work
            directly with you every step of the way to ensure success.
          </p>
          <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
            {CHECKLIST.map((c) => (
              <li key={c} className="flex items-center gap-2.5 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-gray-800 shadow-sm dark:bg-gray-900 dark:text-gray-200">
                <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400">
                  <Check className="h-3.5 w-3.5" strokeWidth={3} aria-hidden="true" />
                </span>
                {c}
              </li>
            ))}
          </ul>
          <Link
            to="/contact"
            className="group mt-7 inline-flex min-h-[48px] items-center gap-2 rounded-xl bg-primary-600 px-7 py-3 font-semibold text-white shadow-lg shadow-primary-600/25 transition hover:bg-primary-700"
          >
            Explore More
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </Link>
        </motion.div>
      </div>
    </div>
  </section>
);

export default CollaborationSplit;
