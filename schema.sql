-- Drop existing tables in reverse order of dependency to avoid foreign key constraints
DROP TABLE IF EXISTS "users_to_organizations";
DROP TABLE IF EXISTS "teams_to_organizations";
DROP TABLE IF EXISTS "audit_logs";
DROP TABLE IF EXISTS "contact_associated_names";
DROP TABLE IF EXISTS "contact_social_links";
DROP TABLE IF EXISTS "contact_urls";
DROP TABLE IF EXISTS "contact_phones";
DROP TABLE IF EXISTS "contact_emails";
DROP TABLE IF EXISTS "contact_organizations";
DROP TABLE IF EXISTS "contacts";
DROP TABLE IF EXISTS "users";
DROP TABLE IF EXISTS "teams";
DROP TABLE IF EXISTS "organizations";

-- Drop custom enum types
DROP TYPE IF EXISTS "user_role";
DROP TYPE IF EXISTS "phone_type";
DROP TYPE IF EXISTS "audit_log_action";

-- Create custom enum types
CREATE TYPE "user_role" AS ENUM ('Admin', 'Power User', 'Standard User', 'Read-Only');
CREATE TYPE "phone_type" AS ENUM ('Telephone', 'Mobile');
CREATE TYPE "audit_log_action" AS ENUM ('create', 'update', 'delete');

-- Create tables
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(256) NOT NULL,
	"email" varchar(256) NOT NULL,
	"password" varchar(256),
	"role" "user_role" NOT NULL,
	"avatar" varchar(256),
	"resetToken" varchar(256),
	"resetTokenExpiry" timestamp with time zone,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);

CREATE TABLE "organizations" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(256) NOT NULL,
	"address" text,
	CONSTRAINT "organizations_name_unique" UNIQUE("name")
);

CREATE TABLE "teams" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(256) NOT NULL,
	CONSTRAINT "teams_name_unique" UNIQUE("name")
);

CREATE TABLE "teams_to_organizations" (
	"teamId" integer NOT NULL,
	"organizationId" integer NOT NULL,
	CONSTRAINT "teams_to_organizations_teamId_organizationId_pk" PRIMARY KEY("teamId","organizationId")
);

CREATE TABLE "users_to_organizations" (
	"userId" integer NOT NULL,
	"organizationId" integer NOT NULL,
	CONSTRAINT "users_to_organizations_userId_organizationId_pk" PRIMARY KEY("userId","organizationId")
);

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

CREATE TABLE "contact_organizations" (
	"id" serial PRIMARY KEY NOT NULL,
	"contact_id" integer NOT NULL,
	"organization_id" integer NOT NULL,
	"team_id" integer,
	"designation" varchar(256),
	"department" varchar(256)
);

CREATE TABLE "contact_emails" (
	"id" serial PRIMARY KEY NOT NULL,
	"contact_id" integer NOT NULL,
	"email" varchar(256) NOT NULL
);

CREATE TABLE "contact_phones" (
	"id" serial PRIMARY KEY NOT NULL,
	"contact_id" integer NOT NULL,
	"phone" varchar(50) NOT NULL,
	"type" "phone_type" NOT NULL
);

CREATE TABLE "contact_urls" (
	"id" serial PRIMARY KEY NOT NULL,
	"contact_id" integer NOT NULL,
	"url" varchar(256) NOT NULL
);

CREATE TABLE "contact_social_links" (
	"id" serial PRIMARY KEY NOT NULL,
	"contact_id" integer NOT NULL,
	"link" varchar(256) NOT NULL
);

CREATE TABLE "contact_associated_names" (
	"id" serial PRIMARY KEY NOT NULL,
	"contact_id" integer NOT NULL,
	"name" varchar(256) NOT NULL
);

CREATE TABLE "audit_logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"action" "audit_log_action" NOT NULL,
	"entity_type" varchar(50) NOT NULL,
	"entity_id" integer NOT NULL,
	"details" jsonb,
	"timestamp" timestamp with time zone DEFAULT now() NOT NULL
);

-- Add foreign key constraints
DO $$ BEGIN
 ALTER TABLE "teams_to_organizations" ADD CONSTRAINT "teams_to_organizations_teamId_teams_id_fk" FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "teams_to_organizations" ADD CONSTRAINT "teams_to_organizations_organizationId_organizations_id_fk" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "users_to_organizations" ADD CONSTRAINT "users_to_organizations_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "users_to_organizations" ADD CONSTRAINT "users_to_organizations_organizationId_organizations_id_fk" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "contact_organizations" ADD CONSTRAINT "contact_organizations_contact_id_contacts_id_fk" FOREIGN KEY ("contact_id") REFERENCES "contacts"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "contact_organizations" ADD CONSTRAINT "contact_organizations_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "contact_organizations" ADD CONSTRAINT "contact_organizations_team_id_teams_id_fk" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "contact_emails" ADD CONSTRAINT "contact_emails_contact_id_contacts_id_fk" FOREIGN KEY ("contact_id") REFERENCES "contacts"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "contact_phones" ADD CONSTRAINT "contact_phones_contact_id_contacts_id_fk" FOREIGN KEY ("contact_id") REFERENCES "contacts"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "contact_urls" ADD CONSTRAINT "contact_urls_contact_id_contacts_id_fk" FOREIGN KEY ("contact_id") REFERENCES "contacts"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "contact_social_links" ADD CONSTRAINT "contact_social_links_contact_id_contacts_id_fk" FOREIGN KEY ("contact_id") REFERENCES "contacts"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "contact_associated_names" ADD CONSTRAINT "contact_associated_names_contact_id_contacts_id_fk" FOREIGN KEY ("contact_id") REFERENCES "contacts"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
