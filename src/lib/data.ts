import type { User, Provider, Job, Bid, Notification, ChatMessage } from '@/types';
import { PlaceHolderImages } from './placeholder-images';
import { notifications } from './notifications';

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

export const jobs: Job[] = [
  {
    id: 'job-1',
    title: 'Fix leaky kitchen sink',
    description: 'There is a constant drip under my kitchen sink. It seems to be coming from the cold water line. I have tried tightening the fittings but it hasnt stopped. The cabinet underneath is starting to get water damage. Need someone to come and fix it as soon as possible.',
    category: 'Plumbing',
    location: 'San Francisco, CA',
    budget: 150,
    postedBy: 'user-1',
    postedOn: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'open',
    images: [jobImagePlumbing1, jobImagePlumbing2, jobImagePlumbing3],
    isCashOnly: false,
  },
  {
    id: 'job-2',
    title: 'Mow lawn and trim hedges',
    description: 'My front and back lawns need cutting. The backyard is about 500 sq ft and the front is smaller. Hedges along the fence also need trimming. I have a green waste bin for the clippings.',
    category: 'Grass Cutting',
    location: 'Oakland, CA',
    budget: 80,
    postedBy: 'user-1',
    postedOn: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'in-progress',
    acceptedBid: 'bid-3',
    images: [jobImageLawn],
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
    images: [jobImageFloor1, jobImageFloor2],
    isCashOnly: false,
  },
  {
    id: 'job-4',
    title: 'Assemble IKEA bed frame and dresser',
    description: 'I just moved and have a new MALM bed frame and a 6-drawer dresser from IKEA that need to be assembled. I have all the boxes and parts.',
    category: 'Furniture Assembly',
    location: 'Berkeley, CA',
    budget: 120,
    postedBy: 'user-1',
    postedOn: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'open',
    images: [],
    isCashOnly: false,
  },
  {
    id: 'job-5',
    title: 'Install new ceiling fan in bedroom',
    description: 'Need a licensed electrician to remove an old light fixture and install a new ceiling fan with a light kit. The ceiling is standard height (8 ft).',
    category: 'Electrical',
    location: 'San Jose, CA',
    budget: 200,
    postedBy: 'user-1',
    postedOn: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'open',
    images: [],
    isCashOnly: false,
  },
  {
    id: 'job-6',
    title: 'Weed and mulch garden beds',
    description: 'Front yard garden beds are full of weeds. Need someone to clear them out, lay down new weed barrier fabric, and spread mulch. Mulch will be provided.',
    category: 'Gardening',
    location: 'Palo Alto, CA',
    budget: 180,
    postedBy: 'user-1',
    postedOn: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'open',
    images: [],
    isCashOnly: true,
  },
  {
    id: 'job-7',
    title: 'Apartment deep cleaning',
    description: 'Need a deep clean for a 2-bedroom apartment in Manhattan before a new tenant moves in. Includes kitchen, bathrooms, and windows.',
    category: 'Cleaning',
    location: 'New York, NY',
    budget: 250,
    postedBy: 'user-1',
    postedOn: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'open',
    images: [],
    isCashOnly: false,
  },
  {
    id: 'job-8',
    title: 'Paint interior of a studio apartment',
    description: 'Looking for a painter to paint a ~500 sq ft studio apartment. Walls and ceiling. Paint will be provided. Job is in downtown Chicago.',
    category: 'Painting',
    location: 'Chicago, IL',
    budget: 400,
    postedBy: 'user-1',
    postedOn: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'open',
    images: [],
    isCashOnly: false,
  },
  {
    id: 'job-9',
    title: 'Mount a 65-inch TV on the wall',
    description: 'I need a 65-inch TV mounted on a drywall wall. I have the TV and the wall mount. Need a handyman with the right tools and experience.',
    category: 'Handyman Work',
    location: 'Austin, TX',
    budget: 90,
    postedBy: 'user-1',
    postedOn: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    status: 'open',
    images: [],
    isCashOnly: true,
  },
  {
    id: 'job-10',
    title: 'AC unit not cooling',
    description: 'My central AC unit is running but not blowing cold air. Need an HVAC technician to diagnose and repair the issue. Located in Miami.',
    category: 'AC/Heating',
    location: 'Miami, FL',
    budget: 300,
    postedBy: 'user-1',
    postedOn: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'open',
    images: [],
    isCashOnly: false,
  },
  {
    id: 'job-11',
    title: 'Help moving boxes to a storage unit',
    description: 'Need one strong person for 3 hours to help me load boxes into a van and unload them at a storage unit 5 miles away. No heavy furniture.',
    category: 'Movers',
    location: 'Seattle, WA',
    budget: 100,
    postedBy: 'user-1',
    postedOn: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'open',
    images: [],
    isCashOnly: true,
  }
];

export const bids: Bid[] = [
  { id: 'bid-1', jobId: 'job-1', providerId: 'user-2', amount: 120, completionTime: '2-3 hours', submittedOn: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), message: "Hi Sarah, I'm a licensed plumber with 10 years of experience. I can take a look and fix that leak for you. I have all the necessary tools." },
  { id: 'bid-2', jobId: 'job-1', providerId: 'user-3', amount: 140, completionTime: '4 hours', submittedOn: new Date(Date.now() - 22 * 60 * 60 * 1000).toISOString() },
  { id: 'bid-3', jobId: 'job-2', providerId: 'user-4', amount: 55, completionTime: '1 day', submittedOn: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'bid-4', jobId: 'job-3', providerId: 'user-3', amount: 850, completionTime: '3-4 days', submittedOn: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(), message: 'I specialize in hardwood floor refinishing and can make your floors look brand new.' },
];

export let chats: ChatMessage[] = [
    { id: 'chat-1', jobId: 'job-1', providerId: 'user-2', senderId: 'user-2', text: "Hello! I've reviewed your job posting for the leaky sink. I can come by tomorrow morning to take a look. Does that work for you?", timestamp: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString() },
    { id: 'chat-2', jobId: 'job-1', providerId: 'user-2', senderId: 'user-1', text: "Hi Mike, thanks for the quick response! Tomorrow morning works perfectly. What time are you thinking?", timestamp: new Date(Date.now() - 19 * 60 * 60 * 1000).toISOString() },
    { id: 'chat-3', jobId: 'job-1', providerId: 'user-2', senderId: 'user-2', text: "Great. I can be there around 9 AM. I'll bring all the necessary tools to get it fixed right away.", timestamp: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString() },
    { id: 'chat-4', jobId: 'job-1', providerId: 'user-2', senderId: 'user-1', text: "Perfect, see you at 9 AM then. Thanks!", timestamp: new Date(Date.now() - 17 * 60 * 60 * 1000).toISOString() },
    { id: 'chat-5', jobId: 'job-1', providerId: 'user-3', senderId: 'user-3', text: "Is the job still available? I can offer a competitive rate.", timestamp: new Date(Date.now() - 21 * 60 * 60 * 1000).toISOString() },
];


export { notifications };

// In a real app, this would involve authentication. Here, we'll just mock it.
// We can switch the current user by changing the ID here.
// Set to null to simulate a logged-out user
let MOCKED_CURRENT_USER_ID: string | null = null; 

export function login(userId: string | null) {
    MOCKED_CURRENT_USER_ID = userId;
}

export function getCurrentUser(): User | Provider | null {
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
