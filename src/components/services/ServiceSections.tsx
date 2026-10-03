import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  CheckCircle, ArrowRight, ChevronDown, HelpCircle, Layers, Package,
  Cpu, ClipboardCheck, HeartHandshake, Building2, Sparkles
} from 'lucide-react';
import type { Service } from '../../data/services';
import { relatedServices, categoryLabel, techGroups } from '../../data/services';
import ServiceCard, { serviceIcon } from './ServiceCard';
import TechIcon from './TechIcon';

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 }
};

export const SectionShell: React.FC<{ eyebrow?: string; title: string; subtitle?: string; children: React.ReactNode; tinted?: boolean }> = ({
  eyebrow, title, subtitle, children, tinted = false
}) => (
  <section className={`py-14 sm:py-20 ${tinted ? 'bg-gray-50 dark:bg-gray-800/50' : ''}`}>
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <motion.div {...fadeUp} className="mx-auto mb-10 max-w-3xl text-center">
        {eyebrow && (
          <p className="text-sm font-semibold uppercase tracking-wider text-primary-600 dark:text-primary-400">{eyebrow}</p>
        )}
        <h2 className="mt-2 text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">{title}</h2>
        {subtitle && <p className="mt-3 text-gray-600 dark:text-gray-300">{subtitle}</p>}
      </motion.div>
      {children}
    </div>
  </section>
);

export const ServiceHero: React.FC<{ service: Service }> = ({ service }) => {
  const Icon = serviceIcon(service.icon);
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-16 dark:from-gray-800 dark:via-gray-900 dark:to-gray-900 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div {...fadeUp} className="mx-auto max-w-3xl text-center">
          <span className={`inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r ${service.gradient} text-white shadow-lg`}>
            <Icon className="h-8 w-8" aria-hidden="true" />
          </span>
          <p className="mt-5 text-sm font-semibold uppercase tracking-wider text-primary-600 dark:text-primary-400">
            {categoryLabel(service.category)}
          </p>
          <h1 className="mt-2 text-3xl font-bold text-gray-900 dark:text-white sm:text-5xl">{service.name}</h1>
          <p className="mt-3 text-xl font-medium text-primary-700 dark:text-primary-300">{service.tagline}</p>
          <p className="mx-auto mt-4 max-w-2xl text-gray-600 dark:text-gray-300">{service.description}</p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              to="/contact"
              className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-lg bg-primary-600 px-8 py-3 font-semibold text-white transition hover:bg-primary-700"
            >
              Start Your Project <ArrowRight className="h-5 w-5" aria-hidden="true" />
            </Link>
            <Link
              to="/contact"
              className="inline-flex min-h-[48px] items-center justify-center rounded-lg border-2 border-primary-600 px-8 py-3 font-semibold text-primary-700 transition hover:bg-primary-50 dark:text-primary-300 dark:hover:bg-primary-800/20"
            >
              Contact Us
            </Link>
          </div>
          <nav aria-label="Breadcrumb" className="mt-6 text-sm text-gray-500 dark:text-gray-400">
            <Link to="/" className="hover:underline">Home</Link>
            <span className="mx-2" aria-hidden="true">/</span>
            <Link to="/services" className="hover:underline">Services</Link>
            <span className="mx-2" aria-hidden="true">/</span>
            <span aria-current="page" className="text-gray-700 dark:text-gray-300">{service.name}</span>
          </nav>
        </motion.div>
      </div>
    </section>
  );
};

export const ServiceOverview: React.FC<{ service: Service }> = ({ service }) => (
  <SectionShell eyebrow="Overview" title={`What is ${service.name}?`}>
    <div className="mx-auto max-w-3xl space-y-4 text-gray-600 dark:text-gray-300">
      {service.overview.map((para, i) => (
        <motion.p key={i} {...fadeUp} className={i === 0 ? 'text-lg text-gray-800 dark:text-gray-100' : ''}>
          {para}
        </motion.p>
      ))}
    </div>
  </SectionShell>
);

