-- Add status column to providers table for self-signup approval flow.
-- Default 'approved' so existing admin-created providers remain visible.
ALTER TABLE public.providers
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'approved'
  CHECK (status IN ('pending', 'approved', 'rejected'));

-- Update the public read policy to only expose approved providers.
-- Admins use the service role key which bypasses RLS entirely.
DROP POLICY IF EXISTS "providers_public_read"         ON public.providers;
DROP POLICY IF EXISTS "provider_profiles_public_read" ON public.providers;

CREATE POLICY "providers_public_read" ON public.providers
  FOR SELECT TO anon, authenticated
  USING (status = 'approved');
