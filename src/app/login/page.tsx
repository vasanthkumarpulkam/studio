
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
import { User, Briefcase } from 'lucide-react';
import { useEffect } from 'react';
import LanguageSwitcher from '@/components/language-switcher';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect');

  const handleLogin = (userId: string) => {
    login(userId);
    // Use replace to avoid adding a new entry to the history stack
    // This feels more natural for a login flow.
    router.replace(redirectUrl || '/dashboard');
  };

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
          <CardTitle className="text-2xl font-headline">Test Login</CardTitle>
          <CardDescription>
            Select a user role to log in for testing.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <div className="grid gap-4">
              <Button type="button" className="w-full" onClick={() => handleLogin('user-1')}>
                <User className="mr-2 h-4 w-4"/>
                Login as Customer
              </Button>
              <Button type="button" variant="secondary" className="w-full" onClick={() => handleLogin('user-2')}>
                <Briefcase className="mr-2 h-4 w-4"/>
                Login as Provider
              </Button>
            </div>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="underline">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
