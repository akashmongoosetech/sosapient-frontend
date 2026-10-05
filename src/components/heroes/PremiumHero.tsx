import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, ArrowUpRight, Check } from 'lucide-react';
import type { IndustryHeroConfig } from '../../data/industryHeros';
import { serviceIcon } from '../services/ServiceCard';

export interface HeroCrumb {
  label: string;
  to?: string;
}

export interface HeroCta {
  label: string;
  to?: string;
  href?: string;
}

export interface PremiumHeroProps {
  badgeIcon: string;
  badgeLabel: string;
  gradient: string;
  headline: React.ReactNode;
  description: string;
  primaryCta: HeroCta;
  secondaryCta?: HeroCta;
  trust: string[];
  breadcrumbs: HeroCrumb[];
  hero: IndustryHeroConfig;
}

const list = {
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};
const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55 } },
};

const Sparkline: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 200 56" className={className} aria-hidden="true" preserveAspectRatio="none">
    <defs>
      <linearGradient id="hero-spark" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="currentColor" stopOpacity="0.35" />
        <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
      </linearGradient>
    </defs>
    <path d="M0,44 C20,40 30,30 45,32 C60,34 70,20 85,22 C100,24 110,34 125,28 C140,22 150,10 165,12 C180,14 190,6 200,8 L200,56 L0,56 Z" fill="url(#hero-spark)" />
    <path d="M0,44 C20,40 30,30 45,32 C60,34 70,20 85,22 C100,24 110,34 125,28 C140,22 150,10 165,12 C180,14 190,6 200,8" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    <circle cx="200" cy="8" r="3.5" fill="currentColor" />
  </svg>
);

function renderCta(cta: HeroCta, primary: boolean) {
  const cls = primary
    ? 'group inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-primary-600 px-7 py-3 font-semibold text-white shadow-lg shadow-primary-600/25 transition hover:bg-primary-700 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2'
    : 'inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl border-2 border-primary-600 px-7 py-3 font-semibold text-primary-700 transition hover:bg-primary-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 dark:text-primary-300 dark:hover:bg-primary-800/20';
  const arrow = <ArrowRight className={`h-5 w-5 ${primary ? 'transition-transform group-hover:translate-x-1' : ''}`} aria-hidden="true" />;
  if (cta.to) {
    return (
      <Link to={cta.to} className={cls}>
        {cta.label} {arrow}
      </Link>
    );
  }
  return (
    <a href={cta.href} className={cls}>
      {cta.label} {arrow}
    </a>
  );
}

