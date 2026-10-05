import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  CheckCircle, ArrowRight, ChevronDown, HelpCircle, Cpu, Building2
} from 'lucide-react';
import type { Industry } from '../../data/industries';
import { relatedIndustries, industryTechGroups } from '../../data/industries';
import { serviceIcon } from '../services/ServiceCard';
import { ServiceProcess, ServiceWhyUs } from '../services/ServiceSections';
import TechIcon from '../services/TechIcon';

export { ServiceProcess, ServiceWhyUs };

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 }
};

export const IndustrySectionShell: React.FC<{ eyebrow?: string; title: string; subtitle?: string; children: React.ReactNode; tinted?: boolean }> = ({
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

export const IndustryHero: React.FC<{ industry: Industry }> = ({ industry }) => {
  const Icon = serviceIcon(industry.icon);
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-16 dark:from-gray-800 dark:via-gray-900 dark:to-gray-900 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div {...fadeUp} className="mx-auto max-w-3xl text-center">
          <span className={`inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r ${industry.gradient} text-white shadow-lg`}>
            <Icon className="h-8 w-8" aria-hidden="true" />
          </span>
          <p className="mt-5 text-sm font-semibold uppercase tracking-wider text-primary-600 dark:text-primary-400">
            Industry Solutions
          </p>
          <h1 className="mt-2 text-3xl font-bold text-gray-900 dark:text-white sm:text-5xl">{industry.name}</h1>
          <p className="mt-3 text-xl font-medium text-primary-700 dark:text-primary-300">{industry.tagline}</p>
          <p className="mx-auto mt-4 max-w-2xl text-gray-600 dark:text-gray-300">{industry.description}</p>
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
              Talk to an Expert
            </Link>
          </div>
          <nav aria-label="Breadcrumb" className="mt-6 text-sm text-gray-500 dark:text-gray-400">
            <Link to="/" className="hover:underline">Home</Link>
            <span className="mx-2" aria-hidden="true">/</span>
            <Link to="/industries" className="hover:underline">Industries</Link>
            <span className="mx-2" aria-hidden="true">/</span>
            <span aria-current="page" className="text-gray-700 dark:text-gray-300">{industry.name}</span>
          </nav>
        </motion.div>
      </div>
    </section>
  );
};

export const IndustryOverview: React.FC<{ industry: Industry }> = ({ industry }) => (
  <IndustrySectionShell eyebrow="Overview" title={`Digital Transformation in ${industry.shortName}`}>
    <div className="mx-auto max-w-3xl space-y-4 text-gray-600 dark:text-gray-300">
      {industry.overview.map((para, i) => (
        <motion.p key={i} {...fadeUp} className={i === 0 ? 'text-lg text-gray-800 dark:text-gray-100' : ''}>
          {para}
        </motion.p>
      ))}
    </div>
  </IndustrySectionShell>
);

export const IndustryChallenges: React.FC<{ industry: Industry }> = ({ industry }) => (
  <IndustrySectionShell eyebrow="Challenges" title={`Challenges Facing ${industry.shortName}`} tinted>
    <div className="grid gap-5 md:grid-cols-2">
      {industry.challenges.map((item, i) => (
        <motion.div key={i} {...fadeUp} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <h3 className="font-bold text-gray-900 dark:text-white">{item.title}</h3>
          <p className="mt-2 text-gray-600 dark:text-gray-300">{item.text}</p>
        </motion.div>
      ))}
    </div>
  </IndustrySectionShell>
);

export const IndustrySolutions: React.FC<{ industry: Industry }> = ({ industry }) => (
  <IndustrySectionShell eyebrow="Solutions" title={`Solutions We Build for ${industry.shortName}`}>
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {industry.solutions.map((s, i) => {
        const Icon = serviceIcon(s.icon);
        return (
          <motion.div key={i} {...fadeUp} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-gray-700 dark:bg-gray-800">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary-600 to-secondary-600 text-white shadow-md">
              <Icon className="h-5 w-5" aria-hidden="true" />
            </span>
            <h3 className="mt-4 font-bold text-gray-900 dark:text-white">{s.title}</h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{s.text}</p>
          </motion.div>
        );
      })}
    </div>
  </IndustrySectionShell>
);

export const IndustryTechnologies: React.FC<{ industry: Industry }> = ({ industry }) => (
  <IndustrySectionShell
    eyebrow="Stack"
    title={`Technologies We Use for ${industry.shortName}`}
    subtitle={industry.techIntro}
  >
    <div className="space-y-8">
      {industryTechGroups(industry).map((group) => (
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
  </IndustrySectionShell>
);

export const IndustryBenefits: React.FC<{ industry: Industry }> = ({ industry }) => (
  <IndustrySectionShell eyebrow="Benefits" title="Business Benefits" tinted>
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {industry.benefits.map((b, i) => (
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
  </IndustrySectionShell>
);

export const IndustryUseCases: React.FC<{ industry: Industry }> = ({ industry }) => (
  <IndustrySectionShell eyebrow="Use cases" title="Where This Helps">
    <div className="flex flex-wrap justify-center gap-2.5">
      {industry.useCases.map((u, i) => (
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
  </IndustrySectionShell>
);

export const IndustryFaq: React.FC<{ industry: Industry }> = ({ industry }) => {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <IndustrySectionShell eyebrow="FAQ" title="Frequently Asked Questions" tinted>
      <div className="mx-auto max-w-3xl space-y-3">
        {industry.faqs.map((f, i) => {
          const isOpen = open === i;
          return (
            <div key={i} className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
                aria-controls={`industry-faq-${i}`}
                className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
              >
                <span className="flex items-center gap-2 font-semibold text-gray-900 dark:text-white">
                  <HelpCircle className="h-5 w-5 shrink-0 text-primary-600" aria-hidden="true" />
                  {f.q}
                </span>
                <ChevronDown className={`h-5 w-5 shrink-0 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
              </button>
              {isOpen && (
                <p id={`industry-faq-${i}`} className="px-5 pb-5 text-gray-600 dark:text-gray-300">
                  {f.a}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </IndustrySectionShell>
  );
};

export const IndustryCard: React.FC<{ industry: Industry; index?: number }> = ({ industry, index = 0 }) => {
  const Icon = serviceIcon(industry.icon);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: (index % 4) * 0.08 }}
      className="group flex h-full flex-col rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800"
    >
      <span className={`inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${industry.gradient} text-white shadow-md`}>
        <Icon className="h-6 w-6" aria-hidden="true" />
      </span>
      <h3 className="mt-4 font-bold text-gray-900 dark:text-white">{industry.name}</h3>
      <p className="mt-2 flex-1 text-sm text-gray-600 dark:text-gray-300">{industry.shortDescription}</p>
      <Link
        to={`/industries/${industry.slug}`}
        className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-primary-600 transition hover:gap-2.5 dark:text-primary-400"
      >
        Explore {industry.shortName} <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </Link>
    </motion.div>
  );
};

export const RelatedIndustries: React.FC<{ industry: Industry }> = ({ industry }) => {
  const related = relatedIndustries(industry);
  if (related.length === 0) return null;
  return (
    <IndustrySectionShell eyebrow="Keep exploring" title="Related Industries" tinted>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {related.map((r, i) => (
          <IndustryCard key={r.slug} industry={r} index={i} />
        ))}
      </div>
    </IndustrySectionShell>
  );
};

export const IndustryFinalCta: React.FC<{ industry: Industry }> = ({ industry }) => (
  <section className="px-4 pb-16 sm:px-6 lg:px-8">
    <motion.div
      {...fadeUp}
      className="mx-auto max-w-7xl rounded-3xl bg-gradient-to-br from-primary-600 to-secondary-700 px-6 py-14 text-center sm:px-12"
    >
      <h2 className="text-2xl font-bold text-white sm:text-3xl">Ready to Build for {industry.shortName}?</h2>
      <p className="mx-auto mt-3 max-w-2xl text-blue-100">
        Let&apos;s create a secure, scalable solution tailored to the {industry.shortName.toLowerCase()} sector.
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
          Talk to an Expert
        </Link>
      </div>
    </motion.div>
  </section>
);
