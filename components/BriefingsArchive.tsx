'use client';

import React, { useState } from 'react';
import { Calendar, Clock, ChevronRight, CheckCircle, Search, Filter } from 'lucide-react';
import { Briefing, UserProgress } from '@/types/briefing';

interface BriefingsArchiveProps {
  briefings: Briefing[];
  progress: UserProgress;
  onSelectBriefing: (briefing: Briefing) => void;
}

export function BriefingsArchive({
  briefings,
  progress,
  onSelectBriefing,
}: BriefingsArchiveProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = ['All', ...Array.from(new Set(briefings.map((b) => b.category)))];

  const filteredBriefings = briefings.filter((briefing) => {
    const matchesCategory = selectedCategory === 'All' || briefing.category === selectedCategory;
    const matchesQuery =
      searchQuery.trim() === '' ||
      briefing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      briefing.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      briefing.month.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  return (
    <section className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b-2 border-[#1B2A4A] pb-3">
        <div>
          <span className="text-xs font-mono tracking-wider uppercase text-[#8B1A1A] font-bold">
            Record of Intelligence
          </span>
          <h2 className="font-serif text-2xl font-bold text-[#1B2A4A]">
            Archive of National Resilience Briefings
          </h2>
        </div>
        <p className="text-xs text-[#4A4A4A] max-w-sm">
          Retrospective analyses examining critical vulnerabilities, infrastructure interdependencies, and household preparedness.
        </p>
      </div>

      {/* Filter and search controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 border border-[#D0D0D0]">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#4A4A4A]" />
          <input
            type="text"
            placeholder="Search briefings by keyword or month..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-[#D0D0D0] bg-[#FAFAF8] focus:bg-white focus:outline-none focus:border-[#1B2A4A]"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 text-xs">
          <Filter className="w-3.5 h-3.5 text-[#4A4A4A] shrink-0" />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 text-xs whitespace-nowrap transition-colors border ${
                selectedCategory === cat
                  ? 'bg-[#1B2A4A] text-white border-[#1B2A4A] font-semibold'
                  : 'bg-[#F5F5F0] text-[#333333] border-[#D0D0D0] hover:bg-[#EAEAE2]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Briefings List */}
      <div className="divide-y divide-[#D0D0D0] border border-[#D0D0D0] bg-white">
        {filteredBriefings.length === 0 ? (
          <div className="p-8 text-center text-sm text-[#4A4A4A]">
            No archived briefings match the specified query.
          </div>
        ) : (
          filteredBriefings.map((briefing) => {
            const isRead = progress.readBriefingIds.includes(briefing.id);
            const questionAnswered = progress.answeredQuestions[briefing.question.id] !== undefined;

            return (
              <div
                key={briefing.id}
                onClick={() => onSelectBriefing(briefing)}
                className="p-4 sm:p-5 hover:bg-[#FAF9F5] transition-colors cursor-pointer group flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1 pr-2">
                  <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-[#4A4A4A]">
                    <span className="font-semibold text-[#1B2A4A] bg-[#EFEFEA] px-2 py-0.5">
                      {briefing.month}
                    </span>
                    <span className="text-[#6B6B6B]">•</span>
                    <span>{briefing.category}</span>
                    <span className="text-[#6B6B6B]">•</span>
                    <span className="inline-flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#1B2A4A]" />
                      {briefing.readTime}
                    </span>
                  </div>

                  <h3 className="font-serif text-lg font-bold text-[#1B2A4A] group-hover:text-[#0E1726] transition-colors">
                    {briefing.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#4A4A4A] line-clamp-2 leading-relaxed">
                    {briefing.summary}
                  </p>
                </div>

                <div className="shrink-0 flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#EFEFEA]">
                  <div className="flex items-center gap-2 text-xs">
                    {isRead && (
                      <span className="inline-flex items-center gap-1 text-emerald-800 bg-emerald-50 px-2 py-0.5 border border-emerald-200">
                        <CheckCircle className="w-3 h-3" />
                        Read
                      </span>
                    )}
                    {questionAnswered && (
                      <span className="text-[11px] font-mono text-slate-700 bg-slate-100 px-2 py-0.5 border border-slate-300">
                        Check passed
                      </span>
                    )}
                  </div>

                  <span className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-[#1B2A4A] group-hover:translate-x-0.5 transition-transform">
                    View
                    <ChevronRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
