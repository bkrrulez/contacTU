
-- This script is designed to be non-destructive.
-- It adds columns if they don't exist, ensuring the database schema matches the application code.

-- Users Table
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "name" VARCHAR(256) NOT NULL;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "email" VARCHAR(256) NOT NULL;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "password" VARCHAR(256);
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "role" VARCHAR(50); -- Assuming user_role enum type exists
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "profile_picture" TEXT;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "reset_token" VARCHAR(256);
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "reset_token_expiry" TIMESTAMPTZ;
ALTER TABLE "users" DROP COLUMN IF EXISTS "avatar";

-- Organizations Table
ALTER TABLE "organizations" ADD COLUMN IF NOT EXISTS "name" VARCHAR(256) NOT NULL;
ALTER TABLE "organizations" ADD COLUMN IF NOT EXISTS "address" TEXT;

-- Teams Table
ALTER TABLE "teams" ADD COLUMN IF NOT EXISTS "name" VARCHAR(256) NOT NULL;

-- Contacts Table
ALTER TABLE "contacts" ADD COLUMN IF NOT EXISTS "first_name" VARCHAR(256) NOT NULL;
ALTER TABLE "contacts" ADD COLUMN IF NOT EXISTS "last_name" VARCHAR(256) NOT NULL;
ALTER TABLE "contacts" ADD COLUMN IF NOT EXISTS "address" TEXT;
ALTER TABLE "contacts" ADD COLUMN IF NOT EXISTS "birthday" DATE;
ALTER TABLE "contacts" ADD COLUMN IF NOT EXISTS "notes" TEXT;
ALTER TABLE "contacts" ADD COLUMN IF NOT EXISTS "profile_picture" TEXT;
ALTER TABLE "contacts" ADD COLUMN IF NOT EXISTS "is_favorite" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "contacts" DROP COLUMN IF EXISTS "avatar";

-- Contact Organizations Table
ALTER TABLE "contact_organizations" ADD COLUMN IF NOT EXISTS "contact_id" INTEGER NOT NULL;
ALTER TABLE "contact_organizations" ADD COLUMN IF NOT EXISTS "organization_id" INTEGER NOT NULL;
ALTER TABLE "contact_organizations" ADD COLUMN IF NOT EXISTS "team_id" INTEGER;
ALTER TABLE "contact_organizations" ADD COLUMN IF NOT EXISTS "designation" VARCHAR(256);
ALTER TABLE "contact_organizations" ADD COLUMN IF NOT EXISTS "department" VARCHAR(256);

-- Contact Emails Table
ALTER TABLE "contact_emails" ADD COLUMN IF NOT EXISTS "contact_id" INTEGER NOT NULL;
ALTER TABLE "contact_emails" ADD COLUMN IF NOT EXISTS "email" VARCHAR(256) NOT NULL;

-- Contact Phones Table
ALTER TABLE "contact_phones" ADD COLUMN IF NOT EXISTS "contact_id" INTEGER NOT NULL;
ALTER TABLE "contact_phones" ADD COLUMN IF NOT EXISTS "phone" VARCHAR(50) NOT NULL;
ALTER TABLE "contact_phones" ADD COLUMN IF NOT EXISTS "type" VARCHAR(50); -- Assuming phone_type enum exists

-- Contact URLs Table
ALTER TABLE "contact_urls" ADD COLUMN IF NOT EXISTS "contact_id" INTEGER NOT NULL;
ALTER TABLE "contact_urls" ADD COLUMN IF NOT EXISTS "url" VARCHAR(256) NOT NULL;

-- Contact Social Links Table
ALTER TABLE "contact_social_links" ADD COLUMN IF NOT EXISTS "contact_id" INTEGER NOT NULL;
ALTER TABLE "contact_social_links" ADD COLUMN IF NOT EXISTS "link" VARCHAR(256) NOT NULL;

-- Contact Associated Names Table
ALTER TABLE "contact_associated_names" ADD COLUMN IF NOT EXISTS "contact_id" INTEGER NOT NULL;
ALTER TABLE "contact_associated_names" ADD COLUMN IF NOT EXISTS "name" VARCHAR(256) NOT NULL;

-- Audit Logs Table
ALTER TABLE "audit_logs" ADD COLUMN IF NOT EXISTS "user_id" INTEGER;
ALTER TABLE "audit_logs" ADD COLUMN IF NOT EXISTS "action" VARCHAR(50) NOT NULL; -- Assuming audit_log_action enum exists
ALTER TABLE "audit_logs" ADD COLUMN IF NOT EXISTS "entity_type" VARCHAR(50) NOT NULL;
ALTER TABLE "audit_logs" ADD COLUMN IF NOT EXISTS "entity_id" INTEGER NOT NULL;
ALTER TABLE "audit_logs" ADD COLUMN IF NOT EXISTS "details" JSONB;
ALTER TABLE "audit_logs" ADD COLUMN IF NOT EXISTS "timestamp" TIMESTAMPTZ NOT NULL DEFAULT now();

-- Note: This script does not create tables, constraints, or indexes.
-- It assumes the tables exist but may be missing columns.
-- You will need to execute this script against your database.
