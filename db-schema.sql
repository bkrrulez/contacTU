-- This script completely resets the database schema.
-- WARNING: This will drop all existing tables and delete all data.

DROP TABLE IF EXISTS "contact_associated_names";
DROP TABLE IF EXISTS "contact_social_links";
DROP TABLE IF EXISTS "contact_urls";
DROP TABLE IF EXISTS "contact_organizations";
DROP TABLE IF EXISTS "contact_emails";
DROP TABLE IF EXISTS "contact_phones";
DROP TABLE IF EXISTS "contacts";
DROP TABLE IF EXISTS "users";
DROP TYPE IF EXISTS "phone_type";
DROP TYPE IF EXISTS "user_role";


-- Create ENUM types
CREATE TYPE "user_role" AS ENUM ('Admin', 'Power User', 'Standard User', 'Read-Only');
CREATE TYPE "phone_type" AS ENUM ('Telephone', 'Mobile');

-- Create tables
CREATE TABLE "users" (
  "id" serial PRIMARY KEY NOT NULL,
  "name" varchar(256) NOT NULL,
  "email" varchar(256) NOT NULL,
  "role" "user_role" NOT NULL,
  "avatar" varchar(256),
  CONSTRAINT "users_email_unique" UNIQUE("email")
);

CREATE TABLE "contacts" (
  "id" serial PRIMARY KEY NOT NULL,
  "first_name" varchar(256) NOT NULL,
  "last_name" varchar(256) NOT NULL,
  "address" text,
  "birthday" date,
  "notes" text,
  "avatar" varchar(256)
);

CREATE TABLE "contact_organizations" (
  "id" serial PRIMARY KEY NOT NULL,
  "contact_id" integer NOT NULL,
  "organization" varchar(256) NOT NULL,
  "designation" varchar(256),
  "team" varchar(256) NOT NULL,
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


-- Add foreign key constraints
ALTER TABLE "contact_organizations" ADD FOREIGN KEY ("contact_id") REFERENCES "contacts"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "contact_emails" ADD FOREIGN KEY ("contact_id") REFERENCES "contacts"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "contact_phones" ADD FOREIGN KEY ("contact_id") REFERENCES "contacts"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "contact_urls" ADD FOREIGN KEY ("contact_id") REFERENCES "contacts"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "contact_social_links" ADD FOREIGN KEY ("contact_id") REFERENCES "contacts"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "contact_associated_names" ADD FOREIGN KEY ("contact_id") REFERENCES "contacts"("id") ON DELETE cascade ON UPDATE no action;
