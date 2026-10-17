'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { RotateCcw, AlertTriangle } from 'lucide-react';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('App error caught by App Router boundary:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#F5F5F0] text-[#1A1A1A] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white border-2 border-[#1B2A4A] p-6 sm:p-8 space-y-4 shadow-sm text-center">
        <div className="w-12 h-12 mx-auto rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center">
          <AlertTriangle className="w-6 h-6 text-amber-700" />
        </div>
        <div className="space-y-1">
          <span className="font-mono text-xs uppercase tracking-wider text-amber-900 font-bold">
            Application Contingency Active
          </span>
          <h1 className="font-serif text-2xl font-bold text-[#1B2A4A]">
            Temporary Interface Interruption
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-[#4A4A4A] leading-relaxed">
          An unexpected interface exception occurred. Your local preparedness progress and offline data remain safely stored.
        </p>
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2">
          <button
            onClick={() => reset()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white bg-[#1B2A4A] hover:bg-[#132039] transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reload Interface
          </button>
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#1B2A4A] bg-[#F5F5F0] hover:bg-[#EAEAE2] border border-[#D0D0D0]"
          >
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
