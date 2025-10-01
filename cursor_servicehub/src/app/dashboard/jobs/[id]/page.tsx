
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { notFound } from 'next/navigation';
import { getProvider } from '@/lib/data';
import JobDetailsView from '@/components/job-details-view';
import type { User, Provider, Job, Bid, ChatMessage } from '@/types';
import { useUser, useDoc, useCollection, useMemoFirebase } from '@/firebase';
import { doc, collection, query, where } from 'firebase/firestore';
import { db } from '@/firebase/config';
import { Loader2 } from 'lucide-react';


export default function JobDetailsPage({ params }: any) {
  const { id } = params;
  const { user: currentUser, isUserLoading } = useUser();

  const jobRef = useMemoFirebase(() => doc(db, 'job_posts', id), [id]);
  const { data: job, isLoading: isJobLoading } = useDoc<Job>(jobRef);

  const bidsRef = useMemoFirebase(() => job ? collection(jobRef, 'bids') : null, [job, jobRef]);
  const { data: bids, isLoading: areBidsLoading } = useCollection<Bid>(bidsRef);

  const jobPosterRef = useMemoFirebase(() => job ? doc(db, 'users', job.postedBy) : null, [job]);
  const { data: jobPoster } = useDoc<User>(jobPosterRef);
  
  const acceptedBid = useMemo(() => {
    if (!job || !bids) return null;
    return job.acceptedBid ? (bids.find(b => b.id === job.acceptedBid) ?? null) : null;
  }, [job, bids]);

  const acceptedProviderRef = useMemoFirebase(() => {
    if (!acceptedBid) return null;
    return doc(db, 'users', acceptedBid.providerId);
  }, [acceptedBid]);
  const { data: acceptedProvider } = useDoc<Provider>(acceptedProviderRef);
  
  const isOwner = currentUser && job ? job.postedBy === currentUser.uid : false;

  const chatMessagesQuery = useMemoFirebase(() => {
    if (currentUser && job && (isOwner || (acceptedProvider && currentUser.uid === acceptedProvider.uid))) {
      return query(
        collection(db, 'chats'),
        where('jobId', '==', job.id)
      );
    }
    return null;
  }, [currentUser, job, isOwner, acceptedProvider]);
  
  const { data: chatMessages } = useCollection<ChatMessage>(chatMessagesQuery);
  
  if (isUserLoading || isJobLoading || areBidsLoading) {
    return <div className="flex h-screen w-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  if (!job) {
    notFound();
  }

  return (
    <JobDetailsView
      job={job}
      bids={bids || []}
      currentUser={currentUser}
      jobPoster={jobPoster ?? undefined}
      acceptedProvider={acceptedProvider}
      acceptedBid={acceptedBid}
      chatMessages={chatMessages || []}
    />
  );
}

    