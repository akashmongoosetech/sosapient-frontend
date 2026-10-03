import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X, Moon, Sun, LogOut, ChevronDown } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { SERVICE_CATEGORIES, servicesByCategory } from '../../data/services';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const closeTimer = useRef<number | null>(null);
  const { theme, toggleTheme } = useTheme();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

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

  const openServices = () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    setServicesOpen(true);
  };

  const scheduleCloseServices = () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setServicesOpen(false), 150);
  };

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Services', path: '/services', hasMenu: true },
    { name: 'Blog', path: '/blog' },
    { name: 'Careers', path: '/careers' },
    { name: 'Contact', path: '/contact' },
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
          <nav className="hidden lg:flex items-center space-x-8" aria-label="Primary">
            {navItems.map((item) => (
              item.hasMenu ? (
                <div
                  key={item.name}
                  className="relative"
                  onMouseEnter={openServices}
                  onMouseLeave={scheduleCloseServices}
                >
                  <Link
                    to={item.path}
                    aria-expanded={servicesOpen}
                    aria-haspopup="true"
                    onFocus={openServices}
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
                  {servicesOpen && (
                    <div
                      className="absolute left-1/2 top-full z-50 w-[640px] -translate-x-1/2 pt-3"
                      onMouseEnter={openServices}
                      onMouseLeave={scheduleCloseServices}
                    >
                      <div className="grid grid-cols-2 gap-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-2xl dark:border-gray-700 dark:bg-gray-800">
                        {SERVICE_CATEGORIES.map((cat) => (
                          <div key={cat.id}>
                            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                              {cat.label}
                            </p>
                            <ul className="mt-2 space-y-1">
                              {servicesByCategory(cat.id).map((s) => (
                                <li key={s.slug}>
                                  <Link
                                    to={`/services/${s.slug}`}
                                    onClick={() => setServicesOpen(false)}
                                    className="block rounded-lg px-2 py-1.5 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-700 dark:text-gray-300 dark:hover:bg-primary-800/20 dark:hover:text-primary-300"
                                  >
                                    {s.name}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                        <Link
                          to="/services"
                          onClick={() => setServicesOpen(false)}
                          className="col-span-2 rounded-lg bg-primary-50 px-4 py-2.5 text-center text-sm font-semibold text-primary-700 hover:bg-primary-100 dark:bg-primary-800/30 dark:text-primary-300"
                        >
                          View All Services →
                        </Link>
                      </div>
                    </div>
                  )}
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
          <div className="flex items-center space-x-4">
            {isAuthenticated && user ? (
              <div className="hidden lg:flex items-center space-x-3">
                {user.profilePic ? (
                  <img src={user.profilePic} alt={`${user.firstName} ${user.lastName}`} className="h-8 w-8 rounded-full object-cover" />
                ) : null}
                <div className="text-left leading-tight">
                  <div className="text-sm font-semibold text-gray-900 dark:text-white">{user.firstName} {user.lastName}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">@{user.username} · {user.role}</div>
                </div>
                {isAdmin ? (
                  <Link to="/admin" className="text-sm font-medium text-primary-600 hover:underline">Admin</Link>
                ) : null}
                <button onClick={handleLogout} className="flex items-center space-x-1 text-sm font-medium text-gray-700 hover:text-red-600 dark:text-gray-300" aria-label="Logout">
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="hidden lg:flex items-center space-x-3">
                <Link to="/login" className="text-sm font-medium text-gray-700 hover:text-primary-600 dark:text-gray-300">Login</Link>
                <Link to="/signup" className="rounded bg-primary-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-primary-700">Sign up</Link>
              </div>
            )}
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
                item.hasMenu ? (
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
                      <div className="ml-2 border-l-2 border-primary-100 dark:border-primary-800">
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
                            {servicesByCategory(cat.id).map((s) => (
                              <Link
                                key={s.slug}
                                to={`/services/${s.slug}`}
                                onClick={() => setIsMenuOpen(false)}
                                className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:text-primary-600"
                              >
                                {s.name}
                              </Link>
                            ))}
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
              {isAuthenticated && user ? (
                <>
                  {isAdmin ? (
                    <Link to="/admin" onClick={() => setIsMenuOpen(false)} className="block px-4 py-2 text-sm font-medium text-primary-600">
                      Admin ({user.username})
                    </Link>
                  ) : null}
                  <button onClick={() => { setIsMenuOpen(false); void handleLogout(); }} className="block w-full px-4 py-2 text-left text-sm font-medium text-red-600">
                    Logout ({user.username})
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setIsMenuOpen(false)} className="block px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Login
                  </Link>
                  <Link to="/signup" onClick={() => setIsMenuOpen(false)} className="block px-4 py-2 text-sm font-medium text-primary-600">
                    Sign up
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </motion.header>
  );
};

export default Header;