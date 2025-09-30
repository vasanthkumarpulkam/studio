import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function NotificationsSettingsPage() {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline text-2xl">Notifications</CardTitle>
                <CardDescription>Manage your notification preferences.</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">Notification settings are under construction.</p>
            </CardContent>
        </Card>
    )
}
