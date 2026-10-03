import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X, Moon, Sun, LogOut } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
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

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Blog', path: '/blog' },
    { name: 'Careers', path: '/careers' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
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
          <nav className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => (
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