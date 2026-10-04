import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../contexts/AuthContext';

const Login: React.FC = () => {
  const { login, isAdmin, user, loading } = useAuth();
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const redirectFor = (role: string | undefined) => {
    navigate(role === 'ADMIN' ? '/admin' : '/', { replace: true });
  };

  React.useEffect(() => {
    if (!loading && user) redirectFor(user.role);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!identifier.trim() || !password) {
      setError('Identifier and password are required.');
      return;
    }
    setSubmitting(true);
    try {
      const me = await login(identifier.trim(), password);
      redirectFor(me.role);
    } catch (err) {
      // Generic message to avoid account enumeration
      setError(err instanceof Error ? err.message : 'Invalid credentials');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Helmet>
        <title>Login | SoSapient</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <form onSubmit={handleSubmit} className="w-full max-w-sm rounded-lg bg-white p-6 shadow">
        <h1 className="text-xl font-bold text-gray-900">Login</h1>
        <p className="mt-1 text-sm text-gray-600">Use your email, username or mobile number.</p>
        <label className="mt-4 block text-sm font-medium text-gray-700" htmlFor="identifier">Email / Username / Mobile</label>
        <input
          id="identifier"
          autoComplete="username"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          className="mt-1 w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
          placeholder="you@example.com"
        />
        <label className="mt-3 block text-sm font-medium text-gray-700" htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
          placeholder="••••••••"
        />
        {error && <p role="alert" className="mt-2 text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="mt-4 w-full rounded bg-primary-600 px-4 py-2 font-semibold text-white hover:bg-primary-700 disabled:opacity-50"
        >
          {submitting ? 'Logging in…' : 'Login'}
        </button>
        <p className="mt-3 text-sm text-gray-600">
          No account? <Link to="/signup" className="text-primary-600 hover:underline">Sign up</Link>
        </p>
        {isAdmin && <p className="mt-2 text-xs text-gray-500">Signed in as admin.</p>}
      </form>
    </div>
  );
};

export default Login;
