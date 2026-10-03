import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, LogOut, User as UserIcon, ChevronDown } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import AdminBreadcrumbs from './AdminBreadcrumbs';

function initials(firstName: string, lastName: string, username: string): string {
  const a = (firstName || '').trim().charAt(0);
  const b = (lastName || '').trim().charAt(0);
  const s = (a + b).toUpperCase();
  if (s) return s;
  return (username || '?').slice(0, 2).toUpperCase();
}

const AdminHeader: React.FC<{ onOpenMobile: () => void; title: string }> = ({ onOpenMobile, title }) => {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/95 backdrop-blur dark:border-gray-700 dark:bg-gray-900/95">
      <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <button
            onClick={onOpenMobile}
            aria-label="Open admin menu"
            className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="min-w-0">
            <h1 className="truncate text-lg font-semibold text-gray-900 dark:text-white">{title}</h1>
            <AdminBreadcrumbs />
          </div>
        </div>

        <div className="relative flex items-center gap-3">
          <button
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-label="Account menu"
            className="flex items-center gap-2 rounded-lg p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            {user?.profilePic ? (
              <img src={user.profilePic} alt={`${user.firstName} ${user.lastName}`} className="h-9 w-9 rounded-full object-cover" />
            ) : (
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-100 text-sm font-bold text-primary-700 dark:bg-primary-800 dark:text-primary-300" aria-hidden="true">
                {user ? initials(user.firstName, user.lastName, user.username) : '?'}
              </span>
            )}
            <span className="hidden text-left leading-tight sm:block">
              <span className="block text-sm font-semibold text-gray-900 dark:text-white">
                {user ? `${user.firstName} ${user.lastName}` : 'Admin'}
              </span>
              <span className="block text-xs text-gray-500 dark:text-gray-400">
                {user ? `@${user.username} · ${user.role}` : ''}
              </span>
            </span>
            <ChevronDown className="hidden h-4 w-4 text-gray-400 sm:block" />
          </button>

          {open && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} aria-hidden="true" />
              <div className="absolute right-0 top-12 z-50 w-48 rounded-xl border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-700 dark:bg-gray-900">
                <Link
                  to="/admin/profile"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-800"
                >
                  <UserIcon className="h-4 w-4" /> Profile
                </Link>
                <button
                  onClick={() => { setOpen(false); void logout(); }}
                  className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                >
                  <LogOut className="h-4 w-4" /> Logout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
