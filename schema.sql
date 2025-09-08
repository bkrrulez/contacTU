
-- This script is idempotent and can be run multiple times without causing errors or data loss.

-- Create custom ENUM types only if they don't already exist.
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


-- Create tables with "IF NOT EXISTS" to prevent errors on re-runs.
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

CREATE TABLE IF NOT EXISTS contacts (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(256) NOT NULL,
    last_name VARCHAR(256) NOT NULL,
    address TEXT,
    birthday DATE,
    notes TEXT,
    avatar VARCHAR(256)
);

CREATE TABLE IF NOT EXISTS contact_organizations (
  id SERIAL PRIMARY KEY,
  contact_id INTEGER NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
  organization VARCHAR(256) NOT NULL,
  designation VARCHAR(256),
  team VARCHAR(256) NOT NULL,
  department VARCHAR(256)
);

CREATE TABLE IF NOT EXISTS contact_emails (
  id SERIAL PRIMARY KEY,
  contact_id INTEGER NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
  email VARCHAR(256) NOT NULL
);

CREATE TABLE IF NOT EXISTS contact_phones (
  id SERIAL PRIMARY KEY,
  contact_id INTEGER NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
  phone VARCHAR(50) NOT NULL,
  type phone_type NOT NULL
);

CREATE TABLE IF NOT EXISTS contact_urls (
  id SERIAL PRIMARY KEY,
  contact_id INTEGER NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
  url VARCHAR(256) NOT NULL
);

CREATE TABLE IF NOT EXISTS contact_social_links (
    id SERIAL PRIMARY KEY,
    contact_id INTEGER NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
    link VARCHAR(256) NOT NULL
);

CREATE TABLE IF NOT EXISTS contact_associated_names (
    id SERIAL PRIMARY KEY,
    contact_id INTEGER NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
    name VARCHAR(256) NOT NULL
);

CREATE TABLE IF NOT EXISTS audit_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    action audit_log_action NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id INTEGER NOT NULL,
    details JSONB,
    timestamp TIMESTAMPTZ DEFAULT NOW() NOT NULL
);


-- Add new columns with "IF NOT EXISTS" to avoid errors.
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name='contacts' AND column_name='is_favorite'
    ) THEN
        ALTER TABLE contacts ADD COLUMN is_favorite BOOLEAN DEFAULT false NOT NULL;
    END IF;
END$$;
