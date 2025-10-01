
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function AdminSettingsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Admin Settings</h1>
      <Card>
        <CardHeader>
          <CardTitle>Platform Configuration</CardTitle>
          <CardDescription>Manage global settings for the application.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Settings will be available here in a future update.</p>
        </CardContent>
      </Card>
    </div>
  );
}
