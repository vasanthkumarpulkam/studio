'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { jobCategories } from '@/lib/data';
import { Camera, FilePlus2 } from 'lucide-react';

const jobSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters.'),
  description: z.string().min(20, 'Description must be at least 20 characters.'),
  category: z.string({ required_error: 'Please select a category.' }),
  location: z.string().min(2, 'Location is required.'),
  budget: z.coerce.number().positive().optional(),
});

type JobFormValues = z.infer<typeof jobSchema>;

export default function NewJobPage() {
  const { toast } = useToast();
  const form = useForm<JobFormValues>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      title: '',
      description: '',
      location: '',
    },
  });

  function onSubmit(values: JobFormValues) {
    console.log(values);
    toast({
      title: 'Job Posted Successfully!',
      description: `Your job "${values.title}" is now live.`,
    });
    form.reset();
  }

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="max-w-3xl mx-auto w-full">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-2xl">Post a New Job</CardTitle>
            <CardDescription>Fill out the details below to find the right provider for your job.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Job Title</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Fix leaky kitchen sink" {...field} />
                      </FormControl>
                      <FormDescription>
                        Give your job a short, clear title.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Job Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe the job in detail. What needs to be done? What's the current situation?"
                          className="min-h-[120px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a job category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {jobCategories.map((cat) => (
                                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., San Francisco, CA" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                    control={form.control}
                    name="budget"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Budget (Optional)</FormLabel>
                        <FormControl>
                        <Input type="number" placeholder="e.g., 150" {...field} />
                        </FormControl>
                        <FormDescription>
                            Provide an estimated budget to guide providers.
                        </FormDescription>
                        <FormMessage />
                    </FormItem>
                    )}
                />

                <div>
                    <FormLabel>Photos (Optional)</FormLabel>
                    <div className="mt-2 flex justify-center rounded-lg border border-dashed border-input px-6 py-10">
                        <div className="text-center">
                        <Camera className="mx-auto h-12 w-12 text-gray-300" />
                        <div className="mt-4 flex text-sm leading-6 text-gray-600">
                            <label
                            htmlFor="file-upload"
                            className="relative cursor-pointer rounded-md bg-white font-semibold text-primary focus-within:outline-none focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 hover:text-primary/80"
                            >
                            <span>Upload files</span>
                            <input id="file-upload" name="file-upload" type="file" className="sr-only" multiple />
                            </label>
                            <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs leading-5 text-gray-600">PNG, JPG, GIF up to 10MB</p>
                        </div>
                    </div>
                </div>


                <Button type="submit" className="w-full sm:w-auto">
                    <FilePlus2 className="mr-2 h-4 w-4" />
                    Post Job
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
