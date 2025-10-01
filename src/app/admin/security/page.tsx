
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { History } from 'lucide-react';

export default function AdminSecurityPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-3"><History /> Logs & Moderation</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Coming Soon</CardTitle>
          <CardDescription>
            This section will contain tools for security, activity logging, and content moderation.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-5 text-muted-foreground space-y-2">
            <li>Track admin and user activity logs.</li>
            <li>Receive alerts for suspicious activities.</li>
            <li>Monitor IP addresses and user sessions.</li>
            <li>Review and act on user-generated reports.</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
