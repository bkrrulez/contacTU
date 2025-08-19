import type { Contact, User } from './types';

export const mockUsers: Omit<User, 'id'>[] = [
  {
    name: 'Admin User',
    email: 'admin@cardbase.com',
    role: 'Admin',
    avatar: 'https://placehold.co/100x100.png',
  },
  {
    name: 'Alice Johnson',
    email: 'alice@example.com',
    role: 'Power User',
    avatar: 'https://placehold.co/100x100.png',
  },
  {
    name: 'Bob Williams',
    email: 'bob@example.com',
    role: 'Standard User',
    avatar: 'https://placehold.co/100x100.png',
  },
  {
    name: 'Charlie Brown',
    email: 'charlie@example.com',
    role: 'Read-Only',
    avatar: 'https://placehold.co/100x100.png',
  },
];

type MockContact = Omit<Contact, 'id'> & {
    organizations: { organization: string, designation?: string }[];
    emails: { email: string }[];
    phones: { phone: string, type: 'Telephone' | 'Mobile' }[];
};

export const mockContacts: MockContact[] = [
  {
    firstName: 'John',
    lastName: 'Doe',
    emails: [{ email: 'john.doe@acmecorp.com' }],
    phones: [{ phone: '123-456-7890', type: 'Telephone' }, { phone: '098-765-4321', type: 'Mobile' }],
    organizations: [{ organization: 'Acme Corp', designation: 'Lead Engineer' }],
    avatar: 'https://placehold.co/100x100.png',
    address: '123 Acme St, Tech City',
    notes: 'Key contact for Project Titan.',
    birthday: '1985-05-15',
  },
  {
    firstName: 'Jane',
    lastName: 'Smith',
    emails: [{ email: 'jane.smith@techsolutions.io' }],
    phones: [{ phone: '234-567-8901', type: 'Telephone' }],
    organizations: [{ organization: 'Tech Solutions', designation: 'Project Manager' }],
    avatar: 'https://placehold.co/100x100.png',
    address: '456 Tech Ave, Innovation Valley',
    notes: null,
    birthday: null,
  },
  {
    firstName: 'Sam',
    lastName: 'Wilson',
    emails: [{ email: 'sam.wilson@webweavers.dev' }],
    phones: [{ phone: '345-678-9012', type: 'Mobile' }],
    organizations: [{ organization: 'WebWeavers', designation: 'UX/UI Designer' }],
    avatar: 'https://placehold.co/100x100.png',
    notes: 'Met at the design conference.',
    address: null,
    birthday: null,
  },
  {
    firstName: 'Emily',
    lastName: 'White',
    emails: [{ email: 'emily.white@datadyne.com' }],
    phones: [{ phone: '456-789-0123', type: 'Telephone' }],
    organizations: [{ organization: 'DataDyne', designation: 'Data Scientist' }],
    avatar: 'https://placehold.co/100x100.png',
    notes: null,
    address: null,
    birthday: null,
  },
    {
    firstName: 'Michael',
    lastName: 'Brown',
    emails: [{ email: 'michael.b@cloudcentral.net' }],
    phones: [{ phone: '567-890-1234', type: 'Telephone' }],
    organizations: [{ organization: 'Cloud Central', designation: 'DevOps Specialist' }],
    avatar: 'https://placehold.co/100x100.png',
    notes: null,
    address: null,
    birthday: null,
  },
  {
    firstName: 'Sarah',
    lastName: 'Green',
    emails: [{ email: 'sarah.g@innovateinc.co' }],
    phones: [{ phone: '678-901-2345', type: 'Telephone' }],
    organizations: [{ organization: 'Innovate Inc.', designation: 'CEO' }],
    avatar: 'https://placehold.co/100x100.png',
    notes: 'Founder and primary decision maker.',
    address: null,
    birthday: null,
  },
];
