
export type User = {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  role: 'customer' | 'provider';
  hasPaymentMethod: boolean;
  phone?: string;
  bio?: string;
};

export type Provider = User & {
  role: 'provider';
  rating: number;
  reviews: number;
  isVerified: boolean;
  skills: string[];
  location: string;
  website?: string;
};

export type Job = {
  id: string;
  title: string;
  description: string;
  category: string;
  location:string;
  budget?: number;
  postedBy: string; // userId
  postedOn: string; // ISO date string
  status: 'open' | 'pending-confirmation' | 'in-progress' | 'working' | 'completed' | 'disputed';
  images: string[];
  acceptedBid?: string; // bidId
  isCashOnly?: boolean;
  i18n?: {
    [language: string]: {
      title: string;
      description: string;
      location: string;
    };
  };
};

export type Bid = {
  id: string;
  jobId: string;
  providerId: string; // userId
  amount: number;
  submittedOn: string; // ISO date string
  completionTime?: string; // e.g., "2-3 days"
  message?: string;
  i18n?: {
    [language: string]: {
      message: string;
    };
  };
};

export type Notification = {
    id: string;
    userId: string;
    message: string; // Fallback for old notifications
    messageKey: string;
    messageParams?: { [key: string]: string | number };
    link: string;
    isRead: boolean;
    createdAt: string; // ISO date string
}

export type ChatMessage = {
  id: string;
  jobId: string;
  providerId: string;
  senderId: string;
  text: string;
  timestamp: string; // ISO date string
};

    