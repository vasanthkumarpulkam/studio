import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Calendar, CircleDollarSign, Tag, ArrowRight } from 'lucide-react';
import type { Job } from '@/types';
import { format } from 'date-fns';

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
    <Card className="hover:shadow-lg transition-shadow duration-300 bg-card flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-start">
            <CardTitle className="font-bold text-lg">
                <Link href={`/dashboard/jobs/${job.id}`} className="hover:underline">
                    {job.title}
                </Link>
            </CardTitle>
            <Badge className={statusColors[job.status]}>{job.status}</Badge>
        </div>
        <CardDescription className="flex items-center gap-2 pt-1">
            <Tag className="w-3.5 h-3.5" /> 
            <span className="text-sm">{job.category}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow space-y-3">
        <p className="text-sm text-muted-foreground line-clamp-2">{job.description}</p>
        <div className='space-y-2 text-sm'>
            <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="w-4 h-4" /> 
                <span>{job.location}</span>
            </div>
            {job.budget && (
                 <div className="flex items-center gap-2 text-muted-foreground">
                    <CircleDollarSign className="w-4 h-4" />
                    <span>Budget: ${job.budget}</span>
                </div>
            )}
            <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="w-4 h-4" /> 
                <span>Posted {format(new Date(job.postedOn), 'PP')}</span>
            </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <Link href={`/dashboard/jobs/${job.id}`}>
            View Details <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
