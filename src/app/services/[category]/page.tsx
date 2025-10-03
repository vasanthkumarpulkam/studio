'use client';

import { useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { JobCard } from '@/components/job-card';
import { useCollection, useMemoFirebase } from '@/firebase';
import { db } from '@/firebase/config';
import { collection, query, where } from 'firebase/firestore';
import type { Job } from '@/types';

export default function CategoryPage({ params }: { params: { category: string } }) {
  const decoded = decodeURIComponent(params.category).replace(/-/g, ' ');
  const title = decoded.replace(/\b\w/g, (l) => l.toUpperCase());

  const jobsQuery = useMemoFirebase(
    () => query(collection(db, 'job_posts'), where('status', '==', 'open'), where('category', '==', title)),
    [title]
  );
  const { data: jobs } = useCollection<Job>(jobsQuery);

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">{title}</h1>
      <Card>
        <CardHeader>
          <CardTitle>Open jobs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {(jobs || []).map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
            {(!jobs || jobs.length === 0) && <div>No open jobs yet.</div>}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

