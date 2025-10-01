
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
import { useEffect } from 'react';

const paymentSchema = z.object({
  cardName: z.string().min(2, 'Name on card is required.'),
  cardNumber: z.string().length(16, 'Card number must be 16 digits.'),
  expiryDate: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, 'Expiry date must be in MM/YY format.'),
  cvc: z.string().length(3, 'CVC must be 3 digits.'),
});

type PaymentFormValues = z.infer<typeof paymentSchema>;

export default function PaymentSettingsPage() {
  const { toast } = useToast();
  const { t, isTranslationReady } = useTranslation();
  
  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema),
  });

  function onSubmit(values: PaymentFormValues) {
    console.log(values);
    toast({
      title: 'Payment Method Saved!',
      description: 'Your payment details have been securely stored.',
    });
    // In a real app, you would now update the user's hasPaymentMethod status to true
    form.reset();
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
                
                <FormField
                  control={form.control}
                  name="cardNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('settings_payment_form_card_number_label')}</FormLabel>
                      <FormControl>
                        <Input placeholder={t('settings_payment_form_card_number_placeholder')} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="expiryDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('settings_payment_form_expiry_label')}</FormLabel>
                        <FormControl>
                          <Input placeholder={t('settings_payment_form_expiry_placeholder')} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="cvc"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('settings_payment_form_cvc_label')}</FormLabel>
                        <FormControl>
                          <Input placeholder={t('settings_payment_form_cvc_placeholder')} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
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
