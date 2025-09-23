
'use client';

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
  Download,
  ShieldQuestion,
} from 'lucide-react';
import { ContactTable } from '@/components/dashboard/contact-table';
import type { Contact as ContactType, User } from '@/lib/types';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getDashboardData } from './actions';
import { Skeleton } from '@/components/ui/skeleton';


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


interface DashboardData {
    contacts: ContactType[];
    users: User[];
    organizationsCount: number;
    favoritesCount: number;
}

function DashboardPageSkeleton() {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-9 w-48" />
            <Skeleton className="h-5 w-64 mt-2" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-10 w-28" />
            <Skeleton className="h-10 w-44" />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
        </div>

        <Card>
          <CardHeader>
            <Skeleton className="h-7 w-40" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
}


export default function DashboardPage() {
    const [data, setData] = useState<DashboardData | null>(null);
    const [currentUser, setCurrentUser] = useState<Partial<User> | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    
    useEffect(() => {
        // Fetch user from session storage
        const userJson = sessionStorage.getItem('user');
        if (userJson) {
            setCurrentUser(JSON.parse(userJson));
        }

        async function loadData() {
            try {
                const dashboardData = await getDashboardData();
                setData(dashboardData);
            } catch (error) {
                console.error("Failed to load dashboard data", error);
            } finally {
                setIsLoading(false);
            }
        }
        loadData();
    }, []);

  if (isLoading || !data) {
    return <DashboardPageSkeleton />;
  }

  const { contacts, users, organizationsCount, favoritesCount } = data;

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
              <Download className="mr-2 h-4 w-4" />
              Import
            </Link>
          </Button>
           <Button variant="outline" asChild>
            <Link href="/dashboard/settings">
              <ShieldQuestion className="mr-2 h-4 w-4" />
              Manage Duplicates
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Contacts" value={contacts.length} icon={Contact} color="#2563EB" />
        <StatCard title="Active Users" value={users.length} icon={Users} color="#16A34A" />
        <StatCard title="Organizations" value={organizationsCount} icon={Building} color="#9333EA" />
        <StatCard title="Favorite Contacts" value={favoritesCount} icon={Star} color="#F59E0B" href="/dashboard/favorites" />
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
            {contacts.length > 0 ? (
                <ContactTable contacts={contacts.slice(0, 5)} />
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
