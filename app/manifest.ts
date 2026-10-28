import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: '/',
    name: 'UDSS Civilian Preparedness Assistant',
    short_name: 'UDSS Prep',
    description:
      'Monthly national resilience briefings and practical civilian preparedness guidance for UK citizens, published by Universal Defence and Security Solutions.',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    background_color: '#F5F5F0',
    theme_color: '#1B2A4A',
    orientation: 'portrait-primary',
    icons: [
      {
        src: '/pwa-192x192.png?v=9',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/pwa-512x512.png?v=9',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/pwa-maskable-512x512.png?v=9',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}
