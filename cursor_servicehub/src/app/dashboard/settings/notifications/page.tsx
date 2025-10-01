
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Bell, Mail, Smartphone, Loader2 } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';

export default function NotificationsSettingsPage() {
    const { t, isTranslationReady } = useTranslation();

    const notificationSettings = [
        { id: 'newBids', label: t('settings_notifications_new_bids_label'), email: true, push: true },
        { id: 'bidAccepted', label: t('settings_notifications_bid_accepted_label'), email: true, push: true },
        { id: 'jobStatus', label: t('settings_notifications_job_status_label'), email: true, push: false },
        { id: 'newMessage', label: t('settings_notifications_new_message_label'), email: false, push: true },
        { id: 'paymentRelease', label: t('settings_notifications_payment_release_label'), email: true, push: true },
        { id: 'platformAnnouncements', label: t('settings_notifications_platform_announcements_label'), email: true, push: false },
    ];

    if (!isTranslationReady) {
        return <div className="flex justify-center items-center h-full"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline text-2xl flex items-center gap-2">
                    <Bell className="w-6 h-6"/> {t('settings_notifications_title')}
                </CardTitle>
                <CardDescription>{t('settings_notifications_subtitle')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-4 rounded-lg border p-4">
                    <div className="grid grid-cols-3 gap-4 font-semibold">
                        <div className="col-span-1">{t('settings_notifications_type_header')}</div>
                        <div className="col-span-1 flex items-center justify-center gap-2"><Mail className="w-4 h-4"/> {t('settings_notifications_email_header')}</div>
                        <div className="col-span-1 flex items-center justify-center gap-2"><Smartphone className="w-4 h-4"/> {t('settings_notifications_push_header')}</div>
                    </div>
                     {notificationSettings.map(setting => (
                        <div key={setting.id} className="grid grid-cols-3 gap-4 items-center">
                            <Label htmlFor={`${setting.id}-email`} className="col-span-1">{setting.label}</Label>
                            <div className="col-span-1 flex justify-center">
                                <Switch id={`${setting.id}-email`} defaultChecked={setting.email} aria-label={`Email for ${setting.label}`} />
                            </div>
                             <div className="col-span-1 flex justify-center">
                                <Switch id={`${setting.id}-push`} defaultChecked={setting.push} aria-label={`Push for ${setting.label}`} />
                            </div>
                        </div>
                     ))}
                </div>
            </CardContent>
            <CardFooter>
                <Button>{t('settings_notifications_save_button')}</Button>
            </CardFooter>
        </Card>
    )
}
