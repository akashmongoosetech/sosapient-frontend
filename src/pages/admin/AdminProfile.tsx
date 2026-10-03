import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { ContentCard, PageHeader, StatusBadge } from '../../components/admin/ui';

function initials(firstName: string, lastName: string, username: string): string {
  const s = ((firstName || '').charAt(0) + (lastName || '').charAt(0)).toUpperCase();
  return s || (username || '?').slice(0, 2).toUpperCase();
}

const AdminProfile: React.FC = () => {
  const { user, logout } = useAuth();
  if (!user) return null;

  return (
    <div>
      <PageHeader title="Profile" subtitle="Your administrator account" />
      <ContentCard className="max-w-2xl p-6">
        <div className="flex items-center gap-4">
          {user.profilePic ? (
            <img src={user.profilePic} alt={`${user.firstName} ${user.lastName}`} className="h-16 w-16 rounded-full object-cover" />
          ) : (
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-100 text-xl font-bold text-primary-700 dark:bg-primary-800 dark:text-primary-300">
              {initials(user.firstName, user.lastName, user.username)}
            </span>
          )}
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">{user.firstName} {user.lastName}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">@{user.username}</p>
            <div className="mt-1"><StatusBadge label={user.role} tone={user.role === 'ADMIN' ? 'purple' : 'gray'} /></div>
          </div>
        </div>
        <dl className="mt-6 grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
          <div>
            <dt className="font-medium text-gray-500 dark:text-gray-400">Email</dt>
            <dd className="mt-1 text-gray-900 dark:text-white">{user.email}</dd>
          </div>
          <div>
            <dt className="font-medium text-gray-500 dark:text-gray-400">Mobile</dt>
            <dd className="mt-1 text-gray-900 dark:text-white">{user.mobile}</dd>
          </div>
        </dl>
        <button
          onClick={() => void logout()}
          className="mt-6 inline-flex min-h-[40px] items-center rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
        >
          Logout
        </button>
      </ContentCard>
    </div>
  );
};

export default AdminProfile;
