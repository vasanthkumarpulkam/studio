'use client';

import Link from 'next/link';
import Script from 'next/script';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { jobCategories } from '@/lib/data';

export default function ServicesPage() {
  const categories = jobCategories.filter(c => !['Cash-Only Job'].includes(c));
  return (
    <div className="container mx-auto px-4 py-10">
      <Script id="ld-json-services" type="application/ld+json" strategy="afterInteractive">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          name: 'Service categories',
          itemListElement: categories.map((cat, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            url: `https://example.com/services/${encodeURIComponent(cat.toLowerCase().replace(/\s+/g,'-'))}`,
            name: cat
          }))
        })}
      </Script>
      <h1 className="text-3xl font-bold mb-6">Services</h1>
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {categories.map(cat => (
          <Card key={cat}>
            <CardHeader>
              <CardTitle>{cat}</CardTitle>
            </CardHeader>
            <CardContent>
              <Link href={`/services/${encodeURIComponent(cat.toLowerCase().replace(/\s+/g,'-'))}`}>Explore {cat}</Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

