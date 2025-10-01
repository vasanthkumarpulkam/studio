
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
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import LanguageSwitcher from '@/components/language-switcher';
import { useTranslation } from '@/hooks/use-translation';

export default function SignupPage() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect');
  const { toast } = useToast();
  const { t } = useTranslation();

  const handleFirstStep = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would call your backend to send an OTP
    setStep(2);
    toast({
        title: t('signup_toast_code_sent_title'),
        description: `${t('signup_toast_code_sent_desc')} ${email}.`,
    });
  };

  const handleVerification = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would verify the OTP with your backend
    toast({
        title: t('signup_toast_account_created_title'),
        description: t('signup_toast_account_created_desc'),
    });
    router.push(redirectUrl || '/dashboard');
  };

  if (!t) {
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
            {step === 1 ? t('signup_title_step1') : t('signup_title_step2')}
          </CardTitle>
          <CardDescription>
            {step === 1
              ? t('signup_subtitle_step1')
              : `${t('signup_subtitle_step2')} ${email}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === 1 ? (
            <form onSubmit={handleFirstStep}>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="full-name">{t('signup_fullname_label')}</Label>
                  <Input id="full-name" placeholder="Max Robinson" required />
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
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">{t('signup_password_label')}</Label>
                  <Input id="password" type="password" required />
                </div>

                <div className="grid gap-2">
                  <Label>{t('signup_role_label')}</Label>
                  <RadioGroup
                    defaultValue="customer"
                    className="grid grid-cols-2 gap-4"
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
                <Button type="submit" className="w-full">
                  {t('signup_create_account_button')}
                </Button>
                 <Button variant="link" type="button" onClick={() => router.back()}>
                    {t('signup_back_button')}
                </Button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleVerification}>
                <div className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="otp">{t('signup_otp_label')}</Label>
                        <Input id="otp" placeholder="_ _ _ _ _ _" required maxLength={6} />
                    </div>
                    <Button type="submit" className="w-full">
                        {t('signup_verify_button')}
                    </Button>
                     <Button variant="link" size="sm" type="button" onClick={() => setStep(1)}>
                        {t('signup_back_to_signup_button')}
                    </Button>
                </div>
            </form>
          )}

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
