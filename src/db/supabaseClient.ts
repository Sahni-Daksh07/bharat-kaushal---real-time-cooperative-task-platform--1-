import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Safe environment variable resolution across Vite (browser/SSR) and Node.js
const getEnvVar = (key: string): string => {
  if (typeof process !== 'undefined' && process.env && process.env[key]) {
    return process.env[key] as string;
  }
  try {
    if (typeof import.meta !== 'undefined' && import.meta.env && (import.meta.env as any)[key]) {
      return (import.meta.env as any)[key] as string;
    }
  } catch {}
  return '';
};

const supabaseUrl = getEnvVar('VITE_SUPABASE_URL') || 'https://gndkbtssabnmknkendpz.supabase.co';
const supabaseAnonKey = getEnvVar('VITE_SUPABASE_ANON_KEY') || '';
const supabaseServiceKey = getEnvVar('SUPABASE_SERVICE_ROLE_KEY') || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && (supabaseAnonKey || supabaseServiceKey));

// Public client for browser / RLS-scoped operations
export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey || supabaseServiceKey)
  : null;

// Privileged admin client for backend operations
export const supabaseAdmin: SupabaseClient | null =
  isSupabaseConfigured && supabaseServiceKey
    ? createClient(supabaseUrl, supabaseServiceKey)
    : supabase;

export const SUPABASE_PROJECT_REF = 'gndkbtssabnmknkendpz';
