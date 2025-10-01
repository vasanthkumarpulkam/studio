
'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { addDoc, collection, doc, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { db, storage }from '@/firebase/config';
import type { Bid, ChatMessage, Job, User, Provider } from '@/types';
import { moderateChatFlow } from '@/ai/flows/moderate-chat';
import { suggestInitialBid } from '@/ai/flows/suggest-initial-bid';


export async function submitBid(bidData: Omit<Bid, 'id' | 'submittedOn'>) {
    const jobRef = doc(db, 'job_posts', bidData.jobId);

    const newBid = {
        ...bidData,
        submittedOn: new Date().toISOString(),
    };
    
    await addDoc(collection(jobRef, 'bids'), newBid);

    const jobDoc = (await db.collection('job_posts').doc(bidData.jobId).get()).data() as Job;

    // Create a notification for the job poster
    await addDoc(collection(db, 'notifications'), {
        userId: jobDoc.postedBy,
        messageKey: 'notification_new_bid',
        messageParams: {
          amount: newBid.amount.toFixed(2),
          jobTitle: jobDoc.title,
        },
        link: `/dashboard/jobs/${bidData.jobId}`,
        isRead: false,
        createdAt: new Date().toISOString(),
    });
    
    revalidatePath(`/dashboard/jobs/${bidData.jobId}`);
    revalidatePath('/dashboard');
}


export async function acceptBid(jobId: string, bidId: string) {
    const jobRef = doc(db, 'job_posts', jobId);
    const bidRef = doc(jobRef, 'bids', bidId);

    const jobDoc = (await jobRef.get()).data() as Job;
    const bidDoc = (await bidRef.get()).data() as Bid;

    if (jobDoc && jobDoc.status === 'open' && bidDoc) {
        await updateDoc(jobRef, {
            status: 'pending-confirmation',
            acceptedBid: bidId,
        });

        await addDoc(collection(db, 'notifications'), {
            userId: bidDoc.providerId,
            messageKey: 'notification_bid_accepted',
            messageParams: {
              jobTitle: jobDoc.title,
            },
            link: `/dashboard/jobs/${jobId}`,
            isRead: false,
            createdAt: new Date().toISOString(),
        });
        
        revalidatePath(`/dashboard/jobs/${jobId}`);
        revalidatePath('/dashboard/my-bids');
        revalidatePath('/dashboard');
    } else {
        throw new Error('Job or Bid not found or not available for bidding.');
    }
}

export async function confirmJob(jobId: string) {
    const jobRef = doc(db, 'job_posts', jobId);
    const jobDoc = (await jobRef.get()).data() as Job;

     if (jobDoc && jobDoc.status === 'pending-confirmation') {
        await updateDoc(jobRef, {
            status: 'in-progress',
        });

        await addDoc(collection(db, 'notifications'), {
            userId: jobDoc.postedBy,
            messageKey: 'notification_job_confirmed',
            messageParams: {
              jobTitle: jobDoc.title,
            },
            link: `/dashboard/jobs/${jobId}`,
            isRead: false,
            createdAt: new Date().toISOString(),
        });

        revalidatePath(`/dashboard/jobs/${jobId}`);
        revalidatePath('/dashboard/my-bids');
        revalidatePath('/dashboard');
    } else {
        throw new Error('Could not confirm this job.');
    }
}


export async function startWork(jobId: string) {
    const jobRef = doc(db, 'job_posts', jobId);
    const jobDoc = (await jobRef.get()).data() as Job;
    if (jobDoc && jobDoc.status === 'in-progress') {
        await updateDoc(jobRef, { status: 'working' });
        revalidatePath(`/dashboard/jobs/${jobId}`);
        revalidatePath('/dashboard/my-bids');
        revalidatePath('/dashboard');
    } else {
        throw new Error('Could not start work on this job.');
    }
}


export async function markJobAsCompleted(jobId: string) {
    const jobRef = doc(db, 'job_posts', jobId);
    const jobDoc = (await jobRef.get()).data() as Job;
    if (jobDoc && (jobDoc.status === 'in-progress' || jobDoc.status === 'working')) {
        await updateDoc(jobRef, { status: 'completed' });

        revalidatePath(`/dashboard/jobs/${jobId}`);
        revalidatePath('/dashboard/my-bids');
        revalidatePath('/dashboard');
    } else {
        throw new Error('Job not found or not in progress.');
    }
}

