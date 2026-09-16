/**
 * API and WebSocket URL configuration for Bharat Kaushal.
 *
 * Supports decoupled deployment where the frontend is hosted on Vercel
 * and the backend Express + WebSocket server is hosted on Render, Railway,
 * or another persistent host.
 *
 * - In production on Vercel: Set VITE_API_BASE_URL (e.g. https://bharat-kaushal.onrender.com).
 *   The WebSocket URL is derived automatically (wss://bharat-kaushal.onrender.com/ws)
 *   unless explicitly overridden via VITE_WS_URL.
 * - In local development: Defaults to empty base URL (relative paths) and current host WebSocket.
 */

export function getApiBaseUrl(): string {
  const envUrl = (import.meta as any).env?.VITE_API_BASE_URL;
  if (envUrl && typeof envUrl === 'string' && envUrl.trim().length > 0) {
    return envUrl.trim().replace(/\/+$/, '');
  }
  return '';
}

export function getApiUrl(path: string): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  const base = getApiBaseUrl();
  return base ? `${base}${cleanPath}` : cleanPath;
}

export function getWsUrl(): string {
  const explicitWs = (import.meta as any).env?.VITE_WS_URL;
  if (explicitWs && typeof explicitWs === 'string' && explicitWs.trim().length > 0) {
    return explicitWs.trim();
  }

  const apiBase = getApiBaseUrl();
  if (apiBase) {
    const wsBase = apiBase.replace(/^http:/i, 'ws:').replace(/^https:/i, 'wss:');
    return `${wsBase}/ws`;
  }

  // Fallback to same-origin window location
  if (typeof window !== 'undefined' && window.location) {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    return `${protocol}//${window.location.host}/ws`;
  }

  return 'ws://localhost:3001/ws';
}

/**
 * Transparent fetch wrapper that routes relative /api/* requests
 * through getApiUrl() when VITE_API_BASE_URL is configured.
 */
export function apiFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  if (typeof input === 'string' && input.startsWith('/api/')) {
    return fetch(getApiUrl(input), init);
  }
  return fetch(input, init);
}
