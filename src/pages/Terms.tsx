import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

const Terms: React.FC = () => (
  <div className="bg-white dark:bg-gray-900">
    <Helmet>
      <title>Terms of Service | Website Use | SoSapient</title>
      <meta name="description" content="Terms governing use of the SoSapient website. Draft pending review by a qualified legal professional." />
      <link rel="canonical" href="https://sosapient.in/terms" />
      <meta name="robots" content="index, follow" />
      <meta property="og:type" content="website" />
      <meta property="og:title" content="Terms of Service | Website Use | SoSapient" />
      <meta property="og:description" content="Terms governing use of the SoSapient website." />
      <meta property="og:url" content="https://sosapient.in/terms" />
      <meta property="og:site_name" content="SoSapient" />
      <meta property="og:image" content="https://sosapient.in/og/og-cover-1200x630.png" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:image" content="https://sosapient.in/og/og-cover-1200x630.png" />
    </Helmet>
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <p className="text-[11px] font-bold uppercase tracking-widest text-gray-500">Terms of Service</p>
        <h1 className="mt-3 text-3xl font-bold sm:text-4xl">Terms of Service</h1>
        <p className="mt-2 text-sm text-gray-500">Last updated: October 7, 2026 · Version 0.1 (draft pending legal review)</p>
        <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800" role="note">
          <strong>DRAFT — PENDING REVIEW BY A QUALIFIED LEGAL PROFESSIONAL.</strong> Covers accounts, acceptable use,
          intellectual property, liability, and contact. Do not rely on it until counsel approves.
        </div>
        <div className="mt-8 space-y-6 text-gray-600">
          <section><h2 className="text-xl font-bold text-gray-900">Accounts</h2><p className="mt-2">You are responsible for activity under your account and for keeping credentials confidential. We may suspend accounts for misuse.</p></section>
          <section><h2 className="text-xl font-bold text-gray-900">Acceptable use</h2><p className="mt-2">Do not abuse, disrupt, or attempt unauthorized access to the service.</p></section>
          <section><h2 className="text-xl font-bold text-gray-900">Intellectual property</h2><p className="mt-2">Site content belongs to SoSapient or its licensors unless stated otherwise.</p></section>
          <section><h2 className="text-xl font-bold text-gray-900">Contact</h2><p className="mt-2">Questions? <Link to="/contact" className="font-semibold underline">Contact us</Link>.</p></section>
        </div>
      </div>
    </section>
  </div>
);

export default Terms;
