import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import CaseStudyCard from '../components/case-studies/CaseStudyCard';
import { siteUrl } from '../utils/blog';
import { CaseStudy } from '../types/caseStudy';

const LIMIT = 12;

const CaseStudies: React.FC = () => {
  const [items, setItems] = useState<CaseStudy[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(search.trim());
      setPage(1);
    }, 350);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BASE_URL}/api/case-studies/public/categories`);
        const data = await res.json();
        if (data.success && Array.isArray(data.data)) setCategories(data.data);
      } catch {
        // filters simply stay hidden
      }
    })();
  }, []);

  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({ page: String(page), limit: String(LIMIT) });
      if (debouncedSearch) params.set('search', debouncedSearch);
      if (category !== 'all') params.set('category', category);
      const res = await fetch(`${import.meta.env.VITE_BASE_URL}/api/case-studies/public?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setItems(Array.isArray(data.data) ? data.data : []);
        setTotalPages(data.pagination?.totalPages || 1);
        setError(null);
      } else {
        throw new Error(data.message || 'Failed to load case studies');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load case studies');
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, category]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const canonical = `${siteUrl()}/case-studies`;

  return (
    <div className="bg-white dark:bg-gray-900">
      <Helmet>
        <title>Case Studies | SoSapient — Client Projects & Outcomes</title>
        <meta name="description" content="Selected SoSapient client projects: real solutions, measurable outcomes, and the technologies behind them." />
        <link rel="canonical" href={canonical} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Case Studies | SoSapient" />
        <meta property="og:description" content="Selected SoSapient client projects: real solutions, measurable outcomes, and the technologies behind them." />
        <meta property="og:url" content={canonical} />
        <meta property="og:site_name" content="SoSapient" />
        <meta property="og:image" content="https://sosapient.in/logo/Dlogo.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Case Studies | SoSapient" />
        <meta name="twitter:description" content="Selected SoSapient client projects: real solutions, measurable outcomes, and the technologies behind them." />
        <meta name="twitter:image" content="https://sosapient.in/logo/Dlogo.png" />
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: 'Case Studies | SoSapient',
            description: 'Selected SoSapient client projects: real solutions, measurable outcomes, and the technologies behind them.',
            url: canonical
          })}
        </script>
      </Helmet>

      <section className="bg-gradient-to-br from-primary-50 to-secondary-50 py-16 dark:from-gray-800 dark:to-gray-900 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1 className="font-display text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
              Our Case Studies
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600 dark:text-gray-300">
              Selected projects, solutions and business outcomes — real work for real clients,
              with the results to show for it.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative flex-1 lg:max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search case studies…"
              aria-label="Search case studies"
              className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-9 pr-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
            />
          </div>
          {categories.length > 0 && (
            <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
              <button
                type="button"
                onClick={() => { setCategory('all'); setPage(1); }}
                className={`min-h-[40px] rounded-full px-4 text-sm font-semibold transition ${category === 'all' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300'}`}
              >
                All
              </button>
              {categories.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => { setCategory(c); setPage(1); }}
                  className={`min-h-[40px] rounded-full px-4 text-sm font-semibold transition ${category === c ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300'}`}
                >
                  {c}
                </button>
              ))}
            </div>
          )}
        </div>

        {loading ? (
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3" aria-live="polite" aria-label="Loading case studies">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700">
                <div className="h-48 animate-pulse bg-gray-200 dark:bg-gray-700" />
                <div className="space-y-3 p-5">
                  <div className="h-5 w-3/4 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                  <div className="h-4 w-1/2 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                  <div className="h-16 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="mx-auto max-w-md py-16 text-center">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Unable to load case studies</h2>
            <p className="mt-2 text-sm text-gray-500">{error}</p>
            <button
              onClick={fetchItems}
              className="mt-4 inline-flex min-h-[40px] items-center rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700"
            >
              Try again
            </button>
          </div>
        ) : items.length === 0 ? (
          <div className="mx-auto max-w-md py-16 text-center">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">No case studies available yet</h2>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              {search || category !== 'all'
                ? 'No case studies match your filters.'
                : "We're currently preparing our latest projects and success stories."}
            </p>
          </div>
        ) : (
          <>
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((item, i) => (
                <CaseStudyCard key={item._id} item={item} index={i} />
              ))}
            </div>
            {totalPages > 1 && (
              <div className="mt-10 flex items-center justify-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="min-h-[40px] rounded-lg border border-gray-300 px-4 text-sm font-semibold text-gray-700 disabled:opacity-50 dark:border-gray-600 dark:text-gray-200"
                >
                  Previous
                </button>
                <span className="px-2 text-sm text-gray-500">{page} / {totalPages}</span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="min-h-[40px] rounded-lg border border-gray-300 px-4 text-sm font-semibold text-gray-700 disabled:opacity-50 dark:border-gray-600 dark:text-gray-200"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
};

export default CaseStudies;
