import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { LanguageProvider } from '@/context/language-context';
import { FirebaseClientProvider } from '@/firebase';
import { GoogleMapsProvider } from '@/context/google-maps-provider';

export const metadata: Metadata = {
  title: 'ServiceHub',
  description: 'Connects daily workers and repair service providers with customers.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased" suppressHydrationWarning>
        <LanguageProvider>
          <FirebaseClientProvider>
            <GoogleMapsProvider>
              {children}
            </GoogleMapsProvider>
          </FirebaseClientProvider>
        </LanguageProvider>
        <Toaster />
      </body>
    </html>
  );
}
