
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Logo from '@/components/logo';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Check, Users } from 'lucide-react';
import Testimonials from '@/components/testimonials';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { getCurrentUser } from '@/lib/data';
import type { User, Provider } from '@/types';
import { Footer } from '@/components/footer';

export default function Home() {
  const [currentUser, setCurrentUser] = useState<User | Provider | null>(null);

  useEffect(() => {
    setCurrentUser(getCurrentUser());
  }, []);

  const postJobHref = currentUser ? '/dashboard/jobs/new' : '/login';
  const findWorkHref = currentUser ? '/dashboard' : '/login';

  const heroImage = PlaceHolderImages.find(p => p.id === 'hero-image');
  const feature1 = PlaceHolderImages.find(p => p.id === 'feature-1');
  const feature2 = PlaceHolderImages.find(p => p.id === 'feature-2');
  const feature3 = PlaceHolderImages.find(p => p.id === 'feature-3');

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="px-4 lg:px-6 h-16 flex items-center shadow-sm bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <Logo href="/" />
        <nav className="ml-auto flex gap-4 sm:gap-6 items-center">
          <Button variant="ghost" asChild>
            <Link href={findWorkHref}>Find Work</Link>
          </Button>
          <Button variant="ghost" asChild>
             <Link href="#">How it Works</Link>
          </Button>
          {currentUser ? (
            <Button asChild>
                <Link href="/dashboard">Dashboard</Link>
            </Button>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link href="/signup">Sign Up</Link>
              </Button>
            </>
          )}
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-20 md:py-32 lg:py-40 bg-card">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-6">
                <div className="space-y-4">
                  <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl font-headline">
                    Find skilled workers for any job, anytime.
                  </h1>
                  <p className="max-w-[600px] text-foreground/80 md:text-xl">
                    Our platform connects you with trusted local professionals for everything from home repairs to event staffing. Post a job and get private bids in minutes.
                  </p>
                </div>
                <div className="flex flex-col gap-4 min-[400px]:flex-row">
                  <Button asChild size="lg">
                    <Link href={postJobHref}>
                      Post a Job <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="secondary">
                     <Link href={findWorkHref}>
                      Find Work <Users className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                </div>
              </div>
              <div className="relative h-64 md:h-auto">
                {heroImage &&
                    <Image
                    src={heroImage.imageUrl}
                    alt="Hero"
                    fill
                    className="rounded-xl object-cover shadow-lg"
                    data-ai-hint={heroImage.imageHint}
                  />
                }
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">How It Works</h2>
                <p className="max-w-[900px] text-foreground/80 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  A simple, transparent, and secure process from start to finish.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:max-w-none lg:grid-cols-3 mt-12">
              <Card className="bg-transparent border-none shadow-none">
                {feature1 && <div className="relative h-48 mb-4">
                    <Image src={feature1.imageUrl} alt={feature1.description} layout="fill" objectFit="contain" className="mx-auto" data-ai-hint={feature1.imageHint}/>
                </div>}
                <CardHeader className="p-0">
                  <CardTitle className="font-headline">1. Post Your Job</CardTitle>
                  <CardDescription>
                    Describe what you need done. Add photos and your budget to get the most accurate bids.
                  </CardDescription>
                </CardHeader>
              </Card>
               <Card className="bg-transparent border-none shadow-none">
                 {feature2 && <div className="relative h-48 mb-4">
                    <Image src={feature2.imageUrl} alt={feature2.description} layout="fill" objectFit="contain" className="mx-auto" data-ai-hint={feature2.imageHint}/>
                </div>}
                <CardHeader className="p-0">
                  <CardTitle className="font-headline">2. Receive Private Bids</CardTitle>
                  <CardDescription>
                   Verified professionals send you private bids. Compare prices, profiles, and reviews.
                  </CardDescription>
                </CardHeader>
              </Card>
               <Card className="bg-transparent border-none shadow-none">
                 {feature3 && <div className="relative h-48 mb-4">
                    <Image src={feature3.imageUrl} alt={feature3.description} layout="fill" objectFit="contain" className="mx-auto" data-ai-hint={feature3.imageHint}/>
                </div>}
                <CardHeader className="p-0">
                  <CardTitle className="font-headline">3. Hire & Pay Securely</CardTitle>
                  <CardDescription>
                    Choose the best provider and fund the job. Payment is held in escrow until the work is completed to your satisfaction.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        <Testimonials />
        
        <section className="w-full py-12 md:py-24 lg:py-32 bg-card">
          <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
            <div className="space-y-3">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight font-headline">
                Ready to Get Started?
              </h2>
              <p className="max-w-[600px] mx-auto text-foreground/80 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Post a job today and connect with skilled professionals in your area.
              </p>
            </div>
            <div className="mx-auto w-full max-w-sm space-y-2">
              <div className="flex justify-center gap-4">
                <Button size="lg" asChild>
                  <Link href={postJobHref}>
                    Post a Job for Free
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
