import React, { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import ScrollToTop from './ScrollToTop';
import LatestBlogPopup from './LatestBlogPopup';

// Lazy so the chatbot never slows the initial page load
const ChatbotWidget = lazy(() => import('../chatbot/ChatbotWidget'));

const Layout: React.FC = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-primary-900 transition-colors duration-200">
      <Header />
      <main className="pt-24 lg:pt-28">
        <Outlet />
      </main>
      <Footer />
      <ScrollToTop />
      <LatestBlogPopup />
      <Suspense fallback={null}>
        <ChatbotWidget />
      </Suspense>
    </div>
  );
};

export default Layout;