'use client';

import React, { useState, useEffect } from 'react';
import { ShieldCheck, Lock, X } from 'lucide-react';
import { isGDPRAcknowledged, setGDPRAcknowledged } from '@/lib/storage';

interface GDPRConsentBannerProps {
  onOpenPolicy: () => void;
}

export function GDPRConsentBanner({ onOpenPolicy }: GDPRConsentBannerProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isGDPRAcknowledged()) {
        setVisible(true);
      }
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  const handleDismiss = () => {
    setGDPRAcknowledged();
    setVisible(false);
  };

  return (
    <div
      role="region"
      aria-label="GDPR Privacy & Cookie Notice"
      className="fixed bottom-0 inset-x-0 z-40 bg-[#0E1726]/95 backdrop-blur-md text-white border-t-2 border-[#8B1A1A] p-3.5 sm:p-4 shadow-2xl transition-all"
    >
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <p className="text-slate-300 leading-relaxed max-w-3xl">
            <strong className="text-white font-semibold">UK GDPR &amp; Privacy Notice: </strong>
            This civil resilience application uses <strong>zero advertising cookies</strong> and <strong>zero remote tracking pixels</strong>. All personal household contingency plans, contacts, and inventories are stored exclusively on your device using client-side encryption.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
          <button
            onClick={onOpenPolicy}
            className="px-3 py-1.5 font-semibold text-[11px] uppercase tracking-wider text-slate-200 hover:text-white bg-white/10 hover:bg-white/20 border border-white/20 transition-colors"
          >
            Manage Data &amp; Policy
          </button>
          <button
            onClick={handleDismiss}
            className="px-3.5 py-1.5 font-bold text-[11px] uppercase tracking-wider text-[#0E1726] bg-amber-400 hover:bg-amber-300 transition-colors"
          >
            Acknowledge
          </button>
        </div>
      </div>
    </div>
  );
}
