import { SettingsNav } from '@/components/settings-nav';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Link from 'next/link';
import { Home, ChevronRight } from 'lucide-react';

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/dashboard" className="flex items-center gap-2 hover:text-foreground">
            <Home className="w-4 h-4" />
            Dashboard
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-foreground">Settings</span>
        </div>
      <div className="max-w-6xl mx-auto w-full grid gap-8 md:grid-cols-[200px_1fr]">
        <aside>
          <SettingsNav />
        </aside>
        <div>
          {children}
        </div>
      </div>
    </main>
  );
}
