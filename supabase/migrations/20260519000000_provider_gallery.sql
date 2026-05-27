-- Provider media gallery: photos and videos uploaded by providers.
CREATE TABLE IF NOT EXISTS public.provider_gallery (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID        NOT NULL REFERENCES public.providers(id) ON DELETE CASCADE,
  url         TEXT        NOT NULL,
  type        TEXT        NOT NULL DEFAULT 'image' CHECK (type IN ('image', 'video')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.provider_gallery ENABLE ROW LEVEL SECURITY;

CREATE POLICY "gallery_public_read" ON public.provider_gallery
  FOR SELECT TO anon, authenticated USING (true);
