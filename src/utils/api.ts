import { getStoredToken } from '../contexts/AuthContext';

export function getBaseUrl(): string {
  return import.meta.env.VITE_BASE_URL || '';
}

export function getToken(): string {
  try {
    return localStorage.getItem('sosapient_token') || '';
  } catch {
    return '';
  }
}

// Legacy helper retained for migration only. New code must use Bearer JWT via authFetch.
export function getAdminKey(): string {
  try {
    return sessionStorage.getItem('sosapient_admin_key') || '';
  } catch {
    return '';
  }
}

export function getAuthHeaders(extra: Record<string, string> = {}): Record<string, string> {
  const token = getStoredToken() || getToken();
  return token ? { Authorization: `Bearer ${token}`, ...extra } : { ...extra };
}

// Legacy alias: previously injected X-Admin-Key. Now injects the user JWT.
export function getAdminHeaders(extra: Record<string, string> = {}): Record<string, string> {
  return getAuthHeaders(extra);
}

export function authFetch(input: RequestInfo | URL, init: RequestInit = {}): Promise<Response> {
  const headers = new Headers(init.headers || {});
  const token = getStoredToken() || getToken();
  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  return fetch(input, { ...init, headers });
}
