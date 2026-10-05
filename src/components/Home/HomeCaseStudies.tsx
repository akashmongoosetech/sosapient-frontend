import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import type { CaseStudy } from '../../types/caseStudy';
import CaseStudyCard from '../case-studies/CaseStudyCard';
import { SectionHead } from './shared';

const HomeCaseStudies: React.FC = () => {
  const [items, setItems] = useState<CaseStudy[]>([]);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BASE_URL}/api/case-studies/public?page=1&limit=3`);
        const data = await res.json();
        if (!cancelled && data.success && Array.isArray(data.data)) {
          setItems(data.data.slice(0, 3));
        } else if (!cancelled) {
          setFailed(true);
        }
      } catch {
        if (!cancelled) setFailed(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (failed || items.length === 0) return null;

  return (
    <section className="bg-white py-16 dark:bg-gray-900 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHead
          eyebrow="Proof"
          title="Recent client work"
          sub="Real projects, real outcomes — explore how we've helped businesses ship and scale."
        />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => (
            <CaseStudyCard key={item._id || item.slug} item={item} index={i} />
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link
            to="/case-studies"
            className="group inline-flex min-h-[48px] items-center gap-2 rounded-xl bg-primary-600 px-8 py-3 font-semibold text-white shadow-lg shadow-primary-600/25 transition hover:bg-primary-700"
          >
            View All Case Studies
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HomeCaseStudies;
