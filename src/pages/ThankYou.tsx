import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { CheckCircle2, Home, Phone } from 'lucide-react';
import { trackEvent } from '../utils/analytics';

const ThankYou: React.FC = () => {
  useEffect(() => {
    trackEvent('thank_you_view', { page: '/thank-you' });
  }, []);
  return (
  <div className="bg-white dark:bg-gray-900">
    <Helmet>
      <title>Thank You | SoSapient</title>
      <meta name="description" content="Thanks for reaching out to SoSapient. Our team will get back to you shortly." />
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
        <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/40">
          <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-400" aria-hidden="true" />
        </span>
        <h1 className="mt-6 text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
          Thank you for reaching out!
        </h1>
        <p className="mx-auto mt-3 max-w-md text-gray-600 dark:text-gray-300">
          Your submission was received successfully. Our team reviews every enquiry and
          will get back to you within one business day.
        </p>
        <div className="mt-4 rounded-2xl border border-gray-200 bg-gray-50 p-5 text-left dark:border-gray-700 dark:bg-gray-800/60">
          <p className="text-sm font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
            What happens next
          </p>
          <ol className="mt-2 list-decimal space-y-1.5 pl-5 text-sm text-gray-600 dark:text-gray-300">
            <li>We review your requirements and check the best-fit solution.</li>
            <li>You receive a personal reply from our team — no bots, no spam.</li>
            <li>We schedule a free consultation call at your convenience.</li>
          </ol>
        </div>
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
            <Phone className="h-5 w-5" aria-hidden="true" />
            Contact Us Again
          </Link>
        </div>
      </div>
    </section>
  </div>
  );
};

export default ThankYou;
