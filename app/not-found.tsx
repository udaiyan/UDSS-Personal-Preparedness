import Link from 'next/link';
import { ArrowLeft, ShieldAlert } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#F5F5F0] text-[#1A1A1A] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white border-2 border-[#1B2A4A] p-6 sm:p-8 space-y-4 shadow-sm text-center">
        <div className="w-12 h-12 mx-auto rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center">
          <ShieldAlert className="w-6 h-6 text-[#8B1A1A]" />
        </div>
        <div className="space-y-1">
          <span className="font-mono text-xs uppercase tracking-wider text-[#8B1A1A] font-bold">
            Notice 404 • Resource Unavailable
          </span>
          <h1 className="font-serif text-2xl font-bold text-[#1B2A4A]">
            Page Not Found
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-[#4A4A4A] leading-relaxed">
          The requested intelligence briefing or resource is not available on this system.
        </p>
        <div className="pt-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white bg-[#1B2A4A] hover:bg-[#132039] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Return to Home Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
