import { db } from './';
import { contacts, users } from './schema';
import { mockContacts, mockUsers } from '../data';
import * as dotenv from 'dotenv';

dotenv.config({
  path: '.env.local',
});

async function seed() {
  console.log('Seeding database...');

  // Clear existing data
  await db.delete(contacts);
  await db.delete(users);
  
  console.log('Cleared existing data.');

  // Seed users
  const seededUsers = await db.insert(users).values(
    mockUsers.map(({ id, ...user }) => user)
  ).returning();
  console.log(`Seeded ${seededUsers.length} users.`);

  // Seed contacts
  const seededContacts = await db.insert(contacts).values(
    mockContacts.map(({ id, ...contact }) => contact)
  ).returning();
  console.log(`Seeded ${seededContacts.length} contacts.`);

  console.log('Database seeding complete.');
  process.exit(0);
}

seed().catch((error) => {
  console.error('Error seeding database:', error);
  process.exit(1);
});
