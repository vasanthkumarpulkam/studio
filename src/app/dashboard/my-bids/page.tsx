
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getCurrentUser, getBidsForJob, getJob } from '@/lib/data';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { bids as allBids } from '@/lib/data';

export default function MyBidsPage() {
  const currentUser = getCurrentUser();
  const providerBids = allBids.filter(bid => bid.providerId === currentUser.id);

  const getStatusForBid = (jobId: string, bidId: string) => {
    const job = getJob(jobId);
    if (!job) return <Badge variant="destructive">Error</Badge>;

    if (job.status === 'completed' || job.status === 'in-progress') {
      if (job.acceptedBid === bidId) {
        return <Badge className="bg-green-100 text-green-800 border-green-200">Won</Badge>;
      }
      return <Badge variant="secondary">Not Selected</Badge>;
    }
    
    if (job.status === 'open') {
        return <Badge variant="outline">Pending</Badge>
    }

    return <Badge variant="secondary">{job.status}</Badge>;
  };

  return (
    <div>
        <div className="mb-6">
            <h1 className="text-3xl font-bold font-headline">My Bids</h1>
            <p className="text-muted-foreground">
            Track the status of all your submitted bids.
            </p>
        </div>

      <Card>
        <CardContent className="pt-6">
          {providerBids.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Job Title</TableHead>
                  <TableHead className="hidden md:table-cell">Date Submitted</TableHead>
                  <TableHead className="text-right">Your Bid</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {providerBids.map((bid) => {
                  const job = getJob(bid.jobId);
                  if (!job) return null;

                  return (
                    <TableRow key={bid.id}>
                      <TableCell className="font-medium">
                        <Link href={`/dashboard/jobs/${job.id}`} className="hover:text-primary">
                            {job.title}
                        </Link>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">{format(new Date(bid.submittedOn), 'PPP')}</TableCell>
                      <TableCell className="text-right font-semibold">${bid.amount.toFixed(2)}</TableCell>
                      <TableCell className="text-center">{getStatusForBid(job.id, bid.id)}</TableCell>
                      <TableCell className="text-right">
                        <Button asChild variant="outline" size="sm">
                          <Link href={`/dashboard/jobs/${job.id}`}>
                            View Job <ArrowRight className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold">You haven't placed any bids yet.</h3>
              <p className="text-muted-foreground mt-2">
                Find jobs and start bidding to win projects.
              </p>
              <Button asChild className="mt-4">
                <Link href="/dashboard">Find Jobs</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
