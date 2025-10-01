
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User, CreditCard, Shield, Bell } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUser } from '@/firebase';
import { useTranslation } from '@/hooks/use-translation';


export function SettingsNav() {
  const pathname = usePathname();
  const { user } = useUser();
  const { t } = useTranslation();
  
  const navItems = [
    { href: '/dashboard/settings/profile', label: t('settings_nav_profile'), icon: User },
    { href: '/dashboard/settings/account', label: t('settings_nav_account'), icon: Shield },
    { href: '/dashboard/settings/payment', label: t('settings_nav_payment'), icon: CreditCard },
    { href: '/dashboard/settings/notifications', label: t('settings_nav_notifications'), icon: Bell },
  ];

  if (!user) {
    return null;
  }

  const linkClass = (href: string) =>
    cn(
      'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary',
      pathname === href && 'bg-muted text-primary'
    );

  return (
    <nav className="grid items-start text-sm font-medium">
      {navItems.map((item) => (
        <Link key={item.label} href={item.href} className={linkClass(item.href)}>
          <item.icon className="h-4 w-4" />
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
