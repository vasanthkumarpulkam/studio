import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getCurrentUser, getProvider } from '@/lib/data';
import { ShieldCheck, ShieldAlert, User, KeyRound, UserX, FileText } from 'lucide-react';

export default function AccountSettingsPage() {
    const user = getCurrentUser();
    const provider = user.role === 'provider' ? getProvider(user.id) : null;

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-2xl flex items-center gap-2"><User className="w-6 h-6"/> Account Type</CardTitle>
                    <CardDescription>Manage your account type and verification status.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/30">
                        <div>
                            <p className="font-semibold">Current Role</p>
                            <p className="text-muted-foreground text-sm">You are currently a {user.role}.</p>
                        </div>
                        <Badge variant={user.role === 'customer' ? 'secondary' : 'default'} className="capitalize">
                            {user.role}
                        </Badge>
                    </div>
                     <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/30">
                        <div>
                            <p className="font-semibold">Verification Status</p>
                             <p className="text-muted-foreground text-sm">Your identity verification status.</p>
                        </div>
                        {provider?.isVerified ? (
                            <div className="flex items-center gap-2 text-green-600">
                                <ShieldCheck className="w-5 h-5"/>
                                <span className="font-semibold">Verified</span>
                            </div>
                        ) : (
                             <div className="flex items-center gap-2 text-amber-600">
                                <ShieldAlert className="w-5 h-5"/>
                                <span className="font-semibold">{provider ? 'Not Verified' : 'N/A'}</span>
                            </div>
                        )}
                    </div>
                </CardContent>
                <CardFooter>
                    <Button variant="outline" disabled>{user.role === 'customer' ? 'Switch to Provider' : 'Switch to Customer'}</Button>
                </CardFooter>
            </Card>

             <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-2xl flex items-center gap-2"><KeyRound className="w-6 h-6"/> Login &amp; Security</CardTitle>
                    <CardDescription>Manage your password, two-factor authentication, and view your login history.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                        <p>Password</p>
                        <Button variant="outline" size="sm">Reset Password</Button>
                    </div>
                     <div className="flex justify-between items-center">
                        <p>Two-Factor Authentication</p>
                        <Button variant="outline" size="sm" disabled>Enable 2FA</Button>
                    </div>
                     <div className="flex justify-between items-center">
                        <p>Login History</p>
                        <Button variant="outline" size="sm" disabled>View History</Button>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-2xl flex items-center gap-2"><FileText className="w-6 h-6"/> Data &amp; Privacy</CardTitle>
                    <CardDescription>Export your account data.</CardDescription>
                </CardHeader>
                 <CardContent>
                    <div className="flex justify-between items-center">
                        <p>Export Account Data</p>
                        <Button variant="outline" size="sm" disabled>Request Data</Button>
                    </div>
                </CardContent>
            </Card>

             <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-2xl flex items-center gap-2 text-destructive"><UserX className="w-6 h-6"/> Account Deletion</CardTitle>
                    <CardDescription>Permanently delete your account and all associated data. This action cannot be undone.</CardDescription>
                </CardHeader>
                <CardContent>
                     <Button variant="destructive" disabled>Delete Account</Button>
                </CardContent>
            </Card>
        </div>
    )
}
