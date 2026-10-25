'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { HouseholdReadyScore } from '@/components/HouseholdReadyScore';
import { SirRichardVideoIntro } from '@/components/SirRichardVideoIntro';
import { HomeBriefingHero } from '@/components/HomeBriefingHero';
import { BriefingsArchive } from '@/components/BriefingsArchive';
import { BriefingReader } from '@/components/BriefingReader';
import { ChecklistSection } from '@/components/ChecklistSection';
import { WaterFoodCalculators } from '@/components/WaterFoodCalculators';
import { IndividualGrabBags } from '@/components/IndividualGrabBags';
import { AboutUDSSSection } from '@/components/AboutUDSSSection';
import { CorporateEnquiriesModal } from '@/components/CorporateEnquiriesModal';
import { HouseholdProfilerModal } from '@/components/HouseholdProfilerModal';
import { ShareStatusModal } from '@/components/ShareStatusModal';
import { AccountabilityBuddiesModal } from '@/components/AccountabilityBuddiesModal';
import { AccountRecoveryModal } from '@/components/AccountRecoveryModal';
import { EmergencyPlanModal } from '@/components/EmergencyPlanModal';
import { Footer } from '@/components/Footer';

import { Briefing, ChecklistItem } from '@/types/briefing';
import { useUserProgress, restoreFromRecoveryToken } from '@/lib/storage';

import rawBriefings from '@/data/briefings.json';
import rawChecklist from '@/data/checklist.json';
import { Briefcase, ArrowRight, CheckSquare, Backpack, Droplets } from 'lucide-react';

