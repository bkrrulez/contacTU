-- Create the users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(256) NOT NULL,
  email VARCHAR(256) NOT NULL UNIQUE,
  role TEXT CHECK (role IN ('Admin', 'Power User', 'Standard User', 'Read-Only')) NOT NULL,
  avatar VARCHAR(256)
);

-- Create the contacts table
CREATE TABLE IF NOT EXISTS contacts (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(256) NOT NULL,
    last_name VARCHAR(256) NOT NULL,
    email VARCHAR(256) NOT NULL UNIQUE,
    phone VARCHAR(50),
    mobile VARCHAR(50),
    address TEXT,
    organization VARCHAR(256),
    designation VARCHAR(256),
    notes TEXT,
    avatar VARCHAR(256)
);

-- Insert mock users
INSERT INTO users (name, email, role, avatar) VALUES
('Admin User', 'admin@cardbase.com', 'Admin', 'https://placehold.co/100x100.png'),
('Alice Johnson', 'alice@example.com', 'Power User', 'https://placehold.co/100x100.png'),
('Bob Williams', 'bob@example.com', 'Standard User', 'https://placehold.co/100x100.png'),
('Charlie Brown', 'charlie@example.com', 'Read-Only', 'https://placehold.co/100x100.png')
ON CONFLICT (email) DO NOTHING;

-- Insert mock contacts
INSERT INTO contacts (first_name, last_name, email, phone, organization, designation, avatar, mobile, address, notes) VALUES
('John', 'Doe', 'john.doe@acmecorp.com', '123-456-7890', 'Acme Corp', 'Lead Engineer', 'https://placehold.co/100x100.png', '098-765-4321', '123 Acme St, Tech City', 'Key contact for Project Titan.'),
('Jane', 'Smith', 'jane.smith@techsolutions.io', '234-567-8901', 'Tech Solutions', 'Project Manager', 'https://placehold.co/100x100.png', NULL, '456 Tech Ave, Innovation Valley', NULL),
('Sam', 'Wilson', 'sam.wilson@webweavers.dev', '345-678-9012', 'WebWeavers', 'UX/UI Designer', 'https://placehold.co/100x100.png', NULL, NULL, 'Met at the design conference.'),
('Emily', 'White', 'emily.white@datadyne.com', '456-789-0123', 'DataDyne', 'Data Scientist', 'https://placehold.co/100x100.png', NULL, NULL, NULL),
('Michael', 'Brown', 'michael.b@cloudcentral.net', '567-890-1234', 'Cloud Central', 'DevOps Specialist', 'https://placehold.co/100x100.png', NULL, NULL, NULL),
('Sarah', 'Green', 'sarah.g@innovateinc.co', '678-901-2345', 'Innovate Inc.', 'CEO', 'https://placehold.co/100x100.png', NULL, NULL, 'Founder and primary decision maker.')
ON CONFLICT (email) DO NOTHING;
