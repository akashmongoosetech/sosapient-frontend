import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { SectionHead } from '../Home/shared';

const FAQS = [
  {
    q: 'What does SoSapient specialize in?',
    a: 'Custom websites, MERN stack applications, AI automation (chatbots, RAG systems, workflow automation), CRM/ERP solutions and digital marketing — built for startups and enterprises alike.',
  },
  {
    q: 'Do you work with startups and enterprises?',
    a: 'Yes. Startups get senior-level execution without enterprise overhead; enterprises get disciplined delivery with documentation, security practices and handover they can audit.',
  },
  {
    q: 'What technologies do you use?',
    a: 'React, Next.js and TypeScript on the frontend; Node.js, Python, MongoDB and PostgreSQL on the backend; OpenAI and Gemini for AI; AWS and Docker for cloud. The stack is always chosen for the outcome, not fashion.',
  },
  {
    q: 'Do you provide AI integration?',
    a: 'Yes — grounded chatbots, RAG assistants over your documents, lead qualification agents and workflow automation, all measured on hours saved and response quality.',
  },
  {
    q: 'Can you build custom business software?',
    a: 'Absolutely. Operational dashboards, approval workflows, admin panels, inventory and billing systems — tailored to your processes with role-based access and audit trails.',
  },
  {
    q: 'Do you provide ongoing support?',
    a: 'Yes. Maintenance plans cover monitoring, security updates, backups, small feature work and performance reviews, so your product keeps improving after launch.',
  },
];

const AboutFaq: React.FC = () => {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="bg-gray-50 py-16 dark:bg-gray-800/50 sm:py-20">
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: FAQS.map((f) => ({
              '@type': 'Question',
              name: f.q,
              acceptedAnswer: { '@type': 'Answer', text: f.a },
            })),
          })}
        </script>
      </Helmet>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHead
          eyebrow="FAQ"
          title="Questions, answered"
          sub="The essentials about working with us."
        />
        <div className="mx-auto max-w-3xl space-y-3">
          {FAQS.map((f, i) => {
            const isOpen = open === i;
            return (
              <motion.div
                key={f.q}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className={`overflow-hidden rounded-xl border bg-white transition-colors dark:bg-gray-800 ${
                  isOpen ? 'border-primary-300 dark:border-primary-700' : 'border-gray-200 dark:border-gray-700'
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  aria-controls={`about-faq-${i}`}
                  className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
                >
                  <span className="flex items-center gap-2.5 font-semibold text-gray-900 dark:text-white">
                    <HelpCircle className="h-5 w-5 shrink-0 text-primary-600 dark:text-primary-400" aria-hidden="true" />
                    {f.q}
                  </span>
                  <ChevronDown className={`h-5 w-5 shrink-0 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
                </button>
                <div id={`about-faq-${i}`} className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96' : 'max-h-0'}`}>
                  <p className="px-5 pb-5 text-gray-600 dark:text-gray-300">{f.a}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default AboutFaq;
