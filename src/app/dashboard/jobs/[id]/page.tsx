
'use client';

import React from 'react';
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

export default function JobDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  // Correctly unwrap the promise for params using React.use()
  const { id } = React.use(params);

  // Fetch data directly since `id` is now available synchronously
  const job = getJob(id);
  const currentUser = getCurrentUser();

  // If the job doesn't exist after fetching, then show notFound
  if (!job) {
    notFound();
  }

  const bids = getBidsForJob(job.id);
  const jobPoster = getUser(job.postedBy);
  const acceptedBid = job.acceptedBid ? bids.find(b => b.id === job.acceptedBid) : null;
  const acceptedProvider = acceptedBid ? getProvider(acceptedBid.providerId) : null;

  const chatMessages = (currentUser && (isOwner(job, currentUser) || (acceptedProvider && currentUser.id === acceptedProvider.id))) 
    ? getChatMessages(job.id, acceptedProvider ? acceptedProvider.id : bids[0]?.providerId) 
    : [];

  function isOwner(job: any, user: any) {
    return job.postedBy === user.id;
  }

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
