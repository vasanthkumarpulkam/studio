
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Logo from '@/components/logo';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Users, ShieldCheck, Star, MapPin, ChevronRight } from 'lucide-react';
import Testimonials from '@/components/testimonials';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { useUser } from '@/firebase';
import { Footer } from '@/components/footer';
import { useTranslation } from '@/hooks/use-translation';
import LanguageSwitcher from '@/components/language-switcher';
import Script from 'next/script';

export default function Home() {
  const { t, isTranslationReady } = useTranslation();
  const { user: currentUser } = useUser();

  const postJobHref = currentUser ? '/dashboard/jobs/new' : '/login';
  const findWorkHref = '/dashboard';

  const heroImage = PlaceHolderImages.find(p => p.id === 'hero-image');

  if (!isTranslationReady) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Script id="ld-json-landing" type="application/ld+json" strategy="afterInteractive">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: 'ServiceHub',
          url: 'https://example.com',
          potentialAction: {
            '@type': 'SearchAction',
            target: 'https://example.com/jobs?q={search_term_string}',
            'query-input': 'required name=search_term_string'
          }
        })}
      </Script>
      <header className="px-4 lg:px-6 h-16 flex items-center shadow-sm bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <Logo href="/" />
        <nav className="ml-auto flex gap-4 sm:gap-6 items-center">
          <Button variant="ghost" asChild>
            <Link href={findWorkHref}>{t('landing_find_work_button')}</Link>
          </Button>
          <Button variant="ghost" asChild>
             <Link href="#">{t('landing_how_it_works_button')}</Link>
          </Button>
           <LanguageSwitcher />
          {currentUser ? (
            <Button asChild>
                <Link href="/dashboard">Dashboard</Link>
            </Button>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link href="/login">{t('landing_login_button')}</Link>
              </Button>
              <Button asChild>
                <Link href="/signup">{t('landing_signup_button')}</Link>
              </Button>
            </>
          )}
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-16 md:py-28 lg:py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.08),transparent_60%)]" />
          <div className="container px-4 md:px-6">
            <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
              <div className="flex flex-col justify-center space-y-6">
                <div className="space-y-4">
                  <h1 className="text-4xl font-bold tracking-tighter sm:text-6xl md:text-7xl font-headline">
                    {t('landing_hero_title')}
                  </h1>
                  <p className="max-w-[680px] text-foreground/80 md:text-xl">
                    {t('landing_hero_subtitle')}
                  </p>
                </div>
                <div className="flex flex-col gap-4 min-[400px]:flex-row">
                  <Button asChild size="lg">
                    <Link href={postJobHref}>
                      {t('landing_post_job_button')} <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="secondary">
                     <Link href={findWorkHref}>
                      {t('landing_find_work_button')} <Users className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                </div>
                <div className="flex items-center gap-6 pt-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-primary"/>Verified providers</div>
                  <div className="flex items-center gap-2"><Star className="h-4 w-4 text-amber-500"/>Private bids only</div>
                  <div className="flex items-center gap-2"><MapPin className="h-4 w-4"/>Texas-focused</div>
                </div>
              </div>
              <div className="relative h-72 md:h-[520px]">
                {heroImage &&
                    <Image
                    src={heroImage.imageUrl}
                    alt="Hero"
                    fill
                    className="rounded-2xl object-cover shadow-2xl"
                    data-ai-hint={heroImage.imageHint}
                  />
                }
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-20 lg:py-24">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">{t('landing_how_it_works_title')}</h2>
                <p className="max-w-[900px] text-foreground/80 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  {t('landing_how_it_works_subtitle')}
                </p>
              </div>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-10">
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="font-headline">{t('landing_feature1_title')}</CardTitle>
                  <CardDescription>{t('landing_feature1_description')}</CardDescription>
                </CardHeader>
              </Card>
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="font-headline">{t('landing_feature2_title')}</CardTitle>
                  <CardDescription>{t('landing_feature2_description')}</CardDescription>
                </CardHeader>
              </Card>
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="font-headline">{t('landing_feature3_title')}</CardTitle>
                  <CardDescription>{t('landing_feature3_description')}</CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>
        <section className="w-full py-10">
          <div className="container px-4 md:px-6">
            <h3 className="text-xl font-semibold mb-4">Explore popular services</h3>
            <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {['Cleaning','Moving','Landscaping','Handyman','Events','Other'].map(cat => (
                <Link key={cat} href={`/services/${cat.toLowerCase()}`} className="group flex items-center justify-between rounded-md border p-3 hover:bg-accent">
                  <span>{cat}</span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground"/>
                </Link>
              ))}
            </div>
          </div>
        </section>
        
        <Testimonials />
        
        <section className="w-full py-12 md:py-24 lg:py-32 bg-card">
          <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
            <div className="space-y-3">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight font-headline">
                {t('landing_cta_title')}
              </h2>
              <p className="max-w-[600px] mx-auto text-foreground/80 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                {t('landing_cta_subtitle')}
              </p>
            </div>
            <div className="mx-auto w-full max-w-sm space-y-2">
              <div className="flex justify-center gap-4">
                <Button size="lg" asChild>
                  <Link href={postJobHref}>
                    {t('landing_cta_button')}
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
