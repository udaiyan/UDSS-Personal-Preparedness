'use client';

import React from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en-GB">
      <body className="min-h-screen bg-[#F5F5F0] text-[#1A1A1A] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white border-2 border-[#1B2A4A] p-6 sm:p-8 space-y-4 shadow-sm text-center">
          <div className="w-12 h-12 mx-auto rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center">
            <span className="font-mono text-base font-bold text-[#8B1A1A]">!</span>
          </div>
          <div className="space-y-1">
            <span className="font-mono text-xs uppercase tracking-wider text-[#8B1A1A] font-bold">
              Critical System Notice
            </span>
            <h1 className="font-serif text-2xl font-bold text-[#1B2A4A]">
              Application Interruption
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-[#4A4A4A] leading-relaxed">
            A root-level system exception was intercepted. All offline preparedness data and plans stored in your browser remain intact.
          </p>
          <div className="pt-2">
            <button
              onClick={() => reset()}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white bg-[#1B2A4A] hover:bg-[#132039] transition-colors"
            >
              Restore Interface
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
