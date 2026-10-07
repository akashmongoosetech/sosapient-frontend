import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

export interface AuthUser {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  mobile: string;
  profilePic: string;
  role: 'USER' | 'ADMIN';
}

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loading: boolean;
  login: (identifier: string, password: string) => Promise<AuthUser>;
  signup: (payload: SignupPayload) => Promise<AuthUser>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
  updateProfile: (payload: ProfileUpdatePayload) => Promise<AuthUser>;
  changePassword: (payload: PasswordChangePayload) => Promise<void>;
}

export interface SignupPayload {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  mobile: string;
  profilePic?: string;
  password: string;
  confirmPassword: string;
}

export interface ProfileUpdatePayload {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  mobile: string;
  profilePic: string;
}

export interface PasswordChangePayload {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = 'sosapient_token';
const REFRESH_KEY = 'sosapient_refresh_token';
const USER_KEY = 'sosapient_user';

function baseUrl(): string {
  const base = import.meta.env.VITE_BASE_URL || '';
  if (!base && import.meta.env.PROD) {
    console.error('FATAL: VITE_BASE_URL is not set. Set it in the hosting env.');
  }
  return base;
}

function readToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

function readRefresh(): string | null {
  try {
    return localStorage.getItem(REFRESH_KEY);
  } catch {
    return null;
  }
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const raw = localStorage.getItem(USER_KEY);
      return raw ? (JSON.parse(raw) as AuthUser) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState<string | null>(() => readToken());
  const [loading, setLoading] = useState(true);

  const persist = useCallback((nextToken: string | null, nextUser: AuthUser | null, nextRefresh?: string | null) => {
    setToken(nextToken);
    setUser(nextUser);
    try {
      if (nextToken) localStorage.setItem(TOKEN_KEY, nextToken);
      else localStorage.removeItem(TOKEN_KEY);
      if (nextRefresh !== undefined) {
        if (nextRefresh) localStorage.setItem(REFRESH_KEY, nextRefresh);
        else localStorage.removeItem(REFRESH_KEY);
      }
      if (nextUser) localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
      else localStorage.removeItem(USER_KEY);
    } catch {
      // storage unavailable; keep in-memory state only
    }
  }, []);

  const tryRefreshTokens = useCallback(async (): Promise<boolean> => {
    const rt = readRefresh();
    if (!rt) return false;
    try {
      const res = await fetch(`${baseUrl()}/api/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken: rt })
      });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.token || !data?.user) return false;
      persist(data.token as string, data.user as AuthUser, (data.refreshToken as string) || null);
      return true;
    } catch {
      return false;
    }
  }, [persist]);

  const refresh = useCallback(async () => {
    const t = readToken();
    if (!t) {
      persist(null, null);
      setLoading(false);
      return;
    }
    // Cached session is usable immediately; revalidate in background.
    setLoading(false);
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    try {
      const res = await fetch(`${baseUrl()}/api/auth/me`, {
        headers: { Authorization: `Bearer ${t}` },
        signal: controller.signal
      });
      if (res.status === 401) {
        // Access expired → try rotating refresh once before wiping session
        const ok = await tryRefreshTokens();
        if (!ok) persist(null, null, null);
      } else if (!res.ok) {
        persist(null, null, null);
      } else {
        const data = await res.json();
        if (data?.user) persist(t, data.user as AuthUser);
        else persist(null, null, null);
      }
    } catch {
      // Keep cached session on network timeout; next navigation revalidates.
    } finally {
      clearTimeout(timeout);
    }
  }, [persist, tryRefreshTokens]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const login = useCallback(async (identifier: string, password: string) => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    try {
      const res = await fetch(`${baseUrl()}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password }),
        signal: controller.signal
      });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.token || !data?.user) {
        throw new Error(data?.message || 'Invalid credentials');
      }
      persist(data.token as string, data.user as AuthUser, (data.refreshToken as string) || null);
      return data.user as AuthUser;
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        throw new Error('Request timed out. Please check your connection and try again.');
      }
      throw err;
    } finally {
      clearTimeout(timeout);
    }
  }, [persist]);

  const signup = useCallback(async (payload: SignupPayload) => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    try {
      const res = await fetch(`${baseUrl()}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal
      });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.token || !data?.user) {
        throw new Error(data?.message || 'Signup failed');
      }
      persist(data.token as string, data.user as AuthUser, (data.refreshToken as string) || null);
      return data.user as AuthUser;
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        throw new Error('Request timed out. Please check your connection and try again.');
      }
      throw err;
    } finally {
      clearTimeout(timeout);
    }
  }, [persist]);

  const updateProfile = useCallback(async (payload: ProfileUpdatePayload) => {
    const t = readToken();
    if (!t) throw new Error('You are not logged in.');
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    try {
      const res = await fetch(`${baseUrl()}/api/auth/me`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${t}` },
        body: JSON.stringify(payload),
        signal: controller.signal
      });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.user) {
        throw new Error(data?.message || 'Profile update failed');
      }
      persist(t, data.user as AuthUser);
      return data.user as AuthUser;
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        throw new Error('Request timed out. Please check your connection and try again.');
      }
      throw err;
    } finally {
      clearTimeout(timeout);
    }
  }, [persist]);

  const changePassword = useCallback(async (payload: PasswordChangePayload) => {
    const t = readToken();
    if (!t) throw new Error('You are not logged in.');
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    try {
      const res = await fetch(`${baseUrl()}/api/auth/password`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${t}` },
        body: JSON.stringify(payload),
        signal: controller.signal
      });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.success) {
        throw new Error(data?.message || 'Password change failed');
      }
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        throw new Error('Request timed out. Please check your connection and try again.');
      }
      throw err;
    } finally {
      clearTimeout(timeout);
    }
  }, []);

  const logout = useCallback(async () => {
    // Optimistic: clear state first so UI responds instantly.
    const t = readToken();
    const rt = readRefresh();
    persist(null, null, null);
    try {
      sessionStorage.removeItem('sosapient_admin_key');
    } catch {
      // ignore
    }
    try {
      if (t) {
        await fetch(`${baseUrl()}/api/auth/logout`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${t}` },
          body: JSON.stringify({ refreshToken: rt })
        });
      }
    } catch {
      // best-effort only
    }
  }, [persist]);

  const value = useMemo<AuthContextType>(() => ({
    user,
    token,
    isAuthenticated: Boolean(token && user),
    isAdmin: user?.role === 'ADMIN',
    loading,
    login,
    signup,
    logout,
    refresh,
    updateProfile,
    changePassword
  }), [user, token, loading, login, signup, logout, refresh, updateProfile, changePassword]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export function getStoredToken(): string | null {
  return readToken();
}