const briefings: Briefing[] = rawBriefings as Briefing[];
const checklistItems: ChecklistItem[] = rawChecklist as ChecklistItem[];

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<'home' | 'checklist' | 'logistics' | 'about'>('home');
  const [selectedBriefing, setSelectedBriefing] = useState<Briefing | null>(null);

  // Modals state
  const [isProfilerOpen, setIsProfilerOpen] = useState<boolean>(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);
  const [isRecoveryModalOpen, setIsRecoveryModalOpen] = useState<boolean>(false);
  const [isBuddiesModalOpen, setIsBuddiesModalOpen] = useState<boolean>(false);
  const [isEmergencyPlanOpen, setIsEmergencyPlanOpen] = useState<boolean>(false);
  const [isCorporateModalOpen, setIsCorporateModalOpen] = useState<boolean>(false);

  const progress = useUserProgress();

  // Check URL query for recovery token e.g. /?recover=xxxx
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const recoverParam = params.get('recover');
    if (recoverParam && recoverParam.length >= 16) {
      restoreFromRecoveryToken(recoverParam).then((res) => {
        if (res.success) {
          setIsRecoveryModalOpen(true);
        }
      });
    }
  }, []);

  const handleReadBriefing = (briefing: Briefing) => {
    setSelectedBriefing(briefing);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToBriefings = () => {
    setSelectedBriefing(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentBriefing = briefings[0]; // October 2026 - Current

  const handleOpenChecklist = () => {
    setSelectedBriefing(null);
    setActiveTab('checklist');
    setTimeout(() => {
      const el = document.getElementById('household-measures-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        window.scrollTo({ top: 350, behavior: 'smooth' });
      }
    }, 60);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F5F0]">
      {/* Persistent Official Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          setSelectedBriefing(null);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenCorporateModal={() => setIsCorporateModalOpen(true)}
        onOpenEmergencyPlan={() => setIsEmergencyPlanOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* If a briefing is active, render the Briefing Reader */}
        {selectedBriefing ? (
          <BriefingReader
            key={selectedBriefing.id}
            briefing={selectedBriefing}
            allBriefings={briefings}
            progress={progress}
            onBack={handleBackToBriefings}
            onSelectBriefing={(b) => setSelectedBriefing(b)}
          />
        ) : (
          <>
            {/* Home View */}
            {activeTab === 'home' && (
              <div className="space-y-10">
                {/* 1. Household Ready Score (Always upfront before detailed sections) */}
                <HouseholdReadyScore
                  progress={progress}
                  items={checklistItems}
                  onOpenProfiler={() => setIsProfilerOpen(true)}
                  onOpenShareModal={() => setIsShareModalOpen(true)}
                  onOpenRecoveryModal={() => setIsRecoveryModalOpen(true)}
                  onOpenBuddiesModal={() => setIsBuddiesModalOpen(true)}
                  onOpenChecklist={handleOpenChecklist}
                />

                {/* 2. Introductory Video Address by Sir Richard Barrons */}
                <SirRichardVideoIntro
                  onStartBasicPreparedness={handleOpenChecklist}
                />

                {/* 3. Hero with Current Briefing */}
                <HomeBriefingHero
                  currentBriefing={currentBriefing}
                  progress={progress}
                  onReadBriefing={handleReadBriefing}
                  onOpenChecklist={handleOpenChecklist}
                />

                {/* 4. Household Logistics Quick Banner */}
                <div className="bg-white border border-[#D0D0D0] p-6 sm:p-7 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="space-y-1.5 max-w-xl">
                    <div className="flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-wider text-[#8B1A1A]">
                      <Backpack className="w-4 h-4" />
                      Individual Grab Bags &amp; 72-Hour Sustenance
                    </div>
                    <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#1B2A4A]">
                      Tailored Household Water, Food &amp; Grab Bags
                    </h3>
                    <p className="text-xs sm:text-sm text-[#4A4A4A] leading-relaxed">
                      Interactive calculators calibrated to your family composition, with individual evacuation backpacks for every member of the household.
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setActiveTab('logistics');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white bg-[#1B2A4A] hover:bg-[#132039] transition-colors inline-flex items-center gap-2 shrink-0"
                  >
                    Open Logistics
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                {/* 5. Archive of Past Briefings */}
                <BriefingsArchive
                  briefings={briefings}
                  progress={progress}
                  onSelectBriefing={handleReadBriefing}
                />

                {/* 6. Corporate Advisory Banner */}
                <div className="bg-[#0E1726] text-white p-6 sm:p-8 border-l-4 border-[#8B1A1A] flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="space-y-2 max-w-xl">
                    <div className="text-[11px] font-mono tracking-widest uppercase text-slate-300">
                      Corporate Contingency &amp; Board Advisory
                    </div>
                    <h3 className="font-serif text-xl sm:text-2xl font-bold text-white">
                      Board-Level National Resilience Briefings
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      For board-level resilience briefings, strategic advisory, or corporate preparedness programmes, contact Laurence Postgate at UDSS.
                    </p>
                  </div>

                  <button
                    onClick={() => setIsCorporateModalOpen(true)}
                    className="px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white bg-[#8B1A1A] hover:bg-[#721515] border border-[#a42020] transition-colors shrink-0 inline-flex items-center gap-2"
                  >
                    <Briefcase className="w-4 h-4" />
                    Enquire: Laurence Postgate
                  </button>
                </div>
              </div>
            )}

            {/* Checklist View (Basic & Advanced) */}
            {activeTab === 'checklist' && (
              <div className="space-y-8">
                <HouseholdReadyScore
                  progress={progress}
                  items={checklistItems}
                  onOpenProfiler={() => setIsProfilerOpen(true)}
                  onOpenShareModal={() => setIsShareModalOpen(true)}
                  onOpenRecoveryModal={() => setIsRecoveryModalOpen(true)}
                  onOpenBuddiesModal={() => setIsBuddiesModalOpen(true)}
                  onOpenChecklist={handleOpenChecklist}
                />

                <ChecklistSection
                  items={checklistItems}
                  progress={progress}
                />
              </div>
            )}

            {/* Logistics View (Water, Food, Grab Bags) */}
            {activeTab === 'logistics' && (
              <div className="space-y-10">
                <WaterFoodCalculators
                  profile={progress.householdProfile}
                  progress={progress}
                  onOpenProfiler={() => setIsProfilerOpen(true)}
                />

                <IndividualGrabBags
                  progress={progress}
                  onOpenProfiler={() => setIsProfilerOpen(true)}
                />
              </div>
            )}

            {/* About UDSS View */}
            {activeTab === 'about' && (
              <AboutUDSSSection
                onOpenCorporateModal={() => setIsCorporateModalOpen(true)}
              />
            )}
          </>
        )}
      </main>

      {/* Persistent Footer */}
      <Footer
        onOpenCorporateModal={() => setIsCorporateModalOpen(true)}
        onNavigateTab={(tab) => {
          setActiveTab(tab);
          setSelectedBriefing(null);
        }}
      />

      {/* Modals */}
      <HouseholdProfilerModal
        isOpen={isProfilerOpen}
        onClose={() => setIsProfilerOpen(false)}
        profile={progress.householdProfile}
      />

      <ShareStatusModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        progress={progress}
        items={checklistItems}
      />

      <AccountabilityBuddiesModal
        isOpen={isBuddiesModalOpen}
        onClose={() => setIsBuddiesModalOpen(false)}
        progress={progress}
      />

      <AccountRecoveryModal
        isOpen={isRecoveryModalOpen}
        onClose={() => setIsRecoveryModalOpen(false)}
        progress={progress}
      />

      <EmergencyPlanModal
        isOpen={isEmergencyPlanOpen}
        onClose={() => setIsEmergencyPlanOpen(false)}
        progress={progress}
      />

      <CorporateEnquiriesModal
        isOpen={isCorporateModalOpen}
        onClose={() => setIsCorporateModalOpen(false)}
      />
    </div>
  );
}
