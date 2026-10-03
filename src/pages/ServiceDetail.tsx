import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { serviceBySlug } from '../data/services';
import { siteUrl } from '../utils/blog';
import {
  ServiceHero, ServiceOverview, ServiceWhyNeed, ServiceBenefits,
  ServiceDeliverables, ServiceTechnologies, ServiceProcess, ServiceWhyUs,
  ServiceUseCases, ServiceFaq, RelatedServices, ServiceFinalCta
} from '../components/services/ServiceSections';

const ServiceDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const service = slug ? serviceBySlug(slug) : undefined;

  if (!service) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center px-4 py-20 text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Service not found</h1>
        <p className="mt-3 text-gray-600 dark:text-gray-300">
          The service you are looking for does not exist or has been moved.
        </p>
        <Link
          to="/services"
          className="mt-6 inline-flex min-h-[44px] items-center rounded-lg bg-primary-600 px-6 py-2.5 font-semibold text-white hover:bg-primary-700"
        >
          View all services
        </Link>
      </div>
    );
  }

  const canonical = `${siteUrl()}/services/${service.slug}`;

  return (
    <>
      <Helmet>
        <title>{service.seoTitle}</title>
        <meta name="description" content={service.seoDescription} />
        <meta
          name="keywords"
          content={[...service.tags, ...service.technologies.map((t) => t.name)].join(', ')}
        />
        <link rel="canonical" href={canonical} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={service.seoTitle} />
        <meta property="og:description" content={service.seoDescription} />
        <meta property="og:url" content={canonical} />
        <meta property="og:site_name" content="SoSapient" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={service.seoTitle} />
        <meta name="twitter:description" content={service.seoDescription} />
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Service',
            name: service.name,
            description: service.seoDescription,
            url: canonical,
            provider: {
              '@type': 'Organization',
              name: 'SoSapient',
              url: siteUrl()
            },
            serviceType: service.name,
            areaServed: 'Worldwide'
          })}
        </script>
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: `${siteUrl()}/` },
              { '@type': 'ListItem', position: 2, name: 'Services', item: `${siteUrl()}/services` },
              { '@type': 'ListItem', position: 3, name: service.name, item: canonical }
            ]
          })}
        </script>
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: service.faqs.map((f) => ({
              '@type': 'Question',
              name: f.q,
              acceptedAnswer: { '@type': 'Answer', text: f.a }
            }))
          })}
        </script>
      </Helmet>

      <ServiceHero service={service} />
      <ServiceOverview service={service} />
      <ServiceWhyNeed service={service} />
      <ServiceBenefits service={service} />
      <ServiceDeliverables service={service} />
      <ServiceTechnologies service={service} />
      <ServiceProcess />
      <ServiceWhyUs />
      <ServiceUseCases service={service} />
      <ServiceFaq service={service} />
      <RelatedServices service={service} />
      <ServiceFinalCta service={service} />
    </>
  );
};

export default ServiceDetail;
