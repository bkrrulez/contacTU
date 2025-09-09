
-- Enums
CREATE TYPE "user_role" AS ENUM ('Admin', 'Power User', 'Standard User', 'Read-Only');
CREATE TYPE "phone_type" AS ENUM ('Telephone', 'Mobile');
CREATE TYPE "audit_log_action" AS ENUM ('create', 'update', 'delete');

-- Users Table
CREATE TABLE "users" (
    "id" serial PRIMARY KEY NOT NULL,
    "name" varchar(256) NOT NULL,
    "email" varchar(256) NOT NULL,
    "password" varchar(256),
    "role" "user_role" NOT NULL,
    "avatar" varchar(256),
    "organizations" jsonb DEFAULT '[]'::jsonb,
    "reset_token" varchar(256),
    "reset_token_expiry" timestamp with time zone,
    CONSTRAINT "users_email_unique" UNIQUE("email")
);

-- Contacts Table
CREATE TABLE "contacts" (
    "id" serial PRIMARY KEY NOT NULL,
    "first_name" varchar(256) NOT NULL,
    "last_name" varchar(256) NOT NULL,
    "address" text,
    "birthday" date,
    "notes" text,
    "avatar" varchar(256),
    "is_favorite" boolean DEFAULT false NOT NULL
);

-- Contact Organizations Table
CREATE TABLE "contact_organizations" (
    "id" serial PRIMARY KEY NOT NULL,
    "contact_id" integer NOT NULL,
    "organization" varchar(256) NOT NULL,
    "designation" varchar(256),
    "team" varchar(256) NOT NULL,
    "department" varchar(256),
    "address" text
);

-- Contact Emails Table
CREATE TABLE "contact_emails" (
    "id" serial PRIMARY KEY NOT NULL,
    "contact_id" integer NOT NULL,
    "email" varchar(256) NOT NULL
);

-- Contact Phones Table
CREATE TABLE "contact_phones" (
    "id" serial PRIMARY KEY NOT NULL,
    "contact_id" integer NOT NULL,
    "phone" varchar(50) NOT NULL,
    "type" "phone_type" NOT NULL
);

-- Contact URLs Table
CREATE TABLE "contact_urls" (
    "id" serial PRIMARY KEY NOT NULL,
    "contact_id" integer NOT NULL,
    "url" varchar(256) NOT NULL
);

-- Contact Social Links Table
CREATE TABLE "contact_social_links" (
    "id" serial PRIMARY KEY NOT NULL,
    "contact_id" integer NOT NULL,
    "link" varchar(256) NOT NULL
);

-- Contact Associated Names Table
CREATE TABLE "contact_associated_names" (
    "id" serial PRIMARY KEY NOT NULL,
    "contact_id" integer NOT NULL,
    "name" varchar(256) NOT NULL
);

-- Audit Logs Table
CREATE TABLE "audit_logs" (
    "id" serial PRIMARY KEY NOT NULL,
    "user_id" integer,
    "action" "audit_log_action" NOT NULL,
    "entity_type" varchar(50) NOT NULL,
    "entity_id" integer NOT NULL,
    "details" jsonb,
    "timestamp" timestamp with time zone DEFAULT now() NOT NULL
);

-- Foreign Keys
DO $$ BEGIN
 ALTER TABLE "contact_organizations" ADD CONSTRAINT "contact_organizations_contact_id_fkey" FOREIGN KEY ("contact_id") REFERENCES "contacts"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "contact_emails" ADD CONSTRAINT "contact_emails_contact_id_fkey" FOREIGN KEY ("contact_id") REFERENCES "contacts"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "contact_phones" ADD CONSTRAINT "contact_phones_contact_id_fkey" FOREIGN KEY ("contact_id") REFERENCES "contacts"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "contact_urls" ADD CONSTRAINT "contact_urls_contact_id_fkey" FOREIGN KEY ("contact_id") REFERENCES "contacts"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "contact_social_links" ADD CONSTRAINT "contact_social_links_contact_id_fkey" FOREIGN KEY ("contact_id") REFERENCES "contacts"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "contact_associated_names" ADD CONSTRAINT "contact_associated_names_contact_id_fkey" FOREIGN KEY ("contact_id") REFERENCES "contacts"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
