

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Logo from '@/components/logo';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
import { ArrowRight } from 'lucide-react';

export default function Home() {
  const [currentUser, setCurrentUser] = useState<User | Provider | null>(null);

  useEffect(() => {
    setCurrentUser(getCurrentUser());
  }, []);

  const postJobHref = currentUser ? '/dashboard/jobs/new' : '/login';

  const rideFeature = PlaceHolderImages.find(p => p.id === 'feature-ride');
  const accommodationFeature = PlaceHolderImages.find(p => p.id === 'feature-accommodation');

  const FeatureCard = ({ feature }: { feature: any }) => (
    <Card className="bg-primary text-primary-foreground border-none overflow-hidden rounded-xl">
      <CardHeader>
        <CardTitle className="font-headline text-3xl flex items-center justify-between">
          {feature.title}
          <ArrowRight className="w-8 h-8" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-primary-foreground/80 min-h-[40px]">{feature.description}</CardDescription>
        <div className="relative h-48 mt-4">
          <Image
            src={feature.imageUrl}
            alt={feature.title}
            fill
            className="object-contain object-left"
            data-ai-hint={feature.imageHint}
          />
        </div>
      </CardContent>
    </Card>
  );


  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="px-4 lg:px-6 h-16 flex items-center shadow-sm bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <Logo href="/" />
        <nav className="ml-auto flex gap-2 sm:gap-4 items-center">
          <Button variant="ghost" asChild size="sm">
            <Link href="#">Get the App</Link>
          </Button>
          <Button variant="ghost" asChild size="sm">
            <Link href="#">Publish Ride</Link>
          </Button>
          <Button variant="ghost" asChild size="sm">
            <Link href="#">Publish Property</Link>
          </Button>
          <Button variant="ghost" asChild size="sm">
            <Link href="#">Contact us</Link>
          </Button>
          {currentUser ? (
            <Button asChild>
                <Link href="/dashboard">Dashboard</Link>
            </Button>
          ) : (
            <>
              <Button asChild style={{ backgroundColor: 'hsl(var(--primary))', color: 'hsl(var(--primary-foreground))' }}>
                <Link href="/login">Login</Link>
              </Button>
            </>
          )}
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-20 md:py-32 lg:py-40 bg-card relative">
          <div className="absolute bottom-0 inset-x-0 h-1/2 bg-background"></div>
          <div className="container px-4 md:px-6 relative">
            <div className="flex flex-col items-center space-y-6 text-center">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl font-headline">
                Looking for a Ride or a Place to Stay?
              </h1>
              <p className="max-w-[700px] text-foreground/80 md:text-xl font-bold text-2xl">
                Grofyy Makes It Easy!
              </p>
              <p className="max-w-[700px] text-foreground/70 md:text-lg">
                Finding affordable rides and student-friendly accommodation shouldn't be a hassle. Choose what you need and get started instantly!
              </p>
            </div>
             <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                {rideFeature && <FeatureCard feature={rideFeature} />}
                {accommodationFeature && <FeatureCard feature={accommodationFeature} />}
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
            </div>
            <div className="mx-auto w-full max-w-sm space-y-2">
              <div className="flex justify-center gap-4">
                <Button size="lg" asChild>
                  <Link href="#">
                    Find a Ride
                  </Link>
                </Button>
                <Button size="lg" variant="secondary" asChild>
                  <Link href="#">Find Accommodation</Link>
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
