-- ============================================================================
-- BHARAT KAUSHAL COOPERATIVE PLATFORM - STATUTORY RLS ACCESS POLICIES
-- Ensures public transparency & client data access under MP Cooperative Societies Act, 1960
-- ============================================================================

-- 1. WORKERS / SKILLED ARTISANS: Public visibility for trade marketplace
ALTER TABLE IF EXISTS workers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view verified artisans" ON workers;
CREATE POLICY "Public can view verified artisans"
ON workers FOR SELECT
TO anon, authenticated
USING (true);

-- 2. COOPERATIVE POLICY: Statutory transparency of 94.5% / 3.5% / 2.0% split
ALTER TABLE IF EXISTS cooperative_policy ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view cooperative policy" ON cooperative_policy;
CREATE POLICY "Public can view cooperative policy"
ON cooperative_policy FOR SELECT
TO anon, authenticated
USING (true);

-- 3. SERVICES: Catalog tariffs visibility (146 Standardized Indore Tariffs)
ALTER TABLE IF EXISTS services ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view services" ON services;
CREATE POLICY "Public can view services"
ON services FOR SELECT
TO anon, authenticated
USING (true);

-- 4. SOCIETIES: Registered cooperative societies
ALTER TABLE IF EXISTS societies ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view societies" ON societies;
CREATE POLICY "Public can view societies"
ON societies FOR SELECT
TO anon, authenticated
USING (true);

-- 5. FINANCIAL LEDGER: Cooperative audit trail transparency
ALTER TABLE IF EXISTS financial_ledger ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view ledger" ON financial_ledger;
CREATE POLICY "Public can view ledger"
ON financial_ledger FOR SELECT
TO anon, authenticated
USING (true);

-- 6. WELFARE RECORDS: Social security fund contributions
ALTER TABLE IF EXISTS welfare_records ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view welfare records" ON welfare_records;
CREATE POLICY "Public can view welfare records"
ON welfare_records FOR SELECT
TO anon, authenticated
USING (true);

-- 7. STORAGE OBJECT POLICIES (Artisan photos & service images)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'storage' AND table_name = 'objects') THEN
    DROP POLICY IF EXISTS "Public read artisan photos" ON storage.objects;
    CREATE POLICY "Public read artisan photos"
    ON storage.objects FOR SELECT
    TO anon, authenticated
    USING (bucket_id IN ('artisan-photos', 'service-images'));
  END IF;
END $$;
