
'use client';

import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Star } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const testimonials = [
  {
    name: 'Maria G.',
    role: 'User',
    review:
      'I posted a grass cutting job and within 15 minutes had 5 private bids. The provider I chose was professional, fast, and affordable. Highly recommend!',
    avatarId: 'user-avatar-1',
  },
  {
    name: 'David C.',
    role: 'Provider',
    review:
      'This platform gave me steady work in my area. The private bidding is fair, and I always get paid on time through the app.',
    avatarId: 'user-avatar-3',
  },
  {
    name: 'Emily R.',
    role: 'User',
    review:
      'Hired movers for my apartment — smooth process, clear pricing, and great customer support. Saved me hours of stress.',
    avatarId: 'user-avatar-4',
  },
  {
    name: 'Mike J.',
    role: 'Provider',
    review:
      'As a part-time electrician, this app helps me connect with customers instantly. I can bid privately and grow my business without paying upfront.',
    avatarId: 'user-avatar-2',
  },
];

export default function Testimonials() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/20">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">
              Trusted by Thousands of Users & Providers
            </h2>
            <p className="max-w-[900px] text-foreground/80 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Here’s what people are saying about their experience.
            </p>
          </div>
        </div>
        <Carousel
          opts={{
            align: 'start',
            loop: true,
          }}
          className="w-full max-w-4xl mx-auto mt-12"
        >
          <CarouselContent>
            {testimonials.map((testimonial, index) => {
              const avatar = PlaceHolderImages.find(p => p.id === testimonial.avatarId);
              return (
                <CarouselItem key={index} className="md:basis-1/2">
                  <div className="p-4">
                    <Card className="bg-background/70 backdrop-blur-sm">
                      <CardContent className="p-6 flex flex-col items-center text-center">
                        <Avatar className="w-20 h-20 mb-4">
                           <AvatarImage src={avatar?.imageUrl} alt={testimonial.name} />
                           <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <h3 className="font-semibold text-lg">{testimonial.name}</h3>
                        <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                        <div className="flex gap-0.5 my-2">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} className="w-5 h-5 text-amber-400 fill-amber-400" />
                            ))}
                        </div>
                        <p className="text-foreground/80">
                          “{testimonial.review}”
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              );
            })}
          </CarouselContent>
          <CarouselPrevious className="hidden sm:flex" />
          <CarouselNext className="hidden sm:flex" />
        </Carousel>
      </div>
    </section>
  );
}
