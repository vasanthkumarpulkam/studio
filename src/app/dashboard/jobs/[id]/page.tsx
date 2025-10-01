
'use client';

import { useEffect, useState } from 'react';
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
import type { Job, Provider, User as UserType, Bid, ChatMessage } from '@/types';
import { Loader2 } from 'lucide-react';

export default function JobDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const [currentUser, setCurrentUser] = useState<UserType | Provider | null>(null);
  const [job, setJob] = useState<Job | null | undefined>(null);

  useEffect(() => {
    setCurrentUser(getCurrentUser());
    const jobData = getJob(id);
    setJob(jobData);
  }, [id]);

  if (job === null) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (job === undefined) {
    notFound();
  }

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
