-- This is a non-destructive seed script.
-- It will not drop or alter tables, but simply insert data if the tables are empty.

-- Insert Users
-- Passwords for all users are 'password123'
INSERT INTO users (id, name, email, password, role, profile_picture) VALUES
(1, 'Admin User', 'admin@example.com', '$2a$10$f3w.T.T.y.Z/g.B/s.G/.u6.E1ZzH9.X/lJ8.p8.J/k8.B.o.z.A', 'Admin', 'https://picsum.photos/seed/user1/100/100')
ON CONFLICT (id) DO NOTHING;

INSERT INTO users (id, name, email, password, role, profile_picture) VALUES
(2, 'Power User', 'power@example.com', '$2a$10$f3w.T.T.y.Z/g.B/s.G/.u6.E1ZzH9.X/lJ8.p8.J/k8.B.o.z.A', 'Power User', 'https://picsum.photos/seed/user2/100/100')
ON CONFLICT (id) DO NOTHING;

INSERT INTO users (id, name, email, password, role, profile_picture) VALUES
(3, 'Standard User', 'user@example.com', '$2a$10$f3w.T.T.y.Z/g.B/s.G/.u6.E1ZzH9.X/lJ8.p8.J/k8.B.o.z.A', 'Standard User', 'https://picsum.photos/seed/user3/100/100')
ON CONFLICT (id) DO NOTHING;

-- Insert Organizations
INSERT INTO organizations (id, name, address) VALUES
(1, 'Innovate Inc.', '123 Tech Park, Silicon Valley, CA'),
(2, 'Solutions Corp.', '456 Business Blvd, New York, NY'),
(3, 'Global Enterprises', '789 International Dr, London, UK')
ON CONFLICT (id) DO NOTHING;

-- Insert Teams
INSERT INTO teams (id, name) VALUES
(1, 'Engineering'),
(2, 'Sales'),
(3, 'Marketing'),
(4, 'Human Resources')
ON CONFLICT (id) DO NOTHING;

-- Associate Teams with Organizations
INSERT INTO teams_to_organizations ("teamId", "organizationId") VALUES
(1, 1), (2, 1), (3, 1), (4, 1), -- Innovate Inc. has all teams
(1, 2), (2, 2), -- Solutions Corp. has Engineering and Sales
(3, 3) -- Global Enterprises has Marketing
ON CONFLICT ("teamId", "organizationId") DO NOTHING;

-- Associate Users with Organizations
INSERT INTO users_to_organizations ("userId", "organizationId") VALUES
(1, 1), (1, 2), (1, 3), -- Admin user has access to all orgs
(2, 1), (2, 2), -- Power user has access to Innovate and Solutions
(3, 1) -- Standard user has access to Innovate Inc.
ON CONFLICT ("userId", "organizationId") DO NOTHING;

-- Insert Contacts
INSERT INTO contacts (id, "firstName", "lastName", address, birthday, notes, profile_picture, "isFavorite") VALUES
(1, 'Alice', 'Smith', '101 Innovation Dr, San Francisco, CA', '1985-05-20', 'Lead developer on Project Phoenix. Key stakeholder.', 'https://picsum.photos/seed/contact1/100/100', true),
(2, 'Bob', 'Johnson', '202 Market St, New York, NY', '1990-08-15', 'Primary sales contact for the East Coast. Loves hiking.', 'https://picsum.photos/seed/contact2/100/100', false),
(3, 'Charlie', 'Brown', '303 Regent St, London, UK', '1988-12-01', 'Marketing manager for the European region.', 'https://picsum.photos/seed/contact3/100/100', true),
(4, 'Diana', 'Prince', '404 Hero Way, Washington, DC', null, 'Met at the 2023 Tech Summit.', 'https://picsum.photos/seed/contact4/100/100', false),
(5, 'Ethan', 'Hunt', '505 Mission Rd, Los Angeles, CA', '1992-02-25', 'Specializes in impossible tasks.', 'https://picsum.photos/seed/contact5/100/100', false)
ON CONFLICT (id) DO NOTHING;

-- Insert Contact Organizations
INSERT INTO contact_organizations ("contactId", "organizationId", "teamId", designation, department) VALUES
(1, 1, 1, 'Principal Engineer', 'Core Platform'),
(2, 2, 2, 'Senior Account Executive', 'Enterprise Sales'),
(3, 3, 3, 'Director of Marketing', 'EMEA Marketing'),
(4, 1, 1, 'Software Engineer', 'Frontend'),
(5, 2, null, 'Consultant', 'Special Projects')
ON CONFLICT (id) DO NOTHING;

-- Insert Contact Emails
INSERT INTO contact_emails ("contactId", email) VALUES
(1, 'alice.smith@innovate.com'),
(1, 'asmith.dev@gmail.com'),
(2, 'bob.j@solutionscorp.com'),
(3, 'charlie.brown@globalent.co.uk'),
(4, 'diana@innovate.com'),
(5, 'ethan.hunt@solutionscorp.com')
ON CONFLICT (id) DO NOTHING;

-- Insert Contact Phones
INSERT INTO contact_phones ("contactId", phone, type) VALUES
(1, '415-555-0101', 'Mobile'),
(1, '415-555-0102', 'Telephone'),
(2, '212-555-0103', 'Mobile'),
(3, '020-7946-0104', 'Telephone'),
(4, '415-555-0105', 'Mobile'),
(5, '213-555-0106', 'Mobile')
ON CONFLICT (id) DO NOTHING;

-- Insert Contact URLs
INSERT INTO contact_urls ("contactId", url) VALUES
(1, 'https://github.com/alicesmith'),
(3, 'https://marketingblog.globalent.co.uk')
ON CONFLICT (id) DO NOTHING;

-- Insert Contact Social Links
INSERT INTO contact_social_links ("contactId", link) VALUES
(1, 'https://linkedin.com/in/alicesmith-dev'),
(2, 'https://twitter.com/bobjohnsonsales'),
(4, 'https://linkedin.com/in/dianaprince-eng')
ON CONFLICT (id) DO NOTHING;

-- Insert Contact Associated Names
INSERT INTO contact_associated_names ("contactId", name) VALUES
(2, 'Assistant: Peggy Carter')
ON CONFLICT (id) DO NOTHING;


-- Reset sequences to avoid conflicts with manual insertions if any
SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));
SELECT setval('organizations_id_seq', (SELECT MAX(id) FROM organizations));
SELECT setval('teams_id_seq', (SELECT MAX(id) FROM teams));
SELECT setval('contacts_id_seq', (SELECT MAX(id) FROM contacts));
SELECT setval('contact_organizations_id_seq', (SELECT MAX(id) FROM contact_organizations));
SELECT setval('contact_emails_id_seq', (SELECT MAX(id) FROM contact_emails));
SELECT setval('contact_phones_id_seq', (SELECT MAX(id) FROM contact_phones));
SELECT setval('contact_urls_id_seq', (SELECT MAX(id) FROM contact_urls));
SELECT setval('contact_social_links_id_seq', (SELECT MAX(id) FROM contact_social_links));
SELECT setval('contact_associated_names_id_seq', (SELECT MAX(id) FROM contact_associated_names));
SELECT setval('audit_logs_id_seq', (SELECT MAX(id) FROM audit_logs), false);
