
-- This script is generated from the Drizzle ORM schema and defines the database structure.
-- It can be used to set up a new database or to verify the existing schema.

-- Create custom ENUM types if they don't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE user_role AS ENUM ('Admin', 'Power User', 'Standard User', 'Read-Only');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'phone_type') THEN
        CREATE TYPE phone_type AS ENUM ('Telephone', 'Mobile');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'audit_log_action') THEN
        CREATE TYPE audit_log_action AS ENUM ('create', 'update', 'delete');
    END IF;
END$$;


-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(256) NOT NULL,
    email VARCHAR(256) NOT NULL UNIQUE,
    password VARCHAR(256),
    role user_role NOT NULL,
    avatar VARCHAR(256),
    reset_token VARCHAR(256),
    reset_token_expiry TIMESTAMPTZ
);

-- Create contacts table
CREATE TABLE IF NOT EXISTS contacts (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(256) NOT NULL,
    last_name VARCHAR(256) NOT NULL,
    address TEXT,
    birthday DATE,
    notes TEXT,
    avatar VARCHAR(256),
    is_favorite BOOLEAN NOT NULL DEFAULT false
);

-- Create contact_organizations table
CREATE TABLE IF NOT EXISTS contact_organizations (
    id SERIAL PRIMARY KEY,
    contact_id INTEGER NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
    organization VARCHAR(256) NOT NULL,
    designation VARCHAR(256),
    team VARCHAR(256) NOT NULL,
    department VARCHAR(256),
    address TEXT
);

-- Create contact_emails table
CREATE TABLE IF NOT EXISTS contact_emails (
    id SERIAL PRIMARY KEY,
    contact_id INTEGER NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
    email VARCHAR(256) NOT NULL
);

-- Create contact_phones table
CREATE TABLE IF NOT EXISTS contact_phones (
    id SERIAL PRIMARY KEY,
    contact_id INTEGER NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
    phone VARCHAR(50) NOT NULL,
    type phone_type NOT NULL
);

-- Create contact_urls table
CREATE TABLE IF NOT EXISTS contact_urls (
    id SERIAL PRIMARY KEY,
    contact_id INTEGER NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
    url VARCHAR(256) NOT NULL
);

-- Create contact_social_links table
CREATE TABLE IF NOT EXISTS contact_social_links (
    id SERIAL PRIMARY KEY,
    contact_id INTEGER NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
    link VARCHAR(256) NOT NULL
);

-- Create contact_associated_names table
CREATE TABLE IF NOT EXISTS contact_associated_names (
    id SERIAL PRIMARY KEY,
    contact_id INTEGER NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
    name VARCHAR(256) NOT NULL
);

-- Create audit_logs table
CREATE TABLE IF NOT EXISTS audit_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    action audit_log_action NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id INTEGER NOT NULL,
    details JSONB,
    "timestamp" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for foreign keys to improve query performance
CREATE INDEX IF NOT EXISTS idx_contact_organizations_contact_id ON contact_organizations(contact_id);
CREATE INDEX IF NOT EXISTS idx_contact_emails_contact_id ON contact_emails(contact_id);
CREATE INDEX IF NOT EXISTS idx_contact_phones_contact_id ON contact_phones(contact_id);
CREATE INDEX IF NOT EXISTS idx_contact_urls_contact_id ON contact_urls(contact_id);
CREATE INDEX IF NOT EXISTS idx_contact_social_links_contact_id ON contact_social_links(contact_id);
CREATE INDEX IF NOT EXISTS idx_contact_associated_names_contact_id ON contact_associated_names(contact_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);

