import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function SettingsPage() {
    return (
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            <div className="max-w-4xl mx-auto w-full">
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline text-2xl">Settings</CardTitle>
                        <CardDescription>Manage your account settings and preferences.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">Settings page is under construction.</p>
                    </CardContent>
                </Card>
            </div>
        </main>
    )
}
