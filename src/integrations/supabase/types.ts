export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      banners: {
        Row: {
          background_image: string | null
          created_at: string | null
          created_by: string | null
          headline: string
          id: string
          is_active: boolean | null
          page_key: string
          primary_cta_label: string | null
          primary_cta_url: string | null
          secondary_cta_label: string | null
          secondary_cta_url: string | null
          subheadline: string | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          background_image?: string | null
          created_at?: string | null
          created_by?: string | null
          headline: string
          id?: string
          is_active?: boolean | null
          page_key: string
          primary_cta_label?: string | null
          primary_cta_url?: string | null
          secondary_cta_label?: string | null
          secondary_cta_url?: string | null
          subheadline?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          background_image?: string | null
          created_at?: string | null
          created_by?: string | null
          headline?: string
          id?: string
          is_active?: boolean | null
          page_key?: string
          primary_cta_label?: string | null
          primary_cta_url?: string | null
          secondary_cta_label?: string | null
          secondary_cta_url?: string | null
          subheadline?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      blog_categories: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          seo_description: string | null
          seo_title: string | null
          slug: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          seo_description?: string | null
          seo_title?: string | null
          slug: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          seo_description?: string | null
          seo_title?: string | null
          slug?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      blog_post_tags: {
        Row: {
          post_id: string
          tag_id: string
        }
        Insert: {
          post_id: string
          tag_id: string
        }
        Update: {
          post_id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "blog_post_tags_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "blog_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blog_post_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "blog_tags"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_posts: {
        Row: {
          author_id: string | null
          category_id: string | null
          content_richtext: string | null
          cover_image: string | null
          created_at: string | null
          created_by: string | null
          deleted_at: string | null
          excerpt: string | null
          id: string
          order: number | null
          published_at: string | null
          seo_description: string | null
          seo_keywords: string[] | null
          seo_og_image: string | null
          seo_title: string | null
          slug: string
          status: Database["public"]["Enums"]["content_status"] | null
          title: string
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          author_id?: string | null
          category_id?: string | null
          content_richtext?: string | null
          cover_image?: string | null
          created_at?: string | null
          created_by?: string | null
          deleted_at?: string | null
          excerpt?: string | null
          id?: string
          order?: number | null
          published_at?: string | null
          seo_description?: string | null
          seo_keywords?: string[] | null
          seo_og_image?: string | null
          seo_title?: string | null
          slug: string
          status?: Database["public"]["Enums"]["content_status"] | null
          title: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          author_id?: string | null
          category_id?: string | null
          content_richtext?: string | null
          cover_image?: string | null
          created_at?: string | null
          created_by?: string | null
          deleted_at?: string | null
          excerpt?: string | null
          id?: string
          order?: number | null
          published_at?: string | null
          seo_description?: string | null
          seo_keywords?: string[] | null
          seo_og_image?: string | null
          seo_title?: string | null
          slug?: string
          status?: Database["public"]["Enums"]["content_status"] | null
          title?: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "blog_posts_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "blog_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_tags: {
        Row: {
          created_at: string | null
          id: string
          name: string
          slug: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          slug: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          slug?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      faq: {
        Row: {
          answer_rich: string
          category: string | null
          created_at: string | null
          created_by: string | null
          id: string
          is_active: boolean | null
          order: number | null
          question: string
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          answer_rich: string
          category?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_active?: boolean | null
          order?: number | null
          question: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          answer_rich?: string
          category?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_active?: boolean | null
          order?: number | null
          question?: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      media_library: {
        Row: {
          alt_text: string | null
          caption: string | null
          created_at: string | null
          file_size: number
          file_type: string
          filename: string
          id: string
          original_name: string
          tags: string[] | null
          thumbnail_url: string | null
          updated_at: string | null
          uploaded_by: string | null
          url: string
        }
        Insert: {
          alt_text?: string | null
          caption?: string | null
          created_at?: string | null
          file_size: number
          file_type: string
          filename: string
          id?: string
          original_name: string
          tags?: string[] | null
          thumbnail_url?: string | null
          updated_at?: string | null
          uploaded_by?: string | null
          url: string
        }
        Update: {
          alt_text?: string | null
          caption?: string | null
          created_at?: string | null
          file_size?: number
          file_type?: string
          filename?: string
          id?: string
          original_name?: string
          tags?: string[] | null
          thumbnail_url?: string | null
          updated_at?: string | null
          uploaded_by?: string | null
          url?: string
        }
        Relationships: []
      }
      menus: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: string
          is_active: boolean | null
          items: Json | null
          name: string
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_active?: boolean | null
          items?: Json | null
          name: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_active?: boolean | null
          items?: Json | null
          name?: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      pricing_plans: {
        Row: {
          created_at: string | null
          created_by: string | null
          cta_label: string | null
          cta_url: string | null
          features_excluded: string[] | null
          features_included: string[] | null
          id: string
          is_active: boolean | null
          is_featured: boolean | null
          order: number | null
          price: string
          slug: string
          subtitle: string | null
          title: string
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          cta_label?: string | null
          cta_url?: string | null
          features_excluded?: string[] | null
          features_included?: string[] | null
          id?: string
          is_active?: boolean | null
          is_featured?: boolean | null
          order?: number | null
          price: string
          slug: string
          subtitle?: string | null
          title: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          cta_label?: string | null
          cta_url?: string | null
          features_excluded?: string[] | null
          features_included?: string[] | null
          id?: string
          is_active?: boolean | null
          is_featured?: boolean | null
          order?: number | null
          price?: string
          slug?: string
          subtitle?: string | null
          title?: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      projects: {
        Row: {
          body_richtext: string | null
          category: string | null
          client: string | null
          completed_on: string | null
          cover_image: string | null
          created_at: string | null
          created_by: string | null
          deleted_at: string | null
          gallery_urls: string[] | null
          id: string
          location: string | null
          order: number | null
          published_at: string | null
          seo_description: string | null
          seo_keywords: string[] | null
          seo_og_image: string | null
          seo_title: string | null
          short_desc: string | null
          slug: string
          started_on: string | null
          status: Database["public"]["Enums"]["content_status"] | null
          tags: string[] | null
          title: string
          updated_at: string | null
          updated_by: string | null
          url: string | null
        }
        Insert: {
          body_richtext?: string | null
          category?: string | null
          client?: string | null
          completed_on?: string | null
          cover_image?: string | null
          created_at?: string | null
          created_by?: string | null
          deleted_at?: string | null
          gallery_urls?: string[] | null
          id?: string
          location?: string | null
          order?: number | null
          published_at?: string | null
          seo_description?: string | null
          seo_keywords?: string[] | null
          seo_og_image?: string | null
          seo_title?: string | null
          short_desc?: string | null
          slug: string
          started_on?: string | null
          status?: Database["public"]["Enums"]["content_status"] | null
          tags?: string[] | null
          title: string
          updated_at?: string | null
          updated_by?: string | null
          url?: string | null
        }
        Update: {
          body_richtext?: string | null
          category?: string | null
          client?: string | null
          completed_on?: string | null
          cover_image?: string | null
          created_at?: string | null
          created_by?: string | null
          deleted_at?: string | null
          gallery_urls?: string[] | null
          id?: string
          location?: string | null
          order?: number | null
          published_at?: string | null
          seo_description?: string | null
          seo_keywords?: string[] | null
          seo_og_image?: string | null
          seo_title?: string | null
          short_desc?: string | null
          slug?: string
          started_on?: string | null
          status?: Database["public"]["Enums"]["content_status"] | null
          tags?: string[] | null
          title?: string
          updated_at?: string | null
          updated_by?: string | null
          url?: string | null
        }
        Relationships: []
      }
      services: {
        Row: {
          category: string | null
          content_richtext: string | null
          created_at: string | null
          created_by: string | null
          deleted_at: string | null
          features: Json | null
          gallery_urls: string[] | null
          hero_image: string | null
          icon_url: string | null
          id: string
          order: number | null
          price_from: number | null
          published_at: string | null
          seo_description: string | null
          seo_keywords: string[] | null
          seo_og_image: string | null
          seo_title: string | null
          short_desc: string | null
          slug: string
          status: Database["public"]["Enums"]["content_status"] | null
          title: string
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          category?: string | null
          content_richtext?: string | null
          created_at?: string | null
          created_by?: string | null
          deleted_at?: string | null
          features?: Json | null
          gallery_urls?: string[] | null
          hero_image?: string | null
          icon_url?: string | null
          id?: string
          order?: number | null
          price_from?: number | null
          published_at?: string | null
          seo_description?: string | null
          seo_keywords?: string[] | null
          seo_og_image?: string | null
          seo_title?: string | null
          short_desc?: string | null
          slug: string
          status?: Database["public"]["Enums"]["content_status"] | null
          title: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          category?: string | null
          content_richtext?: string | null
          created_at?: string | null
          created_by?: string | null
          deleted_at?: string | null
          features?: Json | null
          gallery_urls?: string[] | null
          hero_image?: string | null
          icon_url?: string | null
          id?: string
          order?: number | null
          price_from?: number | null
          published_at?: string | null
          seo_description?: string | null
          seo_keywords?: string[] | null
          seo_og_image?: string | null
          seo_title?: string | null
          short_desc?: string | null
          slug?: string
          status?: Database["public"]["Enums"]["content_status"] | null
          title?: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          accent_color: string | null
          address: string | null
          analytics_id: string | null
          cloudinary_api_key: string | null
          cloudinary_cloud_name: string | null
          contact_email: string | null
          contact_phone: string | null
          default_meta_description: string | null
          default_og_image: string | null
          default_title_suffix: string | null
          facebook: string | null
          favicon: string | null
          github: string | null
          id: string
          instagram: string | null
          linkedin: string | null
          logo_dark: string | null
          logo_light: string | null
          map_embed: string | null
          primary_color: string | null
          robots_txt: string | null
          site_name: string | null
          smtp_from_email: string | null
          smtp_host: string | null
          smtp_port: number | null
          smtp_user: string | null
          twitter: string | null
          updated_at: string | null
          updated_by: string | null
          youtube: string | null
        }
        Insert: {
          accent_color?: string | null
          address?: string | null
          analytics_id?: string | null
          cloudinary_api_key?: string | null
          cloudinary_cloud_name?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          default_meta_description?: string | null
          default_og_image?: string | null
          default_title_suffix?: string | null
          facebook?: string | null
          favicon?: string | null
          github?: string | null
          id?: string
          instagram?: string | null
          linkedin?: string | null
          logo_dark?: string | null
          logo_light?: string | null
          map_embed?: string | null
          primary_color?: string | null
          robots_txt?: string | null
          site_name?: string | null
          smtp_from_email?: string | null
          smtp_host?: string | null
          smtp_port?: number | null
          smtp_user?: string | null
          twitter?: string | null
          updated_at?: string | null
          updated_by?: string | null
          youtube?: string | null
        }
        Update: {
          accent_color?: string | null
          address?: string | null
          analytics_id?: string | null
          cloudinary_api_key?: string | null
          cloudinary_cloud_name?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          default_meta_description?: string | null
          default_og_image?: string | null
          default_title_suffix?: string | null
          facebook?: string | null
          favicon?: string | null
          github?: string | null
          id?: string
          instagram?: string | null
          linkedin?: string | null
          logo_dark?: string | null
          logo_light?: string | null
          map_embed?: string | null
          primary_color?: string | null
          robots_txt?: string | null
          site_name?: string | null
          smtp_from_email?: string | null
          smtp_host?: string | null
          smtp_port?: number | null
          smtp_user?: string | null
          twitter?: string | null
          updated_at?: string | null
          updated_by?: string | null
          youtube?: string | null
        }
        Relationships: []
      }
      team: {
        Row: {
          avatar: string | null
          bio_rich: string | null
          created_at: string | null
          created_by: string | null
          github: string | null
          id: string
          instagram: string | null
          is_active: boolean | null
          linkedin: string | null
          name: string
          order: number | null
          role: string
          twitter: string | null
          updated_at: string | null
          updated_by: string | null
          website: string | null
        }
        Insert: {
          avatar?: string | null
          bio_rich?: string | null
          created_at?: string | null
          created_by?: string | null
          github?: string | null
          id?: string
          instagram?: string | null
          is_active?: boolean | null
          linkedin?: string | null
          name: string
          order?: number | null
          role: string
          twitter?: string | null
          updated_at?: string | null
          updated_by?: string | null
          website?: string | null
        }
        Update: {
          avatar?: string | null
          bio_rich?: string | null
          created_at?: string | null
          created_by?: string | null
          github?: string | null
          id?: string
          instagram?: string | null
          is_active?: boolean | null
          linkedin?: string | null
          name?: string
          order?: number | null
          role?: string
          twitter?: string | null
          updated_at?: string | null
          updated_by?: string | null
          website?: string | null
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          author_name: string
          author_role: string
          avatar: string | null
          company: string | null
          created_at: string | null
          created_by: string | null
          id: string
          is_active: boolean | null
          order: number | null
          quote: string
          rating: number | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          author_name: string
          author_role: string
          avatar?: string | null
          company?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_active?: boolean | null
          order?: number | null
          quote: string
          rating?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          author_name?: string
          author_role?: string
          avatar?: string | null
          company?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_active?: boolean | null
          order?: number | null
          quote?: string
          rating?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin_or_editor: {
        Args: { _user_id: string }
        Returns: boolean
      }
      is_super_admin_or_admin: {
        Args: { _user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "editor" | "author" | "viewer" | "super_admin"
      content_status: "draft" | "published" | "archived"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "editor", "author", "viewer", "super_admin"],
      content_status: ["draft", "published", "archived"],
    },
  },
} as const
