import { db } from './';
import { 
  contacts, 
  users,
  contactOrganizations,
  contactEmails,
  contactPhones
} from './schema';
import { mockContacts, mockUsers } from '../data';
import * as dotenv from 'dotenv';
import { execSync } from 'child_process';

dotenv.config({
  path: '.env.local',
});

async function seed() {
  console.log('Pushing schema to database...');
  try {
    // Using the npx command with the local drizzle-kit installation
    execSync('npx drizzle-kit push', { stdio: 'inherit' });
    console.log('Schema pushed successfully.');
  } catch (error) {
    console.error('Error pushing schema:', error);
    process.exit(1);
  }

  console.log('Seeding database...');

  // Clear existing data
  await db.delete(contactOrganizations);
  await db.delete(contactEmails);
  await db.delete(contactPhones);
  await db.delete(contacts);
  await db.delete(users);
  
  console.log('Cleared existing data.');

  // Seed users
  const seededUsers = await db.insert(users).values(
    mockUsers
  ).returning();
  console.log(`Seeded ${seededUsers.length} users.`);

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
