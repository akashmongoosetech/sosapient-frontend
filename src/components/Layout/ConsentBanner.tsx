import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const KEY = 'sosapient_consent';

function readConsent(): string | null {
  try {
    return localStorage.getItem(KEY);
  } catch {
    return null;
  }
}

function applyConsent(granted: boolean) {
  try {
    localStorage.setItem(KEY, granted ? 'granted' : 'denied');
  } catch {
    /* ignore */
  }
  try {
    const gtag = (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag;
    if (typeof gtag === 'function') {
      gtag('consent', 'update', {
        ad_storage: 'denied',
        analytics_storage: granted ? 'granted' : 'denied',
      });
    }
  } catch {
    /* ignore */
  }
}

const ConsentBanner: React.FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!readConsent()) setVisible(true);
  }, []);

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Cookie consent"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-gray-200 bg-white/95 p-4 shadow-lg backdrop-blur dark:border-gray-700 dark:bg-gray-900/95"
    >
      <div className="mx-auto flex max-w-5xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-gray-600 dark:text-gray-300">
          We use strictly-necessary storage plus optional analytics (GA4). See our{' '}
          <Link to="/privacy" className="font-semibold underline">
            Privacy Policy
          </Link>{' '}
          and <Link to="/cookies" className="font-semibold underline">Cookie Policy</Link>.
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => {
              applyConsent(false);
              setVisible(false);
            }}
            className="rounded-lg border px-4 py-2 text-sm font-semibold"
          >
            Reject
          </button>
          <button
            type="button"
            onClick={() => {
              applyConsent(true);
              setVisible(false);
            }}
            className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white"
          >
            Accept analytics
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConsentBanner;
