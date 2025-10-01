
'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

// Sidebar context
type SidebarContextProps = {
  isCollapsed: boolean;
};

const SidebarContext = React.createContext<SidebarContextProps>({
  isCollapsed: false,
});

export const useSidebar = () => React.useContext(SidebarContext);

// SidebarProvider component
export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  // In a real app, you might sync this with localStorage or a cookie
  const value = React.useMemo(() => ({ isCollapsed }), [isCollapsed]);

  return (
    <SidebarContext.Provider value={value}>
        <TooltipProvider>
            {children}
        </TooltipProvider>
    </SidebarContext.Provider>
  );
}


// Sidebar component
export function Sidebar({ children }: { children: React.ReactNode }) {
  const { isCollapsed } = useSidebar();
  
  return (
    <aside
      className={cn(
        'hidden md:flex flex-col border-r bg-background transition-all duration-300 ease-in-out',
        isCollapsed ? 'w-16' : 'w-64'
      )}
    >
      <nav className="flex flex-col p-2">{children}</nav>
    </aside>
  );
}

// SidebarSection component
export function SidebarSection({ children }: { children: React.ReactNode }) {
  return <div className="space-y-1">{children}</div>;
}

// SidebarItem component
type SidebarItemProps = {
  icon: React.ReactNode;
  label: string;
  href: string;
};

export function SidebarItem({ icon, label, href }: SidebarItemProps) {
  const { isCollapsed } = useSidebar();
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link
          href={href}
          className={cn(
            'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground',
            isActive && 'bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground'
          )}
        >
          {icon}
          {!isCollapsed && <span>{label}</span>}
        </Link>
      </TooltipTrigger>
      {isCollapsed && (
        <TooltipContent side="right">
          <p>{label}</p>
        </TooltipContent>
      )}
    </Tooltip>
  );
}
