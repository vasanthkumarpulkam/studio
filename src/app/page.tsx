

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

export default function Home() {
  const [currentUser, setCurrentUser] = useState<User | Provider | null>(null);

  useEffect(() => {
    setCurrentUser(getCurrentUser());
  }, []);

  const postJobHref = currentUser ? '/dashboard/jobs/new' : '/login';

  const customerFeatures = PlaceHolderImages.filter(p => p.id.startsWith('feature-1'));
  const providerFeatures = PlaceHolderImages.filter(p => p.id.startsWith('feature-2'));

  const FeatureCarousel = ({ features, link, cta }: { features: any[], link: string, cta: string }) => (
    <Carousel className="w-full max-w-md mx-auto">
        <CarouselContent>
            {features.map((feature, index) => (
                <CarouselItem key={index}>
                    <div className="p-1">
                        <Card className="overflow-hidden rounded-xl">
                            <CardHeader className="p-0 relative h-48">
                                {feature.imageUrl && (
                                    <Image
                                        src={feature.imageUrl}
                                        alt={feature.title}
                                        fill
                                        className="object-cover"
                                        data-ai-hint={feature.imageHint}
                                    />
                                )}
                            </CardHeader>
                            <CardContent className="p-6 bg-card min-h-[160px]">
                                <CardTitle className="font-headline text-2xl">{feature.title}</CardTitle>
                                <CardDescription className="mt-2">
                                    {feature.description}
                                </CardDescription>
                            </CardContent>
                        </Card>
                    </div>
                </CarouselItem>
            ))}
        </CarouselContent>
        <CarouselPrevious className="left-[-10px] sm:left-[-40px]" />
        <CarouselNext className="right-[-10px] sm:right-[-40px]" />
         <div className="text-center mt-6">
            <Button asChild size="lg">
                <Link href={link}>{cta}</Link>
            </Button>
        </div>
    </Carousel>
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
            <Link href={postJobHref}>Post a Job</Link>
          </Button>
          <Button variant="ghost" asChild size="sm">
            <Link href="/dashboard">Find Work</Link>
          </Button>
          <Button variant="ghost" asChild size="sm">
            <Link href="#">Contact Us</Link>
          </Button>
          <Button asChild style={{ backgroundColor: 'hsl(var(--accent))', color: 'hsl(var(--accent-foreground))' }}>
            <Link href="/login">Login</Link>
          </Button>
           <Button variant="outline" asChild>
            <Link href="/signup">Sign Up</Link>
          </Button>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-20 md:py-32 lg:py-40 bg-card">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-6 text-center">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl font-headline">
                Looking for Help or Looking for Work?
              </h1>
              <p className="max-w-[700px] text-foreground/80 md:text-xl">
                Post your job and get bids from trusted local providers. Or find flexible work opportunities in your area — fast, simple, secure.
              </p>
            </div>
             <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-16 max-w-5xl mx-auto">
                <FeatureCarousel features={customerFeatures} link={postJobHref} cta="Post a Job" />
                <FeatureCarousel features={providerFeatures} link="/dashboard" cta="Find Work" />
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
                  <Link href={postJobHref}>
                    Post a Job
                  </Link>
                </Button>
                <Button size="lg" variant="secondary" asChild>
                  <Link href="/dashboard">Find Work</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-4 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t bg-card">
        <p className="text-xs text-foreground/60">&copy; 2024 ServiceHub. All rights reserved.</p>
        <nav className="sm:ml-auto flex flex-wrap justify-center gap-4 sm:gap-6">
           <Link href="#" className="text-xs hover:underline underline-offset-4">Terms of Service</Link>
           <Link href="#" className="text-xs hover:underline underline-offset-4">Privacy</Link>
        </nav>
      </footer>
    </div>
  );
}
