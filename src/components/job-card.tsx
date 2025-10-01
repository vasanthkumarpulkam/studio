
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Calendar, CircleDollarSign, Tag, ArrowRight, Loader2 } from 'lucide-react';
import type { Job, User, Provider } from '@/types';
import { format, formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { getCurrentUser } from '@/lib/data';
import { useEffect, useState } from 'react';
import { useTranslation } from '@/hooks/use-translation';

type JobCardProps = {
  job: Job;
  role: 'customer' | 'provider';
  isGrid?: boolean;
};

export function JobCard({ job, role, isGrid = false }: JobCardProps) {
  const [currentUser, setCurrentUser] = useState<User | Provider | null>(null);
  const { t, isTranslationReady, language } = useTranslation();

  useEffect(() => {
    setCurrentUser(getCurrentUser());
  }, []);

  const statusColors: { [key: string]: string } = {
    open: 'bg-green-100 text-green-800 border-green-200',
    'pending-confirmation': 'bg-amber-100 text-amber-800 border-amber-200',
    'in-progress': 'bg-blue-100 text-blue-800 border-blue-200',
    working: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    completed: 'bg-gray-100 text-gray-800 border-gray-200',
    disputed: 'bg-red-100 text-red-800 border-red-200',
  };

  const jobTitle = isTranslationReady && language === 'es' && job.i18n?.es?.title ? job.i18n.es.title : job.title;
  const jobDescription = isTranslationReady && language === 'es' && job.i18n?.es?.description ? job.i18n.es.description : job.description;
  const jobLocation = isTranslationReady && language === 'es' && job.i18n?.es?.location ? job.i18n.es.location : job.location;
  const jobCategoryKey = `category_${job.category.replace(/\s/g, '_').toLowerCase()}`;


  if (!isTranslationReady) {
    return (
        <Card className="flex flex-col">
            <CardHeader><Loader2 className="h-8 w-8 animate-spin text-primary" /></CardHeader>
            <CardContent><p>{t('loading')}</p></CardContent>
        </Card>
    );
  }

  if (isGrid) {
    return (
      <Card className="hover:shadow-lg transition-shadow duration-300 bg-card flex flex-col">
        <CardHeader>
          <div className="flex justify-between items-start">
              <CardTitle className="font-bold text-lg">
                  <Link href={`/dashboard/jobs/${job.id}`} className="hover:underline">
                      {jobTitle}
                  </Link>
              </CardTitle>
              <Badge className={statusColors[job.status]}>{t(`job_status_${job.status}`)}</Badge>
          </div>
          <CardDescription className="flex items-center gap-2 pt-1">
              <Tag className="w-3.5 h-3.5" /> 
              <span className="text-sm">{t(jobCategoryKey)}</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-grow space-y-3">
          <p className="text-sm text-muted-foreground line-clamp-2">{jobDescription}</p>
          <div className='space-y-2 text-sm'>
              <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="w-4 h-4" /> 
                  <span>{jobLocation}</span>
              </div>
              {job.budget && (
                   <div className="flex items-center gap-2 text-muted-foreground">
                      <CircleDollarSign className="w-4 h-4" />
                      <span>{t('job_card_budget')}: ${job.budget}</span>
                  </div>
              )}
              <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="w-4 h-4" /> 
                  <span>{t('job_card_posted')} {format(new Date(job.postedOn), 'PP', { locale: language === 'es' ? es : undefined })}</span>
              </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button asChild className="w-full">
            <Link href={`/dashboard/jobs/${job.id}`}>
              {t('job_card_view_details')} <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
     <Card className="hover:shadow-lg transition-shadow duration-300 bg-card overflow-hidden">
        <div className="grid md:grid-cols-[200px_1fr]">
            <div className="relative">
                {job.images[0] ? (
                    <Image 
                        src={job.images[0]}
                        alt={job.title}
                        fill
                        className="object-cover"
                        data-ai-hint="job photo"
                    />
                ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center">
                        <Tag className="w-10 h-10 text-muted-foreground" />
                    </div>
                )}
            </div>
            <div className="flex flex-col">
                <CardHeader>
                    <div className="flex justify-between items-start gap-2">
                        <CardTitle className="font-bold text-lg">
                            <Link href={`/dashboard/jobs/${job.id}`} className="hover:underline">
                                {jobTitle}
                            </Link>
                        </CardTitle>
                        <Badge className={statusColors[job.status]} variant="outline">{t(`job_status_${job.status}`)}</Badge>
                    </div>
                    <CardDescription className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-1">
                        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Tag className="w-3.5 h-3.5" /> 
                            {t(jobCategoryKey)}
                        </span>
                        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <MapPin className="w-3.5 h-3.5" /> 
                            {jobLocation}
                        </span>
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                     <p className="text-sm text-muted-foreground line-clamp-2">{jobDescription}</p>
                </CardContent>
                <CardFooter className="flex-wrap justify-between items-center bg-muted/50 p-4">
                     <div className="flex items-center gap-4 text-sm">
                        {job.budget && (
                            <div className="flex items-center gap-1.5 font-semibold">
                                <CircleDollarSign className="w-4 h-4 text-green-600" />
                                <span>${job.budget}</span>
                            </div>
                        )}
                         <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
                            <Calendar className="w-4 h-4" /> 
                            <span>{formatDistanceToNow(new Date(job.postedOn), { addSuffix: true, locale: language === 'es' ? es : undefined })}</span>
                        </div>
                    </div>
                    <Button asChild size="sm" className="mt-2 md:mt-0">
                        <Link href={`/dashboard/jobs/${job.id}`}>
                            {currentUser && role === 'provider' ? t('job_card_view_bid') : t('job_card_view_details')}
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </CardFooter>
            </div>
        </div>
     </Card>
  );
}