export const ServiceWhyNeed: React.FC<{ service: Service }> = ({ service }) => (
  <SectionShell eyebrow="Business value" title={`Why Your Business Needs ${service.name}`} tinted>
    <div className="grid gap-5 md:grid-cols-2">
      {service.whyNeed.map((item, i) => (
        <motion.div key={i} {...fadeUp} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <h3 className="font-bold text-gray-900 dark:text-white">{item.title}</h3>
          <p className="mt-2 text-gray-600 dark:text-gray-300">{item.text}</p>
        </motion.div>
      ))}
    </div>
  </SectionShell>
);

export const ServiceBenefits: React.FC<{ service: Service }> = ({ service }) => (
  <SectionShell eyebrow="Benefits" title="Key Benefits">
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {service.benefits.map((b, i) => (
        <motion.li
          key={i}
          {...fadeUp}
          className="flex items-start gap-3 rounded-xl border border-gray-100 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800"
        >
          <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-green-600" aria-hidden="true" />
          <span className="text-gray-700 dark:text-gray-200">{b}</span>
        </motion.li>
      ))}
    </ul>
  </SectionShell>
);

export const ServiceDeliverables: React.FC<{ service: Service }> = ({ service }) => (
  <SectionShell eyebrow="Scope" title="What We Deliver" subtitle="Concrete outputs included in every engagement." tinted>
    <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {service.deliverables.map((d, i) => (
        <motion.li key={i} {...fadeUp} className="flex items-start gap-3 rounded-xl bg-white p-4 shadow-sm dark:bg-gray-800">
          <Package className="mt-0.5 h-5 w-5 shrink-0 text-primary-600 dark:text-primary-400" aria-hidden="true" />
          <span className="text-gray-700 dark:text-gray-200">{d}</span>
        </motion.li>
      ))}
    </ul>
  </SectionShell>
);

