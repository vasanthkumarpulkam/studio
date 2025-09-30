import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Logo from '@/components/logo';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUpRight } from 'lucide-react';
import Testimonials from '@/components/testimonials';

export default function Home() {
  const userPostingJobImage = PlaceHolderImages.find(p => p.id === 'feature-1');
  const providerFindingWorkImage = PlaceHolderImages.find(p => p.id === 'feature-2');

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="px-4 lg:px-6 h-16 flex items-center shadow-sm bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <Link href="/" className="flex items-center justify-center">
          <Logo />
        </Link>
        <nav className="ml-auto flex gap-2 sm:gap-4 items-center">
          <Button variant="ghost" asChild size="sm">
            <Link href="#">Get the App</Link>
          </Button>
          <Button variant="ghost" asChild size="sm">
            <Link href="/dashboard/jobs/new">Post a Job</Link>
          </Button>
          <Button variant="ghost" asChild size="sm">
            <Link href="/dashboard">Find Work</Link>
          </Button>
          <Button variant="ghost" asChild size="sm">
            <Link href="#">Contact Us</Link>
          </Button>
          <Button asChild style={{ backgroundColor: 'hsl(var(--accent))', color: 'hsl(var(--accent-foreground))' }}>
            <Link href="/login">Login / Sign Up</Link>
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
            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <Link href="/dashboard/jobs/new">
                <Card className="group overflow-hidden rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-xl">
                    <CardHeader className="p-0 relative">
                        {userPostingJobImage && (
                            <Image
                                src={userPostingJobImage.imageUrl}
                                alt="Post a job"
                                width={600}
                                height={340}
                                className="object-cover w-full h-48"
                                data-ai-hint={userPostingJobImage.imageHint}
                            />
                        )}
                        <div className="absolute top-4 right-4 bg-card/80 backdrop-blur-sm rounded-full p-2">
                           <ArrowUpRight className="w-6 h-6 text-primary transition-transform group-hover:rotate-45" />
                        </div>
                    </CardHeader>
                    <CardContent className="p-6 bg-card">
                        <CardTitle className="font-headline text-2xl">Post a Job</CardTitle>
                        <CardDescription className="mt-2">
                         Describe your task, set a budget, and get bids instantly from verified providers.
                        </CardDescription>
                    </CardContent>
                </Card>
              </Link>
              <Link href="/dashboard">
                <Card className="group overflow-hidden rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-xl">
                    <CardHeader className="p-0 relative">
                        {providerFindingWorkImage && (
                            <Image
                                src={providerFindingWorkImage.imageUrl}
                                alt="Find work"
                                width={600}
                                height={340}
                                className="object-cover w-full h-48"
                                data-ai-hint={providerFindingWorkImage.imageHint}
                            />
                        )}
                         <div className="absolute top-4 right-4 bg-card/80 backdrop-blur-sm rounded-full p-2">
                           <ArrowUpRight className="w-6 h-6 text-primary transition-transform group-hover:rotate-45" />
                        </div>
                    </CardHeader>
                    <CardContent className="p-6 bg-card">
                        <CardTitle className="font-headline text-2xl">Find Work</CardTitle>
                        <CardDescription className="mt-2">
                         Browse nearby jobs, bid privately, and grow your income on your own schedule.
                        </CardDescription>
                    </CardContent>
                </Card>
              </Link>
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
                  <Link href="/dashboard/jobs/new">
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
        <p className="text-xs text-foreground/60">&copy; 2024 HandyConnect. All rights reserved.</p>
        <nav className="sm:ml-auto flex flex-wrap justify-center gap-4 sm:gap-6">
           <Link href="#" className="text-xs hover:underline underline-offset-4">Terms of Service</Link>
           <Link href="#" className="text-xs hover:underline underline-offset-4">Privacy</Link>
        </nav>
      </footer>
    </div>
  );
}
