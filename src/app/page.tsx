import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Logo from '@/components/logo';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Search, Handshake, ShieldCheck, FileText, Banknote, UserCheck, MessageSquareQuote, ArrowRight, Star } from 'lucide-react';

export default function Home() {
  const heroImage = PlaceHolderImages.find(p => p.id === 'hero-image');
  
  const howItWorks = [
    {
      icon: <FileText className="w-10 h-10 text-primary" />,
      title: "1. Post Your Job",
      description: "Describe the service you need, set your budget, and post your job for providers to see. It's quick, easy, and free.",
    },
    {
      icon: <Handshake className="w-10 h-10 text-primary" />,
      title: "2. Get Private Bids",
      description: "Receive competitive bids directly from verified and skilled providers. Compare offers and profiles in your private inbox.",
    },
    {
      icon: <ShieldCheck className="w-10 h-10 text-primary" />,
      title: "3. Hire & Pay Securely",
      description: "Accept the best bid, pay securely into our escrow system, and release the funds only when you confirm the job is done.",
    }
  ];

  const trustFeatures = [
    {
      icon: <UserCheck className="w-8 h-8 text-primary" />,
      title: 'KYC Verified Providers',
      description: 'Every provider is vetted for identity and skills, ensuring you hire professionals you can trust.',
    },
    {
      icon: <Banknote className="w-8 h-8 text-primary" />,
      title: 'Secure Escrow Payments',
      description: 'Your payment is held safely until you confirm the job is completed to your satisfaction.',
    },
    {
      icon: <MessageSquareQuote className="w-8 h-8 text-primary" />,
      title: 'Dispute Resolution',
      description: 'In the rare case of a disagreement, our admin team is here to mediate and ensure a fair outcome.',
    },
    {
      icon: <Star className="w-8 h-8 text-primary" />,
      title: 'Transparent Reviews',
      description: 'Make informed decisions by reading authentic ratings and reviews from other users.',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="px-4 lg:px-6 h-16 flex items-center shadow-sm bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <Link href="/" className="flex items-center justify-center">
          <Logo />
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6 items-center">
          <Button variant="ghost" asChild>
            <Link href="/login">Log In</Link>
          </Button>
          <Button asChild>
            <Link href="/signup">Sign Up</Link>
          </Button>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-white">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              {heroImage && 
                <Image
                  src={heroImage.imageUrl}
                  alt={heroImage.description}
                  width={600}
                  height={400}
                  data-ai-hint={heroImage.imageHint}
                  className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last lg:aspect-square"
                />
              }
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-4">
                  <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none font-headline">
                    Hire Experts for Any Job, Anytime.
                  </h1>
                  <p className="max-w-[600px] text-foreground/80 md:text-xl">
                    From car repairs to babysitting — post a job, get bids, and hire with trust.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button size="lg" asChild>
                    <Link href="/signup">Post a Job</Link>
                  </Button>
                   <Button size="lg" variant="secondary" asChild>
                    <Link href="/signup">Become a Provider</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">How It Works</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">Get Your Job Done in 3 Easy Steps</h2>
                <p className="max-w-[900px] text-foreground/80 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our platform simplifies the process of finding and hiring skilled workers. Here’s how simple it is.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:max-w-none lg:grid-cols-3 mt-12">
              {howItWorks.map((step, index) => (
                <Card key={index} className="bg-white/70 transform hover:scale-105 transition-transform duration-300">
                  <CardHeader className="flex flex-col items-center text-center">
                    {step.icon}
                    <CardTitle className="mt-4 font-headline">{step.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center text-foreground/80">
                    <p>{step.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
        
        <section className="w-full py-12 md:py-24 lg:py-32 bg-white">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">Trust & Safety</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">Your Peace of Mind is Our Priority</h2>
                <p className="max-w-[900px] text-foreground/80 md:text-xl/relaxed">
                  We built our platform with robust security features to ensure every job is safe, secure, and satisfactory.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl gap-8 sm:grid-cols-2 lg:gap-12 mt-12">
              {trustFeatures.map((feature, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold font-headline">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>


        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
            <div className="space-y-3">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight font-headline">
                Ready to Get Started?
              </h2>
              <p className="mx-auto max-w-[600px] text-foreground/80 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Join our community of satisfied customers and professional service providers today. Your next job or provider is just a click away.
              </p>
            </div>
            <div className="mx-auto w-full max-w-sm space-y-2">
              <div className="flex justify-center gap-4">
                <Button size="lg" asChild>
                  <Link href="/signup">
                    Hire Now <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="secondary" asChild>
                  <Link href="/signup">Find Work</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-4 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-foreground/60">&copy; 2024 ServiceHub. All rights reserved.</p>
        <nav className="sm:ml-auto flex flex-wrap justify-center gap-4 sm:gap-6">
           <Link href="#" className="text-xs hover:underline underline-offset-4">About Us</Link>
           <Link href="#" className="text-xs hover:underline underline-offset-4">Careers</Link>
           <Link href="#" className="text-xs hover:underline underline-offset-4">Blog</Link>
           <Link href="#" className="text-xs hover:underline underline-offset-4">Support</Link>
           <Link href="#" className="text-xs hover:underline underline-offset-4">Terms of Service</Link>
           <Link href="#" className="text-xs hover:underline underline-offset-4">Privacy</Link>
        </nav>
      </footer>
    </div>
  );
}
