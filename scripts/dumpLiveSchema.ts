import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const supabase = createClient(process.env.VITE_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

async function main() {
  const tables = [
    'societies',
    'services',
    'workers',
    'customers',
    'society_admins',
    'federation_admins',
    'super_admins',
    'bookings',
    'financial_ledger',
    'welfare_records',
    'cooperative_policy',
  ];

  for (const t of tables) {
    const { data, error } = await supabase.from(t).select('*').limit(1);
    if (error) {
      console.log(`Table ${t}: Error ->`, error.message);
    } else {
      console.log(`Table ${t}: Columns ->`, data && data[0] ? Object.keys(data[0]) : '(empty)');
    }
  }
}

main().catch(console.error);
