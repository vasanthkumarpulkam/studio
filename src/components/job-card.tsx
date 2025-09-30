import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Calendar, CircleDollarSign } from 'lucide-react';
import type { Job } from '@/types';
import { formatDistanceToNow } from 'date-fns';

type JobCardProps = {
  job: Job;
  role: 'customer' | 'provider';
};

export function JobCard({ job, role }: JobCardProps) {
  const statusColors = {
    open: 'bg-green-100 text-green-800 border-green-200',
    'in-progress': 'bg-blue-100 text-blue-800 border-blue-200',
    working: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    completed: 'bg-gray-100 text-gray-800 border-gray-200',
    disputed: 'bg-red-100 text-red-800 border-red-200',
  };

  return (
    <Card className="hover:shadow-md transition-shadow duration-300 bg-white">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <Badge variant="outline" className="mb-2">{job.category}</Badge>
            <CardTitle className="font-headline text-lg">
              <Link href={`/dashboard/jobs/${job.id}`} className="hover:text-primary transition-colors">
                {job.title}
              </Link>
            </CardTitle>
          </div>
          <Badge className={statusColors[job.status]}>{job.status}</Badge>
        </div>
        <CardDescription className="flex items-center gap-4 pt-2">
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <MapPin className="w-3 h-3" /> {job.location}
          </span>
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Calendar className="w-3 h-3" /> Posted {formatDistanceToNow(new Date(job.postedOn), { addSuffix: true })}
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-foreground/80 line-clamp-2">{job.description}</p>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        {job.budget ? (
          <div className="flex items-center gap-2 text-sm font-semibold text-primary">
            <CircleDollarSign className="w-4 h-4" />
            <span>Budget: ${job.budget}</span>
          </div>
        ) : <div />}
        <Button asChild variant="secondary" size="sm">
          <Link href={`/dashboard/jobs/${job.id}`}>
            {role === 'customer' ? 'View Bids' : 'View & Bid'}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
