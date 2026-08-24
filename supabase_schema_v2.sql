-- =============================================================================
-- TERVOM CMS — Full Database Schema v2
-- Run this in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/zvcibjktgehwipmohsmw/sql
-- =============================================================================

-- ─── HELPER: updated_at trigger ──────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =============================================================================
-- 1. SERVICES TABLE
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.services (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at     TIMESTAMPTZ DEFAULT now(),
  updated_at     TIMESTAMPTZ DEFAULT now(),
  name           TEXT NOT NULL,
  slug           TEXT NOT NULL UNIQUE,
  category       TEXT,
  icon           TEXT DEFAULT '⚙️',
  image_url      TEXT,
  short_description TEXT NOT NULL DEFAULT '',
  full_description  TEXT,
  features       TEXT[] DEFAULT '{}',
  technologies   TEXT[] DEFAULT '{}',
  pricing        TEXT,
  delivery_time  TEXT,
  button_text    TEXT DEFAULT 'Get a Quote',
  button_link    TEXT DEFAULT '/contact',
  color          TEXT DEFAULT 'from-blue-500 to-cyan-500',
  bg             TEXT DEFAULT 'bg-blue-500/10',
  is_featured    BOOLEAN DEFAULT false,
  is_active      BOOLEAN DEFAULT true,
  display_order  INTEGER DEFAULT 0,
  seo_title      TEXT,
  seo_description TEXT
);

CREATE TRIGGER services_updated_at
  BEFORE UPDATE ON public.services
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

-- Public can read active services
CREATE POLICY "Public can read active services"
  ON public.services FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

-- Authenticated admin can do everything
CREATE POLICY "Admin full access on services"
  ON public.services FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- =============================================================================
-- 2. PORTFOLIO TABLE
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.portfolio (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at     TIMESTAMPTZ DEFAULT now(),
  updated_at     TIMESTAMPTZ DEFAULT now(),
  title          TEXT NOT NULL,
  slug           TEXT NOT NULL UNIQUE,
  category       TEXT NOT NULL DEFAULT 'web',
  client_name    TEXT,
  image_url      TEXT,
  short_description TEXT NOT NULL DEFAULT '',
  full_description  TEXT,
  technologies   TEXT[] DEFAULT '{}',
  features       TEXT[] DEFAULT '{}',
  demo_url       TEXT,
  github_url     TEXT,
  case_study     TEXT,
  completion_date TEXT,
  is_featured    BOOLEAN DEFAULT false,
  is_active      BOOLEAN DEFAULT true,
  display_order  INTEGER DEFAULT 0
);

CREATE TRIGGER portfolio_updated_at
  BEFORE UPDATE ON public.portfolio
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

ALTER TABLE public.portfolio ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read active portfolio"
  ON public.portfolio FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "Admin full access on portfolio"
  ON public.portfolio FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- =============================================================================
-- 3. BLOGS TABLE
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.blogs (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at     TIMESTAMPTZ DEFAULT now(),
  updated_at     TIMESTAMPTZ DEFAULT now(),
  title          TEXT NOT NULL,
  slug           TEXT NOT NULL UNIQUE,
  author         TEXT NOT NULL DEFAULT 'TERVOM Team',
  category       TEXT,
  image_url      TEXT,
  short_description TEXT NOT NULL DEFAULT '',
  content        TEXT NOT NULL DEFAULT '',
  tags           TEXT[] DEFAULT '{}',
  reading_time   INTEGER DEFAULT 5,
  seo_title      TEXT,
  seo_description TEXT,
  status         TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','published')),
  published_at   TIMESTAMPTZ
);

CREATE TRIGGER blogs_updated_at
  BEFORE UPDATE ON public.blogs
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read published blogs"
  ON public.blogs FOR SELECT
  TO anon, authenticated
  USING (status = 'published');

CREATE POLICY "Admin full access on blogs"
  ON public.blogs FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- =============================================================================
