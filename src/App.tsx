import React, { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { trackPageView } from './utils/analytics';

const RouteTracker: React.FC = () => {
  const location = useLocation();
  useEffect(() => {
    trackPageView(location.pathname + location.search);
  }, [location.pathname, location.search]);
  return null;
};
import { AnimatePresence } from 'framer-motion';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/Layout/Layout';
import ProtectedRoute, { RequireAuth } from './components/Layout/ProtectedRoute';
import AdminLayout from './components/admin/AdminLayout';
import Home from './pages/Home';
import 'bootstrap-icons/font/bootstrap-icons.css';

// Heavy / rarely-visited pages are code-split so the first paint
// (including /login and /signup) doesn't wait for them in dev or prod.
const About = lazy(() => import('./pages/About'));
const Services = lazy(() => import('./pages/Services'));
const Blog = lazy(() => import('./pages/Blog'));
const BlogPost = lazy(() => import('./pages/Blogs/BlogPost'));
const BlogAdmin = lazy(() => import('./pages/BlogAdmin'));
const Careers = lazy(() => import('./pages/Careers'));
const Contact = lazy(() => import('./pages/Contact'));
const CareerTable = lazy(() => import('./components/CareerTable'));
const ContactTable = lazy(() => import('./components/ContactTable'));
const SubscriberTable = lazy(() => import('./components/SubscriberTable'));
const Portfolio = lazy(() => import('./components/Portfolio/Portfolio'));
const JobAdmin = lazy(() => import('./pages/JobAdmin'));
const JobDetails = lazy(() => import('./pages/JobDetails'));
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const Profile = lazy(() => import('./pages/Profile'));
const NotFound = lazy(() => import('./pages/NotFound'));
const ThankYou = lazy(() => import('./pages/ThankYou'));
const Privacy = lazy(() => import('./pages/Privacy'));
const Terms = lazy(() => import('./pages/Terms'));
const Cookies = lazy(() => import('./pages/Cookies'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminProfile = lazy(() => import('./pages/admin/AdminProfile'));
const ServiceDetail = lazy(() => import('./pages/ServiceDetail'));
const Industries = lazy(() => import('./pages/Industries'));
const IndustryDetail = lazy(() => import('./pages/IndustryDetail'));
const CaseStudies = lazy(() => import('./pages/CaseStudies'));
const CaseStudyDetails = lazy(() => import('./pages/CaseStudyDetails'));
const CaseStudiesPage = lazy(() => import('./pages/admin/CaseStudiesPage'));
const CaseStudyNewPage = lazy(() => import('./pages/admin/CaseStudyNewPage'));
const CaseStudyDetailPage = lazy(() => import('./pages/admin/CaseStudyDetailPage'));
const CaseStudyEditPage = lazy(() => import('./pages/admin/CaseStudyEditPage'));
const CertificatesPage = lazy(() => import('./pages/admin/CertificatesPage'));
const CertificateNewPage = lazy(() => import('./pages/admin/CertificateNewPage'));
const CertificateDetailPage = lazy(() => import('./pages/admin/CertificateDetailPage'));
const CertificateEditPage = lazy(() => import('./pages/admin/CertificateEditPage'));
const LeadsPage = lazy(() => import('./pages/admin/LeadsPage'));
const LeadNewPage = lazy(() => import('./pages/admin/LeadNewPage'));
const LeadDetailPage = lazy(() => import('./pages/admin/LeadDetailPage'));
const LeadEditPage = lazy(() => import('./pages/admin/LeadEditPage'));
const LeadImportPage = lazy(() => import('./pages/admin/LeadImportPage'));
const DealsPage = lazy(() => import('./pages/admin/DealsPage'));
const CertificateVerify = lazy(() => import('./pages/CertificateVerify'));

const RouteFallback: React.FC = () => (
  <div className="flex min-h-screen items-center justify-center text-gray-500">Loading…</div>
);


function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="font-inter">
            <RouteTracker />
            <Suspense fallback={<RouteFallback />}>
            <AnimatePresence mode="wait">
              <Routes>
                <Route path="/" element={<Layout />}>
                  <Route index element={<Home />} />
                  <Route path="about" element={<About />} />
                  <Route path="services" element={<Services />} />
                  <Route path="services/:slug" element={<ServiceDetail />} />
                  <Route path="industries" element={<Industries />} />
                  <Route path="industries/:slug" element={<IndustryDetail />} />
                  <Route path="blog" element={<Blog />} />
                  <Route path="blog/:slug" element={<BlogPost />} />
                  <Route path="case-studies" element={<CaseStudies />} />
                  <Route path="case-studies/:slug" element={<CaseStudyDetails />} />
                  <Route path="careers" element={<Careers />} />
                  <Route path="careers/:jobId" element={<JobDetails />} />
                  <Route path="contact" element={<Contact />} />
                  <Route path="portfolio" element={<Portfolio />} />
                  <Route path="thank-you" element={<ThankYou />} />
                  <Route path="privacy" element={<Privacy />} />
                  <Route path="terms" element={<Terms />} />
                  <Route path="cookies" element={<Cookies />} />
                  {/* Self profile for any authenticated role (ADMIN and USER) */}
                  <Route path="profile" element={<RequireAuth><Profile /></RequireAuth>} />
                </Route>

                {/* Auth pages render standalone without site header/footer */}
                <Route path="login" element={<Login />} />
                <Route path="signup" element={<Signup />} />


                {/* Legacy API-key login removed: redirect to JWT login */}
                <Route path="admin-login" element={<Navigate to="/login" replace />} />

                {/* Unified admin panel (JWT + ADMIN role, own layout) */}
                <Route path="admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
                  <Route index element={<AdminDashboard />} />
                  <Route path="dashboard" element={<AdminDashboard />} />
                  <Route path="contact-table" element={<ContactTable />} />
                  <Route path="career-table" element={<CareerTable />} />
                  <Route path="subscriber-table" element={<SubscriberTable />} />
                  <Route path="blog-admin" element={<BlogAdmin />} />
                  <Route path="job-admin" element={<JobAdmin />} />
                  <Route path="case-studies" element={<CaseStudiesPage />} />
                  <Route path="case-studies/new" element={<CaseStudyNewPage />} />
                  <Route path="case-studies/:id" element={<CaseStudyDetailPage />} />
                  <Route path="case-studies/:id/edit" element={<CaseStudyEditPage />} />
                  <Route path="certificates" element={<CertificatesPage />} />
                  <Route path="certificates/new" element={<CertificateNewPage />} />
                  <Route path="certificates/:certificateId" element={<CertificateDetailPage />} />
                  <Route path="certificates/:certificateId/edit" element={<CertificateEditPage />} />
                  <Route path="leads" element={<LeadsPage />} />
                  <Route path="leads/new" element={<LeadNewPage />} />
                  <Route path="leads/import" element={<LeadImportPage />} />
                  <Route path="leads/:id" element={<LeadDetailPage />} />
                  <Route path="leads/:id/edit" element={<LeadEditPage />} />
                  <Route path="deals" element={<DealsPage />} />
                  <Route path="profile" element={<AdminProfile />} />
                </Route>

                {/* Public certificate verification (no login). Preferred canonical path: */}
                <Route path="verify/:candidateSlug/:certificateId" element={<CertificateVerify />} />
                {/* Legacy 2-segment verification URLs (kept for issued links/QR codes) */}
                <Route path=":candidateSlug/:certificateId" element={<CertificateVerify />} />

                {/* Legacy top-level admin paths redirect into the panel (must precede catch-all) */}
                <Route path="contact-table" element={<Navigate to="/admin/contact-table" replace />} />
                <Route path="career-table" element={<Navigate to="/admin/career-table" replace />} />
                <Route path="subscriber-table" element={<Navigate to="/admin/subscriber-table" replace />} />
                <Route path="blog-admin" element={<Navigate to="/admin/blog-admin" replace />} />
                <Route path="job-admin" element={<Navigate to="/admin/job-admin" replace />} />

                {/* Catch-all 404 (absolute last: only unmatched URLs land here).
                    Note: SPA hosts serve index.html with HTTP 200, so crawlers see
                    200 + noindex; true 404 status requires host-level config. */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AnimatePresence>
            </Suspense>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
