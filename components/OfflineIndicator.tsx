'use client';

import React from 'react';
import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';

export function OfflineIndicator() {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:w-96 z-50 flex items-center gap-3 rounded bg-[#8B1A1A] text-white px-4 py-3 shadow-lg border border-[#6b1414]"
    >
      <WifiOff className="w-5 h-5 shrink-0 text-white" />
      <div className="text-xs">
        <p className="font-semibold tracking-wide uppercase">Offline Mode Active</p>
        <p className="text-white/90 mt-0.5">
          Local device network is unavailable. Briefings and saved checklist progress remain fully readable offline.
        </p>
      </div>
    </div>
  );
}
