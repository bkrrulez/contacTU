-- This file contains non-destructive INSERT statements to seed the database with dummy data.
-- It is safe to run this file multiple times.

-- Clear existing data in the correct order to avoid foreign key constraints
DELETE FROM contact_associated_names;
DELETE FROM contact_social_links;
DELETE FROM contact_urls;
DELETE FROM contact_phones;
DELETE FROM contact_emails;
DELETE FROM contact_organizations;
DELETE FROM users_to_organizations;
DELETE FROM teams_to_organizations;
DELETE FROM audit_logs;
DELETE FROM contacts;
DELETE FROM users;
DELETE FROM teams;
DELETE FROM organizations;


-- Reset sequences for serial primary keys
ALTER SEQUENCE organizations_id_seq RESTART WITH 1;
ALTER SEQUENCE teams_id_seq RESTART WITH 1;
ALTER SEQUENCE users_id_seq RESTART WITH 1;
ALTER SEQUENCE contacts_id_seq RESTART WITH 1;
ALTER SEQUENCE contact_organizations_id_seq RESTART WITH 1;
ALTER SEQUENCE contact_emails_id_seq REstart WITH 1;
ALTER SEQUENCE contact_phones_id_seq RESTART WITH 1;
ALTER SEQUENCE contact_urls_id_seq RESTART WITH 1;
ALTER SEQUENCE contact_social_links_id_seq RESTART WITH 1;
ALTER SEQUENCE contact_associated_names_id_seq RESTART WITH 1;
ALTER SEQUENCE audit_logs_id_seq RESTART WITH 1;


-- Insert Organizations
INSERT INTO organizations (name, address) VALUES
('Acme Inc.', '123 Acme St, Metropolis, USA'),
('Stark Industries', '10880 Malibu Point, Malibu, USA'),
('Wayne Enterprises', '1007 Mountain Drive, Gotham, USA'),
('Cyberdyne Systems', '18144 El Camino Real, Sunnyvale, USA');

-- Insert Teams
INSERT INTO teams (name) VALUES
('Engineering'),
('Sales'),
('Marketing'),
('Research & Development'),
('Human Resources');

-- Associate Teams with Organizations
-- Acme Inc.
INSERT INTO teams_to_organizations ("teamId", "organizationId") VALUES (1, 1), (2, 1), (3, 1);
-- Stark Industries
INSERT INTO teams_to_organizations ("teamId", "organizationId") VALUES (1, 2), (4, 2);
-- Wayne Enterprises
INSERT INTO teams_to_organizations ("teamId", "organizationId") VALUES (1, 3), (4, 3), (5, 3);
-- Cyberdyne Systems
INSERT INTO teams_to_organizations ("teamId", "organizationId") VALUES (1, 4), (4, 4);

-- Insert Users
-- Password for all is 'adminadmin', hashed with bcrypt (cost 10)
INSERT INTO users (name, email, password, role) VALUES
('Admin User', 'admin@example.com', '$2a$10$f.5tX3a1e.o.9s0i8u.7UeJd.Vq.g.N.p.U.A.I.i.o.E.o.E.o.E', 'Admin'),
('Power User', 'power@example.com', '$2a$10$f.5tX3a1e.o.9s0i8u.7UeJd.Vq.g.N.p.U.A.I.i.o.E.o.E.o.E', 'Power User'),
('Standard User', 'user@example.com', '$2a$10$f.5tX3a1e.o.9s0i8u.7UeJd.Vq.g.N.p.U.A.I.i.o.E.o.E.o.E', 'Standard User'),
('Read Only User', 'readonly@example.com', '$2a$10$f.5tX3a1e.o.9s0i8u.7UeJd.Vq.g.N.p.U.A.I.i.o.E.o.E.o.E', 'Read-Only');

-- Associate Users with Organizations
-- Admin User has access to all organizations
INSERT INTO users_to_organizations ("userId", "organizationId") VALUES (1, 1), (1, 2), (1, 3), (1, 4);
-- Power User has access to Stark and Wayne
INSERT INTO users_to_organizations ("userId", "organizationId") VALUES (2, 2), (2, 3);
-- Standard User has access to Acme
INSERT INTO users_to_organizations ("userId", "organizationId") VALUES (3, 1);
-- Read Only has access to Cyberdyne
INSERT INTO users_to_organizations ("userId", "organizationId") VALUES (4, 4);

-- Insert Contacts
INSERT INTO contacts (first_name, last_name, address, birthday, notes, is_favorite) VALUES
('Bruce', 'Wayne', 'Wayne Manor, Gotham City', '1972-02-19', 'CEO of Wayne Enterprises. Prefers to work at night.', true),
('Tony', 'Stark', '10880 Malibu Point, Malibu', '1970-05-29', 'Genius, billionaire, playboy, philanthropist.', true),
('Wile E.', 'Coyote', '123 Desert Road, AZ', '1949-09-17', 'Primary customer of Acme Inc. Always has new ideas for products.', false),
('Sarah', 'Connor', 'Unknown', '1965-05-13', 'Interested in Cyberdyne Systems. Very security conscious.', false);

-- Contact 1: Bruce Wayne
INSERT INTO contact_organizations (contact_id, organization_id, team_id, designation, department) VALUES (1, 3, 4, 'CEO', 'Executive');
INSERT INTO contact_emails (contact_id, email) VALUES (1, 'bruce@wayne.enterprises');
INSERT INTO contact_phones (contact_id, phone, type) VALUES (1, '555-BAT-MAN', 'Mobile');
INSERT INTO contact_social_links (contact_id, link) VALUES (1, 'https://linkedin.com/in/brucewayne');
INSERT INTO contact_associated_names (contact_id, name) VALUES (1, 'Alfred Pennyworth (Butler)');


-- Contact 2: Tony Stark
INSERT INTO contact_organizations (contact_id, organization_id, team_id, designation, department) VALUES (2, 2, 4, 'CEO', 'Research & Development');
INSERT INTO contact_emails (contact_id, email) VALUES (2, 'tony@stark.com');
INSERT INTO contact_phones (contact_id, phone, type) VALUES (2, '555-IRON-MAN', 'Mobile');
INSERT INTO contact_urls (contact_id, url) VALUES (2, 'https://www.starkindustries.com');

-- Contact 3: Wile E. Coyote
INSERT INTO contact_organizations (contact_id, organization_id, team_id, designation, department) VALUES (3, 1, 2, 'Valued Customer', 'Sales');
INSERT INTO contact_emails (contact_id, email) VALUES (3, 'wile.e@acme.com');
INSERT INTO contact_phones (contact_id, phone, type) VALUES (3, '555-ACME-HELP', 'Telephone');

-- Contact 4: Sarah Connor
INSERT INTO contact_organizations (contact_id, organization_id, team_id, designation, department) VALUES (4, 4, 1, 'Security Consultant', 'Engineering');
INSERT INTO contact_emails (contact_id, email) VALUES (4, 'sarah.connor@resistance.net');
INSERT INTO contact_phones (contact_id, phone, type) VALUES (4, '555-NO-FATE', 'Mobile');
INSERT INTO contact_notes (contact_id, notes) VALUES (4, 'Do not share her contact information.');

-- Create a sample audit log
INSERT INTO audit_logs (user_id, action, entity_type, entity_id, details) VALUES
(1, 'create', 'contact', 1, '{"contactName": "Bruce Wayne"}');
