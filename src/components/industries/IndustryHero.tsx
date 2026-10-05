import React from 'react';
import type { Industry } from '../../data/industries';
import { getIndustryHero } from '../../data/industryHeros';
import PremiumHero from '../heroes/PremiumHero';

function fallbackHeadline(industry: Industry): string {
  return industry.name;
}

// Thin wrapper: resolves the industry hero config and renders the shared
// PremiumHero core. Visual output is unchanged from the previous version.
const IndustryHero: React.FC<{ industry: Industry }> = ({ industry }) => {
  const hero = getIndustryHero(industry.slug) || {
    headline: fallbackHeadline(industry),
    description: industry.description,
    trust: [],
    visual: { variant: 'dashboard' as const, panelTitle: 'Overview', stats: [], floats: [] },
  };
  return (
    <PremiumHero
      badgeIcon={industry.icon}
      badgeLabel={`Industry Solutions · ${industry.name}`}
      gradient={industry.gradient}
      headline={hero.headline}
      description={hero.description}
      primaryCta={{ label: 'Start Your Project', to: '/contact' }}
      secondaryCta={{ label: 'Explore Solutions', href: '#solutions' }}
      trust={hero.trust}
      breadcrumbs={[
        { label: 'Home', to: '/' },
        { label: 'Industries', to: '/industries' },
        { label: industry.name },
      ]}
      hero={hero}
    />
  );
};

export default IndustryHero;
