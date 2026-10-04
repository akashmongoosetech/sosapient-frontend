import React from 'react';
import { Helmet } from 'react-helmet-async';
import Hero from '../components/Home/Hero';
import Services from '../components/Home/Services';
import About from '../components/Home/About';
import TechStack from '../components/Home/TechStack';
import Testimonials from '../components/Home/Testimonials';
import BlogPreview from '../components/Home/BlogPreview';
import CTA from '../components/Home/CTA';
// import FeaturesSection from '../components/Home/FeaturesSection';
import ProcessSection from '../components/Home/ProcessSection';
import FaqSection from '../components/Home/FaqSection';
// import GoogleReviews from '../components/Home/GoogleReviews';

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
        <meta property="og:image" content="https://sosapient.in/logo/Dlogo.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Full Stack Web Development & AI Solutions | SoSapient" />
        <meta name="twitter:description" content="MERN stack apps, AI chatbots & automation, CRM/ERP software, SEO and social media growth." />
        <meta name="twitter:image" content="https://sosapient.in/logo/Dlogo.png" />
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
              'https://www.linkedin.com/company/100043699/admin/page-posts/published/',
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
      <Services />
      <About />
      <TechStack />
      {/* <FeaturesSection/> */}
      <ProcessSection/>
      <FaqSection/>
      {/* <GoogleReviews/> */}
      <Testimonials />
      <BlogPreview />
      <CTA />
    </>
  );
};

export default Home;