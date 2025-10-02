-- Phase 1: Create enums and base tables for Admin CMS

-- Create app_role enum for role-based access
CREATE TYPE public.app_role AS ENUM ('admin', 'editor', 'author', 'viewer');

-- Create status enum for content
CREATE TYPE public.content_status AS ENUM ('draft', 'published', 'archived');

-- User roles table (separate from profiles for security)
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role public.app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(user_id, role)
);

-- Security definer function to check roles (prevents RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Helper function to check if user is admin or editor
CREATE OR REPLACE FUNCTION public.is_admin_or_editor(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role IN ('admin', 'editor')
  )
$$;

-- Services table
CREATE TABLE public.services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    short_desc TEXT,
    content_richtext TEXT,
    icon_url TEXT,
    gallery_urls TEXT[] DEFAULT '{}',
    category TEXT,
    status public.content_status DEFAULT 'draft',
    seo_title TEXT,
    seo_description TEXT,
    seo_keywords TEXT[],
    seo_og_image TEXT,
    published_at TIMESTAMP WITH TIME ZONE,
    created_by UUID REFERENCES auth.users(id),
    updated_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- Projects table
CREATE TABLE public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    short_desc TEXT,
    body_richtext TEXT,
    cover_image TEXT,
    gallery_urls TEXT[] DEFAULT '{}',
    client TEXT,
    location TEXT,
    category TEXT,
    started_on DATE,
    completed_on DATE,
    status public.content_status DEFAULT 'draft',
    seo_title TEXT,
    seo_description TEXT,
    seo_keywords TEXT[],
    seo_og_image TEXT,
    published_at TIMESTAMP WITH TIME ZONE,
    created_by UUID REFERENCES auth.users(id),
    updated_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- Blog categories
CREATE TABLE public.blog_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    seo_title TEXT,
    seo_description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Blog tags
CREATE TABLE public.blog_tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Blog posts
CREATE TABLE public.blog_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    excerpt TEXT,
    content_richtext TEXT,
    cover_image TEXT,
    category_id UUID REFERENCES public.blog_categories(id) ON DELETE SET NULL,
    author_id UUID REFERENCES auth.users(id),
    status public.content_status DEFAULT 'draft',
    seo_title TEXT,
    seo_description TEXT,
    seo_keywords TEXT[],
    seo_og_image TEXT,
    published_at TIMESTAMP WITH TIME ZONE,
    created_by UUID REFERENCES auth.users(id),
    updated_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- Blog post tags junction table
CREATE TABLE public.blog_post_tags (
    post_id UUID REFERENCES public.blog_posts(id) ON DELETE CASCADE,
    tag_id UUID REFERENCES public.blog_tags(id) ON DELETE CASCADE,
    PRIMARY KEY (post_id, tag_id)
);

-- Enable RLS on all tables
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_post_tags ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Admins can manage all roles"
ON public.user_roles FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for services
CREATE POLICY "Anyone can view published services"
ON public.services FOR SELECT
USING (status = 'published' AND deleted_at IS NULL);

CREATE POLICY "Authenticated users can view all services"
ON public.services FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Admin/Editor can insert services"
ON public.services FOR INSERT
TO authenticated
WITH CHECK (public.is_admin_or_editor(auth.uid()));

CREATE POLICY "Admin/Editor can update services"
ON public.services FOR UPDATE
TO authenticated
USING (public.is_admin_or_editor(auth.uid()));

CREATE POLICY "Admin can delete services"
ON public.services FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for projects
CREATE POLICY "Anyone can view published projects"
ON public.projects FOR SELECT
USING (status = 'published' AND deleted_at IS NULL);

CREATE POLICY "Authenticated users can view all projects"
ON public.projects FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Admin/Editor can insert projects"
ON public.projects FOR INSERT
TO authenticated
WITH CHECK (public.is_admin_or_editor(auth.uid()));

CREATE POLICY "Admin/Editor can update projects"
ON public.projects FOR UPDATE
TO authenticated
USING (public.is_admin_or_editor(auth.uid()));

CREATE POLICY "Admin can delete projects"
ON public.projects FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for blog_categories
CREATE POLICY "Anyone can view categories"
ON public.blog_categories FOR SELECT
USING (true);

CREATE POLICY "Admin/Editor can manage categories"
ON public.blog_categories FOR ALL
TO authenticated
USING (public.is_admin_or_editor(auth.uid()));

-- RLS Policies for blog_tags
CREATE POLICY "Anyone can view tags"
ON public.blog_tags FOR SELECT
USING (true);

CREATE POLICY "Admin/Editor can manage tags"
ON public.blog_tags FOR ALL
TO authenticated
USING (public.is_admin_or_editor(auth.uid()));

-- RLS Policies for blog_posts
CREATE POLICY "Anyone can view published posts"
ON public.blog_posts FOR SELECT
USING (status = 'published' AND deleted_at IS NULL);

CREATE POLICY "Authenticated users can view all posts"
ON public.blog_posts FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authors can create posts"
ON public.blog_posts FOR INSERT
TO authenticated
WITH CHECK (
  public.has_role(auth.uid(), 'admin') OR
  public.has_role(auth.uid(), 'editor') OR
  public.has_role(auth.uid(), 'author')
);

CREATE POLICY "Authors can update own posts, Admin/Editor can update all"
ON public.blog_posts FOR UPDATE
TO authenticated
USING (
  public.is_admin_or_editor(auth.uid()) OR
  (author_id = auth.uid() AND public.has_role(auth.uid(), 'author'))
);

CREATE POLICY "Admin can delete posts"
ON public.blog_posts FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for blog_post_tags
CREATE POLICY "Anyone can view post tags"
ON public.blog_post_tags FOR SELECT
USING (true);

CREATE POLICY "Authors can manage tags on posts they can edit"
ON public.blog_post_tags FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.blog_posts
    WHERE id = post_id
    AND (
      public.is_admin_or_editor(auth.uid()) OR
      (author_id = auth.uid() AND public.has_role(auth.uid(), 'author'))
    )
  )
);

-- Indexes for performance
CREATE INDEX idx_services_slug ON public.services(slug);
CREATE INDEX idx_services_status ON public.services(status);
CREATE INDEX idx_services_deleted_at ON public.services(deleted_at);
CREATE INDEX idx_projects_slug ON public.projects(slug);
CREATE INDEX idx_projects_status ON public.projects(status);
CREATE INDEX idx_projects_deleted_at ON public.projects(deleted_at);
CREATE INDEX idx_blog_posts_slug ON public.blog_posts(slug);
CREATE INDEX idx_blog_posts_status ON public.blog_posts(status);
CREATE INDEX idx_blog_posts_deleted_at ON public.blog_posts(deleted_at);
CREATE INDEX idx_blog_posts_category ON public.blog_posts(category_id);
CREATE INDEX idx_blog_categories_slug ON public.blog_categories(slug);
CREATE INDEX idx_blog_tags_slug ON public.blog_tags(slug);

-- Trigger to update updated_at timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_services_updated_at
    BEFORE UPDATE ON public.services
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_projects_updated_at
    BEFORE UPDATE ON public.projects
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_blog_posts_updated_at
    BEFORE UPDATE ON public.blog_posts
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_blog_categories_updated_at
    BEFORE UPDATE ON public.blog_categories
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_blog_tags_updated_at
    BEFORE UPDATE ON public.blog_tags
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();