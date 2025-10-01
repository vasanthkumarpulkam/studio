'use server';

import { suggestInitialBid } from '@/ai/flows/suggest-initial-bid';
import type { SuggestInitialBidOutput } from '@/ai/flows/suggest-initial-bid';
import { moderateChatFlow } from '@/ai/flows/moderate-chat';
import { jobs, bids as allBids, notifications as allNotifications, chats } from '@/lib/data';
import type { Bid, ChatMessage, Job } from '@/types';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function getAiBidSuggestion(jobDescription: string, jobCategory: string): Promise<SuggestInitialBidOutput> {
  // In a real app, you'd fetch this data from your database
  const dummyData = {
    providerId: 'provider-123',
    userJobHistory: 'User has previously paid $50 for grass cutting and $200 for a small plumbing repair. Tends to accept bids slightly below the average.',
    providerBiddingHistory: 'Provider has successfully bid on 5 similar jobs in the last month, with an average bid of $70. Win rate is 60% when bidding in the $65-$75 range.',
    jobDescription,
    jobCategory,
  };

  try {
    const suggestion = await suggestInitialBid(dummyData);
    return suggestion;
  } catch (error) {
    console.error('AI suggestion failed:', error);
    // Return a structured error or re-throw
    throw new Error('Failed to get AI suggestion.');
  }
}

export async function submitBid(bidData: Omit<Bid, 'id' | 'submittedOn'>) {
    const job = jobs.find(j => j.id === bidData.jobId);
    if (!job) {
        throw new Error('Job not found.');
    }

    const newBid: Bid = {
        ...bidData,
        id: `bid-${Date.now()}`,
        submittedOn: new Date().toISOString(),
    };
    allBids.push(newBid);

    // Create a notification for the job poster
    allNotifications.push({
        id: `notif-${Date.now()}`,
        userId: job.postedBy,
        message: `You received a new bid of $${newBid.amount.toFixed(2)} for your job "${job.title}".`,
        link: `/dashboard/jobs/${job.id}`,
        isRead: false,
        createdAt: new Date().toISOString(),
    });

    console.log('New bid submitted:', newBid);
    console.log('New notification created for user:', job.postedBy);
    
    revalidatePath(`/dashboard/jobs/${job.id}`);
    revalidatePath('/dashboard');
}


export async function acceptBid(jobId: string, bidId: string) {
    // In a real app, you would update this in your database
    const job = jobs.find(j => j.id === jobId);
    if (job && job.status === 'open') {
        job.status = 'in-progress';
        job.acceptedBid = bidId;
        console.log(`Bid ${bidId} accepted for job ${jobId}. Job status updated to in-progress.`);
        revalidatePath(`/dashboard/jobs/${jobId}`);
        revalidatePath('/dashboard/my-bids');
        revalidatePath('/dashboard');
    } else {
        console.error('Job not found or not available for bidding.');
        throw new Error('Job not found or not available for bidding.');
    }
}

export async function startWork(jobId: string) {
    const job = jobs.find(j => j.id === jobId);
    if (job && job.status === 'in-progress') {
        job.status = 'working';
        console.log(`Work started for job ${jobId}.`);
        revalidatePath(`/dashboard/jobs/${jobId}`);
        revalidatePath('/dashboard/my-bids');
        revalidatePath('/dashboard');
    } else {
        console.error('Job not found or not in the correct state to start work.');
        throw new Error('Could not start work on this job.');
    }
}


export async function markJobAsCompleted(jobId: string) {
    const job = jobs.find(j => j.id === jobId);
    if (job && (job.status === 'in-progress' || job.status === 'working')) {
        job.status = 'completed';
        console.log(`Job ${jobId} marked as completed.`);
        revalidatePath(`/dashboard/jobs/${jobId}`);
        revalidatePath('/dashboard/my-bids');
        revalidatePath('/dashboard');
    } else {
        console.error('Job not found or not in progress.');
        throw new Error('Job not found or not in progress.');
    }
}

export async function markNotificationAsRead(notificationId: string) {
    const notification = allNotifications.find(n => n.id === notificationId);
    if (notification) {
        notification.isRead = true;
        revalidatePath('/dashboard'); // Revalidate a common path to trigger data refetch
    }
}

export async function markAllNotificationsAsRead(userId: string) {
    allNotifications.forEach(n => {
        if (n.userId === userId) {
            n.isRead = true;
        }
    });
    revalidatePath('/dashboard'); // Revalidate a common path to trigger data refetch
}

export async function moderateChat(message: string): Promise<string> {
    try {
        const result = await moderateChatFlow(message);
        return result.moderatedText;
    } catch (error) {
        console.error('Chat moderation failed:', error);
        return message; // Fallback to original message on error
    }
}

export async function sendMessage(message: Omit<ChatMessage, 'id' | 'timestamp'>): Promise<ChatMessage> {
    const newMessage: ChatMessage = {
        ...message,
        id: `chat-${Date.now()}`,
        timestamp: new Date().toISOString(),
    };
    chats.push(newMessage);
    // In a real app with websockets, you'd revalidate/push to clients here
    revalidatePath(`/dashboard/jobs/${message.jobId}`);
    return newMessage;
}

export async function postJob(jobData: Omit<Job, 'id' | 'postedOn' | 'status' | 'images'> & { images: File[] }, postedById: string) {
  // In a real app, you would handle file uploads to a storage service like S3 or GCS
  // For this mock, we'll just use placeholder URLs
  const imageUrls = jobData.images.map((_, index) => `/placeholder-job-image-${index}.jpg`);

  const newJob: Job = {
    ...jobData,
    id: `job-${Date.now()}`,
    postedBy: postedById,
    postedOn: new Date().toISOString(),
    status: 'open',
    images: imageUrls,
  };

  jobs.unshift(newJob); // Add to the beginning of the list

  console.log('New job posted:', newJob);
  
  // Revalidate paths to show the new job everywhere
  revalidatePath('/dashboard');
  revalidatePath('/dashboard/jobs/new');
  revalidatePath(`/dashboard/jobs/${newJob.id}`);
  
  redirect(`/dashboard/jobs/${newJob.id}`);
}
