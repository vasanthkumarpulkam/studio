
'use client';

import { getCurrentUser, getProvider } from '@/lib/data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShieldCheck, ShieldAlert, Star, Loader2, Mail, Phone, Globe, Edit } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { User, Provider } from '@/types';
import { useTranslation } from '@/hooks/use-translation';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';

export default function ProfileSettingsPage() {
  const [user, setUser] = useState<User | Provider | null>(null);
  const [provider, setProvider] = useState<Provider | null>(null);
  const { t, isTranslationReady } = useTranslation();

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
    if (currentUser?.role === 'provider') {
        setProvider(getProvider(currentUser.id) || null);
    }
  }, []);

  const getInitials = (name: string) => {
    return name.split(' ').map((n) => n[0]).join('');
  };

  if (!user || !isTranslationReady) {
    return <div className="flex justify-center items-center h-full"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between">
        <div>
          <CardTitle className="font-headline text-2xl">{t('settings_profile_title')}</CardTitle>
          <CardDescription>{t('settings_profile_subtitle')}</CardDescription>
        </div>
         <Button asChild variant="outline">
            <Link href="/dashboard/settings/profile/edit">
              <Edit className="mr-2 h-4 w-4" />
              {t('settings_profile_edit_button')}
            </Link>
        </Button>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <Avatar className="w-24 h-24 border-2 border-background shadow-md">
                <AvatarImage src={user.avatarUrl} alt={user.name} />
                <AvatarFallback className="text-3xl">
                    {getInitials(user.name)}
                </AvatarFallback>
            </Avatar>
            <div className="space-y-2">
                <div className="flex items-center gap-4">
                  <h3 className="text-2xl font-bold font-headline">{user.name}</h3>
                   <Badge variant={user.role === 'customer' ? 'secondary' : 'default'} className="capitalize">
                      {t(`role_${user.role}`)}
                  </Badge>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-x-4 gap-y-2 text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4"/>
                      <span>{user.email}</span>
                    </div>
                    {user.phone && (
                       <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4"/>
                        <span>{user.phone}</span>
                      </div>
                    )}
                    {provider?.website && (
                       <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4"/>
                        <a href={provider.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                          {provider.website}
                        </a>
                      </div>
                    )}
                </div>
            </div>
        </div>

        {user.bio && (
            <div>
                <h3 className="text-lg font-semibold mb-2">{t('settings_profile_about_me')}</h3>
                <p className="text-muted-foreground whitespace-pre-wrap">{user.bio}</p>
            </div>
        )}
        
        {provider && (
            <>
            <Separator />
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col items-center gap-2 p-4 border rounded-lg bg-muted/30">
                  <p className="text-sm text-muted-foreground">{t('settings_profile_rating')}</p>
                  <div className="flex items-center gap-1 text-2xl font-bold">
                      <Star className="w-6 h-6 text-amber-400 fill-amber-400" />
                      {provider.rating}
                  </div>
                  <p className="text-xs text-muted-foreground">({provider.reviews} {t('settings_profile_reviews')})</p>
                  </div>
                  <div className="flex flex-col items-center justify-center gap-2 p-4 border rounded-lg bg-muted/30">
                      <p className="text-sm text-muted-foreground">{t('settings_profile_verification')}</p>
                  {provider.isVerified ? (
                      <div className="flex items-center gap-2 text-green-600">
                          <ShieldCheck />
                          <span className="font-semibold">{t('settings_profile_verified')}</span>
                      </div>
                  ) : (
                      <div className="flex flex-col items-center gap-2">
                              <div className="flex items-center gap-2 text-amber-600">
                              <ShieldAlert />
                              <span className="font-semibold">{t('settings_profile_not_verified')}</span>
                          </div>
                          <Button size="sm" variant="outline" className="mt-1">{t('settings_profile_start_verification')}</Button>
                      </div>
                  )}
                  </div>
              </div>

              <div>
                  <h3 className="text-lg font-semibold mb-2">{t('settings_profile_skills')}</h3>
                  <div className="flex flex-wrap gap-2">
                  {provider.skills.map((skill) => (
                      <Badge key={skill} variant="outline">{t(`category_${skill.replace(/\s/g, '_').toLowerCase()}`)}</Badge>
                  ))}
                  </div>
              </div>
            </div>
            </>
        )}
      </CardContent>
    </Card>
  );
}
