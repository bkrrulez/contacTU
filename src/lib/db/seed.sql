-- This script is intended to be run via the `db:seed` npm script.
-- It executes the TypeScript-based seed file, which is the canonical source for seed data.
\echo 'Running the database seed script...'
\! node --env-file=.env.local --import tsx src/lib/db/seed.ts
\echo 'Seeding complete.'
