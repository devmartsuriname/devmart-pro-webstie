-- Create pricing_plans table
CREATE TABLE public.pricing_plans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  subtitle TEXT,
  price TEXT NOT NULL,
  features_included TEXT[] DEFAULT '{}',
  features_excluded TEXT[] DEFAULT '{}',
  cta_label TEXT DEFAULT 'Get Started',
  cta_url TEXT,
  is_featured BOOLEAN DEFAULT false,
  "order" INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by UUID,
  updated_by UUID
);

-- Create faq table
CREATE TABLE public.faq (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category TEXT,
  question TEXT NOT NULL,
  answer_rich TEXT NOT NULL,
  "order" INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by UUID,
  updated_by UUID
);

-- Create testimonials table
CREATE TABLE public.testimonials (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  author_name TEXT NOT NULL,
  author_role TEXT NOT NULL,
  company TEXT,
  avatar TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  quote TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  "order" INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by UUID,
  updated_by UUID
);

-- Create team table
CREATE TABLE public.team (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  avatar TEXT,
  linkedin TEXT,
  twitter TEXT,
  instagram TEXT,
  github TEXT,
  website TEXT,
  bio_rich TEXT,
  "order" INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by UUID,
  updated_by UUID
);

-- Create banners table
CREATE TABLE public.banners (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  page_key TEXT NOT NULL UNIQUE,
  headline TEXT NOT NULL,
  subheadline TEXT,
  background_image TEXT,
  primary_cta_label TEXT,
  primary_cta_url TEXT,
  secondary_cta_label TEXT,
  secondary_cta_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by UUID,
  updated_by UUID
);

-- Create media_library table
CREATE TABLE public.media_library (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  filename TEXT NOT NULL,
  original_name TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  url TEXT NOT NULL,
  thumbnail_url TEXT,
  tags TEXT[] DEFAULT '{}',
  alt_text TEXT,
  caption TEXT,
  uploaded_by UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create menus table
CREATE TABLE public.menus (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  items JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by UUID,
  updated_by UUID
);

-- Create site_settings table
CREATE TABLE public.site_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  site_name TEXT DEFAULT 'DevMart Pro',
  logo_light TEXT,
  logo_dark TEXT,
  favicon TEXT,
  primary_color TEXT DEFAULT '#6366f1',
  accent_color TEXT DEFAULT '#a855f7',
  contact_email TEXT,
  contact_phone TEXT,
  address TEXT,
  map_embed TEXT,
  linkedin TEXT,
  twitter TEXT,
  instagram TEXT,
  facebook TEXT,
  youtube TEXT,
  github TEXT,
  analytics_id TEXT,
  default_title_suffix TEXT DEFAULT ' | DevMart Pro',
  default_meta_description TEXT,
  default_og_image TEXT,
  smtp_host TEXT,
  smtp_port INTEGER,
  smtp_user TEXT,
  smtp_from_email TEXT,
  cloudinary_cloud_name TEXT,
  cloudinary_api_key TEXT,
  robots_txt TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_by UUID
);

-- Insert default settings
INSERT INTO public.site_settings (id) VALUES (gen_random_uuid());

-- Enable RLS
ALTER TABLE public.pricing_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faq ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menus ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for pricing_plans
CREATE POLICY "Anyone can view active pricing plans"
  ON public.pricing_plans FOR SELECT
  USING (is_active = true);

CREATE POLICY "Authenticated users can view all pricing plans"
  ON public.pricing_plans FOR SELECT
  USING (true);

CREATE POLICY "Admin/Editor can manage pricing plans"
  ON public.pricing_plans FOR ALL
  USING (is_admin_or_editor(auth.uid()));

-- RLS Policies for faq
CREATE POLICY "Anyone can view active FAQ"
  ON public.faq FOR SELECT
  USING (is_active = true);

CREATE POLICY "Authenticated users can view all FAQ"
  ON public.faq FOR SELECT
  USING (true);

CREATE POLICY "Admin/Editor can manage FAQ"
  ON public.faq FOR ALL
  USING (is_admin_or_editor(auth.uid()));

-- RLS Policies for testimonials
CREATE POLICY "Anyone can view active testimonials"
  ON public.testimonials FOR SELECT
  USING (is_active = true);

CREATE POLICY "Authenticated users can view all testimonials"
  ON public.testimonials FOR SELECT
  USING (true);

CREATE POLICY "Admin/Editor can manage testimonials"
  ON public.testimonials FOR ALL
  USING (is_admin_or_editor(auth.uid()));

-- RLS Policies for team
CREATE POLICY "Anyone can view active team members"
  ON public.team FOR SELECT
  USING (is_active = true);

CREATE POLICY "Authenticated users can view all team members"
  ON public.team FOR SELECT
  USING (true);

CREATE POLICY "Admin/Editor can manage team"
  ON public.team FOR ALL
  USING (is_admin_or_editor(auth.uid()));

-- RLS Policies for banners
CREATE POLICY "Anyone can view active banners"
  ON public.banners FOR SELECT
  USING (is_active = true);

CREATE POLICY "Authenticated users can view all banners"
  ON public.banners FOR SELECT
  USING (true);

CREATE POLICY "Admin/Editor can manage banners"
  ON public.banners FOR ALL
  USING (is_admin_or_editor(auth.uid()));

-- RLS Policies for media_library
CREATE POLICY "Anyone can view media"
  ON public.media_library FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can upload media"
  ON public.media_library FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Admin/Editor can manage media"
  ON public.media_library FOR ALL
  USING (is_admin_or_editor(auth.uid()));

-- RLS Policies for menus
CREATE POLICY "Anyone can view active menus"
  ON public.menus FOR SELECT
  USING (is_active = true);

CREATE POLICY "Authenticated users can view all menus"
  ON public.menus FOR SELECT
  USING (true);

CREATE POLICY "Admin/Editor can manage menus"
  ON public.menus FOR ALL
  USING (is_admin_or_editor(auth.uid()));

-- RLS Policies for site_settings
CREATE POLICY "Anyone can view site settings"
  ON public.site_settings FOR SELECT
  USING (true);

CREATE POLICY "Admin can update site settings"
  ON public.site_settings FOR UPDATE
  USING (has_role(auth.uid(), 'admin'));

-- Create triggers for updated_at
CREATE TRIGGER update_pricing_plans_updated_at
  BEFORE UPDATE ON public.pricing_plans
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_faq_updated_at
  BEFORE UPDATE ON public.faq
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_testimonials_updated_at
  BEFORE UPDATE ON public.testimonials
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_team_updated_at
  BEFORE UPDATE ON public.team
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_banners_updated_at
  BEFORE UPDATE ON public.banners
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_media_library_updated_at
  BEFORE UPDATE ON public.media_library
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_menus_updated_at
  BEFORE UPDATE ON public.menus
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_site_settings_updated_at
  BEFORE UPDATE ON public.site_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Update services table to match requirements
ALTER TABLE public.services 
  ADD COLUMN IF NOT EXISTS price_from DECIMAL,
  ADD COLUMN IF NOT EXISTS features JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS "order" INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS hero_image TEXT;

-- Update projects table to match requirements
ALTER TABLE public.projects
  ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS "order" INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS url TEXT;

-- Add order column to blog_posts if not exists
ALTER TABLE public.blog_posts
  ADD COLUMN IF NOT EXISTS "order" INTEGER DEFAULT 0;