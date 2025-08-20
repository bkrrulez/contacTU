import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import * as dotenv from 'dotenv';

dotenv.config({
  path: '.env.local',
});

const runMigrate = async () => {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL environment variable is not set.');
  }

  console.log('Connecting to database...');
  const client = postgres(connectionString, { max: 1 });
  const db = drizzle(client);
  
  console.log('Running database migrations...');
  try {
    await migrate(db, { migrationsFolder: 'drizzle' });
    console.log('Migrations completed successfully.');
  } catch (error) {
    console.error('Error running migrations:', error);
    process.exit(1);
  } finally {
    console.log('Closing database connection.');
    await client.end();
  }
};

runMigrate().catch((error) => {
  console.error('Migration script failed:', error);
  process.exit(1);
});
