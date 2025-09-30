import {
  Card,
  CardContent,
} from '@/components/ui/card';
import {
  getCurrentUser,
  getJobsForCustomer,
  getOpenJobsForProvider,
  jobCategories,
  getAllOpenJobs,
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
import { ListFilter, Search, FilePlus2, Briefcase } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Header } from '@/components/header';


export default function DashboardPage() {
  const currentUser = getCurrentUser();
  
  // Logged-out public view
  if (!currentUser) {
    const availableJobs = getAllOpenJobs();
    return (
      <>
      <Header />
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary">Find Your Next Job</h1>
          <p className="text-muted-foreground">Browse all available jobs on the platform. Sign up to start bidding!</p>
        </div>
         <div className="mt-6">
            {availableJobs.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {availableJobs.map((job) => (
                    <JobCard key={job.id} job={job} role="customer" />
                ))}
                </div>
            ) : (
                <Card>
                <CardContent className="py-12 text-center">
                    <h3 className="text-xl font-semibold">No Jobs Available</h3>
                    <p className="text-muted-foreground mt-2">
                    There are no jobs posted right now. Check back later!
                    </p>
                </CardContent>
                </Card>
            )}
        </div>
         <div className="text-center py-8">
          <h2 className="text-2xl font-bold font-headline mb-2">Ready to Post a Job?</h2>
          <p className="text-muted-foreground mb-4">Sign up as a customer to get help from our talented providers.</p>
          <Button asChild>
            <Link href="/signup">Sign Up Now</Link>
          </Button>
        </div>
      </div>
      </>
    );
  }


  const isProvider = currentUser.role === 'provider';

  // Provider View
  if (isProvider) {
    const jobs = getOpenJobsForProvider(currentUser.id);
    return (
      <>
      <Header />
      <div>
        <div className="mb-6">
            <h1 className="text-3xl font-bold font-headline">Find Work</h1>
            <p className="text-muted-foreground">
              Browse and bid on jobs available in your area and skillset.
            </p>
        </div>

        <Card className="mb-6">
            <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="relative flex-1 w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                        type="search"
                        placeholder="Search by keyword, location..."
                        className="w-full rounded-lg bg-background pl-10"
                        />
                    </div>
                    <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="w-full sm:w-auto">
                        <ListFilter className="mr-2 h-4 w-4" />
                        Category
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="max-h-60 overflow-y-auto">
                        <DropdownMenuLabel>Filter by category</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {jobCategories.map(cat => (
                            <DropdownMenuCheckboxItem key={cat}>{cat}</DropdownMenuCheckboxItem>
                        ))}
                    </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </CardContent>
        </Card>

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
      </>
    );
  }

  // Customer View
  const myJobs = getJobsForCustomer(currentUser.id);
  
  return (
    <>
    <Header />
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-primary">Welcome, {currentUser.name}!</h1>
        <p className="text-muted-foreground">Manage your jobs or post a new one.</p>
      </div>

       <Tabs defaultValue="my-jobs" className="w-full">
        <div className='flex justify-between items-center flex-wrap gap-4'>
            <TabsList>
                <TabsTrigger value="my-jobs"><Briefcase className='mr-2' />My Jobs ({myJobs.length})</TabsTrigger>
            </TabsList>
            <Button asChild>
                <Link href="/dashboard/jobs/new">
                    <FilePlus2 className="mr-2 h-4 w-4" />
                    Post a New Job
                </Link>
            </Button>
        </div>
        <TabsContent value="my-jobs">
            <div className="mt-6">
                 {myJobs.length > 0 ? (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {myJobs.map((job) => (
                        <JobCard key={job.id} job={job} role="customer" />
                    ))}
                    </div>
                ) : (
                    <Card>
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
        </TabsContent>
      </Tabs>
    </div>
    </>
  );
}
