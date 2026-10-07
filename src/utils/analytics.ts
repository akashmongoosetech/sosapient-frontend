// Lightweight GA4 event layer on top of the gtag.js snippet already in
// index.html. No new dependency; all calls are no-ops when gtag is absent
// (ad-blockers, failed loads) so tracking never breaks the app.

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

const MEASUREMENT_ID =
  (import.meta.env.VITE_GA_MEASUREMENT_ID as string | undefined) || 'G-45Y111F07G';

export function trackPageView(path: string): void {
  try {
    if (typeof window === 'undefined' || typeof window.gtag !== 'function') return;
    window.gtag('config', MEASUREMENT_ID, { page_path: path });
  } catch {
    // analytics must never break the app
  }
}

export function trackEvent(
  name: string,
  params: Record<string, string | number | boolean> = {}
): void {
  try {
    if (typeof window === 'undefined' || typeof window.gtag !== 'function') return;
    const clean: Record<string, string | number | boolean> = {};
    for (const [k, v] of Object.entries(params)) {
      // Never send passwords, tokens, or message bodies.
      if (/pass|token|secret|message|cover|resume/i.test(k)) continue;
      clean[k] = v;
    }
    window.gtag('event', name, { ...clean, send_to: MEASUREMENT_ID });
  } catch {
    // analytics must never break the app
  }
}

export function trackFormSubmit(form: string): void {
  trackEvent('form_submit', { form_name: form });
}
