import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const supabase = createClient(process.env.VITE_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

async function main() {
  // Let's call rpc or inspect
  const { data, error } = await supabase.rpc('version');
  if (error) {
    console.log('RPC version error:', error.message);
  } else {
    console.log('Postgres version:', data);
  }
}

main().catch(console.error);
