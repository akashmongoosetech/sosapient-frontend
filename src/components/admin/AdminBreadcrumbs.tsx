import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const labels: Record<string, string> = {
  admin: 'Admin',
  dashboard: 'Dashboard',
  'contact-table': 'Contacts',
  'career-table': 'Careers',
  'subscriber-table': 'Subscribers',
  'blog-admin': 'Blog',
  'job-admin': 'Jobs',
  'case-studies': 'Case Studies',
  new: 'New',
  edit: 'Edit',
  profile: 'Profile'
};

const AdminBreadcrumbs: React.FC = () => {
  const { pathname } = useLocation();
  const parts = pathname.split('/').filter(Boolean);
  if (parts[0] !== 'admin') return <p className="text-xs text-gray-400">Admin</p>;

  return (
    <nav aria-label="Breadcrumb">
      <p className="text-xs text-gray-400 dark:text-gray-500">
        {parts.map((p, i) => {
          const to = '/' + parts.slice(0, i + 1).join('/');
          const last = i === parts.length - 1;
          const label = labels[p] || p;
          return (
            <span key={to}>
              {i > 0 && <span className="mx-1">/</span>}
              {last ? (
                <span className="font-medium text-gray-500 dark:text-gray-400">{label}</span>
              ) : (
                <Link to={to} className="hover:underline">{label}</Link>
              )}
            </span>
          );
        })}
      </p>
    </nav>
  );
};

export default AdminBreadcrumbs;
