import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Home, Compass } from 'lucide-react';

const QUICK_LINKS = [
  { to: '/services', label: 'Services' },
  { to: '/industries', label: 'Industries' },
  { to: '/blog', label: 'Blog' },
  { to: '/case-studies', label: 'Case Studies' },
  { to: '/careers', label: 'Careers' },
  { to: '/contact', label: 'Contact' },
];

const NotFound: React.FC = () => (
  <div className="bg-white dark:bg-gray-900">
    <Helmet>
      <title>Page Not Found | SoSapient</title>
      <meta name="description" content="The page you are looking for does not exist. Return home or explore our services." />
      <meta name="robots" content="noindex, nofollow" />
    </Helmet>
    <section className="relative overflow-hidden py-20 sm:py-28">
      <div
        className="pointer-events-none absolute inset-0 opacity-50 dark:opacity-20"
        aria-hidden="true"
        style={{
          backgroundImage: 'radial-gradient(rgba(109,77,148,0.25) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />
      <div className="relative mx-auto max-w-2xl px-4 text-center sm:px-6">
        <p className="font-display text-7xl font-bold text-primary-600 dark:text-primary-400 sm:text-8xl" aria-hidden="true">
          404
        </p>
        <h1 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
          Page Not Found
        </h1>
        <p className="mx-auto mt-3 max-w-md text-gray-600 dark:text-gray-300">
          The page you are looking for has been moved, renamed, or never existed.
          Let&apos;s get you back on track.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            to="/"
            className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-primary-600 px-7 py-3 font-semibold text-white shadow-lg shadow-primary-600/25 transition hover:bg-primary-700"
          >
            <Home className="h-5 w-5" aria-hidden="true" />
            Back to Home
          </Link>
          <Link
            to="/contact"
            className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl border-2 border-primary-600 px-7 py-3 font-semibold text-primary-700 transition hover:bg-primary-50 dark:text-primary-300 dark:hover:bg-primary-800/20"
          >
            <Compass className="h-5 w-5" aria-hidden="true" />
            Contact Us
          </Link>
        </div>
        <nav aria-label="Popular pages" className="mt-10">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
            Popular pages
          </p>
          <ul className="mt-3 flex flex-wrap justify-center gap-2">
            {QUICK_LINKS.map((l) => (
              <li key={l.to}>
                <Link
                  to={l.to}
                  className="inline-block rounded-full bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-primary-100 hover:text-primary-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-primary-900/40"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </section>
  </div>
);

export default NotFound;
