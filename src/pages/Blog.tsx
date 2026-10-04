import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import BlogHero from '../components/Blog/BlogHero';
import BlogSearch from '../components/Blog/BlogSearch';
import BlogGrid from '../components/Blog/BlogGrid';
import BlogNewsletter from '../components/Blog/BlogNewsletter';
import { siteUrl } from '../utils/blog';

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  author: string;
  authorImage: string;
  date: string;
  readTime: string;
  category: string;
  tags: string[];
}

const Blog: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<string[]>(['All']);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [featured, setFeatured] = useState<BlogPost | null>(null);

  useEffect(() => {
    fetchCategories();
    fetchFeatured();
  }, []);

  // Fetch blogs whenever page, search, or category changes (debounced to avoid double-fetch on filter reset)
  useEffect(() => {
    const t = setTimeout(() => {
      fetchBlogs();
    }, 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, searchTerm, selectedCategory]);

  const handleSearchChange = (value: string) => {
    setCurrentPage(1);
    setSearchTerm(value);
  };

  const handleCategoryChange = (value: string) => {
    setCurrentPage(1);
    setSelectedCategory(value);
  };

  const fetchFeatured = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/blogs?featured=true&limit=1&status=published`);
      const data = await response.json();
      if (data.success && Array.isArray(data.data) && data.data.length > 0) {
        const post = data.data[0];
        const normalizeUrl = (url: string) => url?.startsWith('/uploads') ? `${import.meta.env.VITE_BASE_URL}${url}` : url;
        setFeatured({
          id: post._id,
          slug: post.slug,
          title: post.title,
          excerpt: post.excerpt,
          image: normalizeUrl(post.image),
          author: post.author.name,
          authorImage: normalizeUrl(post.author.image),
          date: post.publishedAt || post.createdAt,
          readTime: post.readTime || '5 min read',
          category: post.category,
          tags: post.tags
        });
      }
    } catch {
      // featured hero is optional
    }
  };

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      let url = `${import.meta.env.VITE_BASE_URL}/api/blogs?page=${currentPage}&limit=6&status=published`;
      if (selectedCategory && selectedCategory !== 'All') {
        url += `&category=${encodeURIComponent(selectedCategory)}`;
      }
      if (searchTerm) {
        url += `&search=${encodeURIComponent(searchTerm)}`;
      }
      const response = await fetch(url);
      const data = await response.json();
      if (data.success) {
        const normalizeUrl = (url: string) => url?.startsWith('/uploads') ? `${import.meta.env.VITE_BASE_URL}${url}` : url;
        const transformedPosts = data.data.map((post: any) => ({
          id: post._id,
          slug: post.slug,
          title: post.title,
          excerpt: post.excerpt,
          image: normalizeUrl(post.image),
          author: post.author.name,
          authorImage: normalizeUrl(post.author.image),
          date: post.publishedAt || post.createdAt,
          readTime: post.readTime || '5 min read',
          category: post.category,
          tags: post.tags
        }));
        setBlogPosts(transformedPosts);
        setTotalPages(data.pagination?.totalPages || 1);
      } else {
        setError(data.error || 'Failed to fetch blogs.');
        setBlogPosts([]);
      }
    } catch {
      setError('Error fetching blogs. Please try again later.');
      setBlogPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const defaultCategories = ['All', 'Technology', 'Design', 'Mobile Development', 'Web Development', 'AI/ML', 'Cybersecurity', 'Business', 'Tutorial'];

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/blogs/categories`);
      const data = await response.json();
      if (!data?.success || !Array.isArray(data.data) || data.data.length === 0) {
        setCategories(defaultCategories);
      } else {
        setCategories(['All', ...data.data]);
      }
    } catch {
      setCategories(defaultCategories);
    }
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-900 min-h-screen">
        <BlogHero />
        <div className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
              <p className="text-gray-600 dark:text-gray-400 mt-4">Loading blog posts...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-900 min-h-screen">
        <BlogHero />
        <div className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="text-red-600 dark:text-red-400 text-lg font-semibold">{error}</div>
              <p className="text-gray-600 dark:text-gray-400 mt-4">Please try again later.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const canonical = `${siteUrl()}/blog`;

  return (
    <div className="bg-white dark:bg-gray-900">
      <Helmet>
        <title>Blog | SoSapient — Insights, guides and updates</title>
        <meta name="description" content="Insights, guides and updates on web development, AI/ML, cybersecurity and business from the SoSapient team." />
        <link rel="canonical" href={canonical} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Blog | SoSapient" />
        <meta property="og:description" content="Insights, guides and updates on web development, AI/ML, cybersecurity and business from the SoSapient team." />
        <meta property="og:url" content={canonical} />
        <meta property="og:site_name" content="SoSapient" />
        <meta property="og:image" content="https://sosapient.in/logo/Dlogo.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Blog | SoSapient" />
        <meta name="twitter:description" content="Insights, guides and updates on web development, AI/ML, cybersecurity and business from the SoSapient team." />
        <meta name="twitter:image" content="https://sosapient.in/logo/Dlogo.png" />
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: 'Blog | SoSapient',
            description: 'Insights, guides and updates on web development, AI/ML, cybersecurity and business.',
            url: canonical
          })}
        </script>
      </Helmet>
      <BlogHero />
      {featured && !searchTerm && selectedCategory === 'All' && currentPage === 1 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-4 mb-4" aria-label="Featured article">
          <Link to={`/blog/${featured.slug}`} className="group grid overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700 md:grid-cols-2">
            <img src={featured.image} alt={featured.title} className="h-64 w-full object-cover md:h-full" loading="lazy" />
            <div className="flex flex-col justify-center p-6 sm:p-8">
              <span className="text-xs font-semibold uppercase tracking-wider text-primary-600">Featured · {featured.category}</span>
              <h2 className="mt-2 text-2xl font-bold text-gray-900 group-hover:underline dark:text-white">{featured.title}</h2>
              <p className="mt-2 line-clamp-3 text-gray-600 dark:text-gray-400">{featured.excerpt}</p>
              <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary-600">
                Read article <span aria-hidden="true">→</span>
              </span>
            </div>
          </Link>
        </section>
      )}
      <BlogSearch
        searchTerm={searchTerm}
        setSearchTerm={handleSearchChange}
        selectedCategory={selectedCategory}
        setSelectedCategory={handleCategoryChange}
        categories={categories}
      />
      <BlogGrid posts={blogPosts} />
      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center my-8 space-x-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 disabled:opacity-50"
          >
            Prev
          </button>
          {[...Array(totalPages)].map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentPage(idx + 1)}
              className={`px-4 py-2 rounded ${currentPage === idx + 1 ? 'bg-primary-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200'}`}
            >
              {idx + 1}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
      <BlogNewsletter />
    </div>
  );
};

export default Blog;