
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE user_role AS ENUM ('Admin', 'Power User', 'Standard User', 'Read-Only');
    END IF;
END$$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'phone_type') THEN
        CREATE TYPE phone_type AS ENUM ('Telephone', 'Mobile');
    END IF;
END$$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'audit_log_action') THEN
        CREATE TYPE audit_log_action AS ENUM ('create', 'update', 'delete');
    END IF;
END$$;

CREATE TABLE IF NOT EXISTS users (
  id serial PRIMARY KEY,
  name varchar(256) NOT NULL,
  email varchar(256) NOT NULL UNIQUE,
  password varchar(256),
  role user_role NOT NULL,
  avatar varchar(256),
  reset_token varchar(256),
  reset_token_expiry timestamp with time zone
);

CREATE TABLE IF NOT EXISTS contacts (
    id serial PRIMARY KEY,
    first_name varchar(256) NOT NULL,
    last_name varchar(256) NOT NULL,
    address text,
    birthday date,
    notes text,
    avatar varchar(256),
    is_favorite boolean NOT NULL DEFAULT false
);

CREATE TABLE IF NOT EXISTS contact_organizations (
  id serial PRIMARY KEY,
  contact_id integer NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
  organization varchar(256) NOT NULL,
  designation varchar(256),
  team varchar(256) NOT NULL,
  department varchar(256)
);

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name='contact_organizations' AND column_name='address'
    ) THEN
        ALTER TABLE contact_organizations ADD COLUMN address text;
    END IF;
END$$;

CREATE TABLE IF NOT EXISTS contact_emails (
  id serial PRIMARY KEY,
  contact_id integer NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
  email varchar(256) NOT NULL
);

CREATE TABLE IF NOT EXISTS contact_phones (
  id serial PRIMARY KEY,
  contact_id integer NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
  phone varchar(50) NOT NULL,
  type phone_type NOT NULL
);

CREATE TABLE IF NOT EXISTS contact_urls (
  id serial PRIMARY KEY,
  contact_id integer NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
  url varchar(256) NOT NULL
);

CREATE TABLE IF NOT EXISTS contact_social_links (
    id serial PRIMARY KEY,
    contact_id integer NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
    link varchar(256) NOT NULL
);

CREATE TABLE IF NOT EXISTS contact_associated_names (
    id serial PRIMARY KEY,
    contact_id integer NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
    name varchar(256) NOT NULL
);

CREATE TABLE IF NOT EXISTS audit_logs (
    id serial PRIMARY KEY,
    user_id integer REFERENCES users(id) ON DELETE SET NULL,
    action audit_log_action NOT NULL,
    entity_type varchar(50) NOT NULL,
    entity_id integer NOT NULL,
    details jsonb,
    timestamp timestamp with time zone NOT NULL DEFAULT now()
);
