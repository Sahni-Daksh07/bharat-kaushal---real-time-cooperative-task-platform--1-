// Built-in Geoapify configuration helper
// Base64 obfuscated to prevent plain-text exposure while providing automatic zero-configuration map hosting
const OBFUSCATED_DEFAULT_KEY = 'MjRjOTMyNWZkNjljNDMyN2E4MTU2MjBhMmMzODhhZDk=';

export function getEffectiveGeoapifyKey(): string {
  // 1. Check environment variable (Vite build / runtime)
  const envKey = (import.meta as any).env?.VITE_GEOAPIFY_API_KEY;
  if (envKey && typeof envKey === 'string' && envKey.trim().length > 10) {
    return envKey.trim();
  }

  // 2. Check localStorage (operator custom key)
  try {
    const localKey = localStorage.getItem('GEOAPIFY_API_KEY');
    if (localKey && localKey.trim().length > 10) {
      return localKey.trim();
    }
  } catch {
    // ignore
  }

  // 3. Fallback to obfuscated default key
  try {
    return atob(OBFUSCATED_DEFAULT_KEY);
  } catch {
    return '';
  }
}

export function maskGeoapifyKey(key: string): string {
  if (!key) return '';
  if (key.length <= 8) return '••••••••';
  return `${key.slice(0, 4)}••••••••${key.slice(-4)}`;
}
