
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
import { useEffect, useMemo, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useUser } from '@/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/firebase/config';

const paymentSchema = z.object({
  cardName: z.string().min(2, 'Name on card is required.'),
});

type PaymentFormValues = z.infer<typeof paymentSchema>;

function PaymentFormInner() {
  const { toast } = useToast();
  const { t, isTranslationReady } = useTranslation();
  const { user } = useUser();
  const stripe = useStripe();
  const elements = useElements();
  
  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema),
  });

  function onSubmit(values: PaymentFormValues) {
    (async () => {
      if (!stripe || !elements || !user) return;
      try {
        const res = await fetch('/api/payments/create-setup-intent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ customerId: user.id }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to create setup intent');
        const card = elements.getElement(CardElement);
        if (!card) throw new Error('CardElement not found');
        const confirm = await stripe.confirmCardSetup(data.clientSecret, {
          payment_method: {
            card,
            billing_details: { name: values.cardName },
          },
        });
        if (confirm.error) throw new Error(confirm.error.message);
        await updateDoc(doc(db, 'users', user.id), { hasPaymentMethod: true });
        toast({ title: 'Payment Method Saved!', description: 'Your payment details have been securely stored.' });
        form.reset();
      } catch (e: any) {
        toast({ variant: 'destructive', title: 'Error', description: e.message || 'Could not save payment method.' });
      }
    })();
  }

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
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="cardName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('settings_payment_form_name_label')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('settings_payment_form_name_placeholder')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="p-3 border rounded-md">
                <CardElement options={{ hidePostalCode: true }} />
              </div>
              <Button type="submit" className="w-full sm:w-auto">
                <CreditCard className="mr-2 h-4 w-4" />
                {t('settings_payment_form_save_button')}
              </Button>
            </form>
          </Form>
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

export default function PaymentSettingsPage() {
  const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
  const stripePromise = useMemo(() => publishableKey ? loadStripe(publishableKey) : null, [publishableKey]);
  if (!publishableKey) {
    return (
      <div className="max-w-3xl w-full">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-2xl">Stripe not configured</CardTitle>
            <CardDescription>Add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY and STRIPE_SECRET_KEY to enable payments.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }
  return (
    <Elements stripe={stripePromise!}>
      <PaymentFormInner />
    </Elements>
  );
}
