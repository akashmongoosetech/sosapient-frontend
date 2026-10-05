import React, { useRef } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { Calendar } from 'lucide-react';
import { SectionHead } from '../Home/shared';

const MILESTONES = [
  { year: '2022', event: 'Company Founded', description: 'Started as a small team with big dreams in Ujjain, India.' },
  { year: '2023', event: 'First Major Client', description: 'Earned the trust of our first large enterprise engagement.' },
  { year: '2024', event: 'Team Expansion', description: 'Grew to 25 talented professionals across engineering, design and growth.' },
  { year: '2024', event: 'Client Recognition', description: 'Reviews and referrals became our strongest source of new business.' },
  { year: '2025', event: '50+ Projects', description: 'Crossed the milestone of 50 successful project deliveries.' },
  { year: '2025', event: 'Innovation Hub', description: 'Doubled down on AI-first builds with a dedicated innovation practice.' },
];

const JourneyTimeline: React.FC = () => {
  const trackRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: trackRef, offset: ['start 0.75', 'end 0.55'] });
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 22 });

  return (
    <section id="journey" className="bg-white py-16 dark:bg-gray-900 sm:py-20 scroll-mt-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHead
          eyebrow="Our Journey"
          title="From humble beginnings to trusted partner"
          sub="Here's how we've grown over the years to become a technology partner businesses rely on."
        />
        <div ref={trackRef} className="relative">
          <div className="absolute bottom-0 left-0 top-0 w-1 rounded-full bg-gray-100 dark:bg-gray-800 md:left-1/2 md:-translate-x-1/2" aria-hidden="true">
            <motion.div className="h-full w-full origin-top rounded-full bg-gradient-to-b from-primary-500 to-secondary-500" style={{ scaleY: progress }} />
          </div>
          <ol className="flex flex-col gap-8 md:gap-10">
            {MILESTONES.map((m, i) => {
              const left = i % 2 === 0;
              return (
                <motion.li
                  key={`${m.year}-${m.event}`}
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.55 }}
                  className={`relative flex flex-col gap-4 pl-12 md:w-1/2 md:pl-0 ${
                    left ? 'md:pr-12' : 'md:ml-auto md:pl-12'
                  }`}
                >
                  <span
                    className={`absolute left-0 top-6 flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary-600 to-secondary-600 text-white shadow-lg md:top-8 ${
                      left ? 'md:left-auto md:right-0 md:-mr-[18px]' : 'md:left-0 md:-ml-[18px]'
                    }`}
                    aria-hidden="true"
                  >
                    <Calendar className="h-4 w-4" />
                  </span>
                  <div className="rounded-2xl border border-gray-100 bg-gray-50 p-6 shadow-sm transition-shadow hover:shadow-lg dark:border-gray-800 dark:bg-gray-800/60">
                    <p className="font-display text-2xl font-bold text-primary-600 dark:text-primary-400">{m.year}</p>
                    <h3 className="mt-1 font-bold text-gray-900 dark:text-white">{m.event}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-gray-600 dark:text-gray-300">{m.description}</p>
                  </div>
                </motion.li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
};

export default JourneyTimeline;