const VisualBody: React.FC<{ hero: IndustryHeroConfig }> = ({ hero }) => {
  const { stats } = hero.visual;
  switch (hero.visual.variant) {
    case 'pipeline':
      return (
        <ol className="flex flex-col gap-1">
          {stats.map((s, i) => (
            <li key={s.label} className="flex items-start gap-3">
              <span className="flex flex-col items-center" aria-hidden="true">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary-600 to-secondary-600 text-xs font-bold text-white shadow">
                  {i + 1}
                </span>
                {i < stats.length - 1 && <span className="my-1 h-6 w-0.5 rounded bg-gradient-to-b from-primary-300 to-secondary-300 dark:from-primary-700 dark:to-secondary-700" />}
              </span>
              <span className="min-w-0 flex-1 rounded-xl border border-gray-100 bg-gray-50 px-3.5 py-2.5 dark:border-white/10 dark:bg-white/5">
                <span className="block truncate text-sm font-bold text-gray-900 dark:text-white">{s.label}</span>
                <span className="block text-xs text-gray-500 dark:text-gray-400">
                  <span className="font-bold text-primary-600 dark:text-primary-400">{s.value}</span> · {s.sub}
                </span>
              </span>
            </li>
          ))}
        </ol>
      );
    case 'leaderboard':
      return (
        <ol className="flex flex-col gap-2">
          {stats.map((s, i) => (
            <li
              key={s.label}
              className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 px-3.5 py-2.5 dark:border-white/10 dark:bg-white/5"
            >
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold text-white shadow ${
                  i === 0 ? 'bg-gradient-to-br from-amber-400 to-orange-500' : 'bg-gray-300 dark:bg-gray-600'
                }`}
                aria-hidden="true"
              >
                {i + 1}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-bold text-gray-900 dark:text-white">{s.label}</span>
                <span className="block truncate text-xs text-gray-500 dark:text-gray-400">{s.sub}</span>
              </span>
              <span className="shrink-0 text-sm font-bold text-primary-600 dark:text-primary-400">{s.value}</span>
            </li>
          ))}
        </ol>
      );
    case 'route':
      return (
        <div>
          <svg viewBox="0 0 320 120" className="w-full text-primary-500 dark:text-primary-400" aria-hidden="true">
            <path d="M16,100 C70,100 60,40 120,40 C180,40 170,90 230,90 C270,90 280,30 304,30" fill="none" stroke="currentColor" strokeWidth="2.5" strokeDasharray="7 6" strokeLinecap="round" />
            <circle cx="16" cy="100" r="6" fill="currentColor" />
            <circle cx="120" cy="40" r="6" fill="currentColor" opacity="0.55" />
            <circle cx="230" cy="90" r="6" fill="currentColor" opacity="0.55" />
            <circle cx="304" cy="30" r="7" fill="none" stroke="currentColor" strokeWidth="3" />
            <circle cx="304" cy="30" r="3" fill="currentColor" />
          </svg>
          <ul className="mt-1 flex flex-col gap-2">
            {stats.map((s) => (
              <li key={s.label} className="flex items-center justify-between gap-3 rounded-xl border border-gray-100 bg-gray-50 px-3.5 py-2.5 dark:border-white/10 dark:bg-white/5">
                <span className="min-w-0">
                  <span className="block truncate text-sm font-bold text-gray-900 dark:text-white">{s.label}</span>
                  <span className="block truncate text-xs text-gray-500 dark:text-gray-400">{s.sub}</span>
                </span>
                <span className="shrink-0 text-sm font-bold text-primary-600 dark:text-primary-400">{s.value}</span>
              </li>
            ))}
          </ul>
        </div>
      );
    case 'cards':
      return (
        <ul className="grid grid-cols-1 gap-2">
          {stats.map((s) => (
            <li key={s.label} className="rounded-xl border border-gray-100 bg-gray-50 p-3.5 dark:border-white/10 dark:bg-white/5">
              <span className="block truncate text-sm font-bold text-gray-900 dark:text-white">{s.label}</span>
              <span className="mt-0.5 flex items-baseline justify-between gap-2">
                <span className="text-xl font-bold text-primary-600 dark:text-primary-400">{s.value}</span>
                <span className="truncate text-xs text-gray-500 dark:text-gray-400">{s.sub}</span>
              </span>
              <span className="mt-2 block h-1.5 overflow-hidden rounded-full bg-gray-200 dark:bg-white/10" aria-hidden="true">
                <span className="block h-full w-3/4 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500" />
              </span>
            </li>
          ))}
        </ul>
      );
    case 'shield':
      return (
        <div>
          <div className="flex flex-col items-center py-1" aria-hidden="true">
            <span className="relative flex h-20 w-20 items-center justify-center">
              <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400 opacity-20 [animation-duration:2.2s] motion-reduce:animate-none" />
              <span className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-lg shadow-emerald-500/30 ring-4 ring-emerald-100 dark:ring-emerald-900/40">
                <Check className="h-9 w-9 text-white" strokeWidth={3} />
              </span>
            </span>
          </div>
          <ul className="mt-3 flex flex-col gap-2">
            {stats.map((s) => (
              <li key={s.label} className="flex items-center justify-between gap-3 rounded-xl border border-gray-100 bg-gray-50 px-3.5 py-2.5 dark:border-white/10 dark:bg-white/5">
                <span className="flex min-w-0 items-center gap-2">
                  <Check className="h-4 w-4 shrink-0 text-emerald-500" aria-hidden="true" />
                  <span className="truncate text-sm font-semibold text-gray-800 dark:text-gray-200">{s.label}</span>
                </span>
                <span className="shrink-0 text-sm font-bold text-gray-900 dark:text-white">{s.value}</span>
              </li>
            ))}
          </ul>
        </div>
      );
    case 'docs':
      return (
        <ul className="flex flex-col gap-2">
          {stats.map((s) => (
            <li key={s.label} className="rounded-xl border border-gray-100 bg-gray-50 p-3.5 dark:border-white/10 dark:bg-white/5">
              <span className="flex items-center justify-between gap-2">
                <span className="truncate text-sm font-bold text-gray-900 dark:text-white">{s.label}</span>
                <span className="shrink-0 rounded-md bg-primary-100 px-2 py-0.5 text-xs font-bold text-primary-700 dark:bg-primary-900/50 dark:text-primary-300">
                  {s.value}
                </span>
              </span>
              <span className="mt-1 block truncate text-xs text-gray-500 dark:text-gray-400">{s.sub}</span>
            </li>
          ))}
        </ul>
      );
    case 'chat':
      return (
        <ul className="flex flex-col gap-2.5">
          {stats.map((s, i) => (
            <li
              key={s.label}
              className={`max-w-[92%] rounded-2xl px-3.5 py-2.5 text-sm ${
                i % 2 === 0
                  ? 'self-start rounded-bl-md border border-gray-100 bg-gray-50 dark:border-white/10 dark:bg-white/5'
                  : 'self-end rounded-br-md bg-gradient-to-r from-primary-600 to-secondary-600 text-white shadow-md'
              }`}
            >
              <span className={`block font-bold ${i % 2 === 0 ? 'text-gray-900 dark:text-white' : ''}`}>{s.label}</span>
              <span className={`block text-xs ${i % 2 === 0 ? 'text-gray-500 dark:text-gray-400' : 'text-white/80'}`}>
                {s.value} · {s.sub}
              </span>
            </li>
          ))}
          <li className="flex items-center gap-1.5 self-start rounded-2xl rounded-bl-md border border-gray-100 bg-gray-50 px-3.5 py-3 dark:border-white/10 dark:bg-white/5" aria-hidden="true">
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400 [animation-delay:0ms] motion-reduce:animate-none" />
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400 [animation-delay:150ms] motion-reduce:animate-none" />
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400 [animation-delay:300ms] motion-reduce:animate-none" />
          </li>
        </ul>
      );
    case 'network':
      return (
        <div>
          <div className="grid grid-cols-2 gap-2">
            {stats.map((s) => (
              <div key={s.label} className="rounded-xl border border-gray-100 bg-gray-50 p-3 text-center dark:border-white/10 dark:bg-white/5">
                <p className="truncate text-lg font-bold text-primary-600 dark:text-primary-400">{s.value}</p>
                <p className="truncate text-xs font-semibold text-gray-700 dark:text-gray-200">{s.label}</p>
                <p className="truncate text-[11px] text-gray-400 dark:text-gray-500">{s.sub}</p>
              </div>
            ))}
          </div>
          <div className="mt-3 flex items-center justify-center gap-2 text-xs font-semibold text-gray-500 dark:text-gray-400" aria-hidden="true">
            <span className="h-px flex-1 bg-gradient-to-r from-transparent via-primary-300 to-transparent dark:via-primary-700" />
            Connected ecosystem
            <span className="h-px flex-1 bg-gradient-to-r from-transparent via-primary-300 to-transparent dark:via-primary-700" />
          </div>
        </div>
      );
    case 'jobs':
      return (
        <ul className="flex flex-col gap-2">
          {stats.map((s) => (
            <li key={s.label} className="group flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 px-3.5 py-3 dark:border-white/10 dark:bg-white/5">
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-bold text-gray-900 dark:text-white">{s.label}</span>
                <span className="block truncate text-xs text-gray-500 dark:text-gray-400">{s.sub}</span>
              </span>
              <span className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-primary-600 px-2.5 py-1.5 text-xs font-bold text-white">
                {s.value} <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
              </span>
            </li>
          ))}
        </ul>
      );
    case 'message':
      return (
        <div className="flex flex-col gap-2">
          {stats.slice(0, 1).map((s) => (
            <div key={s.label} className="rounded-2xl rounded-tl-md border border-gray-100 bg-gray-50 p-4 dark:border-white/10 dark:bg-white/5">
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">{s.label}</p>
              <p className="mt-1 text-sm font-semibold leading-relaxed text-gray-900 dark:text-white">{s.value}</p>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{s.sub}</p>
            </div>
          ))}
          <ul className="flex flex-col gap-2">
            {stats.slice(1).map((s) => (
              <li key={s.label} className="flex items-center justify-between gap-3 rounded-xl border border-gray-100 bg-gray-50 px-3.5 py-2.5 dark:border-white/10 dark:bg-white/5">
                <span className="truncate text-sm font-semibold text-gray-800 dark:text-gray-200">{s.label}</span>
                <span className="shrink-0 text-sm font-bold text-primary-600 dark:text-primary-400">{s.value}</span>
              </li>
            ))}
          </ul>
        </div>
      );
    case 'dashboard':
    default:
      return (
        <div>
          <ul className="flex flex-col gap-2">
            {stats.map((s) => (
              <li key={s.label} className="flex items-center justify-between gap-3 rounded-xl border border-gray-100 bg-gray-50 px-3.5 py-2.5 dark:border-white/10 dark:bg-white/5">
                <span className="min-w-0">
                  <span className="block truncate text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">{s.label}</span>
                  <span className="block truncate text-xs text-gray-500 dark:text-gray-400">{s.sub}</span>
                </span>
                <span className="shrink-0 text-xl font-bold text-gray-900 dark:text-white">{s.value}</span>
              </li>
            ))}
          </ul>
          <Sparkline className="mt-3 h-14 w-full text-primary-500 dark:text-primary-400" />
        </div>
      );
  }
};

const PremiumHero: React.FC<PremiumHeroProps> = ({
  badgeIcon,
  badgeLabel,
  gradient,
  headline,
  description,
  primaryCta,
  secondaryCta,
  trust,
  breadcrumbs,
  hero,
}) => {
  const Icon = serviceIcon(badgeIcon);
  const reduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] });
  const visualY = useTransform(scrollYProgress, [0, 1], [0, reduceMotion ? 0 : 28]);

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-900">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div
          className="absolute inset-0 opacity-60 dark:opacity-30"
          style={{
            backgroundImage: 'radial-gradient(rgba(109,77,148,0.22) 1px, transparent 1px)',
            backgroundSize: '26px 26px',
          }}
        />
        <div className={`absolute -left-24 -top-24 h-80 w-80 rounded-full bg-gradient-to-br ${gradient} opacity-20 blur-3xl motion-reduce:animate-none animate-float-slow`} />
        <div className="absolute -bottom-32 -right-20 h-96 w-96 rounded-full bg-gradient-to-br from-secondary-500 to-primary-500 opacity-15 blur-3xl motion-reduce:animate-none animate-float-slower" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <motion.nav
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          aria-label="Breadcrumb"
          className="text-sm text-gray-500 dark:text-gray-400"
        >
          {breadcrumbs.map((c, i) => (
            <span key={c.label}>
              {i > 0 && <span className="mx-2" aria-hidden="true">/</span>}
              {c.to ? (
                <Link to={c.to} className="hover:underline">{c.label}</Link>
              ) : (
                <span aria-current="page" className="text-gray-700 dark:text-gray-300">{c.label}</span>
              )}
            </span>
          ))}
        </motion.nav>

        <div className="mt-8 grid items-center gap-10 lg:mt-10 lg:grid-cols-[1.02fr_0.98fr] lg:gap-14">
          <motion.div variants={list} initial="hidden" animate="show" className="min-w-0">
            <motion.p variants={item}>
              <span className="inline-flex items-center gap-2 rounded-full border border-primary-200 bg-white/80 py-1.5 pl-1.5 pr-4 text-xs font-bold uppercase tracking-widest text-primary-700 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/10 dark:text-primary-300">
                <span className={`inline-flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br ${gradient} text-white`}>
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </span>
                {badgeLabel}
              </span>
            </motion.p>
            <motion.h1
              variants={item}
              className="mt-5 text-4xl font-bold leading-[1.08] tracking-tight text-gray-900 dark:text-white sm:text-5xl xl:text-6xl"
            >
              {headline}
            </motion.h1>
            <motion.p variants={item} className="mt-4 max-w-xl text-base leading-relaxed text-gray-600 dark:text-gray-300 sm:text-lg">
              {description}
            </motion.p>
            <motion.div variants={item} className="mt-7 flex flex-col gap-3 sm:flex-row">
              {renderCta(primaryCta, true)}
              {secondaryCta && renderCta(secondaryCta, false)}
            </motion.div>
            {trust.length > 0 && (
              <motion.ul variants={item} className="mt-7 flex flex-wrap gap-x-5 gap-y-2">
                {trust.map((t) => (
                  <li key={t} className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-700 dark:text-gray-200">
                    <Check className="h-4 w-4 text-emerald-500" strokeWidth={3} aria-hidden="true" />
                    {t}
                  </li>
                ))}
              </motion.ul>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 32, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            style={{ y: visualY }}
            className="relative min-w-0"
          >
            <div className="relative rounded-3xl border border-white/60 bg-white/85 shadow-2xl shadow-secondary-900/10 backdrop-blur-xl dark:border-white/10 dark:bg-gray-900/85 dark:shadow-black/40">
              <div className="flex items-center justify-between gap-3 border-b border-gray-100 px-5 py-3.5 dark:border-white/10">
                <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
                  <span className="relative flex h-2 w-2" aria-hidden="true">
                    <span className="absolute h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60 [animation-duration:1.8s] motion-reduce:animate-none" />
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  </span>
                  {hero.visual.panelTitle}
                </span>
                <span className="flex gap-1.5" aria-hidden="true">
                  <span className="h-2.5 w-2.5 rounded-full bg-gray-200 dark:bg-gray-700" />
                  <span className="h-2.5 w-2.5 rounded-full bg-gray-200 dark:bg-gray-700" />
                  <span className="h-2.5 w-2.5 rounded-full bg-gray-200 dark:bg-gray-700" />
                </span>
              </div>
              <div className="p-4 sm:p-5">
                <VisualBody hero={hero} />
              </div>
            </div>

            {hero.visual.floats.slice(0, 2).map((f, i) => {
              const FloatIcon = serviceIcon(f.icon);
              const pos =
                i === 0
                  ? '-left-3 top-10 sm:-left-6 lg:-left-10'
                  : '-right-3 bottom-10 sm:-right-6 lg:-right-8';
              return (
                <div
                  key={f.title}
                  className={`absolute ${pos} z-10 hidden w-52 items-center gap-2.5 rounded-2xl border border-white/60 bg-white/95 p-3 shadow-xl shadow-secondary-900/10 backdrop-blur-xl dark:border-white/10 dark:bg-gray-800/95 md:flex ${
                    i === 0 ? 'motion-reduce:animate-none animate-float' : 'motion-reduce:animate-none animate-float-delayed'
                  }`}
                >
                  <span className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} text-white shadow`}>
                    <FloatIcon className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-xs font-bold text-gray-900 dark:text-white">{f.title}</span>
                    <span className="block truncate text-[11px] text-gray-500 dark:text-gray-400">{f.subtitle}</span>
                  </span>
                </div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default PremiumHero;
