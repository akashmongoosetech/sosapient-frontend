// Single source of truth for turning a stored image reference into a loadable URL.
//
// A stored image is one of:
//   - "https://…"           an external/absolute URL (logo, unsplash, CDN)
//   - "/api/images/<id>"    an upload stored in MongoDB and served by the API
//   - "/uploads/…"          a legacy upload left on the API host's disk
//   - "data:" / "blob:"     an inline preview
//
// Only the two site-relative API paths need the API origin prepended. Everything
// else (including frontend-owned paths such as "/logo/…") is returned as-is.
export function resolveImageUrl(url?: string | null): string {
  if (!url) return '';
  if (/^(https?:|data:|blob:)/i.test(url)) return url;
  if (url.startsWith('/uploads/') || url.startsWith('/api/images/')) {
    return `${import.meta.env.VITE_BASE_URL || ''}${url}`;
  }
  return url;
}
