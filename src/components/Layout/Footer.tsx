import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  ArrowRight,
  ArrowUp,
  Send,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { fadeUp } from '../Home/shared';

const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setStatus({ type: null, message: '' });
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Subscription failed');
      }

      setStatus({ type: 'success', message: 'Successfully subscribed!' });
      setEmail('');
    } catch (error) {
      setStatus({ type: 'error', message: error instanceof Error ? error.message : 'Failed to subscribe' });
    } finally {
      setBusy(false);
    }
  };

  const footerLinks = {
    Company: [
      { name: 'About Us', path: '/about' },
      { name: 'Our Team', path: '/about#team' },
      { name: 'Careers', path: '/careers' },
      { name: 'Contact', path: '/contact' },
    ],
    Services: [
      { name: 'Frontend Development', path: '/services/frontend-development' },
      { name: 'AI Development', path: '/services/ai-development' },
      { name: 'AI Automations', path: '/services/ai-automations' },
      { name: 'RAG System Integration', path: '/services/rag-system-integration' },
      { name: 'Custom CRM Development', path: '/services/custom-crm-development' },
      { name: 'SaaS Product Development', path: '/services/saas-product-development' },
      { name: 'Digital Marketing', path: '/services/digital-marketing' },
      { name: 'Social Media Promotion', path: '/services/social-media-promotion' },
      { name: 'View All Services →', path: '/services' },
    ],
    Industries: [
      { name: 'Healthcare & Telehealth', path: '/industries/healthcare-telehealth' },
      { name: 'E-commerce & Retail', path: '/industries/ecommerce-retail' },
      { name: 'AI & Automation', path: '/industries/artificial-intelligence-automation' },
      { name: 'Cloud & DevOps', path: '/industries/cloud-devops' },
      { name: 'Cybersecurity', path: '/industries/cybersecurity' },
      { name: 'Education & EdTech', path: '/industries/education-edtech' },
      { name: 'Manufacturing & Logistics', path: '/industries/manufacturing-logistics' },
      { name: 'View All Industries →', path: '/industries' },
    ],
    Resources: [
      { name: 'Blog', path: '/blog' },
      { name: 'Case Studies', path: '/case-studies' },
      { name: 'Documentation', path: '#' },
      { name: 'Support', path: '/contact' },
    ],
  };

  const socialLinks = [
    { icon: Facebook, href: 'https://www.facebook.com/profile.php?id=61553017931533', label: 'Facebook' },
    { icon: Twitter, href: 'https://x.com/SoSapient_tech', label: 'Twitter' },
    { icon: Linkedin, href: 'https://www.linkedin.com/company/100043699/admin/page-posts/published/', label: 'LinkedIn' },
    { icon: Instagram, href: 'https://www.instagram.com/sosapient/', label: 'Instagram' },
  ];

  const contactRows = [
    { icon: Mail, label: 'info.sosapient@gmail.com', href: 'mailto:info.sosapient@gmail.com' },
    { icon: Phone, label: '+91 8815596247', href: 'tel:+918815596247' },
    { icon: MapPin, label: 'Anand Nagar, Vasant Vihar, Ujjain (M.P.) 456010 India' },
  ];

  return (
    <footer className="relative overflow-hidden bg-secondary-900 text-gray-300">
      {/* Ambient decor */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div
          className="absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage: 'radial-gradient(rgba(183,163,215,0.8) 1px, transparent 1px)',
            backgroundSize: '26px 26px',
          }}
        />
        <div className="absolute -top-32 left-1/4 h-72 w-72 rounded-full bg-primary-600/25 blur-3xl motion-reduce:animate-none animate-float-slow" />
        <div className="absolute -bottom-32 right-1/4 h-72 w-72 rounded-full bg-secondary-600/25 blur-3xl motion-reduce:animate-none animate-float-slower" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary-400/60 to-transparent" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Newsletter band */}
        <motion.div
          {...fadeUp}
          className="relative -mb-2 mt-12 overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur sm:p-8 lg:p-10"
        >
          <div
            className="pointer-events-none absolute inset-0 opacity-60"
            aria-hidden="true"
            style={{ backgroundImage: 'linear-gradient(120deg, rgba(109,77,148,0.35) 0%, rgba(57,38,155,0.35) 100%)' }}
          />
          <div className="relative grid items-center gap-6 lg:grid-cols-2">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-violet-200 ring-1 ring-white/15">
                <Send className="h-3.5 w-3.5" aria-hidden="true" /> Newsletter
              </p>
              <h3 className="mt-3 text-2xl font-bold text-white sm:text-3xl">Stay updated on tech that matters</h3>
              <p className="mt-2 text-sm text-gray-300">
                Practical notes on our services, AI and industry work — about once a month, never spam.
              </p>
            </div>
            <div>
              <form onSubmit={handleSubscribe} className="flex flex-col gap-3 sm:flex-row">
                <label htmlFor="footer-newsletter-email" className="sr-only">
                  Email address
                </label>
                <input
                  id="footer-newsletter-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="min-h-[48px] flex-1 rounded-xl border border-white/15 bg-gray-950/60 px-4 py-3 text-white placeholder:text-gray-500 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
                <motion.button
                  type="submit"
                  disabled={busy}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary-500 to-secondary-500 px-6 py-3 font-semibold text-white shadow-lg transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <span>{busy ? 'Subscribing…' : 'Subscribe'}</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </motion.button>
              </form>
              {status.type && (
                <p
                  role="status"
                  className={`mt-3 inline-flex items-center gap-1.5 text-sm font-medium ${
                    status.type === 'success' ? 'text-emerald-300' : 'text-red-300'
                  }`}
                >
                  {status.type === 'success' ? (
                    <CheckCircle className="h-4 w-4" aria-hidden="true" />
                  ) : (
                    <AlertCircle className="h-4 w-4" aria-hidden="true" />
                  )}
                  {status.message}
                </p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Main grid */}
        <div className="grid grid-cols-2 gap-8 py-12 md:grid-cols-3 lg:grid-cols-6">
          <motion.div {...fadeUp} className="col-span-2">
            <Link to="/" className="inline-flex items-center" aria-label="SoSapient home">
              <img
                src="https://ik.imagekit.io/sentyaztie/Dlogo.png?updatedAt=1749928182723"
                className="w-44 brightness-0 invert"
                alt="SoSapient logo"
                width={176}
                height={44}
              />
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-gray-400">
              We&apos;re a team of passionate developers and designers creating innovative
              digital solutions that help businesses thrive in the modern world.
            </p>
            <ul className="mt-6 space-y-3">
              {contactRows.map((row) => (
                <li key={row.label} className="flex items-start gap-3 text-sm">
                  <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10 text-violet-300 ring-1 ring-white/10">
                    <row.icon className="h-4 w-4" aria-hidden="true" />
                  </span>
                  {row.href ? (
                    <a href={row.href} className="pt-1 transition-colors hover:text-white">
                      {row.label}
                    </a>
                  ) : (
                    <span className="pt-1 text-gray-400">{row.label}</span>
                  )}
                </li>
              ))}
            </ul>
            <div className="mt-6 flex gap-2.5">
              {socialLinks.map((social, i) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.06 }}
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.92 }}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-gray-300 ring-1 ring-white/10 transition-colors hover:bg-gradient-to-br hover:from-primary-500 hover:to-secondary-500 hover:text-white hover:shadow-lg hover:shadow-primary-600/30"
                  aria-label={`SoSapient on ${social.label}`}
                >
                  <social.icon className="h-[18px] w-[18px]" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {Object.entries(footerLinks).map(([title, links], ci) => (
            <motion.nav
              key={title}
              aria-label={`Footer — ${title}`}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: ci * 0.07 }}
            >
              <h4 className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-white">
                <span className="h-px w-4 bg-gradient-to-r from-primary-400 to-secondary-400" aria-hidden="true" />
                {title}
              </h4>
              <ul className="mt-4 space-y-1">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.path}
                      className="group inline-flex items-center gap-0 py-1 text-sm text-gray-400 transition-all duration-200 hover:translate-x-0.5 hover:text-white"
                    >
                      <span className="h-px w-0 bg-primary-400 transition-all duration-200 group-hover:mr-1.5 group-hover:w-3" aria-hidden="true" />
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.nav>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 py-6 sm:flex-row">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} SoSapient. All rights reserved. Crafted in Ujjain, India.
          </p>
          <div className="flex items-center gap-4">
            <Link to="/contact" className="text-xs font-semibold text-gray-400 transition-colors hover:text-white">
              Contact
            </Link>
            <Link to="/careers" className="text-xs font-semibold text-gray-400 transition-colors hover:text-white">
              Careers
            </Link>
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="group inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-gray-300 ring-1 ring-white/10 transition hover:bg-gradient-to-br hover:from-primary-500 hover:to-secondary-500 hover:text-white"
              aria-label="Back to top"
            >
              <ArrowUp className="h-4 w-4 transition-transform group-hover:-translate-y-0.5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
