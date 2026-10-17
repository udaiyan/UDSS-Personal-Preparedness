'use client';

import React, { useState } from 'react';
import { X, Users, Plus, Trash2, ShieldCheck, HeartPulse, Snowflake, PawPrint, Check } from 'lucide-react';
import { HouseholdProfile, HouseholdMember } from '@/types/briefing';
import { updateHouseholdProfile } from '@/lib/storage';

interface HouseholdProfilerModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: HouseholdProfile;
}

export function HouseholdProfilerModal({ isOpen, onClose, profile }: HouseholdProfilerModalProps) {
  const [members, setMembers] = useState<HouseholdMember[]>(profile.members);
  const [hasPets, setHasPets] = useState<boolean>(profile.hasPets);
  const [petCount, setPetCount] = useState<number>(profile.petCount || 1);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleAddMember = (category: 'adult' | 'child' | 'infant' | 'senior') => {
    const countOfCat = members.filter((m) => m.category === category).length + 1;
    const labels: Record<string, string> = {
      adult: `Adult ${countOfCat}`,
      child: `Child ${countOfCat}`,
      infant: `Infant ${countOfCat}`,
      senior: `Senior ${countOfCat}`,
    };

    const newMember: HouseholdMember = {
      id: 'm_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 5),
      category,
      label: labels[category],
      specialNeeds: {},
    };

    setMembers([...members, newMember]);
  };

  const handleRemoveMember = (id: string) => {
    if (members.length <= 1) return; // Keep at least one adult
    setMembers(members.filter((m) => m.id !== id));
  };

  const handleToggleSpecialNeed = (
    memberId: string,
    field: 'mobilityIssue' | 'requiresRefrigeration'
  ) => {
    setMembers(
      members.map((m) => {
        if (m.id !== memberId) return m;
        return {
          ...m,
          specialNeeds: {
            ...m.specialNeeds,
            [field]: !m.specialNeeds[field],
          },
        };
      })
    );
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: HouseholdProfile = {
      members,
      hasPets,
      petCount: hasPets ? petCount : 0,
      hasCompletedOnboarding: true,
    };
    updateHouseholdProfile(updated);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 600);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 overflow-y-auto backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="profiler-modal-title"
    >
      <div className="relative w-full max-w-2xl bg-white border border-[#D0D0D0] shadow-2xl rounded-none my-8 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-[#1B2A4A] text-white px-6 py-4 flex items-center justify-between border-b-2 border-[#8B1A1A]">
          <div>
            <div className="text-[10px] font-mono tracking-widest text-slate-300 uppercase">
              Domestic Resilience Profiler
            </div>
            <h2 id="profiler-modal-title" className="font-serif text-xl sm:text-2xl font-bold text-white mt-0.5">
              Household Configuration
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-300 hover:text-white p-1 rounded"
            aria-label="Close household profiler"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-[#1A1A1A]">
          {/* Explicit GDPR & Zero-PII Legal Notice */}
          <div className="bg-[#FAF9F5] border-2 border-emerald-700/40 p-4 space-y-1.5 text-xs text-[#222222]">
            <div className="flex items-center gap-2 font-bold text-emerald-950 uppercase tracking-wide">
              <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
              Statutory Privacy &amp; Data Minimisation Assurance
            </div>
            <p className="leading-relaxed text-[#333333]">
              UDSS collects <strong>NO email address, NO names, NO telephone numbers, and NO home addresses</strong> either centrally or on your device. Your household profile remains entirely device-local and anonymous, eliminating any GDPR footprint.
            </p>
          </div>

          <form onSubmit={handleSave} className="space-y-6">
            {/* Household Member Count & List */}
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#D0D0D0] pb-2">
                <div>
                  <h3 className="font-serif text-base font-bold text-[#1B2A4A]">
                    Household Composition ({members.length} {members.length === 1 ? 'member' : 'members'})
                  </h3>
                  <p className="text-xs text-[#666666]">
                    Calculates required water reserves, food portions, and individual grab bags.
                  </p>
                </div>

                {/* Add member button group */}
                <div className="flex flex-wrap items-center gap-1.5 text-xs">
                  <span className="font-semibold text-xs text-[#4A4A4A] mr-1">Add:</span>
                  <button
                    type="button"
                    onClick={() => handleAddMember('adult')}
                    className="px-2 py-1 bg-[#F5F5F0] hover:bg-[#EAEAE2] border border-[#D0D0D0] font-semibold text-[#1B2A4A] transition-colors"
                  >
                    + Adult
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAddMember('child')}
                    className="px-2 py-1 bg-[#F5F5F0] hover:bg-[#EAEAE2] border border-[#D0D0D0] font-semibold text-[#1B2A4A] transition-colors"
                  >
                    + Child
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAddMember('infant')}
                    className="px-2 py-1 bg-[#F5F5F0] hover:bg-[#EAEAE2] border border-[#D0D0D0] font-semibold text-[#1B2A4A] transition-colors"
                  >
                    + Infant
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAddMember('senior')}
                    className="px-2 py-1 bg-[#F5F5F0] hover:bg-[#EAEAE2] border border-[#D0D0D0] font-semibold text-[#1B2A4A] transition-colors"
                  >
                    + Senior
                  </button>
                </div>
              </div>

              {/* Members cards */}
              <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
                {members.map((member, idx) => (
                  <div
                    key={member.id}
                    className="p-3 border border-[#D0D0D0] bg-[#FAF9F6] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs font-bold text-[#1B2A4A] bg-[#EAEAE2] px-2 py-0.5 border border-[#D0D0D0]">
                        #{idx + 1}
                      </span>
                      <div>
                        <span className="font-semibold text-sm text-[#1B2A4A]">
                          {member.label}
                        </span>
                        <span className="text-[11px] text-[#666666] capitalize block font-mono">
                          {member.category}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {/* Special requirements toggles */}
                      <button
                        type="button"
                        onClick={() => handleToggleSpecialNeed(member.id, 'requiresRefrigeration')}
                        className={`px-2 py-1 border transition-colors inline-flex items-center gap-1 ${
                          member.specialNeeds.requiresRefrigeration
                            ? 'bg-blue-100 text-blue-900 border-blue-400 font-semibold'
                            : 'bg-white text-[#4A4A4A] border-[#D0D0D0] hover:bg-[#F5F5F0]'
                        }`}
                        title="Tick if this person depends on temperature-controlled / refrigerated medicines (e.g. insulin)"
                      >
                        <Snowflake className="w-3 h-3 text-blue-700" />
                        Refrigerated Meds
                      </button>

                      <button
                        type="button"
                        onClick={() => handleToggleSpecialNeed(member.id, 'mobilityIssue')}
                        className={`px-2 py-1 border transition-colors inline-flex items-center gap-1 ${
                          member.specialNeeds.mobilityIssue
                            ? 'bg-amber-100 text-amber-900 border-amber-400 font-semibold'
                            : 'bg-white text-[#4A4A4A] border-[#D0D0D0] hover:bg-[#F5F5F0]'
                        }`}
                        title="Tick if this person has limited mobility or needs evacuation assistance"
                      >
                        <HeartPulse className="w-3 h-3 text-amber-700" />
                        Mobility Support
                      </button>

                      {members.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveMember(member.id)}
                          className="p-1 text-[#8B1A1A] hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-colors"
                          title="Remove member"
                          aria-label={`Remove ${member.label}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pets Support */}
            <div className="border border-[#D0D0D0] p-4 bg-[#FAF9F5] space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <PawPrint className="w-4 h-4 text-[#1B2A4A]" />
                  <span className="font-serif font-bold text-sm text-[#1B2A4A]">
                    Household Pets or Domestic Animals
                  </span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasPets}
                    onChange={(e) => setHasPets(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#1B2A4A]"></div>
                </label>
              </div>

              {hasPets && (
                <div className="flex items-center gap-3 pt-2 text-xs">
                  <span className="text-[#333333]">Number of pets requiring food and water allocation:</span>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={petCount}
                    onChange={(e) => setPetCount(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-16 px-2 py-1 border border-[#D0D0D0] bg-white font-mono text-center font-bold text-[#1B2A4A]"
                  />
                </div>
              )}
            </div>

            {/* Submit & Close actions */}
            <div className="flex items-center justify-between border-t border-[#D0D0D0] pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#4A4A4A] bg-[#F5F5F0] hover:bg-[#EAEAE2]"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-white bg-[#1B2A4A] hover:bg-[#132039] border border-[#2D4373] transition-colors inline-flex items-center gap-2"
              >
                {savedSuccess ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-300" />
                    Profile Updated
                  </>
                ) : (
                  'Apply Household Profile'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
