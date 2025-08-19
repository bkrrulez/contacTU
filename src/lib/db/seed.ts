import { db } from './';
import { contacts, users } from './schema';
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
  await db.delete(contacts);
  await db.delete(users);
  
  console.log('Cleared existing data.');

  // Seed users
  const seededUsers = await db.insert(users).values(
    mockUsers
  ).returning();
  console.log(`Seeded ${seededUsers.length} users.`);

  // Seed contacts
  const seededContacts = await db.insert(contacts).values(
    mockContacts
  ).returning();
  console.log(`Seeded ${seededContacts.length} contacts.`);

  console.log('Database seeding complete.');
  process.exit(0);
}

seed().catch((error) => {
  console.error('Error seeding database:', error);
  process.exit(1);
});
