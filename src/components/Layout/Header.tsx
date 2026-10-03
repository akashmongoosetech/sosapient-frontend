import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Moon, Sun, ChevronDown, ArrowRight, Info, Newspaper, Briefcase, Mail } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { SERVICE_CATEGORIES, servicesByCategory } from '../../data/services';
import { serviceIcon } from '../services/ServiceCard';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [mobileAboutOpen, setMobileAboutOpen] = useState(false);
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
    if (!servicesOpen && !aboutOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setServicesOpen(false);
        setAboutOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [servicesOpen, aboutOpen]);

  // Close the menus on route change
  useEffect(() => {
    setServicesOpen(false);
    setAboutOpen(false);
    setMobileServicesOpen(false);
    setMobileAboutOpen(false);
  }, [location.pathname]);

  const openServices = () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    setAboutOpen(false);
    setServicesOpen(true);
  };

  const scheduleCloseServices = () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setServicesOpen(false), 150);
  };

  const openAbout = () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    setServicesOpen(false);
    setAboutOpen(true);
  };

  const scheduleCloseAbout = () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setAboutOpen(false), 150);
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img src="https://ik.imagekit.io/sentyaztie/Dlogo.png?updatedAt=1749928182723" className='w-48' alt="logo" />
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
                    className={`flex items-center gap-1 text-sm font-medium transition-colors duration-200 relative ${
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
                        className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-500 to-secondary-500"
                      />
                    )}
                  </Link>
                  <AnimatePresence>
                    {aboutOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.18 }}
                        className="absolute left-0 top-full z-50 w-80 pt-3"
                        onMouseEnter={openAbout}
                        onMouseLeave={scheduleCloseAbout}
                      >
                        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-2xl dark:border-gray-700 dark:bg-gray-800">
                          <ul className="p-3">
                            {aboutMenuItems.map((sub) => (
                              <li key={sub.path + sub.name}>
                                <Link
                                  to={sub.path}
                                  onClick={() => setAboutOpen(false)}
                                  className="group flex items-start gap-3 rounded-xl p-2.5 transition-colors hover:bg-primary-50 dark:hover:bg-primary-800/20"
                                >
                                  <span className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-r ${sub.gradient} text-white shadow-sm`}>
                                    <sub.Icon className="h-4 w-4" aria-hidden="true" />
                                  </span>
                                  <span className="min-w-0">
                                    <span className="block text-sm font-semibold text-gray-900 group-hover:text-primary-700 dark:text-gray-100 dark:group-hover:text-primary-300">
                                      {sub.name}
                                    </span>
                                    <span className="block truncate text-xs text-gray-500 dark:text-gray-400">
                                      {sub.description}
                                    </span>
                                  </span>
                                </Link>
                              </li>
                            ))}
                          </ul>
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
                    className={`flex items-center gap-1 text-sm font-medium transition-colors duration-200 relative ${
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
                        className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-500 to-secondary-500"
                      />
                    )}
                  </Link>
                  <AnimatePresence>
                    {servicesOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.18 }}
                        className="absolute inset-x-0 top-full z-50"
                        onMouseEnter={openServices}
                        onMouseLeave={scheduleCloseServices}
                      >
                        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                          <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-2xl dark:border-gray-700 dark:bg-gray-800">
                            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4 dark:border-gray-700">
                              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                Explore our services
                                <span className="ml-2 font-normal text-gray-500 dark:text-gray-400">
                                  15 specialized offerings across 5 categories
                                </span>
                              </p>
                              <Link
                                to="/services"
                                onClick={() => setServicesOpen(false)}
                                className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600 hover:gap-2.5 hover:text-primary-700 dark:text-primary-400"
                              >
                                View All Services <ArrowRight className="h-4 w-4" aria-hidden="true" />
                              </Link>
                            </div>
                            <div className="grid grid-cols-5 gap-6 p-6">
                              {SERVICE_CATEGORIES.map((cat) => (
                                <div key={cat.id}>
                                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                                    {cat.label}
                                  </p>
                                  <ul className="mt-3 space-y-1">
                                    {servicesByCategory(cat.id).map((s) => {
                                      const Icon = serviceIcon(s.icon);
                                      return (
                                        <li key={s.slug}>
                                          <Link
                                            to={`/services/${s.slug}`}
                                            onClick={() => setServicesOpen(false)}
                                            className="group flex items-start gap-2.5 rounded-xl p-2 transition-colors hover:bg-primary-50 dark:hover:bg-primary-800/20"
                                          >
                                            <span className={`mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-r ${s.gradient} text-white shadow-sm`}>
                                              <Icon className="h-4 w-4" aria-hidden="true" />
                                            </span>
                                            <span className="min-w-0">
                                              <span className="block truncate text-sm font-semibold text-gray-900 group-hover:text-primary-700 dark:text-gray-100 dark:group-hover:text-primary-300">
                                                {s.shortName}
                                              </span>
                                              <span className="block truncate text-xs text-gray-500 dark:text-gray-400">
                                                {s.shortDescription}
                                              </span>
                                            </span>
                                          </Link>
                                        </li>
                                      );
                                    })}
                                  </ul>
                                </div>
                              ))}
                            </div>
                            <Link
                              to="/contact"
                              onClick={() => setServicesOpen(false)}
                              className="flex items-center justify-center gap-2 bg-gradient-to-r from-primary-600 to-secondary-600 px-6 py-3.5 text-sm font-semibold text-white transition hover:brightness-110"
                            >
                              Start a Project <ArrowRight className="h-4 w-4" aria-hidden="true" />
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
                  className={`text-sm font-medium transition-colors duration-200 relative ${
                    isActive(item.path)
                      ? 'text-primary-600 dark:text-primary-400'
                      : 'text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400'
                  }`}
                >
                  {item.name}
                  {isActive(item.path) && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-500 to-secondary-500"
                    />
                  )}
                </Link>
              )
            ))}
          </nav>

          {/* Theme Toggle & Auth & Mobile Menu */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            {!isAuthenticated && (
              <div className="hidden lg:flex items-center space-x-3">
                <Link to="/login" className="text-sm font-medium text-gray-700 hover:text-primary-600 dark:text-gray-300">Login</Link>
                <Link to="/signup" className="rounded bg-primary-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-primary-700">Sign up</Link>
              </div>
            )}
            <Link
              to="/contact"
              className="hidden sm:inline-flex min-h-[40px] items-center gap-1.5 rounded-lg bg-gradient-to-r from-primary-600 to-secondary-600 px-4 sm:px-5 py-2 text-sm font-semibold text-white shadow-md transition hover:shadow-lg hover:brightness-110"
            >
              Get in Touch <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-primary-50 dark:bg-primary-800 hover:bg-primary-100 dark:hover:bg-primary-700 transition-colors"
            >
              {theme === 'light' ? (
                <Moon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              ) : (
                <Sun className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              )}
            </button>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 rounded-lg bg-primary-50 dark:bg-primary-800 hover:bg-primary-100 dark:hover:bg-primary-700 transition-colors"
            >
              {isMenuOpen ? (
                <X className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              ) : (
                <Menu className="w-5 h-5 text-primary-600 dark:text-primary-400" />
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
            className="lg:hidden bg-white dark:bg-primary-900 border-t border-primary-200 dark:border-primary-700"
          >
            <div className="py-4 space-y-2">
              {navItems.map((item) => (
                item.hasAboutMenu ? (
                  <div key={item.name}>
                    <button
                      type="button"
                      onClick={() => setMobileAboutOpen((o) => !o)}
                      aria-expanded={mobileAboutOpen}
                      className={`flex w-full items-center justify-between px-4 py-2 text-sm font-medium transition-colors duration-200 ${
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
                    {mobileAboutOpen && (
                      <div className="ml-2 border-l-2 border-primary-100 dark:border-primary-800">
                        {aboutMenuItems.map((sub) => (
                          <Link
                            key={sub.path + sub.name}
                            to={sub.path}
                            onClick={() => setIsMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:text-primary-600"
                          >
                            <span className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-r ${sub.gradient} text-white`}>
                              <sub.Icon className="h-4 w-4" aria-hidden="true" />
                            </span>
                            <span className="min-w-0">
                              <span className="block truncate font-medium">{sub.name}</span>
                              <span className="block truncate text-xs text-gray-500 dark:text-gray-400">
                                {sub.description}
                              </span>
                            </span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : item.hasMenu ? (
                  <div key={item.name}>
                    <button
                      type="button"
                      onClick={() => setMobileServicesOpen((o) => !o)}
                      aria-expanded={mobileServicesOpen}
                      className={`flex w-full items-center justify-between px-4 py-2 text-sm font-medium transition-colors duration-200 ${
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
                    {mobileServicesOpen && (
                      <div className="ml-2 max-h-[50vh] overflow-y-auto border-l-2 border-primary-100 dark:border-primary-800">
                        <Link
                          to="/services"
                          onClick={() => setIsMenuOpen(false)}
                          className="block px-4 py-2 text-sm font-semibold text-primary-600 dark:text-primary-400"
                        >
                          View All Services
                        </Link>
                        {SERVICE_CATEGORIES.map((cat) => (
                          <div key={cat.id} className="mt-1">
                            <p className="px-4 py-1 text-xs font-semibold uppercase tracking-wider text-gray-400">
                              {cat.label}
                            </p>
                            {servicesByCategory(cat.id).map((s) => {
                              const Icon = serviceIcon(s.icon);
                              return (
                                <Link
                                  key={s.slug}
                                  to={`/services/${s.slug}`}
                                  onClick={() => setIsMenuOpen(false)}
                                  className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:text-primary-600"
                                >
                                  <span className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-r ${s.gradient} text-white`}>
                                    <Icon className="h-4 w-4" aria-hidden="true" />
                                  </span>
                                  <span className="min-w-0">
                                    <span className="block truncate font-medium">{s.name}</span>
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
                    )}
                  </div>
                ) : (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`block px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                      isActive(item.path)
                        ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-800/20'
                        : 'text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-800'
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
              <div className="px-4 pt-2">
                <Link
                  to="/contact"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex min-h-[44px] items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-primary-600 to-secondary-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md"
                >
                  Get in Touch <ArrowRight className="h-4 w-4" aria-hidden="true" />
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