import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { industryBySlug } from '../data/industries';
import { siteUrl } from '../utils/blog';
import IndustryHero from '../components/industries/IndustryHero';
import {
  IndustryOverview, IndustryChallenges, IndustrySolutions,
  IndustryTechnologies, IndustryBenefits, ServiceProcess, ServiceWhyUs,
  IndustryUseCases, IndustryFaq, RelatedIndustries, IndustryFinalCta
} from '../components/industries/IndustrySections';

const IndustryDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const industry = slug ? industryBySlug(slug) : undefined;

  if (!industry) {
    return (
      <>
        <Helmet>
          <title>Industry not found | SoSapient</title>
          <meta name="robots" content="noindex, nofollow" />
        </Helmet>
        <div className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center px-4 py-20 text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Industry not found</h1>
        <p className="mt-3 text-gray-600 dark:text-gray-300">
          The industry you are looking for does not exist or has been moved.
        </p>
        <Link
          to="/industries"
          className="mt-6 inline-flex min-h-[44px] items-center rounded-lg bg-primary-600 px-6 py-2.5 font-semibold text-white hover:bg-primary-700"
        >
          View all industries
        </Link>
        </div>
      </>
    );
  }

  const canonical = `${siteUrl()}/industries/${industry.slug}`;

  return (
    <>
      <Helmet>
        <title>{industry.seoTitle}</title>
        <meta name="description" content={industry.seoDescription} />
        <meta
          name="keywords"
          content={[...industry.tags, ...industry.technologies.map((t) => t.name)].join(', ')}
        />
        <link rel="canonical" href={canonical} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={industry.seoTitle} />
        <meta property="og:description" content={industry.seoDescription} />
        <meta property="og:url" content={canonical} />
        <meta property="og:site_name" content="SoSapient" />
        <meta property="og:image" content="https://sosapient.in/logo/Dlogo.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={industry.seoTitle} />
        <meta name="twitter:description" content={industry.seoDescription} />
        <meta name="twitter:image" content="https://sosapient.in/logo/Dlogo.png" />
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Service',
            name: industry.name,
            description: industry.seoDescription,
            url: canonical,
            provider: {
              '@type': 'Organization',
              name: 'SoSapient',
              url: siteUrl()
            },
            serviceType: industry.name,
            areaServed: 'Worldwide'
          })}
        </script>
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: `${siteUrl()}/` },
              { '@type': 'ListItem', position: 2, name: 'Industries', item: `${siteUrl()}/industries` },
              { '@type': 'ListItem', position: 3, name: industry.name, item: canonical }
            ]
          })}
        </script>
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: industry.faqs.map((f) => ({
              '@type': 'Question',
              name: f.q,
              acceptedAnswer: { '@type': 'Answer', text: f.a }
            }))
          })}
        </script>
      </Helmet>

      <IndustryHero industry={industry} />
      <IndustryOverview industry={industry} />
      <IndustryChallenges industry={industry} />
      <IndustrySolutions industry={industry} />
      <IndustryTechnologies industry={industry} />
      <ServiceProcess />
      <ServiceWhyUs />
      <IndustryBenefits industry={industry} />
      <IndustryUseCases industry={industry} />
      <IndustryFaq industry={industry} />
      <RelatedIndustries industry={industry} />
      <IndustryFinalCta industry={industry} />
    </>
  );
};

export default IndustryDetail;
