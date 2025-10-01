
'use server';

import { jobs, bids as allBids, notifications as allNotifications, chats, users, providers } from '@/lib/data';
import type { Bid, ChatMessage, Job, User, Provider } from '@/types';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

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
    allNotifications.unshift({
        id: `notif-${Date.now()}`,
        userId: job.postedBy,
        message: `You received a new bid of $${newBid.amount.toFixed(2)} for your job "${job.title}".`,
        messageKey: 'notification_new_bid',
        messageParams: {
          amount: newBid.amount.toFixed(2),
          jobTitle: job.title,
        },
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
    const job = jobs.find(j => j.id === jobId);
    const bid = allBids.find(b => b.id === bidId);

    if (job && job.status === 'open' && bid) {
        job.status = 'pending-confirmation';
        job.acceptedBid = bidId;

        if (!job.isCashOnly) {
            const platformFee = bid.amount * 0.10;
            console.log(`Platform fee of $${platformFee.toFixed(2)} initiated as a pending charge for customer ${job.postedBy}.`);
            // In a real app, you would use a payment gateway to create a hold or authorization.
        }

        allNotifications.unshift({
            id: `notif-${Date.now()}`,
            userId: bid.providerId,
            message: `Your bid for "${job.title}" was accepted! Please confirm to start the job.`,
            messageKey: 'notification_bid_accepted',
            messageParams: {
              jobTitle: job.title,
            },
            link: `/dashboard/jobs/${job.id}`,
            isRead: false,
            createdAt: new Date().toISOString(),
        });
        
        console.log(`Bid ${bidId} accepted for job ${jobId}. Job status updated to pending-confirmation.`);
        revalidatePath(`/dashboard/jobs/${jobId}`);
        revalidatePath('/dashboard/my-bids');
        revalidatePath('/dashboard');
    } else {
        console.error('Job or Bid not found or not available for bidding.');
        throw new Error('Job or Bid not found or not available for bidding.');
    }
}

export async function confirmJob(jobId: string) {
    const job = jobs.find(j => j.id === jobId);
     if (job && job.status === 'pending-confirmation') {
        job.status = 'in-progress';

        allNotifications.unshift({
            id: `notif-${Date.now()}`,
            userId: job.postedBy,
            message: `Provider has confirmed and is ready to start work on "${job.title}".`,
            messageKey: 'notification_job_confirmed',
            messageParams: {
              jobTitle: job.title,
            },
            link: `/dashboard/jobs/${job.id}`,
            isRead: false,
            createdAt: new Date().toISOString(),
        });

        console.log(`Provider confirmed job ${jobId}. Job status updated to in-progress.`);
        revalidatePath(`/dashboard/jobs/${jobId}`);
        revalidatePath('/dashboard/my-bids');
        revalidatePath('/dashboard');
    } else {
        console.error('Job not found or not in the correct state to confirm.');
        throw new Error('Could not confirm this job.');
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

        const acceptedBid = allBids.find(b => b.id === job.acceptedBid);

        if (job.isCashOnly && acceptedBid) {
             const platformFee = acceptedBid.amount * 0.10;
             console.log(`Cash job completed. Deducting platform fee of $${platformFee.toFixed(2)} from provider ${acceptedBid.providerId}.`);
             // In a real app, you would charge the provider's saved payment method.
        } else if (acceptedBid) {
            console.log(`Payment of $${acceptedBid.amount.toFixed(2)} released to provider ${acceptedBid.providerId}.`);
        }

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

export async function moderateChat(message: string): Promise<string> {
    // This is a mock function that would normally call a Genkit flow.
    // For now, it just returns the original message.
    return message;
}


export async function postJob(jobData: Omit<Job, 'id' | 'postedOn' | 'status' | 'images'> & { images: File[] }, postedById: string) {
  // In a real app, you would handle file uploads to a storage service like S3 or GCS
  // For this mock, we'll just use placeholder URLs
  const imageUrls = (jobData.images || []).map((file, index) => {
    // This is a mock; in a real app, you'd get a URL from your storage service
    return `/placeholder-job-image-${Date.now()}-${index}.jpg`;
  });

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
  
  redirect(`/dashboard/jobs/${newJob.id}`);
}


export async function getAiBidSuggestion(jobDescription: string, jobCategory: string): Promise<{ suggestedBid: number; reasoning: string }> {
  // This is a mock function. In a real app, this would call a Genkit flow.
  console.log(`Getting AI suggestion for: ${jobCategory} - ${jobDescription}`);
  
  // Simulate a delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const basePrice = Math.random() * 100 + 50;
  const suggestedBid = Math.round(basePrice / 5) * 5; // Round to nearest 5

  const reasoning = `Based on the job category '${jobCategory}' and the complexity described, we suggest a starting bid of $${suggestedBid}. This considers typical market rates and the estimated effort involved.`;

  return { suggestedBid, reasoning };
}


export async function updateUserProfile(userId: string, data: Partial<User & Provider>) {
  const userIndex = users.findIndex(u => u.id === userId);
  if (userIndex !== -1) {
    users[userIndex] = { ...users[userIndex], ...data };
  }

  const providerIndex = providers.findIndex(p => p.id === userId);
  if (providerIndex !== -1) {
    providers[providerIndex] = { ...providers[providerIndex], ...data };
  }

  console.log('User profile updated:', users[userIndex]);
  if (providerIndex !== -1) {
    console.log('Provider profile updated:', providers[providerIndex]);
  }
  
  revalidatePath('/dashboard/settings/profile');
  redirect('/dashboard/settings/profile');
}
