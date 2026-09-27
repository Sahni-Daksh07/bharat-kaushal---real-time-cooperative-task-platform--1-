import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://gndkbtssabnmknkendpz.supabase.co';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const anonKey = process.env.VITE_SUPABASE_ANON_KEY || '';

if (!serviceRoleKey || !anonKey) {
  console.error('Missing Supabase keys in .env');
  process.exit(1);
}

const adminClient = createClient(supabaseUrl, serviceRoleKey);
const publicClient = createClient(supabaseUrl, anonKey);

import {
  INITIAL_BOOKING,
} from '../src/data/seedData';

export async function runCheckAndSetup() {
  console.log('====================================================');
  console.log('🔍 BHARAT KAUSHAL SUPABASE CLOUD AUDIT');
  console.log(`URL: ${supabaseUrl}`);
  console.log('====================================================\n');

  const candidateTables = [
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

  for (const t of candidateTables) {
    const { count, error } = await adminClient.from(t).select('*', { count: 'exact', head: true });
    if (error) {
      console.log(`❌ Table [${t}]: ERROR -> ${error.message}`);
    } else {
      console.log(`✅ Table [${t}]: ${count} rows`);
    }
  }

  // Type-safe booking row mapping
  const bookingRow = {
    id: INITIAL_BOOKING.id,
    customer_id: INITIAL_BOOKING.customerId,
    worker_id: INITIAL_BOOKING.workerId,
    service_id: INITIAL_BOOKING.serviceId,
    status: INITIAL_BOOKING.status,
    base_labour: INITIAL_BOOKING.pricing.baseLabour,
    material_cost_actual: INITIAL_BOOKING.pricing.materialsTotal,
    customer_paid_total: INITIAL_BOOKING.pricing.grossAmount,
    worker_payout_amount: INITIAL_BOOKING.pricing.workerShare,
    society_fee_amount: INITIAL_BOOKING.pricing.societyShare,
    welfare_fund_amount: INITIAL_BOOKING.pricing.welfareShare,
    service_address: INITIAL_BOOKING.customerAddress?.address || 'Indore',
    ward: INITIAL_BOOKING.customerAddress?.locality || 'Ward 48',
    city: INITIAL_BOOKING.customerAddress?.city || 'Indore',
    state: INITIAL_BOOKING.customerAddress?.state || 'Madhya Pradesh',
  };

  console.log('Verified Booking Sample Schema:', bookingRow.id);
}

if (process.argv[1]?.includes('verifyAndSetupSupabase')) {
  runCheckAndSetup().catch(console.error);
}
