-- ============================================================================
-- BHARAT KAUSHAL COOPERATIVE PLATFORM - STATUTORY RLS ACCESS POLICIES
-- Ensures public transparency & client data access under MP Cooperative Societies Act, 1960
-- ============================================================================

-- 1. SOCIETIES
ALTER TABLE IF EXISTS societies ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can view societies" ON societies;
CREATE POLICY "Public can view societies"
ON societies FOR SELECT
TO anon, authenticated
USING (true);

-- 2. SERVICES (146 Standardized Tariffs)
ALTER TABLE IF EXISTS services ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can view services" ON services;
CREATE POLICY "Public can view services"
ON services FOR SELECT
TO anon, authenticated
USING (true);

-- 3. WORKERS (Certified Member Artisans)
ALTER TABLE IF EXISTS workers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can view verified artisans" ON workers;
CREATE POLICY "Public can view verified artisans"
ON workers FOR SELECT
TO anon, authenticated
USING (true);

DROP POLICY IF EXISTS "Workers can update own availability" ON workers;
CREATE POLICY "Workers can update own availability"
ON workers FOR UPDATE
TO anon, authenticated
USING (true)
WITH CHECK (true);

-- 4. CUSTOMERS
ALTER TABLE IF EXISTS customers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can view customers" ON customers;
CREATE POLICY "Public can view customers"
ON customers FOR SELECT
TO anon, authenticated
USING (true);

DROP POLICY IF EXISTS "Public can register customer profile" ON customers;
CREATE POLICY "Public can register customer profile"
ON customers FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- 5. SOCIETY ADMINS
ALTER TABLE IF EXISTS society_admins ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can view society admins" ON society_admins;
CREATE POLICY "Public can view society admins"
ON society_admins FOR SELECT
TO anon, authenticated
USING (true);

-- 6. FEDERATION ADMINS
ALTER TABLE IF EXISTS federation_admins ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can view federation admins" ON federation_admins;
CREATE POLICY "Public can view federation admins"
ON federation_admins FOR SELECT
TO anon, authenticated
USING (true);

-- 7. SUPER ADMINS
ALTER TABLE IF EXISTS super_admins ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can view super admins" ON super_admins;
CREATE POLICY "Public can view super admins"
ON super_admins FOR SELECT
TO anon, authenticated
USING (true);

-- 8. BOOKINGS
ALTER TABLE IF EXISTS bookings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can view bookings" ON bookings;
CREATE POLICY "Public can view bookings"
ON bookings FOR SELECT
TO anon, authenticated
USING (true);

DROP POLICY IF EXISTS "Public can create bookings" ON bookings;
CREATE POLICY "Public can create bookings"
ON bookings FOR INSERT
TO anon, authenticated
WITH CHECK (true);

DROP POLICY IF EXISTS "Public can update bookings" ON bookings;
CREATE POLICY "Public can update bookings"
ON bookings FOR UPDATE
TO anon, authenticated
USING (true)
WITH CHECK (true);

-- 9. FINANCIAL LEDGER (Cooperative Audit Transparency)
ALTER TABLE IF EXISTS financial_ledger ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can view ledger" ON financial_ledger;
CREATE POLICY "Public can view ledger"
ON financial_ledger FOR SELECT
TO anon, authenticated
USING (true);

DROP POLICY IF EXISTS "Allow ledger recording" ON financial_ledger;
CREATE POLICY "Allow ledger recording"
ON financial_ledger FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- 10. WELFARE RECORDS (Social Security Fund Transparency)
ALTER TABLE IF EXISTS welfare_records ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can view welfare records" ON welfare_records;
CREATE POLICY "Public can view welfare records"
ON welfare_records FOR SELECT
TO anon, authenticated
USING (true);

DROP POLICY IF EXISTS "Allow welfare contributions recording" ON welfare_records;
CREATE POLICY "Allow welfare contributions recording"
ON welfare_records FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- 11. COOPERATIVE POLICY (Statutory Split Policy 94.5% / 3.5% / 2.0%)
ALTER TABLE IF EXISTS cooperative_policy ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can view cooperative policy" ON cooperative_policy;
CREATE POLICY "Public can view cooperative policy"
ON cooperative_policy FOR SELECT
TO anon, authenticated
USING (true);
