import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote, BadgeCheck } from 'lucide-react';
import { SectionHead, fadeUp } from './shared';

const reviewShots = [
  '/google/11.png',
  '/google/22.png',
  '/google/33.png',
  '/google/44.png',
  '/google/55.png',
];

const Testimonials: React.FC = () => {
  const row = [...reviewShots, ...reviewShots];
  return (
    <section className="overflow-hidden bg-white py-16 dark:bg-gray-900 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHead
          eyebrow="Client love"
          title="What our clients say"
          sub="Real reviews from real engagements — here's what working with SoSapient looks like."
        />

        {/* Featured client story */}
        <motion.figure
          {...fadeUp}
          className="mx-auto max-w-3xl rounded-3xl border border-gray-100 bg-gray-50 p-6 text-center shadow-sm dark:border-gray-800 dark:bg-gray-800/60 sm:p-10"
        >
          <Quote className="mx-auto h-8 w-8 text-primary-400" aria-hidden="true" />
          <blockquote className="mt-4 text-lg leading-relaxed text-gray-800 dark:text-gray-100 sm:text-xl">
            “Sosapient did an outstanding job developing my clinic website. It is professional,
            user-friendly and highly responsive — the appointment booking system works seamlessly
            and has genuinely improved patient engagement.”
          </blockquote>
          <figcaption className="mt-6 flex items-center justify-center gap-3">
            <img
              src="/home/Doctor.png"
              alt="Dr. Shashank Bhargawa"
              loading="lazy"
              className="h-12 w-12 rounded-full object-cover"
            />
            <span className="text-left">
              <span className="flex items-center gap-1.5 font-bold text-gray-900 dark:text-white">
                Dr. Shashank Bhargawa
                <BadgeCheck className="h-4 w-4 text-primary-500" aria-label="Verified client" />
              </span>
              <span className="block text-sm text-gray-500 dark:text-gray-400">
                Dermatologist · Bhargawa Skins Care — Clinic Website
              </span>
            </span>
          </figcaption>
          <span className="mt-3 inline-flex items-center gap-1" role="img" aria-label="Rated 5 out of 5 stars">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="h-4 w-4 fill-current text-yellow-500" aria-hidden="true" />
            ))}
          </span>
        </motion.figure>

        {/* Google reviews strip */}
        <motion.div {...fadeUp} className="mt-10">
          <p className="text-center text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
            Reviewed on Google
          </p>
          <div className="relative mt-5">
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-white to-transparent dark:from-gray-900" aria-hidden="true" />
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-white to-transparent dark:from-gray-900" aria-hidden="true" />
            <div className="flex w-max animate-marquee gap-4 hover:[animation-play-state:paused] motion-reduce:animate-none">
              {row.map((src, i) => (
                <img
                  key={`${src}-${i}`}
                  src={src}
                  alt={i < reviewShots.length ? `Google review screenshot ${i + 1}` : ''}
                  aria-hidden={i >= reviewShots.length}
                  loading="lazy"
                  className="h-44 w-auto shrink-0 rounded-xl border border-gray-200 object-cover shadow-sm dark:border-gray-700"
                />
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;
