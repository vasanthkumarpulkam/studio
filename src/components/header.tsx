import Link from 'next/link';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import Logo from '@/components/logo';
import { SidebarNav } from '@/components/sidebar-nav';
import { UserNav } from '@/components/user-nav';
import { getCurrentUser } from '@/lib/data';
import NotificationBell from './notification-bell';

export function Header() {
  const user = getCurrentUser();

  return (
    <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 z-40">
      <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
        <Logo href="/dashboard" />
      </nav>
      {user && (
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="shrink-0 md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <nav className="grid gap-6 text-lg font-medium">
              <Logo href="/dashboard" />
              <SidebarNav userRole={user.role} isMobile={true} />
            </nav>
          </SheetContent>
        </Sheet>
      )}
      <div className="flex w-full items-center justify-end gap-4 md:ml-auto md:gap-2 lg:gap-4">
        {user ? (
          <>
            <NotificationBell userId={user.id} />
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
