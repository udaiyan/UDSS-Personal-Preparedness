'use client';

import React, { useState } from 'react';
import { Download, Share2, X, Smartphone, Check } from 'lucide-react';
import { usePWAInstall } from '@/hooks/usePWAInstall';

export function PWAInstallButton() {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [installSuccess, setInstallSuccess] = useState(false);

  if (isInstalled || installSuccess) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-emerald-800 bg-emerald-50 border border-emerald-200 rounded">
        <Check className="w-3.5 h-3.5" />
        Installed
      </span>
    );
  }

  const handleInstallClick = async () => {
    const success = await install();
    if (success) {
      setInstallSuccess(true);
    }
  };

  if (isInstallable) {
    return (
      <button
        onClick={handleInstallClick}
        type="button"
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold tracking-wide uppercase text-white bg-[#1B2A4A] border border-[#2D4373] rounded hover:bg-[#132039] transition-colors focus:outline-none focus:ring-2 focus:ring-[#1B2A4A] focus:ring-offset-2"
        aria-label="Install UDSS Personal Preparedness application to home screen"
      >
        <Download className="w-3.5 h-3.5" />
        Install App
      </button>
    );
  }

  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          type="button"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold tracking-wide uppercase text-[#1B2A4A] bg-white border border-[#D0D0D0] rounded hover:bg-[#F5F5F0] transition-colors"
          aria-label="Instructions to install app on iPhone or iPad"
        >
          <Smartphone className="w-3.5 h-3.5" />
          Install on iOS
        </button>

        {showIOSGuide && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs"
            role="dialog"
            aria-modal="true"
            aria-labelledby="ios-install-title"
          >
            <div className="w-full max-w-sm rounded bg-white p-6 shadow-xl border border-[#D0D0D0]">
              <div className="flex items-start justify-between pb-3 border-b border-[#D0D0D0]">
                <div>
                  <h3 id="ios-install-title" className="font-serif text-lg font-bold text-[#1B2A4A]">
                    Install on iPhone or iPad
                  </h3>
                  <p className="text-xs text-[#4A4A4A] mt-0.5">
                    UDSS Personal Preparedness Progressive Web App
                  </p>
                </div>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="text-[#4A4A4A] hover:text-[#1A1A1A] p-1 rounded"
                  aria-label="Close installation instructions"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-4 space-y-3 text-sm text-[#1A1A1A]">
                <div className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#1B2A4A] text-xs font-bold text-white">
                    1
                  </span>
                  <p className="leading-snug">
                    Tap the <strong className="font-semibold">Share</strong> button in your Safari bottom navigation bar.
                    <Share2 className="inline-block w-4 h-4 mx-1 text-[#1B2A4A]" />
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#1B2A4A] text-xs font-bold text-white">
                    2
                  </span>
                  <p className="leading-snug">
                    Scroll down through the share options and select <strong className="font-semibold">&quot;Add to Home Screen&quot;</strong>.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#1B2A4A] text-xs font-bold text-white">
                    3
                  </span>
                  <p className="leading-snug">
                    Tap <strong className="font-semibold">&quot;Add&quot;</strong> in the top right corner. The briefing will remain accessible offline.
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-[#D0D0D0]">
                <button
                  onClick={() => setShowIOSGuide(false)}
                  type="button"
                  className="w-full py-2 px-4 text-xs font-semibold uppercase tracking-wider text-white bg-[#1B2A4A] hover:bg-[#132039] rounded transition-colors"
                >
                  Understood
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  // Subtle install hint for standard browsers
  return null;
}
