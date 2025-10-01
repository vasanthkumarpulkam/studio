

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
  getProvider,
} from '@/lib/data';
import { JobCard } from '@/components/job-card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ListFilter, Search, FilePlus2, Briefcase, MapPin, SlidersHorizontal, Loader2, LayoutList, Map } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Job, Provider, User } from '@/types';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { useTranslation } from '@/hooks/use-translation';
import MapView from '@/components/map-view';


export default function DashboardPage() {
  const [currentUser, setCurrentUser] = useState<User | Provider | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('newest');
  const [radius, setRadius] = useState([50]);
  const [isLoading, setIsLoading] = useState(true);
  const { t, isTranslationReady } = useTranslation();
  
  const allJobs = useMemo(() => getAllOpenJobs(), []);
  const [providerJobs, setProviderJobs] = useState<Job[]>([]);
  const [customerJobs, setCustomerJobs] = useState<Job[]>([]);

  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const providerProfile = useMemo(() => currentUser?.role === 'provider' ? getProvider(currentUser.id) : null, [currentUser]);
  const providerSkills = useMemo(() => providerProfile?.skills || [], [providerProfile]);

  useEffect(() => {
    const user = getCurrentUser();
    setCurrentUser(user);
    setIsLoading(false);

    if (user) {
        if (user.role === 'provider') {
            const provider = getProvider(user.id);
            if (provider) {
                setProviderJobs(getOpenJobsForProvider(provider.id));
                setSelectedCategories(provider.skills); // Pre-select provider's skills
            }
        }
        setCustomerJobs(getJobsForCustomer(user.id));
    }
  }, []);

  useEffect(() => {
    // Only run filter if not loading
    if (isLoading) return;

    const jobsToFilter = !currentUser || currentUser?.role === 'customer' ? allJobs : providerJobs;
    
    let results = jobsToFilter.filter(job => {
      const searchTermMatch = searchTerm.toLowerCase() 
        ? job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
          job.description.toLowerCase().includes(searchTerm.toLowerCase())
        : true;

      const locationMatch = location.toLowerCase() 
        ? (job.location || '').toLowerCase().includes(location.toLowerCase())
        : true;
      
      const categoryMatch = selectedCategories.length > 0
        ? selectedCategories.includes(job.category)
        : true;

      return searchTermMatch && locationMatch && categoryMatch;
    });

    // Sorting logic
    results.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.postedOn).getTime() - new Date(a.postedOn).getTime();
        case 'oldest':
          return new Date(a.postedOn).getTime() - new Date(b.postedOn).getTime();
        case 'budget-asc':
          return (a.budget || Infinity) - (b.budget || Infinity);
        case 'budget-desc':
          return (b.budget || 0) - (a.budget || 0);
        default:
          return 0;
      }
    });

    setFilteredJobs(results);

  }, [searchTerm, location, selectedCategories, allJobs, providerJobs, sortBy, radius, currentUser, isLoading]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };
  
  const clearFilters = () => {
    setSearchTerm('');
    setLocation('');
    setSelectedCategories([]);
    setRadius([50]);
  }

  const handleSelectAllCategories = () => {
    const categoriesToSelect = currentUser?.role === 'provider' ? providerSkills : jobCategories;
    setSelectedCategories(categoriesToSelect);
  }

  const handleClearCategories = () => {
    setSelectedCategories([]);
  }

  const activeFilterCount = (searchTerm ? 1 : 0) + (location ? 1 : 0) + selectedCategories.length;
  
  const categoriesForFilter = currentUser?.role === 'provider' ? providerSkills : jobCategories;

  if (isLoading || !isTranslationReady) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Logged-out public view
  if (!currentUser) {
    return (
      <>
        <div className="grid lg:grid-cols-[320px_1fr] gap-8">
          <aside className="hidden lg:block">
             <Card>
              <CardContent className="p-4">
                  <div className="flex flex-col gap-4">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-semibold flex items-center gap-2"><SlidersHorizontal className="w-4 h-4"/>{t('dashboard_filters_title')} ({activeFilterCount})</h3>
                        <Button variant="ghost" size="sm" onClick={clearFilters} disabled={activeFilterCount === 0}>{t('dashboard_filters_clear_all')}</Button>
                      </div>
                      <div className="relative flex-1 w-full">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                          type="search"
                          placeholder={t('dashboard_filters_search_placeholder')}
                          className="w-full rounded-lg bg-background pl-10"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          />
                      </div>
                      <div className="relative flex-1 w-full">
                          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                          type="search"
                          placeholder={t('dashboard_filters_location_placeholder')}
                          className="w-full rounded-lg bg-background pl-10"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          />
                      </div>
                       <div className="space-y-2">
                          <Label>{t('dashboard_filters_radius_label')}</Label>
                          <Slider
                              value={radius}
                              onValueChange={setRadius}
                              max={250}
                              step={1}
                          />
                          <div className="flex justify-between text-xs text-muted-foreground">
                              <span>1 {t('dashboard_filters_radius_mile')}</span>
                              <span>{radius[0]} {t('dashboard_filters_radius_miles')}</span>
                              <span>250 {t('dashboard_filters_radius_miles')}</span>
                          </div>
                      </div>
                      <Separator/>
                      <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                          <Button variant="outline" className="w-full justify-between">
                            <span>{t('dashboard_filters_category_label')} ({selectedCategories.length})</span>
                            <ListFilter className="h-4 w-4" />
                          </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-[280px] max-h-80 overflow-y-auto">
                          <DropdownMenuLabel>{t('dashboard_filters_category_filter_label')}</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                           <div className="flex justify-between px-2 py-1.5">
                              <Button variant="link" size="sm" className="p-0 h-auto" onClick={handleSelectAllCategories}>{t('dashboard_filters_select_all')}</Button>
                              <Button variant="link" size="sm" className="p-0 h-auto" onClick={handleClearCategories} disabled={selectedCategories.length === 0}>{t('dashboard_filters_clear')}</Button>
                          </div>
                           <DropdownMenuSeparator />
                          {categoriesForFilter.map(cat => (
                              <DropdownMenuCheckboxItem 
                                key={cat}
                                checked={selectedCategories.includes(cat)}
                                onCheckedChange={() => handleCategoryChange(cat)}
                              >
                                {t(`category_${cat.replace(/\s/g, '_').toLowerCase()}`)}
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
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-3xl font-bold tracking-tight text-primary">{t('dashboard_public_title')}</h1>
                  <p className="text-muted-foreground">{t('dashboard_public_subtitle')}</p>
                </div>
                <Select onValueChange={setSortBy} defaultValue={sortBy}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder={t('dashboard_sort_by_placeholder')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">{t('dashboard_sort_newest')}</SelectItem>
                    <SelectItem value="oldest">{t('dashboard_sort_oldest')}</SelectItem>
                    <SelectItem value="budget-asc">{t('dashboard_sort_budget_asc')}</SelectItem>
                    <SelectItem value="budget-desc">{t('dashboard_sort_budget_desc')}</SelectItem>
                  </SelectContent>
                </Select>
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
                          <h3 className="text-xl font-semibold">{t('dashboard_no_jobs_title')}</h3>
                          <p className="text-muted-foreground mt-2">
                          {t('dashboard_no_jobs_subtitle')}
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
      <div className="grid lg:grid-cols-[320px_1fr] gap-8 h-full">
        <aside className="hidden lg:block">
          <Card>
            <CardContent className="p-4">
                <div className="flex flex-col gap-4">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-semibold flex items-center gap-2"><SlidersHorizontal className="w-4 h-4"/>{t('dashboard_filters_title')} ({activeFilterCount})</h3>
                      <Button variant="ghost" size="sm" onClick={clearFilters} disabled={activeFilterCount === 0}>{t('dashboard_filters_clear_all')}</Button>
                    </div>
                    <div className="relative flex-1 w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                        type="search"
                        placeholder={t('dashboard_filters_search_placeholder')}
                        className="w-full rounded-lg bg-background pl-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                      <div className="relative flex-1 w-full">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                        type="search"
                        placeholder={t('dashboard_filters_location_placeholder')}
                        className="w-full rounded-lg bg-background pl-10"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        />
                    </div>
                      <div className="space-y-2">
                        <Label>{t('dashboard_filters_radius_label')}</Label>
                        <Slider
                            value={radius}
                            onValueChange={setRadius}
                            max={250}
                            step={1}
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                              <span>1 {t('dashboard_filters_radius_mile')}</span>
                            <span>{radius[0]} {t('dashboard_filters_radius_miles')}</span>
                            <span>250 {t('dashboard_filters_radius_miles')}</span>
                        </div>
                    </div>
                    <Separator/>
                    <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="w-full justify-between">
                          <span>{t('dashboard_filters_category_label')} ({selectedCategories.length})</span>
                          <ListFilter className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[280px] max-h-80 overflow-y-auto">
                        <DropdownMenuLabel>{t('dashboard_provider_filter_by_skills')}</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                          <div className="flex justify-between px-2 py-1.5">
                            <Button variant="link" size="sm" className="p-0 h-auto" onClick={handleSelectAllCategories}>{t('dashboard_filters_select_all')}</Button>
                            <Button variant="link" size="sm" className="p-0 h-auto" onClick={handleClearCategories} disabled={selectedCategories.length === 0}>{t('dashboard_filters_clear')}</Button>
                        </div>
                          <DropdownMenuSeparator />
                        {categoriesForFilter.map(cat => (
                            <DropdownMenuCheckboxItem 
                              key={cat}
                              checked={selectedCategories.includes(cat)}
                              onCheckedChange={() => handleCategoryChange(cat)}
                            >
                              {t(`category_${cat.replace(/\s/g, '_').toLowerCase()}`)}
                            </DropdownMenuCheckboxItem>
                        ))}
                    </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </CardContent>
          </Card>
        </aside>
          <main className="flex flex-col">
            <Tabs defaultValue="list-view" className="flex flex-col flex-grow">
              <div className="flex justify-between items-center mb-6">
                  <div>
                    <h1 className="text-3xl font-bold font-headline">{t('dashboard_provider_title')}</h1>
                    <p className="text-muted-foreground">
                      {t('dashboard_provider_subtitle')}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <Select onValueChange={setSortBy} defaultValue={sortBy}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder={t('dashboard_sort_by_placeholder')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="newest">{t('dashboard_sort_newest')}</SelectItem>
                        <SelectItem value="oldest">{t('dashboard_sort_oldest')}</SelectItem>
                        <SelectItem value="budget-asc">{t('dashboard_sort_budget_asc')}</SelectItem>
                        <SelectItem value="budget-desc">{t('dashboard_sort_budget_desc')}</SelectItem>
                      </SelectContent>
                    </Select>
                    <TabsList>
                        <TabsTrigger value="list-view"><LayoutList className="mr-2" />List View</TabsTrigger>
                        <TabsTrigger value="map-view"><Map className="mr-2" />Map View</TabsTrigger>
                    </TabsList>
                  </div>
              </div>

              <TabsContent value="list-view" className="flex-grow">
                {filteredJobs.length > 0 ? (
                  <div className="space-y-6">
                    {filteredJobs.map((job) => (
                      <JobCard key={job.id} job={job} role="provider" />
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="py-12 text-center">
                      <h3 className="text-xl font-semibold">{t('dashboard_provider_no_jobs_title')}</h3>
                      <p className="text-muted-foreground mt-2">
                        {t('dashboard_no_jobs_subtitle')}
                      </p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
              <TabsContent value="map-view" className="flex-grow rounded-lg overflow-hidden">
                  <MapView jobs={filteredJobs} location={location} radius={radius[0]} />
              </TabsContent>
            </Tabs>
          </main>
      </div>
    );
  }

  // Customer View
  const myJobs = customerJobs;
  
  return (
    <>
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-primary">{t('dashboard_customer_welcome')}, {currentUser.name}!</h1>
        <p className="text-muted-foreground">{t('dashboard_customer_subtitle')}</p>
      </div>

       <Tabs defaultValue="my-jobs" className="w-full">
        <div className='flex justify-between items-center flex-wrap gap-4'>
            <TabsList>
                <TabsTrigger value="my-jobs"><Briefcase className='mr-2' />{t('dashboard_customer_my_jobs_tab')} ({myJobs.length})</TabsTrigger>
            </TabsList>
            <Button asChild>
                <Link href="/dashboard/jobs/new">
                    <FilePlus2 className="mr-2 h-4 w-4" />
                    {t('dashboard_customer_post_job_button')}
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
                        <h3 className="text-xl font-semibold">{t('dashboard_customer_no_jobs_title')}</h3>
                        <p className="text-muted-foreground mt-2">
                        {t('dashboard_customer_no_jobs_subtitle')}
                        </p>
                        <Button asChild className="mt-4">
                        <Link href="/dashboard/jobs/new">{t('dashboard_customer_post_first_job_button')}</Link>
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

    
