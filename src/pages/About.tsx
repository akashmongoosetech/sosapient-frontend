import React from 'react';
import { Helmet } from 'react-helmet-async';
import PremiumHero from '../components/heroes/PremiumHero';
import AboutIntro from '../components/about/AboutIntro';
import MissionVision from '../components/about/MissionVision';
import ValuesBento from '../components/about/ValuesBento';
import CollaborationSplit from '../components/about/CollaborationSplit';
import JourneyTimeline from '../components/about/JourneyTimeline';
import Leadership from '../components/about/Leadership';
import WhatWeDo from '../components/about/WhatWeDo';
import TechMindset from '../components/about/TechMindset';
import HomeCaseStudies from '../components/Home/HomeCaseStudies';
import AboutFaq from '../components/about/AboutFaq';
import AboutCta from '../components/about/AboutCta';

const About: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>About SoSapient | Web Development & AI Company</title>
        <meta
          name="description"
          content="SoSapient is a software company in Ujjain, India building custom websites, MERN stack apps, AI automation and CRM/ERP solutions for clients worldwide."
        />
        <link rel="canonical" href="https://sosapient.in/about" />
        <meta property="og:locale" content="en_US" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="About SoSapient | Web Development & AI Company" />
        <meta
          property="og:description"
          content="Custom websites, MERN stack apps, AI automation and CRM/ERP solutions — from Ujjain, India to clients worldwide."
        />
        <meta property="og:url" content="https://sosapient.in/about" />
        <meta property="og:site_name" content="SoSapient" />
        <meta property="og:image" content="https://sosapient.in/logo/Dlogo.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="About SoSapient | Web Development & AI Company" />
        <meta name="twitter:description" content="Custom websites, MERN stack apps, AI automation and CRM/ERP solutions — from Ujjain, India to clients worldwide." />
        <meta name="twitter:image" content="https://sosapient.in/logo/Dlogo.png" />
        <meta
          name="robots"
          content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
        />
      </Helmet>

      <div className="bg-white dark:bg-gray-900">
        <PremiumHero
          badgeIcon="Users"
          badgeLabel="About SoSapient"
          gradient="from-primary-500 to-secondary-500"
          headline={
            <>
              About{' '}
              <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                Sosapient
              </span>
            </>
          }
          description="We're not just a software company — we're your partners in digital transformation, committed to turning your vision into reality through innovative technology solutions."
          primaryCta={{ label: "Let's Work Together", to: '/contact' }}
          secondaryCta={{ label: 'Our Journey', href: '#journey' }}
          trust={['50+ Projects Delivered', '20+ Happy Clients', '98% Client Satisfaction']}
          breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'About' }]}
          hero={{
            headline: 'About Sosapient',
            description: '',
            trust: [],
            visual: {
              variant: 'network',
              panelTitle: 'What Drives Us · Live',
              stats: [
                { label: 'Technology', value: 'Core', sub: 'modern stacks, done right' },
                { label: 'People', value: 'First', sub: 'partners, not vendors' },
                { label: 'Innovation', value: 'Daily', sub: 'AI-first mindset' },
                { label: 'Growth', value: 'Yours', sub: 'outcomes over output' },
              ],
              floats: [
                { title: 'Mission-Driven Team', subtitle: 'Ujjain · working worldwide', icon: 'Users' },
                { title: 'AI-First Mindset', subtitle: 'in every engagement', icon: 'Brain' },
              ],
            },
          }}
        />

        <AboutIntro />
        <MissionVision />
        <ValuesBento />
        <CollaborationSplit />
        <JourneyTimeline />
        <Leadership />
        <WhatWeDo />
        <TechMindset />
        <HomeCaseStudies />
        <AboutFaq />
        <AboutCta />
      </div>
    </>
  );
};

export default About;
