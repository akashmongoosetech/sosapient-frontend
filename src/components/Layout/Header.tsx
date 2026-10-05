import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Moon, Sun, ChevronDown, ArrowRight, ArrowUpRight, Info, Newspaper, Briefcase, Mail, Facebook, Linkedin, Instagram, Twitter, Sparkles } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { SERVICES, SERVICE_CATEGORIES, servicesByCategory } from '../../data/services';
import { INDUSTRIES } from '../../data/industries';
import { serviceIcon } from '../services/ServiceCard';

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
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
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
    if (!servicesOpen && !aboutOpen && !industriesOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setServicesOpen(false);
        setAboutOpen(false);
        setIndustriesOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [servicesOpen, aboutOpen, industriesOpen]);

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

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 dark:bg-primary-900/95 backdrop-blur-md shadow-lg'
          : 'bg-transparent'
      }`}
    >
      {/* Click-outside backdrop while a dropdown is open */}
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
      {/* Utility strip — desktop only, hides on scroll */}
      <div className={`hidden overflow-hidden bg-gradient-to-r from-primary-700 via-primary-600 to-secondary-600 transition-all duration-300 lg:block ${
        isScrolled ? 'max-h-0' : 'max-h-10'
      }`}>
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-1.5 text-xs font-medium text-white/90 sm:px-6 lg:px-8">
          <p className="font-display tracking-wide">AI-powered software, delivered end-to-end</p>
          <div className="flex items-center gap-5">
            <Link to="/careers" className="transition hover:text-white">Careers</Link>
            <Link to="/blog" className="transition hover:text-white">Blog</Link>
            <Link to="/contact" className="transition hover:text-white">Contact</Link>
            <span className="h-3.5 w-px bg-white/30" aria-hidden="true" />
            <div className="flex items-center gap-3">
              <a href="https://www.facebook.com/profile.php?id=61553017931533" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="transition hover:text-white">
                <Facebook className="h-3.5 w-3.5" />
              </a>
              <a href="https://www.linkedin.com/company/100043699/admin/page-posts/published/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="transition hover:text-white">
                <Linkedin className="h-3.5 w-3.5" />
              </a>
              <a href="https://www.instagram.com/sosapient/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="transition hover:text-white">
                <Instagram className="h-3.5 w-3.5" />
              </a>
              <a href="https://x.com/SoSapient_tech" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="transition hover:text-white">
                <Twitter className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-[72px] lg:h-24">
          {/* Logo */}
          <Link to="/" className="flex shrink-0 items-center space-x-2" aria-label="SoSapient home">
            <img src="https://ik.imagekit.io/sentyaztie/Dlogo.png?updatedAt=1749928182723" className='w-52 lg:w-64' alt="SoSapient logo" />
          </Link>

          {/* Desktop Navigation */}
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8" aria-label="Primary">
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
                    className={`flex items-center gap-1.5 font-display text-[15px] font-semibold tracking-tight transition-colors duration-200 relative ${
                      isActive(item.path)
                        ? 'text-primary-600 dark:text-primary-400'
                        : 'text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400'
                    }`}
                  >
                    {item.name}
                    <ChevronDown className={`h-4 w-4 transition-transform ${aboutOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
                    {isActive(item.path) && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute -bottom-1 left-0 right-0 h-1 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500"
                      />
                    )}
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
                        <div className="overflow-hidden rounded-2xl border border-white/50 bg-white/90 shadow-2xl shadow-secondary-900/15 backdrop-blur-xl dark:border-white/10 dark:bg-gray-900/90 dark:shadow-black/50">
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
                                  className="group flex items-center gap-3 rounded-xl p-2.5 transition-all duration-200 hover:translate-x-0.5 hover:bg-primary-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 dark:hover:bg-white/10"
                                >
                                  <span className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${sub.gradient} text-white shadow-md transition-transform duration-200 group-hover:scale-105`}>
                                    <sub.Icon className="h-[18px] w-[18px]" aria-hidden="true" />
                                  </span>
                                  <span className="min-w-0 flex-1">
                                    <span className="block text-sm font-bold text-gray-900 group-hover:text-primary-700 dark:text-gray-100 dark:group-hover:text-primary-300">
                                      {sub.name}
                                    </span>
                                    <span className="block truncate text-xs text-gray-500 dark:text-gray-400">
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
                    className={`flex items-center gap-1.5 font-display text-[15px] font-semibold tracking-tight transition-colors duration-200 relative ${
                      isActive(item.path)
                        ? 'text-primary-600 dark:text-primary-400'
                        : 'text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400'
                    }`}
                  >
                    {item.name}
                    <ChevronDown className={`h-4 w-4 transition-transform ${servicesOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
                    {isActive(item.path) && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute -bottom-1 left-0 right-0 h-1 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500"
                      />
                    )}
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
                        <div className="overflow-hidden rounded-3xl border border-white/50 bg-white/90 shadow-2xl shadow-secondary-900/15 backdrop-blur-xl dark:border-white/10 dark:bg-gray-900/90 dark:shadow-black/50">
                          <div className="h-1 bg-gradient-to-r from-primary-500 via-secondary-500 to-primary-500" aria-hidden="true" />
                          <div className="grid gap-0 lg:grid-cols-[300px_1fr]">
                            {/* Spotlight card */}
                            <div
                              className="relative overflow-hidden p-6 text-white lg:p-7"
                              style={{ backgroundImage: 'linear-gradient(150deg, #2e1f7c 0%, #6d4d94 100%)' }}
                            >
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
                                              <span className="min-w-0 truncate text-sm font-semibold text-gray-800 group-hover:text-primary-700 dark:text-gray-200 dark:group-hover:text-primary-300">
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
                    className={`flex items-center gap-1.5 font-display text-[15px] font-semibold tracking-tight transition-colors duration-200 relative ${
                      isActive(item.path)
                        ? 'text-primary-600 dark:text-primary-400'
                        : 'text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400'
                    }`}
                  >
                    {item.name}
                    <ChevronDown className={`h-4 w-4 transition-transform ${industriesOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
                    {isActive(item.path) && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute -bottom-1 left-0 right-0 h-1 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500"
                      />
                    )}
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
                          <div className="overflow-hidden rounded-3xl border border-white/50 bg-white/90 shadow-2xl shadow-secondary-900/15 backdrop-blur-xl dark:border-white/10 dark:bg-gray-900/90 dark:shadow-black/50">
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
                                        <span className="block truncate text-sm font-bold text-gray-900 group-hover:text-primary-700 dark:text-gray-100 dark:group-hover:text-primary-300">
                                          {ind.name}
                                        </span>
                                        <span className="block truncate text-xs text-gray-500 dark:text-gray-400">
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
                  className={`font-display text-[15px] font-semibold tracking-tight transition-colors duration-200 relative ${
                    isActive(item.path)
                      ? 'text-primary-600 dark:text-primary-400'
                      : 'text-gray-800 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400'
                  }`}
                >
                  {item.name}
                  {isActive(item.path) && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute -bottom-1 left-0 right-0 h-1 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500"
                    />
                  )}
                </Link>
              )
            ))}
          </nav>

          {/* Theme Toggle & Auth & Mobile Menu */}
          <div className="flex items-center gap-2 sm:gap-3">
            {!isAuthenticated && (
              <div className="hidden items-center gap-4 lg:flex">
                <Link to="/login" className="font-display text-[15px] font-semibold text-gray-800 hover:text-primary-600 dark:text-gray-200">Login</Link>
                <Link to="/signup" className="rounded-lg bg-gray-900 px-4 py-2 text-[15px] font-semibold text-white transition hover:bg-gray-700 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200">Sign up</Link>
              </div>
            )}
            <Link
              to="/contact"
              className="hidden sm:inline-flex min-h-[48px] items-center gap-2 rounded-xl bg-gradient-to-r from-primary-600 to-secondary-600 px-6 sm:px-7 py-2.5 font-display text-[15px] font-bold text-white shadow-lg shadow-primary-600/25 transition hover:shadow-xl hover:brightness-110"
            >
              Get in Touch <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="rounded-full border border-gray-200 p-2.5 text-gray-700 transition hover:border-primary-300 hover:text-primary-600 dark:border-gray-700 dark:text-gray-300 dark:hover:border-primary-600"
            >
              {theme === 'light' ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
            </button>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMenuOpen}
              className="rounded-xl bg-gray-900 p-2.5 text-white transition hover:bg-gray-700 dark:bg-white dark:text-gray-900 lg:hidden"
            >
              {isMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden overflow-hidden rounded-b-3xl bg-white shadow-2xl dark:bg-primary-900 border-t border-primary-200 dark:border-primary-700"
          >
            <div className="max-h-[calc(100dvh-96px)] overflow-y-auto px-2 py-4 space-y-1">
              {navItems.map((item) => (
                item.hasAboutMenu ? (
                  <div key={item.name}>
                    <button
                      type="button"
                      onClick={() => setMobileAboutOpen((o) => !o)}
                      aria-expanded={mobileAboutOpen}
                      className={`flex w-full items-center justify-between rounded-xl px-4 py-3 font-display text-base font-bold tracking-tight transition-colors duration-200 ${
                        isActive(item.path)
                          ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-800/20'
                          : 'text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-800'
                      }`}
                    >
                      <span onClick={(e) => { e.stopPropagation(); setIsMenuOpen(false); navigate(item.path); }}>
                        {item.name}
                      </span>
                      <ChevronDown className={`h-4 w-4 transition-transform ${mobileAboutOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
                    </button>
                    <AnimatePresence initial={false}>
                      {mobileAboutOpen && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.25 }}
                          className="overflow-hidden"
                        >
                          <div className="ml-2 space-y-1 border-l-2 border-primary-200 py-1 pl-2 dark:border-primary-700">
                            {aboutMenuItems.map((sub) => (
                              <Link
                                key={sub.path + sub.name}
                                to={sub.path}
                                onClick={() => setIsMenuOpen(false)}
                                className="flex items-center gap-3 rounded-xl bg-gray-50 px-3 py-2 text-sm text-gray-700 transition-colors hover:text-primary-600 dark:bg-white/5 dark:text-gray-300"
                              >
                                <span className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${sub.gradient} text-white shadow-sm`}>
                                  <sub.Icon className="h-4 w-4" aria-hidden="true" />
                                </span>
                                <span className="min-w-0">
                                  <span className="block truncate font-semibold">{sub.name}</span>
                                  <span className="block truncate text-xs text-gray-500 dark:text-gray-400">
                                    {sub.description}
                                  </span>
                                </span>
                              </Link>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : item.hasMenu ? (
                  <div key={item.name}>
                    <button
                      type="button"
                      onClick={() => setMobileServicesOpen((o) => !o)}
                      aria-expanded={mobileServicesOpen}
                      className={`flex w-full items-center justify-between rounded-xl px-4 py-3 font-display text-base font-bold tracking-tight transition-colors duration-200 ${
                        isActive(item.path)
                          ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-800/20'
                          : 'text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-800'
                      }`}
                    >
                      <span onClick={(e) => { e.stopPropagation(); setIsMenuOpen(false); navigate(item.path); }}>
                        {item.name}
                      </span>
                      <ChevronDown className={`h-4 w-4 transition-transform ${mobileServicesOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
                    </button>
                    <AnimatePresence initial={false}>
                      {mobileServicesOpen && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.25 }}
                          className="overflow-hidden"
                        >
                          <div className="ml-2 max-h-[50vh] space-y-1 overflow-y-auto border-l-2 border-primary-200 py-1 pl-2 dark:border-primary-700">
                            <Link
                              to="/services"
                              onClick={() => setIsMenuOpen(false)}
                              className="flex items-center justify-between rounded-xl bg-primary-50 px-3 py-2.5 text-sm font-bold text-primary-700 dark:bg-primary-800/30 dark:text-primary-300"
                            >
                              View All Services
                              <span className="rounded-full bg-primary-600 px-2 py-0.5 text-[11px] font-bold text-white">
                                {SERVICES.length}
                              </span>
                            </Link>
                            {SERVICE_CATEGORIES.map((cat) => (
                              <div key={cat.id} className="pt-1">
                                <p className="px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
                                  {cat.label}
                                </p>
                                {servicesByCategory(cat.id).map((s) => {
                                  const Icon = serviceIcon(s.icon);
                                  return (
                                    <Link
                                      key={s.slug}
                                      to={`/services/${s.slug}`}
                                      onClick={() => setIsMenuOpen(false)}
                                      className="flex items-center gap-3 rounded-xl bg-gray-50 px-3 py-2 text-sm text-gray-700 transition-colors hover:text-primary-600 dark:bg-white/5 dark:text-gray-300"
                                    >
                                      <span className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${s.gradient} text-white shadow-sm`}>
                                        <Icon className="h-4 w-4" aria-hidden="true" />
                                      </span>
                                      <span className="min-w-0">
                                        <span className="block truncate font-semibold">{s.name}</span>
                                        <span className="block truncate text-xs text-gray-500 dark:text-gray-400">
                                          {s.shortDescription}
                                        </span>
                                      </span>
                                    </Link>
                                  );
                                })}
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : item.hasIndustriesMenu ? (
                  <div key={item.name}>
                    <button
                      type="button"
                      onClick={() => setMobileIndustriesOpen((o) => !o)}
                      aria-expanded={mobileIndustriesOpen}
                      className={`flex w-full items-center justify-between rounded-xl px-4 py-3 font-display text-base font-bold tracking-tight transition-colors duration-200 ${
                        isActive(item.path)
                          ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-800/20'
                          : 'text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-800'
                      }`}
                    >
                      <span onClick={(e) => { e.stopPropagation(); setIsMenuOpen(false); navigate(item.path); }}>
                        {item.name}
                      </span>
                      <ChevronDown className={`h-4 w-4 transition-transform ${mobileIndustriesOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
                    </button>
                    <AnimatePresence initial={false}>
                      {mobileIndustriesOpen && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.25 }}
                          className="overflow-hidden"
                        >
                          <div className="ml-2 max-h-[50vh] space-y-1 overflow-y-auto border-l-2 border-primary-200 py-1 pl-2 dark:border-primary-700">
                            <Link
                              to="/industries"
                              onClick={() => setIsMenuOpen(false)}
                              className="flex items-center justify-between rounded-xl bg-primary-50 px-3 py-2.5 text-sm font-bold text-primary-700 dark:bg-primary-800/30 dark:text-primary-300"
                            >
                              View All Industries
                              <span className="rounded-full bg-primary-600 px-2 py-0.5 text-[11px] font-bold text-white">
                                {INDUSTRIES.length}
                              </span>
                            </Link>
                            {INDUSTRIES.map((ind) => {
                              const Icon = serviceIcon(ind.icon);
                              return (
                                <Link
                                  key={ind.slug}
                                  to={`/industries/${ind.slug}`}
                                  onClick={() => setIsMenuOpen(false)}
                                  className="flex items-center gap-3 rounded-xl bg-gray-50 px-3 py-2 text-sm text-gray-700 transition-colors hover:text-primary-600 dark:bg-white/5 dark:text-gray-300"
                                >
                                  <span className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${ind.gradient} text-white shadow-sm`}>
                                    <Icon className="h-4 w-4" aria-hidden="true" />
                                  </span>
                                  <span className="min-w-0">
                                    <span className="block truncate font-semibold">{ind.name}</span>
                                    <span className="block truncate text-xs text-gray-500 dark:text-gray-400">
                                      {ind.shortDescription}
                                    </span>
                                  </span>
                                </Link>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`block rounded-xl px-4 py-3 font-display text-lg font-bold tracking-tight transition-colors duration-200 ${
                      isActive(item.path)
                        ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-800/20'
                        : 'text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-800'
                    }`}
                  >
                    {item.name}
                  </Link>
                )
              ))}
              {!isAuthenticated && (
                <>
                  <Link to="/login" onClick={() => setIsMenuOpen(false)} className="block px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Login
                  </Link>
                  <Link to="/signup" onClick={() => setIsMenuOpen(false)} className="block px-4 py-2 text-sm font-medium text-primary-600">
                    Sign up
                  </Link>
                </>
              )}
              <div className="sticky bottom-0 bg-gradient-to-t from-white via-white to-transparent px-2 pb-2 pt-6 dark:from-primary-900 dark:via-primary-900">
                <Link
                  to="/contact"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex min-h-[52px] items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-primary-600 to-secondary-600 px-4 py-3 font-display text-base font-bold text-white shadow-lg"
                >
                  Get in Touch <ArrowRight className="h-5 w-5" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.header>
  );
};

export default Header;