export const ServiceTechnologies: React.FC<{ service: Service }> = ({ service }) => (
  <SectionShell
    eyebrow="Stack"
    title={`Technologies We Use for ${service.shortName}`}
    subtitle={service.techIntro}
  >
    {service.technologies.length === 0 ? (
      <p className="text-center text-gray-500 dark:text-gray-400">
        We select the technology stack per project during discovery — talk to us about your requirements.
      </p>
    ) : (
      <div className="space-y-8">
        {techGroups(service).map((group) => (
          <div key={group.group}>
            <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              <Cpu className="h-4 w-4 text-primary-600" aria-hidden="true" /> {group.group}
            </h3>
            <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {group.items.map((t, i) => (
                <motion.div
                  key={t.name}
                  {...fadeUp}
                  className="group rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
                  title={t.blurb || t.name}
                >
                  <TechIcon name={t.name} />
                  <p className="mt-2.5 text-sm font-bold text-gray-900 dark:text-white">{t.name}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">{t.category}</p>
                  {t.blurb && (
                    <p className="mt-1.5 text-xs leading-relaxed text-gray-500 dark:text-gray-400">{t.blurb}</p>
                  )}
                  <span className="sr-only">{`Technology ${i + 1}`}</span>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>
    )}
    {service.slug === 'ai-automations' && <AutomationFlowVisual />}
    {service.slug === 'rag-system-integration' && <RagArchitectureVisual />}
  </SectionShell>
);

const FlowStep: React.FC<{ label: string; sub?: string; last?: boolean }> = ({ label, sub, last = false }) => (
  <li className="flex flex-col items-center text-center">
    <span className="inline-flex min-h-[44px] items-center rounded-xl border border-primary-200 bg-primary-50 px-4 py-2 text-sm font-semibold text-primary-700 dark:border-primary-800 dark:bg-primary-800/30 dark:text-primary-300">
      {label}
    </span>
    {sub && <span className="mt-1 text-xs text-gray-500 dark:text-gray-400">{sub}</span>}
    {!last && <span aria-hidden="true" className="my-1 text-lg font-bold text-primary-400">↓</span>}
  </li>
);

const AutomationFlowVisual: React.FC = () => (
  <div className="mx-auto mt-10 max-w-2xl rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
    <h3 className="text-center text-base font-bold text-gray-900 dark:text-white">How an automation flows</h3>
    <ol className="mt-4 space-y-0">
      <FlowStep label="Trigger" sub="Schedule, new lead, ticket, form submit" />
      <FlowStep label="Webhook / API" sub="Data enters the workflow" />
      <FlowStep label="Automation Platform" sub="n8n · Make · Zapier · Pipedream" />
      <FlowStep label="AI Model" sub="Classify, draft, summarize, decide" />
      <FlowStep label="Business Logic" sub="Rules, approvals, conditional branches" />
      <FlowStep label="CRM / Database" sub="Records updated automatically" />
      <FlowStep label="Notification / Action" sub="Slack, email, WhatsApp, task created" last />
    </ol>
  </div>
);

const RagArchitectureVisual: React.FC = () => (
  <div className="mx-auto mt-10 max-w-2xl rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
    <h3 className="text-center text-base font-bold text-gray-900 dark:text-white">How RAG answers your questions</h3>
    <ol className="mt-4 space-y-0">
      <FlowStep label="Documents / Database" sub="PDFs, wikis, tickets, sheets" />
      <FlowStep label="Document Processing" sub="Parse, clean, version" />
      <FlowStep label="Chunking" sub="Right-sized passages" />
      <FlowStep label="Embeddings" sub="Text → vectors" />
      <FlowStep label="Vector Database" sub="Pinecone · Qdrant · Weaviate · pgvector" />
      <FlowStep label="Semantic Retrieval" sub="Most relevant passages" />
      <FlowStep label="LLM" sub="Answers from retrieved context" />
      <FlowStep label="Context-Aware Response" sub="Cited, current, private" last />
    </ol>
  </div>
);

const PROCESS_STEPS = [
  { n: '01', title: 'Discovery', text: 'Understand your business, goals, users and technical requirements.' },
  { n: '02', title: 'Strategy', text: 'Define the solution architecture, technology stack and implementation roadmap.' },
  { n: '03', title: 'Design', text: 'Create intuitive UI/UX and technical specifications.' },
  { n: '04', title: 'Development', text: 'Build the solution using scalable and maintainable architecture.' },
  { n: '05', title: 'Testing', text: 'Functional, performance, security and compatibility testing.' },
  { n: '06', title: 'Deployment', text: 'Deploy to the appropriate production infrastructure.' },
  { n: '07', title: 'Optimization', text: 'Monitor, improve and scale based on real-world usage.' },
];

export const ServiceProcess: React.FC = () => (
  <SectionShell eyebrow="Process" title="How We Work" tinted>
    <ol className="relative grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {PROCESS_STEPS.map((s, i) => (
        <motion.li key={s.n} {...fadeUp} className="relative rounded-2xl bg-white p-6 shadow-sm dark:bg-gray-800">
          <span className="text-3xl font-bold text-primary-200 dark:text-primary-800">{s.n}</span>
          <h3 className="mt-2 font-bold text-gray-900 dark:text-white">{s.title}</h3>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{s.text}</p>
          {i < PROCESS_STEPS.length - 1 && (
            <span aria-hidden="true" className="absolute -right-3 top-1/2 hidden h-0.5 w-6 bg-primary-200 lg:block" />
          )}
        </motion.li>
      ))}
    </ol>
  </SectionShell>
);

const WHY_US = [
  { icon: HeartHandshake, title: 'Business-focused development', text: 'Every decision traced to a business outcome, not tech fashion.' },
  { icon: Layers, title: 'Scalable architecture', text: 'Systems designed for 10x growth from day one.' },
  { icon: Sparkles, title: 'AI-ready solutions', text: 'Data models and APIs prepared for intelligent features.' },
  { icon: ClipboardCheck, title: 'Clean, maintainable code', text: 'Documented code your team can extend with confidence.' },
];

export const ServiceWhyUs: React.FC = () => (
  <SectionShell eyebrow="Partner" title="Why Work With Us?">
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {WHY_US.map((w, i) => (
        <motion.div key={i} {...fadeUp} className="rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <w.icon className="mx-auto h-8 w-8 text-primary-600" aria-hidden="true" />
          <h3 className="mt-3 font-bold text-gray-900 dark:text-white">{w.title}</h3>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{w.text}</p>
        </motion.div>
      ))}
    </div>
  </SectionShell>
);

export const ServiceUseCases: React.FC<{ service: Service }> = ({ service }) => (
  <SectionShell eyebrow="Industries" title="Where This Service Can Help" tinted>
    <div className="flex flex-wrap justify-center gap-2.5">
      {service.useCases.map((u, i) => (
        <motion.span
          key={u}
          {...fadeUp}
          className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
        >
          <Building2 className="h-4 w-4 text-primary-600" aria-hidden="true" />
          {u}
          <span className="sr-only">{`Use case ${i + 1}`}</span>
        </motion.span>
      ))}
    </div>
  </SectionShell>
);

export const ServiceFaq: React.FC<{ service: Service }> = ({ service }) => {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <SectionShell eyebrow="FAQ" title="Frequently Asked Questions">
      <div className="mx-auto max-w-3xl space-y-3">
        {service.faqs.map((f, i) => {
          const isOpen = open === i;
          return (
            <div key={i} className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
                aria-controls={`service-faq-${i}`}
                className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
              >
                <span className="flex items-center gap-2 font-semibold text-gray-900 dark:text-white">
                  <HelpCircle className="h-5 w-5 shrink-0 text-primary-600" aria-hidden="true" />
                  {f.q}
                </span>
                <ChevronDown className={`h-5 w-5 shrink-0 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
              </button>
              {isOpen && (
                <p id={`service-faq-${i}`} className="px-5 pb-5 text-gray-600 dark:text-gray-300">
                  {f.a}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </SectionShell>
  );
};

export const RelatedServices: React.FC<{ service: Service }> = ({ service }) => {
  const related = relatedServices(service);
  if (related.length === 0) return null;
  return (
    <SectionShell eyebrow="Keep exploring" title="Related Services" tinted>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {related.map((s, i) => (
          <ServiceCard key={s.slug} service={s} index={i} compact />
        ))}
      </div>
    </SectionShell>
  );
};

export const ServiceFinalCta: React.FC<{ service: Service }> = ({ service }) => (
  <section className="px-4 pb-16 sm:px-6 lg:px-8">
    <motion.div
      {...fadeUp}
      className="mx-auto max-w-7xl rounded-3xl bg-gradient-to-br from-primary-600 to-secondary-700 px-6 py-14 text-center sm:px-12"
    >
      <h2 className="text-2xl font-bold text-white sm:text-3xl">Have a Project in Mind?</h2>
      <p className="mx-auto mt-3 max-w-2xl text-blue-100">
        Let&apos;s turn your idea into a scalable {service.shortName.toLowerCase()} solution.
      </p>
      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <Link
          to="/contact"
          className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-lg bg-white px-8 py-3 font-semibold text-primary-700 transition hover:bg-gray-50"
        >
          Start a Project <ArrowRight className="h-5 w-5" aria-hidden="true" />
        </Link>
        <Link
          to="/contact"
          className="inline-flex min-h-[48px] items-center justify-center rounded-lg border-2 border-white px-8 py-3 font-semibold text-white transition hover:bg-white/10"
        >
          Talk to Us
        </Link>
      </div>
    </motion.div>
  </section>
);
