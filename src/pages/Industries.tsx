import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { INDUSTRIES } from '../data/industries';
import { siteUrl } from '../utils/blog';
import { IndustryCard } from '../components/industries/IndustrySections';

const Industries: React.FC = () => {
  const canonical = `${siteUrl()}/industries`;
  const seoTitle = 'Industries We Serve: Healthcare, Retail, AI, Cloud & More | SoSapient';
  const seoDescription =
    'Technology solutions tailored to 17 industries — healthcare, e-commerce, manufacturing, education, AI, cloud, cybersecurity and more. Explore SoSapient industry expertise.';

  return (
    <>
      <Helmet>
        <title>{seoTitle}</title>
        <meta name="description" content={seoDescription} />
        <meta
          name="keywords"
          content={INDUSTRIES.map((i) => i.name).join(', ')}
        />
        <link rel="canonical" href={canonical} />
        <meta name="robots" content="index, follow" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={seoDescription} />
        <meta property="og:url" content={canonical} />
        <meta property="og:site_name" content="SoSapient" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seoTitle} />
        <meta name="twitter:description" content={seoDescription} />
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: seoTitle,
            description: seoDescription,
            url: canonical
          })}
        </script>
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: `${siteUrl()}/` },
              { '@type': 'ListItem', position: 2, name: 'Industries', item: canonical }
            ]
          })}
        </script>
      </Helmet>

      <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-16 dark:from-gray-800 dark:via-gray-900 dark:to-gray-900 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mx-auto max-w-3xl text-center"
          >
            <p className="text-sm font-semibold uppercase tracking-wider text-primary-600 dark:text-primary-400">
              Industries
            </p>
            <h1 className="mt-2 text-3xl font-bold text-gray-900 dark:text-white sm:text-5xl">
              Technology Solutions for Every Sector
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-gray-600 dark:text-gray-300">
              Explore how we help {INDUSTRIES.length} industries — from healthcare and retail to AI,
              cloud and manufacturing — build secure, scalable digital products.
            </p>
            <nav aria-label="Breadcrumb" className="mt-6 text-sm text-gray-500 dark:text-gray-400">
              <Link to="/" className="hover:underline">Home</Link>
              <span className="mx-2" aria-hidden="true">/</span>
              <span aria-current="page" className="text-gray-700 dark:text-gray-300">Industries</span>
            </nav>
          </motion.div>
        </div>
      </section>

      <section className="py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {INDUSTRIES.map((industry, i) => (
              <IndustryCard key={industry.slug} industry={industry} index={i} />
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 pb-16 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-7xl rounded-3xl bg-gradient-to-br from-primary-600 to-secondary-700 px-6 py-14 text-center sm:px-12"
        >
          <h2 className="text-2xl font-bold text-white sm:text-3xl">Don&apos;t See Your Industry?</h2>
          <p className="mx-auto mt-3 max-w-2xl text-blue-100">
            Our process adapts to any sector. Tell us about your business and we will design the right solution.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              to="/contact"
              className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-lg bg-white px-8 py-3 font-semibold text-primary-700 transition hover:bg-gray-50"
            >
              Start a Project <ArrowRight className="h-5 w-5" aria-hidden="true" />
            </Link>
            <Link
              to="/contact"
              className="inline-flex min-h-[48px] items-center justify-center rounded-lg border-2 border-white px-8 py-3 font-semibold text-white transition hover:bg-white/10"
            >
              Talk to an Expert
            </Link>
          </div>
        </motion.div>
      </section>
    </>
  );
};

export default Industries;
