-- Add 'paused' status to content_status enum if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_enum 
    WHERE enumlabel = 'paused' 
    AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'content_status')
  ) THEN
    ALTER TYPE content_status ADD VALUE 'paused';
  END IF;
END
$$;