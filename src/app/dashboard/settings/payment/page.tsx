
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { CreditCard, Banknote, Loader2 } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';
import { useEffect, useState, useTransition } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { httpsCallable, getFunctions } from 'firebase/functions';
import { auth } from '@/firebase/config';

const paymentSchema = z.object({});

type PaymentFormValues = z.infer<typeof paymentSchema>;

function SetupForm() {
  const { toast } = useToast();
  const stripe = useStripe();
  const elements = useElements();
  const [isPending, startTransition] = useTransition();
  const functions = getFunctions();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    startTransition(async () => {
      try {
        const createSetupIntent = httpsCallable(functions, 'createSetupIntent');
        const { data } = await createSetupIntent({});
        const clientSecret = (data as any).clientSecret as string;
        const card = elements.getElement(CardElement);
        if (!card) throw new Error('Card element missing');
        const result = await stripe.confirmCardSetup(clientSecret, { payment_method: { card } });
        if (result.error) throw result.error;
        // Mark hasPaymentMethod for UX toggles
        const mark = httpsCallable(functions, 'markHasPaymentMethod');
        await mark({});
        toast({ title: 'Payment Method Saved!', description: 'Your card has been securely saved.' });
      } catch (err: any) {
        toast({ variant: 'destructive', title: 'Setup failed', description: err.message || 'Try again.' });
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="border rounded-md p-3">
        <CardElement options={{ hidePostalCode: true }} />
      </div>
      <Button type="submit" className="w-full sm:w-auto" disabled={!stripe || isPending}>
        <CreditCard className="mr-2 h-4 w-4" /> Save Card
      </Button>
    </form>
  );
}

export default function PaymentSettingsPage() {
  const { toast } = useToast();
  const { t, isTranslationReady } = useTranslation();
  const [stripePromise, setStripePromise] = useState<any>(null);
  
  useEffect(() => {
    const pk = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string | undefined;
    if (pk) setStripePromise(loadStripe(pk));
  }, []);

  if (!isTranslationReady) {
    return <div className="flex justify-center items-center h-full"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  return (
      <div className="max-w-3xl w-full">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-2xl">{t('settings_payment_title')}</CardTitle>
            <CardDescription>{t('settings_payment_subtitle')}</CardDescription>
          </CardHeader>
          <CardContent>
            {stripePromise ? (
              <Elements stripe={stripePromise}>
                <SetupForm />
              </Elements>
            ) : (
              <div className="text-muted-foreground">Stripe is not configured.</div>
            )}
            
            <div className="mt-8 text-center text-muted-foreground">
                <p className="text-sm">{t('settings_payment_bank_info')}</p>
                <Button variant="link" className="text-primary">
                    <Banknote className="mr-2 h-4 w-4" />
                    {t('settings_payment_bank_button')}
                </Button>
            </div>
          </CardContent>
        </Card>
      </div>
  );
}
