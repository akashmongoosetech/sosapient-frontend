import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { SERVICES } from '../../data/services';
import ServiceCard from '../services/ServiceCard';

const Services: React.FC = () => {
  return (
    <section className="py-20 bg-white dark:bg-primary-900" aria-labelledby="home-services-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 id="home-services-heading" className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
            Our <span className="text-primary-600 dark:text-primary-400">Services</span>
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            From high-performance web and mobile applications to AI-powered
            automation and enterprise software, we build scalable digital
            solutions designed around your business needs.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES.map((service, index) => (
            <ServiceCard key={service.slug} service={service} index={index} compact />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-10"
        >
          <Link
            to="/services"
            className="inline-flex min-h-[48px] items-center gap-2 px-8 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition"
          >
            View All Services <ArrowRight className="w-5 h-5" aria-hidden="true" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default Services;
