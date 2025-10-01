
'use client';

import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
} from 'firebase/firestore';
import { db } from '@/firebase/config';
import type { Job, Bid, Provider } from '@/types';

export async function getJobsForCustomer(userId: string): Promise<Job[]> {
  const q = query(collection(db, 'job_posts'), where('postedBy', '==', userId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Job));
}

export async function getOpenJobsForProvider(provider: Provider): Promise<Job[]> {
  if (!provider.skills || provider.skills.length === 0) return [];
  const q = query(
    collection(db, 'job_posts'),
    where('status', '==', 'open'),
    where('category', 'in', provider.skills)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Job));
}

export async function getAllOpenJobs(): Promise<Job[]> {
  const q = query(collection(db, 'job_posts'), where('status', '==', 'open'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Job));
}

export async function getJob(id: string): Promise<Job | null> {
  const docRef = doc(db, 'job_posts', id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as Job;
  }
  return null;
}

export async function getBidsForJob(jobId: string): Promise<Bid[]> {
  const bidsRef = collection(db, 'job_posts', jobId, 'bids');
  const snapshot = await getDocs(bidsRef);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Bid));
}
