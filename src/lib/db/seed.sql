-- This script contains non-destructive INSERT statements to populate the database with dummy data.

-- Insert Dummy Users
INSERT INTO users (name, email, password, role) VALUES
('Bikramjit Chowdhury', 'admin@example.com', '$2a$10$wK.1q.f.2Y/J5C.3jJ/l2OJT.V8X.j2x.1q/Y5.z.Y5.z.Y5.z.Y5', 'Admin'),
('Power User', 'power@example.com', '$2a$10$wK.1q.f.2Y/J5C.3jJ/l2OJT.V8X.j2x.1q/Y5.z.Y5.z.Y5.z.Y5', 'Power User'),
('Standard User', 'user@example.com', '$2a$10$wK.1q.f.2Y/J5C.3jJ/l2OJT.V8X.j2x.1q/Y5.z.Y5.z.Y5.z.Y5', 'Standard User'),
('Read-Only User', 'readonly@example.com', '$2a$10$wK.1q.f.2Y/J5C.3jJ/l2OJT.V8X.j2x.1q/Y5.z.Y5.z.Y5.z.Y5', 'Read-Only')
ON CONFLICT (email) DO NOTHING;

-- Insert Dummy Organizations
INSERT INTO organizations (name, address) VALUES
('Innovate Inc.', '123 Tech Park, Silicon Valley'),
('Synergy Corp.', '456 Business Blvd, Metropolis'),
('Quantum Solutions', '789 Innovation Dr, Star City'),
('Dynamic Systems', '101 Data Dr, Gotham')
ON CONFLICT (name) DO NOTHING;

-- Insert Dummy Teams
INSERT INTO teams (name) VALUES
('Engineering'),
('Product'),
('Sales'),
('Marketing')
ON CONFLICT (name) DO NOTHING;

-- Associate Teams with Organizations
INSERT INTO teams_to_organizations ("teamId", "organizationId") VALUES
((SELECT id from teams where name='Engineering'), (SELECT id from organizations where name='Innovate Inc.')),
((SELECT id from teams where name='Product'), (SELECT id from organizations where name='Innovate Inc.')),
((SELECT id from teams where name='Sales'), (SELECT id from organizations where name='Synergy Corp.')),
((SELECT id from teams where name='Marketing'), (SELECT id from organizations where name='Synergy Corp.'))
ON CONFLICT ("teamId", "organizationId") DO NOTHING;

-- Insert Dummy Contacts
INSERT INTO contacts (first_name, last_name, address, birthday, notes, is_favorite, profile_picture) VALUES
('Alice', 'Johnson', '123 Maple St, Anytown', '1990-05-15', 'Met at the 2023 conference.', true, 'https://picsum.photos/seed/1/100/100'),
('Bob', 'Smith', '456 Oak Ave, Sometown', '1985-08-20', 'Key contact for the project.', false, 'https://picsum.photos/seed/2/100/100'),
('Charlie', 'Brown', '789 Pine Ln, Yourtown', '1992-11-30', 'Follow up in Q3.', true, 'https://picsum.photos/seed/3/100/100'),
('Diana', 'Prince', '101 Amazon Circle, Themyscira', '1988-03-22', 'Needs updated proposal.', false, 'https://picsum.photos/seed/4/100/100')
ON CONFLICT (id) DO NOTHING;

-- Get contact and org IDs
DO $$
DECLARE
    alice_id INT;
    bob_id INT;
    charlie_id INT;
    diana_id INT;
    innovate_id INT;
    synergy_id INT;
    quantum_id INT;
    dynamic_id INT;
    eng_team_id INT;
    prod_team_id INT;
BEGIN
    SELECT id INTO alice_id FROM contacts WHERE first_name = 'Alice';
    SELECT id INTO bob_id FROM contacts WHERE first_name = 'Bob';
    SELECT id INTO charlie_id FROM contacts WHERE first_name = 'Charlie';
    SELECT id INTO diana_id FROM contacts WHERE first_name = 'Diana';

    SELECT id INTO innovate_id FROM organizations WHERE name = 'Innovate Inc.';
    SELECT id INTO synergy_id FROM organizations WHERE name = 'Synergy Corp.';
    SELECT id INTO quantum_id FROM organizations WHERE name = 'Quantum Solutions';
    SELECT id INTO dynamic_id FROM organizations WHERE name = 'Dynamic Systems';

    SELECT id INTO eng_team_id FROM teams WHERE name = 'Engineering';
    SELECT id INTO prod_team_id FROM teams WHERE name = 'Product';

    -- Insert Contact-Organization relationships
    INSERT INTO contact_organizations (contact_id, organization_id, team_id, designation, department) VALUES
    (alice_id, innovate_id, eng_team_id, 'Lead Engineer', 'Platform'),
    (bob_id, synergy_id, NULL, 'Sales Director', 'Sales'),
    (charlie_id, quantum_id, prod_team_id, 'Product Manager', 'Product'),
    (diana_id, dynamic_id, eng_team_id, 'Software Engineer', 'Core Systems')
    ON CONFLICT (id) DO NOTHING;

    -- Insert other contact details
    INSERT INTO contact_emails (contact_id, email) VALUES
    (alice_id, 'alice.j@innovate.com'),
    (bob_id, 'bob.smith@synergy.com'),
    (charlie_id, 'charlie@quantum.dev'),
    (diana_id, 'diana@dynamic.co')
    ON CONFLICT (id) DO NOTHING;

    INSERT INTO contact_phones (contact_id, phone, type) VALUES
    (alice_id, '111-222-3333', 'Mobile'),
    (bob_id, '444-555-6666', 'Telephone'),
    (charlie_id, '777-888-9999', 'Mobile'),
    (diana_id, '101-112-1314', 'Mobile')
    ON CONFLICT (id) DO NOTHING;
END $$;