export async function markNotificationAsRead(notificationId: string) {
    const notificationRef = doc(db, 'notifications', notificationId);
    await updateDoc(notificationRef, { isRead: true });
    revalidatePath('/dashboard'); 
}

export async function markAllNotificationsAsRead(userId: string) {
    const notificationsQuery = collection(db, 'notifications').where('userId', '==', userId).where('isRead', '==', false);
    const snapshot = await notificationsQuery.get();
    const batch = db.batch();
    snapshot.docs.forEach(doc => {
        batch.update(doc.ref, { isRead: true });
    });
    await batch.commit();
    revalidatePath('/dashboard');
}

export async function sendMessage(message: Omit<ChatMessage, 'id' | 'timestamp'>): Promise<ChatMessage> {
    const moderated = await moderateChatFlow(message.text);
    const newMessage = {
        ...message,
        text: moderated.moderatedText,
        timestamp: new Date().toISOString(),
    };
    const docRef = await addDoc(collection(db, 'chats'), newMessage);
    
    revalidatePath(`/dashboard/jobs/${message.jobId}`);
    return { ...newMessage, id: docRef.id };
}

async function uploadImage(file: File): Promise<string> {
    const storageRef = ref(storage, `jobs/${Date.now()}-${file.name}`);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
}

export async function postJob(jobData: Omit<Job, 'id' | 'postedOn' | 'status' | 'images'> & { images: File[] }, postedById: string) {
  const imageUrls = await Promise.all((jobData.images || []).map(file => uploadImage(file)));

  const newJob: Omit<Job, 'id'> = {
    ...jobData,
    postedBy: postedById,
    postedOn: new Date().toISOString(),
    status: 'open',
    images: imageUrls,
  };

  const docRef = await addDoc(collection(db, 'job_posts'), newJob);

  revalidatePath('/dashboard');
  revalidatePath('/dashboard/jobs/new');
  
  redirect(`/dashboard/jobs/${docRef.id}`);
}


export async function getAiBidSuggestion(jobDescription: string, jobCategory: string, userHistory: string, providerHistory: string): Promise<{ suggestedBid: number; reasoning: string }> {
  // In a real app you'd fetch real history. For now we use placeholder text.
  const suggestion = await suggestInitialBid({
    jobDescription,
    jobCategory,
    userJobHistory: 'User has hired for 5 jobs, average price $150.',
    providerBiddingHistory: 'Provider has won 10 bids in this category with an average bid of $80.',
    providerId: 'provider-id-placeholder'
  });

  return suggestion;
}

async function uploadAvatar(userId: string, file: File): Promise<string> {
    const storageRef = ref(storage, `avatars/${userId}/${file.name}`);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
}

export async function updateUserProfile(userId: string, data: Partial<User & Provider> & { avatar?: File | null }) {
  const userRef = doc(db, 'users', userId);

  let avatarUrl: string | undefined;
  if (data.avatar) {
    avatarUrl = await uploadAvatar(userId, data.avatar);
  } else if (data.avatar === null) {
    avatarUrl = '';
  }

  const { avatar, ...restOfData } = data;
  
  const updateData = { ...restOfData };
  if (avatarUrl !== undefined) {
      updateData.avatarUrl = avatarUrl;
  }

  if (Object.keys(updateData).length > 0) {
    await updateDoc(userRef, updateData);
  }
  
  revalidatePath('/dashboard/settings/profile');
  redirect('/dashboard/settings/profile');
}


// Admin actions
export async function updateUserRole(userId: string, newRole: 'customer' | 'provider' | 'admin') {
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, { role: newRole });
  revalidatePath('/admin/users');
}

export async function updateUserStatus(userId: string, newStatus: 'active' | 'suspended') {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, { status: newStatus });
    revalidatePath('/admin/users');
}

export async function addJobCategory(category: string) {
    // This is still a mock as we don't have a categories collection
    // In a real app, this would add a document to a 'jobCategories' collection
    console.log(`Adding category: ${category}`);
    return { success: true, message: `Category "${category}" added.` };
}

export async function removeJobCategory(category: string) {
    // This is still a mock
    console.log(`Removing category: ${category}`);
    return { success: true, message: `Category "${category}" removed.` };
}
