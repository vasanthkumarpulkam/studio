'use client';

import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';

export default function SupportPage() {
  return (
    <div className="container mx-auto px-4 py-10">
      <Card>
        <CardHeader>
          <CardTitle>Support</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Contact us at support@example.com. In v1, this page can include FAQs and a contact form.</p>
        </CardContent>
      </Card>
    </div>
  );
}

