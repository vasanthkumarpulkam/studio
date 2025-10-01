import type { User, Provider, Job, Bid, Notification, ChatMessage } from '@/types';
import { PlaceHolderImages } from './placeholder-images';
import { notifications as initialNotifications } from './notifications';

const avatar1 = PlaceHolderImages.find(p => p.id === 'user-avatar-1')?.imageUrl || '';
const avatar2 = PlaceHolderImages.find(p => p.id === 'user-avatar-2')?.imageUrl || '';
const avatar3 = PlaceHolderImages.find(p => p.id === 'user-avatar-3')?.imageUrl || '';
const avatar4 = PlaceHolderImages.find(p => p.id === 'user-avatar-4')?.imageUrl || '';
const avatar5 = PlaceHolderImages.find(p => p.id === 'user-avatar-5')?.imageUrl || '';
const avatar6 = PlaceHolderImages.find(p => p.id === 'user-avatar-6')?.imageUrl || '';


const jobImagePlumbing1 = PlaceHolderImages.find(p => p.id === 'job-plumbing-1')?.imageUrl || '';
const jobImagePlumbing2 = PlaceHolderImages.find(p => p.id === 'job-plumbing-2')?.imageUrl || '';
const jobImagePlumbing3 = PlaceHolderImages.find(p => p.id === 'job-plumbing-3')?.imageUrl || '';
const jobImageLawn = PlaceHolderImages.find(p => p.id === 'job-lawn')?.imageUrl || '';
const jobImageFloor1 = PlaceHolderImages.find(p => p.id === 'job-floor-1')?.imageUrl || '';
const jobImageFloor2 = PlaceHolderImages.find(p => p.id === 'job-floor-2')?.imageUrl || '';
const jobImageIkea1 = PlaceHolderImages.find(p => p.id === 'job-ikea-1')?.imageUrl || '';
const jobImageIkea2 = PlaceHolderImages.find(p => p.id === 'job-ikea-2')?.imageUrl || '';


export const users: User[] = [
  { id: 'user-1', name: 'Vasanth Kumar', email: 'vasanth.kumar@example.com', avatarUrl: avatar1, role: 'customer', hasPaymentMethod: true },
  { id: 'user-2', name: 'Mike Johnson', email: 'mike.j@example.com', avatarUrl: avatar2, role: 'provider', hasPaymentMethod: true },
  { id: 'user-3', name: 'David Chen', email: 'david.chen@example.com', avatarUrl: avatar3, role: 'provider', hasPaymentMethod: true },
  { id: 'user-4', name: 'Emily Rodriguez', email: 'emily.r@example.com', avatarUrl: avatar4, role: 'provider', hasPaymentMethod: false },
  { id: 'user-5', name: 'James Brown', email: 'james.brown@example.com', avatarUrl: avatar5, role: 'provider', hasPaymentMethod: true },
  { id: 'user-6', name: 'Jessica Williams', email: 'jessica.w@example.com', avatarUrl: avatar6, role: 'provider', hasPaymentMethod: true },
];

export const providers: Provider[] = [
  { id: 'user-2', name: 'Mike Johnson', email: 'mike.j@example.com', avatarUrl: avatar2, role: 'provider', rating: 4.8, reviews: 25, isVerified: true, skills: ['Plumbing', 'General Repair', 'Handyman Work', 'Appliance Repairs', 'Electrical'], location: 'San Francisco, CA', hasPaymentMethod: true },
  { id: 'user-3', name: 'David Chen', email: 'david.chen@example.com', avatarUrl: avatar3, role: 'provider', rating: 4.9, reviews: 42, isVerified: true, skills: ['Flooring', 'Painting', 'Tiling', 'Electrical', 'Furniture Assembly'], location: 'San Francisco, CA', hasPaymentMethod: true },
  { id: 'user-4', name: 'Emily Rodriguez', email: 'emily.r@example.com', avatarUrl: avatar4, role: 'provider', rating: 4.7, reviews: 18, isVerified: false, skills: ['Grass Cutting', 'Gardening', 'Landscaping'], location: 'Oakland, CA', hasPaymentMethod: false },
  { id: 'user-5', name: 'James Brown', email: 'james.brown@example.com', avatarUrl: avatar5, role: 'provider', rating: 4.9, reviews: 55, isVerified: true, skills: ['Movers', 'Packing', 'Storage Help', 'General Labor'], location: 'New York, NY', hasPaymentMethod: true },
  { id: 'user-6', name: 'Jessica Williams', email: 'jessica.w@example.com', avatarUrl: avatar6, role: 'provider', rating: 4.8, reviews: 33, isVerified: true, skills: ['Cleaning', 'Cooking', 'Babysitting', 'Laundry'], location: 'Chicago, IL', hasPaymentMethod: true },
];

