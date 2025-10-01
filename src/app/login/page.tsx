
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Logo from '@/components/logo';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { login } from '@/lib/data';
import { User, Briefcase, Shield } from 'lucide-react';
import { useEffect } from 'react';
import LanguageSwitcher from '@/components/language-switcher';
import { useTranslation } from '@/hooks/use-translation';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect');
  const { t, isTranslationReady } = useTranslation();

  const handleLogin = (userId: string) => {
    login(userId);
    if (userId === 'admin-user') {
      router.replace('/admin');
    } else {
      router.replace(redirectUrl || '/dashboard');
    }
  };
  
  if (!isTranslationReady) {
    return (
       <div className="w-full h-screen flex items-center justify-center p-4 bg-background">
        <div>Loading...</div>
      </div>
    )
  }


  return (
    <div className="w-full h-screen flex items-center justify-center p-4 bg-background">
       <div className="absolute top-4 right-4">
        <LanguageSwitcher />
      </div>
      <Card className="mx-auto max-w-sm w-full">
        <CardHeader className="text-center">
          <div className="mb-4 flex justify-center">
            <Logo href="/" />
          </div>
          <CardTitle className="text-2xl font-headline">{t('login_title')}</CardTitle>
          <CardDescription>
            {t('login_subtitle')}
          </CardDescription>
        </CardHeader>
        <CardContent>
            <div className="grid gap-4">
              <Button type="button" className="w-full" onClick={() => handleLogin('user-1')}>
                <User className="mr-2 h-4 w-4"/>
                {t('login_as_customer')}
              </Button>
              <Button type="button" variant="secondary" className="w-full" onClick={() => handleLogin('user-2')}>
                <Briefcase className="mr-2 h-4 w-4"/>
                {t('login_as_provider')}
              </Button>
               <Button type="button" variant="destructive" className="w-full" onClick={() => handleLogin('admin-user')}>
                <Shield className="mr-2 h-4 w-4"/>
                {t('login_as_admin')}
              </Button>
            </div>
          <div className="mt-4 text-center text-sm">
            {t('login_no_account')}{' '}
            <Link href="/signup" className="underline">
              {t('login_signup_link')}
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
