import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://gndkbtssabnmknkendpz.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseKey) {
  console.error('Missing Supabase key in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

import { INDORE_SERVICES_DATASET } from '../src/data/servicesData';
import {
  SEEDED_SOCIETIES,
  SEEDED_WORKERS,
  SEEDED_CUSTOMERS,
  SEEDED_SOCIETY_ADMINS,
  SEEDED_FEDERATION_ADMINS,
  SEEDED_SUPER_ADMINS,
} from '../src/data/seedData';

async function seed() {
  console.log(`\nConnecting to Supabase at: ${supabaseUrl}`);
  console.log(`Starting comprehensive cloud database seeding...\n`);

  // 1. Seed Societies
  console.log(`1. Seeding ${SEEDED_SOCIETIES.length} Cooperative Societies...`);
  const mappedSocieties = SEEDED_SOCIETIES.map((s) => ({
    id: s.id,
    name: s.name,
    code: s.code,
    city: s.city || 'Indore',
    district: s.district || 'Indore',
    state: s.state || 'Madhya Pradesh',
    federation_id: (s as any).federation_id || null,
  }));
  const { error: socErr } = await supabase.from('societies').upsert(mappedSocieties);
  if (socErr) console.error('Error inserting societies:', socErr);
  else console.log(`✓ Inserted/Updated ${mappedSocieties.length} societies.`);

  // 2. Seed Services (146 Standardized Tariffs)
  console.log(`2. Seeding ${INDORE_SERVICES_DATASET.length} Standardized Indore Services...`);
  const mappedServices = INDORE_SERVICES_DATASET.map((s) => {
    let pricing_model = 'PER_JOB';
    const unit = (s.pricing_unit || '').toLowerCase();
    if (unit.includes('day')) pricing_model = 'PER_DAY_PER_WORKER';
    else if (unit.includes('worker')) pricing_model = 'PER_WORKER';
    else if (unit.includes('sqft') || unit.includes('sq')) pricing_model = 'PER_SQFT';
    else if (unit.includes('unit') || unit.includes('point')) pricing_model = 'PER_UNIT';

    return {
      record_id: s.record_id,
      city: s.city || 'Indore',
      state: s.state || 'Madhya Pradesh',
      currency: s.currency || 'INR',
      category: s.category,
      service_name: s.service_name,
      pricing_unit: s.pricing_unit,
      min_price_inr: s.min_price_inr,
      max_price_inr: s.max_price_inr || s.min_price_inr,
      suggested_display_price_inr: s.suggested_display_price_inr || s.min_price_inr,
      price_type: (s.price_type || 'Indicative').slice(0, 20),
      materials_or_parts_included: s.materials_or_parts_included === 'Yes' || (s.materials_or_parts_included as any) === true,
      notes: s.notes || '',
      estimated_duration_hours: (s as any).estimated_duration_hours || 1.0,
      worker_requirement_type: 'SINGLE_WORKER',
      pricing_model: pricing_model,
      minimum_workers: 1,
      recommended_workers: 1,
    };
  });

  for (let i = 0; i < mappedServices.length; i += 50) {
    const chunk = mappedServices.slice(i, i + 50);
    const { error: srvErr } = await supabase.from('services').upsert(chunk);
    if (srvErr) console.error(`Error inserting services chunk:`, srvErr);
  }
  console.log(`✓ Inserted/Updated ${mappedServices.length} standardized services.`);

  // 3. Seed Workers
  console.log(`3. Seeding ${SEEDED_WORKERS.length} Certified Member Artisans...`);
  const mappedWorkers = SEEDED_WORKERS.map((w) => ({
    id: w.id,
    name: w.name,
    phone: w.phone,
    alternate_phone: (w as any).alternatePhone || null,
    email: w.email || null,
    email_verified: (w as any).emailVerified || false,
    photo_url: (w as any).photoUrl || null,
    gender: (w as any).gender || 'MALE',
    dob: (w as any).dob || '1990-01-01',
    address: (w as any).address || '',
    city: (w as any).city || 'Indore',
    district: (w as any).district || 'Indore',
    state: (w as any).state || 'Madhya Pradesh',
    pin_code: (w as any).pinCode || '452001',
    society_id: (w as any).societyId || 'SOC-IND-02',
    primary_trade: (w as any).primaryTrade || 'General',
    skill_assessment_score: (w as any).skillAssessmentScore || 85,
    skill_level: (w as any).skillLevel || 'LEVEL_3',
    verification_status: (w as any).verificationStatus || 'VERIFIED',
    rejection_reason: (w as any).rejectionReason || null,
    availability: (w as any).availability === 'AVAILABLE' || (w as any).availability === true || (w as any).isAvailable === true,
    rating: (w as any).rating || 4.9,
    total_ratings_count: (w as any).totalRatingsCount || 10,
    completed_jobs: (w as any).completedJobs || 12,
    failed_jobs: (w as any).failedJobs || 0,
    consecutive_failures: (w as any).consecutiveFailures || 0,
    penalty_status: (w as any).penaltyStatus || 'CLEAR',
    earnings_today: (w as any).earningsToday || 0,
    earnings_week: (w as any).earningsWeek || 0,
    earnings_month: (w as any).earningsMonth || 0,
    earnings_total: (w as any).earningsTotal || 0,
    trust_score: (w as any).trustScore || 90,
    reliability_score: (w as any).reliabilityScore || 95,
    current_lat: (w as any).currentLat || 22.7196,
    current_lng: (w as any).currentLng || 75.8577,
    masked_aadhaar: (w as any).maskedAadhaar || 'XXXX-XXXX-1234',
    masked_pan: (w as any).maskedPan || null,
    welfare_balance: (w as any).welfareBalance || 250,
    uan_number: (w as any).uanNumber || null,
    upi_id: (w as any).upiId || 'worker@upi',
    bank_account: (w as any).bankAccount || 'XXXX1234',
    ifsc: (w as any).ifsc || 'SBIN0001234',
    preferred_language: (w as any).preferredLanguage || 'hi',
  }));
  const { error: wrkErr } = await supabase.from('workers').upsert(mappedWorkers);
  if (wrkErr) console.error('Error inserting workers:', wrkErr);
  else console.log(`✓ Inserted/Updated ${mappedWorkers.length} certified artisans.`);

  // 4. Seed Customers
  console.log(`4. Seeding ${SEEDED_CUSTOMERS.length} Resident Citizen Profiles...`);
  const mappedCustomers = SEEDED_CUSTOMERS.map((c) => ({
    id: c.id,
    name: c.name,
    phone: c.phone,
    email: c.email || null,
    email_verified: (c as any).emailVerified || false,
    email_verified_at: (c as any).emailVerifiedAt || null,
    photo_url: (c as any).photoUrl || null,
    citizen_aadhaar_masked: (c as any).citizenAadhaarMasked || null,
    consecutive_cancellations: (c as any).consecutiveCancellations || 0,
    penalty_status: (c as any).penaltyStatus || 'CLEAR',
  }));
  const { error: custErr } = await supabase.from('customers').upsert(mappedCustomers);
  if (custErr) console.error('Error inserting customers:', custErr);
  else console.log(`✓ Inserted/Updated ${mappedCustomers.length} citizen profiles.`);

  // 5. Seed Customer Addresses
  console.log(`5. Seeding Customer Addresses...`);
  const mappedAddresses = mappedCustomers.map((c, i) => ({
    id: `ADDR-CUST-00${i + 1}`,
    customer_id: c.id,
    label: i === 0 ? 'Home' : 'Office',
    address: 'Flat 402, Royal Palms, AB Road, Indore, MP 452010',
    line1: 'Flat 402, Royal Palms',
    locality: 'AB Road, Vijay Nagar',
    landmark: 'Opposite C21 Mall',
    lat: 22.7485,
    lng: 75.8937,
    city: 'Indore',
    state: 'Madhya Pradesh',
    pin_code: '452010',
  }));
  const { error: addrErr } = await supabase.from('customer_addresses').upsert(mappedAddresses);
  if (addrErr) console.error('Error inserting customer addresses:', addrErr);
  else console.log(`✓ Inserted/Updated ${mappedAddresses.length} customer addresses.`);

  // 6. Seed Society Admins
  console.log(`6. Seeding ${SEEDED_SOCIETY_ADMINS.length} Society Administrators...`);
  const mappedSocAdmins = SEEDED_SOCIETY_ADMINS.map((sa) => ({
    id: sa.id,
    name: sa.name,
    phone: sa.phone,
    email: sa.email || null,
    email_verified: (sa as any).emailVerified || true,
    society_id: (sa as any).societyId || 'SOC-IND-02',
    designation: (sa as any).designation || 'Secretary',
    dsc_certificate_serial: (sa as any).dscCertificateSerial || 'DSC-MP-2026-IND-01',
    registered_jurisdiction: (sa as any).registeredJurisdiction || 'Indore Ward 48',
  }));
  const { error: saErr } = await supabase.from('society_admins').upsert(mappedSocAdmins);
  if (saErr) console.error('Error inserting society admins:', saErr);
  else console.log(`✓ Inserted/Updated ${mappedSocAdmins.length} society administrators.`);

  // 7. Seed Federation Admins
  console.log(`7. Seeding Federation Admins...`);
  const fedAdmins = [
    {
      id: 'FED-ADM-001',
      name: 'Shri Vinod Sharma',
      phone: '9826011111',
      email: 'vinod.sharma@mpcoop.gov.in',
      email_verified: true,
      department: 'Cooperative Audits & Arbitrations',
      clearance_level: 'LEVEL_3_DIRECTOR',
      official_designation: 'Joint Registrar (Indore Division)',
      station: 'Indore Command Centre',
    },
    {
      id: 'FED-ADM-002',
      name: 'Dr. Sunita Malviya',
      phone: '9826011112',
      email: 'sunita.malviya@mpcoop.gov.in',
      email_verified: true,
      department: 'Artisan Welfare & Social Security',
      clearance_level: 'LEVEL_2_IMC_COMMAND',
      official_designation: 'Deputy Registrar (Welfare Funds)',
      station: 'Indore Municipal Corporation',
    },
  ];
  const { error: fedErr } = await supabase.from('federation_admins').upsert(fedAdmins);
  if (fedErr) console.error('Error inserting federation admins:', fedErr);
  else console.log(`✓ Inserted/Updated ${fedAdmins.length} federation admins.`);

  // 8. Seed Super Admins
  console.log(`8. Seeding Super Admins...`);
  const supAdmins = [
    {
      id: 'SUPER-ADM-001',
      name: 'Dr. Anand Mohan IAS',
      phone: '9826022222',
      email: 'anand.mohan@nic.in',
      email_verified: true,
      ministry: 'Ministry of Cooperation, GoI & MP Govt',
      department: 'Apex Digital Infrastructure & Cooperative Monitoring',
      official_designation: 'Principal Secretary / State IT Commissioner',
      cadre: 'IAS / MP State Cooperative Cadre',
      clearance_level: 'APEX_LEVEL_5_NATIONAL',
      mfa_method: 'AADHAAR_TOTP',
    },
  ];
  const { error: supErr } = await supabase.from('super_admins').upsert(supAdmins);
  if (supErr) console.error('Error inserting super admins:', supErr);
  else console.log(`✓ Inserted/Updated ${supAdmins.length} super admins.`);

  // 9. Seed Cooperative Policy
  console.log(`9. Seeding Cooperative Policy (Statutory 94.5% / 3.5% / 2.0%)...`);
  const policyRow = {
    id: 1,
    active_model: 'MODEL_A',
    model_a_worker_percent: 94.5,
    model_a_society_percent: 3.5,
    model_a_welfare_percent: 2.0,
    model_b_worker_percent: 90.0,
    model_b_maintenance_percent: 7.0,
    model_b_welfare_percent: 3.0,
    grace_window_minutes: 15,
    unexcused_penalty_inr: 50.0,
    three_strike_deduction_percent: 15.0,
    customer_cancel_fee_inr: 30.0,
    standard_radius_km: 7.5,
    emergency_radius_km: 15.0,
    max_radius_km: 25.0,
  };
  const { error: polErr } = await supabase.from('cooperative_policy').upsert([policyRow]);
  if (polErr) console.error('Error inserting cooperative policy:', polErr);
  else console.log(`✓ Inserted/Updated cooperative policy ID 1.`);

  // 10. Seed Initial Booking
  console.log(`10. Seeding Verified Booking Record...`);
  const bookingId = 'BK-2026-IND-1042';
  const bookingRow = {
    id: bookingId,
    customer_id: mappedCustomers[0].id,
    worker_id: mappedWorkers[0].id,
    service_id: mappedServices[0].record_id,
    customer_address_id: mappedAddresses[0].id,
    status: 'COMPLETED',
    base_labour: 250.0,
    travel_charge: 0.0,
    urgency_charge: 0.0,
    materials_total: 0.0,
    tax: 0.0,
    discount: 0.0,
    gross_amount: 250.0,
    worker_share: 236.25,
    society_share: 8.75,
    welfare_share: 5.0,
    net_payable: 250.0,
    arrival_otp: '4819',
    completion_otp: '7293',
    worker_lat: 22.7196,
    worker_lng: 75.8577,
    distance_km: 2.4,
    eta_minutes: 12,
    search_radius_km: 5.0,
    team_required: false,
    team_size: 1,
    worker_requirement_type: 'SINGLE_WORKER',
    scope_details: 'Standard plumbing inspection and tap repair in Vijay Nagar.',
    completed_at: new Date().toISOString(),
    paid_at: new Date().toISOString(),
  };
  const { error: bkgErr } = await supabase.from('bookings').upsert([bookingRow]);
  if (bkgErr) console.error('Error inserting booking:', bkgErr);
  else console.log(`✓ Inserted/Updated demo booking ${bookingId}.`);

  // 11. Seed Financial Ledger
  console.log(`11. Seeding Financial Ledger Entry...`);
  const ledgerRow = {
    id: 'LEDGER-001',
    booking_id: bookingId,
    customer_paid: 250.0,
    worker_credit: 236.25,
    society_credit: 8.75,
    welfare_credit: 5.0,
    policy_snapshot: 'Cooperative Model A (94.5% / 3.5% / 2.0%)',
    status: 'CAPTURED',
  };
  const { error: ledErr } = await supabase.from('financial_ledger').upsert([ledgerRow]);
  if (ledErr) console.error('Error inserting financial ledger:', ledErr);
  else console.log(`✓ Inserted/Updated financial ledger entry.`);

  // 12. Seed Welfare Record
  console.log(`12. Seeding Welfare Record...`);
  const welfareRow = {
    id: 'WLF-001',
    worker_id: mappedWorkers[0].id,
    booking_id: bookingId,
    contribution_amount: 5.0,
    scheme: 'MP Unorganized Workers Social Security Fund',
  };
  const { error: wlfErr } = await supabase.from('welfare_records').upsert([welfareRow]);
  if (wlfErr) console.error('Error inserting welfare record:', wlfErr);
  else console.log(`✓ Inserted/Updated welfare record.`);

  // 13. Ensure Storage Buckets Exist
  console.log(`13. Verifying Public Storage Buckets...`);
  const { data: buckets } = await supabase.storage.listBuckets();
  const bucketList = buckets || [];
  for (const b of ['artisan-photos', 'service-images', 'verification-docs']) {
    if (!bucketList.some((existing) => existing.name === b)) {
      await supabase.storage.createBucket(b, { public: true });
      console.log(`✓ Created public storage bucket: ${b}`);
    } else {
      console.log(`✓ Storage bucket ${b} exists.`);
    }
  }

  console.log(`\n========================================`);
  console.log(`🎉 Supabase Cloud Database Seed 100% Complete!`);
  console.log(`========================================\n`);
}

seed().catch((err) => {
  console.error('Seeding fatal error:', err);
  process.exit(1);
});
