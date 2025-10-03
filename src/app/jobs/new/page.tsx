'use client';

// Redirect wrapper to current implementation under /dashboard/jobs/new
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function JobsNewRedirect() {
  const router = useRouter();
  useEffect(() => { router.replace('/dashboard/jobs/new'); }, [router]);
  return null;
}

