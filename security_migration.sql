-- SYSTEM SECURITY LOCKDOWN SCRIPT
-- This script hardens your database by implementing Role-Based Access Control (RBAC)

-- 1. Ensure profiles has the correct columns
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role text DEFAULT 'customer';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS revoked_at timestamp with time zone;

-- 2. Create Security Definer functions to prevent infinite recursion
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

CREATE OR REPLACE FUNCTION public.is_staff()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role IN ('admin', 'staff')
  );
$$;

-- 3. Lock Down Orders Table (Financial Data)
DROP POLICY IF EXISTS "Allow public all on orders" ON public.orders;

CREATE POLICY "Admins and Staff can view all orders" ON public.orders
  FOR SELECT USING ( public.is_staff() );

CREATE POLICY "Admins and Staff can modify all orders" ON public.orders
  FOR ALL USING ( public.is_staff() ) WITH CHECK ( public.is_staff() );

-- 4. Lock Down Products Table (Store Assets)
DROP POLICY IF EXISTS "Allow anon insert" ON public.products;
DROP POLICY IF EXISTS "Allow anon update" ON public.products;
DROP POLICY IF EXISTS "Allow anon delete" ON public.products;

CREATE POLICY "Admins can insert products" ON public.products
  FOR INSERT WITH CHECK ( public.is_admin() );

CREATE POLICY "Admins can update products" ON public.products
  FOR UPDATE USING ( public.is_admin() );

CREATE POLICY "Admins can delete products" ON public.products
  FOR DELETE USING ( public.is_admin() );

-- 5. Lock Down Store Settings Table (Operations)
DROP POLICY IF EXISTS "Allow anon update settings" ON public.store_settings;
DROP POLICY IF EXISTS "Allow anon insert settings" ON public.store_settings;

CREATE POLICY "Admins can update settings" ON public.store_settings
  FOR UPDATE USING ( public.is_admin() );

CREATE POLICY "Admins can insert settings" ON public.store_settings
  FOR INSERT WITH CHECK ( public.is_admin() );

-- 6. Lock Down Profiles Table (User Management)
CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT USING ( public.is_admin() );

CREATE POLICY "Admins can update all profiles" ON public.profiles
  FOR UPDATE USING ( public.is_admin() );
