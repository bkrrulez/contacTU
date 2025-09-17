-- Drop existing tables and types to start fresh
DROP TABLE IF EXISTS "users_to_organizations", "teams_to_organizations", "contact_organizations", "contact_emails", "contact_phones", "contact_urls", "contact_social_links", "contact_associated_names", "audit_logs", "contacts", "users", "teams", "organizations" CASCADE;
DROP TYPE IF EXISTS "user_role", "phone_type", "audit_log_action";

-- Create Enums
CREATE TYPE "user_role" AS ENUM ('Admin', 'Power User', 'Standard User', 'Read-Only');
CREATE TYPE "phone_type" AS ENUM ('Telephone', 'Mobile');
CREATE TYPE "audit_log_action" AS ENUM ('create', 'update', 'delete');

-- Create Tables
CREATE TABLE "users" (
  "id" serial PRIMARY KEY,
  "name" varchar(256) NOT NULL,
  "email" varchar(256) NOT NULL UNIQUE,
  "password" varchar(256),
  "role" "user_role" NOT NULL,
  "profile_picture" text,
  "reset_token" varchar(256),
  "reset_token_expiry" timestamp WITH time zone
);

CREATE TABLE "organizations" (
  "id" serial PRIMARY KEY,
  "name" varchar(256) NOT NULL UNIQUE,
  "address" text
);

CREATE TABLE "teams" (
  "id" serial PRIMARY KEY,
  "name" varchar(256) NOT NULL UNIQUE
);

CREATE TABLE "teams_to_organizations" (
  "team_id" integer NOT NULL REFERENCES "teams"("id") ON DELETE CASCADE,
  "organization_id" integer NOT NULL REFERENCES "organizations"("id") ON DELETE CASCADE,
  PRIMARY KEY ("team_id", "organization_id")
);

CREATE TABLE "users_to_organizations" (
  "user_id" integer NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "organization_id" integer NOT NULL REFERENCES "organizations"("id") ON DELETE CASCADE,
  PRIMARY KEY ("user_id", "organization_id")
);

CREATE TABLE "contacts" (
  "id" serial PRIMARY KEY,
  "first_name" varchar(256) NOT NULL,
  "last_name" varchar(256) NOT NULL,
  "address" text,
  "birthday" date,
  "notes" text,
  "profile_picture" text,
  "is_favorite" boolean NOT NULL DEFAULT false
);

CREATE TABLE "contact_organizations" (
  "id" serial PRIMARY KEY,
  "contact_id" integer NOT NULL REFERENCES "contacts"("id") ON DELETE CASCADE,
  "organization_id" integer NOT NULL REFERENCES "organizations"("id") ON DELETE CASCADE,
  "team_id" integer REFERENCES "teams"("id") ON DELETE SET NULL,
  "designation" varchar(256),
  "department" varchar(256)
);

CREATE TABLE "contact_emails" (
  "id" serial PRIMARY KEY,
  "contact_id" integer NOT NULL REFERENCES "contacts"("id") ON DELETE CASCADE,
  "email" varchar(256) NOT NULL
);

CREATE TABLE "contact_phones" (
  "id" serial PRIMARY KEY,
  "contact_id" integer NOT NULL REFERENCES "contacts"("id") ON DELETE CASCADE,
  "phone" varchar(50) NOT NULL,
  "type" "phone_type" NOT NULL
);

CREATE TABLE "contact_urls" (
  "id" serial PRIMARY KEY,
  "contact_id" integer NOT NULL REFERENCES "contacts"("id") ON DELETE CASCADE,
  "url" varchar(256) NOT NULL
);

CREATE TABLE "contact_social_links" (
  "id" serial PRIMARY KEY,
  "contact_id" integer NOT NULL REFERENCES "contacts"("id") ON DELETE CASCADE,
  "link" varchar(256) NOT NULL
);

CREATE TABLE "contact_associated_names" (
  "id" serial PRIMARY KEY,
  "contact_id" integer NOT NULL REFERENCES "contacts"("id") ON DELETE CASCADE,
  "name" varchar(256) NOT NULL
);

CREATE TABLE "audit_logs" (
  "id" serial PRIMARY KEY,
  "user_id" integer REFERENCES "users"("id") ON DELETE SET NULL,
  "action" "audit_log_action" NOT NULL,
  "entity_type" varchar(50) NOT NULL,
  "entity_id" integer NOT NULL,
  "details" jsonb,
  "timestamp" timestamp WITH time zone NOT NULL DEFAULT now()
);

-- Seed Data
\set admin_email `echo $NEXT_PUBLIC_ADMIN_EMAIL`
\set admin_password `echo $NEXT_PUBLIC_ADMIN_PASSWORD`

-- Note: The following password hashes are for demonstration purposes only.
-- 'password123' -> $2a$10$f.w2C0n.4s2z7.G...
-- The admin password will be set from the environment variable.
-- This approach is not secure for production. Use a proper secret management system.

