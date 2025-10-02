
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Logo from '@/components/logo';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Suspense, useState, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import LanguageSwitcher from '@/components/language-switcher';
import { useTranslation } from '@/hooks/use-translation';
import { useAuth, useFirestore } from '@/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { Loader2 } from 'lucide-react';
import { createUserProfile } from '@/services/user-service';

function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'customer' | 'provider'>('customer');
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect');
  const { toast } = useToast();
  const { t, isTranslationReady } = useTranslation();
  const auth = useAuth();
  const firestore = useFirestore();
  const [isPending, startTransition] = useTransition();

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        
        // Create user profile in Firestore
        await createUserProfile(firestore, userCredential.user.uid, {
            uid: userCredential.user.uid,
            name,
            email,
            role,
            joinedOn: new Date().toISOString(),
            status: 'active',
        });

        toast({
          title: t('signup_toast_account_created_title'),
          description: t('signup_toast_account_created_desc'),
        });
        router.push(redirectUrl || '/dashboard');
      } catch (error: any) {
        toast({
            variant: 'destructive',
            title: 'Signup Failed',
            description: error.message || 'Could not create account. Please try again.',
        });
      }
    });
  };

  if (!isTranslationReady) {
    return (
       <div className="w-full h-screen flex items-center justify-center p-4 bg-background">
        <div>Loading...</div>
      </div>
    )
  }


  return (
    <div className="w-full min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="absolute top-4 right-4">
        <LanguageSwitcher />
      </div>
      <Card className="mx-auto max-w-sm w-full">
        <CardHeader className="text-center">
          <div className="mb-4 flex justify-center">
              <Logo href="/" />
          </div>
          <CardTitle className="text-2xl font-headline">
            {t('signup_title_step1')}
          </CardTitle>
          <CardDescription>
            {t('signup_subtitle_step1')}
          </CardDescription>
        </CardHeader>
        <CardContent>
            <form onSubmit={handleSignup}>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="full-name">{t('signup_fullname_label')}</Label>
                  <Input 
                    id="full-name"
                    placeholder="Max Robinson"
                    required
                    disabled={isPending}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
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
                  <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} disabled={isPending} />
                </div>

                <div className="grid gap-2">
                  <Label>{t('signup_role_label')}</Label>
                  <RadioGroup
                    defaultValue="customer"
                    className="grid grid-cols-2 gap-4"
                    disabled={isPending}
                    onValueChange={(value) => setRole(value as 'customer' | 'provider')}
                    value={role}
                  >
                    <div>
                      <RadioGroupItem
                        value="customer"
                        id="customer"
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor="customer"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                      >
                        {t('signup_role_customer')}
                      </Label>
                    </div>
                    <div>
                      <RadioGroupItem
                        value="provider"
                        id="provider"
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor="provider"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                      >
                        {t('signup_role_provider')}
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
                <Button type="submit" className="w-full" disabled={isPending}>
                  {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : null}
                  {t('signup_create_account_button')}
                </Button>
                 <Button variant="link" type="button" onClick={() => router.back()} disabled={isPending}>
                    {t('signup_back_button')}
                </Button>
              </div>
            </form>

          <div className="mt-4 text-center text-sm">
            {t('signup_already_account')}{' '}
            <Link href="/login" className="underline">
              {t('login_button')}
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function SignupPage() {
    return (
        <Suspense>
            <Signup />
        </Suspense>
    )
}
