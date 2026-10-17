'use client';

import React, { useState } from 'react';
import { X, Share2, Copy, Check, Shield, AlertTriangle, ShieldCheck } from 'lucide-react';
import { UserProgress, ChecklistItem } from '@/types/briefing';
import { calculateHouseholdReadyScore } from '@/lib/storage';

interface ShareStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  progress: UserProgress;
  items: ChecklistItem[];
}

export function ShareStatusModal({ isOpen, onClose, progress, items }: ShareStatusModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const score = calculateHouseholdReadyScore(progress, items);
  const shareUrl = typeof window !== 'undefined' ? window.location.origin : 'https://universal-defence.com';

  const shareText =
    `I've verified my household preparedness level with UDSS Personal Preparedness.\n\n` +
    `Prep ID: ${progress.prepId}\n` +
    `Readiness Level: ${score.level} (${score.percentage}% of baseline measures secured)\n\n` +
    `Check your household readiness and create your free, 100% anonymous account:\n${shareUrl}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'UDSS Personal Preparedness - Household Readiness',
          text: shareText,
          url: shareUrl,
        });
      } catch {
        // dismissed
      }
    } else {
      handleCopy();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 overflow-y-auto backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="share-modal-title"
    >
      <div className="relative w-full max-w-lg bg-white border border-[#D0D0D0] shadow-2xl rounded-none my-8">
        <div className="bg-[#1B2A4A] text-white px-6 py-4 flex items-center justify-between border-b-2 border-[#8B1A1A]">
          <div>
            <div className="text-[10px] font-mono tracking-widest text-slate-300 uppercase">
              Privacy-Protected Public Share
            </div>
            <h2 id="share-modal-title" className="font-serif text-xl font-bold text-white mt-0.5">
              Share Preparedness Status
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-300 hover:text-white p-1 rounded"
            aria-label="Close share dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5 text-[#1A1A1A]">
          {/* Privacy Safeguard Note */}
          <div className="bg-[#FAF9F5] border-l-4 border-emerald-700 p-3 text-xs text-[#333333] space-y-1">
            <div className="font-semibold text-emerald-950 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              Zero Sensitive Data Exposed
            </div>
            <p>
              This link shares <strong>only your headline readiness level and UDSS Prep ID</strong>. It will <em>never</em> reveal checklist responses, household member ages, medical requirements, or your private recovery link.
            </p>
          </div>

          {/* Preview Card */}
          <div className="border-2 border-[#1B2A4A] p-5 bg-[#FAF9F6] space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs uppercase tracking-wider text-[#4A4A4A]">
                UDSS RESILIENCE BRIEF
              </span>
              <span className="font-mono text-xs font-bold text-[#1B2A4A] bg-[#EAEAE2] px-2 py-0.5 border border-[#D0D0D0]">
                {progress.prepId}
              </span>
            </div>

            <div className="space-y-1">
              <span className="text-xs text-[#666666] uppercase font-mono">Headline Status:</span>
              <div className="font-serif text-2xl font-bold text-[#1B2A4A]">
                {score.level}
              </div>
              <p className="text-xs text-[#4A4A4A]">
                {score.percentage}% of baseline UK domestic contingency measures completed.
              </p>
            </div>

            <div className="pt-2 border-t border-[#D0D0D0] text-[11px] text-[#666666]">
              Encourage friends, family, or colleagues to establish their own anonymous household baseline.
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
            <button
              onClick={handleCopy}
              className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#1B2A4A] bg-[#F5F5F0] hover:bg-[#EAEAE2] border border-[#D0D0D0] transition-colors inline-flex items-center justify-center gap-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-700" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied to Clipboard' : 'Copy Share Text'}
            </button>

            <button
              onClick={handleNativeShare}
              className="px-5 py-2 text-xs font-semibold uppercase tracking-wider text-white bg-[#1B2A4A] hover:bg-[#132039] border border-[#2D4373] transition-colors inline-flex items-center justify-center gap-2"
            >
              <Share2 className="w-3.5 h-3.5" />
              Transmit / Share Status
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
