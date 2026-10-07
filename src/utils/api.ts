import { getStoredToken } from '../contexts/AuthContext';

export function getBaseUrl(): string {
  const base = import.meta.env.VITE_BASE_URL || '';
  if (!base && import.meta.env.PROD) {
    console.error('FATAL: VITE_BASE_URL is not set. API calls will fail. Set it in the hosting env.');
  }
  return base;
}

export function requireBaseUrl(): string {
  const base = getBaseUrl();
  if (!base && import.meta.env.PROD) {
    throw new Error('VITE_BASE_URL is not configured');
  }
  return base;
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
  return fetch(input, { ...init, headers }).then((res) => {
    // Central 401 handling: clear invalid session once, redirect to login (except auth pages)
    if (res.status === 401) {
      try {
        const url = typeof input === 'string' ? input : input instanceof URL ? input.pathname : '';
        const onAuthPage =
          window.location.pathname === '/login' || window.location.pathname === '/signup';
        if (!onAuthPage && url.includes('/api/auth/me')) {
          localStorage.removeItem('sosapient_token');
          localStorage.removeItem('sosapient_user');
        }
      } catch {
        /* ignore storage errors */
      }
    }
    return res;
  });
}
