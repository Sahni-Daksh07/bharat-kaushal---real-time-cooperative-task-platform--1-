import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://gndkbtssabnmknkendpz.supabase.co';
const anonKey = process.env.VITE_SUPABASE_ANON_KEY || '';

const anon = createClient(supabaseUrl, anonKey);

async function checkAnonAccess() {
  console.log('====================================================');
  console.log('🌐 TESTING PUBLIC / ANON READ PERMISSIONS');
  console.log(`Endpoint: ${supabaseUrl}`);
  console.log('====================================================\n');

  const tables = [
    'services',
    'societies',
    'workers',
    'cooperative_policy',
    'financial_ledger',
    'welfare_records',
  ];

  let allPassed = true;

  for (const t of tables) {
    const { data, count, error } = await anon.from(t).select('*', { count: 'exact' }).limit(2);
    if (error) {
      console.log(`❌ Table [${t}]: FAILED -> ${error.message} (${error.code})`);
      allPassed = false;
    } else {
      console.log(`✅ Table [${t}]: SUCCESS -> ${count} rows accessible! (Sample retrieved: ${data?.length})`);
    }
  }

  console.log('\n====================================================');
  if (allPassed) {
    console.log('🎉 PERFECT! All RLS policies are active and verified!');
  } else {
    console.log('⚠️ Some tables still have restrictions.');
  }
  console.log('====================================================\n');
}

checkAnonAccess().catch(console.error);
