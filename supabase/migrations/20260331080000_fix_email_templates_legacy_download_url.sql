DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'email_templates'
      AND column_name = 'download_url'
  ) THEN
    ALTER TABLE public.email_templates
      ALTER COLUMN download_url DROP NOT NULL;
  END IF;
END $$;
