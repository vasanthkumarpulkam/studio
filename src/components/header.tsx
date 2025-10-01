
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu, Shield } from 'lucide-react';
import Logo from '@/components/logo';
import { SidebarNav } from '@/components/sidebar-nav';
import { UserNav } from '@/components/user-nav';
import { getCurrentUser } from '@/lib/data';
import NotificationBell from './notification-bell';
import type { User, Provider } from '@/types';
import { usePathname } from 'next/navigation';
import LanguageSwitcher from './language-switcher';

export function Header() {
  const [user, setUser] = useState<User | Provider | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    setUser(getCurrentUser());
  }, [pathname]);

  const isAdminSection = pathname.startsWith('/admin');

  return (
    <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 z-40">
      <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
        <Logo href="/" />
        {user?.role === 'admin' && (
           <Link
            href="/admin"
            className="flex items-center gap-2 text-lg font-semibold md:text-base"
          >
             <Button variant="outline" size="sm">
              <Shield className="h-4 w-4 mr-2"/> Admin Dashboard
            </Button>
          </Link>
        )}
      </nav>
      {user && !isAdminSection && (
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="shrink-0 md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <nav className="grid gap-6 text-lg font-medium">
              <Logo href="/" />
              <SidebarNav userRole={user.role} isMobile={true} />
            </nav>
          </SheetContent>
        </Sheet>
      )}
      <div className="flex w-full items-center justify-end gap-4 md:ml-auto md:gap-2 lg:gap-4">
        <LanguageSwitcher />
        {user ? (
          <>
            {user.role !== 'admin' && <NotificationBell userId={user.id} />}
            <UserNav user={user} />
          </>
        ) : (
          <Button asChild>
             <Link href="/login">Login / Sign Up</Link>
          </Button>
        )}
      </div>
    </header>
  );
}
