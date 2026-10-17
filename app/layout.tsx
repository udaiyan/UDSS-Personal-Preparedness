import type { Metadata, Viewport } from 'next';
import './globals.css';
import { ServiceWorkerRegister } from '@/components/ServiceWorkerRegister';
import { OfflineIndicator } from '@/components/OfflineIndicator';

export const viewport: Viewport = {
  themeColor: '#1B2A4A',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: 'UDSS Personal Preparedness | The Resilience Brief',
  description:
    'Monthly national resilience briefings and practical personal preparedness guidance for UK citizens, published by Universal Defence and Security Solutions.',
  applicationName: 'UDSS Personal Preparedness',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'UDSS Brief',
  },
  icons: {
    icon: [
      { url: '/favicon.png', sizes: '48x48', type: 'image/png' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
  openGraph: {
    title: 'UDSS Personal Preparedness | The Resilience Brief',
    description:
      'Monthly national resilience briefings and practical personal preparedness guidance for UK citizens, published by Universal Defence and Security Solutions.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'UDSS Personal Preparedness | The Resilience Brief',
    description:
      'Monthly national resilience briefings and practical personal preparedness guidance for UK citizens, published by Universal Defence and Security Solutions.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-GB">
      <body suppressHydrationWarning className="min-h-screen bg-[#F5F5F0] text-[#1A1A1A] antialiased selection:bg-[#1B2A4A] selection:text-white">
        <ServiceWorkerRegister />
        <OfflineIndicator />
        {children}
      </body>
    </html>
  );
}
