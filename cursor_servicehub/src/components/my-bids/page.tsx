
'use client';

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
import { collectionGroup, getDocs, query, where, doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebase/config';
import { ArrowRight, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useEffect, useMemo, useState } from 'react';
import type { User, Provider, Job, Bid } from '@/types';
import { useTranslation } from '@/hooks/use-translation';
import { useUser } from '@/firebase';

export default function MyBidsPage() {
  const { user: currentUser, isUserLoading } = useUser();
  const { t, isTranslationReady, language } = useTranslation();

  const [bids, setBids] = useState<Bid[]>([]);
  const [jobsById, setJobsById] = useState<Record<string, Job>>({});

  useEffect(() => {
    async function loadBidsAndJobs() {
      if (!currentUser || currentUser.role !== 'provider') return;
      const bidsQ = query(collectionGroup(db, 'bids'), where('providerId', '==', currentUser.id));
      const bidsSnap = await getDocs(bidsQ);
      const fetchedBids: Bid[] = bidsSnap.docs.map(d => ({ id: d.id, ...(d.data() as Omit<Bid, 'id'>) }));
      setBids(fetchedBids);
      const uniqueJobIds = Array.from(new Set(fetchedBids.map(b => b.jobId)));
      const jobEntries = await Promise.all(uniqueJobIds.map(async (jobId) => {
        const jobSnap = await getDoc(doc(db, 'job_posts', jobId));
        if (jobSnap.exists()) {
          return [jobId, { id: jobSnap.id, ...(jobSnap.data() as Omit<Job, 'id'>) } as Job] as const;
        }
        return null;
      }));
      const jobsMap: Record<string, Job> = {};
      for (const entry of jobEntries) {
        if (entry) jobsMap[entry[0]] = entry[1];
      }
      setJobsById(jobsMap);
    }
    loadBidsAndJobs();
  }, [currentUser]);
  
  if (isUserLoading || !isTranslationReady || !currentUser) {
    return <div className="flex justify-center items-center h-full"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  const providerBids = useMemo(() => bids.filter(bid => bid.providerId === currentUser.id), [bids, currentUser.id]);

  const getStatusForBid = (jobId: string, bidId: string) => {
    const job = jobsById[jobId];
    if (!job) return <Badge variant="destructive">Error</Badge>;

    if (job.status === 'completed' || job.status === 'in-progress' || job.status === 'working' || job.status === 'pending-confirmation') {
      if (job.acceptedBid === bidId) {
        return <Badge className="bg-green-100 text-green-800 border-green-200">{t('my_bids_status_won')}</Badge>;
      }
      return <Badge variant="secondary">{t('my_bids_status_not_selected')}</Badge>;
    }
    
    if (job.status === 'open') {
        return <Badge variant="outline">{t('my_bids_status_pending')}</Badge>
    }

    return <Badge variant="secondary">{job.status}</Badge>;
  };

  return (
    <div>
        <div className="mb-6">
            <h1 className="text-3xl font-bold font-headline">{t('my_bids_title')}</h1>
            <p className="text-muted-foreground">
            {t('my_bids_subtitle')}
            </p>
        </div>

      <Card>
        <CardContent className="pt-6">
          {providerBids.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('my_bids_table_job_title')}</TableHead>
                  <TableHead className="hidden md:table-cell">{t('my_bids_table_date')}</TableHead>
                  <TableHead className="text-right">{t('my_bids_table_your_bid')}</TableHead>
                  <TableHead className="text-center">{t('my_bids_table_status')}</TableHead>
                  <TableHead className="text-right">{t('my_bids_table_actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {providerBids.map((bid) => {
                  const job = jobsById[bid.jobId];
                  if (!job) return null;

                  return (
                    <TableRow key={bid.id}>
                      <TableCell className="font-medium">
                        <Link href={`/dashboard/jobs/${job.id}`} className="hover:text-primary">
                            {job.title}
                        </Link>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">{format(new Date(bid.submittedOn), 'PPP', { locale: language === 'es' ? es : undefined })}</TableCell>
                      <TableCell className="text-right font-semibold">${bid.amount.toFixed(2)}</TableCell>
                      <TableCell className="text-center">{getStatusForBid(job.id, bid.id)}</TableCell>
                      <TableCell className="text-right">
                        <Button asChild variant="outline" size="sm">
                          <Link href={`/dashboard/jobs/${job.id}`}>
                            {t('my_bids_view_job_button')} <ArrowRight className="ml-2 h-4 w-4" />
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
              <h3 className="text-xl font-semibold">{t('my_bids_no_bids_title')}</h3>
              <p className="text-muted-foreground mt-2">
                {t('my_bids_no_bids_subtitle')}
              </p>
              <Button asChild className="mt-4">
                <Link href="/dashboard">{t('my_bids_find_jobs_button')}</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
