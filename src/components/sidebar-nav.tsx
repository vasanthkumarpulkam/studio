'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  FilePlus2,
  Settings,
  Search,
  Gavel,
} from 'lucide-react';
import { cn } from '@/lib/utils';

type SidebarNavProps = {
  userRole: 'customer' | 'provider';
  isMobile?: boolean;
};

export function SidebarNav({ userRole, isMobile = false }: SidebarNavProps) {
  const pathname = usePathname();

  const baseNav = [
    { href: '/dashboard/settings', label: 'Settings', icon: Settings },
  ];

  const customerNav = [
    { href: '/dashboard', label: 'Dashboard', icon: Home },
    { href: '/dashboard/jobs/new', label: 'Post a Job', icon: FilePlus2 },
    ...baseNav,
  ];

  const providerNav = [
    { href: '/dashboard', label: 'Find Jobs', icon: Search },
    { href: '/dashboard/my-bids', label: 'My Bids', icon: Gavel },
    ...baseNav,
  ];

  const navItems = userRole === 'customer' ? customerNav : providerNav;

  const linkClass = (href: string) =>
    cn(
      'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary',
      pathname.startsWith(href) && href !== '/dashboard' ? 'bg-muted text-primary' : pathname === href ? 'bg-muted text-primary' : '',
      isMobile && 'text-lg'
    );
  
  const mobileLinkClass = (href: string) =>
    cn(
      "flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground",
      pathname.startsWith(href) && href !== '/dashboard' ? 'text-foreground' : pathname === href ? 'text-foreground' : ''
    );


  if (isMobile) {
    return (
        <div className="grid gap-2">
        {navItems.map((item) => (
            <Link key={item.label} href={item.href} className={mobileLinkClass(item.href)}>
                <item.icon className="h-5 w-5" />
                {item.label}
            </Link>
        ))}
        </div>
    )
  }

  return (
    <div className="flex-1">
      <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
        {navItems.map((item) => (
          <Link key={item.label} href={item.href} className={linkClass(item.href)}>
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
