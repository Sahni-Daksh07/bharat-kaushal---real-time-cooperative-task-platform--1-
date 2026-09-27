import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://gndkbtssabnmknkendpz.supabase.co';
const anonKey = process.env.VITE_SUPABASE_ANON_KEY || '';

const client = createClient(supabaseUrl, anonKey);

async function main() {
  console.log('Testing client sign-in to Supabase with citizen@bharatkaushal.gov.in...');
  const { data, error } = await client.auth.signInWithPassword({
    email: 'citizen@bharatkaushal.gov.in',
    password: 'BharatKaushal@123',
  });

  if (error) {
    console.error('Sign-in error:', error.message);
  } else {
    console.log('✓ Successfully signed in to Supabase Auth!');
    console.log('Session User ID:', data.user.id);
    console.log('User Role from app_metadata:', data.user.app_metadata.role);
    console.log('Access Token acquired (length):', data.session.access_token.length);
  }
}

main().catch(console.error);