INSERT INTO "users" ("name", "email", "password", "role") VALUES
('Admin User', current_setting('vars.admin_email'), crypt(current_setting('vars.admin_password'), gen_salt('bf')), 'Admin'),
('Alice Johnson', 'alice@example.com', '$2a$10$f.w2C0n.4s2z7.GsY0pOMeM9yOUZxL3Cq9L/n7E.dCj9B7P8k7zIa', 'Power User'),
('Bob Williams', 'bob@example.com', '$2a$10$f.w2C0n.4s2z7.GsY0pOMeM9yOUZxL3Cq9L/n7E.dCj9B7P8k7zIa', 'Standard User'),
('Charlie Brown', 'charlie@example.com', '$2a$10$f.w2C0n.4s2z7.GsY0pOMeM9yOUZxL3Cq9L/n7E.dCj9B7P8k7zIa', 'Read-Only');

INSERT INTO "organizations" ("name", "address") VALUES
('Acme Corp', '123 Acme St, Tech City'),
('Tech Solutions', '456 Tech Ave, Innovation Valley'),
('WebWeavers', '789 Design Dr, Creative Corner');

INSERT INTO "teams" ("name") VALUES
('Platform'),
('Core Products'),
('Marketing'),
('Engineering'),
('Product'),
('Design');

-- Link Users to Orgs
INSERT INTO "users_to_organizations" ("user_id", "organization_id")
SELECT u.id, o.id FROM "users" u, "organizations" o WHERE u.email = current_setting('vars.admin_email');

INSERT INTO "users_to_organizations" ("user_id", "organization_id") VALUES
((SELECT id FROM "users" WHERE email = 'alice@example.com'), (SELECT id FROM "organizations" WHERE name = 'Acme Corp')),
((SELECT id FROM "users" WHERE email = 'alice@example.com'), (SELECT id FROM "organizations" WHERE name = 'Tech Solutions'));

INSERT INTO "users_to_organizations" ("user_id", "organization_id") VALUES
((SELECT id FROM "users" WHERE email = 'bob@example.com'), (SELECT id FROM "organizations" WHERE name = 'WebWeavers'));

INSERT INTO "users_to_organizations" ("user_id", "organization_id")
SELECT u.id, o.id FROM "users" u, "organizations" o WHERE u.email = 'charlie@example.com';

-- Link Teams to Orgs
INSERT INTO "teams_to_organizations" ("organization_id", "team_id") VALUES
((SELECT id FROM "organizations" WHERE name = 'Acme Corp'), (SELECT id FROM "teams" WHERE name = 'Platform')),
((SELECT id FROM "organizations" WHERE name = 'Acme Corp'), (SELECT id FROM "teams" WHERE name = 'Engineering')),
((SELECT id FROM "organizations" WHERE name = 'Tech Solutions'), (SELECT id FROM "teams" WHERE name = 'Core Products')),
((SELECT id FROM "organizations" WHERE name = 'Tech Solutions'), (SELECT id FROM "teams" WHERE name = 'Product')),
((SELECT id FROM "organizations" WHERE name = 'WebWeavers'), (SELECT id FROM "teams" WHERE name = 'Marketing')),
((SELECT id FROM "organizations" WHERE name = 'WebWeavers'), (SELECT id FROM "teams" WHERE name = 'Design'));


-- Seed Contacts
WITH inserted_contact AS (
  INSERT INTO "contacts" ("first_name", "last_name", "address", "birthday", "notes", "profile_picture") VALUES
  ('John', 'Doe', '123 Acme St, Tech City', '1985-05-15', 'Key contact for Project Titan.', 'https://picsum.photos/seed/1/100/100')
  RETURNING id
)
INSERT INTO "contact_organizations" ("contact_id", "organization_id", "team_id", "designation", "department")
SELECT id, (SELECT id FROM "organizations" WHERE name = 'Acme Corp'), (SELECT id FROM "teams" WHERE name = 'Platform'), 'Lead Engineer', 'Engineering' FROM inserted_contact;

WITH inserted_contact AS (
  INSERT INTO "contacts" ("first_name", "last_name", "address", "birthday", "notes", "profile_picture") VALUES
  ('John', 'Doe', '123 Acme St, Tech City', '1985-05-15', 'Key contact for Project Titan.', 'https://picsum.photos/seed/1/100/100')
  RETURNING id
)
INSERT INTO "contact_emails" ("contact_id", "email")
SELECT id, 'john.doe@acmecorp.com' FROM inserted_contact;

