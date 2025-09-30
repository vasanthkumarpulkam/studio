
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Bell, Mail, Smartphone } from 'lucide-react';

export default function NotificationsSettingsPage() {
    const notificationSettings = [
        { id: 'newBids', label: 'New Bids on My Jobs', email: true, push: true },
        { id: 'bidAccepted', label: 'My Bid is Accepted', email: true, push: true },
        { id: 'jobStatus', label: 'Job Status Updates', email: true, push: false },
        { id: 'newMessage', label: 'New Messages', email: false, push: true },
        { id: 'paymentRelease', label: 'Payment Released', email: true, push: true },
        { id: 'platformAnnouncements', label: 'Platform Announcements', email: true, push: false },
    ];

    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline text-2xl flex items-center gap-2">
                    <Bell className="w-6 h-6"/> Notifications
                </CardTitle>
                <CardDescription>Manage how you receive notifications from ServiceHub.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-4 rounded-lg border p-4">
                    <div className="grid grid-cols-3 gap-4 font-semibold">
                        <div className="col-span-1">Notification Type</div>
                        <div className="col-span-1 flex items-center justify-center gap-2"><Mail className="w-4 h-4"/> Email</div>
                        <div className="col-span-1 flex items-center justify-center gap-2"><Smartphone className="w-4 h-4"/> Push</div>
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
                <Button>Save Preferences</Button>
            </CardFooter>
        </Card>
    )
}
