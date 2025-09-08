
-- Custom ENUM types
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE "user_role" AS ENUM ('Admin', 'Power User', 'Standard User', 'Read-Only');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'phone_type') THEN
        CREATE TYPE "phone_type" AS ENUM ('Telephone', 'Mobile');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'audit_log_action') THEN
        CREATE TYPE "audit_log_action" AS ENUM ('create', 'update', 'delete');
    END IF;
END$$;


-- Tables
CREATE TABLE IF NOT EXISTS "users" (
  "id" serial PRIMARY KEY,
  "name" varchar(256) NOT NULL,
  "email" varchar(256) NOT NULL UNIQUE,
  "password" varchar(256),
  "role" "user_role" NOT NULL,
  "avatar" varchar(256),
  "reset_token" varchar(256),
  "reset_token_expiry" timestamp WITH time zone
);

CREATE TABLE IF NOT EXISTS "contacts" (
    "id" serial PRIMARY KEY,
    "first_name" varchar(256) NOT NULL,
    "last_name" varchar(256) NOT NULL,
    "address" text,
    "birthday" date,
    "notes" text,
    "avatar" varchar(256)
);

CREATE TABLE IF NOT EXISTS "contact_organizations" (
  "id" serial PRIMARY KEY,
  "contact_id" integer NOT NULL,
  "organization" varchar(256) NOT NULL,
  "designation" varchar(256),
  "team" varchar(256) NOT NULL,
  "department" varchar(256)
);

CREATE TABLE IF NOT EXISTS "contact_emails" (
  "id" serial PRIMARY KEY,
  "contact_id" integer NOT NULL,
  "email" varchar(256) NOT NULL
);

CREATE TABLE IF NOT EXISTS "contact_phones" (
  "id" serial PRIMARY KEY,
  "contact_id" integer NOT NULL,
  "phone" varchar(50) NOT NULL,
  "type" "phone_type" NOT NULL
);

CREATE TABLE IF NOT EXISTS "contact_urls" (
  "id" serial PRIMARY KEY,
  "contact_id" integer NOT NULL,
  "url" varchar(256) NOT NULL
);

CREATE TABLE IF NOT EXISTS "contact_social_links" (
    "id" serial PRIMARY KEY,
    "contact_id" integer NOT NULL,
    "link" varchar(256) NOT NULL
);

CREATE TABLE IF NOT EXISTS "contact_associated_names" (
    "id" serial PRIMARY KEY,
    "contact_id" integer NOT NULL,
    "name" varchar(256) NOT NULL
);

CREATE TABLE IF NOT EXISTS "audit_logs" (
    "id" serial PRIMARY KEY,
    "user_id" integer,
    "action" "audit_log_action" NOT NULL,
    "entity_type" varchar(50) NOT NULL,
    "entity_id" integer NOT NULL,
    "details" jsonb,
    "timestamp" timestamp WITH time zone DEFAULT now() NOT NULL
);


-- Foreign Key Constraints
-- Note: These are separate ALTER TABLE statements to avoid errors if tables already exist.
-- We check if the constraint already exists before adding it.

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'contact_organizations_contact_id_fkey') THEN
        ALTER TABLE "contact_organizations" ADD CONSTRAINT "contact_organizations_contact_id_fkey" FOREIGN KEY ("contact_id") REFERENCES "contacts"("id") ON DELETE cascade;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'contact_emails_contact_id_fkey') THEN
        ALTER TABLE "contact_emails" ADD CONSTRAINT "contact_emails_contact_id_fkey" FOREIGN KEY ("contact_id") REFERENCES "contacts"("id") ON DELETE cascade;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'contact_phones_contact_id_fkey') THEN
        ALTER TABLE "contact_phones" ADD CONSTRAINT "contact_phones_contact_id_fkey" FOREIGN KEY ("contact_id") REFERENCES "contacts"("id") ON DELETE cascade;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'contact_urls_contact_id_fkey') THEN
        ALTER TABLE "contact_urls" ADD CONSTRAINT "contact_urls_contact_id_fkey" FOREIGN KEY ("contact_id") REFERENCES "contacts"("id") ON DELETE cascade;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'contact_social_links_contact_id_fkey') THEN
        ALTER TABLE "contact_social_links" ADD CONSTRAINT "contact_social_links_contact_id_fkey" FOREIGN KEY ("contact_id") REFERENCES "contacts"("id") ON DELETE cascade;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'contact_associated_names_contact_id_fkey') THEN
        ALTER TABLE "contact_associated_names" ADD CONSTRAINT "contact_associated_names_contact_id_fkey" FOREIGN KEY ("contact_id") REFERENCES "contacts"("id") ON DELETE cascade;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'audit_logs_user_id_fkey') THEN
        ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL;
    END IF;
END$$;
