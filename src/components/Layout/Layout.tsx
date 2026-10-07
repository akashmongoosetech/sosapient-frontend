import React, { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import ScrollToTop from './ScrollToTop';
import LatestBlogPopup from './LatestBlogPopup';
import ConsentBanner from './ConsentBanner';
import ErrorBoundary from './ErrorBoundary';

// Lazy so the chatbot never slows the initial page load
const ChatbotWidget = lazy(() => import('../chatbot/ChatbotWidget'));

const Layout: React.FC = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-primary-900 transition-colors duration-200">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-primary-600 focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to content
      </a>
      <Header />
      <main id="main" className="pt-24 lg:pt-28">
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
      </main>
      <Footer />
      <ScrollToTop />
      <LatestBlogPopup />
      <ConsentBanner />
      <Suspense fallback={null}>
        <ChatbotWidget />
      </Suspense>
    </div>
  );
};

export default Layout;