
'use client';

import { DashboardLayout } from '@/components/dashboard-layout';
import { Header } from '@/components/header';
import { getCurrentUser } from '@/lib/data';
import { redirect } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import type { User, Provider } from '@/types';

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | Provider | null>(null);

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      redirect('/login');
    } else if (currentUser.role === 'admin') {
      redirect('/admin');
    } else {
      setUser(currentUser);
      setIsLoading(false);
    }
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    // This case should ideally not be reached due to the redirect,
    // but it's a safe fallback.
    return null;
  }

  return (
    <div className="flex flex-col h-screen">
      <Header />
      <DashboardLayout>{children}</DashboardLayout>
    </div>
  );
}
