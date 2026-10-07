import React from 'react';
import { Helmet } from 'react-helmet-async';
import Hero from '../components/Home/Hero';
import Services from '../components/Home/Services';
import TechStack from '../components/Home/TechStack';
import Testimonials from '../components/Home/Testimonials';
import BlogPreview from '../components/Home/BlogPreview';
import CTA from '../components/Home/CTA';
import ProcessSection from '../components/Home/ProcessSection';
import FaqSection from '../components/Home/FaqSection';
import ValueProp from '../components/Home/ValueProp';
import AiAutomation from '../components/Home/AiAutomation';
import IndustriesGrid from '../components/Home/IndustriesGrid';
import WhyUs from '../components/Home/WhyUs';
import TechEcosystem from '../components/Home/TechEcosystem';
import HomeCaseStudies from '../components/Home/HomeCaseStudies';
import Outcomes from '../components/Home/Outcomes';

const Home: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Full Stack Web Development & AI Solutions | SoSapient</title>
        <meta name="description" content="SoSapient builds MERN stack apps, AI chatbots & automation, CRM/ERP software, plus SEO and social media growth — from Ujjain, India to clients worldwide." />
        <link rel="canonical" href="https://sosapient.in/" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Full Stack Web Development & AI Solutions | SoSapient" />
        <meta property="og:description" content="MERN stack apps, AI chatbots & automation, CRM/ERP software, SEO and social media growth — from Ujjain, India to clients worldwide." />
        <meta property="og:url" content="https://sosapient.in/" />
        <meta property="og:site_name" content="SoSapient" />
        <meta property="og:image" content="https://sosapient.in/og/og-cover-1200x630.png" />
        <meta property="og:image:alt" content="SoSapient — Web Development & AI Solutions" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:type" content="image/png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Full Stack Web Development & AI Solutions | SoSapient" />
        <meta name="twitter:description" content="MERN stack apps, AI chatbots & automation, CRM/ERP software, SEO and social media growth." />
        <meta name="twitter:image" content="https://sosapient.in/og/og-cover-1200x630.png" />
        <meta name="twitter:image:alt" content="SoSapient — Web Development & AI Solutions" />
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'SoSapient',
            url: 'https://sosapient.in/',
            logo: 'https://sosapient.in/logo/Dlogo.png',
            address: {
              '@type': 'PostalAddress',
              addressLocality: 'Ujjain',
              addressRegion: 'Madhya Pradesh',
              addressCountry: 'IN'
            },
            areaServed: ['Ujjain, Madhya Pradesh, India', 'Worldwide'],
            sameAs: [
              'https://www.facebook.com/profile.php?id=61553017931533',
              'https://x.com/SoSapient_tech',
              'https://www.linkedin.com/company/100043699/',
              'https://www.instagram.com/sosapient/'
            ]
          })}
        </script>
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: 'SoSapient',
            url: 'https://sosapient.in/'
          })}
        </script>
      </Helmet>
      <Hero />
      <TechStack />
      <ValueProp />
      <Services />
      <AiAutomation />
      <IndustriesGrid />
      <WhyUs />
      <TechEcosystem />
      <HomeCaseStudies />
      <ProcessSection />
      <Outcomes />
      <Testimonials />
      <BlogPreview />
      <FaqSection />
      <CTA />
    </>
  );
};

export default Home;