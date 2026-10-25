'use client';

import React from 'react';
import { Calendar, Clock, ArrowRight, ShieldCheck, AlertTriangle } from 'lucide-react';
import { Briefing, UserProgress } from '@/types/briefing';

interface HomeBriefingHeroProps {
  currentBriefing: Briefing;
  progress: UserProgress;
  onReadBriefing: (briefing: Briefing) => void;
  onOpenChecklist: () => void;
}

export function HomeBriefingHero({
  currentBriefing,
  progress,
  onReadBriefing,
  onOpenChecklist,
}: HomeBriefingHeroProps) {
  const isRead = progress.readBriefingIds.includes(currentBriefing.id);
  const questionAnswer = progress.answeredQuestions[currentBriefing.question.id];

  return (
    <section className="space-y-6">
      {/* Formal Introduction & Purpose */}
      <div className="bg-[#1B2A4A] text-white p-6 sm:p-8 border-b-4 border-[#8B1A1A] shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 text-[10px] font-mono tracking-widest uppercase bg-[#0E1726] text-slate-300 border border-[#2F436E]">
              Official UK National Resilience Resource
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white leading-tight">
              Civilian Preparedness Assistant &amp; Strategic Threat Briefings
            </h1>
            <p className="text-sm sm:text-base text-slate-300 font-sans leading-relaxed">
              Published monthly by Universal Defence and Security Solutions (UDSS). Rigorous, actionable intelligence briefings and proportionate household preparedness measures for UK citizens, business leaders, and communities.
            </p>
          </div>

          <div className="shrink-0 flex flex-col sm:flex-row md:flex-col gap-2">
            <button
              onClick={() => onReadBriefing(currentBriefing)}
              className="px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white bg-[#8B1A1A] hover:bg-[#721515] border border-[#a42020] transition-colors inline-flex items-center justify-center gap-2 text-center"
            >
              Read Current Briefing
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onOpenChecklist}
              className="px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-slate-200 bg-[#0E1726] hover:bg-[#142238] border border-[#2F436E] transition-colors inline-flex items-center justify-center gap-2 text-center"
            >
              Household Checklist
            </button>
          </div>
        </div>
      </div>

      {/* Current Month's Briefing Feature Card */}
      <div className="bg-white border-2 border-[#1B2A4A] p-6 sm:p-8 shadow-sm relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-[#D0D0D0]">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 text-xs font-bold uppercase tracking-wider bg-[#8B1A1A] text-white">
              Current Monthly Briefing
            </span>
            <span className="text-xs font-mono uppercase text-[#4A4A4A] tracking-wider">
              {currentBriefing.category}
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs text-[#4A4A4A] font-mono">
            <span className="inline-flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-[#1B2A4A]" />
              {currentBriefing.month}
            </span>
            <span>•</span>
            <span className="inline-flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-[#1B2A4A]" />
              {currentBriefing.readTime}
            </span>
            {isRead && (
              <span className="inline-flex items-center gap-1 text-emerald-800 font-semibold bg-emerald-50 px-2 py-0.5 border border-emerald-200">
                <ShieldCheck className="w-3.5 h-3.5" />
                Read
              </span>
            )}
          </div>
        </div>

        <div className="mt-4 space-y-3">
          <h2 className="font-serif text-xl sm:text-2xl md:text-3xl font-bold text-[#1B2A4A] hover:text-[#0E1726] transition-colors cursor-pointer"
              onClick={() => onReadBriefing(currentBriefing)}>
            {currentBriefing.title}
          </h2>

          <p className="text-sm sm:text-base text-[#333333] leading-relaxed">
            {currentBriefing.summary}
          </p>
        </div>

        <div className="mt-6 pt-4 border-t border-[#D0D0D0] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-xs text-[#4A4A4A]">
            <span className="inline-flex items-center gap-1 font-semibold text-[#8B1A1A]">
              <AlertTriangle className="w-3.5 h-3.5" />
              Threat Assessment: {currentBriefing.threatLevel}
            </span>
            {questionAnswer !== undefined && (
              <span className="text-emerald-800 bg-emerald-50 px-2 py-0.5 border border-emerald-200">
                Knowledge Check Completed
              </span>
            )}
          </div>

          <button
            onClick={() => onReadBriefing(currentBriefing)}
            className="w-full sm:w-auto px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-white bg-[#1B2A4A] hover:bg-[#132039] transition-colors inline-flex items-center justify-center gap-2"
          >
            Read Briefing
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
