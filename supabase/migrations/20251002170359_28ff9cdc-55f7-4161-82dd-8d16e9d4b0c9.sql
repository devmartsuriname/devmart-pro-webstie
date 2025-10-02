-- Add is_active column to services table if it doesn't exist
ALTER TABLE services 
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;