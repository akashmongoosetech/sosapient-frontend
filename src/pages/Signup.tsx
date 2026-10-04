import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../contexts/AuthContext';

function isValidUrl(value: string): boolean {
  if (!value.trim()) return true;
  try {
    const u = new URL(value.trim());
    return u.protocol === 'https:' || u.protocol === 'http:';
  } catch {
    return false;
  }
}

function isValidMobile(value: string): boolean {
  const v = value.trim().replace(/[\s-]/g, '');
  if (/^\+[1-9]\d{7,14}$/.test(v)) return true;
  if (/^[6-9]\d{9}$/.test(v)) return true;
  return false;
}

const Signup: React.FC = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    mobile: '',
    profilePic: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const validate = (): string | null => {
    if (form.firstName.trim().length < 2 || form.firstName.trim().length > 50) return 'First name is required (2-50 characters).';
    if (form.lastName.trim().length < 2 || form.lastName.trim().length > 50) return 'Last name is required (2-50 characters).';
    if (!/^[a-zA-Z0-9_.]{3,30}$/.test(form.username.trim())) return 'Username is required (3-30 chars: letters, numbers, dot, underscore).';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) return 'A valid email address is required.';
    if (!isValidMobile(form.mobile)) return 'A valid mobile number is required.';
    if (form.profilePic && !isValidUrl(form.profilePic)) return 'Invalid profile picture URL.';
    if (form.password.length < 8) return 'Password must be at least 8 characters.';
    if (form.password !== form.confirmPassword) return 'Passwords do not match.';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const v = validate();
    if (v) {
      setError(v);
      return;
    }
    setSubmitting(true);
    try {
      // role is never sent: backend forces USER
      await signup({
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        username: form.username.trim(),
        email: form.email.trim(),
        mobile: form.mobile.trim(),
        profilePic: form.profilePic.trim(),
        password: form.password,
        confirmPassword: form.confirmPassword
      });
      navigate('/', { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Signup failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-10">
      <Helmet>
        <title>Sign up | SoSapient</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <form onSubmit={handleSubmit} className="w-full max-w-lg rounded-lg bg-white p-6 shadow">
        <h1 className="text-xl font-bold text-gray-900">Create account</h1>
        <p className="mt-1 text-sm text-gray-600">Public signup always creates a USER account.</p>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700" htmlFor="firstName">First name</label>
            <input id="firstName" value={form.firstName} onChange={set('firstName')} autoComplete="given-name" className="mt-1 w-full rounded border border-gray-300 px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700" htmlFor="lastName">Last name</label>
            <input id="lastName" value={form.lastName} onChange={set('lastName')} autoComplete="family-name" className="mt-1 w-full rounded border border-gray-300 px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700" htmlFor="username">Username</label>
            <input id="username" value={form.username} onChange={set('username')} autoComplete="username" className="mt-1 w-full rounded border border-gray-300 px-3 py-2" placeholder="john123" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700" htmlFor="email">Email</label>
            <input id="email" type="email" value={form.email} onChange={set('email')} autoComplete="email" className="mt-1 w-full rounded border border-gray-300 px-3 py-2" placeholder="you@example.com" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700" htmlFor="mobile">Mobile</label>
            <input id="mobile" value={form.mobile} onChange={set('mobile')} autoComplete="tel" className="mt-1 w-full rounded border border-gray-300 px-3 py-2" placeholder="9876543210" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700" htmlFor="profilePic">Profile picture URL (optional)</label>
            <input id="profilePic" value={form.profilePic} onChange={set('profilePic')} inputMode="url" placeholder="https://example.com/profile.jpg" className="mt-1 w-full rounded border border-gray-300 px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700" htmlFor="password">Password</label>
            <input id="password" type="password" value={form.password} onChange={set('password')} autoComplete="new-password" className="mt-1 w-full rounded border border-gray-300 px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700" htmlFor="confirmPassword">Confirm password</label>
            <input id="confirmPassword" type="password" value={form.confirmPassword} onChange={set('confirmPassword')} autoComplete="new-password" className="mt-1 w-full rounded border border-gray-300 px-3 py-2" />
          </div>
        </div>
        {error && <p role="alert" className="mt-3 text-sm text-red-600">{error}</p>}
        <button type="submit" disabled={submitting} className="mt-4 w-full rounded bg-primary-600 px-4 py-2 font-semibold text-white hover:bg-primary-700 disabled:opacity-50">
          {submitting ? 'Creating account…' : 'Sign up'}
        </button>
        <p className="mt-3 text-sm text-gray-600">
          Already have an account? <Link to="/login" className="text-primary-600 hover:underline">Login</Link>
        </p>
      </form>
    </div>
  );
};

export default Signup;
