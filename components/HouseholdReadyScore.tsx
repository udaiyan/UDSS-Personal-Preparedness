'use client';

import React from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Shield,
  Users,
  Share2,
  KeyRound,
  UserCheck,
  ChevronRight,
  Sparkles,
  CloudCheck
} from 'lucide-react';
import { UserProgress, ChecklistItem } from '@/types/briefing';
import { calculateHouseholdReadyScore } from '@/lib/storage';

interface HouseholdReadyScoreProps {
  progress: UserProgress;
  items: ChecklistItem[];
  onOpenProfiler: () => void;
  onOpenShareModal: () => void;
  onOpenRecoveryModal: () => void;
  onOpenBuddiesModal: () => void;
  onOpenChecklist: () => void;
}

export function HouseholdReadyScore({
  progress,
  items,
  onOpenProfiler,
  onOpenShareModal,
  onOpenRecoveryModal,
  onOpenBuddiesModal,
  onOpenChecklist,
}: HouseholdReadyScoreProps) {
  const score = calculateHouseholdReadyScore(progress, items);
  const memberCount = progress.householdProfile.members.length;
  const petCount = progress.householdProfile.hasPets ? progress.householdProfile.petCount : 0;

  let badgeColor = 'bg-rose-50 text-rose-900 border-rose-300';
  let badgeIcon = <ShieldAlert className="w-5 h-5 text-[#8B1A1A]" />;
  let barColor = 'bg-[#8B1A1A]';

  if (score.level === 'Fully prepared') {
    badgeColor = 'bg-emerald-50 text-emerald-950 border-emerald-300';
    badgeIcon = <ShieldCheck className="w-5 h-5 text-emerald-700" />;
    barColor = 'bg-emerald-700';
  } else if (score.level === 'Partially prepared') {
    badgeColor = 'bg-amber-50 text-amber-950 border-amber-300';
    badgeIcon = <Shield className="w-5 h-5 text-amber-700" />;
    barColor = 'bg-amber-600';
  }

  return (
    <section suppressHydrationWarning className="bg-white border-2 border-[#1B2A4A] shadow-sm">
      {/* Top Identity & Status Bar */}
      <div className="bg-[#1B2A4A] text-white px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-mono uppercase tracking-widest text-slate-300 text-[10px]">
            Anonymous Prep ID:
          </span>
          <span className="font-mono font-bold text-white bg-[#0E1726] px-2 py-0.5 border border-[#3A4D78] tracking-wider">
            {progress.prepId}
          </span>
        </div>

        <div className="flex items-center gap-3 text-[11px] font-mono text-slate-300">
          <span className="hidden sm:inline-flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse"></span>
            Zero PII Stored
          </span>
          {progress.lastBackupTime && (
            <span className="inline-flex items-center gap-1 text-slate-300">
              <CloudCheck className="w-3.5 h-3.5 text-emerald-400" />
              Encrypted Backup Active
            </span>
          )}
          <button
            onClick={onOpenRecoveryModal}
            className="text-slate-200 hover:text-white underline underline-offset-2 inline-flex items-center gap-1"
          >
            <KeyRound className="w-3 h-3 text-amber-300" />
            Private Recovery Link
          </button>
        </div>
      </div>

      {/* Main Score & Readiness Display */}
      <div className="p-6 sm:p-7 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* Headline Level & Scale */}
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono uppercase tracking-widest text-[#4A4A4A] font-semibold">
                Official Benchmark
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-xs text-[#4A4A4A]">
                Household: <strong className="text-[#1A1A1A] font-semibold">{memberCount} {memberCount === 1 ? 'person' : 'people'}</strong>
                {petCount > 0 ? ` + ${petCount} ${petCount === 1 ? 'pet' : 'pets'}` : ''}
              </span>
            </div>

            <div className="flex flex-wrap items-baseline gap-3">
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1B2A4A]">
                Household Ready Score
              </h2>
              <span className="font-mono text-xl sm:text-2xl font-bold text-[#1B2A4A]">
                {score.percentage}%
              </span>
            </div>

            {/* Visual Level Badge */}
            <div className="flex items-center gap-2 pt-1">
              <span className={`inline-flex items-center gap-2 px-3 py-1 text-xs font-bold uppercase tracking-wider border ${badgeColor}`}>
                {badgeIcon}
                {score.level}
              </span>
              <span className="text-xs text-[#4A4A4A] font-mono">
                {score.completedCount} of {score.relevantTotal} core measures secured
              </span>
            </div>
          </div>

          {/* Quick Action Tools */}
          <div className="flex flex-wrap sm:flex-nowrap md:flex-col gap-2 shrink-0">
            <button
              onClick={onOpenShareModal}
              className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#1B2A4A] bg-[#F5F5F0] hover:bg-[#EAEAE2] border border-[#D0D0D0] transition-colors inline-flex items-center justify-center gap-1.5"
            >
              <Share2 className="w-3.5 h-3.5" />
              Share Status
            </button>
            <button
              onClick={onOpenBuddiesModal}
              className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#1B2A4A] bg-[#F5F5F0] hover:bg-[#EAEAE2] border border-[#D0D0D0] transition-colors inline-flex items-center justify-center gap-1.5"
            >
              <UserCheck className="w-3.5 h-3.5 text-[#8B1A1A]" />
              Accountability Buddies ({progress.buddies.length})
            </button>
            <button
              onClick={onOpenProfiler}
              className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-slate-700 bg-white hover:bg-[#FAF9F5] border border-[#D0D0D0] transition-colors inline-flex items-center justify-center gap-1.5"
            >
              <Users className="w-3.5 h-3.5" />
              Adjust Household Profile
            </button>
          </div>
        </div>

        {/* Multi-Segment Progress Bar */}
        <div className="space-y-1.5">
          <div className="h-3.5 w-full bg-[#EAEAE2] overflow-hidden border border-[#D0D0D0] flex">
            <div
              className={`h-full ${barColor} transition-all duration-500 ease-out`}
              style={{ width: `${score.percentage}%` }}
              role="progressbar"
              aria-valuenow={score.percentage}
              aria-valuemin={0}
              aria-valuemax={100}
            />
          </div>

          <div className="flex justify-between text-[11px] font-mono text-[#666666]">
            <span>Need to get going (&lt;40%)</span>
            <span>Partially prepared (40–79%)</span>
            <span>Fully prepared (80–100%)</span>
          </div>
        </div>

        {/* Guidance Prompt for Advancing */}
        <div className="p-3.5 bg-[#FAF9F5] border-l-4 border-[#1B2A4A] text-xs sm:text-sm text-[#222222] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <strong className="font-semibold text-[#1B2A4A] block sm:inline mr-2">
              Next Step to Advance:
            </strong>
            <span className="text-[#4A4A4A]">{score.actionRequired}</span>
          </div>

          <button
            onClick={onOpenChecklist}
            className="text-xs font-semibold uppercase tracking-wider text-[#1B2A4A] hover:underline shrink-0 inline-flex items-center gap-1 font-mono"
          >
            Review Measures <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Advanced Readiness Indicator if unlocked */}
        {score.advancedCompletedCount > 0 && (
          <div className="flex items-center justify-between text-xs text-[#4A4A4A] border-t border-[#D0D0D0] pt-3">
            <span className="inline-flex items-center gap-1.5 text-[#1B2A4A] font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              Enhanced Resilience (Advanced Tier):
            </span>
            <span className="font-mono text-[#1B2A4A] font-bold">
              {score.advancedCompletedCount} of {score.advancedTotal} advanced self-sufficiency measures completed
            </span>
          </div>
        )}
      </div>
    </section>
  );
}
