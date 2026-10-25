'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  X,
  Printer,
  Phone,
  Wrench,
  Check,
  Download,
  Copy,
  Eye,
  FileText,
  AlertCircle,
  ShieldAlert
} from 'lucide-react';
import { EmergencyPlan, UtilityShutoffPlan, UserProgress } from '@/types/briefing';
import { updateEmergencyPlan, updateUtilityPlan } from '@/lib/storage';
import {
  executePrintWithFallback,
  downloadHtmlFile,
  downloadTextFile,
  buildCardHtml
} from '@/lib/safe-print';

interface EmergencyPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  progress: UserProgress;
}

export function EmergencyPlanModal({ isOpen, onClose, progress }: EmergencyPlanModalProps) {
  const [activeTab, setActiveTab] = useState<'emergency' | 'utility' | 'preview'>('emergency');
  const [previewSubTab, setPreviewSubTab] = useState<'emergency' | 'utility'>('utility');
  const [emergencyForm, setEmergencyForm] = useState<EmergencyPlan>(progress.emergencyPlan);
  const [utilityForm, setUtilityForm] = useState<UtilityShutoffPlan>(progress.utilityPlan);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [copiedSuccess, setCopiedSuccess] = useState(false);
  const [printNotice, setPrintNotice] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateEmergencyPlan(emergencyForm);
    updateUtilityPlan(utilityForm);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const getEmergencyPlanText = () => {
    return [
      '=============================================================',
      'UNIVERSAL DEFENCE AND SECURITY SOLUTIONS (UDSS)',
      'HOUSEHOLD EMERGENCY & CIVIL CONTINGENCY PLAN',
      '33 Cannon St, London EC4M 5SB',
      '=============================================================',
      `Household Prep ID: ${progress.prepId}`,
      `Date Generated: ${new Date().toLocaleDateString('en-GB')}`,
      '',
      '1. EMERGENCY CONTACTS',
      `   Primary Household Contact: ${emergencyForm.primaryContactName || 'Not specified'} (${emergencyForm.primaryContactPhone || 'No phone recorded'})`,
      `   Agreed Out-of-Area Contact: ${emergencyForm.outOfAreaContactName || 'Not specified'} (${emergencyForm.outOfAreaContactPhone || 'No phone recorded'})`,
      '',
      '2. HOUSEHOLD MEETING POINTS',
      `   Primary Meeting Point: ${emergencyForm.primaryMeetingPoint || 'Home front entrance'}`,
      `   Secondary Meeting Point: ${emergencyForm.secondaryMeetingPoint || 'Local community / parish hall'}`,
      `   Reunion Trigger Protocol: ${emergencyForm.meetingTriggerTime || 'Assemble within 2 hours of regional grid or network collapse'}`,
      '',
      '3. OFFLINE COMMUNICATIONS PROTOCOL',
      `   ${emergencyForm.offlineCommsProtocol || 'Prioritise SMS; monitor BBC Radio 4 on FM (92.4–94.6 MHz)'}`,
      '',
      '4. MEDICAL ESSENTIALS & SURGERY',
      `   GP Surgery: ${emergencyForm.gpSurgery || 'Not recorded'}`,
      `   Pharmacy: ${emergencyForm.localPharmacy || 'Not recorded'}`,
      `   Critical Prescriptions: ${emergencyForm.essentialPrescriptions || 'None specified'}`,
      '',
      'DURABILITY ADVISORY: If possible laminate cards.',
      '=============================================================',
    ].join('\n');
  };

  const getUtilityCardText = () => {
    return [
      '=============================================================',
      'UNIVERSAL DEFENCE AND SECURITY SOLUTIONS (UDSS)',
      'HOUSEHOLD UTILITY EMERGENCY SHUTOFF CARD',
      '33 Cannon St, London EC4M 5SB',
      '=============================================================',
      `Household Prep ID: ${progress.prepId}`,
      `Date Generated: ${new Date().toLocaleDateString('en-GB')}`,
      '',
      '1. MAINS WATER STOPCOCK',
      `   Location & Instructions: ${utilityForm.waterStopcockLocation || 'Under kitchen sink (brass turncock valve). Turn clockwise to isolate.'}`,
      '',
      '2. ELECTRICITY CONSUMER UNIT (MAIN FUSE BOX)',
      `   Location & Instructions: ${utilityForm.electricityConsumerUnitLocation || 'Hallway coats cupboard. Pull main master breaker down to isolate.'}`,
      '',
      '3. GAS EMERGENCY ISOLATION VALVE',
      `   Location & Instructions: ${utilityForm.gasMeterValveLocation || 'External gas meter box. Turn valve 90° perpendicular to pipe to isolate.'}`,
      '',
      '4. SPECIAL HAZARDS & HOUSEHOLD ACCESS NOTES',
      `   ${utilityForm.specialHazardsNotes || 'None recorded'}`,
      '',
      'DURABILITY ADVISORY: If possible laminate cards.',
      '=============================================================',
    ].join('\n');
  };

  const getEmergencyPlanHtml = () => {
    return buildCardHtml({
      title: 'HOUSEHOLD EMERGENCY & CIVIL CONTINGENCY PLAN',
      category: 'COMMUNICATIONS & OFF-GRID REUNION PROTOCOL',
      prepId: progress.prepId,
      fields: [
        {
          label: '1. Primary Household Contact',
          value: `${emergencyForm.primaryContactName || 'Not recorded'} (${emergencyForm.primaryContactPhone || 'No phone number'})`,
          hint: 'Immediate family member or cohabitant mobile contact.',
        },
        {
          label: '2. Agreed Out-of-Area Contact',
          value: `${emergencyForm.outOfAreaContactName || 'Not recorded'} (${emergencyForm.outOfAreaContactPhone || 'No phone number'})`,
          hint: 'Local cellular networks congest first during emergencies. Long-distance SMS routing remains more resilient.',
        },
        {
          label: '3. Household Meeting Points & Reunion Protocol',
          value: `Primary: ${emergencyForm.primaryMeetingPoint || 'Home'} | Secondary: ${emergencyForm.secondaryMeetingPoint || 'Local parish hall or library'}`,
          hint: emergencyForm.meetingTriggerTime || 'Assemble within 2 hours of regional grid or communications failure.',
        },
        {
          label: '4. Offline Communications Protocol',
          value: emergencyForm.offlineCommsProtocol || 'Prioritise SMS; monitor BBC Radio 4 on FM (92.4–94.6 MHz).',
        },
        {
          label: '5. Medical Surgery & Critical Prescriptions',
          value: `GP Surgery: ${emergencyForm.gpSurgery || 'Local Health Centre'} | Pharmacy: ${emergencyForm.localPharmacy || 'Local Chemist'}\nPrescriptions: ${emergencyForm.essentialPrescriptions || 'None specified'}`,
          hint: 'Keep a minimum 7–14 day physical supply of essential prescribed medication in your grab bag.',
        },
      ],
    });
  };

  const getUtilityCardHtml = () => {
    return buildCardHtml({
      title: 'HOUSEHOLD UTILITY EMERGENCY SHUTOFF CARD',
      category: 'DOMESTIC CRITICAL INFRASTRUCTURE',
      prepId: progress.prepId,
      fields: [
        {
          label: '1. Mains Water Stopcock Valve',
          value: utilityForm.waterStopcockLocation || 'Under kitchen sink (brass turncock valve). Turn clockwise to isolate.',
          hint: 'Turn clockwise to close. Vital during internal pipe bursts, flash floods, or municipal supply contamination.',
        },
        {
          label: '2. Electricity Consumer Unit (Main Fuse Box)',
          value: utilityForm.electricityConsumerUnitLocation || 'Hallway storage cupboard (top shelf left). Pull master switch down.',
          hint: 'Isolate prior to severe water ingress or before prolonged national power restoration to avoid power surge damage.',
        },
        {
          label: '3. Gas Emergency Isolation Valve',
          value: utilityForm.gasMeterValveLocation || 'External gas meter box on front exterior wall. Turn quarter-turn lever.',
          hint: 'Turn lever 90 degrees across the pipe. Never operate light switches or electrical items if smelling gas.',
        },
        {
          label: '4. Special Household Hazards & Access Instructions',
          value: utilityForm.specialHazardsNotes || 'None recorded',
          hint: 'Solar inverter shutoffs, emergency battery isolators, spare keys, or medical equipment priority notes.',
        },
      ],
    });
  };

  const currentKind = activeTab === 'preview' ? previewSubTab : activeTab;

  const handlePrint = () => {
    const isEmergency = currentKind === 'emergency';
    const htmlFileName = isEmergency
      ? 'UDSS-Household-Emergency-Plan.html'
      : 'UDSS-Utility-Shutoff-Card.html';
    const txtFileName = isEmergency
      ? 'UDSS-Household-Emergency-Plan.txt'
      : 'UDSS-Utility-Shutoff-Card.txt';
    const htmlContent = isEmergency ? getEmergencyPlanHtml() : getUtilityCardHtml();
    const txtContent = isEmergency ? getEmergencyPlanText() : getUtilityCardText();

    setPrintNotice(
      'Print menu requested. If your browser blocks popups inside this embedded window, open the downloaded card file to print directly.'
    );
    setTimeout(() => setPrintNotice(null), 8000);

    executePrintWithFallback(htmlFileName, htmlContent, txtContent);
  };

  const handleDownloadHtml = () => {
    const isEmergency = currentKind === 'emergency';
    const fileName = isEmergency
      ? 'UDSS-Household-Emergency-Plan.html'
      : 'UDSS-Utility-Shutoff-Card.html';
    const content = isEmergency ? getEmergencyPlanHtml() : getUtilityCardHtml();
    downloadHtmlFile(fileName, content);
    setPrintNotice('Printable HTML card downloaded. Open it in your browser to print on A4 or cardstock.');
    setTimeout(() => setPrintNotice(null), 6000);
  };

  const handleDownloadTxt = () => {
    const isEmergency = currentKind === 'emergency';
    const fileName = isEmergency
      ? 'UDSS-Household-Emergency-Plan.txt'
      : 'UDSS-Utility-Shutoff-Card.txt';
    const content = isEmergency ? getEmergencyPlanText() : getUtilityCardText();
    downloadTextFile(fileName, content);
  };

  const handleCopy = () => {
    const isEmergency = currentKind === 'emergency';
    const content = isEmergency ? getEmergencyPlanText() : getUtilityCardText();
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(content);
      setCopiedSuccess(true);
      setTimeout(() => setCopiedSuccess(false), 2500);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 overflow-y-auto backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="plan-modal-title"
    >
      <div className="relative w-full max-w-3xl bg-white border border-[#D0D0D0] shadow-2xl rounded-none my-8 max-h-[92vh] flex flex-col">
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
            className="text-slate-300 hover:text-white p-1 rounded transition-colors"
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
                ? 'border-[#1B2A4A] text-[#1B2A4A] bg-white font-bold'
                : 'border-transparent text-[#666666] hover:text-[#1B2A4A]'
            }`}
          >
            <Phone className="w-3.5 h-3.5" />
            1. Emergency Plan
          </button>
          <button
            onClick={() => setActiveTab('utility')}
            className={`py-3 px-4 border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'utility'
                ? 'border-[#1B2A4A] text-[#1B2A4A] bg-white font-bold'
                : 'border-transparent text-[#666666] hover:text-[#1B2A4A]'
            }`}
          >
            <Wrench className="w-3.5 h-3.5" />
            2. Utility Shutoff Card
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            className={`py-3 px-4 border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'preview'
                ? 'border-[#8B1A1A] text-[#8B1A1A] bg-white font-bold'
                : 'border-transparent text-[#666666] hover:text-[#8B1A1A]'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            3. Print &amp; Card Preview
          </button>
        </div>

        {/* Dynamic Notification Banner */}
        {printNotice && (
          <div className="bg-amber-50 border-b border-amber-200 px-6 py-2.5 flex items-start gap-2.5 text-xs text-amber-900">
            <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div className="flex-1 font-mono leading-relaxed">{printNotice}</div>
          </div>
        )}

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-[#1A1A1A] flex-1">
          {activeTab === 'emergency' && (
            <form onSubmit={handleSave} className="space-y-4">
              <div className="bg-[#FAF9F5] border-l-4 border-[#1B2A4A] p-3 text-xs text-[#333333]">
                Fill out your family communications protocol below. Once complete, print physical copies so children, adults, and carers carry a physical card when networks fail. <strong>If possible laminate cards</strong> to ensure durability against water and wear.
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
                    className="w-full px-3 py-1.5 text-xs border border-[#D0D0D0] bg-white mt-1.5"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1A1A1A] mb-1">
                    Agreed Out-of-Area Contact
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Relative / Friend out of county"
                    value={emergencyForm.outOfAreaContactName}
                    onChange={(e) => setEmergencyForm({ ...emergencyForm, outOfAreaContactName: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs border border-[#D0D0D0] bg-white"
                  />
                  <input
                    type="tel"
                    placeholder="e.g. 01632 960123"
                    value={emergencyForm.outOfAreaContactPhone}
                    onChange={(e) => setEmergencyForm({ ...emergencyForm, outOfAreaContactPhone: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs border border-[#D0D0D0] bg-white mt-1.5"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-[#1A1A1A] mb-1">
                    Primary Meeting Point
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Front doorstep of home"
                    value={emergencyForm.primaryMeetingPoint}
                    onChange={(e) => setEmergencyForm({ ...emergencyForm, primaryMeetingPoint: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs border border-[#D0D0D0] bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#1A1A1A] mb-1">
                    Secondary Meeting Point (if neighbourhood evacuated)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Parish church or community hall"
                    value={emergencyForm.secondaryMeetingPoint}
                    onChange={(e) => setEmergencyForm({ ...emergencyForm, secondaryMeetingPoint: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs border border-[#D0D0D0] bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1A1A1A] mb-1">
                  Reunion Trigger Protocol
                </label>
                <input
                  type="text"
                  placeholder="e.g. Meet at secondary point within 2 hours of regional grid or network collapse"
                  value={emergencyForm.meetingTriggerTime}
                  onChange={(e) => setEmergencyForm({ ...emergencyForm, meetingTriggerTime: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs border border-[#D0D0D0] bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1A1A1A] mb-1">
                  Offline Communications &amp; Radio Protocol
                </label>
                <input
                  type="text"
                  placeholder="e.g. Send SMS to out-of-area contact; monitor BBC Radio 4 at the top of every hour"
                  value={emergencyForm.offlineCommsProtocol}
                  onChange={(e) => setEmergencyForm({ ...emergencyForm, offlineCommsProtocol: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs border border-[#D0D0D0] bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-[#1A1A1A] mb-1">
                    GP Surgery / Medical Center
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. St Mary's Surgery"
                    value={emergencyForm.gpSurgery}
                    onChange={(e) => setEmergencyForm({ ...emergencyForm, gpSurgery: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs border border-[#D0D0D0] bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#1A1A1A] mb-1">
                    Local Pharmacy
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. High Street Pharmacy"
                    value={emergencyForm.localPharmacy}
                    onChange={(e) => setEmergencyForm({ ...emergencyForm, localPharmacy: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs border border-[#D0D0D0] bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#1A1A1A] mb-1">
                    Essential Prescriptions
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Insulin, Inhaler, Epipen"
                    value={emergencyForm.essentialPrescriptions}
                    onChange={(e) => setEmergencyForm({ ...emergencyForm, essentialPrescriptions: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs border border-[#D0D0D0] bg-white"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-white bg-[#1B2A4A] hover:bg-[#132039] border border-[#2D4373] transition-colors"
                >
                  Save Emergency Plan
                </button>
              </div>
            </form>
          )}

          {activeTab === 'utility' && (
            <form onSubmit={handleSave} className="space-y-4">
              <div className="bg-[#FAF9F5] border-l-4 border-amber-600 p-3 text-xs text-[#333333]">
                This card is designed to be printed and pinned to your meter cupboard, kitchen noticeboard, or by the front door so visitors, neighbours, or emergency responders can isolate home mains safely. <strong>If possible laminate cards</strong> to protect against moisture, grease, or pipe leaks.
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

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-white bg-[#1B2A4A] hover:bg-[#132039] border border-[#2D4373] transition-colors"
                >
                  Save Utility Card
                </button>
              </div>
            </form>
          )}

          {activeTab === 'preview' && (
            <div className="space-y-6">
              {/* Preview Sub-Navigation */}
              <div className="flex items-center justify-between border-b border-[#D0D0D0] pb-3">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider">
                  <span className="text-slate-500 font-mono text-[11px]">Select Card:</span>
                  <button
                    onClick={() => setPreviewSubTab('utility')}
                    className={`px-3 py-1 border transition-colors ${
                      previewSubTab === 'utility'
                        ? 'bg-[#1B2A4A] text-white border-[#1B2A4A]'
                        : 'bg-white text-[#1B2A4A] border-[#D0D0D0] hover:bg-[#F5F5F0]'
                    }`}
                  >
                    Utility Shutoff Card
                  </button>
                  <button
                    onClick={() => setPreviewSubTab('emergency')}
                    className={`px-3 py-1 border transition-colors ${
                      previewSubTab === 'emergency'
                        ? 'bg-[#1B2A4A] text-white border-[#1B2A4A]'
                        : 'bg-white text-[#1B2A4A] border-[#D0D0D0] hover:bg-[#F5F5F0]'
                    }`}
                  >
                    Emergency Reunion Plan
                  </button>
                </div>
              </div>

              {/* Lamination Guidance Banner */}
              <div className="bg-amber-50 border border-amber-300 p-3 flex items-center justify-between gap-3 text-xs text-amber-950 font-mono">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-[#8B1A1A] shrink-0" />
                  <span>
                    <strong>Durability Advisory:</strong> If possible laminate cards after printing to protect against water, adverse weather, and wallet wear.
                  </span>
                </div>
              </div>

              {/* Physical Card Mockup Display */}
              <div className="border-4 border-[#1B2A4A] p-6 sm:p-8 bg-white shadow-md space-y-6">
                <div className="border-b-4 border-[#8B1A1A] pb-3 flex flex-col sm:flex-row sm:items-baseline justify-between gap-3">
                  <div>
                    <div className="mb-2">
                      <Image
                        src="/assets/aistudio/Logo_6a1e58a5.webp"
                        alt="Universal Defence & Security Solutions"
                        width={200}
                        height={50}
                        referrerPolicy="no-referrer"
                        className="h-8 w-auto object-contain"
                      />
                    </div>
                    <span className="font-mono text-[10px] uppercase tracking-widest text-[#8B1A1A] font-bold block">
                      Civil Contingency Card
                    </span>
                    <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#1B2A4A] uppercase tracking-wide">
                      {previewSubTab === 'utility'
                        ? 'Household Utility Shutoff Card'
                        : 'Household Emergency & Contingency Plan'}
                    </h3>
                  </div>
                  <div className="font-mono text-xs text-[#4A4A4A] sm:text-right shrink-0">
                    <div>Prep ID: <strong className="text-[#1B2A4A]">{progress.prepId}</strong></div>
                    <div className="text-[10px] text-slate-500">33 Cannon St, London EC4M 5SB</div>
                  </div>
                </div>

                {previewSubTab === 'utility' ? (
                  <div className="space-y-4 text-xs">
                    <div className="p-3 bg-[#FAF9F5] border-l-4 border-[#1B2A4A]">
                      <div className="font-mono uppercase text-[11px] font-bold text-[#1B2A4A]">
                        1. Mains Water Stopcock Valve
                      </div>
                      <div className="text-sm font-semibold text-[#111] mt-0.5">
                        {utilityForm.waterStopcockLocation || 'Under kitchen sink on cold riser pipe. Turn clockwise to isolate.'}
                      </div>
                    </div>

                    <div className="p-3 bg-[#FAF9F5] border-l-4 border-[#1B2A4A]">
                      <div className="font-mono uppercase text-[11px] font-bold text-[#1B2A4A]">
                        2. Electricity Consumer Unit / Main Fuse Box
                      </div>
                      <div className="text-sm font-semibold text-[#111] mt-0.5">
                        {utilityForm.electricityConsumerUnitLocation || 'Hallway storage cupboard top shelf. Pull master switch down.'}
                      </div>
                    </div>

                    <div className="p-3 bg-[#FAF9F5] border-l-4 border-[#1B2A4A]">
                      <div className="font-mono uppercase text-[11px] font-bold text-[#1B2A4A]">
                        3. Gas Emergency Isolation Valve
                      </div>
                      <div className="text-sm font-semibold text-[#111] mt-0.5">
                        {utilityForm.gasMeterValveLocation || 'External gas meter box. Turn handle 90° perpendicular to pipe.'}
                      </div>
                    </div>

                    <div className="p-3 bg-[#FAF9F5] border-l-4 border-[#1B2A4A]">
                      <div className="font-mono uppercase text-[11px] font-bold text-[#1B2A4A]">
                        4. Special Hazards &amp; Access Instructions
                      </div>
                      <div className="text-sm font-semibold text-[#111] mt-0.5">
                        {utilityForm.specialHazardsNotes || 'None recorded'}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="p-3 bg-[#FAF9F5] border-l-4 border-[#1B2A4A]">
                        <div className="font-mono uppercase text-[11px] font-bold text-[#1B2A4A]">
                          Primary Contact
                        </div>
                        <div className="text-sm font-semibold text-[#111] mt-0.5">
                          {emergencyForm.primaryContactName || 'Partner / Parent'} ({emergencyForm.primaryContactPhone || '07700 900123'})
                        </div>
                      </div>

                      <div className="p-3 bg-[#FAF9F5] border-l-4 border-[#1B2A4A]">
                        <div className="font-mono uppercase text-[11px] font-bold text-[#1B2A4A]">
                          Out-of-Area Resilient Contact
                        </div>
                        <div className="text-sm font-semibold text-[#111] mt-0.5">
                          {emergencyForm.outOfAreaContactName || 'Out of County Relative'} ({emergencyForm.outOfAreaContactPhone || '01632 960123'})
                        </div>
                      </div>
                    </div>

                    <div className="p-3 bg-[#FAF9F5] border-l-4 border-[#1B2A4A]">
                      <div className="font-mono uppercase text-[11px] font-bold text-[#1B2A4A]">
                        Meeting Points &amp; Reunion Trigger
                      </div>
                      <div className="text-sm font-semibold text-[#111] mt-0.5">
                        Primary: {emergencyForm.primaryMeetingPoint || 'Home'} | Secondary: {emergencyForm.secondaryMeetingPoint || 'Parish Hall'}
                      </div>
                      <div className="text-xs text-[#555] mt-1 font-mono">
                        Rule: {emergencyForm.meetingTriggerTime || 'Assemble within 2 hours of regional grid failure'}
                      </div>
                    </div>

                    <div className="p-3 bg-[#FAF9F5] border-l-4 border-[#1B2A4A]">
                      <div className="font-mono uppercase text-[11px] font-bold text-[#1B2A4A]">
                        Offline Comms Protocol
                      </div>
                      <div className="text-sm font-semibold text-[#111] mt-0.5">
                        {emergencyForm.offlineCommsProtocol || 'Prioritise SMS; monitor BBC Radio 4 on FM (92.4–94.6 MHz)'}
                      </div>
                    </div>
                  </div>
                )}

                <div className="p-2.5 bg-[#FAF9F5] border border-dashed border-[#1B2A4A] text-[11px] font-mono text-[#1B2A4A] text-center font-medium">
                  PROTECTIVE MEASURE: If possible laminate cards
                </div>

                <div className="border-t border-[#D0D0D0] pt-3 flex items-center justify-between font-mono text-[10px] text-slate-500">
                  <span>UDSS Domestic Civil Contingency Programme</span>
                  <span>33 Cannon St, London EC4M 5SB</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Global Footer Actions */}
        <div className="bg-[#F5F5F0] border-t border-[#D0D0D0] px-6 py-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white bg-[#1B2A4A] hover:bg-[#132039] border border-[#1B2A4A] inline-flex items-center gap-2 shadow-xs transition-colors"
              title="Print document or download printable card"
            >
              <Printer className="w-4 h-4 text-amber-300" />
              Print {currentKind === 'emergency' ? 'Emergency Plan' : 'Utility Card'}
            </button>

            <button
              type="button"
              onClick={handleDownloadHtml}
              className="px-3.5 py-2 text-xs font-semibold uppercase tracking-wider text-[#1B2A4A] bg-white hover:bg-[#FAF9F5] border border-[#D0D0D0] inline-flex items-center gap-1.5 transition-colors"
              title="Download standalone HTML card with auto-print capability"
            >
              <Download className="w-3.5 h-3.5 text-[#8B1A1A]" />
              Download Printable Card (.html)
            </button>

            <button
              type="button"
              onClick={handleDownloadTxt}
              className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-[#4A4A4A] bg-white hover:bg-[#FAF9F5] border border-[#D0D0D0] inline-flex items-center gap-1.5 transition-colors"
              title="Download plain text file"
            >
              <FileText className="w-3.5 h-3.5" />
              .txt
            </button>

            <button
              type="button"
              onClick={handleCopy}
              className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-[#4A4A4A] bg-white hover:bg-[#FAF9F5] border border-[#D0D0D0] inline-flex items-center gap-1.5 transition-colors"
              title="Copy formatted text to clipboard"
            >
              {copiedSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-700" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  Copy Text
                </>
              )}
            </button>

            {savedSuccess && (
              <span className="text-xs text-emerald-800 font-semibold inline-flex items-center gap-1">
                <Check className="w-4 h-4 text-emerald-700" />
                Saved to Device
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold uppercase tracking-wider text-[#1B2A4A] hover:bg-[#EAEAE2] border border-[#D0D0D0] transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
