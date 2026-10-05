import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Code2, Plug, Bot, Rocket, ArrowRight } from 'lucide-react';
import { SectionHead, fadeUp } from './shared';

const pillars = [
  {
    icon: Code2,
    step: '01',
    title: 'Build',
    text: 'Web apps, mobile apps and enterprise software engineered cleanly from day one — responsive, secure and ready to scale.',
    link: '/services/frontend-development',
    linkLabel: 'Explore development',
    gradient: 'from-blue-500 to-cyan-500',
    span: '',
  },
  {
    icon: Plug,
    step: '02',
    title: 'Integrate',
    text: 'Payments, CRMs, ERPs and third-party APIs wired together with retries, monitoring and graceful fallbacks.',
    link: '/services/backend-development',
    linkLabel: 'See integrations',
    gradient: 'from-green-500 to-teal-500',
    span: '',
  },
  {
    icon: Bot,
    step: '03',
    title: 'Automate',
    text: 'AI chatbots, RAG assistants and workflow automation that remove busywork and answer customers around the clock.',
    link: '/industries/artificial-intelligence-automation',
    linkLabel: 'See AI in action',
    gradient: 'from-violet-500 to-purple-600',
    span: '',
  },
  {
    icon: Rocket,
    step: '04',
    title: 'Scale',
    text: 'Cloud infrastructure, CI/CD and monitoring that keep you fast at 10× traffic — with costs under control.',
    link: '/industries/cloud-devops',
    linkLabel: 'See cloud & DevOps',
    gradient: 'from-orange-500 to-red-500',
    span: '',
  },
];

const ValueProp: React.FC = () => (
  <section className="bg-white py-16 dark:bg-gray-900 sm:py-20">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <SectionHead
        eyebrow="What we do"
        title={<>From business problem to working software</>}
        sub="One team takes you through the full journey — no handoffs lost between vendors, no glue code holding it together."
      />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-6">
        {pillars.map((p, i) => (
          <motion.div
            key={p.title}
            {...fadeUp}
            transition={{ duration: 0.5, delay: (i % 4) * 0.08 }}
            className={`group relative overflow-hidden rounded-2xl border border-gray-100 bg-gray-50 p-6 dark:border-gray-800 dark:bg-gray-800/60 ${
              i === 0
                ? 'sm:col-span-2 lg:col-span-6 lg:grid lg:grid-cols-[auto_1fr_auto] lg:items-center lg:gap-6'
                : 'lg:col-span-2'
            }`}
          >
            <div
              className={`pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gradient-to-br ${p.gradient} opacity-10 blur-2xl transition-opacity group-hover:opacity-20`}
              aria-hidden="true"
            />
            <span className={`inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${p.gradient} text-white shadow-md`}>
              <p.icon className="h-6 w-6" aria-hidden="true" />
            </span>
            <div className="relative mt-4 lg:mt-0">
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400" aria-hidden="true">
                {p.step}
              </p>
              <h3 className="mt-1 text-xl font-bold text-gray-900 dark:text-white">{p.title}</h3>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-gray-600 dark:text-gray-300">{p.text}</p>
            </div>
            <Link
              to={p.link}
              className="relative mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-primary-600 transition hover:gap-2.5 dark:text-primary-400 lg:mt-0"
            >
              {p.linkLabel} <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default ValueProp;
