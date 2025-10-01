import { DashboardLayout } from '@/components/dashboard-layout';
import { Header } from '@/components/header';
import { getCurrentUser } from '@/lib/data';
import { redirect } from 'next/navigation';

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = getCurrentUser();

  if (user?.role === 'admin') {
    redirect('/admin');
  }

  return (
    <div className="flex flex-col h-screen">
      <Header />
      <DashboardLayout>{children}</DashboardLayout>
    </div>
  );
}
