
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  MapPin,
  Calendar,
  CircleDollarSign,
  Star,
  ShieldCheck,
  Check,
  User,
  AlertTriangle,
  CreditCard,
  ShieldAlert,
  Banknote,
  Play,
  Hammer,
  Clock,
  Briefcase,
  MessageSquare,
  ArrowLeft,
  LogIn,
  Hourglass,
  ThumbsUp,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import BidForm from '@/components/bid-form';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import AcceptBidButton from '@/components/accept-bid-button';
import MarkCompletedButton from '@/components/mark-completed-button';
import LeaveReviewForm from '@/components/leave-review-form';
import StartWorkButton from '@/components/start-work-button';
import type { Job, Provider, User as UserType, Bid, ChatMessage } from '@/types';
import ChatModal from '@/components/chat-modal';
import ConfirmJobButton from '@/components/confirm-job-button';
import { getProvider } from '@/lib/data';
import { useTranslation } from '@/hooks/use-translation';


interface JobDetailsViewProps {
    job: Job;
    bids: Bid[];
    currentUser: UserType | Provider | null;
    jobPoster: UserType | undefined;
    acceptedProvider: Provider | null;
    acceptedBid: Bid | null;
    chatMessages: ChatMessage[];
}


export default function JobDetailsView({ job, bids, currentUser, jobPoster, acceptedProvider, acceptedBid, chatMessages }: JobDetailsViewProps) {
  const { t, isTranslationReady, language } = useTranslation();
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const isOwner = currentUser ? job.postedBy === currentUser.id : false;
  const currentUserIsProvider = currentUser?.role === 'provider';
  
  let canProviderBid = false;
  if (currentUserIsProvider && currentUser) {
    const providerProfile = getProvider(currentUser.id);
    const hasAlreadyBid = bids.some(bid => bid.providerId === currentUser.id);
    canProviderBid = (providerProfile?.skills.includes(job.category) ?? false) && !hasAlreadyBid;
  }

  const hasPaymentMethod = currentUser?.hasPaymentMethod ?? false;

  const statusColors: { [key: string]: string } = {
    open: 'bg-green-100 text-green-800 border-green-200',
    'pending-confirmation': 'bg-amber-100 text-amber-800 border-amber-200',
    'in-progress': 'bg-blue-100 text-blue-800 border-blue-200',
    working: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    completed: 'bg-gray-100 text-gray-800 border-gray-200',
    disputed: 'bg-red-100 text-red-800 border-red-200',
  };

  const statusIcons = {
      'pending-confirmation': <Hourglass className="h-4 w-4 text-amber-600"/>,
      'in-progress': <ThumbsUp className="h-4 w-4 text-blue-600"/>,
      working: <Hammer className="h-4 w-4 text-yellow-600"/>,
      completed: <Check className="h-4 w-4 text-green-600"/>,
  }

  const handleNextImage = () => {
    if (selectedImageIndex !== null && selectedImageIndex < job.images.length - 1) {
      setSelectedImageIndex(selectedImageIndex + 1);
    }
  };

  const handlePrevImage = () => {
    if (selectedImageIndex !== null && selectedImageIndex > 0) {
      setSelectedImageIndex(selectedImageIndex - 1);
    }
  };

  const PaymentAlert = () => (
     <Alert variant="destructive" className="mb-6">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>{t('payment_alert_title')}</AlertTitle>
        <AlertDescription>
          {t('job_details_payment_alert_desc')}
          <Button asChild variant="secondary" size="sm" className="mt-2 ml-auto block">
            <Link href="/dashboard/settings/payment">
              <CreditCard className="mr-2 h-4 w-4"/>
              {t('payment_alert_button')}
            </Link>
          </Button>
        </AlertDescription>
      </Alert>
  );

  const jobTitle = isTranslationReady && language === 'es' && job.i18n?.es?.title ? job.i18n.es.title : job.title;
  const jobDescription = isTranslationReady && language === 'es' && job.i18n?.es?.description ? job.i18n.es.description : job.description;
  const jobLocation = isTranslationReady && language === 'es' && job.i18n?.es?.location ? job.i18n.es.location : job.location;
  const jobCategoryKey = `category_${job.category.replace(/\s/g, '_').toLowerCase()}`;

  if (!isTranslationReady) {
      return <div>{t('loading')}</div>
  }

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <div className="mb-6">
        <Button asChild variant="outline" size="sm">
          <Link href="/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('job_details_back_button')}
          </Link>
        </Button>
      </div>
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{t(jobCategoryKey)}</Badge>
                   {job.isCashOnly && (
                    <Badge variant="secondary" className="flex items-center gap-1.5">
                      <Banknote className="w-4 h-4"/> {t('job_details_cash_payment')}
                    </Badge>
                  )}
                </div>
                <Badge className={statusColors[job.status]}>{t(`job_status_${job.status}`)}</Badge>
              </div>
              <CardTitle className="font-headline text-3xl pt-2">{jobTitle}</CardTitle>
              <CardDescription className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-2">
                <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4" /> {jobLocation}
                </span>
                <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" /> {t('job_details_posted_on')} {format(new Date(job.postedOn), 'PPP', { locale: language === 'es' ? es : undefined })}
                </span>
                {job.budget && (
                  <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <CircleDollarSign className="w-4 h-4" /> {t('job_details_budget')}: ${job.budget}
                  </span>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-foreground/80 whitespace-pre-wrap">{jobDescription}</p>
              {job.images.length > 0 && (
                <div className="mt-6">
                  <h3 className="font-semibold mb-2">{t('job_details_photos')}</h3>
                  <Dialog>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {job.images.map((img, index) => (
                        <DialogTrigger asChild key={index} onClick={() => setSelectedImageIndex(index)}>
                          <div className="cursor-pointer overflow-hidden rounded-lg">
                            <Image
                              src={img}
                              alt={`Job image ${index + 1}`}
                              width={300}
                              height={200}
                              className="rounded-lg object-cover aspect-video hover:scale-105 transition-transform duration-300"
                              data-ai-hint="job photo"
                            />
                          </div>
                        </DialogTrigger>
                      ))}
                    </div>
                     <DialogContent className="max-w-4xl p-0">
                      <DialogTitle className="sr-only">{t('job_details_image_preview_title')}</DialogTitle>
                      {selectedImageIndex !== null && (
                        <div className="relative">
                           <Image
                            src={job.images[selectedImageIndex]}
                            alt={`Job image ${selectedImageIndex + 1}`}
                            width={1200}
                            height={800}
                            className="rounded-md object-contain max-h-[80vh]"
                          />
                          {job.images.length > 1 && (
                            <>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="absolute left-2 top-1/2 -translate-y-1/2 h-10 w-10 bg-black/30 text-white hover:bg-black/50 hover:text-white"
                                onClick={handlePrevImage}
                                disabled={selectedImageIndex === 0}
                              >
                                <ChevronLeft className="h-6 w-6" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 bg-black/30 text-white hover:bg-black/50 hover:text-white"
                                onClick={handleNextImage}
                                disabled={selectedImageIndex === job.images.length - 1}
                              >
                                <ChevronRight className="h-6 w-6" />
                              </Button>
                            </>
                          )}
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                </div>
              )}
            </CardContent>
          </Card>

          {!currentUser && job.status === 'open' && !isOwner && (
            <Card>
              <CardHeader>
                <CardTitle className="font-headline">{t('job_details_want_to_bid_title')}</CardTitle>
                <CardDescription>
                  {t('job_details_want_to_bid_desc')}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex gap-4">
                <Button asChild>
                  <Link href={`/login?redirect=/dashboard/jobs/${job.id}`}>
                    <LogIn className="mr-2 h-4 w-4" /> {t('login_button')}
                  </Link>
                </Button>
                <Button asChild variant="secondary">
                  <Link href={`/signup?redirect=/dashboard/jobs/${job.id}`}>{t('job_details_signup_provider_button')}</Link>
                </Button>
              </CardContent>
            </Card>
          )}

          {currentUserIsProvider && !isOwner && job.status === 'open' && (
            <Card>
              <CardHeader>
                <CardTitle className="font-headline">{t('job_details_interested_title')}</CardTitle>
              </CardHeader>
              <CardContent>
                {!canProviderBid && bids.some(b => b.providerId === currentUser.id) ? (
                  <Alert>
                    <Check className="h-4 w-4" />
                    <AlertTitle>{t('job_details_already_bid_title')}</AlertTitle>
                    <AlertDescription>
                     {t('job_details_already_bid_desc')}
                     <Button asChild variant="link" className="p-0 h-auto mt-2">
                       <Link href="/dashboard/my-bids">{t('job_details_go_to_my_bids')}</Link>
                     </Button>
                    </AlertDescription>
                  </Alert>
                ) : !canProviderBid ? (
                   <Alert>
                    <Briefcase className="h-4 w-4" />
                    <AlertTitle>{t('job_details_skillset_mismatch_title')}</AlertTitle>
                    <AlertDescription>
                     {t('job_details_skillset_mismatch_desc', { category: t(jobCategoryKey) })}
                    </AlertDescription>
                  </Alert>
                ) : !hasPaymentMethod ? (
                  <PaymentAlert />
                ) : (
                  <BidForm job={job} />
                )}
              </CardContent>
            </Card>
          )}

          {job.status === 'completed' && (isOwner || (acceptedProvider && currentUser && acceptedProvider.id === currentUser.id)) && currentUser && (
            <Card>
              <CardHeader>
                <CardTitle className='font-headline'>{t('job_details_leave_review_title')}</CardTitle>
                <CardDescription>{t('job_details_leave_review_desc', { role: isOwner ? t('job_details_provider') : t('job_details_customer') })}</CardDescription>
              </CardHeader>
              <CardContent>
                <LeaveReviewForm 
                  jobId={job.id} 
                  revieweeId={isOwner ? acceptedProvider!.id : job.postedBy}
                  reviewerRole={currentUser.role}
                />
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          {(job.status !== 'open' && acceptedProvider && currentUser && jobPoster) && (
            <Card>
              <CardHeader>
                <CardTitle className="font-headline text-xl">{t('job_details_provider_selected_title')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                 <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={acceptedProvider.avatarUrl} alt={acceptedProvider.name} />
                      <AvatarFallback>{acceptedProvider.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{acceptedProvider.name}</p>
                       <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <span>{t('job_details_bid_label')}:</span>
                        <span className="font-bold text-foreground">${acceptedBid?.amount.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  <ChatModal 
                    triggerButton={
                      <Button variant="outline" className="w-full">
                          <MessageSquare className="mr-2 h-4 w-4"/>
                          {t('job_details_message_button', { role: isOwner ? t('job_details_provider') : t('job_details_customer') })}
                      </Button>
                    }
                    messages={chatMessages}
                    jobTitle={job.title}
                    recipient={isOwner ? acceptedProvider : jobPoster}
                    currentUser={currentUser}
                    jobId={job.id}
                    providerId={acceptedProvider.id}
                  />

                  {job.status === 'pending-confirmation' && (
                     <Alert variant="default" className="bg-amber-50 border-amber-200">
                        {statusIcons[job.status]}
                        <AlertTitle className="text-amber-800">{t('job_details_pending_alert_title')}</AlertTitle>
                        <AlertDescription className="text-amber-700">
                         {t('job_details_pending_alert_desc')}
                        </AlertDescription>
                    </Alert>
                  )}

                  {job.status === 'in-progress' && (
                     <Alert variant="default" className="bg-blue-50 border-blue-200">
                        {statusIcons[job.status]}
                        <AlertTitle className="text-blue-800">{t('job_details_confirmed_alert_title')}</AlertTitle>
                        <AlertDescription className="text-blue-700">
                         {t('job_details_confirmed_alert_desc')}
                        </AlertDescription>
                    </Alert>
                  )}

                  {job.status === 'working' && (
                     <Alert variant="default" className="bg-yellow-50 border-yellow-200">
                        {statusIcons[job.status]}
                        <AlertTitle className="text-yellow-800">{t('job_details_working_alert_title')}</AlertTitle>
                        <AlertDescription className="text-yellow-700">
                          {job.isCashOnly ? t('job_details_working_alert_desc_cash') : t('job_details_working_alert_desc_escrow', { amount: acceptedBid?.amount.toFixed(2) })}
                        </AlertDescription>
                    </Alert>
                  )}

                  {isOwner && (job.status === 'in-progress' || job.status === 'working' || job.status === 'pending-confirmation') && (
                    <div className="flex flex-col space-y-2">
                       {job.status !== 'pending-confirmation' && <MarkCompletedButton jobId={job.id} />}
                      <Button variant="outline" size="sm"><ShieldAlert className="mr-2 h-4 w-4"/>{t('job_details_dispute_button')}</Button>
                    </div>
                  )}
                  
                  {currentUser?.role === 'provider' && acceptedProvider.id === currentUser.id && job.status === 'pending-confirmation' && (
                     <div className="flex flex-col space-y-2">
                        <ConfirmJobButton jobId={job.id} />
                     </div>
                  )}

                  {currentUser?.role === 'provider' && acceptedProvider.id === currentUser.id && job.status === 'in-progress' && (
                     <div className="flex flex-col space-y-2">
                        <StartWorkButton jobId={job.id} />
                     </div>
                  )}

                  {currentUser?.role === 'provider' && acceptedProvider.id === currentUser.id && job.status === 'working' && (
                     <div className="flex flex-col space-y-2">
                        <MarkCompletedButton jobId={job.id} />
                        <Button variant="outline" size="sm"><ShieldAlert className="mr-2 h-4 w-4"/>{t('job_details_dispute_button')}</Button>
                     </div>
                  )}

                  {job.status === 'completed' && (
                     <Alert variant="default" className="bg-green-50 border-green-200">
                        {statusIcons[job.status]}
                        <AlertTitle className="text-green-800">{t('job_details_completed_alert_title')}</AlertTitle>
                        <AlertDescription className="text-green-700">
                          {job.isCashOnly ? t('job_details_completed_alert_desc_cash') : t('job_details_completed_alert_desc_escrow')}
                        </AlertDescription>
                    </Alert>
                  )}
              </CardContent>
            </Card>
          )}
          
          {isOwner && job.status === 'open' && (
            <Card>
              <CardHeader>
                <CardTitle className="font-headline text-xl">
                  {bids.length} {t(bids.length === 1 ? 'job_details_bid' : 'job_details_bids')} {t('job_details_received')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!hasPaymentMethod && <PaymentAlert />}
                {bids.length > 0 ? (
                  <div className="space-y-4">
                    {bids.map((bid) => {
                      const provider = getProvider(bid.providerId);
                      if (!provider) return null;

                      const bidMessage = isTranslationReady && language === 'es' && bid.i18n?.es?.message ? bid.i18n.es.message : bid.message;

                      return (
                        <div key={bid.id} className="p-4 border rounded-lg">
                          <div className="flex justify-between items-start">
                             <div className="flex items-center gap-3">
                                <Avatar>
                                   <AvatarImage src={provider.avatarUrl} alt={provider.name} />
                                   <AvatarFallback>{provider.name.charAt(0)}</AvatarFallback>
                                 </Avatar>
                                 <div>
                                   <p className="font-semibold">{provider.name}</p>
                                   <div className="flex items-center flex-wrap gap-x-2 gap-y-1 text-xs text-muted-foreground">
                                     <span className="flex items-center gap-1">
                                        <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                                        {provider.rating} ({provider.reviews} {t('job_details_reviews')})
                                     </span>
                                     {provider.isVerified && <ShieldCheck className="w-3 h-3 text-primary" />}
                                     {bid.completionTime && (
                                        <span className="flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {bid.completionTime}
                                        </span>
                                     )}
                                   </div>
                                 </div>
                             </div>
                             <p className="text-lg font-bold text-primary">${bid.amount}</p>
                          </div>
                          {bidMessage && <p className="text-sm text-muted-foreground mt-2 pl-11">{bidMessage}</p>}
                          <div className="flex justify-end mt-3 gap-2">
                             <AcceptBidButton jobId={job.id} bidId={bid.id} disabled={!hasPaymentMethod}/>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground py-8">
                    <User className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2">{t('job_details_no_bids_yet')}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
