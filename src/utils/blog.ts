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
  if (/^https?:\/\//i.test(url)) return url;
  if (url.startsWith('/uploads')) return `${import.meta.env.VITE_BASE_URL || ''}${url}`;
  if (url.startsWith('/')) return `${siteUrl()}${url}`;
  return url;
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
export function resolveBlogSeo(blog: BlogSeoSource): ResolvedBlogSeo {
  const contentExcerpt = stripHtml(blog.content || '').slice(0, 160);
  const description = blog.seo?.metaDescription?.trim()
    || blog.excerpt?.trim()
    || contentExcerpt
    || `${blog.title} — SoSapient blog`;
  const title = blog.seo?.metaTitle?.trim() || `${blog.title} | SoSapient`;
  const canonical = blog.seo?.canonicalUrl?.trim() || `${siteUrl()}/blog/${blog.slug}`;
  const image = absoluteUrl(blog.seo?.ogImage) || absoluteUrl(blog.image);
  const ogTitle = blog.seo?.ogTitle?.trim() || blog.seo?.metaTitle?.trim() || blog.title;
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
    twitterTitle: blog.seo?.twitterTitle?.trim() || ogTitle,
    twitterDescription: blog.seo?.twitterDescription?.trim() || ogDescription,
    twitterImage: absoluteUrl(blog.seo?.twitterImage) || image
  };
}
