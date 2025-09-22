-- This is a non-destructive migration script.
-- It adds columns if they don't exist, ensuring data is preserved.

-- Add user_role enum if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE user_role AS ENUM ('Admin', 'Power User', 'Standard User', 'Read-Only');
    END IF;
END$$;

-- Add phone_type enum if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'phone_type') THEN
        CREATE TYPE phone_type AS ENUM ('Telephone', 'Mobile');
    END IF;
END$$;

-- Add audit_log_action enum if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'audit_log_action') THEN
        CREATE TYPE audit_log_action AS ENUM ('create', 'update', 'delete');
    END IF;
END$$;


-- Create tables if they do not exist
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(256) NOT NULL,
    email VARCHAR(256) NOT NULL UNIQUE,
    password VARCHAR(256),
    role user_role NOT NULL,
    profile_picture TEXT,
    reset_token VARCHAR(256),
    reset_token_expiry TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS organizations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(256) NOT NULL UNIQUE,
    address TEXT
);

CREATE TABLE IF NOT EXISTS teams (
    id SERIAL PRIMARY KEY,
    name VARCHAR(256) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS teams_to_organizations (
    "teamId" INTEGER NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    "organizationId" INTEGER NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    PRIMARY KEY ("teamId", "organizationId")
);

CREATE TABLE IF NOT EXISTS users_to_organizations (
    "userId" INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    "organizationId" INTEGER NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    PRIMARY KEY ("userId", "organizationId")
);

CREATE TABLE IF NOT EXISTS contacts (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(256) NOT NULL,
    last_name VARCHAR(256) NOT NULL,
    address TEXT,
    birthday DATE,
    notes TEXT,
    profile_picture TEXT,
    is_favorite BOOLEAN NOT NULL DEFAULT false
);

CREATE TABLE IF NOT EXISTS contact_organizations (
    id SERIAL PRIMARY KEY,
    contact_id INTEGER NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
    organization_id INTEGER NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    team_id INTEGER REFERENCES teams(id) ON DELETE SET NULL,
    designation VARCHAR(256),
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
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- Add missing columns to existing tables
DO $$
BEGIN
    -- users table
    IF NOT EXISTS (SELECT FROM pg_attribute WHERE attrelid = 'users'::regclass AND attname = 'profile_picture' AND NOT attisdropped) THEN
        ALTER TABLE users ADD COLUMN profile_picture TEXT;
    END IF;
    IF EXISTS (SELECT FROM pg_attribute WHERE attrelid = 'users'::regclass AND attname = 'avatar' AND NOT attisdropped) THEN
        ALTER TABLE users RENAME COLUMN avatar TO profile_picture;
    END IF;

    -- contacts table
    IF NOT EXISTS (SELECT FROM pg_attribute WHERE attrelid = 'contacts'::regclass AND attname = 'profile_picture' AND NOT attisdropped) THEN
        ALTER TABLE contacts ADD COLUMN profile_picture TEXT;
    END IF;
    IF EXISTS (SELECT FROM pg_attribute WHERE attrelid = 'contacts'::regclass AND attname = 'avatar' AND NOT attisdropped) THEN
        ALTER TABLE contacts RENAME COLUMN avatar TO profile_picture;
    END IF;

    IF NOT EXISTS (SELECT FROM pg_attribute WHERE attrelid = 'contacts'::regclass AND attname = 'is_favorite' AND NOT attisdropped) THEN
        ALTER TABLE contacts ADD COLUMN is_favorite BOOLEAN NOT NULL DEFAULT false;
    END IF;

END$$;