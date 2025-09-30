import type { User, Provider, Job, Bid } from '@/types';
import { PlaceHolderImages } from './placeholder-images';

const avatar1 = PlaceHolderImages.find(p => p.id === 'user-avatar-1')?.imageUrl || '';
const avatar2 = PlaceHolderImages.find(p => p.id === 'user-avatar-2')?.imageUrl || '';
const avatar3 = PlaceHolderImages.find(p => p.id === 'user-avatar-3')?.imageUrl || '';
const avatar4 = PlaceHolderImages.find(p => p.id === 'user-avatar-4')?.imageUrl || '';

const jobImage1 = PlaceHolderImages.find(p => p.id === 'job-plumbing')?.imageUrl || '';
const jobImage2 = PlaceHolderImages.find(p => p.id === 'job-lawn')?.imageUrl || '';
const jobImage3 = PlaceHolderImages.find(p => p.id === 'job-floor')?.imageUrl || '';


export const users: User[] = [
  { id: 'user-1', name: 'Sarah Lee', email: 'sarah.lee@example.com', avatarUrl: avatar1, role: 'customer', hasPaymentMethod: false },
  { id: 'user-2', name: 'Mike Johnson', email: 'mike.j@example.com', avatarUrl: avatar2, role: 'provider', hasPaymentMethod: true },
  { id: 'user-3', name: 'David Chen', email: 'david.chen@example.com', avatarUrl: avatar3, role: 'provider', hasPaymentMethod: true },
  { id: 'user-4', name: 'Emily Rodriguez', email: 'emily.r@example.com', avatarUrl: avatar4, role: 'provider', hasPaymentMethod: false },
];

export const providers: Provider[] = [
  { id: 'user-2', name: 'Mike Johnson', email: 'mike.j@example.com', avatarUrl: avatar2, role: 'provider', rating: 4.8, reviews: 25, isVerified: true, skills: ['Plumbing', 'General Repair', 'Handyman Work', 'Appliance Repairs'], location: 'San Francisco, CA', hasPaymentMethod: true },
  { id: 'user-3', name: 'David Chen', email: 'david.chen@example.com', avatarUrl: avatar3, role: 'provider', rating: 4.9, reviews: 42, isVerified: true, skills: ['Flooring', 'Painting', 'Tiling'], location: 'San Francisco, CA', hasPaymentMethod: true },
  { id: 'user-4', name: 'Emily Rodriguez', email: 'emily.r@example.com', avatarUrl: avatar4, role: 'provider', rating: 4.7, reviews: 18, isVerified: false, skills: ['Grass Cutting', 'Gardening', 'Landscaping'], location: 'Oakland, CA', hasPaymentMethod: false },
];

export const jobs: Job[] = [
  {
    id: 'job-1',
    title: 'Fix leaky kitchen sink',
    description: 'My kitchen sink faucet has been dripping for a week and it\'s starting to get on my nerves. It seems to be coming from the base of the faucet. Looking for an experienced plumber to fix it.',
    category: 'Plumbing',
    location: 'San Francisco, CA',
    budget: 150,
    postedBy: 'user-1',
    postedOn: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'open',
    images: [jobImage1],
    isCashOnly: false,
  },
  {
    id: 'job-2',
    title: 'Mow my front and back lawn',
    description: 'The grass is getting really long and I don\'t have time to mow it myself this week. The total area is about 1/4 acre. Need someone to mow and clean up the clippings.',
    category: 'Grass Cutting',
    location: 'Oakland, CA',
    budget: 60,
    postedBy: 'user-1',
    postedOn: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'working',
    acceptedBid: 'bid-3',
    images: [jobImage2],
    isCashOnly: true,
  },
  {
    id: 'job-3',
    title: 'Refinish hardwood floors in living room',
    description: 'My hardwood floors have seen better days. There are a number of scratches and scuffs. The living room is approximately 200 sq ft. I want them sanded, stained, and sealed.',
    category: 'Flooring',
    location: 'San Francisco, CA',
    postedBy: 'user-1',
    postedOn: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'completed',
    acceptedBid: 'bid-4',
    images: [jobImage3],
  },
];

export const bids: Bid[] = [
  { id: 'bid-1', jobId: 'job-1', providerId: 'user-2', amount: 120, completionTime: '2-3 hours', submittedOn: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), message: "Hi Sarah, I\'m a licensed plumber with 10 years of experience. I can take a look and fix that leak for you. I have all the necessary tools." },
  { id: 'bid-2', jobId: 'job-1', providerId: 'user-4', amount: 140, completionTime: '4 hours', submittedOn: new Date(Date.now() - 22 * 60 * 60 * 1000).toISOString() },
  { id: 'bid-3', jobId: 'job-2', providerId: 'user-4', amount: 55, completionTime: '1 day', submittedOn: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'bid-4', jobId: 'job-3', providerId: 'user-3', amount: 850, completionTime: '3-4 days', submittedOn: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(), message: 'I specialize in hardwood floor refinishing and can make your floors look brand new.' },
];

// In a real app, this would involve authentication. Here, we'll just mock it.
// We can switch the current user by changing the ID here.
const MOCKED_CURRENT_USER_ID = 'user-2'; // 'user-1' (customer), 'user-2' (provider), 'user-3' (provider), 'user-4' (provider)

export function getCurrentUser(): User {
  const user = users.find(u => u.id === MOCKED_CURRENT_USER_ID);
  if (!user) {
    const provider = getProvider(MOCKED_CURRENT_USER_ID);
    if (!provider) throw new Error('Mocked user not found');
    return provider;
  }
  return user;
}

export function getProvider(id: string): Provider | undefined {
  return providers.find(p => p.id === id);
}

export function getJobsForCustomer(userId: string): Job[] {
  return jobs.filter(j => j.postedBy === userId);
}

export function getOpenJobsForProvider(providerId: string): Job[] {
    const provider = getProvider(providerId);
    if (!provider) return [];
    
    return jobs.filter(job => job.status === 'open' && provider.skills.includes(job.category));
}

export function getAllOpenJobs(): Job[] {
  return jobs.filter(j => j.status === 'open');
}

export function getJob(id: string): Job | undefined {
  return jobs.find(j => j.id === id);
}

export function getBidsForJob(jobId: string): Bid[] {
  return bids.filter(b => b.jobId === jobId);
}

export const jobCategories = [
    'Cleaning',
    'Cooking',
    'Babysitting',
    'Gardening',
    'Grass Cutting',
    'Laundry',
    'Dishwashing',
    'Handyman Work',
    'Appliance Repairs',
    'Car Repairs',
    'Plumbing',
    'Electrical',
    'AC/Heating',
    'Tiling',
    'Flooring',
    'Painting',
    'Roofing',
    'Packing',
    'Movers',
    'Furniture Assembly',
    'Storage Help',
    'Truck Rentals',
    'Delivery Support',
    'Decoration',
    'Catering',
    'DJ',
    'Bartenders',
    'Photographers',
    'Videographers',
    'Event Helpers',
    'Drivers',
    'Security',
    'General Labor',
    'Construction',
    'Shop Assistant',
    'Cash-Only Job',
    'Tutoring',
    'Personal Training',
    'Pet Care',
    'Tech Setup',
    'Freelance Computer Work',
    'Other'
];
