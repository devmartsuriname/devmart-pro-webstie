-- Add super_admin to app_role enum
ALTER TYPE app_role ADD VALUE IF NOT EXISTS 'super_admin';