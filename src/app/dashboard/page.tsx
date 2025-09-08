
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Users,
  Contact,
  Building,
  Star,
  Upload,
  Download,
  ShieldQuestion,
} from 'lucide-react';
import { ContactTable } from '@/components/dashboard/contact-table';
import { db } from '@/lib/db';
import type { Contact as ContactType, User } from '@/lib/types';
import Link from 'next/link';
import { eq } from 'drizzle-orm';
import { contacts as contactsTable } from '@/lib/db/schema';

export const dynamic = 'force-dynamic';

const StatCard = ({
  title,
  value,
  icon: Icon,
  color,
  href
}: {
  title: string;
  value: number;
  icon: React.ElementType;
  color?: string;
  href?: string;
}) => {
  const cardContent = (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <div className={`rounded-full p-2`} style={{ backgroundColor: color ? `${color}1A` : 'var(--primary-10)'}}>
            <Icon className="h-4 w-4 text-primary" style={{color: color ?? 'var(--primary)'}}/>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{value}</div>
        </CardContent>
      </Card>
  );

  if (href) {
    return <Link href={href}>{cardContent}</Link>;
  }

  return cardContent;
};

export default async function DashboardPage() {
  const allContacts: ContactType[] = await db.query.contacts.findMany({
    with: {
      organizations: true,
      emails: true,
      phones: true,
    },
  });
  const users: User[] = await db.query.users.findMany();
  const organizations = await db.query.contactOrganizations.findMany({
    columns: {
      organization: true
    }
  }).then(orgs => new Set(orgs.map(o => o.organization)));
  const currentUser = await db.query.users.findFirst();

  const favoriteContacts = await db.select().from(contactsTable).where(eq(contactsTable.isFavorite, true));


  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {currentUser?.name ?? 'User'}! Here's your contact management overview.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/dashboard/import">
              <Upload className="mr-2 h-4 w-4" />
              Import
            </Link>
          </Button>
           <Button variant="outline" asChild>
            <Link href="/dashboard/settings">
              <ShieldQuestion className="mr-2 h-4 w-4" />
              Manage Duplicates
            </Link>
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Contacts" value={allContacts.length} icon={Contact} color="#2563EB" />
        <StatCard title="Active Users" value={users.length} icon={Users} color="#16A34A" />
        <StatCard title="Organizations" value={organizations.size} icon={Building} color="#9333EA" />
        <StatCard title="Favorite Contacts" value={favoriteContacts.length} icon={Star} color="#F59E0B" href="/dashboard/favorites" />
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Contacts</CardTitle>
            <Button asChild variant="link" className="text-primary">
                <Link href="/dashboard/contacts">View All</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {allContacts.length > 0 ? (
                <ContactTable contacts={allContacts.slice(0, 5)} />
            ): (
                <div className="text-center text-muted-foreground py-12">
                    No contacts found
                </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
