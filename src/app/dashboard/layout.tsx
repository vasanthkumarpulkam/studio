import { Header } from '@/components/header';
import { SidebarNav } from '@/components/sidebar-nav';
import { getCurrentUser } from '@/lib/data';
import { Card } from '@/components/ui/card';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = getCurrentUser();

  return (
    <div className="flex flex-col min-h-screen w-full bg-background">
      <Header />
      <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-8">
        {children}
      </main>
    </div>
  );
}
