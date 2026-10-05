import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Database, Brain, Search, Workflow, Rocket, ArrowRight } from 'lucide-react';
import { SectionHead, fadeUp } from './shared';

const flow = [
  { icon: Database, title: 'Business Data', text: 'Docs, tickets, sheets and databases — your real content.' },
  { icon: Brain, title: 'AI / LLM', text: 'Models that read, draft, classify and decide.' },
  { icon: Search, title: 'RAG Retrieval', text: 'Grounded answers cited from your sources.' },
  { icon: Workflow, title: 'Automation', text: 'Workflows that act: notify, update, follow up.' },
  { icon: Rocket, title: 'Business Action', text: 'Resolved tickets, qualified leads, shipped reports.' },
];

const AiAutomation: React.FC = () => (
  <section className="relative overflow-hidden bg-gray-950 py-16 sm:py-20">
    <div className="pointer-events-none absolute inset-0" aria-hidden="true">
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: 'radial-gradient(rgba(155,129,199,0.5) 1px, transparent 1px)',
          backgroundSize: '26px 26px',
        }}
      />
      <div className="absolute -left-24 top-0 h-80 w-80 rounded-full bg-violet-600/25 blur-3xl motion-reduce:animate-none animate-float-slow" />
      <div className="absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-primary-600/25 blur-3xl motion-reduce:animate-none animate-float-slower" />
    </div>
    <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <SectionHead
        inverse
        eyebrow="AI & Automation"
        title="AI that does real work"
        sub="Not demos — production systems where your data flows through models into actions your business can measure."
      />

      <div className="relative">
        <div className="absolute left-0 right-0 top-8 hidden h-0.5 bg-white/10 lg:block" aria-hidden="true">
          <motion.span
            className="absolute top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-gradient-to-r from-violet-400 to-primary-400 shadow-[0_0_12px_4px_rgba(139,92,246,0.5)] motion-reduce:hidden"
            animate={{ left: ['2%', '98%'] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
        <ol className="relative grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {flow.map((f, i) => (
            <motion.li
              key={f.title}
              {...fadeUp}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur transition-colors hover:border-violet-400/40"
            >
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-primary-600 text-white shadow-lg">
                <f.icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <p className="mt-1 text-xs font-bold uppercase tracking-widest text-violet-300" aria-hidden="true">
                0{i + 1}
              </p>
              <h3 className="mt-1 font-bold text-white">{f.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-gray-400">{f.text}</p>
            </motion.li>
          ))}
        </ol>
      </div>

      <motion.div {...fadeUp} className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
        <Link
          to="/industries/artificial-intelligence-automation"
          className="group inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-white px-7 py-3 font-semibold text-gray-900 transition hover:bg-gray-100"
        >
          Explore AI Solutions
          <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
        </Link>
        <Link
          to="/services/ai-automations"
          className="inline-flex min-h-[48px] items-center justify-center rounded-xl border border-white/25 px-7 py-3 font-semibold text-white transition hover:bg-white/10"
        >
          See Automation Service
        </Link>
      </motion.div>
    </div>
  </section>
);

export default AiAutomation;
