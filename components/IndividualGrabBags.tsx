'use client';

import React, { useState } from 'react';
import {
  Briefcase,
  CheckCircle2,
  CheckSquare,
  Square,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Baby,
  User,
  HeartHandshake,
  PawPrint,
  Check
} from 'lucide-react';
import { UserProgress } from '@/types/briefing';
import { toggleGrabBagItem, markEntireGrabBag } from '@/lib/storage';

interface IndividualGrabBagsProps {
  progress: UserProgress;
  onOpenProfiler: () => void;
}

export function IndividualGrabBags({ progress, onOpenProfiler }: IndividualGrabBagsProps) {
  const [activeMemberId, setActiveMemberId] = useState<string | null>(null);

  const bags = Object.values(progress.individualGrabBags || {});
  const completedBagsCount = bags.filter((b) => b.isComplete).length;
  const totalBags = bags.length;

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'infant':
        return <Baby className="w-4 h-4 text-purple-700" />;
      case 'child':
        return <Sparkles className="w-4 h-4 text-blue-700" />;
      case 'senior':
        return <HeartHandshake className="w-4 h-4 text-amber-700" />;
      case 'pet':
        return <PawPrint className="w-4 h-4 text-emerald-700" />;
      default:
        return <User className="w-4 h-4 text-[#1B2A4A]" />;
    }
  };

  return (
    <section className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b-2 border-[#1B2A4A] pb-3">
        <div>
          <span className="text-xs font-mono tracking-wider uppercase text-[#8B1A1A] font-bold">
            Rapid Evacuation Readiness
          </span>
          <h2 className="font-serif text-2xl font-bold text-[#1B2A4A]">
            Individual Grab Bags: &ldquo;Pack My Grab Bag&rdquo;
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-mono font-bold text-[#1B2A4A] bg-[#EAEAE2] px-2.5 py-1 border border-[#D0D0D0]">
            {completedBagsCount} / {totalBags} Bags Packed
          </span>
          <button
            onClick={onOpenProfiler}
            className="text-xs font-semibold text-[#1B2A4A] hover:underline"
          >
            Adjust Household &rarr;
          </button>
        </div>
      </div>

      <p className="text-xs sm:text-sm text-[#4A4A4A] leading-relaxed max-w-3xl">
        Rather than a single unwieldy family container, UK civil contingency protocol advises maintaining an individual backpack per family member. Each bag is tailored to the person&apos;s age, medical necessities, and mobility role.
      </p>

      {/* Auto-Sync with Check List Banner */}
      <div className="p-3 bg-[#FAF9F5] border-l-4 border-emerald-600 text-xs text-[#222222] flex items-start gap-2.5 shadow-2xs">
        <Sparkles className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
        <div>
          <strong className="text-emerald-950 font-semibold block sm:inline mr-1">
            Check List &amp; Ready Score Auto-Sync Active:
          </strong>
          <span className="text-[#4A4A4A]">
            Packing items in your grab bags automatically updates your household Check List and advances your Ready Score—even though evacuation grab bags contain smaller individual rations.
          </span>
        </div>
      </div>

      {/* Bag Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {bags.map((bag) => {
          const isExpanded = activeMemberId === bag.memberId || bags.length === 1;
          const packedCount = bag.items.filter((i) => i.isPacked).length;
          const totalItems = bag.items.length;
          const bagPercentage = Math.round((packedCount / totalItems) * 100);

          return (
            <div
              key={bag.memberId}
              className={`border transition-all bg-white ${
                bag.isComplete ? 'border-emerald-600 shadow-xs' : 'border-[#D0D0D0] hover:border-[#1B2A4A]'
              }`}
            >
              {/* Card Header */}
              <div className="p-4 bg-[#FAF9F5] border-b border-[#D0D0D0] flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 bg-white border border-[#D0D0D0] rounded-xs">
                    {getRoleIcon(bag.role)}
                  </div>
                  <div>
                    <h3 className="font-serif text-base font-bold text-[#1B2A4A] leading-snug">
                      {bag.label}
                    </h3>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#666666] capitalize">
                      {bag.role} Evacuation Pack
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {bag.isComplete ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 border border-emerald-300">
                      <Check className="w-3.5 h-3.5" />
                      Ready
                    </span>
                  ) : (
                    <span className="text-xs font-mono font-semibold text-[#4A4A4A]">
                      {packedCount}/{totalItems} ({bagPercentage}%)
                    </span>
                  )}

                  <button
                    onClick={() => setActiveMemberId(isExpanded ? null : bag.memberId)}
                    className="p-1 text-[#4A4A4A] hover:text-[#1B2A4A]"
                    aria-label={isExpanded ? 'Collapse packing list' : 'Expand packing list'}
                  >
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Progress bar inside card */}
              <div className="h-1.5 w-full bg-[#EAEAE2]">
                <div
                  className={`h-full ${bag.isComplete ? 'bg-emerald-600' : 'bg-[#1B2A4A]'} transition-all duration-300`}
                  style={{ width: `${bagPercentage}%` }}
                />
              </div>

              {/* Collapsible Items List */}
              {isExpanded && (
                <div className="p-4 space-y-2 text-xs">
                  <div className="flex items-center justify-between pb-2 mb-1 border-b border-[#EFEFEA]">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-[#666666]">
                      Required Contents:
                    </span>
                    <button
                      type="button"
                      onClick={() => markEntireGrabBag(bag.memberId, !bag.isComplete)}
                      className="text-[11px] text-[#1B2A4A] font-semibold hover:underline"
                    >
                      {bag.isComplete ? 'Mark all incomplete' : 'Mark all packed'}
                    </button>
                  </div>

                  <div className="space-y-1.5">
                    {bag.items.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => toggleGrabBagItem(bag.memberId, item.id)}
                        className={`p-2 flex items-start gap-2.5 cursor-pointer rounded-xs transition-colors ${
                          item.isPacked ? 'bg-emerald-50/60' : 'hover:bg-[#F5F5F0]'
                        }`}
                      >
                        <button
                          type="button"
                          className="mt-0.5 text-[#1B2A4A] focus:outline-none shrink-0"
                          aria-label={item.isPacked ? `Unpack ${item.label}` : `Pack ${item.label}`}
                        >
                          {item.isPacked ? (
                            <CheckSquare className="w-4 h-4 text-emerald-700 fill-emerald-50" />
                          ) : (
                            <Square className="w-4 h-4 text-[#666666]" />
                          )}
                        </button>
                        <span
                          className={`leading-snug flex-1 ${
                            item.isPacked ? 'text-emerald-950 font-medium' : 'text-[#333333]'
                          }`}
                        >
                          {item.label}
                        </span>
                        {item.isPacked && (
                          <span className="text-[10px] font-mono text-emerald-700 shrink-0 bg-emerald-100/70 px-1.5 py-0.5 rounded-xs">
                            ✓ Updates Check List
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
