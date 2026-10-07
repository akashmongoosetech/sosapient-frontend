import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { ChevronDown, HelpCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SectionHead } from './shared';

interface FaqItem {
  id: number;
  question: string;
  answer: string;
}

const FAQS: FaqItem[] = [
  {
    id: 1,
    question: 'What services do you offer?',
    answer:
      'We build web and mobile applications, UI/UX design, AI development and automation (chatbots, RAG systems, workflow automation), cloud & DevOps, security testing, custom CRM/ERP, SaaS products, plus digital marketing and social media growth. See the full list on our Services page.',
  },
  {
    id: 2,
    question: 'What industries do you specialize in?',
    answer:
      'We work across 17 industries including healthcare, e-commerce, manufacturing, education, real estate, travel, logistics, media and professional services — with dedicated solution pages for each on our Industries section.',
  },
  {
    id: 3,
    question: 'Can you explain your development process?',
    answer:
      'Every project follows the same transparent path: discovery workshop, planning, design, agile development sprints with demos, testing, zero-downtime deployment and ongoing maintenance. You always know what is happening and what comes next.',
  },
  {
    id: 4,
    question: 'What technologies do you work with?',
    answer:
      'Our core stack is React, Next.js and TypeScript on the frontend with Node.js, Python, MongoDB and PostgreSQL on the backend — plus OpenAI/Gemini for AI, Docker/AWS for cloud, and n8n for automation. We pick tools per project, never by fashion.',
  },
  {
    id: 5,
    question: 'How do you ensure the security of our data?',
    answer:
      'Encryption in transit and at rest, hardened authentication with MFA options, role-based access, audit logging and regular dependency updates. We also offer dedicated security audits before launch for sensitive applications.',
  },
  {
    id: 6,
    question: 'How do you handle project management?',
    answer:
      'You get a single point of contact, two-week sprints with demo sessions, a shared task board you can view anytime, and plain-language progress updates. Feedback from each demo goes straight into the next sprint.',
  },
  {
    id: 7,
    question: 'What is your pricing model?',
    answer:
      'Fixed-scope pricing for well-defined projects, sprint-based billing for evolving products, and monthly maintenance plans after launch. Every proposal itemizes exactly what is included — contact us with your requirements for a tailored quote.',
  },
  {
    id: 8,
    question: 'Do you provide ongoing support and maintenance?',
    answer:
      'Yes. Maintenance plans cover monitoring, security updates, backups, small feature work and performance reviews — so your product keeps improving instead of slowly decaying after launch.',
  },
  {
    id: 9,
    question: 'Can you provide references or case studies?',
    answer:
      'Yes — our Case Studies section documents real client projects with the challenge, solution, technologies and outcomes for each. Client reviews are also showcased right here on our homepage.',
  },
  {
    id: 10,
    question: 'What is your approach to handling changes in project scope?',
    answer:
      'Changes are estimated openly with their cost and timeline impact before any work starts. Small adjustments fit inside the current sprint; larger ones are scheduled as new milestones — you approve everything first.',
  },
  {
    id: 11,
    question: 'How can we contact your support team?',
    answer:
      'Email info.sosapient@gmail.com, call +91-9685533878 (Mon–Fri, 10AM–8PM IST), or send a message through our Contact page form. Maintenance-plan clients get priority response channels.',
  },
  {
    id: 12,
    question: 'What is your disaster recovery plan?',
    answer:
      'Automated database and file backups, infrastructure defined as code so environments can be rebuilt quickly, tested restore procedures, and monitoring with alerts — documented per project in the handover pack.',
  },
  {
    id: 13,
    question: 'Are you open to collaboration or partnerships?',
    answer:
      'Yes. We partner with agencies needing a reliable development and AI team, and with businesses wanting long-term product collaboration. Reach out through the Contact page with what you have in mind.',
  },
];

const FaqSection = () => {
  const [openId, setOpenId] = useState<number | null>(1);

  return (
    <section id="faq" className="bg-gray-50 py-16 dark:bg-gray-800/50 sm:py-20">
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: FAQS.map((f) => ({
              '@type': 'Question',
              name: f.question,
              acceptedAnswer: { '@type': 'Answer', text: f.answer },
            })),
          })}
        </script>
      </Helmet>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHead
          eyebrow="FAQ"
          title="Frequently asked questions"
          sub="Straight answers about working with us. Anything else — just ask."
        />
        <div className="mx-auto max-w-3xl space-y-3">
          {FAQS.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <motion.div
                key={faq.id}
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
                  aria-expanded={isOpen}
                  aria-controls={`home-faq-${faq.id}`}
                  onClick={() => setOpenId(isOpen ? null : faq.id)}
                  className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
                >
                  <span className="flex items-center gap-2.5 font-semibold text-gray-900 dark:text-white">
                    <HelpCircle className="h-5 w-5 shrink-0 text-primary-600 dark:text-primary-400" aria-hidden="true" />
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    aria-hidden="true"
                  />
                </button>
                <div
                  id={`home-faq-${faq.id}`}
                  className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96' : 'max-h-0'}`}
                >
                  <p className="px-5 pb-5 text-gray-600 dark:text-gray-300">{faq.answer}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
        <p className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          Still curious?{' '}
          <Link to="/contact" className="group inline-flex items-center gap-1 font-bold text-primary-600 dark:text-primary-400">
            Talk to us
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
          </Link>
        </p>
      </div>
    </section>
  );
};

export default FaqSection;
