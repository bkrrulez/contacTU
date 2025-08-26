
import { db } from './';
import { 
  contacts, 
  users,
  contactOrganizations,
  contactEmails,
  contactPhones,
  contactUrls,
  contactSocialLinks,
  contactAssociatedNames
} from './schema';
import type { UserSchema } from './schema';
import bcrypt from 'bcryptjs';

async function seed() {
  console.log('Seeding database...');
  
  try {
    console.log('Clearing existing data...');
    await db.delete(contactAssociatedNames);
    await db.delete(contactSocialLinks);
    await db.delete(contactUrls);
    await db.delete(contactOrganizations);
    await db.delete(contactEmails);
    await db.delete(contactPhones);
    await db.delete(contacts);
    await db.delete(users);
    console.log('Cleared existing data.');
  } catch (error) {
    console.error('Error clearing data:', error);
    process.exit(1);
  }

  const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'password123', 10);

  const mockUsers: Omit<UserSchema, 'id' | 'resetToken' | 'resetTokenExpiry'>[] = [
    {
      name: 'Admin User',
      email: 'admin@cardbase.com',
      role: 'Admin',
      avatar: 'https://placehold.co/100x100.png',
      password: hashedPassword,
    },
    {
      name: 'Alice Johnson',
      email: 'alice@example.com',
      role: 'Power User',
      avatar: 'https://placehold.co/100x100.png',
      password: hashedPassword,
    },
    {
      name: 'Bob Williams',
      email: 'bob@example.com',
      role: 'Standard User',
      avatar: 'https://placehold.co/100x100.png',
      password: hashedPassword,
    },
    {
      name: 'Charlie Brown',
      email: 'charlie@example.com',
      role: 'Read-Only',
      avatar: 'https://placehold.co/100x100.png',
      password: hashedPassword,
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
      organizations: [{ organization: 'Acme Corp', designation: 'Lead Engineer', team: 'Platform', department: 'Engineering' }],
      avatar: 'https://placehold.co/100x100.png',
      address: '123 Acme St, Tech City',
      notes: 'Key contact for Project Titan.',
      birthday: '1985-05-15',
      subordinateName: 'Assistant Jane',
      socialMedia: 'https://www.linkedin.com/in/johndoe',
      website: 'https://acmecorp.com'
    },
    {
      firstName: 'Jane',
      lastName: 'Smith',
      emails: [{ email: 'jane.smith@techsolutions.io' }],
      phones: [{ phone: '234-567-8901', type: 'Telephone' as const }],
      organizations: [{ organization: 'Tech Solutions', designation: 'Project Manager', team: 'Core Products', department: 'Product' }],
      avatar: 'https://placehold.co/100x100.png',
      address: '456 Tech Ave, Innovation Valley',
      notes: null,
      birthday: null,
      subordinateName: null,
      socialMedia: null,
      website: null
    },
    {
      firstName: 'Sam',
      lastName: 'Wilson',
      emails: [{ email: 'sam.wilson@webweavers.dev' }],
      phones: [{ phone: '345-678-9012', type: 'Mobile' as const }],
      organizations: [{ organization: 'WebWeavers', designation: 'UX/UI Designer', team: 'Marketing', department: 'Design' }],
      avatar: 'https://placehold.co/100x100.png',
      notes: 'Met at the design conference.',
      address: null,
      birthday: null,
      subordinateName: null,
      socialMedia: null,
      website: null
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
          team: org.team,
          department: org.department,
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
    if (mockContact.subordinateName) {
        await db.insert(contactAssociatedNames).values({
            contactId: newContact.id,
            name: mockContact.subordinateName
        })
    }
    if(mockContact.website) {
        await db.insert(contactUrls).values({
            contactId: newContact.id,
            url: mockContact.website
        })
    }
    if(mockContact.socialMedia) {
        await db.insert(contactSocialLinks).values({
            contactId: newContact.id,
            link: mockContact.socialMedia
        })
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
