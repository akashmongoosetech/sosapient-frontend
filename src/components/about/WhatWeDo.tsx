import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { fadeUp } from '../Home/shared';

const WhatWeDo: React.FC = () => (
  <section className="relative overflow-hidden bg-white py-16 dark:bg-gray-900 sm:py-20">
    <div
      className="pointer-events-none absolute inset-0 opacity-40 dark:opacity-20"
      aria-hidden="true"
      style={{
        backgroundImage: 'radial-gradient(rgba(109,77,148,0.22) 1px, transparent 1px)',
        backgroundSize: '26px 26px',
      }}
    />
    <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
        <motion.div {...fadeUp} className="min-w-0">
          <p className="text-sm font-bold uppercase tracking-widest text-primary-600 dark:text-primary-400">
            What We Do
          </p>
          <h2 className="mt-2 text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
            Transforming Ideas into Digital Reality
          </h2>
          <p className="mt-4 leading-relaxed text-gray-600 dark:text-gray-300">
            We are a team of passionate developers, designers, and strategists working together
            to create exceptional digital experiences — from the first workshop to long-term
            support after launch.
          </p>
          <p className="mt-3 leading-relaxed text-gray-600 dark:text-gray-300">
            Every engagement blends engineering discipline with an AI-first mindset, so what we
            ship is secure, maintainable, and ready to grow with your business.
          </p>
          <Link
            to="/contact"
            className="group mt-7 inline-flex min-h-[48px] items-center gap-2 rounded-xl bg-primary-600 px-7 py-3 font-semibold text-white shadow-lg shadow-primary-600/25 transition hover:bg-primary-700"
          >
            Get Started
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 32, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative min-w-0"
        >
          <div className="overflow-hidden rounded-3xl shadow-2xl">
            <img
              src="/about/Group-132998.png"
              alt="SoSapient team collaborating on a digital project"
              loading="lazy"
              className="aspect-[4/3] w-full object-cover"
            />
          </div>
          <img
            src="/about/mukka.gif"
            width={150}
            alt="Animated illustration of creative teamwork"
            loading="lazy"
            className="absolute -bottom-6 -right-2 w-[110px] rounded-full shadow-lg sm:-right-6 sm:w-[150px] motion-reduce:animate-none animate-float"
          />
        </motion.div>
      </div>
    </div>
  </section>
);

export default WhatWeDo;
