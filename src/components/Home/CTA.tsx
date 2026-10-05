import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { fadeUp } from './shared';

const CTA: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden bg-gray-950 py-16 sm:py-24">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div
          className="absolute inset-0 opacity-25"
          style={{
            backgroundImage: 'radial-gradient(rgba(155,129,199,0.55) 1px, transparent 1px)',
            backgroundSize: '26px 26px',
          }}
        />
        <div className="absolute left-1/2 top-0 h-72 w-[720px] max-w-full -translate-x-1/2 rounded-full bg-gradient-to-r from-primary-600/40 to-secondary-600/40 blur-3xl motion-reduce:animate-none animate-float-slow" />
      </div>
      <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <motion.div {...fadeUp}>
          <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-violet-300">
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            Let&apos;s build together
          </p>
          <h2 className="mt-5 text-3xl font-bold text-white sm:text-5xl">
            Ready to Build Something Intelligent?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-gray-300">
            Turn your idea, business challenge or manual workflow into a scalable digital
            solution — designed, built and supported by one team.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => navigate('/contact')}
              className="group inline-flex min-h-[52px] items-center justify-center gap-2 rounded-xl bg-white px-8 py-3.5 font-bold text-gray-900 shadow-xl transition hover:bg-gray-100"
            >
              Start Your Project
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => navigate('/contact')}
              className="inline-flex min-h-[52px] items-center justify-center rounded-xl border-2 border-white/30 px-8 py-3.5 font-bold text-white transition hover:bg-white/10"
            >
              Talk to an Expert
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTA;
