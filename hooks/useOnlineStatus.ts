'use client';

import { useSyncExternalStore } from 'react';
import { useIsMounted } from './useMounted';

function subscribe(callback: () => void) {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener('online', callback);
  window.addEventListener('offline', callback);
  return () => {
    window.removeEventListener('online', callback);
    window.removeEventListener('offline', callback);
  };
}

export function useOnlineStatus(): boolean {
  const isMounted = useIsMounted();
  const isOnline = useSyncExternalStore(
    subscribe,
    () => (typeof navigator !== 'undefined' ? navigator.onLine : true),
    () => true
  );

  if (!isMounted) return true;
  return isOnline;
}
