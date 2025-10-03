'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function HowItWorksPage() {
  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">How it works</h1>
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>1) Post a job</CardTitle>
            <CardDescription>Describe the work and set a budget.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/jobs/new">Post a job</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>2) Review private bids</CardTitle>
            <CardDescription>Compare providers and award your favorite.</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>3) Pay cash + platform fee</CardTitle>
            <CardDescription>Cash in person; 10% auto-debit after completion.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}

