import { notFound } from 'next/navigation';
import {
  getJob,
  getBidsForJob,
  getProvider,
  getCurrentUser,
  getChatMessages,
  getUser,
} from '@/lib/data';
import JobDetailsView from '@/components/job-details-view';
import type { Job, Provider, User as UserType } from '@/types';

export default function JobDetailsPage({ params }: { params: { id: string } }) {
  const job = getJob(params.id);
  
  if (!job) {
    notFound();
  }

  const currentUser = getCurrentUser();
  const bids = getBidsForJob(job.id);
  const jobPoster = getUser(job.postedBy);
  const acceptedBid = job.acceptedBid ? bids.find(b => b.id === job.acceptedBid) : null;
  const acceptedProvider = acceptedBid ? getProvider(acceptedBid.providerId) : null;

  const chatMessages = (currentUser && acceptedProvider) 
    ? getChatMessages(job.id, acceptedProvider.id) 
    : [];

  return (
    <JobDetailsView
      job={job}
      bids={bids}
      currentUser={currentUser}
      jobPoster={jobPoster}
      acceptedProvider={acceptedProvider}
      acceptedBid={acceptedBid}
      chatMessages={chatMessages}
    />
  );
}
