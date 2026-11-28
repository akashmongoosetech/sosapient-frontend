import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Search, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { TrainingCard } from '../../components/training/TrainingCard';
import { TrainingListItem } from '../../types/training';
import { trackPageView } from '../../utils/analytics';

const PAGE_SIZE = 9;

interface TrainingListProps {}

const TrainingList: React.FC<TrainingListProps> = () => {
  const [trainings, setTrainings] = useState<TrainingListItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [debouncedQuery, setDebouncedQuery] = useState<string>('');
  const [pagination, setPagination] = useState<{
    currentPage: number;
    totalPages: number;
    totalItems: number;
    hasNext: boolean;
    hasPrev: boolean;
  } | null>(null);

  const isMounted = useRef(false);

  useEffect(() => {
    trackPageView('/training');
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Debounce typing so the API is not hit on every keystroke.
  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedQuery(searchQuery.trim());
      setPage(1);
    }, 350);
    return () => clearTimeout(t);
  }, [searchQuery]);

  useEffect(() => {
    const fetchData = async () => {
      if (!isMounted.current) return;
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        params.set('page', String(page));
        params.set('limit', String(PAGE_SIZE));
        if (selectedCategory !== 'all') params.set('category', selectedCategory);
        if (debouncedQuery) params.set('search', debouncedQuery);

        const res = await fetch(`${import.meta.env.VITE_BASE_URL}/api/trainings/public?${params}`);
        const data = await res.json();
        if (!isMounted.current) return;
        if (data?.success) {
          setTrainings(Array.isArray(data.data) ? data.data : []);
          setPagination(data.pagination || null);
        } else {
          setTrainings([]);
          setError(data?.message || 'Failed to load trainings');
        }
      } catch {
        if (!isMounted.current) return;
        setTrainings([]);
        setError('Failed to load trainings. Please try again.');
      } finally {
        if (isMounted.current) setLoading(false);
      }
    };

    fetchData();
  }, [page, selectedCategory, debouncedQuery]);

  // Categories only need to be fetched once.
  useEffect(() => {
    let cancelled = false;
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BASE_URL}/api/trainings/public/categories`);
        const data = await res.json();
        if (cancelled) return;
        if (data?.success) {
          setCategories(Array.isArray(data.data) ? data.data : []);
        }
      } catch {
        // categories are optional; fail silently
      }
    };
    fetchCategories();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setDebouncedQuery(searchQuery.trim());
    setPage(1);
  };

  const handleCategory = (cat: string) => {
    setSelectedCategory(cat);
    setPage(1);
  };

  const handlePrev = () => {
    if (pagination && pagination.hasPrev) setPage(pagination.currentPage - 1);
  };

  const handleNext = () => {
    if (pagination && pagination.hasNext) setPage(pagination.currentPage + 1);
  };

  const totalCount = pagination?.totalItems ?? 0;

  return (
    <div className="bg-white dark:bg-gray-900">
      <Helmet>
        <title>Training Programs | SoSapient</title>
        <meta
          name="description"
          content="Explore professional training programs in web development, AI, design, and more. Build job-ready skills with expert-led courses."
        />
        <meta property="og:title" content="Training Programs | SoSapient" />
        <meta
          property="og:description"
          content="Explore professional training programs in web development, AI, design, and more. Build job-ready skills with expert-led courses."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://sosapient.in/training" />
        <meta property="og:site_name" content="SoSapient" />
        <meta property="og:image" content="https://sosapient.in/logo/Dlogo.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Training Programs | SoSapient" />
        <meta
          name="twitter:description"
          content="Explore professional training programs in web development, AI, design, and more. Build job-ready skills with expert-led courses."
        />
        <meta name="twitter:image" content="https://sosapient.in/logo/Dlogo.png" />
        <meta
          name="robots"
          content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
        />
        <link rel="canonical" href="https://sosapient.in/training" />
      </Helmet>

      <div className="bg-white dark:bg-gray-900">
        {/* Hero / page header */}
        <section className="py-20 scroll-mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-300 text-sm font-semibold mb-6">
                <Search className="w-4 h-4" /> Training Programs
              </div>
              <h1 className="text-3xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                Build Job-Ready Skills
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Expert-led training programs in web development, AI, design, and more.
                Learn practical skills that employers value.
              </p>
            </motion.div>

            {/* Search + filters */}
            <div className="mb-12">
              <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search training programs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-3 pl-10 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                  <button
                    type="submit"
                    className="absolute right-1 top-1/2 -translate-y-1/2 px-3 py-2 text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400"
                    aria-label="Search"
                  >
                    <Search className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </div>

            {/* Category chips */}
            {categories.length > 0 && (
              <div className="flex flex-wrap justify-center gap-2 mb-8">
                <button
                  onClick={() => handleCategory('all')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === 'all'
                      ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300'
                      : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  All Categories
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => handleCategory(cat)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      selectedCategory === cat
                        ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300'
                        : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}

            {/* Training grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {loading && (
                <div className="col-span-12">
                  <div className="flex flex-col items-center justify-center py-20 gap-4">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <div
                        key={i}
                        className="w-full h-80 bg-gray-200 dark:bg-gray-800 rounded-2xl animate-pulse"
                      />
                    ))}
                  </div>
                </div>
              )}
              {!loading && trainings.length === 0 && (
                <div className="col-span-12 text-center py-20">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 mx-auto mb-4">
                    <Filter className="h-6 w-6 text-gray-400" />
                  </div>
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                    No training programs found
                  </h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Try adjusting your search or category filters.
                  </p>
                </div>
              )}
              {!loading && error && (
                <div className="col-span-12 text-center py-20 text-red-600 dark:text-red-400">
                  {error}
                  <button
                    onClick={() => setPage(1)}
                    className="mt-4 inline-flex items-center gap-2 text-sm font-medium hover:underline"
                  >
                    <RefreshIcon /> Try again
                  </button>
                </div>
              )}
              {!loading && !error && trainings.map((training) => (
                <TrainingCard key={training._id} training={training} />
              ))}
            </div>

            {/* Pagination */}
            {pagination && totalCount > 0 && (
              <div className="mt-16 flex items-center justify-between gap-4">
                <button
                  onClick={handlePrev}
                  disabled={!pagination.hasPrev}
                  className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                >
                  <ChevronLeft className="w-4 h-4" /> Prev
                </button>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Page {pagination.currentPage} of {pagination.totalPages}
                </span>
                <button
                  onClick={handleNext}
                  disabled={!pagination.hasNext}
                  className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                >
                  Next <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

function RefreshIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-4 w-4 animate-spin"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

export default TrainingList;
