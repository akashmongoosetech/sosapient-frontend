// Shared blog helpers: slug preview (UX only — backend finalizes) + SEO fallbacks.

export function buildSlugPreview(value: string): string {
  return String(value || '')
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 160)
    .replace(/-+$/g, '');
}

export function isValidSlug(value: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value) && value.length <= 160;
}

export function siteUrl(): string {
  const base = (import.meta.env.VITE_SITE_URL as string) || 'https://sosapient.in';
  return base.replace(/\/+$/, '');
}

export function absoluteUrl(url: string | undefined): string {
  if (!url) return '';
  const v = String(url).trim();
  if (!v) return '';
  if (/^https?:\/\//i.test(v)) return v;
  if (v.startsWith('/uploads')) return `${import.meta.env.VITE_BASE_URL || ''}${v}`;
  if (v.startsWith('/')) return `${siteUrl()}${v}`;
  // Bare relative paths are invalid for crawlers (og:image/canonical) — drop them.
  return '';
}

// Canonical URLs must be absolute http(s); fall back to the site default.
export function canonicalUrl(url: string | undefined, fallback: string): string {
  const v = String(url || '').trim();
  if (/^https?:\/\//i.test(v)) return v;
  return fallback;
}

export function stripHtml(html: string): string {
  return String(html || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

export interface BlogSeoSource {
  title: string;
  excerpt?: string;
  content?: string;
  image?: string;
  author?: { name?: string };
  category?: string;
  tags?: string[];
  publishedAt?: string;
  createdAt?: string;
  updatedAt?: string;
  slug: string;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
    canonicalUrl?: string;
    ogTitle?: string;
    ogDescription?: string;
    ogImage?: string;
    twitterTitle?: string;
    twitterDescription?: string;
    twitterImage?: string;
  };
}

export interface ResolvedBlogSeo {
  title: string;
  description: string;
  canonical: string;
  keywords: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  twitterTitle: string;
  twitterDescription: string;
  twitterImage: string;
}

// Fallback chains: explicit SEO → base content → derived excerpt.
export function truncateTitle(value: string, max = 60): string {
  const v = String(value || '').trim().replace(/\s+/g, ' ');
  return v.length > max ? `${v.slice(0, max - 1).trim()}…` : v;
}

export function resolveBlogSeo(blog: BlogSeoSource): ResolvedBlogSeo {
  const contentExcerpt = stripHtml(blog.content || '').slice(0, 160);
  const description = blog.seo?.metaDescription?.trim()
    || blog.excerpt?.trim()
    || contentExcerpt
    || `${blog.title} — SoSapient blog`;
  const rawTitle = blog.seo?.metaTitle?.trim() || `${blog.title} | SoSapient`;
  const title = truncateTitle(rawTitle, 60);
  const canonical = canonicalUrl(blog.seo?.canonicalUrl, `${siteUrl()}/blog/${blog.slug}`);
  const cover = `${siteUrl()}/og/og-cover-1200x630.png`;
  const image = absoluteUrl(blog.seo?.ogImage) || absoluteUrl(blog.image) || cover;
  const ogTitle = truncateTitle(blog.seo?.ogTitle?.trim() || blog.seo?.metaTitle?.trim() || blog.title, 60);
  const ogDescription = blog.seo?.ogDescription?.trim() || description;
  const keywords = (blog.seo?.keywords && blog.seo.keywords.length > 0
    ? blog.seo.keywords
    : [...(blog.tags || []), blog.category].filter(Boolean) as string[]
  ).join(', ');
  return {
    title,
    description,
    canonical,
    keywords,
    ogTitle,
    ogDescription,
    ogImage: image,
    twitterTitle: truncateTitle(blog.seo?.twitterTitle?.trim() || ogTitle, 60),
    twitterDescription: blog.seo?.twitterDescription?.trim() || ogDescription,
    twitterImage: absoluteUrl(blog.seo?.twitterImage) || image
  };
}
