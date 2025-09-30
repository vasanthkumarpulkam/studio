
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
import { CreditCard, Banknote, VenetianSofa } from 'lucide-react';

const paymentSchema = z.object({
  cardName: z.string().min(2, 'Name on card is required.'),
  cardNumber: z.string().length(16, 'Card number must be 16 digits.'),
  expiryDate: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, 'Expiry date must be in MM/YY format.'),
  cvc: z.string().length(3, 'CVC must be 3 digits.'),
});

type PaymentFormValues = z.infer<typeof paymentSchema>;

export default function PaymentSettingsPage() {
  const { toast } = useToast();
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

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="max-w-3xl mx-auto w-full">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-2xl">Payment Methods</CardTitle>
            <CardDescription>Add and manage your payment methods for seamless transactions.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="cardName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name on Card</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Sarah Lee" {...field} />
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
                      <FormLabel>Card Number</FormLabel>
                      <FormControl>
                        <Input placeholder="•••• •••• •••• ••••" {...field} />
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
                        <FormLabel>Expiry Date</FormLabel>
                        <FormControl>
                          <Input placeholder="MM/YY" {...field} />
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
                        <FormLabel>CVC / CVV</FormLabel>
                        <FormControl>
                          <Input placeholder="•••" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button type="submit" className="w-full sm:w-auto">
                  <CreditCard className="mr-2 h-4 w-4" />
                  Save Payment Method
                </Button>
              </form>
            </Form>
            
            <div className="mt-8 text-center text-muted-foreground">
                <p className="text-sm">We also support bank transfers.</p>
                <Button variant="link" className="text-primary">
                    <Banknote className="mr-2 h-4 w-4" />
                    Connect Bank Account
                </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
