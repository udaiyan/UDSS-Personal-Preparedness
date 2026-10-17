'use client';

import React, { useState } from 'react';
import {
  X,
  Printer,
  FileText,
  Phone,
  MapPin,
  Clock,
  Radio,
  Pill,
  Wrench,
  ShieldCheck,
  Check,
  Download
} from 'lucide-react';
import { EmergencyPlan, UtilityShutoffPlan, UserProgress } from '@/types/briefing';
import { updateEmergencyPlan, updateUtilityPlan } from '@/lib/storage';
import { safePrintOrDownload, downloadTextFile } from '@/lib/safe-print';

interface EmergencyPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  progress: UserProgress;
}

export function EmergencyPlanModal({ isOpen, onClose, progress }: EmergencyPlanModalProps) {
  const [activeTab, setActiveTab] = useState<'emergency' | 'utility'>('emergency');
  const [emergencyForm, setEmergencyForm] = useState<EmergencyPlan>(progress.emergencyPlan);
  const [utilityForm, setUtilityForm] = useState<UtilityShutoffPlan>(progress.utilityPlan);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateEmergencyPlan(emergencyForm);
    updateUtilityPlan(utilityForm);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const getEmergencyPlanText = () => {
    return [
      '=============================================================',
      'UNIVERSAL DEFENCE AND SECURITY SOLUTIONS (UDSS)',
      'HOUSEHOLD EMERGENCY & CIVIL CONTINGENCY PLAN',
      '33 Cannon St, London EC4M 5SB',
      '=============================================================',
      `Household Prep ID: ${progress.prepId}`,
      '',
      '1. EMERGENCY CONTACTS',
      `   Primary Household Contact: ${emergencyForm.primaryContactName || 'Not specified'} (${emergencyForm.primaryContactPhone || 'No phone'})`,
      `   Agreed Out-of-Area Contact: ${emergencyForm.outOfAreaContactName || 'Not specified'} (${emergencyForm.outOfAreaContactPhone || 'No phone'})`,
      '',
      '2. HOUSEHOLD MEETING POINTS',
      `   Primary Meeting Point: ${emergencyForm.primaryMeetingPoint || 'Home'}`,
      `   Secondary Meeting Point: ${emergencyForm.secondaryMeetingPoint || 'Local parish/library'}`,
      `   Trigger Rule: ${emergencyForm.meetingTriggerTime || 'Within 2 hours of regional grid failure'}`,
      '',
      '3. OFFLINE COMMUNICATIONS PROTOCOL',
      `   ${emergencyForm.offlineCommsProtocol || 'Prioritise SMS; monitor BBC Radio 4 on FM'}`,
      '',
      '4. MEDICAL SURGERY & CRITICAL PRESCRIPTIONS',
      `   GP Surgery: ${emergencyForm.gpSurgery || 'Not specified'}`,
      `   Pharmacy: ${emergencyForm.localPharmacy || 'Not specified'}`,
      `   Essential Prescriptions: ${emergencyForm.essentialPrescriptions || 'None specified'}`,
      '=============================================================',
    ].join('\n');
  };

  const getUtilityCardText = () => {
    return [
      '=============================================================',
      'UNIVERSAL DEFENCE AND SECURITY SOLUTIONS (UDSS)',
      'HOUSEHOLD UTILITY EMERGENCY ISOLATION CARD',
      '33 Cannon St, London EC4M 5SB',
      '=============================================================',
      `Household Prep ID: ${progress.prepId}`,
      '',
      '1. MAINS WATER STOPCOCK',
      `   Location & Operation: ${utilityForm.waterStopcockLocation || 'Under kitchen sink'}`,
      '',
      '2. ELECTRICITY CONSUMER UNIT (MAIN FUSE BOX)',
      `   Location & Operation: ${utilityForm.electricityConsumerUnitLocation || 'Main consumer box in hallway cupboard'}`,
      '',
      '3. GAS EMERGENCY ISOLATION VALVE',
      `   Location & Operation: ${utilityForm.gasMeterValveLocation || 'External gas meter box'}`,
      '',
      '4. SPECIAL HAZARDS & HOUSEHOLD ACCESS NOTES',
      `   ${utilityForm.specialHazardsNotes || 'None recorded'}`,
      '=============================================================',
    ].join('\n');
  };

  const handlePrint = () => {
    const fileName =
      activeTab === 'emergency'
        ? 'UDSS-Household-Emergency-Plan.txt'
        : 'UDSS-Utility-Shutoff-Card.txt';
    const textGetter = activeTab === 'emergency' ? getEmergencyPlanText : getUtilityCardText;
    safePrintOrDownload(fileName, textGetter);
  };

  const handleDownload = () => {
    const fileName =
      activeTab === 'emergency'
        ? 'UDSS-Household-Emergency-Plan.txt'
        : 'UDSS-Utility-Shutoff-Card.txt';
    const content = activeTab === 'emergency' ? getEmergencyPlanText() : getUtilityCardText();
    downloadTextFile(fileName, content);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 overflow-y-auto backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="plan-modal-title"
    >
      <div className="relative w-full max-w-3xl bg-white border border-[#D0D0D0] shadow-2xl rounded-none my-8 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-[#1B2A4A] text-white px-6 py-4 flex items-center justify-between border-b-2 border-[#8B1A1A]">
          <div>
            <div className="text-[10px] font-mono tracking-widest text-slate-300 uppercase">
              Domestic Civil Contingency
            </div>
            <h2 id="plan-modal-title" className="font-serif text-xl sm:text-2xl font-bold text-white mt-0.5">
              Household Emergency &amp; Utility Shutoff Plans
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-300 hover:text-white p-1 rounded"
            aria-label="Close emergency plan dialog"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Plan Switcher Tabs */}
        <div className="flex border-b border-[#D0D0D0] bg-[#FAF9F5] px-6 text-xs font-semibold uppercase tracking-wider">
          <button
            onClick={() => setActiveTab('emergency')}
            className={`py-3 px-4 border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'emergency'
                ? 'border-[#1B2A4A] text-[#1B2A4A] bg-white'
                : 'border-transparent text-[#666666] hover:text-[#1B2A4A]'
            }`}
          >
            <Phone className="w-3.5 h-3.5" />
            1. Household Emergency Plan
          </button>
          <button
            onClick={() => setActiveTab('utility')}
            className={`py-3 px-4 border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'utility'
                ? 'border-[#1B2A4A] text-[#1B2A4A] bg-white'
                : 'border-transparent text-[#666666] hover:text-[#1B2A4A]'
            }`}
          >
            <Wrench className="w-3.5 h-3.5" />
            2. Utility Shutoff Information Card
          </button>
        </div>

        {/* Content Body */}
        <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-6 text-[#1A1A1A]">
          {activeTab === 'emergency' && (
            <div className="space-y-4">
              <div className="bg-[#FAF9F5] border-l-4 border-[#1B2A4A] p-3 text-xs text-[#333333]">
                Fill out your family communications protocol below. Once completed, print physical copies so children, adults, and carers carry a physical card when networks fail.
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#1A1A1A] mb-1">
                    Primary Household Contact
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Partner / Parent (Mobile)"
                    value={emergencyForm.primaryContactName}
                    onChange={(e) => setEmergencyForm({ ...emergencyForm, primaryContactName: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs border border-[#D0D0D0] bg-white"
                  />
                  <input
                    type="tel"
                    placeholder="e.g. 07700 900123"
                    value={emergencyForm.primaryContactPhone}
                    onChange={(e) => setEmergencyForm({ ...emergencyForm, primaryContactPhone: e.target.value })}
                    className="w-full mt-1.5 px-3 py-1.5 text-xs border border-[#D0D0D0] bg-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1A1A1A] mb-1">
                    Agreed Out-of-Area Contact Person
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Uncle Arthur in Yorkshire"
                    value={emergencyForm.outOfAreaContactName}
                    onChange={(e) => setEmergencyForm({ ...emergencyForm, outOfAreaContactName: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs border border-[#D0D0D0] bg-white"
                  />
                  <input
                    type="tel"
                    placeholder="e.g. 01904 600123"
                    value={emergencyForm.outOfAreaContactPhone}
                    onChange={(e) => setEmergencyForm({ ...emergencyForm, outOfAreaContactPhone: e.target.value })}
                    className="w-full mt-1.5 px-3 py-1.5 text-xs border border-[#D0D0D0] bg-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#1A1A1A] mb-1">
                    Primary Meeting Point (Home / Local)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Front porch / Home dining room"
                    value={emergencyForm.primaryMeetingPoint}
                    onChange={(e) => setEmergencyForm({ ...emergencyForm, primaryMeetingPoint: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs border border-[#D0D0D0] bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1A1A1A] mb-1">
                    Secondary Meeting Point (Out-of-Neighbourhood)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. St Peter's Church Hall / Town Library"
                    value={emergencyForm.secondaryMeetingPoint}
                    onChange={(e) => setEmergencyForm({ ...emergencyForm, secondaryMeetingPoint: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs border border-[#D0D0D0] bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#1A1A1A] mb-1">
                    Meeting Trigger Time / Incident Rule
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 2 hours after grid failure or school closure"
                    value={emergencyForm.meetingTriggerTime}
                    onChange={(e) => setEmergencyForm({ ...emergencyForm, meetingTriggerTime: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs border border-[#D0D0D0] bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1A1A1A] mb-1">
                    Offline Communications Protocol
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. SMS only; check BBC Radio 4 on FM at top of each hour"
                    value={emergencyForm.offlineCommsProtocol}
                    onChange={(e) => setEmergencyForm({ ...emergencyForm, offlineCommsProtocol: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs border border-[#D0D0D0] bg-white"
                  />
                </div>
              </div>

              {/* Medical Information */}
              <div className="border-t border-[#D0D0D0] pt-4 space-y-3">
                <h4 className="font-serif text-sm font-bold text-[#1B2A4A] flex items-center gap-1.5">
                  <Pill className="w-4 h-4 text-[#8B1A1A]" />
                  Medical Contacts &amp; Essential Prescriptions
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#1A1A1A] mb-1">
                      GP Surgery &amp; Phone
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Riverside Medical Practice (020 7946 0123)"
                      value={emergencyForm.gpSurgery}
                      onChange={(e) => setEmergencyForm({ ...emergencyForm, gpSurgery: e.target.value })}
                      className="w-full px-3 py-1.5 text-xs border border-[#D0D0D0] bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1A1A1A] mb-1">
                      Local Dispensing Pharmacy
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Boots High Street (020 7946 0456)"
                      value={emergencyForm.localPharmacy}
                      onChange={(e) => setEmergencyForm({ ...emergencyForm, localPharmacy: e.target.value })}
                      className="w-full px-3 py-1.5 text-xs border border-[#D0D0D0] bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1A1A1A] mb-1">
                    Life-Critical Daily Prescriptions (Insulin, Cardiac, Epilepsy, Inhalers)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Insulin Glargine 20 units; Salbutamol inhaler; Ramipril 5mg"
                    value={emergencyForm.essentialPrescriptions}
                    onChange={(e) => setEmergencyForm({ ...emergencyForm, essentialPrescriptions: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs border border-[#D0D0D0] bg-white"
                  />
                  <span className="text-[10px] text-[#666666] mt-0.5 block">
                    Distinguish essential prescriptions that must never lapse from routine over-the-counter supplements.
                  </span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'utility' && (
            <div className="space-y-4">
              <div className="bg-[#FAF9F5] border-l-4 border-amber-600 p-3 text-xs text-[#333333]">
                This card is designed to be printed and pinned to your meter cupboard, kitchen noticeboard, or by the front door so visitors, neighbours, or emergency responders can isolate home mains safely.
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1A1A1A] mb-1">
                  Mains Water Stopcock Location &amp; Instructions
                </label>
                <input
                  type="text"
                  placeholder="e.g. Under kitchen sink on cold riser pipe. Turn clockwise to isolate."
                  value={utilityForm.waterStopcockLocation}
                  onChange={(e) => setUtilityForm({ ...utilityForm, waterStopcockLocation: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-[#D0D0D0] bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1A1A1A] mb-1">
                  Electricity Consumer Unit / Main Fuse Box Location
                </label>
                <input
                  type="text"
                  placeholder="e.g. Hallway coats cupboard on top shelf. Pull red master switch down to cut mains."
                  value={utilityForm.electricityConsumerUnitLocation}
                  onChange={(e) => setUtilityForm({ ...utilityForm, electricityConsumerUnitLocation: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-[#D0D0D0] bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1A1A1A] mb-1">
                  Gas Meter Emergency Isolation Valve Location
                </label>
                <input
                  type="text"
                  placeholder="e.g. Front garden exterior brown box. Turn handle 90 degrees across pipe to isolate."
                  value={utilityForm.gasMeterValveLocation}
                  onChange={(e) => setUtilityForm({ ...utilityForm, gasMeterValveLocation: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-[#D0D0D0] bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1A1A1A] mb-1">
                  Special Access Instructions or Household Hazards
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Spare meter key hanging inside utility cupboard; dog in rear garden; loft ladder requires pull cord."
                  value={utilityForm.specialHazardsNotes}
                  onChange={(e) => setUtilityForm({ ...utilityForm, specialHazardsNotes: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-[#D0D0D0] bg-white"
                />
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-4 border-t border-[#D0D0D0]">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handlePrint}
                className="px-3.5 py-2 text-xs font-semibold uppercase tracking-wider text-[#1B2A4A] bg-[#F5F5F0] hover:bg-[#EAEAE2] border border-[#D0D0D0] inline-flex items-center gap-1.5 transition-colors"
                title="Print physical document (safe export)"
              >
                <Printer className="w-3.5 h-3.5" />
                Print {activeTab === 'emergency' ? 'Plan' : 'Card'}
              </button>

              <button
                type="button"
                onClick={handleDownload}
                className="px-3.5 py-2 text-xs font-semibold uppercase tracking-wider text-[#1B2A4A] bg-[#F5F5F0] hover:bg-[#EAEAE2] border border-[#D0D0D0] inline-flex items-center gap-1.5 transition-colors"
                title="Download formatted text file directly"
              >
                <Download className="w-3.5 h-3.5" />
                Download (.txt)
              </button>

              {savedSuccess && (
                <span className="text-xs text-emerald-800 font-semibold inline-flex items-center gap-1">
                  <Check className="w-4 h-4 text-emerald-700" />
                  Saved to Device
                </span>
              )}
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-white bg-[#1B2A4A] hover:bg-[#132039] border border-[#2D4373]"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
