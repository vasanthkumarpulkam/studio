
'use client';

import { DashboardLayout } from '@/components/dashboard-layout';
import { Header } from '@/components/header';
import { getCurrentUser } from '@/lib/data';
import { redirect } from 'next/navigation';
import { useEffect } from 'react';

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = getCurrentUser();

  useEffect(() => {
    if (!user) {
      redirect('/login');
    } else if (user.role === 'admin') {
      redirect('/admin');
    }
  }, [user]);

  if (!user || user.role === 'admin') {
    // Render a loading state or null while redirecting
    return null; 
  }

  return (
    <div className="flex flex-col h-screen">
      <Header />
      <DashboardLayout>{children}</DashboardLayout>
    </div>
  );
}
