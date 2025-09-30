
'use client';

import { useState, useEffect, useMemo } from 'react';
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
import { ListFilter, Search, FilePlus2, Briefcase, MapPin } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Header } from '@/components/header';
import type { Job } from '@/types';


export default function DashboardPage() {
  const currentUser = getCurrentUser();
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  
  const allJobs = useMemo(() => getAllOpenJobs(), []);
  const providerJobs = useMemo(() => currentUser ? getOpenJobsForProvider(currentUser.id) : [], [currentUser]);
  const customerJobs = useMemo(() => currentUser ? getJobsForCustomer(currentUser.id) : [], [currentUser]);

  const [filteredJobs, setFilteredJobs] = useState<Job[]>(allJobs);

  useEffect(() => {
    const jobsToFilter = currentUser?.role === 'provider' ? providerJobs : allJobs;
    
    const results = jobsToFilter.filter(job => {
      const searchTermMatch = searchTerm.toLowerCase() 
        ? job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
          job.description.toLowerCase().includes(searchTerm.toLowerCase())
        : true;

      const locationMatch = location.toLowerCase() 
        ? job.location.toLowerCase().includes(location.toLowerCase())
        : true;
      
      const categoryMatch = selectedCategories.length > 0
        ? selectedCategories.includes(job.category)
        : true;

      return searchTermMatch && locationMatch && categoryMatch;
    });

    setFilteredJobs(results);

  }, [searchTerm, location, selectedCategories, allJobs, providerJobs, currentUser]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };
  
  // Logged-out public view
  if (!currentUser) {
    return (
      <>
        <Header />
        <div className="grid lg:grid-cols-[280px_1fr] gap-8 p-4 md:p-6">
          <aside className="hidden lg:block">
             <Card>
              <CardContent className="p-4">
                  <div className="flex flex-col gap-4">
                      <div className="relative flex-1 w-full">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                          type="search"
                          placeholder="Search by keyword..."
                          className="w-full rounded-lg bg-background pl-10"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          />
                      </div>
                      <div className="relative flex-1 w-full">
                          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                          type="search"
                          placeholder="Location"
                          className="w-full rounded-lg bg-background pl-10"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          />
                      </div>
                      <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                          <Button variant="outline" className="w-full justify-between">
                            <span>Category ({selectedCategories.length})</span>
                            <ListFilter className="h-4 w-4" />
                          </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-[240px] max-h-60 overflow-y-auto">
                          <DropdownMenuLabel>Filter by category</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          {jobCategories.map(cat => (
                              <DropdownMenuCheckboxItem 
                                key={cat}
                                checked={selectedCategories.includes(cat)}
                                onCheckedChange={() => handleCategoryChange(cat)}
                              >
                                {cat}
                              </DropdownMenuCheckboxItem>
                          ))}
                      </DropdownMenuContent>
                      </DropdownMenu>
                  </div>
              </CardContent>
            </Card>
          </aside>
          <main>
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-primary">Find Your Next Job</h1>
                <p className="text-muted-foreground">Browse all available jobs on the platform. Sign up to start bidding!</p>
              </div>
              <div className="mt-6">
                  {filteredJobs.length > 0 ? (
                      <div className="space-y-6">
                      {filteredJobs.map((job) => (
                          <JobCard key={job.id} job={job} role="customer" />
                      ))}
                      </div>
                  ) : (
                      <Card>
                      <CardContent className="py-12 text-center">
                          <h3 className="text-xl font-semibold">No Jobs Available</h3>
                          <p className="text-muted-foreground mt-2">
                          There are no jobs matching your criteria. Try adjusting your filters.
                          </p>
                      </CardContent>
                      </Card>
                  )}
              </div>
            </div>
          </main>
        </div>
      </>
    );
  }


  const isProvider = currentUser.role === 'provider';

  // Provider View
  if (isProvider) {
    return (
      <>
        <Header />
        <div className="grid lg:grid-cols-[280px_1fr] gap-8 p-4 md:p-6">
          <aside className="hidden lg:block">
            <Card>
              <CardContent className="p-4">
                  <div className="flex flex-col gap-4">
                      <div className="relative flex-1 w-full">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                          type="search"
                          placeholder="Search by keyword..."
                          className="w-full rounded-lg bg-background pl-10"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          />
                      </div>
                       <div className="relative flex-1 w-full">
                          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                          type="search"
                          placeholder="Location"
                          className="w-full rounded-lg bg-background pl-10"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          />
                      </div>
                      <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                          <Button variant="outline" className="w-full justify-between">
                            <span>Category ({selectedCategories.length})</span>
                            <ListFilter className="h-4 w-4" />
                          </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-[240px] max-h-60 overflow-y-auto">
                          <DropdownMenuLabel>Filter by your skills</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          {getProvider(currentUser.id)?.skills.map(cat => (
                              <DropdownMenuCheckboxItem 
                                key={cat}
                                checked={selectedCategories.includes(cat)}
                                onCheckedChange={() => handleCategoryChange(cat)}
                              >
                                {cat}
                              </DropdownMenuCheckboxItem>
                          ))}
                      </DropdownMenuContent>
                      </DropdownMenu>
                  </div>
              </CardContent>
            </Card>
          </aside>
           <main>
            <div className="mb-6">
                <h1 className="text-3xl font-bold font-headline">Find Work</h1>
                <p className="text-muted-foreground">
                  Browse and bid on jobs available in your area and skillset.
                </p>
            </div>

            {filteredJobs.length > 0 ? (
              <div className="space-y-6">
                {filteredJobs.map((job) => (
                  <JobCard key={job.id} job={job} role="provider" />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <h3 className="text-xl font-semibold">No Open Jobs</h3>
                  <p className="text-muted-foreground mt-2">
                    There are no jobs matching your criteria. Try adjusting your filters.
                  </p>
                </CardContent>
              </Card>
            )}
          </main>
        </div>
      </>
    );
  }

  // Customer View
  const myJobs = customerJobs;
  
  return (
    <>
    <Header />
    <div className="space-y-6 p-4 md:p-6">
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
                        <JobCard key={job.id} job={job} role="customer" isGrid />
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

    