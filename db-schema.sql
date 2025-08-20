
CREATE TABLE IF NOT EXISTS users (
  id serial PRIMARY KEY,
  name varchar(256) NOT NULL,
  email varchar(256) NOT NULL UNIQUE,
  "role" text NOT NULL,
  avatar varchar(256)
);

CREATE TABLE IF NOT EXISTS contacts (
  id serial PRIMARY KEY,
  first_name varchar(256) NOT NULL,
  last_name varchar(256) NOT NULL,
  address text,
  birthday date,
  notes text,
  avatar varchar(256)
);

CREATE TABLE IF NOT EXISTS contact_organizations (
  id serial PRIMARY KEY,
  contact_id integer NOT NULL REFERENCES contacts(id),
  organization varchar(256) NOT NULL,
  designation varchar(256),
  team varchar(256) NOT NULL,
  department varchar(256)
);

CREATE TABLE IF NOT EXISTS contact_emails (
  id serial PRIMARY KEY,
  contact_id integer NOT NULL REFERENCES contacts(id),
  email varchar(256) NOT NULL
);

CREATE TYPE phone_type AS ENUM ('Telephone', 'Mobile');
CREATE TABLE IF NOT EXISTS contact_phones (
  id serial PRIMARY KEY,
  contact_id integer NOT NULL REFERENCES contacts(id),
  phone varchar(50) NOT NULL,
  "type" phone_type NOT NULL
);

CREATE TABLE IF NOT EXISTS contact_urls (
  id serial PRIMARY KEY,
  contact_id integer NOT NULL REFERENCES contacts(id),
  url varchar(256) NOT NULL
);

CREATE TABLE IF NOT EXISTS contact_social_links (
  id serial PRIMARY KEY,
  contact_id integer NOT NULL REFERENCES contacts(id),
  link varchar(256) NOT NULL
);

CREATE TABLE IF NOT EXISTS contact_associated_names (
  id serial PRIMARY KEY,
  contact_id integer NOT NULL REFERENCES contacts(id),
  "name" varchar(256) NOT NULL
);
