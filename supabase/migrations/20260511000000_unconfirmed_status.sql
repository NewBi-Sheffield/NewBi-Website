-- Expand status constraint to include 'unconfirmed' and 'unlisted'.
ALTER TABLE public.providers
  DROP CONSTRAINT IF EXISTS providers_status_check;

ALTER TABLE public.providers
  ADD CONSTRAINT providers_status_check
  CHECK (status IN ('unconfirmed', 'pending', 'approved', 'unlisted', 'rejected'));

-- Trigger: when a user confirms their email, promote their provider
-- application from 'unconfirmed' to 'pending' so admins can review it.
CREATE OR REPLACE FUNCTION public.handle_email_confirmed()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  IF OLD.email_confirmed_at IS NULL AND NEW.email_confirmed_at IS NOT NULL THEN
    UPDATE public.providers
    SET status = 'pending'
    WHERE user_id = NEW.id AND status = 'unconfirmed';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_email_confirmed ON auth.users;

CREATE TRIGGER on_auth_user_email_confirmed
  AFTER UPDATE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_email_confirmed();
