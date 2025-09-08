-- Drop existing tables and types if they exist, in reverse order of creation to handle dependencies.
-- This is useful for a clean reset during development.
DROP TABLE IF EXISTS "audit_logs";
DROP TABLE IF EXISTS "contact_associated_names";
DROP TABLE IF EXISTS "contact_social_links";
DROP TABLE IF EXISTS "contact_urls";
DROP TABLE IF EXISTS "contact_phones";
DROP TABLE IF EXISTS "contact_emails";
DROP TABLE IF EXISTS "contact_organizations";
DROP TABLE IF EXISTS "contacts";
DROP TABLE IF EXISTS "users";

DROP TYPE IF EXISTS "audit_log_action";
DROP TYPE IF EXISTS "phone_type";
DROP TYPE IF EXISTS "user_role";


-- Create ENUM types
CREATE TYPE "user_role" AS ENUM ('Admin', 'Power User', 'Standard User', 'Read-Only');
CREATE TYPE "phone_type" AS ENUM ('Telephone', 'Mobile');
CREATE TYPE "audit_log_action" AS ENUM ('create', 'update', 'delete');


-- Create users table
CREATE TABLE "users" (
    "id" serial PRIMARY KEY NOT NULL,
    "name" varchar(256) NOT NULL,
    "email" varchar(256) NOT NULL UNIQUE,
    "password" varchar(256),
    "role" "user_role" NOT NULL,
    "avatar" varchar(256),
    "reset_token" varchar(256),
    "reset_token_expiry" timestamp with time zone
);


-- Create contacts table
CREATE TABLE "contacts" (
    "id" serial PRIMARY KEY NOT NULL,
    "first_name" varchar(256) NOT NULL,
    "last_name" varchar(256) NOT NULL,
    "address" text,
    "birthday" date,
    "notes" text,
    "avatar" varchar(256)
);


-- Create contact_organizations table
CREATE TABLE "contact_organizations" (
    "id" serial PRIMARY KEY NOT NULL,
    "contact_id" integer NOT NULL,
    "organization" varchar(256) NOT NULL,
    "designation" varchar(256),
    "team" varchar(256) NOT NULL,
    "department" varchar(256),
    FOREIGN KEY ("contact_id") REFERENCES "contacts"("id") ON DELETE cascade ON UPDATE no action
);


-- Create contact_emails table
CREATE TABLE "contact_emails" (
    "id" serial PRIMARY KEY NOT NULL,
    "contact_id" integer NOT NULL,
    "email" varchar(256) NOT NULL,
    FOREIGN KEY ("contact_id") REFERENCES "contacts"("id") ON DELETE cascade ON UPDATE no action
);


-- Create contact_phones table
CREATE TABLE "contact_phones" (
    "id" serial PRIMARY KEY NOT NULL,
    "contact_id" integer NOT NULL,
    "phone" varchar(50) NOT NULL,
    "type" "phone_type" NOT NULL,
    FOREIGN KEY ("contact_id") REFERENCES "contacts"("id") ON DELETE cascade ON UPDATE no action
);


-- Create contact_urls table
CREATE TABLE "contact_urls" (
    "id" serial PRIMARY KEY NOT NULL,
    "contact_id" integer NOT NULL,
    "url" varchar(256) NOT NULL,
    FOREIGN KEY ("contact_id") REFERENCES "contacts"("id") ON DELETE cascade ON UPDATE no action
);


-- Create contact_social_links table
CREATE TABLE "contact_social_links" (
    "id" serial PRIMARY KEY NOT NULL,
    "contact_id" integer NOT NULL,
    "link" varchar(256) NOT NULL,
    FOREIGN KEY ("contact_id") REFERENCES "contacts"("id") ON DELETE cascade ON UPDATE no action
);


-- Create contact_associated_names table
CREATE TABLE "contact_associated_names" (
    "id" serial PRIMARY KEY NOT NULL,
    "contact_id" integer NOT NULL,
    "name" varchar(256) NOT NULL,
    FOREIGN KEY ("contact_id") REFERENCES "contacts"("id") ON DELETE cascade ON UPDATE no action
);


-- Create audit_logs table
CREATE TABLE "audit_logs" (
    "id" serial PRIMARY KEY NOT NULL,
    "user_id" integer,
    "action" "audit_log_action" NOT NULL,
    "entity_type" varchar(50) NOT NULL,
    "entity_id" integer NOT NULL,
    "details" jsonb,
    "timestamp" timestamp with time zone DEFAULT now() NOT NULL,
    FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE set null ON UPDATE no action
);
