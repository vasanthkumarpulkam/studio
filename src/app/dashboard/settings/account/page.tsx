import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function AccountSettingsPage() {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline text-2xl">Account</CardTitle>
                <CardDescription>Manage your account type and verification status.</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">Account settings are under construction.</p>
            </CardContent>
        </Card>
    )
}
