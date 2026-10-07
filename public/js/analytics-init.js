// GA4 + Consent Mode v2 defaults (externalized so a strict script-src
// without 'unsafe-inline' still allows it; loaded from same origin).
// Keep MEASUREMENT_ID in sync with VITE_GA_MEASUREMENT_ID fallback in
// src/utils/analytics.ts and the gtag.js src in index.html.
(function () {
  var MEASUREMENT_ID = 'G-45Y111F07G';
  window.dataLayer = window.dataLayer || [];
  function gtag() {
    window.dataLayer.push(arguments);
  }
  window.gtag = gtag;
  gtag('consent', 'default', {
    ad_storage: 'denied',
    analytics_storage: 'denied',
    functionality_storage: 'granted',
    security_storage: 'granted'
  });
  try {
    if (localStorage.getItem('sosapient_consent') === 'granted') {
      gtag('consent', 'update', { ad_storage: 'denied', analytics_storage: 'granted' });
    }
  } catch (e) {
    /* storage unavailable */
  }
  gtag('js', new Date());
  gtag('config', MEASUREMENT_ID);
})();
