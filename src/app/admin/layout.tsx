
'use client';

import { Sidebar, SidebarProvider, SidebarItem, SidebarSection } from '@/components/admin-sidebar';
import { Home, Users, Settings, History, ClipboardList } from 'lucide-react';
import { Header } from '@/components/header';
import { redirect } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useUser } from '@/firebase';
import { getMockUser } from '@/lib/data';

export default function AdminLayout({
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
    if (mockUser?.role !== 'admin') {
        return redirect('/dashboard');
    }

    return (
        <SidebarProvider>
            <div className="flex h-screen flex-col">
                <Header />
                <div className="flex flex-1 overflow-hidden">
                    <Sidebar>
                        <SidebarSection>
                            <SidebarItem icon={<Home />} label="Dashboard" href="/admin" />
                            <SidebarItem icon={<Users />} label="User Management" href="/admin/users" />
                            <SidebarItem icon={<ClipboardList />} label="Content Oversight" href="/admin/content" />
                             <SidebarItem icon={<History />} label="Logs & Moderation" href="/admin/security" />
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
