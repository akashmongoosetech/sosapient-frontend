import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import {
  ContentCard,
  PageHeader,
  PrimaryButton,
  SecondaryButton,
  AdminInput,
  FieldLabel,
  StatusBadge,
} from '../admin/ui';

function initials(firstName: string, lastName: string, username: string): string {
  const s = ((firstName || '').charAt(0) + (lastName || '').charAt(0)).toUpperCase();
  return s || (username || '?').slice(0, 2).toUpperCase();
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()) && value.trim().length <= 160;
}

function isValidMobile(value: string): boolean {
  const v = value.trim().replace(/[\s-]/g, '');
  return /^\+[1-9]\d{7,14}$/.test(v) || /^[6-9]\d{9}$/.test(v);
}

function isValidUrl(value: string): boolean {
  if (!value.trim()) return true;
  try {
    const u = new URL(value.trim());
    return u.protocol === 'https:' || u.protocol === 'http:';
  } catch {
    return false;
  }
}

interface ProfilePageProps {
  title: string;
  subtitle: string;
  showLogout?: boolean;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ title, subtitle, showLogout = false }) => {
  const { user, updateProfile, changePassword, logout } = useAuth();
  const [form, setForm] = useState(() => ({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    username: user?.username || '',
    email: user?.email || '',
    mobile: user?.mobile || '',
    profilePic: user?.profilePic || '',
  }));
  const [imgOk, setImgOk] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [pw, setPw] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [pwSaving, setPwSaving] = useState(false);
  const [pwFeedback, setPwFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  if (!user) return null;

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    if (key === 'profilePic') setImgOk(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);
    if (form.firstName.trim().length < 2 || form.firstName.trim().length > 50) {
      setFeedback({ type: 'error', message: 'First name is required (2-50 characters).' });
      return;
    }
    if (form.lastName.trim().length < 2 || form.lastName.trim().length > 50) {
      setFeedback({ type: 'error', message: 'Last name is required (2-50 characters).' });
      return;
    }
    if (!/^[a-z0-9_.]{3,30}$/.test(form.username.trim())) {
      setFeedback({ type: 'error', message: 'Username is required (3-30 chars: letters, numbers, dot, underscore).' });
      return;
    }
    if (!isValidEmail(form.email)) {
      setFeedback({ type: 'error', message: 'A valid email address is required.' });
      return;
    }
    if (!isValidMobile(form.mobile)) {
      setFeedback({ type: 'error', message: 'A valid mobile number is required.' });
      return;
    }
    if (!isValidUrl(form.profilePic)) {
      setFeedback({ type: 'error', message: 'Profile picture must be a valid http(s) URL.' });
      return;
    }
    setSaving(true);
    try {
      await updateProfile({
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        username: form.username.trim(),
        email: form.email.trim(),
        mobile: form.mobile.trim(),
        profilePic: form.profilePic.trim(),
      });
      setFeedback({ type: 'success', message: 'Profile updated successfully.' });
    } catch (err) {
      setFeedback({ type: 'error', message: err instanceof Error ? err.message : 'Profile update failed.' });
    } finally {
      setSaving(false);
    }
  };

  const handlePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwFeedback(null);
    if (!pw.currentPassword) {
      setPwFeedback({ type: 'error', message: 'Current password is required.' });
      return;
    }
    if (pw.newPassword.length < 8 || pw.newPassword.length > 128) {
      setPwFeedback({ type: 'error', message: 'New password must be at least 8 characters.' });
      return;
    }
    if (pw.newPassword !== pw.confirmPassword) {
      setPwFeedback({ type: 'error', message: 'New passwords do not match.' });
      return;
    }
    setPwSaving(true);
    try {
      await changePassword(pw);
      setPw({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setPwFeedback({ type: 'success', message: 'Password changed successfully.' });
    } catch (err) {
      setPwFeedback({ type: 'error', message: err instanceof Error ? err.message : 'Password change failed.' });
    } finally {
      setPwSaving(false);
    }
  };

  const banner = (fb: { type: 'success' | 'error'; message: string } | null, onDismiss: () => void) =>
    fb ? (
      <div
        role={fb.type === 'error' ? 'alert' : 'status'}
        className={`mb-4 flex items-start justify-between gap-3 rounded-xl border px-4 py-3 text-sm font-medium ${
          fb.type === 'success'
            ? 'border-green-200 bg-green-50 text-green-800 dark:border-green-900 dark:bg-green-900/20 dark:text-green-300'
            : 'border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-900/20 dark:text-red-300'
        }`}
      >
        <span>{fb.message}</span>
        <button type="button" onClick={onDismiss} aria-label="Dismiss notification" className="shrink-0 rounded-md px-1 font-bold hover:opacity-70">
          ×
        </button>
      </div>
    ) : null;

  const picPreview =
    form.profilePic.trim() !== '' && imgOk ? (
      <img
        src={form.profilePic.trim()}
        alt={`${form.firstName} ${form.lastName}`}
        onError={() => setImgOk(false)}
        className="h-16 w-16 rounded-full object-cover"
      />
    ) : (
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-100 text-xl font-bold text-primary-700 dark:bg-primary-800 dark:text-primary-300" aria-hidden="true">
        {initials(form.firstName, form.lastName, form.username)}
      </span>
    );

  return (
    <div>
      <PageHeader title={title} subtitle={subtitle} />
      <ContentCard className="max-w-2xl p-6">
        <div className="flex items-center gap-4">
          {picPreview}
          <div className="min-w-0">
            <h2 className="truncate text-lg font-bold text-gray-900 dark:text-white">
              {user.firstName} {user.lastName}
            </h2>
            <p className="truncate text-sm text-gray-500 dark:text-gray-400">@{user.username}</p>
            <div className="mt-1">
              <StatusBadge label={user.role} tone={user.role === 'ADMIN' ? 'purple' : 'gray'} />
            </div>
          </div>
        </div>

        <form onSubmit={handleSave} noValidate className="mt-6">
          {banner(feedback, () => setFeedback(null))}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <FieldLabel htmlFor="profile-firstName">First Name</FieldLabel>
              <AdminInput id="profile-firstName" value={form.firstName} onChange={set('firstName')} required maxLength={50} autoComplete="given-name" />
            </div>
            <div>
              <FieldLabel htmlFor="profile-lastName">Last Name</FieldLabel>
              <AdminInput id="profile-lastName" value={form.lastName} onChange={set('lastName')} required maxLength={50} autoComplete="family-name" />
            </div>
            <div>
              <FieldLabel htmlFor="profile-username">Username</FieldLabel>
              <AdminInput id="profile-username" value={form.username} onChange={set('username')} required maxLength={30} autoComplete="username" />
            </div>
            <div>
              <FieldLabel htmlFor="profile-email">Email</FieldLabel>
              <AdminInput id="profile-email" type="email" value={form.email} onChange={set('email')} required maxLength={160} autoComplete="email" />
            </div>
            <div>
              <FieldLabel htmlFor="profile-mobile">Mobile</FieldLabel>
              <AdminInput id="profile-mobile" value={form.mobile} onChange={set('mobile')} required maxLength={20} inputMode="tel" autoComplete="tel" />
            </div>
            <div>
              <FieldLabel htmlFor="profile-pic">Profile Picture URL</FieldLabel>
              <AdminInput id="profile-pic" value={form.profilePic} onChange={set('profilePic')} inputMode="url" maxLength={2000} placeholder="https://…" />
            </div>
          </div>
          <div className="mt-5">
            <PrimaryButton type="submit" disabled={saving}>
              {saving ? 'Saving…' : 'Save Changes'}
            </PrimaryButton>
          </div>
        </form>
      </ContentCard>

      <ContentCard className="mt-6 max-w-2xl p-6">
        <h3 className="text-base font-bold text-gray-900 dark:text-white">Change Password</h3>
        <form onSubmit={handlePassword} noValidate className="mt-4">
          {banner(pwFeedback, () => setPwFeedback(null))}
          <div className="grid grid-cols-1 gap-4">
            <div>
              <FieldLabel htmlFor="pw-current">Current Password</FieldLabel>
              <AdminInput id="pw-current" type="password" value={pw.currentPassword} onChange={(e) => setPw((p) => ({ ...p, currentPassword: e.target.value }))} required autoComplete="current-password" />
            </div>
            <div>
              <FieldLabel htmlFor="pw-new">New Password</FieldLabel>
              <AdminInput id="pw-new" type="password" value={pw.newPassword} onChange={(e) => setPw((p) => ({ ...p, newPassword: e.target.value }))} required autoComplete="new-password" />
            </div>
            <div>
              <FieldLabel htmlFor="pw-confirm">Confirm New Password</FieldLabel>
              <AdminInput id="pw-confirm" type="password" value={pw.confirmPassword} onChange={(e) => setPw((p) => ({ ...p, confirmPassword: e.target.value }))} required autoComplete="new-password" />
            </div>
          </div>
          <div className="mt-5">
            <PrimaryButton type="submit" disabled={pwSaving}>
              {pwSaving ? 'Changing…' : 'Change Password'}
            </PrimaryButton>
          </div>
        </form>
      </ContentCard>

      {showLogout && (
        <div className="mt-6 max-w-2xl">
          <SecondaryButton
            type="button"
            onClick={() => void logout()}
          >
            Logout
          </SecondaryButton>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
