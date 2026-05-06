-- Baseline schema + provider invite system.
-- CREATE TABLE IF NOT EXISTS makes this safe to run against an existing DB too.

CREATE TABLE IF NOT EXISTS public.profiles (
  id           UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email        TEXT,
  display_name TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.provider_profiles (
  id                  UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name                TEXT        NOT NULL,
  description         TEXT,
  address             TEXT,
  phone               TEXT,
  email               TEXT,
  instagram           TEXT,
  website             TEXT,
  profile_picture_url TEXT,
  categories          TEXT[]      NOT NULL DEFAULT '{}',
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.reviews (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id   UUID        REFERENCES public.provider_profiles(id) ON DELETE CASCADE,
  user_id       UUID        REFERENCES auth.users(id) ON DELETE SET NULL,
  provider_name TEXT,
  author        TEXT,
  rating        INT         NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment       TEXT,
  date          DATE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.suggestions (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name       TEXT        NOT NULL,
  email      TEXT        NOT NULL,
  message    TEXT        NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.mailing_list (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  email      TEXT        NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.listing_requests (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name       TEXT        NOT NULL,
  email      TEXT        NOT NULL,
  business   TEXT        NOT NULL,
  category   TEXT        NOT NULL,
  phone      TEXT,
  message    TEXT        NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Rename providers → provider_profiles if it exists under the old name
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'providers'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'provider_profiles'
  ) THEN
    ALTER TABLE public.providers RENAME TO provider_profiles;
  END IF;
END $$;

-- Add user ownership to provider_profiles
ALTER TABLE public.provider_profiles
  ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

ALTER TABLE public.provider_profiles
  DROP CONSTRAINT IF EXISTS providers_user_id_unique;
ALTER TABLE public.provider_profiles
  DROP CONSTRAINT IF EXISTS provider_profiles_user_id_unique;
ALTER TABLE public.provider_profiles
  ADD CONSTRAINT provider_profiles_user_id_unique UNIQUE (user_id);

-- One-time invite tokens
CREATE TABLE IF NOT EXISTS public.provider_invites (
  token       UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID        NOT NULL REFERENCES public.provider_profiles(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at  TIMESTAMPTZ NOT NULL DEFAULT now() + INTERVAL '7 days',
  used_at     TIMESTAMPTZ
);

-- Trigger: keep profiles.is_provider in sync
CREATE OR REPLACE FUNCTION public.sync_is_provider()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF TG_OP = 'UPDATE' AND NEW.user_id IS NOT NULL AND OLD.user_id IS NULL THEN
    UPDATE public.profiles SET is_provider = true WHERE user_id = NEW.user_id;
  ELSIF TG_OP = 'UPDATE' AND NEW.user_id IS NULL AND OLD.user_id IS NOT NULL THEN
    UPDATE public.profiles SET is_provider = false WHERE user_id = OLD.user_id;
  ELSIF TG_OP = 'DELETE' AND OLD.user_id IS NOT NULL THEN
    UPDATE public.profiles SET is_provider = false WHERE user_id = OLD.user_id;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_provider_user_id_change ON public.provider_profiles;
CREATE TRIGGER on_provider_user_id_change
  AFTER UPDATE OR DELETE ON public.provider_profiles
  FOR EACH ROW EXECUTE FUNCTION public.sync_is_provider();

-- RLS
ALTER TABLE public.mailing_list       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.provider_profiles  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.suggestions        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.listing_requests   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.provider_invites   ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "providers_public_read"        ON public.provider_profiles;
DROP POLICY IF EXISTS "reviews_public_read"          ON public.reviews;
DROP POLICY IF EXISTS "providers_owner_update"       ON public.provider_profiles;
DROP POLICY IF EXISTS "provider_profiles_public_read" ON public.provider_profiles;
DROP POLICY IF EXISTS "provider_profiles_owner_update" ON public.provider_profiles;

CREATE POLICY "provider_profiles_public_read"  ON public.provider_profiles FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "reviews_public_read"            ON public.reviews           FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "provider_profiles_owner_update" ON public.provider_profiles FOR UPDATE TO authenticated
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
