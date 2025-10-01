
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getProvider } from '@/lib/data';
import { ShieldCheck, ShieldAlert, User, KeyRound, UserX, FileText, Loader2 } from 'lucide-react';
import type { User as UserType, Provider } from '@/types';
import { useTranslation } from '@/hooks/use-translation';
import { useUser } from '@/firebase';


export default function AccountSettingsPage() {
    const { user, isUserLoading } = useUser();
    const { t, isTranslationReady } = useTranslation();

    if (isUserLoading || !user || !isTranslationReady) {
        return <div className="flex justify-center items-center h-full"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
    }

    const provider = user.role === 'provider' ? user as Provider : null;

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-2xl flex items-center gap-2"><User className="w-6 h-6"/> {t('settings_account_title')}</CardTitle>
                    <CardDescription>{t('settings_account_subtitle')}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/30">
                        <div>
                            <p className="font-semibold">{t('settings_account_current_role_label')}</p>
                            <p className="text-muted-foreground text-sm">{t('settings_account_current_role_desc', { role: t(`role_${user.role}`) })}</p>
                        </div>
                        <Badge variant={user.role === 'customer' ? 'secondary' : 'default'} className="capitalize">
                            {t(`role_${user.role}`)}
                        </Badge>
                    </div>
                     <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/30">
                        <div>
                            <p className="font-semibold">{t('settings_account_verification_status_label')}</p>
                             <p className="text-muted-foreground text-sm">{t('settings_account_verification_status_desc')}</p>
                        </div>
                        {provider?.isVerified ? (
                            <div className="flex items-center gap-2 text-green-600">
                                <ShieldCheck className="w-5 h-5"/>
                                <span className="font-semibold">{t('settings_account_verified_status')}</span>
                            </div>
                        ) : (
                             <div className="flex items-center gap-2 text-amber-600">
                                <ShieldAlert className="w-5 h-5"/>
                                <span className="font-semibold">{provider ? t('settings_account_not_verified_status') : t('settings_account_not_applicable')}</span>
                            </div>
                        )}
                    </div>
                </CardContent>
                <CardFooter>
                    <Button variant="outline" disabled>{user.role === 'customer' ? t('settings_account_switch_to_provider') : t('settings_account_switch_to_customer')}</Button>
                </CardFooter>
            </Card>

             <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-2xl flex items-center gap-2"><KeyRound className="w-6 h-6"/> {t('settings_security_title')}</CardTitle>
                    <CardDescription>{t('settings_security_subtitle')}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                        <p>{t('settings_security_password_label')}</p>
                        <Button variant="outline" size="sm">{t('settings_security_password_button')}</Button>
                    </div>
                     <div className="flex justify-between items-center">
                        <p>{t('settings_security_2fa_label')}</p>
                        <Button variant="outline" size="sm" disabled>{t('settings_security_2fa_button')}</Button>
                    </div>
                     <div className="flex justify-between items-center">
                        <p>{t('settings_security_history_label')}</p>
                        <Button variant="outline" size="sm" disabled>{t('settings_security_history_button')}</Button>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-2xl flex items-center gap-2"><FileText className="w-6 h-6"/> {t('settings_data_title')}</CardTitle>
                    <CardDescription>{t('settings_data_subtitle')}</CardDescription>
                </CardHeader>
                 <CardContent>
                    <div className="flex justify-between items-center">
                        <p>{t('settings_data_export_label')}</p>
                        <Button variant="outline" size="sm" disabled>{t('settings_data_export_button')}</Button>
                    </div>
                </CardContent>
            </Card>

             <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-2xl flex items-center gap-2 text-destructive"><UserX className="w-6 h-6"/> {t('settings_delete_title')}</CardTitle>
                    <CardDescription>{t('settings_delete_subtitle')}</CardDescription>
                </CardHeader>
                <CardContent>
                     <Button variant="destructive" disabled>{t('settings_delete_button')}</Button>
                </CardContent>
            </Card>
        </div>
    )
}

    