
import { db } from './';
import { 
  contacts, 
  users,
  contactOrganizations,
  contactEmails,
  contactPhones,
  contactUrls,
  contactSocialLinks,
  contactAssociatedNames,
  organizations,
  teams,
  teams_to_organizations,
  users_to_organizations
} from './schema';
import type { UserSchema } from './schema';
import bcrypt from 'bcryptjs';

async function seed() {
  console.log('Seeding database...');

  if (!process.env.DATABASE_URL) {
    console.error('FATAL: DATABASE_URL environment variable is not set.');
    process.exit(1);
  }
  
  try {
    console.log('Clearing existing data...');
    // Clear join tables first
    await db.delete(users_to_organizations);
    await db.delete(teams_to_organizations);
    await db.delete(contactOrganizations);
    // Clear tables with dependencies
    await db.delete(contactAssociatedNames);
    await db.delete(contactSocialLinks);
    await db.delete(contactUrls);
    await db.delete(contactEmails);
    await db.delete(contactPhones);
    // Clear parent tables
    await db.delete(contacts);
    await db.delete(users);
    await db.delete(teams);
    await db.delete(organizations);
    console.log('Cleared existing data.');
  } catch (error) {
    console.error('Error clearing data:', error);
    process.exit(1);
  }

  // --- Seed Organizations, Teams ---
  let seededOrgs: { id: number; name: string }[] = [];
  let seededTeams: { id: number; name: string }[] = [];
  try {
    seededOrgs = await db.insert(organizations).values([
      { name: 'Acme Corp', address: '123 Acme St, Tech City' },
      { name: 'Tech Solutions', address: '456 Tech Ave, Innovation Valley' },
      { name: 'WebWeavers', address: '789 Design Dr, Creative Corner' },
    ]).returning({ id: organizations.id, name: organizations.name });
    console.log(`Seeded ${seededOrgs.length} organizations.`);

    seededTeams = await db.insert(teams).values([
      { name: 'Platform' },
      { name: 'Core Products' },
      { name: 'Marketing' },
      { name: 'Engineering' },
      { name: 'Product' },
      { name: 'Design' },
    ]).returning({ id: teams.id, name: teams.name });
    console.log(`Seeded ${seededTeams.length} teams.`);
    
    // Link teams to organizations
    const orgMap = new Map(seededOrgs.map(o => [o.name, o.id]));
    const teamMap = new Map(seededTeams.map(t => [t.name, t.id]));

    await db.insert(teams_to_organizations).values([
      { organizationId: orgMap.get('Acme Corp')!, teamId: teamMap.get('Platform')! },
      { organizationId: orgMap.get('Acme Corp')!, teamId: teamMap.get('Engineering')! },
      { organizationId: orgMap.get('Tech Solutions')!, teamId: teamMap.get('Core Products')! },
      { organizationId: orgMap.get('Tech Solutions')!, teamId: teamMap.get('Product')! },
      { organizationId: orgMap.get('WebWeavers')!, teamId: teamMap.get('Marketing')! },
      { organizationId: orgMap.get('WebWeavers')!, teamId: teamMap.get('Design')! },
    ]);
    console.log('Linked teams to organizations.');

  } catch(error) {
    console.error('Error seeding orgs and teams:', error);
    process.exit(1);
  }

  // --- User Seeding ---
  try {
    const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
    const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      console.error('FATAL: NEXT_PUBLIC_ADMIN_EMAIL and NEXT_PUBLIC_ADMIN_PASSWORD environment variables must be set.');
      process.exit(1);
    }
    
    const adminPasswordHash = await bcrypt.hash(adminPassword, 10);
    const standardPasswordHash = await bcrypt.hash('password123', 10);

    const usersToSeed: Omit<UserSchema, 'id' | 'resetToken' | 'resetTokenExpiry' | 'avatar'>[] = [
      {
        name: 'Admin User',
        email: adminEmail,
        role: 'Admin',
        password: adminPasswordHash,
      },
      {
        name: 'Alice Johnson',
        email: 'alice@example.com',
        role: 'Power User',
        password: standardPasswordHash,
      },
      {
        name: 'Bob Williams',
        email: 'bob@example.com',
        role: 'Standard User',
        password: standardPasswordHash,
      },
      {
        name: 'Charlie Brown',
        email: 'charlie@example.com',
        role: 'Read-Only',
        password: standardPasswordHash,
      },
    ];

    const seededUsers = await db.insert(users).values(usersToSeed).returning();
    console.log(`Seeded ${seededUsers.length} users successfully.`);

    // Link users to organizations
    const orgMap = new Map(seededOrgs.map(o => [o.name, o.id]));
    const userMap = new Map(seededUsers.map(u => [u.email, u.id]));

    await db.insert(users_to_organizations).values([
        // Admin has all orgs
        ...seededOrgs.map(org => ({ userId: userMap.get(adminEmail)!, organizationId: org.id })),
        // Alice has two orgs
        { userId: userMap.get('alice@example.com')!, organizationId: orgMap.get('Acme Corp')! },
        { userId: userMap.get('alice@example.com')!, organizationId: orgMap.get('Tech Solutions')! },
        // Bob has one org
        { userId: userMap.get('bob@example.com')!, organizationId: orgMap.get('WebWeavers')! },
        // Charlie has all orgs
        ...seededOrgs.map(org => ({ userId: userMap.get('charlie@example.com')!, organizationId: org.id })),
    ]);
    console.log('Linked users to organizations.');


  } catch (error) {
    console.error('Error seeding users:', error);
    process.exit(1);
  }


  // --- Contact Seeding ---
  try {
    const orgMap = new Map(seededOrgs.map(o => [o.name, o.id]));
    const teamMap = new Map(seededTeams.map(t => [t.name, t.id]));
    
    const mockContacts = [
      {
        firstName: 'John',
        lastName: 'Doe',
        emails: [{ email: 'john.doe@acmecorp.com' }],
        phones: [{ phone: '123-456-7890', type: 'Telephone' as const }, { phone: '098-765-4321', type: 'Mobile' as const }],
        organizations: [{ organizationId: orgMap.get('Acme Corp')!, teamId: teamMap.get('Platform')!, designation: 'Lead Engineer', department: 'Engineering' }],
        avatar: 'https://picsum.photos/seed/1/100/100',
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
        organizations: [{ organizationId: orgMap.get('Tech Solutions')!, teamId: teamMap.get('Core Products')!, designation: 'Project Manager', department: 'Product' }],
        avatar: 'https://picsum.photos/seed/2/100/100',
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
        organizations: [{ organizationId: orgMap.get('WebWeavers')!, teamId: teamMap.get('Marketing')!, designation: 'UX/UI Designer', department: 'Design' }],
        avatar: 'https://picsum.photos/seed/3/100/100',
        notes: 'Met at the design conference.',
        address: null,
        birthday: null,
        subordinateName: null,
        socialMedia: null,
        website: null
      },
    ];

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
            organizationId: org.organizationId,
            teamId: org.teamId,
            designation: org.designation,
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

  } catch(error) {
    console.error('Error seeding contacts:', error);
    process.exit(1);
  }

  console.log('Database seeding complete.');
  process.exit(0);
}

seed().catch((error) => {
  console.error('Fatal error during seeding:', error);
  process.exit(1);
});

    