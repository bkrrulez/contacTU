
import { db } from './';
import { 
  contacts, 
  users,
  contactOrganizations,
  contactEmails,
  contactPhones,
  contactAssociatedNames,
  contactSocialLinks,
  contactUrls
} from './schema';
import type { UserSchema } from './schema';
import * as dotenv from 'dotenv';

dotenv.config({
  path: '.env.local',
});


async function seed() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL environment variable is not set.');
  }
  
  console.log('Seeding database...');

  // Clear existing data
  await db.delete(contactAssociatedNames);
  await db.delete(contactSocialLinks);
  await db.delete(contactUrls);
  await db.delete(contactOrganizations);
  await db.delete(contactEmails);
  await db.delete(contactPhones);
  await db.delete(contacts);
  await db.delete(users);
  
  console.log('Cleared existing data.');

  const mockUsers: Omit<UserSchema, 'id'>[] = [
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

  // Seed users
  const seededUsers = await db.insert(users).values(
    mockUsers
  ).returning();
  console.log(`Seeded ${seededUsers.length} users.`);


  const mockContacts = [
    {
      firstName: 'John',
      lastName: 'Doe',
      emails: [{ email: 'john.doe@acmecorp.com' }],
      phones: [{ phone: '123-456-7890', type: 'Telephone' as const }, { phone: '098-765-4321', type: 'Mobile' as const }],
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
      phones: [{ phone: '234-567-8901', type: 'Telephone' as const }],
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
      phones: [{ phone: '345-678-9012', type: 'Mobile' as const }],
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
      phones: [{ phone: '456-789-0123', type: 'Telephone' as const }],
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
      phones: [{ phone: '567-890-1234', type: 'Telephone' as const }],
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
      phones: [{ phone: '678-901-2345', type: 'Telephone' as const }],
      organizations: [{ organization: 'Innovate Inc.', designation: 'CEO' }],
      avatar: 'https://placehold.co/100x100.png',
      notes: 'Founder and primary decision maker.',
      address: null,
      birthday: null,
    },
  ];

  // Seed contacts
  for (const mockContact of mockContacts) {
    const [newContact] = await db.insert(contacts).values({
      firstName: mockContact.firstName,
      lastName: mockContact.lastName,
      address: mockContact.address,
      birthday: mockContact.birthday,
      notes: mockContact.notes,
      avatar: mockContact.avatar,
    }).returning();

    if (mockContact.organizations) {
      await db.insert(contactOrganizations).values(
        mockContact.organizations.map(org => ({
          contactId: newContact.id,
          organization: org.organization,
          designation: org.designation,
        }))
      );
    }
    if (mockContact.emails) {
      await db.insert(contactEmails).values(
        mockContact.emails.map(email => ({
          contactId: newContact.id,
          email: email.email,
        }))
      );
    }
    if (mockContact.phones) {
      await db.insert(contactPhones).values(
        mockContact.phones.map(phone => ({
          contactId: newContact.id,
          phone: phone.phone,
          type: phone.type,
        }))
      );
    }
  }

  console.log(`Seeded ${mockContacts.length} contacts with their relations.`);
  console.log('Database seeding complete.');
  process.exit(0);
}

seed().catch((error) => {
  console.error('Error seeding database:', error);
  process.exit(1);
});
