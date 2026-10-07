import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ShieldAlert } from 'lucide-react';

const SECTIONS: { heading: string; body: string[] }[] = [
  {
    heading: 'Information We Collect',
    body: [
      'Contact enquiries: when you use our contact form we collect your name, email address, company, phone number, subject, message, budget range and timeline.',
      'Job applications: when you apply for a role we collect your name, email, phone, experience, current company, expected salary, notice period, cover letter and your resume file (PDF/DOC, up to 5 MB).',
      'Newsletter: when you subscribe we collect your email address. You can unsubscribe at any time.',
      'Accounts: when you sign up we collect your first and last name, username, email, mobile number and an optional profile picture URL.',
      'Blog interactions: when you comment we collect the name, email and comment you provide. Likes are stored against an anonymous browser identifier.',
      'Chatbot: when you share details with our website assistant we collect the name, email, phone, company and message you provide.',
    ],
  },
  {
    heading: 'How We Use Information',
    body: [
      'To respond to your enquiries, applications and support requests.',
      'To evaluate job applications and contact shortlisted candidates.',
      'To send the newsletter you subscribed to and service-related notices.',
      'To operate accounts, authenticate logins and keep the service secure.',
    ],
  },
  {
    heading: 'Cookies & Local Storage',
    body: [
      'We use browser local storage for strictly functional purposes: your theme preference, login session, sidebar state, chatbot open state, blog draft backups and popup dismissal state.',
      'We use Google Analytics (GA4) and Google Tag Manager to understand aggregated website usage. These tools may set their own cookies. We do not run advertising trackers.',
      'Embedded content (Google Fonts, Google Maps) is loaded from third-party servers and is subject to their own privacy policies.',
    ],
  },
  {
    heading: 'Data Sharing & Storage',
    body: [
      'We do not sell your personal information.',
      'Form submissions are stored in our secured database and emailed to our team so we can respond.',
      'Uploaded resumes are stored securely and are accessible only to our hiring team.',
      'We do not share your data with third parties except the infrastructure required to run this website (hosting, email delivery, analytics as described above).',
    ],
  },
  {
    heading: 'Your Rights & Choices',
    body: [
      'You may request access, correction or deletion of your personal information at any time.',
      'You may unsubscribe from the newsletter at any time.',
      'You may disable cookies in your browser settings; core website features will continue to work.',
    ],
  },
  {
    heading: 'Contact Us About Privacy',
    body: [
      'For any privacy question or data request, contact us through the contact page or email info.sosapient@gmail.com.',
    ],
  },
];

const Privacy: React.FC = () => (
  <div className="bg-white dark:bg-gray-900">
    <Helmet>
      <title>Privacy Policy | Data & Cookies | SoSapient</title>
      <meta
        name="description"
        content="How SoSapient collects, uses and protects your information across contact forms, applications, accounts and analytics."
      />
      <link rel="canonical" href="https://sosapient.in/privacy" />
      <meta property="og:type" content="website" />
      <meta property="og:title" content="Privacy Policy | SoSapient" />
      <meta property="og:description" content="How SoSapient collects, uses and protects your information." />
      <meta property="og:url" content="https://sosapient.in/privacy" />
      <meta property="og:site_name" content="SoSapient" />
      <meta property="og:image" content="https://sosapient.in/logo/Dlogo.png" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="Privacy Policy | SoSapient" />
      <meta name="twitter:description" content="How SoSapient collects, uses and protects your information." />
      <meta name="twitter:image" content="https://sosapient.in/logo/Dlogo.png" />
    </Helmet>
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <p className="inline-flex items-center gap-2 rounded-full bg-primary-50 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-primary-700 dark:bg-primary-900/40 dark:text-primary-300">
          <ShieldAlert className="h-3.5 w-3.5" aria-hidden="true" />
          Privacy Policy
        </p>
        <h1 className="mt-3 text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
          Your privacy matters
        </h1>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Last updated: October 7, 2026 · Version 0.1 (draft pending legal review)</p>
        <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-900/20 dark:text-amber-300" role="note">
          <strong>DRAFT — PENDING REVIEW BY A QUALIFIED LEGAL PROFESSIONAL.</strong> This policy was drafted from an
          audit of what this website actually collects. Do not rely on it until counsel has reviewed retention periods,
          DPDP/GDPR rights, grievance-officer details, and subprocessors.
        </div>
        <div className="mt-8 space-y-8">
          {SECTIONS.map((s) => (
            <section key={s.heading} aria-label={s.heading}>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">{s.heading}</h2>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-gray-600 dark:text-gray-300">
                {s.body.map((b, i) => (
                  <li key={i}>{b}</li>
                ))}
              </ul>
            </section>
          ))}
        </div>
        <p className="mt-10 text-sm text-gray-500 dark:text-gray-400">
          Questions?{' '}
          <Link to="/contact" className="font-semibold text-primary-600 hover:underline dark:text-primary-400">
            Contact us
          </Link>
          .
        </p>
      </div>
    </section>
  </div>
);

export default Privacy;
