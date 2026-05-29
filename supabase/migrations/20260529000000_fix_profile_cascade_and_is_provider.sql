-- 1. Fix cascade delete for profiles.
--
-- RLS is enabled on public.profiles with no DELETE policy, so the foreign-key
-- cascade from auth.users is silently blocked. A SECURITY DEFINER trigger runs
-- as the function owner (postgres) and bypasses RLS, reliably deleting the
-- profile whenever an auth user is removed.
--
CREATE OR REPLACE FUNCTION public.handle_user_deleted()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  DELETE FROM public.profiles WHERE id = OLD.id;
  RETURN OLD;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_deleted ON auth.users;
CREATE TRIGGER on_auth_user_deleted
  BEFORE DELETE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_user_deleted();

-- 2. Retroactively set is_provider = true for any profile whose user already
--    has a row in the providers table (catches all existing signups).
UPDATE public.profiles p
SET is_provider = true
FROM public.providers pr
WHERE pr.user_id = p.id
  AND p.is_provider IS DISTINCT FROM true;
