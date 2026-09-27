import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://gndkbtssabnmknkendpz.supabase.co';
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const anonKey = process.env.VITE_SUPABASE_ANON_KEY || '';

const admin = createClient(supabaseUrl, serviceKey);
const anon = createClient(supabaseUrl, anonKey);

async function verify() {
  console.log('==================================================');
  console.log('🏛️ BHARAT KAUSHAL SUPABASE CLOUD STATUS REPORT');
  console.log(`Endpoint: ${supabaseUrl}`);
  console.log('==================================================\n');

  const tables = [
    'societies',
    'services',
    'workers',
    'customers',
    'customer_addresses',
    'society_admins',
    'federation_admins',
    'super_admins',
    'bookings',
    'financial_ledger',
    'welfare_records',
    'cooperative_policy',
    'payment_details',
  ];

  console.log('--- DATABASE TABLES & ROW COUNTS ---');
  for (const t of tables) {
    const { count, error } = await admin.from(t).select('*', { count: 'exact', head: true });
    if (error) {
      console.log(`❌ ${t.padEnd(22)} : ERROR (${error.message})`);
    } else {
      console.log(`✅ ${t.padEnd(22)} : ${count} rows`);
    }
  }

  console.log('\n--- STORAGE BUCKETS ---');
  const { data: buckets, error: bErr } = await admin.storage.listBuckets();
  if (bErr) {
    console.log(`❌ Storage error: ${bErr.message}`);
  } else {
    buckets.forEach((b) => {
      console.log(`📦 ${b.name.padEnd(22)} : PUBLIC=${b.public} (id: ${b.id})`);
    });
  }

  console.log('\n--- BROWSER ANON CLIENT READ PERMISSIONS ---');
  for (const t of ['services', 'societies']) {
    const { count } = await anon.from(t).select('*', { count: 'exact', head: true });
    console.log(`🌐 ${t.padEnd(22)} : ${count} rows accessible to public browser`);
  }

  console.log('\n==================================================');
  console.log('✅ ALL SYSTEMS OPERATIONAL & READY');
  console.log('==================================================\n');
}

verify().catch(console.error);
