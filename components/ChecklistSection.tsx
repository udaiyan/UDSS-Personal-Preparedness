'use client';

import React, { useState } from 'react';
import {
  Check,
  CheckCircle2,
  Clock,
  MinusCircle,
  HelpCircle,
  Printer,
  RotateCcw,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Sun,
  Flame,
  ArrowRight,
  Download
} from 'lucide-react';
import { ChecklistItem, ChecklistItemStatus, UserProgress } from '@/types/briefing';
import { updateChecklistItemStatus, resetChecklistStorage, getChecklistSyncSource } from '@/lib/storage';
import { safePrintOrDownload, downloadTextFile } from '@/lib/safe-print';

interface ChecklistSectionProps {
  items: ChecklistItem[];
  progress: UserProgress;
}

export function ChecklistSection({ items, progress }: ChecklistSectionProps) {
  const [selectedTier, setSelectedTier] = useState<'basic' | 'advanced'>('basic');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [confirmingReset, setConfirmingReset] = useState<boolean>(false);

  // Filter items by tier (Basic vs Advanced)
  const tierItems = items.filter((item) => item.tier === selectedTier);

  const categories = ['All', ...Array.from(new Set(tierItems.map((i) => i.category)))];

  const filteredItems = tierItems.filter((item) => {
    return selectedCategory === 'All' || item.category === selectedCategory;
  });

  const handleStatusChange = (itemId: string, status: ChecklistItemStatus) => {
    updateChecklistItemStatus(itemId, status);
  };

  const handleExecuteReset = () => {
    resetChecklistStorage();
    setConfirmingReset(false);
  };

  // Counts for header overview
  const basicItems = items.filter((i) => i.tier === 'basic');
  const basicCompleted = basicItems.filter(
    (i) => (progress.checklistStatuses[i.id] || 'not_addressed') === 'completed'
  ).length;

  const advancedItems = items.filter((i) => i.tier === 'advanced');
  const advancedCompleted = advancedItems.filter(
    (i) => (progress.checklistStatuses[i.id] || 'not_addressed') === 'completed'
  ).length;

  const getChecklistText = () => {
    const lines = [
      '=============================================================',
      'UNIVERSAL DEFENCE AND SECURITY SOLUTIONS (UDSS)',
      'HOUSEHOLD PREPAREDNESS CHECKLIST',
      '33 Cannon St, London EC4M 5SB',
      '=============================================================',
      `Household Prep ID: ${progress.prepId}`,
      `Date Generated: ${new Date().toLocaleDateString('en-GB')}`,
      '',
      '--- BASIC TIER (IMMEDIATE 72-HOUR RESILIENCE • UK GOV BE READY STANDARD) ---',
    ];

    basicItems.forEach((item) => {
      const status = progress.checklistStatuses[item.id] || 'not_addressed';
      const mark = status === 'completed' ? '[X]' : status === 'in_progress' ? '[-]' : status === 'not_relevant' ? '[N/A]' : '[ ]';
      const govTag = item.govStandard ? ' [UK GOV BE READY]' : '';
      lines.push(`${mark} [${item.category}]${govTag} ${item.title}`);
      lines.push(`    ${item.description}`);
    });

    lines.push('');
    lines.push('--- ADVANCED TIER (EXTENDED DISRUPTION PROTOCOLS) ---');

    advancedItems.forEach((item) => {
      const status = progress.checklistStatuses[item.id] || 'not_addressed';
      const mark = status === 'completed' ? '[X]' : status === 'in_progress' ? '[-]' : '[ ]';
      lines.push(`${mark} [${item.category}] ${item.title}`);
      lines.push(`    ${item.description}`);
    });

    lines.push('=============================================================\n');
    return lines.join('\n');
  };

  const handlePrintChecklist = () => {
    safePrintOrDownload('UDSS-Preparedness-Checklist.txt', getChecklistText);
  };

  const handleDownloadChecklist = () => {
    downloadTextFile('UDSS-Preparedness-Checklist.txt', getChecklistText());
  };

  return (
    <section id="household-measures-section" className="space-y-6 scroll-mt-24">
      {/* Official Section Heading */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b-2 border-[#1B2A4A] pb-3">
        <div>
          <span className="text-xs font-mono tracking-wider uppercase text-[#8B1A1A] font-bold">
            Civil Contingency Action Plan
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1B2A4A]">
            Household Preparedness Check List
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handlePrintChecklist}
            className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#1B2A4A] bg-white border border-[#D0D0D0] hover:bg-[#F5F5F0] transition-colors inline-flex items-center gap-1.5"
            title="Print or export checklist"
          >
            <Printer className="w-3.5 h-3.5" />
            Print Checklist
          </button>

          <button
            onClick={handleDownloadChecklist}
            className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#1B2A4A] bg-white border border-[#D0D0D0] hover:bg-[#F5F5F0] transition-colors inline-flex items-center gap-1.5"
            title="Download checklist as plain text"
          >
            <Download className="w-3.5 h-3.5" />
            Download (.txt)
          </button>

          {confirmingReset ? (
            <div className="flex items-center gap-1.5 bg-rose-50 border border-rose-300 p-1">
              <span className="text-[11px] font-semibold text-rose-900 px-1">Reset all?</span>
              <button
                onClick={handleExecuteReset}
                className="px-2 py-0.5 text-[11px] font-bold uppercase text-white bg-[#8B1A1A] hover:bg-[#6e1414]"
              >
                Yes
              </button>
              <button
                onClick={() => setConfirmingReset(false)}
                className="px-2 py-0.5 text-[11px] font-semibold uppercase text-[#333333] bg-[#EAEAE2]"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirmingReset(true)}
              className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#8B1A1A] bg-white border border-[#D0D0D0] hover:bg-rose-50 transition-colors inline-flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Marks
            </button>
          )}
        </div>
      </div>

      {/* Tier Switcher: Basic Preparedness vs Advanced Preparedness */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Basic Tier Card Button */}
        <button
          type="button"
          onClick={() => {
            setSelectedTier('basic');
            setSelectedCategory('All');
          }}
          className={`p-4 sm:p-5 text-left border-2 transition-all flex flex-col justify-between ${
            selectedTier === 'basic'
              ? 'border-[#1B2A4A] bg-white shadow-md ring-1 ring-[#1B2A4A]'
              : 'border-[#D0D0D0] bg-[#FAF9F5] hover:border-[#1B2A4A]/50'
          }`}
        >
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase tracking-wider font-bold text-[#8B1A1A]">
                Primary Standard
              </span>
              <span className="text-xs font-mono font-bold text-[#1B2A4A] bg-[#EAEAE2] px-2 py-0.5">
                {basicCompleted} / {basicItems.length} Secured
              </span>
            </div>
            <h3 className="font-serif text-lg sm:text-xl font-bold text-[#1B2A4A]">
              1. Basic Preparedness
            </h3>
            <p className="text-xs text-[#4A4A4A] leading-relaxed">
              The essential, achievable standard for every UK household. Focuses on 72 hours of water, food, power banks, and contingency planning.
            </p>
          </div>
          {selectedTier === 'basic' && (
            <div className="mt-3 text-[11px] font-bold text-[#1B2A4A] uppercase tracking-wider flex items-center gap-1">
              Active Tier Selection &bull; Essential Requirements
            </div>
          )}
        </button>

        {/* Advanced Tier Card Button */}
        <button
          type="button"
          onClick={() => {
            setSelectedTier('advanced');
            setSelectedCategory('All');
          }}
          className={`p-4 sm:p-5 text-left border-2 transition-all flex flex-col justify-between ${
            selectedTier === 'advanced'
              ? 'border-[#1B2A4A] bg-white shadow-md ring-1 ring-[#1B2A4A]'
              : 'border-[#D0D0D0] bg-[#FAF9F5] hover:border-[#1B2A4A]/50'
          }`}
        >
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase tracking-wider font-bold text-amber-700">
                Optional Self-Sufficiency
              </span>
              <span className="text-xs font-mono font-bold text-[#1B2A4A] bg-[#EAEAE2] px-2 py-0.5">
                {advancedCompleted} / {advancedItems.length} Secured
              </span>
            </div>
            <h3 className="font-serif text-lg sm:text-xl font-bold text-[#1B2A4A] flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-600" />
              2. Advanced Preparedness
            </h3>
            <p className="text-xs text-[#4A4A4A] leading-relaxed">
              Optional higher-resilience measures for greater autonomy: solar chargers, power stations, safe fuel storage, 30-day reserves, and off-grid heat.
            </p>
          </div>
          {selectedTier === 'advanced' && (
            <div className="mt-3 text-[11px] font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1">
              Active Tier Selection &bull; Enhanced Self-Sufficiency
            </div>
          )}
        </button>
      </div>

      {/* UK Government Be Ready Alignment Banner for Basic Tier */}
      {selectedTier === 'basic' && (
        <div className="bg-[#FAF9F5] border-2 border-[#1B2A4A] p-4 sm:p-5 shadow-xs space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#D0D0D0] pb-2.5">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-white bg-[#1B2A4A] px-2 py-0.5">
                Official UK Government Standard
              </span>
              <span className="font-serif font-bold text-[#1B2A4A] text-sm">
                HM Government &lsquo;Be Ready&rsquo; 3-Day Checklist
              </span>
            </div>
            <a
              href="https://beready.campaign.gov.uk/wp-content/uploads/sites/252/2026/10/Be-Ready-Checklist_English.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-mono font-semibold text-[#8B1A1A] hover:underline inline-flex items-center gap-1 shrink-0"
            >
              <span>Download Official Gov PDF &rarr;</span>
            </a>
          </div>
          <p className="text-xs text-[#4A4A4A] leading-relaxed">
            All core provisions from the Cabinet Office civil contingency checklist are incorporated below: <strong>Water</strong> (3L/person/day), <strong>Food</strong> (3-day non-perishable), <strong>Light &amp; Warmth</strong> (torches, batteries, blankets/sleeping bags), <strong>Communication</strong> (FM radio, power banks), <strong>Money &amp; Documents</strong> (cash coins/notes, ID copies, contact cards), <strong>Health</strong> (first aid, prescription medicines), <strong>Hygiene</strong> (sanitiser, wet wipes), <strong>Baby products</strong>, <strong>Pet food &amp; water</strong>, and <strong>Community Mutual Aid</strong>.
          </p>
        </div>
      )}

      {/* Category Filter Bar */}
      <div className="bg-white p-3 border border-[#D0D0D0] flex flex-wrap items-center gap-1.5 text-xs">
        <span className="font-semibold text-[#1A1A1A] mr-2">Category:</span>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-2.5 py-1 transition-colors border ${
              selectedCategory === cat
                ? 'bg-[#1B2A4A] text-white border-[#1B2A4A] font-semibold'
                : 'bg-[#F5F5F0] text-[#333333] border-[#D0D0D0] hover:bg-[#EAEAE2]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Checklist Items List */}
      <div className="space-y-3.5">
        {filteredItems.map((item) => {
          const currentStatus = progress.checklistStatuses[item.id] || 'not_addressed';
          const isCompleted = currentStatus === 'completed';
          const isInProgress = currentStatus === 'in_progress';
          const isNotRelevant = currentStatus === 'not_relevant';
          const isExpanded = expandedId === item.id;

          let cardStyle = 'bg-white border-[#D0D0D0] hover:border-[#1B2A4A]';
          if (isCompleted) {
            cardStyle = 'bg-[#FAFBF9] border-emerald-600/70 shadow-xs';
          } else if (isInProgress) {
            cardStyle = 'bg-[#FDFCF8] border-amber-500/70';
          } else if (isNotRelevant) {
            cardStyle = 'bg-[#F0F0EC]/60 border-[#D8D8D0] opacity-65';
          }
          const syncSource = getChecklistSyncSource(item.id, progress);

          return (
            <div key={item.id} className={`border transition-all p-4 sm:p-5 ${cardStyle}`}>
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                {/* Main Content Area (NO strikethrough per instructions!) */}
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#4A4A4A] bg-[#EAEAE2] px-2 py-0.5">
                      {item.category}
                    </span>

                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 ${
                        item.priority === 'Essential'
                          ? 'bg-[#8B1A1A] text-white'
                          : item.priority === 'High'
                          ? 'bg-amber-100 text-amber-900 border border-amber-300'
                          : 'bg-slate-100 text-slate-800 border border-slate-300'
                      }`}
                    >
                      {item.priority}
                    </span>

                    {syncSource && (
                      <span className="text-[10px] font-mono font-medium text-emerald-900 bg-emerald-50 px-2 py-0.5 border border-emerald-300 inline-flex items-center gap-1 shadow-2xs">
                        <Sparkles className="w-3 h-3 text-emerald-700" />
                        <span>{syncSource.label}: {syncSource.countText}</span>
                      </span>
                    )}

                    {isCompleted && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 border border-emerald-300">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                        Completed
                      </span>
                    )}

                    {isInProgress && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-900 bg-amber-100 px-2 py-0.5 border border-amber-300">
                        <Clock className="w-3 h-3" />
                        In Progress
                      </span>
                    )}

                    {isNotRelevant && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-600 bg-slate-200 px-2 py-0.5">
                        <MinusCircle className="w-3 h-3" />
                        Not Relevant
                      </span>
                    )}
                  </div>

                  {/* Clean title without strikethrough */}
                  <h4 className="font-serif text-lg font-bold text-[#1B2A4A] leading-snug">
                    {item.title}
                  </h4>

                  <p className="text-xs sm:text-sm text-[#333333] leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* 4-State Interactive Status Controller */}
                <div className="shrink-0 flex flex-col items-end gap-2 pt-1">
                  <span className="text-[10px] font-mono uppercase text-[#666666] tracking-wider block">
                    Action Status:
                  </span>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 text-xs">
                    <button
                      type="button"
                      onClick={() => handleStatusChange(item.id, 'completed')}
                      className={`px-2.5 py-1.5 border font-semibold flex items-center justify-center gap-1 transition-all ${
                        isCompleted
                          ? 'bg-emerald-700 text-white border-emerald-800 ring-2 ring-emerald-600'
                          : 'bg-white text-[#333333] border-[#D0D0D0] hover:bg-emerald-50'
                      }`}
                      title="Mark measure as fully secured"
                    >
                      <Check className="w-4 h-4 stroke-[3]" />
                      Done
                    </button>

                    <button
                      type="button"
                      onClick={() => handleStatusChange(item.id, 'in_progress')}
                      className={`px-2.5 py-1.5 border font-semibold flex items-center justify-center gap-1 transition-all ${
                        isInProgress
                          ? 'bg-amber-600 text-white border-amber-700 ring-2 ring-amber-500'
                          : 'bg-white text-[#333333] border-[#D0D0D0] hover:bg-amber-50'
                      }`}
                      title="Item is partially acquired or underway"
                    >
                      <Clock className="w-3.5 h-3.5" />
                      In Prog
                    </button>

                    <button
                      type="button"
                      onClick={() => handleStatusChange(item.id, 'not_addressed')}
                      className={`px-2.5 py-1.5 border font-semibold flex items-center justify-center gap-1 transition-all ${
                        currentStatus === 'not_addressed'
                          ? 'bg-[#1B2A4A] text-white border-[#1B2A4A]'
                          : 'bg-white text-[#666666] border-[#D0D0D0] hover:bg-[#F5F5F0]'
                      }`}
                      title="Not yet addressed"
                    >
                      Pending
                    </button>

                    <button
                      type="button"
                      onClick={() => handleStatusChange(item.id, 'not_relevant')}
                      className={`px-2 py-1.5 border font-semibold flex items-center justify-center gap-1 transition-all ${
                        isNotRelevant
                          ? 'bg-slate-700 text-white border-slate-800'
                          : 'bg-white text-[#777777] border-[#D0D0D0] hover:bg-slate-100'
                      }`}
                      title="Mark as not relevant to your property without penalising score"
                    >
                      N/A
                    </button>
                  </div>

                  <button
                    onClick={() => setExpandedId(isExpanded ? null : item.id)}
                    className="text-xs text-[#1B2A4A] hover:underline inline-flex items-center gap-1 mt-1 font-medium"
                  >
                    {isExpanded ? (
                      <>
                        Close guidance <ChevronUp className="w-3.5 h-3.5" />
                      </>
                    ) : (
                      <>
                        Practical guidance <ChevronDown className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Expandable Technical Advice & Solar Buying Guidance */}
              {isExpanded && (
                <div className="mt-4 pt-3 border-t border-[#D0D0D0] space-y-3 text-xs leading-relaxed text-[#222222] bg-[#FAF9F5] p-3 border-l-4 border-[#1B2A4A]">
                  <div>
                    <strong className="text-[#1B2A4A] font-semibold block mb-0.5">
                      Operational Tip from UDSS Contingency Planners:
                    </strong>
                    <p className="text-[#333333]">{item.tip}</p>
                  </div>

                  {item.buyingGuidance && (
                    <div className="pt-2 border-t border-[#EAEAE2] text-[#333333]">
                      <strong className="text-amber-900 font-semibold flex items-center gap-1 mb-1">
                        <Sun className="w-3.5 h-3.5 text-amber-700" />
                        UK Weather &amp; Technical Buying Guidance:
                      </strong>
                      <p>{item.buyingGuidance}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Route into Advanced Tier Banner when viewing Basic Tier */}
      {selectedTier === 'basic' && (
        <div className="bg-[#0E1726] text-white p-6 border-l-4 border-amber-600 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
          <div className="space-y-1 max-w-xl">
            <span className="text-[10px] font-mono tracking-widest uppercase text-amber-400">
              Enhanced Self-Sufficiency
            </span>
            <h4 className="font-serif text-lg font-bold text-white">
              Ready to go further? Explore Advanced Preparedness
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Explore solar battery stations, 30-day non-perishable reserves, certified gravity water filtration, and neighbourhood mutual-aid planning.
            </p>
          </div>

          <button
            onClick={() => {
              setSelectedTier('advanced');
              setSelectedCategory('All');
              window.scrollTo({ top: 300, behavior: 'smooth' });
            }}
            className="px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-slate-900 bg-amber-400 hover:bg-amber-300 transition-colors shrink-0 inline-flex items-center justify-center gap-2"
          >
            Open Advanced Tier ({advancedItems.length} Measures)
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </section>
  );
}
