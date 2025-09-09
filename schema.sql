-- Enums
CREATE TYPE "user_role" AS ENUM ('Admin', 'Power User', 'Standard User', 'Read-Only');
CREATE TYPE "phone_type" AS ENUM ('Telephone', 'Mobile');
CREATE TYPE "audit_log_action" AS ENUM ('create', 'update', 'delete');

-- Tables
CREATE TABLE "users" (
  "id" SERIAL PRIMARY KEY,
  "name" VARCHAR(256) NOT NULL,
  "email" VARCHAR(256) NOT NULL UNIQUE,
  "password" VARCHAR(256),
  "role" "user_role" NOT NULL,
  "avatar" VARCHAR(256),
  "organizations" JSONB DEFAULT '[]',
  "reset_token" VARCHAR(256),
  "reset_token_expiry" TIMESTAMPTZ
);

CREATE TABLE "contacts" (
  "id" SERIAL PRIMARY KEY,
  "first_name" VARCHAR(256) NOT NULL,
  "last_name" VARCHAR(256) NOT NULL,
  "address" TEXT,
  "birthday" DATE,
  "notes" TEXT,
  "avatar" VARCHAR(256),
  "is_favorite" BOOLEAN DEFAULT false NOT NULL
);

CREATE TABLE "contact_organizations" (
  "id" SERIAL PRIMARY KEY,
  "contact_id" INTEGER NOT NULL,
  "organization" VARCHAR(256) NOT NULL,
  "designation" VARCHAR(256),
  "team" VARCHAR(256) NOT NULL,
  "department" VARCHAR(256),
  "address" TEXT
);

CREATE TABLE "contact_emails" (
  "id" SERIAL PRIMARY KEY,
  "contact_id" INTEGER NOT NULL,
  "email" VARCHAR(256) NOT NULL
);

CREATE TABLE "contact_phones" (
  "id" SERIAL PRIMARY KEY,
  "contact_id" INTEGER NOT NULL,
  "phone" VARCHAR(50) NOT NULL,
  "type" "phone_type" NOT NULL
);

CREATE TABLE "contact_urls" (
  "id" SERIAL PRIMARY KEY,
  "contact_id" INTEGER NOT NULL,
  "url" VARCHAR(256) NOT NULL
);

CREATE TABLE "contact_social_links" (
  "id" SERIAL PRIMARY KEY,
  "contact_id" INTEGER NOT NULL,
  "link" VARCHAR(256) NOT NULL
);

CREATE TABLE "contact_associated_names" (
  "id"SERIAL PRIMARY KEY,
  "contact_id" INTEGER NOT NULL,
  "name" VARCHAR(256) NOT NULL
);

CREATE TABLE "audit_logs" (
    "id" SERIAL PRIMARY KEY,
    "user_id" INTEGER,
    "action" "audit_log_action" NOT NULL,
    "entity_type" VARCHAR(50) NOT NULL,
    "entity_id" INTEGER NOT NULL,
    "details" JSONB,
    "timestamp" TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Foreign Key Constraints
ALTER TABLE "contact_organizations" ADD FOREIGN KEY ("contact_id") REFERENCES "contacts" ("id") ON DELETE cascade;
ALTER TABLE "contact_emails" ADD FOREIGN KEY ("contact_id") REFERENCES "contacts" ("id") ON DELETE cascade;
ALTER TABLE "contact_phones" ADD FOREIGN KEY ("contact_id") REFERENCES "contacts" ("id") ON DELETE cascade;
ALTER TABLE "contact_urls" ADD FOREIGN KEY ("contact_id") REFERENCES "contacts" ("id") ON DELETE cascade;
ALTER TABLE "contact_social_links" ADD FOREIGN KEY ("contact_id") REFERENCES "contacts" ("id") ON DELETE cascade;
ALTER TABLE "contact_associated_names" ADD FOREIGN KEY ("contact_id") REFERENCES "contacts" ("id") ON DELETE cascade;
ALTER TABLE "audit_logs" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE SET NULL;
