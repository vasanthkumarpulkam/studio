
'use client';

import { getCurrentUser, getProvider } from '@/lib/data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShieldCheck, ShieldAlert, Star, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { User, Provider } from '@/types';
import { useTranslation } from '@/hooks/use-translation';

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
      <CardHeader>
        <CardTitle className="font-headline text-2xl">{t('settings_profile_title')}</CardTitle>
        <CardDescription>{t('settings_profile_subtitle')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="flex items-center gap-4">
            <Avatar className="w-20 h-20 border-2 border-background shadow-md">
                <AvatarImage src={user.avatarUrl} alt={user.name} />
                <AvatarFallback className="text-2xl">
                    {getInitials(user.name)}
                </AvatarFallback>
            </Avatar>
            <div>
                <h3 className="text-xl font-bold font-headline">{user.name}</h3>
                <p className="text-muted-foreground">{user.email}</p>
                <Badge variant={user.role === 'customer' ? 'secondary' : 'default'} className="mt-2">
                    {t(`role_${user.role}`)}
                </Badge>
            </div>
        </div>
        
        {provider && (
            <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 border rounded-lg bg-muted/30">
                <div className="flex flex-col items-center gap-2">
                <p className="text-sm text-muted-foreground">{t('settings_profile_rating')}</p>
                <div className="flex items-center gap-1 text-2xl font-bold">
                    <Star className="w-6 h-6 text-amber-400 fill-amber-400" />
                    {provider.rating}
                </div>
                <p className="text-xs text-muted-foreground">({provider.reviews} {t('settings_profile_reviews')})</p>
                </div>
                <div className="flex flex-col items-center gap-2">
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
                    <Badge key={skill} variant="outline">{skill}</Badge>
                ))}
                </div>
            </div>
            </div>
        )}
        <div className="text-left">
            <Button>{t('settings_profile_edit_button')}</Button>
        </div>
      </CardContent>
    </Card>
  );
}
