import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  getCurrentUser,
  getJobsForCustomer,
  getOpenJobsForProvider,
  jobCategories,
} from '@/lib/data';
import { JobCard } from '@/components/job-card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ListFilter } from 'lucide-react';
import { FilePlus2 } from 'lucide-react';

export default function DashboardPage() {
  const currentUser = getCurrentUser();
  const isProvider = currentUser.role === 'provider';

  if (isProvider) {
    const jobs = getOpenJobsForProvider(currentUser.id);
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold font-headline">Find Work</h1>
            <p className="text-muted-foreground">
              Browse and bid on jobs available in your area and skillset.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative ml-auto flex-1 md:grow-0">
                <Input
                type="search"
                placeholder="Search by location..."
                className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[320px]"
                />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-9 gap-1">
                  <ListFilter className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Category
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Filter by category</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {jobCategories.map(cat => (
                    <DropdownMenuCheckboxItem key={cat}>{cat}</DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {jobs.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} role="provider" />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <h3 className="text-xl font-semibold">No Open Jobs</h3>
              <p className="text-muted-foreground mt-2">
                There are no jobs matching your skills right now. Check back later!
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  // Customer View
  const jobs = getJobsForCustomer(currentUser.id);
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold font-headline">My Jobs</h1>
          <p className="text-muted-foreground">
            Manage your job postings and view bids.
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/jobs/new">
            <FilePlus2 className="mr-2 h-4 w-4" />
            Post New Job
          </Link>
        </Button>
      </div>

      {jobs.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} role="customer" />
          ))}
        </div>
      ) : (
        <Card className="bg-white/80">
          <CardContent className="py-12 text-center">
            <h3 className="text-xl font-semibold">You haven't posted any jobs yet.</h3>
            <p className="text-muted-foreground mt-2">
              Get started by posting a job and find the right help.
            </p>
            <Button asChild className="mt-4">
              <Link href="/dashboard/jobs/new">Post Your First Job</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
