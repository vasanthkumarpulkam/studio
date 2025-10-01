
import { Sidebar, SidebarProvider, SidebarItem, SidebarSection } from '@/components/admin-sidebar';
import { Home, Users, Settings } from 'lucide-react';
import { Header } from '@/components/header';
import { getCurrentUser } from '@/lib/data';
import { redirect } from 'next/navigation';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {

    const user = getCurrentUser();

    if (!user || user.role !== 'admin') {
        // In a real app, you'd want more robust role checking, maybe with custom claims.
        // For this mock, we redirect if not the admin user.
        redirect('/login');
    }

    return (
        <SidebarProvider>
            <div className="flex h-screen flex-col">
                <Header />
                <div className="flex flex-1 overflow-hidden">
                    <Sidebar>
                        <SidebarSection>
                            <SidebarItem icon={<Home />} label="Dashboard" href="/admin" />
                            <SidebarItem icon={<Users />} label="Users" href="/admin/users" />
                            <SidebarItem icon={<Settings />} label="Settings" href="/admin/settings" />
                        </SidebarSection>
                    </Sidebar>
                    <main className="flex-1 overflow-y-auto p-6">
                        {children}
                    </main>
                </div>
            </div>
        </SidebarProvider>
    );
}
