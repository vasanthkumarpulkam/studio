
'use client';

import { Sidebar, SidebarProvider, SidebarItem, SidebarSection } from '@/components/admin-sidebar';
import { Home, Users, Settings } from 'lucide-react';
import { Header } from '@/components/header';
import { getCurrentUser } from '@/lib/data';
import { redirect } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState<ReturnType<typeof getCurrentUser>>(null);

    useEffect(() => {
        const currentUser = getCurrentUser();
        if (!currentUser || currentUser.role !== 'admin') {
            redirect('/login');
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
