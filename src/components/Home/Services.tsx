import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { SERVICE_CATEGORIES, servicesByCategory } from '../../data/services';
import ServiceCard from '../services/ServiceCard';
import { SectionHead } from './shared';

const Services: React.FC = () => {
  const [active, setActive] = useState(SERVICE_CATEGORIES[0].id);
  const items = servicesByCategory(active);

  return (
    <section className="bg-white py-16 dark:bg-gray-900 sm:py-20" aria-labelledby="home-services-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHead
          eyebrow="Capabilities"
          title={<span id="home-services-heading">Everything you need to ship software</span>}
          sub="Pick a capability to see what we deliver — every card opens the full service page."
        />

        <div className="mb-8 flex flex-wrap justify-center gap-2" role="tablist" aria-label="Service categories">
          {SERVICE_CATEGORIES.map((cat) => {
            const selected = cat.id === active;
            return (
              <button
                key={cat.id}
                role="tab"
                aria-selected={selected}
                onClick={() => setActive(cat.id)}
                className={`min-h-[40px] rounded-full px-4 py-2 text-sm font-semibold transition ${
                  selected
                    ? 'bg-primary-600 text-white shadow-md shadow-primary-600/25'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
            role="tabpanel"
          >
            {items.map((service, index) => (
              <ServiceCard key={service.slug} service={service} index={index} compact />
            ))}
          </motion.div>
        </AnimatePresence>

        <div className="mt-10 text-center">
          <Link
            to="/services"
            className="inline-flex min-h-[48px] items-center gap-2 rounded-xl bg-primary-600 px-8 py-3 font-semibold text-white shadow-lg shadow-primary-600/25 transition hover:bg-primary-700"
          >
            View All Services <ArrowRight className="h-5 w-5" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Services;