WITH inserted_contact AS (
  INSERT INTO "contacts" ("first_name", "last_name", "address", "birthday", "notes", "profile_picture") VALUES
  ('John', 'Doe', '123 Acme St, Tech City', '1985-05-15', 'Key contact for Project Titan.', 'https://picsum.photos/seed/1/100/100')
  RETURNING id
)
INSERT INTO "contact_phones" ("contact_id", "phone", "type") VALUES
((SELECT id FROM inserted_contact), '123-456-7890', 'Telephone'),
((SELECT id FROM inserted_contact), '098-765-4321', 'Mobile');

WITH inserted_contact AS (
  INSERT INTO "contacts" ("first_name", "last_name", "address", "birthday", "notes", "profile_picture") VALUES
  ('John', 'Doe', '123 Acme St, Tech City', '1985-05-15', 'Key contact for Project Titan.', 'https://picsum.photos/seed/1/100/100')
  RETURNING id
)
INSERT INTO "contact_urls" ("contact_id", "url") SELECT id, 'https://acmecorp.com' FROM inserted_contact;

WITH inserted_contact AS (
  INSERT INTO "contacts" ("first_name", "last_name", "address", "birthday", "notes", "profile_picture") VALUES
  ('John', 'Doe', '123 Acme St, Tech City', '1985-05-15', 'Key contact for Project Titan.', 'https://picsum.photos/seed/1/100/100')
  RETURNING id
)
INSERT INTO "contact_social_links" ("contact_id", "link") SELECT id, 'https://www.linkedin.com/in/johndoe' FROM inserted_contact;

WITH inserted_contact AS (
  INSERT INTO "contacts" ("first_name", "last_name", "address", "birthday", "notes", "profile_picture") VALUES
  ('John', 'Doe', '123 Acme St, Tech City', '1985-05-15', 'Key contact for Project Titan.', 'https://picsum.photos/seed/1/100/100')
  RETURNING id
)
INSERT INTO "contact_associated_names" ("contact_id", "name") SELECT id, 'Assistant Jane' FROM inserted_contact;

-- Contact 2
WITH inserted_contact AS (
  INSERT INTO "contacts" ("first_name", "last_name", "address", "profile_picture") VALUES
  ('Jane', 'Smith', '456 Tech Ave, Innovation Valley', 'https://picsum.photos/seed/2/100/100')
  RETURNING id
)
INSERT INTO "contact_organizations" ("contact_id", "organization_id", "team_id", "designation", "department")
SELECT id, (SELECT id FROM "organizations" WHERE name = 'Tech Solutions'), (SELECT id FROM "teams" WHERE name = 'Core Products'), 'Project Manager', 'Product' FROM inserted_contact;

WITH inserted_contact AS (
  INSERT INTO "contacts" ("first_name", "last_name", "address", "profile_picture") VALUES
  ('Jane', 'Smith', '456 Tech Ave, Innovation Valley', 'https://picsum.photos/seed/2/100/100')
  RETURNING id
)
INSERT INTO "contact_emails" ("contact_id", "email")
SELECT id, 'jane.smith@techsolutions.io' FROM inserted_contact;

WITH inserted_contact AS (
  INSERT INTO "contacts" ("first_name", "last_name", "address", "profile_picture") VALUES
  ('Jane', 'Smith', '456 Tech Ave, Innovation Valley', 'https://picsum.photos/seed/2/100/100')
  RETURNING id
)
INSERT INTO "contact_phones" ("contact_id", "phone", "type") VALUES
((SELECT id FROM inserted_contact), '234-567-8901', 'Telephone');

-- Contact 3
WITH inserted_contact AS (
  INSERT INTO "contacts" ("first_name", "last_name", "notes", "profile_picture") VALUES
  ('Sam', 'Wilson', 'Met at the design conference.', 'https://picsum.photos/seed/3/100/100')
  RETURNING id
)
INSERT INTO "contact_organizations" ("contact_id", "organization_id", "team_id", "designation", "department")
SELECT id, (SELECT id FROM "organizations" WHERE name = 'WebWeavers'), (SELECT id FROM "teams" WHERE name = 'Marketing'), 'UX/UI Designer', 'Design' FROM inserted_contact;

WITH inserted_contact AS (
  INSERT INTO "contacts" ("first_name", "last_name", "notes", "profile_picture") VALUES
  ('Sam', 'Wilson', 'Met at the design conference.', 'https://picsum.photos/seed/3/100/100')
  RETURNING id
)
INSERT INTO "contact_emails" ("contact_id", "email")
SELECT id, 'sam.wilson@webweavers.dev' FROM inserted_contact;

WITH inserted_contact AS (
  INSERT INTO "contacts" ("first_name", "last_name", "notes", "profile_picture") VALUES
  ('Sam', 'Wilson', 'Met at the design conference.', 'https://picsum.photos/seed/3/100/100')
  RETURNING id
)
INSERT INTO "contact_phones" ("contact_id", "phone", "type") VALUES
((SELECT id FROM inserted_contact), '345-678-9012', 'Mobile');
