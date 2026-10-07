import React from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import HeroSection from "./Service/HeroSection";
import ServiceSection from "./Service/ServiceSection";
import StrategicExecution from "./Service/StrategicExecution";
import { Helmet } from "react-helmet-async";
import { SERVICES, SERVICE_CATEGORIES, servicesByCategory } from "../data/services";
import ServiceCard from "../components/services/ServiceCard";
import PremiumHero from "../components/heroes/PremiumHero";

const Services: React.FC = () => {
  const navigate = useNavigate();

  const processSteps = [
    {
      step: "01",
      title: "Discovery & Planning",
      description:
        "We start by understanding your business goals, target audience, and project requirements.",
    },
    {
      step: "02",
      title: "Design & Prototyping",
      description:
        "Our design team creates wireframes and prototypes to visualize the final product.",
    },
    {
      step: "03",
      title: "Development & Testing",
      description:
        "We build your solution using best practices and conduct thorough testing.",
    },
    {
      step: "04",
      title: "Launch & Support",
      description:
        "We deploy your project and provide ongoing support and maintenance.",
    },
  ];

  return (
    <>
      <Helmet>
        <title>Services | AI, Cloud & Software | SoSapient</title>
        <meta name="description" content="End-to-end development, AI automation, cloud and business software: frontend, backend, mobile, UI/UX, security, chatbots, RAG, CRM, ERP and SaaS." />

        <meta
          name="keywords"
          content="Frontend Development, Backend Development, Mobile Development, UI/UX Design, Cloud DevOps, AI Development, AI Automations, Chatbot Development, RAG Integration, Custom CRM, ERP Development, SaaS Development"
        />

        <meta name="robots" content="index, follow" />
        <meta property="og:locale" content="en_US" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Services | AI, Cloud & Software | SoSapient" />
        <meta
          property="og:description"
          content="Digital solutions built for growth: development, AI, automation, cloud, security and business software."
        />
        <meta property="og:image" content="https://sosapient.in/logo/Dlogo.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Services | AI, Cloud & Software | SoSapient" />
        <meta
          name="twitter:description"
          content="Digital solutions built for growth: development, AI, automation, cloud, security and business software."
        />
        <meta name="twitter:image" content="https://sosapient.in/logo/Dlogo.png" />
        <meta property="og:url" content="https://sosapient.in/services" />
        <meta property="og:site_name" content="SoSapient" />
        <link rel="canonical" href="https://sosapient.in/services" />
      </Helmet>
      <div className="bg-white dark:bg-gray-900">
        <PremiumHero
          badgeIcon="Rocket"
          badgeLabel="Digital Solutions"
          gradient="from-primary-500 to-secondary-500"
          headline={
            <>
              Digital Solutions{" "}
              <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                Built for Growth
              </span>
            </>
          }
          description={`End-to-end development, AI, automation, cloud, security and business software — ${SERVICES.length} specialized services designed around your business needs.`}
          primaryCta={{ label: "Start a Project", to: "/contact" }}
          secondaryCta={{ label: "Explore Services", href: "#services-categories" }}
          trust={["50+ Projects Delivered", "98% Client Satisfaction", "25+ Expert Developers"]}
          breadcrumbs={[{ label: "Home", to: "/" }, { label: "Services" }]}
          hero={{
            headline: "Digital Solutions Built for Growth",
            description: "",
            trust: [],
            visual: {
              variant: "network",
              panelTitle: "Service Ecosystem · Live",
              stats: SERVICE_CATEGORIES.map((cat) => ({
                label: cat.label,
                value: String(servicesByCategory(cat.id).length),
                sub: "services",
              })),
              floats: [
                { title: `${SERVICES.length} Services Live`, subtitle: "across 6 categories", icon: "Rocket" },
                { title: "AI + Cloud + Web", subtitle: "one team, end to end", icon: "Brain" },
              ],
            },
          }}
        />

        <HeroSection />

        {/* Services by Category */}
        <section id="services-categories" className="py-20 scroll-mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {SERVICE_CATEGORIES.map((category) => {
              const items = servicesByCategory(category.id);
              if (items.length === 0) return null;
              return (
                <div key={category.id} className="mb-14 last:mb-0">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                    className="mb-8"
                  >
                    <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
                      {category.label}
                    </h2>
                    <p className="mt-2 text-gray-600 dark:text-gray-300">
                      {category.description}
                    </p>
                  </motion.div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {items.map((service, index) => (
                      <ServiceCard key={service.slug} service={service} index={index} />
                    ))}
                  </div>
                </div>
              );
            })}
            <p className="mt-10 text-center text-gray-600 dark:text-gray-400">
              Not sure which service fits?{' '}
              <Link to="/contact" className="font-semibold text-primary-600 hover:underline dark:text-primary-400">
                Talk to us
              </Link>{' '}
              — we will point you to the right one.
            </p>
          </div>
        </section>

        {/* Process Section */}
        <section className="py-20 bg-gray-50 dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                Our Process
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                We follow a proven methodology to ensure your project is
                delivered on time, within budget, and exceeds your expectations.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {processSteps.map((step, index) => (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="relative mb-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto">
                      {step.step}
                    </div>
                    {index < processSteps.length - 1 && (
                      <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-primary-200 to-secondary-200 transform -translate-x-8"></div>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {step.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-br from-primary-600 to-secondary-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl lg:text-5xl font-bold text-white mb-6">
                Ready to Start Your Project?
              </h2>
              <p className="text-lg text-blue-100 max-w-3xl mx-auto mb-8">
                Let&apos;s discuss your requirements and create a solution that
                drives your business forward.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/contact')}
                  className="px-8 py-4 bg-white text-primary-600 rounded-lg font-semibold hover:bg-gray-50 transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  <span>Get Free Consultation</span>
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/portfolio')}
                  className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-all duration-200"
                >
                  View Portfolio
                </motion.button>
              </div>
            </motion.div>
          </div>
        </section>

        <ServiceSection />
        <StrategicExecution />
      </div>
    </>
  );
};

export default Services;
