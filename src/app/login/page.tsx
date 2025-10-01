
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
import { User, Briefcase, Shield, Loader2 } from 'lucide-react';
import { useEffect, useState, useTransition } from 'react';
import LanguageSwitcher from '@/components/language-switcher';
import { useTranslation } from '@/hooks/use-translation';
import { useAuth, useUser } from '@/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect');
  const { t, isTranslationReady } = useTranslation();
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (!isUserLoading && user) {
        // This is a mock, in a real app you'd get the user role from Firestore/custom claims
        const userRole = email.startsWith('admin') ? 'admin' : 'customer';
        if (userRole === 'admin') {
            router.replace('/admin');
        } else {
            router.replace(redirectUrl || '/dashboard');
        }
    }
  }, [user, isUserLoading, router, redirectUrl, email]);


  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            // The useEffect will handle the redirect
        } catch (error: any) {
            toast({
                variant: 'destructive',
                title: 'Login Failed',
                description: error.message || 'Please check your credentials and try again.',
            });
        }
    });
  };

  const handleDemoLogin = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('password');
    // The form will be submitted by the user clicking the main login button
  }
  
  if (isUserLoading) {
    return (
       <div className="w-full h-screen flex items-center justify-center p-4 bg-background">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }
  
  if (!isUserLoading && user) {
     return (
       <div className="w-full h-screen flex items-center justify-center p-4 bg-background">
        <Loader2 className="h-8 w-8 animate-spin" />
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
          <CardTitle className="text-2xl font-headline">{t('login_button')}</CardTitle>
          <CardDescription>
            {t('login_subtitle')}
          </CardDescription>
        </CardHeader>
        <CardContent>
            <form onSubmit={handleLogin} className="grid gap-4">
               <div className="grid gap-2">
                  <Label htmlFor="email">{t('signup_email_label')}</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isPending}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">{t('signup_password_label')}</Label>
                  <Input 
                    id="password" 
                    type="password" 
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isPending}
                  />
                </div>
              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {t('login_button')}
              </Button>
            </form>

            <div className="mt-4 text-center text-sm text-muted-foreground">
                Or use a demo account:
            </div>
             <div className="grid gap-2 mt-4">
              <Button type="button" variant="secondary" className="w-full" onClick={() => handleDemoLogin('customer@servicehub.com')}>
                <User className="mr-2 h-4 w-4"/>
                {t('login_as_customer')}
              </Button>
              <Button type="button" variant="secondary" className="w-full" onClick={() => handleDemoLogin('provider@servicehub.com')}>
                <Briefcase className="mr-2 h-4 w-4"/>
                {t('login_as_provider')}
              </Button>
               <Button type="button" variant="destructive" className="w-full" onClick={() => handleDemoLogin('admin@servicehub.com')}>
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
