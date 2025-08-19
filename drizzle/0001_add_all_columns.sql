-- This migration adds columns that might be missing if the initial schema was created before they were added.
-- It serves as a catch-all to ensure the database is up-to-date.

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='contacts' AND column_name='birthday') THEN
    ALTER TABLE "contacts" ADD COLUMN "birthday" date;
  END IF;
END
$$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='contact_organizations' AND column_name='team') THEN
    ALTER TABLE "contact_organizations" ADD COLUMN "team" varchar(256);
  END IF;
END
$$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='contact_organizations' AND column_name='department') THEN
    ALTER TABLE "contact_organizations" ADD COLUMN "department" varchar(256);
  END IF;
END
$$;
