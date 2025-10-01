
'use client';

import { DashboardLayout } from '@/components/dashboard-layout';
import { Header } from '@/components/header';
import { redirect } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useUser } from '@/firebase';
import { getMockUser } from '@/lib/data';

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isUserLoading } = useUser();

  if (isUserLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return redirect('/login');
  }

  // This is a temporary solution to get user role from mock data
  // In a real app, this would come from Firestore or custom claims
  const mockUser = getMockUser(user.uid);
  if (mockUser?.role === 'admin') {
      return redirect('/admin');
  }


  return (
    <div className="flex flex-col h-screen">
      <Header />
      <DashboardLayout>{children}</DashboardLayout>
    </div>
  );
}