-- 4. TESTIMONIALS TABLE
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.testimonials (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at     TIMESTAMPTZ DEFAULT now(),
  updated_at     TIMESTAMPTZ DEFAULT now(),
  client_name    TEXT NOT NULL,
  company        TEXT NOT NULL DEFAULT '',
  position       TEXT NOT NULL DEFAULT '',
  image_url      TEXT,
  review         TEXT NOT NULL,
  rating         INTEGER NOT NULL DEFAULT 5 CHECK (rating BETWEEN 1 AND 5),
  project        TEXT,
  is_featured    BOOLEAN DEFAULT false,
  is_active      BOOLEAN DEFAULT true,
  display_order  INTEGER DEFAULT 0
);

CREATE TRIGGER testimonials_updated_at
  BEFORE UPDATE ON public.testimonials
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read active testimonials"
  ON public.testimonials FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "Admin full access on testimonials"
  ON public.testimonials FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- =============================================================================
-- 5. CONTACT SUBMISSIONS — extend existing table
-- =============================================================================
ALTER TABLE public.contact_submissions
  ADD COLUMN IF NOT EXISTS is_read BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS replied_at TIMESTAMPTZ;

-- Allow admin to update (mark read/delete)
CREATE POLICY "Admin full access on contact_submissions"
  ON public.contact_submissions FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- =============================================================================
-- 6. SETTINGS TABLE (key-value store)
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.settings (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key        TEXT NOT NULL UNIQUE,
  value      JSONB,
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read settings"
  ON public.settings FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Admin full access on settings"
  ON public.settings FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Seed default settings
INSERT INTO public.settings (key, value) VALUES
  ('company_name',    '"TERVOM"'),
  ('tagline',         '"Engineering Digital Success."'),
  ('email',           '"hello@tervom.com"'),
  ('phone',           '"+91 74168 58563"'),
  ('whatsapp',        '"+917416858563"'),
  ('address',         '"India"'),
  ('twitter',         '"https://twitter.com/tervom"'),
  ('linkedin',        '"https://linkedin.com/company/tervom"'),
  ('github',          '"https://github.com/tervom"'),
  ('instagram',       '"https://instagram.com/tervom"'),
  ('youtube',         '"https://youtube.com/tervom"'),
  ('google_analytics','""'),
  ('footer_text',     '"Code. Innovate. Elevate."'),
  ('seo_title',       '"TERVOM — Engineering Digital Success"'),
  ('seo_description', '"Premium IT services company delivering web, mobile, AI & cloud solutions."')
ON CONFLICT (key) DO NOTHING;

-- =============================================================================
-- 7. CATEGORIES TABLE
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.categories (
  id   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('service','portfolio','blog'))
);

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read categories"
  ON public.categories FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Admin full access on categories"
  ON public.categories FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- =============================================================================
-- 8. STORAGE BUCKETS — run manually in Supabase Storage dashboard
-- or uncomment if using Supabase CLI:
-- =============================================================================
-- INSERT INTO storage.buckets (id, name, public) VALUES
--   ('service-images',      'service-images',      true),
--   ('portfolio-images',    'portfolio-images',    true),
--   ('blog-images',         'blog-images',         true),
--   ('testimonial-images',  'testimonial-images',  true),
--   ('company-assets',      'company-assets',      true)
-- ON CONFLICT (id) DO NOTHING;

-- =============================================================================
-- 9. REALTIME PUBLICATIONS
-- =============================================================================
ALTER PUBLICATION supabase_realtime ADD TABLE public.services;
ALTER PUBLICATION supabase_realtime ADD TABLE public.portfolio;
ALTER PUBLICATION supabase_realtime ADD TABLE public.blogs;
ALTER PUBLICATION supabase_realtime ADD TABLE public.testimonials;
ALTER PUBLICATION supabase_realtime ADD TABLE public.settings;
