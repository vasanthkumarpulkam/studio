
'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from '@/components/ui/chart';
import { getAllUsers, getJobsForCustomer, getAllOpenJobs, providers, jobs } from '@/lib/data';
import { BarChart, Users, Briefcase, FileText, LineChart, PieChart } from 'lucide-react';
import { Line, Pie, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Legend, Cell, Bar } from 'recharts';
import { subMonths, format } from 'date-fns';

export default function AdminDashboard() {
  const totalUsers = getAllUsers().length;
  const totalProviders = providers.length;
  const openJobs = getAllOpenJobs().length;

  const jobStatusCounts = jobs.reduce((acc, job) => {
    acc[job.status] = (acc[job.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const jobStatusData = Object.keys(jobStatusCounts).map(status => ({
    name: status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' '),
    value: jobStatusCounts[status],
  }));

  const userSignupData = Array.from({ length: 6 }).map((_, i) => {
    const date = subMonths(new Date(), 5 - i);
    const month = format(date, 'MMM');
    // Mock data for user signups
    const signups = Math.floor(Math.random() * (i + 1) * 2);
    return { month, signups };
  });

  const statusColors = {
    open: 'hsl(var(--chart-1))',
    'pending-confirmation': 'hsl(var(--chart-2))',
    'in-progress': 'hsl(var(--chart-3))',
    working: 'hsl(var(--chart-4))',
    completed: 'hsl(var(--chart-5))',
    disputed: 'hsl(var(--destructive))',
  };


  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
                         <Cell key={`cell-${index}`} fill={statusColors[entry.name.toLowerCase().replace(' ', '-') as keyof typeof statusColors]} />
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
    </div>
  );
}

    