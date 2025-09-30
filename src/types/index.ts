export type User = {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  role: 'customer' | 'provider';
};

export type Provider = User & {
  role: 'provider';
  rating: number;
  reviews: number;
  isVerified: boolean;
  skills: string[];
  location: string;
};

export type Job = {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  budget?: number;
  postedBy: string; // userId
  postedOn: string; // ISO date string
  status: 'open' | 'in-progress' | 'completed' | 'disputed';
  images: string[];
  acceptedBid?: string; // bidId
};

export type Bid = {
  id: string;
  jobId: string;
  providerId: string; // userId
  amount: number;
  submittedOn: string; // ISO date string
  message?: string;
};