export let jobs: Job[] = [
  { id: 'job-1', title: 'Fix leaky kitchen sink', description: 'The pipe under my kitchen sink is dripping. It seems to be coming from one of the joints. I have a bucket under it now, but I need a permanent fix. I have attached photos of the setup.', category: 'Plumbing', location: 'San Francisco, CA', postedBy: 'user-1', postedOn: '2024-05-28T12:00:00.000Z', status: 'open', images: [jobImagePlumbing1, jobImagePlumbing2, jobImagePlumbing3], budget: 150 },
  { id: 'job-2', title: 'Mow my lawn and trim edges', description: 'My front and back lawns are overgrown. I need someone to mow them, trim the edges along the driveway and sidewalk, and bag the clippings.', category: 'Grass Cutting', location: 'Oakland, CA', postedBy: 'user-1', postedOn: '2024-05-25T12:00:00.000Z', status: 'completed', images: [jobImageLawn], budget: 50, acceptedBid: 'bid-3' },
  { id: 'job-3', title: 'Repair scratched hardwood floor', description: 'My movers scratched a section of the hardwood floor in my living room. It\'s about a 2-foot long scratch, moderately deep. Need it repaired and refinished to match the rest of the floor.', category: 'Flooring', location: 'San Francisco, CA', postedBy: 'user-1', postedOn: '2024-05-20T12:00:00.000Z', status: 'open', images: [jobImageFloor1, jobImageFloor2] },
  { id: 'job-4', title: 'Assemble IKEA bookshelf', description: 'I have a new IKEA BILLY bookshelf in the box that needs to be assembled. All parts and instructions are included. The job should be quick for someone who knows what they\'re doing.', category: 'Furniture Assembly', location: 'San Francisco, CA', postedBy: 'user-1', postedOn: '2024-05-29T12:00:00.000Z', status: 'in-progress', images: [jobImageIkea1, jobImageIkea2], budget: 80, acceptedBid: 'bid-4' },
];

export let bids: Bid[] = [
    { id: 'bid-1', jobId: 'job-1', providerId: 'user-2', amount: 140, submittedOn: '2024-05-29T12:00:00.000Z', completionTime: '2-3 hours', message: 'I can take care of that for you this afternoon. I have all the necessary tools and parts.' },
    { id: 'bid-2', jobId: 'job-1', providerId: 'user-3', amount: 155, submittedOn: '2024-05-29T14:00:00.000Z', completionTime: 'Tomorrow morning', message: 'Hi, I\'m an experienced plumber and can fix your leaky sink quickly. My bid includes all materials.' },
    { id: 'bid-3', jobId: 'job-2', providerId: 'user-4', amount: 45, submittedOn: '2024-05-26T12:00:00.000Z' },
    { id: 'bid-4', jobId: 'job-4', providerId: 'user-3', amount: 75, submittedOn: '2024-05-29T16:00:00.000Z', message: 'I build IKEA furniture all the time. I can get this done for you in about an hour.' },
];

export let chats: ChatMessage[] = [
    { id: 'chat-1', jobId: 'job-4', providerId: 'user-3', senderId: 'user-1', text: 'Hi David, thanks for your bid. When would you be available to assemble the bookshelf?', timestamp: '2024-05-29T18:00:00.000Z' },
    { id: 'chat-2', jobId: 'job-4', providerId: 'user-3', senderId: 'user-3', text: 'Hello! I can come by tomorrow around 2 PM if that works for you.', timestamp: '2024-05-29T19:00:00.000Z' },
];

export let notifications: Notification[] = initialNotifications.slice();


export { initialNotifications };

const MOCK_USER_ID_KEY = 'mockUserId';

export function login(userId: string | null) {
    if (typeof window !== 'undefined') {
        if (userId) {
            window.localStorage.setItem(MOCK_USER_ID_KEY, userId);
        } else {
            window.localStorage.removeItem(MOCK_USER_ID_KEY);
        }
    }
}

export function getCurrentUser(): User | Provider | null {
  if (typeof window === 'undefined') {
    return null;
  }
  
  const MOCKED_CURRENT_USER_ID = window.localStorage.getItem(MOCK_USER_ID_KEY);
  
  if (!MOCKED_CURRENT_USER_ID) {
    return null;
  }
  
  const user = users.find(u => u.id === MOCKED_CURRENT_USER_ID);
  if (!user) return null;

  if (user.role === 'provider') {
    const providerDetails = providers.find(p => p.id === user.id);
    return { ...user, ...providerDetails } as Provider;
  }

  return user;
}

export function getUser(id: string): User | undefined {
  return users.find(u => u.id === id);
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

export function getNotificationsForUser(userId:string): Notification[] {
    return notifications.filter(n => n.userId === userId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function getChatMessages(jobId: string, providerId: string): ChatMessage[] {
    return chats.filter(c => c.jobId === jobId && c.providerId === providerId)
                .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
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
    bids.push(newBid);

    // Create a notification for the job poster
    notifications.unshift({
        id: `notif-${Date.now()}`,
        userId: job.postedBy,
        message: `You received a new bid of $${newBid.amount.toFixed(2)} for your job "${job.title}".`,
        link: `/dashboard/jobs/${job.id}`,
        isRead: false,
        createdAt: new Date().toISOString(),
    });
}
