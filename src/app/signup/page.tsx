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
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

export default function SignupPage() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const router = useRouter();
  const { toast } = useToast();

  const handleFirstStep = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would call your backend to send an OTP
    setStep(2);
    toast({
        title: 'Verification Code Sent',
        description: `A 6-digit code has been sent to ${email}.`,
    });
  };

  const handleVerification = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would verify the OTP with your backend
    toast({
        title: 'Account Created!',
        description: 'You can now log in.',
    });
    router.push('/dashboard');
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="mx-auto max-w-sm w-full">
        <CardHeader className="text-center">
          <div className="mb-4 flex justify-center">
              <Logo href="/" />
          </div>
          <CardTitle className="text-2xl font-headline">
            {step === 1 ? 'Create an Account' : 'Verify Your Email'}
          </CardTitle>
          <CardDescription>
            {step === 1
              ? 'Join ServiceHub to hire or offer your services.'
              : `Enter the 6-digit code sent to ${email}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === 1 ? (
            <form onSubmit={handleFirstStep}>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="full-name">Full Name</Label>
                  <Input id="full-name" placeholder="Max Robinson" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
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
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" required />
                </div>

                <div className="grid gap-2">
                  <Label>I am a...</Label>
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
                        Customer
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
                        Provider
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
                <Button type="submit" className="w-full">
                  Create Account
                </Button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleVerification}>
                <div className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="otp">One-Time Passcode</Label>
                        <Input id="otp" placeholder="_ _ _ _ _ _" required maxLength={6} />
                    </div>
                    <Button type="submit" className="w-full">
                        Verify & Create Account
                    </Button>
                     <Button variant="link" size="sm" onClick={() => setStep(1)}>
                        Back to sign up
                    </Button>
                </div>
            </form>
          )}

          <div className="mt-4 text-center text-sm">
            Already have an account?{' '}
            <Link href="/login" className="underline">
              Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
