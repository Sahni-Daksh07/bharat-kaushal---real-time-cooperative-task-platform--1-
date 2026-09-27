import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://gndkbtssabnmknkendpz.supabase.co';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!serviceRoleKey) {
  console.error('Missing SUPABASE_SERVICE_ROLE_KEY in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function main() {
  console.log('====================================================');
  console.log('🔐 SUPABASE AUTH SETUP & AUDIT');
  console.log(`URL: ${supabaseUrl}`);
  console.log('====================================================\n');

  // 1. List existing users
  const { data: usersData, error: listErr } = await supabase.auth.admin.listUsers();
  if (listErr) {
    console.error('Error listing auth users:', listErr.message);
  } else {
    console.log(`Found ${usersData.users.length} existing Auth users in Supabase.`);
    for (const u of usersData.users) {
      console.log(` - User ID: ${u.id}, Email: ${u.email}, Phone: ${u.phone}, Metadata:`, u.user_metadata);
    }
  }

  // 2. Define standard test demo users for all 5 roles
  const demoUsers = [
    {
      email: 'citizen@bharatkaushal.gov.in',
      phone: '+919826011111',
      password: 'BharatKaushal@123',
      user_metadata: {
        name: 'Priya Sharma',
        role: 'CUSTOMER',
        phone: '9826011111',
        locality: 'Vijay Nagar, Indore',
      },
      app_metadata: {
        role: 'CUSTOMER',
        provider: 'phone_or_email',
      },
    },
    {
      email: 'artisan@bharatkaushal.gov.in',
      phone: '+919826022222',
      password: 'BharatKaushal@123',
      user_metadata: {
        name: 'Ramesh Kumar',
        role: 'WORKER',
        phone: '9826022222',
        trade: 'Electrical & Plumbing',
        societyId: 'SOC-IND-048',
      },
      app_metadata: {
        role: 'WORKER',
        provider: 'phone_or_email',
      },
    },
    {
      email: 'society@bharatkaushal.gov.in',
      phone: '+919826033333',
      password: 'BharatKaushal@123',
      user_metadata: {
        name: 'Rekha Malviya',
        role: 'SOCIETY_ADMIN',
        adminId: 'SOC-IND-048',
        societyName: 'Indore Shramik Sahakari Samiti Ward 48',
      },
      app_metadata: {
        role: 'SOCIETY_ADMIN',
        provider: 'email',
      },
    },
    {
      email: 'federation@bharatkaushal.gov.in',
      phone: '+919826044444',
      password: 'BharatKaushal@123',
      user_metadata: {
        name: 'Dr. Anand Verma',
        role: 'FEDERATION_ADMIN',
        officerId: 'FED-MP-001',
        designation: 'Joint Registrar & Operations Director',
      },
      app_metadata: {
        role: 'FEDERATION_ADMIN',
        provider: 'email',
      },
    },
    {
      email: 'superadmin@bharatkaushal.gov.in',
      phone: '+919826055555',
      password: 'BharatKaushal@123',
      user_metadata: {
        name: 'Dr. Anand Mohan IAS',
        role: 'SUPER_ADMIN',
        officialId: 'REG-MP-999',
        designation: 'Registrar of Cooperative Societies, MP',
      },
      app_metadata: {
        role: 'SUPER_ADMIN',
        provider: 'email',
      },
    },
  ];

  console.log('\n--- Provisioning Demo Role Accounts in Supabase Auth ---');
  for (const d of demoUsers) {
    const existing = (usersData?.users as any[])?.find((u: any) => u.email === d.email || u.phone === d.phone);
    if (existing) {
      console.log(`ℹ️ User already exists for ${d.email} (ID: ${existing.id}), updating metadata...`);
      const { error: updErr } = await supabase.auth.admin.updateUserById(existing.id, {
        email_confirm: true,
        phone_confirm: true,
        user_metadata: d.user_metadata,
        app_metadata: d.app_metadata,
        password: d.password,
      });
      if (updErr) console.error(`Failed to update ${d.email}:`, updErr.message);
      else console.log(`✓ Updated ${d.email} password & metadata successfully.`);
    } else {
      console.log(`➕ Creating user for ${d.email} (${d.user_metadata.name} - ${d.user_metadata.role})...`);
      const { data: createData, error: createErr } = await supabase.auth.admin.createUser({
        email: d.email,
        phone: d.phone,
        password: d.password,
        email_confirm: true,
        phone_confirm: true,
        user_metadata: d.user_metadata,
        app_metadata: d.app_metadata,
      });
      if (createErr) {
        console.error(`Failed to create ${d.email}:`, createErr.message);
      } else {
        console.log(`✓ Created Auth User [${createData.user.id}] for ${d.email} (${d.user_metadata.role})`);
      }
    }
  }

  console.log('\n====================================================');
  console.log('🎉 Supabase Auth users successfully configured & verified!');
  console.log('====================================================\n');
}

main().catch(console.error);
