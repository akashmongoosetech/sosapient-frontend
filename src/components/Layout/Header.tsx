import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Moon, Sun, ChevronDown, ArrowRight, ArrowUpRight, Info, Newspaper, Briefcase, Mail, Facebook, Linkedin, Instagram, Twitter, Sparkles } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { SERVICES, SERVICE_CATEGORIES, servicesByCategory } from '../../data/services';
import { INDUSTRIES } from '../../data/industries';
import { serviceIcon } from '../services/ServiceCard';

const LOGO_URL = 'https://ik.imagekit.io/sentyaztie/Dlogo.png?updatedAt=1749928182723';

const socialLinks = [
  { label: 'Facebook', href: 'https://www.facebook.com/profile.php?id=61553017931533', Icon: Facebook },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/company/100043699/admin/page-posts/published/', Icon: Linkedin },
  { label: 'Instagram', href: 'https://www.instagram.com/sosapient/', Icon: Instagram },
  { label: 'Twitter', href: 'https://x.com/SoSapient_tech', Icon: Twitter },
];

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [industriesOpen, setIndustriesOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [mobileAboutOpen, setMobileAboutOpen] = useState(false);
  const [mobileIndustriesOpen, setMobileIndustriesOpen] = useState(false);
  const closeTimer = useRef<number | null>(null);
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    return () => {
      if (closeTimer.current) window.clearTimeout(closeTimer.current);
    };
  }, []);

  useEffect(() => {
    if (!servicesOpen && !aboutOpen && !industriesOpen && !isMenuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setServicesOpen(false);
        setAboutOpen(false);
        setIndustriesOpen(false);
        setIsMenuOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [servicesOpen, aboutOpen, industriesOpen, isMenuOpen]);

  // Lock body scroll while the mobile overlay is open
  useEffect(() => {
    if (!isMenuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isMenuOpen]);

  // Close the menus on route change
  useEffect(() => {
    setServicesOpen(false);
    setAboutOpen(false);
    setIndustriesOpen(false);
    setMobileServicesOpen(false);
    setMobileAboutOpen(false);
    setMobileIndustriesOpen(false);
  }, [location.pathname]);

  const closeAllDropdowns = () => {
    setAboutOpen(false);
    setServicesOpen(false);
    setIndustriesOpen(false);
  };

  const openServices = () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    setAboutOpen(false);
    setIndustriesOpen(false);
    setServicesOpen(true);
  };

  const scheduleCloseServices = () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setServicesOpen(false), 150);
  };

  const openAbout = () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    setServicesOpen(false);
    setIndustriesOpen(false);
    setAboutOpen(true);
  };

  const scheduleCloseAbout = () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setAboutOpen(false), 150);
  };

  const openIndustries = () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    setServicesOpen(false);
    setAboutOpen(false);
    setIndustriesOpen(true);
  };

  const scheduleCloseIndustries = () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setIndustriesOpen(false), 150);
  };

  const aboutMenuItems = [
    { name: 'About Us', path: '/about', description: 'Our story, mission and team', Icon: Info, gradient: 'from-blue-500 to-cyan-500' },
    { name: 'Blog', path: '/blog', description: 'Insights, guides and updates', Icon: Newspaper, gradient: 'from-purple-500 to-pink-500' },
    { name: 'Careers', path: '/careers', description: 'Join our growing team', Icon: Briefcase, gradient: 'from-green-500 to-teal-500' },
    { name: 'Contact', path: '/contact', description: 'Get in touch with us', Icon: Mail, gradient: 'from-orange-500 to-red-500' },
  ];

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about', hasAboutMenu: true },
    { name: 'Services', path: '/services', hasMenu: true },
    { name: 'Industries', path: '/industries', hasIndustriesMenu: true },
    { name: 'Case Studies', path: '/case-studies' },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const triggerCls = (active: boolean) =>
    `flex items-center gap-1.5 rounded-full px-4 py-2 font-display text-[15px] font-semibold tracking-tight transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 ${
      active
        ? 'bg-primary-100/80 text-primary-700 dark:bg-white/10 dark:text-primary-300'
        : 'text-gray-800 hover:bg-gray-100 hover:text-primary-700 dark:text-gray-200 dark:hover:bg-white/10 dark:hover:text-primary-300'
    }`;

  const panelCls =
    'overflow-hidden rounded-2xl border border-gray-200/70 bg-white/95 shadow-2xl shadow-secondary-900/10 backdrop-blur-xl dark:border-white/10 dark:bg-gray-900/95 dark:shadow-black/40';

  const rowCls =
    'group flex items-center gap-3 rounded-xl p-2.5 transition-all duration-150 hover:translate-x-0.5 hover:bg-primary-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 dark:hover:bg-white/10';

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-4"
    >
      {/* Click-outside backdrop while a desktop dropdown is open */}
      <AnimatePresence>
        {(servicesOpen || aboutOpen || industriesOpen) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            aria-hidden="true"
            onClick={closeAllDropdowns}
            className="fixed inset-0 hidden bg-secondary-950/25 backdrop-blur-[2px] dark:bg-black/45 lg:block"
          />
        )}
      </AnimatePresence>

      {/* Floating pill bar */}
      <div
        className={`relative mx-auto max-w-7xl rounded-2xl border border-gray-200/70 bg-white/85 backdrop-blur-xl transition-all duration-300 dark:border-white/10 dark:bg-gray-900/85 ${
          isScrolled ? 'shadow-2xl shadow-secondary-900/10 dark:shadow-black/40' : 'shadow-xl shadow-secondary-900/5'
        }`}
      >
        <div className={`mx-auto flex items-center justify-between gap-2 px-3 transition-all duration-300 sm:px-4 ${
          isScrolled ? 'h-14 lg:h-16' : 'h-16 lg:h-[72px]'
        }`}>
          {/* Logo */}
          <Link to="/" className="flex shrink-0 items-center rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500" aria-label="SoSapient home">
            <img src={LOGO_URL} width={208} height={52} className="h-9 w-auto lg:h-10" alt="SoSapient logo" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
            {navItems.map((item) => (
              item.hasAboutMenu ? (
                <div
                  key={item.name}
                  className="relative"
                  onMouseEnter={openAbout}
                  onMouseLeave={scheduleCloseAbout}
                >
                  <Link
                    to={item.path}
                    aria-expanded={aboutOpen}
                    aria-haspopup="true"
                    onFocus={openAbout}
                    onClick={() => setAboutOpen(false)}
                    className={triggerCls(isActive(item.path))}
                  >
                    {item.name}
                    <ChevronDown className={`h-4 w-4 transition-transform ${aboutOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
                  </Link>
                  <AnimatePresence>
                    {aboutOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 12, scale: 0.98, x: '-50%' }}
                        animate={{ opacity: 1, y: 0, scale: 1, x: '-50%' }}
                        exit={{ opacity: 0, y: 8, scale: 0.98, x: '-50%' }}
                        transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                        className="absolute left-1/2 top-full z-50 w-[340px] pt-3"
                        onMouseEnter={openAbout}
                        onMouseLeave={scheduleCloseAbout}
                      >
                        <div className={panelCls}>
                          <div className="h-1 bg-gradient-to-r from-primary-500 via-secondary-500 to-primary-500" aria-hidden="true" />
                          <ul className="p-2.5">
                            {aboutMenuItems.map((sub, i) => (
                              <motion.li
                                key={sub.path + sub.name}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.04 * i, duration: 0.22 }}
                              >
                                <Link
                                  to={sub.path}
                                  onClick={() => setAboutOpen(false)}
                                  className={rowCls}
                                >
                                  <span className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${sub.gradient} text-white shadow-md transition-transform duration-200 group-hover:scale-105`}>
                                    <sub.Icon className="h-[18px] w-[18px]" aria-hidden="true" />
                                  </span>
                                  <span className="min-w-0 flex-1">
                                    <span className="block text-sm font-bold text-gray-900 group-hover:text-primary-700 dark:text-gray-100 dark:group-hover:text-primary-300">
                                      {sub.name}
                                    </span>
                                    <span className="block text-xs leading-snug text-gray-500 line-clamp-2 dark:text-gray-400">
                                      {sub.description}
                                    </span>
                                  </span>
                                  <ArrowUpRight className="h-4 w-4 shrink-0 -translate-x-1 text-primary-500 opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100" aria-hidden="true" />
                                </Link>
                              </motion.li>
                            ))}
                          </ul>
                          <div className="border-t border-gray-100 px-5 py-3 dark:border-white/10">
                            <Link
                              to="/about"
                              onClick={() => setAboutOpen(false)}
                              className="inline-flex items-center gap-1.5 text-xs font-bold text-primary-600 transition hover:gap-2.5 dark:text-primary-400"
                            >
                              More about us <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                            </Link>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : item.hasMenu ? (
                <div
                  key={item.name}
                  className="static"
                  onMouseEnter={openServices}
                  onMouseLeave={scheduleCloseServices}
                >
                  <Link
                    to={item.path}
                    aria-expanded={servicesOpen}
                    aria-haspopup="true"
                    onFocus={openServices}
                    onClick={() => setServicesOpen(false)}
                    className={triggerCls(isActive(item.path))}
                  >
                    {item.name}
                    <ChevronDown className={`h-4 w-4 transition-transform ${servicesOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
                  </Link>
                  <AnimatePresence>
                    {servicesOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ type: 'spring', stiffness: 320, damping: 30 }}
                        className="absolute inset-x-0 top-full z-50"
                        onMouseEnter={openServices}
                        onMouseLeave={scheduleCloseServices}
                      >
                        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                        <div className={`${panelCls} rounded-3xl`}>
                          <div className="h-1 bg-gradient-to-r from-primary-500 via-secondary-500 to-primary-500" aria-hidden="true" />
                          <div className="grid gap-0 lg:grid-cols-[300px_1fr]">
                            {/* Spotlight card */}
                            <div className="relative overflow-hidden bg-gradient-to-br from-secondary-700 to-primary-600 p-6 text-white lg:p-7">
                              <div
                                className="pointer-events-none absolute inset-0 opacity-20"
                                aria-hidden="true"
                                style={{
                                  backgroundImage: 'radial-gradient(rgba(255,255,255,0.9) 1px, transparent 1px)',
                                  backgroundSize: '20px 20px',
                                }}
                              />
                              <div className="relative">
                                <p className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-white ring-1 ring-white/25">
                                  <Sparkles className="h-3.5 w-3.5" aria-hidden="true" /> Services
                                </p>
                                <p className="mt-3 font-display text-2xl font-bold leading-tight">
                                  What can we build for you?
                                </p>
                                <p className="mt-2 text-sm leading-relaxed text-white/75">
                                  {SERVICES.length} specialized offerings across {SERVICE_CATEGORIES.length} categories — from AI to cloud to growth.
                                </p>
                                <div className="mt-5 flex flex-col gap-2">
                                  <Link
                                    to="/services"
                                    onClick={() => setServicesOpen(false)}
                                    className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-secondary-800 shadow-sm transition hover:bg-primary-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                                  >
                                    View All Services <ArrowRight className="h-4 w-4" aria-hidden="true" />
                                  </Link>
                                  <Link
                                    to="/contact"
                                    onClick={() => setServicesOpen(false)}
                                    className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-white/10 px-4 py-2.5 text-sm font-bold text-white ring-1 ring-white/25 transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                                  >
                                    Start a Project
                                  </Link>
                                </div>
                              </div>
                            </div>
                            {/* Category columns */}
                            <div className="max-h-[calc(100vh-220px)] overflow-y-auto p-5 sm:p-6">
                              <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2 xl:grid-cols-3">
                                {SERVICE_CATEGORIES.map((cat, ci) => (
                                  <motion.div
                                    key={cat.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.03 * ci, duration: 0.22 }}
                                  >
                                    <p className="flex items-center gap-2 font-display text-[11px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
                                      <span className="h-px w-4 bg-gradient-to-r from-primary-500 to-secondary-500" aria-hidden="true" />
                                      {cat.label}
                                    </p>
                                    <ul className="mt-2 space-y-0.5">
                                      {servicesByCategory(cat.id).map((s) => {
                                        const Icon = serviceIcon(s.icon);
                                        return (
                                          <li key={s.slug}>
                                            <Link
                                              to={`/services/${s.slug}`}
                                              onClick={() => setServicesOpen(false)}
                                              title={s.shortDescription}
                                              className="group flex items-center gap-2.5 rounded-lg px-2 py-1.5 transition-all duration-150 hover:translate-x-0.5 hover:bg-primary-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 dark:hover:bg-white/10"
                                            >
                                              <span className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${s.gradient} text-white shadow-sm transition-transform duration-150 group-hover:scale-105`}>
                                                <Icon className="h-4 w-4" aria-hidden="true" />
                                              </span>
                                              <span className="min-w-0 text-sm font-semibold leading-snug text-gray-800 line-clamp-2 group-hover:text-primary-700 dark:text-gray-200 dark:group-hover:text-primary-300">
                                                {s.shortName}
                                              </span>
                                            </Link>
                                          </li>
                                        );
                                      })}
                                    </ul>
                                  </motion.div>
                                ))}
                              </div>
                            </div>
                          </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : item.hasIndustriesMenu ? (
                <div
                  key={item.name}
                  className="static"
                  onMouseEnter={openIndustries}
                  onMouseLeave={scheduleCloseIndustries}
                >
                  <Link
                    to={item.path}
                    aria-expanded={industriesOpen}
                    aria-haspopup="true"
                    onFocus={openIndustries}
                    onClick={() => setIndustriesOpen(false)}
                    className={triggerCls(isActive(item.path))}
                  >
                    {item.name}
                    <ChevronDown className={`h-4 w-4 transition-transform ${industriesOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
                  </Link>
                  <AnimatePresence>
                    {industriesOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ type: 'spring', stiffness: 320, damping: 30 }}
                        className="absolute inset-x-0 top-full z-50"
                        onMouseEnter={openIndustries}
                        onMouseLeave={scheduleCloseIndustries}
                      >
                        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
                          <div className={`${panelCls} rounded-3xl`}>
                            <div className="h-1 bg-gradient-to-r from-primary-500 via-secondary-500 to-primary-500" aria-hidden="true" />
                            <div className="flex items-center justify-between px-6 py-4">
                              <p className="font-display text-base font-bold text-gray-900 dark:text-white">
                                Industries we serve
                                <span className="ml-2 font-inter font-normal text-sm text-gray-500 dark:text-gray-400">
                                  {INDUSTRIES.length} sectors, tailored solutions
                                </span>
                              </p>
                              <Link
                                to="/industries"
                                onClick={() => setIndustriesOpen(false)}
                                className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600 hover:gap-2.5 hover:text-primary-700 dark:text-primary-400"
                              >
                                View All <ArrowRight className="h-4 w-4" aria-hidden="true" />
                              </Link>
                            </div>
                            <div className="grid grid-cols-1 gap-1 px-4 pb-4 sm:grid-cols-2 lg:grid-cols-3">
                              {INDUSTRIES.map((ind, ii) => {
                                const Icon = serviceIcon(ind.icon);
                                return (
                                  <motion.div
                                    key={ind.slug}
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.02 * ii, duration: 0.2 }}
                                  >
                                    <Link
                                      to={`/industries/${ind.slug}`}
                                      onClick={() => setIndustriesOpen(false)}
                                      title={ind.shortDescription}
                                      className="group flex items-center gap-3 rounded-xl p-2.5 transition-all duration-150 hover:translate-x-0.5 hover:bg-primary-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 dark:hover:bg-white/10"
                                    >
                                      <span className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${ind.gradient} text-white shadow-md transition-transform duration-150 group-hover:scale-105`}>
                                        <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
                                      </span>
                                      <span className="min-w-0">
                                        <span className="block text-sm font-bold leading-snug text-gray-900 line-clamp-2 group-hover:text-primary-700 dark:text-gray-100 dark:group-hover:text-primary-300">
                                          {ind.name}
                                        </span>
                                        <span className="block text-xs leading-snug text-gray-500 line-clamp-2 dark:text-gray-400">
                                          {ind.shortDescription}
                                        </span>
                                      </span>
                                    </Link>
                                  </motion.div>
                                );
                              })}
                            </div>
                            <Link
                              to="/contact"
                              onClick={() => setIndustriesOpen(false)}
                              className="flex items-center justify-center gap-2 bg-gradient-to-r from-primary-600 to-secondary-600 px-6 py-3.5 text-sm font-semibold text-white transition hover:brightness-110"
                            >
                              Discuss Your Industry <ArrowRight className="h-4 w-4" aria-hidden="true" />
                            </Link>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  key={item.name}
                  to={item.path}
                  className={triggerCls(isActive(item.path))}
                >
                  {item.name}
                </Link>
              )
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Link
              to="/contact"
              className="hidden items-center gap-1.5 rounded-xl bg-gradient-to-r from-primary-600 to-secondary-600 px-5 py-2.5 font-display text-sm font-bold text-white shadow-lg shadow-primary-600/25 transition hover:shadow-xl hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 sm:inline-flex"
            >
              Get in Touch <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              aria-pressed={theme === 'dark'}
              className="rounded-full border border-gray-200 p-2.5 text-gray-700 transition hover:border-primary-300 hover:text-primary-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 dark:border-gray-700 dark:text-gray-300 dark:hover:border-primary-600"
            >
              {theme === 'light' ? (
                <Moon className="h-5 w-5" aria-hidden="true" />
              ) : (
                <Sun className="h-5 w-5" aria-hidden="true" />
              )}
            </button>
            <button
              onClick={() => setIsMenuOpen(true)}
              aria-label="Open menu"
              aria-expanded={isMenuOpen}
              className="rounded-xl bg-gray-900 p-2.5 text-white transition hover:bg-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 dark:bg-white dark:text-gray-900 lg:hidden"
            >
              <Menu className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      {/* Full-screen mobile overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[60] flex flex-col bg-white/95 backdrop-blur-2xl dark:bg-gray-950/95 lg:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
          >
            <div className="flex h-16 shrink-0 items-center justify-between px-4">
              <Link to="/" onClick={() => setIsMenuOpen(false)} aria-label="SoSapient home">
                <img src={LOGO_URL} width={176} height={44} className="h-8 w-auto" alt="SoSapient logo" />
              </Link>
              <button
                onClick={() => setIsMenuOpen(false)}
                aria-label="Close menu"
                className="rounded-xl bg-gray-900 p-2.5 text-white transition hover:bg-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 dark:bg-white dark:text-gray-900"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto px-4 pb-6" aria-label="Mobile">
              {navItems.map((item, ni) => {
                const hasMenu = Boolean(item.hasAboutMenu || item.hasMenu || item.hasIndustriesMenu);
                const open = item.hasAboutMenu ? mobileAboutOpen : item.hasMenu ? mobileServicesOpen : mobileIndustriesOpen;
                const toggle = item.hasAboutMenu
                  ? () => setMobileAboutOpen((o) => !o)
                  : item.hasMenu
                    ? () => setMobileServicesOpen((o) => !o)
                    : () => setMobileIndustriesOpen((o) => !o);
                return (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * ni, duration: 0.3 }}
                    className="border-b border-gray-100 dark:border-white/10"
                  >
                    <div className="flex items-center gap-2 py-1">
                      <Link
                        to={item.path}
                        onClick={() => setIsMenuOpen(false)}
                        aria-current={isActive(item.path) ? 'page' : undefined}
                        className={`flex-1 rounded-xl px-3 py-3 font-display text-2xl font-bold tracking-tight transition-colors ${
                          isActive(item.path)
                            ? 'text-primary-600 dark:text-primary-400'
                            : 'text-gray-900 hover:text-primary-600 dark:text-white dark:hover:text-primary-400'
                        }`}
                      >
                        {item.name}
                      </Link>
                      {hasMenu && (
                        <button
                          type="button"
                          onClick={toggle}
                          aria-expanded={open}
                          aria-label={`${open ? 'Collapse' : 'Expand'} ${item.name} submenu`}
                          className="rounded-xl bg-gray-100 p-3 text-gray-700 transition hover:bg-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 dark:bg-white/10 dark:text-gray-200"
                        >
                          <ChevronDown className={`h-5 w-5 transition-transform ${open ? 'rotate-180' : ''}`} aria-hidden="true" />
                        </button>
                      )}
                    </div>
                    {hasMenu && (
                      <AnimatePresence initial={false}>
                        {open && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.25 }}
                            className="overflow-hidden"
                          >
                            <div className="max-h-[46vh] space-y-1 overflow-y-auto pb-4 pl-1">
                              {item.hasAboutMenu && aboutMenuItems.map((sub) => (
                                <MobileSubLink key={sub.path} to={sub.path} close={() => setIsMenuOpen(false)} icon={<sub.Icon className="h-4 w-4" aria-hidden="true" />} gradient={sub.gradient} title={sub.name} sub={sub.description} />
                              ))}
                              {item.hasMenu && (
                                <>
                                  <MobileSubLink to="/services" close={() => setIsMenuOpen(false)} title="View All Services" badge={String(SERVICES.length)} strong />
                                  {SERVICE_CATEGORIES.map((cat) => (
                                    <div key={cat.id}>
                                      <p className="px-3 pb-0.5 pt-2 text-[11px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
                                        {cat.label}
                                      </p>
                                      {servicesByCategory(cat.id).map((s) => {
                                        const Icon = serviceIcon(s.icon);
                                        return (
                                          <MobileSubLink key={s.slug} to={`/services/${s.slug}`} close={() => setIsMenuOpen(false)} icon={<Icon className="h-4 w-4" aria-hidden="true" />} gradient={s.gradient} title={s.name} sub={s.shortDescription} />
                                        );
                                      })}
                                    </div>
                                  ))}
                                </>
                              )}
                              {item.hasIndustriesMenu && (
                                <>
                                  <MobileSubLink to="/industries" close={() => setIsMenuOpen(false)} title="View All Industries" badge={String(INDUSTRIES.length)} strong />
                                  {INDUSTRIES.map((ind) => {
                                    const Icon = serviceIcon(ind.icon);
                                    return (
                                      <MobileSubLink key={ind.slug} to={`/industries/${ind.slug}`} close={() => setIsMenuOpen(false)} icon={<Icon className="h-4 w-4" aria-hidden="true" />} gradient={ind.gradient} title={ind.name} sub={ind.shortDescription} />
                                    );
                                  })}
                                </>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    )}
                  </motion.div>
                );
              })}

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.3 }}
                className="pt-6"
              >
                <Link
                  to="/contact"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex min-h-[52px] items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-primary-600 to-secondary-600 px-4 py-3 font-display text-base font-bold text-white shadow-lg"
                >
                  Get in Touch <ArrowRight className="h-5 w-5" aria-hidden="true" />
                </Link>
                <div className="mt-5 flex items-center justify-center gap-3">
                  {socialLinks.map((s) => (
                    <a
                      key={s.label}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`SoSapient on ${s.label}`}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-gray-600 transition hover:bg-primary-600 hover:text-white dark:bg-white/10 dark:text-gray-300"
                    >
                      <s.Icon className="h-[18px] w-[18px]" />
                    </a>
                  ))}
                </div>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

const MobileSubLink: React.FC<{
  to: string;
  close: () => void;
  title: string;
  sub?: string;
  icon?: React.ReactNode;
  gradient?: string;
  badge?: string;
  strong?: boolean;
}> = ({ to, close, title, sub, icon, gradient, badge, strong }) => (
  <Link
    to={to}
    onClick={close}
    className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${
      strong
        ? 'bg-primary-50 font-bold text-primary-700 dark:bg-primary-800/30 dark:text-primary-300'
        : 'bg-gray-50 text-gray-700 hover:text-primary-600 dark:bg-white/5 dark:text-gray-300'
    }`}
  >
    {icon && gradient && (
      <span className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${gradient} text-white shadow-sm`}>
        {icon}
      </span>
    )}
    <span className="min-w-0 flex-1">
      <span className="block truncate font-semibold">{title}</span>
      {sub && (
        <span className="block truncate text-xs text-gray-500 dark:text-gray-400">{sub}</span>
      )}
    </span>
    {badge && (
      <span className="rounded-full bg-primary-600 px-2 py-0.5 text-[11px] font-bold text-white">{badge}</span>
    )}
  </Link>
);

export default Header;
