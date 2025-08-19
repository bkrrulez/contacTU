-- Custom migration to add birthday if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS(SELECT 1 FROM information_schema.columns WHERE table_name='contacts' AND column_name='birthday') THEN
    ALTER TABLE "contacts" ADD COLUMN "birthday" date;
  END IF;
END $$;
