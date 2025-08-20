CREATE TABLE IF NOT EXISTS "contact_associated_names" (
	"id" serial PRIMARY KEY NOT NULL,
	"contact_id" integer NOT NULL,
	"name" varchar(256) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "contact_emails" (
	"id" serial PRIMARY KEY NOT NULL,
	"contact_id" integer NOT NULL,
	"email" varchar(256) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "contact_organizations" (
	"id" serial PRIMARY KEY NOT NULL,
	"contact_id" integer NOT NULL,
	"organization" varchar(256) NOT NULL,
	"designation" varchar(256),
	"team" varchar(256) NOT NULL,
	"department" varchar(256)
);
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."phone_type" AS ENUM('Telephone', 'Mobile');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "contact_phones" (
	"id" serial PRIMARY KEY NOT NULL,
	"contact_id" integer NOT NULL,
	"phone" varchar(50) NOT NULL,
	"type" "phone_type" NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "contact_social_links" (
	"id" serial PRIMARY KEY NOT NULL,
	"contact_id" integer NOT NULL,
	"link" varchar(256) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "contact_urls" (
	"id" serial PRIMARY KEY NOT NULL,
	"contact_id" integer NOT NULL,
	"url" varchar(256) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "contacts" (
	"id" serial PRIMARY KEY NOT NULL,
	"first_name" varchar(256) NOT NULL,
	"last_name" varchar(256) NOT NULL,
	"address" text,
	"birthday" date,
	"notes" text,
	"avatar" varchar(256)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(256) NOT NULL,
	"email" varchar(256) NOT NULL,
	"role" text NOT NULL,
	"avatar" varchar(256),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "contact_associated_names" ADD CONSTRAINT "contact_associated_names_contact_id_contacts_id_fk" FOREIGN KEY ("contact_id") REFERENCES "public"."contacts"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "contact_emails" ADD CONSTRAINT "contact_emails_contact_id_contacts_id_fk" FOREIGN KEY ("contact_id") REFERENCES "public"."contacts"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "contact_organizations" ADD CONSTRAINT "contact_organizations_contact_id_contacts_id_fk" FOREIGN KEY ("contact_id") REFERENCES "public"."contacts"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "contact_phones" ADD CONSTRAINT "contact_phones_contact_id_contacts_id_fk" FOREIGN KEY ("contact_id") REFERENCES "public"."contacts"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "contact_social_links" ADD CONSTRAINT "contact_social_links_contact_id_contacts_id_fk" FOREIGN KEY ("contact_id") REFERENCES "public"."contacts"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "contact_urls" ADD CONSTRAINT "contact_urls_contact_id_contacts_id_fk" FOREIGN KEY ("contact_id") REFERENCES "public"."contacts"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
