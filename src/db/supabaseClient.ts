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

const DEFAULT_URL = 'https://gndkbtssabnmknkendpz.supabase.co';
const DEFAULT_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImduZGtidHNzYWJubWtua2VuZHB6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA0NTAxMTUsImV4cCI6MjEwNjAyNjExNX0.TutqocxKJ5Kk0P8lXGDl0NUjUy_nxuizShIK29T18L4';

const supabaseUrl = getEnvVar('VITE_SUPABASE_URL') || DEFAULT_URL;
const supabaseAnonKey = getEnvVar('VITE_SUPABASE_ANON_KEY') || DEFAULT_ANON;
const supabaseServiceKey = getEnvVar('SUPABASE_SERVICE_ROLE_KEY') || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && (supabaseAnonKey || supabaseServiceKey));

// Public client for browser / RLS-scoped operations
export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey || supabaseServiceKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;

// Privileged admin client for backend operations
export const supabaseAdmin: SupabaseClient | null =
  isSupabaseConfigured && supabaseServiceKey
    ? createClient(supabaseUrl, supabaseServiceKey)
    : supabase;

export const SUPABASE_PROJECT_REF = 'gndkbtssabnmknkendpz';

// Pre-provisioned live Supabase Auth demo credentials
export const SUPABASE_DEMO_ACCOUNTS = {
  CUSTOMER: {
    email: 'citizen@bharatkaushal.gov.in',
    phone: '+919826011111',
    password: 'BharatKaushal@123',
    name: 'Priya Sharma',
    role: 'CUSTOMER',
  },
  WORKER: {
    email: 'artisan@bharatkaushal.gov.in',
    phone: '+919826022222',
    password: 'BharatKaushal@123',
    name: 'Ramesh Kumar',
    role: 'WORKER',
  },
  SOCIETY_ADMIN: {
    email: 'society@bharatkaushal.gov.in',
    phone: '+919826033333',
    password: 'BharatKaushal@123',
    name: 'Rekha Malviya',
    role: 'SOCIETY_ADMIN',
  },
  FEDERATION_ADMIN: {
    email: 'federation@bharatkaushal.gov.in',
    phone: '+919826044444',
    password: 'BharatKaushal@123',
    name: 'Dr. Anand Verma',
    role: 'FEDERATION_ADMIN',
  },
  SUPER_ADMIN: {
    email: 'superadmin@bharatkaushal.gov.in',
    phone: '+919826055555',
    password: 'BharatKaushal@123',
    name: 'Dr. A. Mohan IAS',
    role: 'SUPER_ADMIN',
  },
} as const;

/**
 * Sign in to live Supabase Auth with email or demo role credentials
 */
export async function signInSupabaseUser(emailOrRole: string, password?: string) {
  if (!supabase) return { success: false, error: 'Supabase client is not configured' };
  
  let targetEmail = emailOrRole;
  let targetPassword = password || 'BharatKaushal@123';

  // Check if role name was provided
  const upper = emailOrRole.toUpperCase() as keyof typeof SUPABASE_DEMO_ACCOUNTS;
  if (SUPABASE_DEMO_ACCOUNTS[upper]) {
    targetEmail = SUPABASE_DEMO_ACCOUNTS[upper].email;
    targetPassword = password || SUPABASE_DEMO_ACCOUNTS[upper].password;
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email: targetEmail,
    password: targetPassword,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, user: data.user, session: data.session };
}
