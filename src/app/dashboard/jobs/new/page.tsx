

'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
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
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { jobCategories, getCurrentUser } from '@/lib/data';
import { Camera, FilePlus2, AlertTriangle, CreditCard, Banknote, X, Image as ImageIcon } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import Image from 'next/image';
import { postJob } from '@/app/actions';
import { Loader2 } from 'lucide-react';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/gif"];

const jobSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters.'),
  description: z.string().min(20, 'Description must be at least 20 characters.'),
  category: z.string({ required_error: 'Please select a category.' }),
  location: z.string().min(2, 'Location is required.'),
  budget: z.coerce.number().positive().optional(),
  isCashOnly: z.boolean().default(false),
  images: z.array(z.any()).optional(),
});

type JobFormValues = z.infer<typeof jobSchema>;

export default function NewJobPage() {
  const { toast } = useToast();
  const router = useRouter();
  const currentUser = getCurrentUser();
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!currentUser) {
      router.push('/login');
    }
  }, [currentUser, router]);

  const hasPaymentMethod = currentUser?.hasPaymentMethod ?? false;

  const form = useForm<JobFormValues>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      title: '',
      description: '',
      location: '',
      isCashOnly: false,
      category: '',
      budget: undefined,
      images: [],
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const currentImages = form.getValues('images') || [];
    
    const newImages = files.filter(file => {
      if (file.size > MAX_FILE_SIZE) {
        toast({ variant: 'destructive', title: 'File too large', description: `${file.name} is larger than 10MB.` });
        return false;
      }
      if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
        toast({ variant: 'destructive', title: 'Invalid file type', description: `${file.name} is not a supported image format.` });
        return false;
      }
      return true;
    });

    const updatedImages = [...currentImages, ...newImages];
    form.setValue('images', updatedImages);
    
    const newPreviews = updatedImages.map(file => URL.createObjectURL(file));
    setImagePreviews(newPreviews);
  };

  const removeImage = (index: number) => {
    const updatedImages = (form.getValues('images') || []).filter((_, i) => i !== index);
    form.setValue('images', updatedImages);

    const newPreviews = updatedImages.map(file => URL.createObjectURL(file));
    setImagePreviews(newPreviews);
  };

  function onSubmit(values: JobFormValues) {
    if (!currentUser) {
        toast({
            variant: 'destructive',
            title: 'Not Logged In',
            description: 'You must be logged in to post a job.',
        });
        return;
    }
    if (!hasPaymentMethod) {
      toast({
        variant: 'destructive',
        title: 'Payment Method Required',
        description: 'Please add a payment method before posting a job.',
      });
      return;
    }
    
    startTransition(async () => {
        try {
            await postJob(values, currentUser.id);
            toast({
                title: 'Job Posted Successfully!',
                description: `Your job "${values.title}" is now live.`,
            });
            form.reset();
            setImagePreviews([]);
        } catch (error) {
             toast({
                variant: 'destructive',
                title: 'Error Posting Job',
                description: 'There was an issue posting your job. Please try again.',
            });
        }
    });
  }

  if (!currentUser) {
    // Render a loading state or null while redirecting
    return null;
  }


  return (
    <>
       <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Post a New Job</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      <div className="max-w-3xl w-full">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-2xl">Post a New Job</CardTitle>
            <CardDescription>Fill out the details below to find the right provider for your job.</CardDescription>
          </CardHeader>
          <CardContent>
            {!hasPaymentMethod && (
              <Alert variant="destructive" className="mb-6">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Payment Method Required</AlertTitle>
                <AlertDescription>
                  You must add a payment method before you can post a job. This ensures that you can securely pay providers once a job is complete.
                  <Button asChild variant="secondary" size="sm" className="mt-2 ml-auto block">
                    <Link href="/dashboard/settings/payment">
                      <CreditCard className="mr-2 h-4 w-4"/>
                      Add Payment Method
                    </Link>
                  </Button>
                </AlertDescription>
              </Alert>
            )}
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <fieldset disabled={!hasPaymentMethod || isPending} className="space-y-6">
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
                          <Input type="number" placeholder="e.g., 150" {...field} value={field.value ?? ''} />
                          </FormControl>
                          <FormDescription>
                              Provide an estimated budget to guide providers.
                          </FormDescription>
                          <FormMessage />
                      </FormItem>
                      )}
                  />

                  <FormField
                    control={form.control}
                    name="isCashOnly"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base flex items-center gap-2">
                             <Banknote className="w-5 h-5"/> Pay with cash
                          </FormLabel>
                          <FormDescription>
                            Select this if you plan to pay the provider in cash. The 10% platform fee will be charged to the provider's saved payment method.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="images"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Photos (Optional)</FormLabel>
                        {imagePreviews.length > 0 && (
                          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4 mb-4">
                            {imagePreviews.map((src, index) => (
                              <div key={index} className="relative group aspect-square">
                                <Image
                                  src={src}
                                  alt={`Preview ${index + 1}`}
                                  fill
                                  className="rounded-md object-cover"
                                />
                                <Button
                                  type="button"
                                  variant="destructive"
                                  size="icon"
                                  className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                  onClick={() => removeImage(index)}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}
                        <FormControl>
                           <div className="flex justify-center rounded-lg border border-dashed border-input px-6 py-10">
                              <div className="text-center">
                              <ImageIcon className="mx-auto h-12 w-12 text-gray-300" />
                              <div className="mt-4 flex text-sm leading-6 text-gray-600">
                                  <label
                                  htmlFor="file-upload"
                                  className="relative cursor-pointer rounded-md bg-white font-semibold text-primary focus-within:outline-none focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 hover:text-primary/80"
                                  >
                                  <span>Upload files</span>
                                  <input 
                                    id="file-upload" 
                                    name="file-upload" 
                                    type="file" 
                                    className="sr-only" 
                                    multiple 
                                    onChange={handleImageChange}
                                    accept="image/png, image/jpeg, image/gif"
                                  />
                                  </label>
                                  <p className="pl-1">or drag and drop</p>
                              </div>
                              <p className="text-xs leading-5 text-gray-600">PNG, JPG, GIF up to 10MB</p>
                              </div>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </fieldset>

                <Button type="submit" className="w-full sm:w-auto" disabled={!hasPaymentMethod || isPending}>
                    {isPending ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Posting...
                        </>
                    ) : (
                        <>
                            <FilePlus2 className="mr-2 h-4 w-4" />
                            Post Job
                        </>
                    )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
