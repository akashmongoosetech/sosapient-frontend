import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/Layout/Layout';
import ProtectedRoute from './components/Layout/ProtectedRoute';
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
                  <Route path="profile" element={<AdminProfile />} />
                </Route>

                {/* Public certificate verification (no login) — must stay last: claims /:a/:b */}
                <Route path=":candidateSlug/:certificateId" element={<CertificateVerify />} />

                {/* Legacy top-level admin paths redirect into the panel */}
                <Route path="contact-table" element={<Navigate to="/admin/contact-table" replace />} />
                <Route path="career-table" element={<Navigate to="/admin/career-table" replace />} />
                <Route path="subscriber-table" element={<Navigate to="/admin/subscriber-table" replace />} />
                <Route path="blog-admin" element={<Navigate to="/admin/blog-admin" replace />} />
                <Route path="job-admin" element={<Navigate to="/admin/job-admin" replace />} />
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
