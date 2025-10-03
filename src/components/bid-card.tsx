'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Check, Clock, ShieldCheck, Star } from 'lucide-react';
import type { Bid, Provider } from '@/types';
import { useTranslation } from '@/hooks/use-translation';
import AcceptBidButton from './accept-bid-button';

type BidCardProps = {
  bid: Bid;
  provider: Provider;
  jobId: string;
  canAccept: boolean;
};

export default function BidCard({ bid, provider, jobId, canAccept }: BidCardProps) {
  const { t } = useTranslation();
  return (
    <div className="p-4 border rounded-lg">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={provider.avatarUrl} alt={provider.name} />
            <AvatarFallback>{provider.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold">{provider.name}</p>
            <div className="flex items-center flex-wrap gap-x-2 gap-y-1 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                {provider.rating} ({provider.reviews} {t('job_details_reviews')})
              </span>
              {provider.isVerified && <ShieldCheck className="w-3 h-3 text-primary" />}
              {bid.completionTime && (
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {bid.completionTime}
                </span>
              )}
            </div>
          </div>
        </div>
        <p className="text-lg font-bold text-primary">${bid.amount}</p>
      </div>
      {bid.message && <p className="text-sm text-muted-foreground mt-2 pl-11">{bid.message}</p>}
      <div className="flex justify-end mt-3 gap-2">
        <AcceptBidButton jobId={jobId} bidId={bid.id} disabled={!canAccept}/>
      </div>
    </div>
  );
}

