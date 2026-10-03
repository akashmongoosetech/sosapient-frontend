import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Contact,
  Briefcase,
  Users,
  FileText,
  ClipboardList,
  User,
  LogOut,
  X,
  ChevronsLeft,
  ChevronsRight
} from 'lucide-react';

export interface AdminNavItem {
  to: string;
  label: string;
  icon: React.ReactNode;
  end?: boolean;
}

export const adminNavSections: { heading: string; items: AdminNavItem[] }[] = [
  {
    heading: '',
    items: [{ to: '/admin', label: 'Dashboard', icon: <LayoutDashboard className="h-5 w-5" />, end: true }]
  },
  {
    heading: 'Manage',
    items: [
      { to: '/admin/contact-table', label: 'Contacts', icon: <Contact className="h-5 w-5" /> },
      { to: '/admin/career-table', label: 'Careers', icon: <Briefcase className="h-5 w-5" /> },
      { to: '/admin/subscriber-table', label: 'Subscribers', icon: <Users className="h-5 w-5" /> }
    ]
  },
  {
    heading: 'Content',
    items: [
      { to: '/admin/blog-admin', label: 'Blog', icon: <FileText className="h-5 w-5" /> },
      { to: '/admin/job-admin', label: 'Jobs', icon: <ClipboardList className="h-5 w-5" /> }
    ]
  },
  {
    heading: 'System',
    items: [{ to: '/admin/profile', label: 'Profile', icon: <User className="h-5 w-5" /> }]
  }
];

interface SidebarProps {
  collapsed: boolean;
  mobileOpen: boolean;
  onToggleCollapse: () => void;
  onCloseMobile: () => void;
  onLogout: () => void;
}

const SidebarBody: React.FC<{ collapsed: boolean; onNavigate: () => void; onLogout: () => void; onToggleCollapse: () => void }> = ({
  collapsed, onNavigate, onLogout, onToggleCollapse
}) => (
  <div className="flex h-full flex-col">
    <div className="flex h-16 items-center justify-between border-b border-gray-200 px-4 dark:border-gray-700">
      {!collapsed && (
        <span className="text-base font-bold text-gray-900 dark:text-white">
          SoSapient <span className="font-normal text-primary-600">Admin</span>
        </span>
      )}
      {collapsed && (
        <span className="mx-auto text-base font-bold text-primary-600" aria-hidden="true">S</span>
      )}
      <button
        onClick={onToggleCollapse}
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        className="hidden rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 lg:block"
      >
        {collapsed ? <ChevronsRight className="h-5 w-5" /> : <ChevronsLeft className="h-5 w-5" />}
      </button>
      <button
        onClick={onNavigate}
        aria-label="Close menu"
        className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 dark:text-gray-400 lg:hidden"
      >
        <X className="h-5 w-5" />
      </button>
    </div>

    <nav className="flex-1 overflow-y-auto px-2 py-4" aria-label="Admin navigation">
      {adminNavSections.map((section, si) => (
        <div key={si} className={si > 0 ? 'mt-6' : ''}>
          {section.heading && !collapsed && (
            <p className="px-3 text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
              {section.heading}
            </p>
          )}
          <ul className="mt-1 space-y-1">
            {section.items.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.end}
                  onClick={onNavigate}
                  title={collapsed ? item.label : undefined}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                      collapsed ? 'justify-center' : ''
                    } ${
                      isActive
                        ? 'bg-primary-50 text-primary-700 dark:bg-primary-800/30 dark:text-primary-300'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white'
                    }`
                  }
                >
                  <span aria-hidden="true">{item.icon}</span>
                  {!collapsed && <span>{item.label}</span>}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>

    <div className="border-t border-gray-200 p-2 dark:border-gray-700">
      <button
        onClick={onLogout}
        title={collapsed ? 'Logout' : undefined}
        className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 ${
          collapsed ? 'justify-center' : ''
        }`}
      >
        <LogOut className="h-5 w-5" aria-hidden="true" />
        {!collapsed && <span>Logout</span>}
      </button>
    </div>
  </div>
);

const AdminSidebar: React.FC<SidebarProps> = ({ collapsed, mobileOpen, onToggleCollapse, onCloseMobile, onLogout }) => (
  <>
    {/* Desktop */}
    <aside
      className={`fixed inset-y-0 left-0 z-40 hidden bg-white transition-all duration-200 dark:bg-gray-900 lg:block ${
        collapsed ? 'w-[72px]' : 'w-64'
      } border-r border-gray-200 dark:border-gray-700`}
    >
      <SidebarBody collapsed={collapsed} onNavigate={() => {}} onLogout={onLogout} onToggleCollapse={onToggleCollapse} />
    </aside>

    {/* Mobile drawer */}
    {mobileOpen && (
      <div className="fixed inset-0 z-50 lg:hidden">
        <div className="absolute inset-0 bg-black/50" onClick={onCloseMobile} aria-hidden="true" />
        <aside className="absolute inset-y-0 left-0 w-72 bg-white shadow-xl dark:bg-gray-900">
          <SidebarBody collapsed={false} onNavigate={onCloseMobile} onLogout={onLogout} onToggleCollapse={onToggleCollapse} />
        </aside>
      </div>
    )}
  </>
);

export default AdminSidebar;
