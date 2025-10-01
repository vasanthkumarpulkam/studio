
'use client';

import { SettingsNav } from '@/components/settings-nav';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { useTranslation } from '@/hooks/use-translation';
import { Loader2 } from 'lucide-react';

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { t, isTranslationReady } = useTranslation();

  if (!isTranslationReady) {
    return <div className="flex justify-center items-center h-full"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  return (
    <>
       <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard">{t('breadcrumb_dashboard')}</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{t('breadcrumb_settings')}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      <div className="max-w-6xl w-full grid gap-8 md:grid-cols-[200px_1fr]">
        <aside>
          <SettingsNav />
        </aside>
        <div>
          {children}
        </div>
      </div>
    </>
  );
}
