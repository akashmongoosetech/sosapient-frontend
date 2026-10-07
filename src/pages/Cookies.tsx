import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

const Cookies: React.FC = () => (
  <div className="bg-white dark:bg-gray-900">
    <Helmet>
      <title>Cookie Policy | Consent & Storage | SoSapient</title>
      <meta name="description" content="How SoSapient uses cookies and local storage, and how to manage consent. Draft pending legal review." />
      <link rel="canonical" href="https://sosapient.in/cookies" />
      <meta name="robots" content="index, follow" />
      <meta property="og:type" content="website" />
      <meta property="og:title" content="Cookie Policy | Consent & Storage | SoSapient" />
      <meta property="og:description" content="How SoSapient uses cookies and local storage." />
      <meta property="og:url" content="https://sosapient.in/cookies" />
      <meta property="og:site_name" content="SoSapient" />
      <meta property="og:image" content="https://sosapient.in/og/og-cover-1200x630.png" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:image" content="https://sosapient.in/og/og-cover-1200x630.png" />
    </Helmet>
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <p className="text-[11px] font-bold uppercase tracking-widest text-gray-500">Cookie Policy</p>
        <h1 className="mt-3 text-3xl font-bold sm:text-4xl">Cookie Policy</h1>
        <p className="mt-2 text-sm text-gray-500">Last updated: October 7, 2026 · Version 0.1 (draft pending legal review)</p>
        <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800" role="note">
          <strong>DRAFT — PENDING REVIEW BY A QUALIFIED LEGAL PROFESSIONAL.</strong>
        </div>
        <div className="mt-8 space-y-6 text-gray-600">
          <section><h2 className="text-xl font-bold text-gray-900">Strictly necessary</h2><p className="mt-2">Theme, login session, and consent choice stored locally. Required for core features.</p></section>
          <section><h2 className="text-xl font-bold text-gray-900">Analytics (optional)</h2><p className="mt-2">GA4 via Google Tag Manager only after you choose “Accept analytics” in the banner. Reject keeps analytics off.</p></section>
          <section><h2 className="text-xl font-bold text-gray-900">Manage</h2><p className="mt-2">Clear site data in your browser or re-choose via the banner. See <Link to="/privacy" className="font-semibold underline">Privacy Policy</Link>.</p></section>
        </div>
      </div>
    </section>
  </div>
);

export default Cookies;
