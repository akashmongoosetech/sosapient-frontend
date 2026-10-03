import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export const RequireAuth: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div className="flex min-h-screen items-center justify-center text-gray-500">Checking session…</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
};

export const RequireAdmin: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  if (loading) return <div className="flex min-h-screen items-center justify-center text-gray-500">Checking admin access…</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="max-w-sm rounded-lg bg-white p-6 text-center shadow">
          <h1 className="text-lg font-bold text-gray-900">Access denied</h1>
          <p className="mt-1 text-sm text-gray-600">Your account does not have admin access.</p>
        </div>
      </div>
    );
  }
  return children;
};

// Legacy default export kept for existing imports: now enforces ADMIN role via JWT.
const ProtectedRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => (
  <RequireAdmin>{children}</RequireAdmin>
);

export default ProtectedRoute;
