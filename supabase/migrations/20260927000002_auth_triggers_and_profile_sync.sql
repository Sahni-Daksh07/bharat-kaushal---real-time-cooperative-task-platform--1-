-- ============================================================================
-- 3. SUPABASE AUTH TRIGGER: AUTO-SYNC AUTH USERS TO PROFILES
-- Operating under Madhya Pradesh Cooperative Societies Act, 1960
-- Automatically provisions public customer/worker profiles upon Supabase signup
-- ============================================================================

CREATE OR REPLACE FUNCTION public.handle_new_auth_user()
RETURNS TRIGGER AS $$
BEGIN
  IF (NEW.raw_user_meta_data->>'role') = 'WORKER' THEN
    INSERT INTO public.workers (
      id,
      name,
      phone,
      email,
      primary_trade,
      society_id,
      created_at
    )
    VALUES (
      NEW.id::text,
      COALESCE(NEW.raw_user_meta_data->>'name', 'Certified Artisan'),
      COALESCE(NEW.phone, NEW.raw_user_meta_data->>'phone', '98260' || substring(replace(NEW.id::text, '-', '') from 1 for 5)),
      NEW.email,
      COALESCE(NEW.raw_user_meta_data->>'trade', 'General Services'),
      COALESCE(NEW.raw_user_meta_data->>'societyId', 'SOC-IND-048'),
      NOW()
    )
    ON CONFLICT (id) DO UPDATE SET
      name = EXCLUDED.name,
      email = EXCLUDED.email;
  ELSE
    INSERT INTO public.customers (
      id,
      name,
      phone,
      email,
      created_at
    )
    VALUES (
      NEW.id::text,
      COALESCE(NEW.raw_user_meta_data->>'name', 'Resident Citizen'),
      COALESCE(NEW.phone, NEW.raw_user_meta_data->>'phone', '98260' || substring(replace(NEW.id::text, '-', '') from 1 for 5)),
      NEW.email,
      NOW()
    )
    ON CONFLICT (id) DO UPDATE SET
      name = EXCLUDED.name,
      email = EXCLUDED.email;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Safe trigger installation if auth.users is present
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'auth' AND table_name = 'users') THEN
    DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
    CREATE TRIGGER on_auth_user_created
      AFTER INSERT ON auth.users
      FOR EACH ROW EXECUTE FUNCTION public.handle_new_auth_user();
  END IF;
END $$;
