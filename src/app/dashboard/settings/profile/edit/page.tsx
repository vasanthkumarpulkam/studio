
'use client';

import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import Image from 'next/image';
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
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { jobCategories, getCurrentUser } from '@/lib/data';
import { ArrowLeft, Save, Trash2, PlusCircle, Loader2, User, Briefcase, Globe, Camera, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { updateUserProfile } from '@/app/actions';
import type { User as UserType, Provider } from '@/types';
import { useTranslation } from '@/hooks/use-translation';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';


const MAX_AVATAR_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/gif"];


const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  email: z.string().email('Invalid email address.'),
  phone: z.string().optional(),
  bio: z.string().optional(),
  avatar: z.any().optional(),
  // Provider specific
  skills: z.array(z.string()).optional(),
  location: z.string().optional(),
  website: z.string().url('Invalid URL.').optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function EditProfilePage() {
  const { toast } = useToast();
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<UserType | Provider | null>(null);
  const [isPending, startTransition] = useTransition();
  const { t, isTranslationReady } = useTranslation();
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);


  useEffect(() => {
    const user = getCurrentUser();
    if (!user) {
      router.push('/login');
    }
    setCurrentUser(user);
    if(user?.avatarUrl) {
      setAvatarPreview(user.avatarUrl);
    }
  }, [router]);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: currentUser?.name || '',
      email: currentUser?.email || '',
      phone: currentUser?.phone || '',
      bio: currentUser?.bio || '',
      avatar: undefined,
      skills: (currentUser as Provider)?.skills || [],
      location: (currentUser as Provider)?.location || '',
      website: (currentUser as Provider)?.website || '',
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'skills',
  });

  useEffect(() => {
    if (currentUser) {
      form.reset({
        name: currentUser.name || '',
        email: currentUser.email || '',
        phone: currentUser.phone || '',
        bio: currentUser.bio || '',
        avatar: undefined,
        skills: (currentUser as Provider).skills || [],
        location: (currentUser as Provider).location || '',
        website: (currentUser as Provider).website || '',
      });
      if(currentUser.avatarUrl) {
        setAvatarPreview(currentUser.avatarUrl);
      }
    }
  }, [currentUser, form]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_AVATAR_SIZE) {
      toast({ variant: 'destructive', title: 'File too large', description: `Avatar image must be less than 5MB.` });
      return;
    }
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      toast({ variant: 'destructive', title: 'Invalid file type', description: `Please select a valid image format (JPEG, PNG, GIF).` });
      return;
    }

    form.setValue('avatar', file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleRemoveAvatar = () => {
    form.setValue('avatar', null); // Use null to signify removal
    setAvatarPreview(null);
  }


  function onSubmit(values: ProfileFormValues) {
    if (!currentUser) return;
    
    startTransition(async () => {
        try {
            await updateUserProfile(currentUser.id, values);
            toast({
                title: t('profile_edit_success_title'),
                description: t('profile_edit_success_desc'),
            });
        } catch (error) {
             toast({
                variant: 'destructive',
                title: t('profile_edit_error_title'),
                description: t('profile_edit_error_desc'),
            });
        }
    });
  }

  if (!currentUser || !isTranslationReady) {
    return <div className="flex justify-center items-center h-full"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }
  
  const isProvider = currentUser.role === 'provider';

  return (
    <>
       <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard">{t('breadcrumb_dashboard')}</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
             <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard/settings">{t('breadcrumb_settings')}</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard/settings/profile">{t('settings_nav_profile')}</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{t('profile_edit_breadcrumb')}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      <div className="max-w-3xl w-full">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-2xl">{t('profile_edit_title')}</CardTitle>
            <CardDescription>{t('profile_edit_subtitle')}</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="space-y-6">
                    <h3 className="font-semibold text-lg flex items-center gap-2"><User className="w-5 h-5" />{t('profile_edit_basic_info_title')}</h3>
                     
                     <FormField
                        control={form.control}
                        name="avatar"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('profile_edit_avatar_label')}</FormLabel>
                            <div className="flex items-center gap-4">
                              <Avatar className="w-24 h-24 border">
                                <AvatarImage src={avatarPreview || ''} alt="Avatar preview" />
                                <AvatarFallback className="text-3xl">
                                  {currentUser.name.split(' ').map((n) => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex flex-col gap-2">
                                <FormControl>
                                  <Button asChild variant="outline">
                                    <label htmlFor="avatar-upload">
                                      <Camera className="mr-2 h-4 w-4" />
                                      {t('profile_edit_avatar_button')}
                                      <input 
                                        id="avatar-upload" 
                                        type="file" 
                                        className="sr-only" 
                                        onChange={handleAvatarChange}
                                        accept="image/png, image/jpeg, image/gif"
                                      />
                                    </label>
                                  </Button>
                                </FormControl>
                                {avatarPreview && (
                                  <Button type="button" variant="ghost" size="sm" onClick={handleRemoveAvatar}>
                                    <X className="mr-2 h-4 w-4" />
                                    {t('profile_edit_avatar_remove_button')}
                                  </Button>
                                )}
                              </div>
                            </div>
                            <FormDescription>{t('profile_edit_avatar_desc')}</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                     <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t('profile_edit_name_label')}</FormLabel>
                            <FormControl>
                            <Input placeholder={t('profile_edit_name_placeholder')} {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                     <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t('profile_edit_email_label')}</FormLabel>
                            <FormControl>
                            <Input type="email" placeholder={t('profile_edit_email_placeholder')} {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t('profile_edit_phone_label')}</FormLabel>
                            <FormControl>
                            <Input placeholder={t('profile_edit_phone_placeholder')} {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    
                     <FormField
                        control={form.control}
                        name="bio"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t('profile_edit_bio_label')}</FormLabel>
                            <FormControl>
                            <Textarea placeholder={t('profile_edit_bio_placeholder')} className="min-h-[100px]" {...field} />
                            </FormControl>
                            <FormDescription>{t('profile_edit_bio_desc')}</FormDescription>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                </div>

                {isProvider && (
                  <div className="space-y-6 border-t pt-8">
                     <h3 className="font-semibold text-lg flex items-center gap-2"><Briefcase className="w-5 h-5" />{t('profile_edit_provider_info_title')}</h3>
                     <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t('profile_edit_location_label')}</FormLabel>
                            <FormControl>
                            <Input placeholder={t('profile_edit_location_placeholder')} {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                     <FormField
                        control={form.control}
                        name="website"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t('profile_edit_website_label')}</FormLabel>
                            <div className="relative">
                               <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                               <FormControl>
                                <Input placeholder={t('profile_edit_website_placeholder')} {...field} className="pl-9" />
                               </FormControl>
                            </div>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <div className="space-y-4">
                        <FormLabel>{t('profile_edit_skills_label')}</FormLabel>
                        {fields.map((field, index) => (
                            <div key={field.id} className="flex items-center gap-2">
                                <FormField
                                    control={form.control}
                                    name={`skills.${index}`}
                                    render={({ field }) => (
                                        <FormItem className="flex-grow">
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder={t('profile_edit_skills_placeholder')} />
                                                </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                {jobCategories.map((cat) => (
                                                    <SelectItem key={cat} value={cat}>{t(`category_${cat.replace(/\s/g, '_').toLowerCase()}`)}</SelectItem>
                                                ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button
                                    type="button"
                                    variant="destructive"
                                    size="icon"
                                    onClick={() => remove(index)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                         <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => append('')}
                            >
                            <PlusCircle className="mr-2 h-4 w-4" />
                            {t('profile_edit_add_skill_button')}
                        </Button>
                    </div>
                  </div>
                )}

                <div className="flex justify-end gap-2">
                    <Button asChild variant="ghost">
                        <Link href="/dashboard/settings/profile">{t('profile_edit_cancel_button')}</Link>
                    </Button>
                    <Button type="submit" disabled={isPending}>
                        {isPending ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                {t('profile_edit_saving_button')}
                            </>
                        ) : (
                            <>
                                <Save className="mr-2 h-4 w-4" />
                                {t('profile_edit_save_button')}
                            </>
                        )}
                    </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

    