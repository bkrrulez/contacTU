import type { Contact, User } from './types';

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@cardbase.com',
    role: 'Admin',
    avatar: 'https://placehold.co/100x100.png',
  },
  {
    id: '2',
    name: 'Alice Johnson',
    email: 'alice@example.com',
    role: 'Power User',
    avatar: 'https://placehold.co/100x100.png',
  },
  {
    id: '3',
    name: 'Bob Williams',
    email: 'bob@example.com',
    role: 'Standard User',
    avatar: 'https://placehold.co/100x100.png',
  },
  {
    id: '4',
    name: 'Charlie Brown',
    email: 'charlie@example.com',
    role: 'Read-Only',
    avatar: 'https://placehold.co/100x100.png',
  },
];

export const mockContacts: Contact[] = [
  {
    id: 'c1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@acmecorp.com',
    phone: '123-456-7890',
    organization: 'Acme Corp',
    designation: 'Lead Engineer',
    avatar: 'https://placehold.co/100x100.png',
    mobile: '098-765-4321',
    address: '123 Acme St, Tech City',
    notes: 'Key contact for Project Titan.'
  },
  {
    id: 'c2',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@techsolutions.io',
    phone: '234-567-8901',
    organization: 'Tech Solutions',
    designation: 'Project Manager',
    avatar: 'https://placehold.co/100x100.png',
    address: '456 Tech Ave, Innovation Valley',
  },
  {
    id: 'c3',
    firstName: 'Sam',
    lastName: 'Wilson',
    email: 'sam.wilson@webweavers.dev',
    phone: '345-678-9012',
    organization: 'WebWeavers',
    designation: 'UX/UI Designer',
    avatar: 'https://placehold.co/100x100.png',
    notes: 'Met at the design conference.'
  },
  {
    id: 'c4',
    firstName: 'Emily',
    lastName: 'White',
    email: 'emily.white@datadyne.com',
    phone: '456-789-0123',
    organization: 'DataDyne',
    designation: 'Data Scientist',
    avatar: 'https://placehold.co/100x100.png',
  },
    {
    id: 'c5',
    firstName: 'Michael',
    lastName: 'Brown',
    email: 'michael.b@cloudcentral.net',
    phone: '567-890-1234',
    organization: 'Cloud Central',
    designation: 'DevOps Specialist',
    avatar: 'https://placehold.co/100x100.png',
  },
  {
    id: 'c6',
    firstName: 'Sarah',
    lastName: 'Green',
    email: 'sarah.g@innovateinc.co',
    phone: '678-901-2345',
    organization: 'Innovate Inc.',
    designation: 'CEO',
    avatar: 'https://placehold.co/100x100.png',
    notes: 'Founder and primary decision maker.'
  },
];
