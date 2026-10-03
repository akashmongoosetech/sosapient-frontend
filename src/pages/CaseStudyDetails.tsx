import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Calendar, Clock } from 'lucide-react';
import BlogRichContent from '../components/Blog/BlogRichContent';
import CaseStudyCard from '../components/case-studies/CaseStudyCard';
import { siteUrl, stripHtml, absoluteUrl } from '../utils/blog';
import { CaseStudy, caseStudyIcon } from '../types/caseStudy';

const CaseStudyDetails: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [doc, setDoc] = useState<CaseStudy | null>(null);
  const [related, setRelated] = useState<CaseStudy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) {
      setError('Case Study Not Found');
      setLoading(false);
      return;
    }
    (async () => {
      try {
        setLoading(true);
        const res = await fetch(`${import.meta.env.VITE_BASE_URL}/api/case-studies/public/${encodeURIComponent(slug)}`);
        const data = await res.json();
        if (data.success && data.data) {
          setDoc(data.data);
          setError(null);
          // Related: same category first, then others — never the current item
          try {
            const list: { category: string } = { category: (data.data as CaseStudy).category };
            const r = await fetch(
              `${import.meta.env.VITE_BASE_URL}/api/case-studies/public?limit=50&category=${encodeURIComponent(list.category)}`
            );
            const rd = await r.json();
            let pool: CaseStudy[] = Array.isArray(rd.data) ? rd.data.filter((x: CaseStudy) => x.slug !== slug) : [];
            if (pool.length < 3) {
              const all = await fetch(`${import.meta.env.VITE_BASE_URL}/api/case-studies/public?limit=50`);
              const ad = await all.json();
              const rest: CaseStudy[] = Array.isArray(ad.data)
                ? ad.data.filter((x: CaseStudy) => x.slug !== slug && !pool.some((p) => p.slug === x.slug))
                : [];
              pool = [...pool, ...rest];
            }
            setRelated(pool.slice(0, 3));
          } catch {
            // related is optional
          }
        } else {
          setError('Case Study Not Found');
        }
      } catch {
        setError('Unable to load this case study.');
      } finally {
        setLoading(false);
      }
    })();
  }, [slug]);

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8" aria-live="polite" aria-label="Loading case study">
        <div className="h-8 w-40 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
        <div className="mt-4 h-12 w-3/4 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
        <div className="mt-6 h-72 animate-pulse rounded-2xl bg-gray-200 dark:bg-gray-700" />
        <div className="mt-6 space-y-3">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-5 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !doc) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <h1 className="font-display text-3xl font-bold text-gray-900 dark:text-white">Case Study Not Found</h1>
        <p className="mt-3 text-gray-600 dark:text-gray-300">
          {error || 'The case study you are looking for does not exist or is no longer available.'}
        </p>
        <Link
          to="/case-studies"
          className="mt-6 inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-primary-600 px-6 py-2.5 font-semibold text-white hover:bg-primary-700"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Case Studies
        </Link>
      </div>
    );
  }

  const Icon = caseStudyIcon(doc.icon);
  const overviewText = stripHtml(doc.overview || '').slice(0, 160);
  const metaTitle = doc.seo?.metaTitle?.trim() || `${doc.title} | SoSapient`;
  const metaDescription = doc.seo?.metaDescription?.trim() || overviewText || `${doc.title} — a SoSapient client success story.`;
  const keywords = (doc.seo?.keywords && doc.seo.keywords.length > 0
    ? doc.seo.keywords
    : [doc.category, doc.client, ...doc.technologies]
  ).join(', ');
  const canonical = `${siteUrl()}/case-studies/${doc.slug}`;
  const ogImage = absoluteUrl(doc.thumbnailImageUrl);

  return (
    <div className="bg-white dark:bg-gray-900">
      <Helmet>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDescription} />
        {keywords && <meta name="keywords" content={keywords} />}
        <link rel="canonical" href={canonical} />
        <meta property="og:type" content="article" />
        <meta property="og:title" content={metaTitle} />
        <meta property="og:description" content={metaDescription} />
        {ogImage && <meta property="og:image" content={ogImage} />}
        <meta property="og:url" content={canonical} />
        <meta property="og:site_name" content="SoSapient" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={metaTitle} />
        <meta name="twitter:description" content={metaDescription} />
        {ogImage && <meta name="twitter:image" content={ogImage} />}
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: doc.title,
            description: metaDescription,
            image: ogImage ? [ogImage] : undefined,
            datePublished: doc.createdAt,
            dateModified: doc.updatedAt,
            author: { '@type': 'Organization', name: 'SoSapient' },
            publisher: {
              '@type': 'Organization',
              name: 'SoSapient',
              logo: {
                '@type': 'ImageObject',
                url: 'https://ik.imagekit.io/sentyaztie/Dlogo.png?updatedAt=1749928182723'
              }
            },
            mainEntityOfPage: { '@type': 'WebPage', '@id': canonical }
          })}
        </script>
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: `${siteUrl()}/` },
              { '@type': 'ListItem', position: 2, name: 'Case Studies', item: `${siteUrl()}/case-studies` },
              { '@type': 'ListItem', position: 3, name: doc.title, item: canonical }
            ]
          })}
        </script>
      </Helmet>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-12 dark:from-gray-800 dark:via-gray-900 dark:to-gray-900 sm:py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <nav aria-label="Breadcrumb" className="text-sm text-gray-500 dark:text-gray-400">
              <Link to="/" className="hover:underline">Home</Link>
              <span className="mx-2" aria-hidden="true">/</span>
              <Link to="/case-studies" className="hover:underline">Case Studies</Link>
              <span className="mx-2" aria-hidden="true">/</span>
              <span aria-current="page" className="text-gray-700 dark:text-gray-300">{doc.title}</span>
            </nav>
            <div className="mt-4 inline-flex items-center gap-3">
              <span className={`inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r ${doc.color} text-white shadow-md`}>
                <Icon className="h-6 w-6" aria-hidden="true" />
              </span>
              <span className="rounded-full bg-primary-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary-700 dark:bg-primary-800/40 dark:text-primary-300">
                {doc.category}
              </span>
            </div>
            <h1 className="mt-4 font-display text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
              {doc.title}
            </h1>
            <p className="mt-3 text-lg text-gray-600 dark:text-gray-300">{doc.client}</p>
            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-gray-500 dark:text-gray-400">
              {doc.duration && (
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="h-4 w-4" /> Duration: {doc.duration}
                </span>
              )}
              {doc.createdAt && (
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" /> {new Date(doc.createdAt).toLocaleDateString()}
                </span>
              )}
            </div>
            {doc.technologies.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-2">
                {doc.technologies.map((t) => (
                  <span key={t} className="rounded-full bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm dark:bg-gray-800 dark:text-gray-200">
                    {t}
                  </span>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </section>

      <article className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <img
          src={doc.thumbnailImageUrl}
          alt={doc.title}
          loading="lazy"
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
          className="max-h-[480px] w-full rounded-2xl object-cover shadow-md"
        />

        <section className="mt-10" aria-label="Overview">
          <h2 className="font-display text-2xl font-bold text-gray-900 dark:text-white">Overview</h2>
          <div className="mt-4"><BlogRichContent html={doc.overview} label="Case study overview" /></div>
        </section>

        {doc.challenge && (
          <section className="mt-10" aria-label="Challenge">
            <h2 className="font-display text-2xl font-bold text-gray-900 dark:text-white">The Challenge</h2>
            <div className="mt-4"><BlogRichContent html={doc.challenge} label="Case study challenge" /></div>
          </section>
        )}

        {doc.solution && (
          <section className="mt-10" aria-label="Solution">
            <h2 className="font-display text-2xl font-bold text-gray-900 dark:text-white">The Solution</h2>
            <div className="mt-4"><BlogRichContent html={doc.solution} label="Case study solution" /></div>
          </section>
        )}

        {doc.results.length > 0 && (
          <section className="mt-12" aria-label="Results">
            <h2 className="text-center font-display text-2xl font-bold text-gray-900 dark:text-white">Results</h2>
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {doc.results.map((r, i) => {
                const RIcon = caseStudyIcon(r.icon);
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.06 }}
                    viewport={{ once: true }}
                    className="rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm dark:border-gray-700 dark:bg-gray-900"
                  >
                    <RIcon className="mx-auto h-7 w-7 text-primary-600 dark:text-primary-400" aria-hidden="true" />
                    <p className="mt-3 text-3xl font-bold text-gray-900 dark:text-white">{r.value}</p>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{r.label}</p>
                  </motion.div>
                );
              })}
            </div>
          </section>
        )}

        <section className="mt-12 rounded-2xl bg-gray-50 p-6 dark:bg-gray-800/60" aria-label="Project information">
          <h2 className="font-display text-xl font-bold text-gray-900 dark:text-white">Project Information</h2>
          <dl className="mt-4 grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
            <div>
              <dt className="font-medium text-gray-500 dark:text-gray-400">Client</dt>
              <dd className="mt-0.5 font-semibold text-gray-900 dark:text-white">{doc.client}</dd>
            </div>
            <div>
              <dt className="font-medium text-gray-500 dark:text-gray-400">Category</dt>
              <dd className="mt-0.5 font-semibold text-gray-900 dark:text-white">{doc.category}</dd>
            </div>
            <div>
              <dt className="font-medium text-gray-500 dark:text-gray-400">Duration</dt>
              <dd className="mt-0.5 font-semibold text-gray-900 dark:text-white">{doc.duration}</dd>
            </div>
            <div>
              <dt className="font-medium text-gray-500 dark:text-gray-400">Technologies</dt>
              <dd className="mt-0.5 font-semibold text-gray-900 dark:text-white">{doc.technologies.join(', ') || '—'}</dd>
            </div>
          </dl>
        </section>

        {related.length > 0 && (
          <section className="mt-12" aria-label="Related case studies">
            <h2 className="font-display text-2xl font-bold text-gray-900 dark:text-white">Related Case Studies</h2>
            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((r, i) => (
                <CaseStudyCard key={r._id} item={r} index={i} />
              ))}
            </div>
          </section>
        )}

        <div className="mt-12 flex flex-wrap items-center justify-between gap-4">
          <Link
            to="/case-studies"
            className="inline-flex min-h-[44px] items-center gap-2 rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Case Studies
          </Link>
        </div>
      </article>

      <section className="px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl rounded-3xl bg-gradient-to-br from-primary-600 to-secondary-700 px-6 py-12 text-center sm:px-12">
          <h2 className="font-display text-2xl font-bold text-white sm:text-3xl">Have a similar project in mind?</h2>
          <p className="mx-auto mt-3 max-w-2xl text-blue-100">Let&apos;s build a solution for your business.</p>
          <Link
            to="/contact"
            className="mt-6 inline-flex min-h-[48px] items-center gap-2 rounded-lg bg-white px-8 py-3 font-semibold text-primary-700 hover:bg-gray-50"
          >
            Start a Project <ArrowRight className="h-5 w-5" aria-hidden="true" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default CaseStudyDetails;
