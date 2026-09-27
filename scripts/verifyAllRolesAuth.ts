import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://gndkbtssabnmknkendpz.supabase.co';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const accounts = [
  { role: 'CUSTOMER', email: 'citizen@bharatkaushal.gov.in', password: 'BharatKaushal@123' },
  { role: 'WORKER', email: 'artisan@bharatkaushal.gov.in', password: 'BharatKaushal@123' },
  { role: 'SOCIETY_ADMIN', email: 'society@bharatkaushal.gov.in', password: 'BharatKaushal@123' },
  { role: 'FEDERATION_ADMIN', email: 'federation@bharatkaushal.gov.in', password: 'BharatKaushal@123' },
  { role: 'SUPER_ADMIN', email: 'superadmin@bharatkaushal.gov.in', password: 'BharatKaushal@123' },
];

async function testAll() {
  console.log(`Connecting to: ${supabaseUrl}`);
  for (const acc of accounts) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: acc.email,
      password: acc.password,
    });
    if (error) {
      console.error(`❌ Failed ${acc.role} (${acc.email}):`, error.message);
    } else {
      console.log(`✓ Verified ${acc.role} (${acc.email}) -> UID: ${data.user?.id}, Session Token Length: ${data.session?.access_token.length}`);
    }
  }
}

testAll();
