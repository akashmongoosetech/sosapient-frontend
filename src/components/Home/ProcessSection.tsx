import React, { useRef } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import {
  Search,
  ClipboardList,
  Palette,
  Code2,
  TestTube2,
  Rocket,
  Settings,
  ArrowRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { SectionHead } from './shared';

const steps = [
  {
    icon: Search,
    title: 'Discover Workshop',
    image: '/home/process1.png',
    description:
      'We dig into your goals, users and constraints with stakeholders — so scope, success metrics and roadmap are agreed before anything is built.',
    color: 'from-blue-500 to-blue-600',
  },
  {
    icon: ClipboardList,
    title: 'Planning',
    image: '/home/process2.png',
    description:
      'Timelines, architecture, tech choices and test strategy are documented and approved — no assumptions, no surprises mid-project.',
    color: 'from-purple-500 to-purple-600',
  },
  {
    icon: Palette,
    title: 'Design',
    image: '/home/process3.png',
    description:
      'Wireframes become clickable prototypes and a reusable design system — validated with you before a line of production code.',
    color: 'from-pink-500 to-pink-600',
  },
  {
    icon: Code2,
    title: 'Development',
    image: '/home/process4.png',
    description:
      'Agile sprints with demos every cycle: clean, scalable code across frontend, backend and integrations, with your feedback in each milestone.',
    color: 'from-green-500 to-green-600',
  },
  {
    icon: TestTube2,
    title: 'Testing',
    image: '/home/process5.png',
    description:
      'Manual and automated testing every sprint — functional, regression, performance and security — so releases are genuinely ready.',
    color: 'from-yellow-500 to-yellow-600',
  },
  {
    icon: Rocket,
    title: 'Deployment',
    image: '/home/process6.png',
    description:
      'Zero-downtime releases through CI/CD pipelines, with monitoring from minute one and rollback plans behind every launch.',
    color: 'from-indigo-500 to-indigo-600',
  },
  {
    icon: Settings,
    title: 'Maintenance',
    image: '/home/process6.png',
    description:
      'Security updates, backups, performance tuning and continuous improvement — your product keeps getting better after launch.',
    color: 'from-red-500 to-red-600',
  },
];

const ProcessSection: React.FC = () => {
  const trackRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: trackRef, offset: ['start 0.75', 'end 0.55'] });
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 22 });

  return (
    <section className="relative overflow-hidden bg-white py-16 dark:bg-gray-900 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHead
          eyebrow="Our Process"
          title={<>How we work, <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">step by step</span></>}
          sub="A transparent journey from first workshop to long-term support — you always know what's happening and what's next."
        />

        <div ref={trackRef} className="relative">
          {/* Progress rail */}
          <div className="absolute bottom-0 left-4 top-0 w-1 rounded-full bg-gray-100 dark:bg-gray-800 md:left-1/2 md:-translate-x-1/2" aria-hidden="true">
            <motion.div className="w-full origin-top rounded-full bg-gradient-to-b from-primary-500 to-secondary-500" style={{ scaleY: progress, height: '100%' }} />
          </div>

          <ol className="flex flex-col gap-8 md:gap-10">
            {steps.map((s, i) => {
              const left = i % 2 === 0;
              return (
                <motion.li
                  key={s.title}
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.55 }}
                  className={`relative flex flex-col gap-4 pl-12 md:w-1/2 md:pl-0 ${
                    left ? 'md:pr-12' : 'md:ml-auto md:pl-12'
                  }`}
                >
                  <span
                    className={`absolute left-0 top-6 flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br text-sm font-bold text-white shadow-lg md:top-8 ${s.color} ${
                      left ? 'md:left-auto md:right-0 md:-mr-[18px]' : 'md:left-0 md:-ml-[18px]'
                    }`}
                    aria-hidden="true"
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div className="overflow-hidden rounded-2xl border border-gray-100 bg-gray-50 shadow-sm transition-shadow hover:shadow-lg dark:border-gray-800 dark:bg-gray-800/60">
                    <div className="flex items-center gap-3 p-5 pb-0">
                      <span className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${s.color} text-white shadow-md`}>
                        <s.icon className="h-5 w-5" aria-hidden="true" />
                      </span>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">{s.title}</h3>
                    </div>
                    <p className="px-5 pb-4 pt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                      {s.description}
                    </p>
                    <img
                      src={s.image}
                      alt={`${s.title} illustration`}
                      loading="lazy"
                      className="h-40 w-full object-cover"
                    />
                  </div>
                </motion.li>
              );
            })}
          </ol>
        </div>

        <div className="mt-12 text-center">
          <Link
            to="/contact"
            className="group inline-flex min-h-[48px] items-center gap-2 rounded-xl bg-primary-600 px-8 py-3 font-semibold text-white shadow-lg shadow-primary-600/25 transition hover:bg-primary-700"
          >
            Get Started
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
