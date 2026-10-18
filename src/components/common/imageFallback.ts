import { useCallback, useState } from 'react';

// Neutral placeholder rendered when an image is missing or fails to load, so a
// dead URL degrades into a subtle graphic instead of the browser's broken-image
// glyph. Kept as an inline SVG data URI: dependency-free, and `data:` is already
// allowed by the site's Content-Security-Policy img-src.
export const IMAGE_PLACEHOLDER =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 9" preserveAspectRatio="xMidYMid slice">' +
      '<rect width="16" height="9" fill="#e5e7eb"/>' +
      '<path d="M4.4 6.6 6.2 4.2l1.3 1.7 1.7-2.2 2.4 3z" fill="#9ca3af"/>' +
      '<circle cx="4.6" cy="2.9" r="0.95" fill="#9ca3af"/>' +
      '</svg>'
  );

/**
 * Swap an image for a fallback when the source is empty or fails to load.
 * Returns a safe `src` plus a resilient `onError` handler, so the same logic
 * can drive a plain `<img>` or an animated `motion.img`.
 */
export function useImageFallback(src?: string, fallbackSrc: string = IMAGE_PLACEHOLDER) {
  const [failed, setFailed] = useState(false);

  const onError = useCallback(() => {
    // Once switched to the fallback, a further error is a no-op (no loop).
    setFailed(true);
  }, []);

  const resolvedSrc = !src || failed ? fallbackSrc : src;
  return { resolvedSrc, onError };
}
