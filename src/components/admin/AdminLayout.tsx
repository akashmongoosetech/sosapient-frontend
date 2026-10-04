import React, { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';

const titles: Record<string, string> = {
  '/admin': 'Dashboard',
  '/admin/dashboard': 'Dashboard',
  '/admin/contact-table': 'Contacts',
  '/admin/career-table': 'Careers',
  '/admin/subscriber-table': 'Subscribers',
  '/admin/blog-admin': 'Blog Management',
  '/admin/job-admin': 'Job Management',
  '/admin/case-studies': 'Case Studies',
  '/admin/case-studies/new': 'New Case Study',
  '/admin/certificates': 'Certificate Generation',
  '/admin/certificates/new': 'Generate Certificate',
  '/admin/profile': 'Profile'
};

const AdminLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(() => {
    try {
      return localStorage.getItem('sosapient_sidebar_collapsed') === '1';
    } catch {
      return false;
    }
  });
  const [mobileOpen, setMobileOpen] = useState(false);
  const { pathname } = useLocation();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const toggleCollapse = () => {
    setCollapsed((c) => {
      try {
        localStorage.setItem('sosapient_sidebar_collapsed', c ? '0' : '1');
      } catch {
        // ignore
      }
      return !c;
    });
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <AdminSidebar
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onToggleCollapse={toggleCollapse}
        onCloseMobile={() => setMobileOpen(false)}
        onLogout={handleLogout}
      />
      <div className={`transition-all duration-200 ${collapsed ? 'lg:pl-[72px]' : 'lg:pl-64'}`}>
        <AdminHeader onOpenMobile={() => setMobileOpen(true)} title={titles[pathname] || (pathname.startsWith('/admin/case-studies') ? 'Case Studies' : pathname.startsWith('/admin/certificates') ? 'Certificate Generation' : 'Admin')} />
        <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
