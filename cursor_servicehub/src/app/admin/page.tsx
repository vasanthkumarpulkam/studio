
'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from '@/components/ui/chart';
import { getAllUsers, providers, jobs, bids as allBids } from '@/lib/data';
import { BarChart as BarChartIcon, Users, Briefcase, FileText } from 'lucide-react';
import { LineChart, PieChart, Line, Pie, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Legend, Cell, Bar, BarChart } from 'recharts';
import { subMonths, format } from 'date-fns';
import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

type ChartData = {
  month: string;
  [key: string]: any;
};

type JobStatusData = {
  name: string;
  value: number;
};

export default function AdminDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalProviders, setTotalProviders] = useState(0);
  const [openJobs, setOpenJobs] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [userSignupData, setUserSignupData] = useState<ChartData[]>([]);
  const [revenueData, setRevenueData] = useState<ChartData[]>([]);
  const [jobStatusData, setJobStatusData] = useState<JobStatusData[]>([]);

  useEffect(() => {
    // All data fetching and processing is done on the client side
    // after the initial render to prevent hydration mismatches.
    const allUsers = getAllUsers();
    setTotalUsers(allUsers.length);
    setTotalProviders(providers.length);
    setOpenJobs(jobs.filter(j => j.status === 'open').length);

    const calculatedRevenue = jobs
      .filter(job => job.status === 'completed' && job.acceptedBid)
      .reduce((acc, job) => {
          const bid = job.acceptedBid ? allBids.find(b => b.id === job.acceptedBid) : null;
          if(bid) {
              return acc + (bid.amount * 0.10); // 10% platform fee
          }
          return acc;
      }, 0);
    setTotalRevenue(calculatedRevenue);

    const generatedUserSignupData = Array.from({ length: 6 }).map((_, i) => {
      const date = subMonths(new Date(), 5 - i);
      const month = format(date, 'MMM');
      const signups = Math.floor(Math.random() * (i + 1) * 5 + 10);
      return { month, signups };
    });
    setUserSignupData(generatedUserSignupData);

    const generatedRevenueData = Array.from({ length: 6 }).map((_, i) => {
      const date = subMonths(new Date(), 5 - i);
      const month = format(date, 'MMM');
      const revenue = Math.floor(Math.random() * 500 + 100);
      return { month, revenue };
    });
    setRevenueData(generatedRevenueData);
    
    const jobStatusCounts = jobs.reduce((acc, job) => {
        acc[job.status] = (acc[job.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

    const generatedJobStatusData = Object.keys(jobStatusCounts).map(status => ({
        name: status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' '),
        value: jobStatusCounts[status],
    }));
    setJobStatusData(generatedJobStatusData);
    
    setIsLoading(false);
  }, []); // Empty dependency array ensures this runs only once on the client.

  const statusColors = {
    open: 'hsl(var(--chart-1))',
    'pending-confirmation': 'hsl(var(--chart-2))',
    'in-progress': 'hsl(var(--chart-3))',
    working: 'hsl(var(--chart-4))',
    completed: 'hsl(var(--chart-5))',
    disputed: 'hsl(var(--destructive))',
  };

  if (isLoading) {
    return (
      <div className="flex h-[80vh] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
            <p className="text-xs text-muted-foreground">+2 since last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Providers</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProviders}</div>
            <p className="text-xs text-muted-foreground">+1 since last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Jobs</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{openJobs}</div>
            <p className="text-xs text-muted-foreground">+5 since last week</p>
          </CardContent>
        </Card>
         <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue (Platform Fee)</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">+10% since last month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>User Signup Trends</CardTitle>
            <CardDescription>New users over the last 6 months.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{}} className="h-[250px] w-full">
              <ResponsiveContainer>
                <LineChart data={userSignupData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Line type="monotone" dataKey="signups" stroke="hsl(var(--primary))" name="New Users" />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Job Status Distribution</CardTitle>
            <CardDescription>A breakdown of all jobs by their current status.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{}} className="h-[250px] w-full">
                <ResponsiveContainer>
                <PieChart>
                    <Pie data={jobStatusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                       {jobStatusData.map((entry, index) => (
                         <Cell key={`cell-${index}`} fill={statusColors[entry.name.toLowerCase().replace(' ', '-') as keyof typeof statusColors] || '#8884d8'} />
                       ))}
                    </Pie>
                    <Tooltip content={<ChartTooltipContent />} />
                    <Legend content={<ChartLegendContent />} />
                </PieChart>
                </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
          <CardHeader>
            <CardTitle>Job Revenue</CardTitle>
            <CardDescription>Monthly revenue from platform fees.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{}} className="h-[300px] w-full">
              <ResponsiveContainer>
                <BarChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Bar dataKey="revenue" fill="hsl(var(--primary))" name="Revenue ($)" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
    </div>
  );
}

    