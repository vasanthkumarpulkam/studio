import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  getJob,
  getBidsForJob,
  getProvider,
  getCurrentUser,
} from '@/lib/data';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import BidForm from '@/components/bid-form';
import { format } from 'date-fns';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import AcceptBidButton from '@/components/accept-bid-button';
import MarkCompletedButton from '@/components/mark-completed-button';
import LeaveReviewForm from '@/components/leave-review-form';

export default function JobDetailsPage({ params }: { params: { id: string } }) {
  const job = getJob(params.id);
  const currentUser = getCurrentUser();

  if (!job) {
    notFound();
  }

  const bids = getBidsForJob(job.id);
  const isOwner = job.postedBy === currentUser.id;
  const isProvider = currentUser.role === 'provider';
  const hasPaymentMethod = currentUser.hasPaymentMethod;

  const statusColors = {
    open: 'bg-green-100 text-green-800 border-green-200',
    'in-progress': 'bg-blue-100 text-blue-800 border-blue-200',
    completed: 'bg-gray-100 text-gray-800 border-gray-200',
    disputed: 'bg-red-100 text-red-800 border-red-200',
  };

  const acceptedBid = job.acceptedBid ? bids.find(b => b.id === job.acceptedBid) : null;
  const acceptedProvider = acceptedBid ? getProvider(acceptedBid.providerId) : null;

  const PaymentAlert = () => (
     <Alert variant="destructive" className="mb-6">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Payment Method Required</AlertTitle>
        <AlertDescription>
          You must add a payment method to proceed.
          <Button asChild variant="secondary" size="sm" className="mt-2 ml-auto block">
            <Link href="/dashboard/settings/payment">
              <CreditCard className="mr-2 h-4 w-4"/>
              Add Payment Method
            </Link>
          </Button>
        </AlertDescription>
      </Alert>
  );

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
          <Card className="bg-white">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{job.category}</Badge>
                   {job.isCashOnly && (
                    <Badge variant="secondary" className="flex items-center gap-1.5">
                      <Banknote className="w-4 h-4"/> Cash Payment
                    </Badge>
                  )}
                </div>
                <Badge className={statusColors[job.status]}>{job.status}</Badge>
              </div>
              <CardTitle className="font-headline text-3xl pt-2">{job.title}</CardTitle>
              <CardDescription className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-2">
                <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4" /> {job.location}
                </span>
                <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" /> Posted on {format(new Date(job.postedOn), 'PPP')}
                </span>
                {job.budget && (
                  <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <CircleDollarSign className="w-4 h-4" /> Budget: ${job.budget}
                  </span>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-foreground/80 whitespace-pre-wrap">{job.description}</p>
              {job.images.length > 0 && (
                <div className="mt-6">
                  <h3 className="font-semibold mb-2">Photos</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {job.images.map((img, index) => (
                      <Image
                        key={index}
                        src={img}
                        alt={`Job image ${index + 1}`}
                        width={300}
                        height={200}
                        className="rounded-lg object-cover aspect-video"
                        data-ai-hint="job photo"
                      />
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {isProvider && !isOwner && job.status === 'open' && (
            <Card className="bg-white">
              <CardHeader>
                <CardTitle className="font-headline">Interested in this job?</CardTitle>
              </CardHeader>
              <CardContent>
                {!hasPaymentMethod ? <PaymentAlert /> : <BidForm job={job} />}
              </CardContent>
            </Card>
          )}

          {job.status === 'completed' && (isOwner || acceptedProvider?.id === currentUser.id) && (
            <Card>
              <CardHeader>
                <CardTitle className='font-headline'>Leave a Review</CardTitle>
                <CardDescription>Rate your experience with the {isOwner ? 'provider' : 'customer'}.</CardDescription>
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
          {job.status !== 'open' && acceptedProvider && (
            <Card className="bg-white">
              <CardHeader>
                <CardTitle className="font-headline text-xl">Provider Selected</CardTitle>
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
                        <span>Bid:</span>
                        <span className="font-bold text-foreground">${acceptedBid?.amount.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                  {job.status === 'in-progress' && (
                    <Alert variant="default" className="bg-blue-50 border-blue-200">
                        <Check className="h-4 w-4 text-blue-600"/>
                        <AlertTitle className="text-blue-800">Job In Progress</AlertTitle>
                        <AlertDescription className="text-blue-700">
                         {job.isCashOnly ? 'This is a cash job. Payment will be made directly to the provider. The platform fee will be charged to the provider\'s saved payment method upon completion.' : `Payment of $${acceptedBid?.amount.toFixed(2)} is held in escrow. Mark the job as completed once the work is done.`}
                        </AlertDescription>
                    </Alert>
                  )}
                  {isOwner && job.status === 'in-progress' && (
                    <div className="flex flex-col space-y-2">
                      <MarkCompletedButton jobId={job.id} />
                      <Button variant="outline" size="sm"><ShieldAlert className="mr-2 h-4 w-4"/>Dispute</Button>
                    </div>
                  )}
                  {currentUser.role === 'provider' && acceptedProvider.id === currentUser.id && job.status === 'in-progress' && (
                     <div className="flex flex-col space-y-2">
                        <MarkCompletedButton jobId={job.id} />
                        <Button variant="outline" size="sm"><ShieldAlert className="mr-2 h-4 w-4"/>Dispute</Button>
                     </div>
                  )}
                  {job.status === 'completed' && (
                     <Alert variant="default" className="bg-green-50 border-green-200">
                        <Check className="h-4 w-4 text-green-600"/>
                        <AlertTitle className="text-green-800">Job Completed!</AlertTitle>
                        <AlertDescription className="text-green-700">
                          {job.isCashOnly ? 'The provider has received cash payment. You can now leave a review.' : 'Payment has been released to the provider. You can now leave a review.'}
                        </AlertDescription>
                    </Alert>
                  )}
              </CardContent>
            </Card>
          )}
          
          {isOwner && job.status === 'open' && (
            <Card className="bg-white">
              <CardHeader>
                <CardTitle className="font-headline text-xl">
                  {bids.length} {bids.length === 1 ? 'Bid' : 'Bids'} Received
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!hasPaymentMethod && <PaymentAlert />}
                {bids.length > 0 ? (
                  <div className="space-y-4">
                    {bids.map((bid) => {
                      const provider = getProvider(bid.providerId);
                      if (!provider) return null;
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
                                   <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                     <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                                     <span>{provider.rating} ({provider.reviews} reviews)</span>
                                     {provider.isVerified && <ShieldCheck className="w-3 h-3 text-primary" />}
                                   </div>
                                 </div>
                             </div>
                             <p className="text-lg font-bold text-primary">${bid.amount}</p>
                          </div>
                          {bid.message && <p className="text-sm text-muted-foreground mt-2 pl-11">{bid.message}</p>}
                          <div className="flex justify-end mt-2">
                             <AcceptBidButton jobId={job.id} bidId={bid.id} disabled={!hasPaymentMethod}/>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground py-8">
                    <User className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2">No bids received yet. Check back soon!</p>
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
