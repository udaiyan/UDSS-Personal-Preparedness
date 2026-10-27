'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  X,
  ShieldCheck,
  Lock,
  Download,
  Trash2,
  FileText,
  CheckCircle,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  UserCheck,
  KeyRound,
  RotateCcw
} from 'lucide-react';
import { UserProgress } from '@/types/briefing';
import { exportAllUserDataJson, purgeAllUserData } from '@/lib/storage';
import { downloadTextFile } from '@/lib/safe-print';

interface GDPRPrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
  progress: UserProgress;
  onOpenProfiler?: () => void;
  onOpenEmergencyPlan?: () => void;
}

export function GDPRPrivacyModal({
  isOpen,
  onClose,
  progress,
  onOpenProfiler,
  onOpenEmergencyPlan,
}: GDPRPrivacyModalProps) {
  const [activeTab, setActiveTab] = useState<'policy' | 'rights' | 'audit'>('policy');
  const [showConfirmPurge, setShowConfirmPurge] = useState(false);
  const [purgeSuccess, setPurgeSuccess] = useState(false);
  const [exportedSuccess, setExportedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleExportJson = () => {
    const jsonStr = exportAllUserDataJson();
    const fileName = `UDSS-GDPR-Data-Export-${progress.prepId.replace(/\s+/g, '-')}.json`;
    downloadTextFile(fileName, jsonStr);
    setExportedSuccess(true);
    setTimeout(() => setExportedSuccess(false), 3000);
  };

  const handleExportText = () => {
    const lines = [
      '========================================================================',
      'UNIVERSAL DEFENCE AND SECURITY SOLUTIONS (UDSS)',
      'CIVILIAN PREPAREDNESS ASSISTANT — GDPR DATA PORTABILITY EXPORT',
      '33 Cannon St, London EC4M 5SB, United Kingdom',
      '========================================================================',
      `Export Timestamp:     ${new Date().toISOString()}`,
      `Household Prep ID:    ${progress.prepId}`,
      `Cryptographic Token:  ${progress.recoveryToken}`,
      `Data Architecture:    100% Client-Side Local Storage (No Remote Tracking)`,
      '========================================================================',
      '',
      '1. HOUSEHOLD PROFILE',
      `   Total Members:     ${progress.householdProfile.members.length}`,
      ...progress.householdProfile.members.map(
        (m, i) => `   - Member ${i + 1}: ${m.label} (${m.category}) ${m.specialNeeds.dietaryRestrictions ? `[Diet: ${m.specialNeeds.dietaryRestrictions}]` : ''}`
      ),
      `   Has Pets:          ${progress.householdProfile.hasPets ? `Yes (${progress.householdProfile.petCount} pets)` : 'No'}`,
      '',
      '2. EMERGENCY COMMUNICATIONS PROTOCOL',
      `   Primary Contact:   ${progress.emergencyPlan.primaryContactName || 'None'} (${progress.emergencyPlan.primaryContactPhone || 'None'})`,
      `   Out-of-Area:       ${progress.emergencyPlan.outOfAreaContactName || 'None'} (${progress.emergencyPlan.outOfAreaContactPhone || 'None'})`,
      `   Primary Meeting:   ${progress.emergencyPlan.primaryMeetingPoint || 'None'}`,
      `   Secondary Meeting: ${progress.emergencyPlan.secondaryMeetingPoint || 'None'}`,
      `   Offline Comms:     ${progress.emergencyPlan.offlineCommsProtocol || 'None'}`,
      `   GP Surgery:        ${progress.emergencyPlan.gpSurgery || 'None'}`,
      `   Prescriptions:     ${progress.emergencyPlan.essentialPrescriptions || 'None'}`,
      '',
      '3. DOMESTIC UTILITY SHUTOFF RECORDS',
      `   Water Stopcock:    ${progress.utilityPlan.waterStopcockLocation || 'None'}`,
      `   Main Breaker:      ${progress.utilityPlan.electricityConsumerUnitLocation || 'None'}`,
      `   Gas Valve:         ${progress.utilityPlan.gasMeterValveLocation || 'None'}`,
      `   Special Hazards:   ${progress.utilityPlan.specialHazardsNotes || 'None'}`,
      '',
      '4. PREPAREDNESS CHECKLIST COMPLETIONS',
      `   Completed Items:   ${progress.completedChecklistIds.length} items logged`,
      '',
      '========================================================================',
      'STATUTORY COMPLIANCE NOTE:',
      'This record was generated pursuant to Article 15 (Right of Access) and',
      'Article 20 (Right to Data Portability) of UK GDPR.',
      'UDSS does not retain copies of this data on any remote server.',
      '========================================================================',
    ];
    const textContent = lines.join('\n');
    const fileName = `UDSS-GDPR-Data-Export-${progress.prepId.replace(/\s+/g, '-')}.txt`;
    downloadTextFile(fileName, textContent);
    setExportedSuccess(true);
    setTimeout(() => setExportedSuccess(false), 3000);
  };

  const handlePurge = () => {
    purgeAllUserData();
    setShowConfirmPurge(false);
    setPurgeSuccess(true);
    setTimeout(() => {
      setPurgeSuccess(false);
      onClose();
    }, 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 overflow-y-auto backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="gdpr-modal-title"
    >
      <div className="relative w-full max-w-3xl bg-white border border-[#D0D0D0] shadow-2xl rounded-none my-6 max-h-[92vh] flex flex-col">
        {/* Header Bar */}
        <div className="bg-[#1B2A4A] text-white px-6 py-4 flex items-center justify-between border-b-2 border-[#8B1A1A] shrink-0">
          <div className="flex items-center gap-3">
            <div className="bg-white/95 px-2.5 py-1 rounded shadow-xs border border-white/20">
              <Image
                src="/assets/aistudio/Logo_6a1e58a5.webp"
                alt="UDSS Logo"
                width={140}
                height={35}
                referrerPolicy="no-referrer"
                className="h-6 w-auto object-contain"
              />
            </div>
            <div>
              <div className="text-[10px] font-mono tracking-widest text-slate-300 uppercase flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Data Protection &amp; Privacy Charter
              </div>
              <h2 id="gdpr-modal-title" className="font-serif text-lg sm:text-xl font-bold text-white">
                UK &amp; EU GDPR Compliance
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-300 hover:text-white p-1 rounded focus:outline-none focus:ring-2 focus:ring-white transition-colors"
            aria-label="Close GDPR modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="bg-[#FAF9F5] border-b border-[#D0D0D0] px-6 pt-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider shrink-0 overflow-x-auto">
          <button
            onClick={() => setActiveTab('policy')}
            className={`pb-2.5 px-3 border-b-2 transition-colors ${
              activeTab === 'policy'
                ? 'border-[#1B2A4A] text-[#1B2A4A]'
                : 'border-transparent text-slate-600 hover:text-[#1B2A4A]'
            }`}
          >
            1. Privacy Policy &amp; Lawful Basis
          </button>
          <button
            onClick={() => setActiveTab('rights')}
            className={`pb-2.5 px-3 border-b-2 transition-colors ${
              activeTab === 'rights'
                ? 'border-[#1B2A4A] text-[#1B2A4A]'
                : 'border-transparent text-slate-600 hover:text-[#1B2A4A]'
            }`}
          >
            2. Your Data Rights (Articles 15–20)
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`pb-2.5 px-3 border-b-2 transition-colors ${
              activeTab === 'audit'
                ? 'border-[#1B2A4A] text-[#1B2A4A]'
                : 'border-transparent text-slate-600 hover:text-[#1B2A4A]'
            }`}
          >
            3. Live Stored Data Audit
          </button>
        </div>

        {/* Success Alert Banner */}
        {exportedSuccess && (
          <div className="bg-emerald-50 border-b border-emerald-300 px-6 py-2.5 flex items-center gap-2 text-xs font-mono text-emerald-900 shrink-0">
            <CheckCircle className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>Complete personal data export downloaded successfully pursuant to GDPR Article 20.</span>
          </div>
        )}

        {purgeSuccess && (
          <div className="bg-rose-50 border-b border-rose-300 px-6 py-2.5 flex items-center gap-2 text-xs font-mono text-rose-900 shrink-0">
            <CheckCircle className="w-4 h-4 text-rose-700 shrink-0" />
            <span>All local household records, cryptographic tokens, and cached settings have been permanently erased.</span>
          </div>
        )}

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-[#1A1A1A] flex-1">
          {activeTab === 'policy' && (
            <div className="space-y-6 text-sm">
              {/* Privacy by Design Highlight Box */}
              <div className="bg-[#FAF9F5] border-l-4 border-emerald-600 p-4 space-y-2">
                <div className="flex items-center gap-2 text-emerald-900 font-bold font-serif text-base">
                  <ShieldCheck className="w-5 h-5 text-emerald-700" />
                  Privacy by Design Architecture (Zero Remote Storage)
                </div>
                <p className="text-xs text-[#333333] leading-relaxed">
                  Unlike traditional web services, the UDSS Civilian Preparedness Assistant operates on a strict <strong>Privacy-by-Design</strong> principle (Article 25 UK GDPR). All household profiles, medical prescription notes, emergency contact numbers, and utility shutoff instructions are <strong>stored exclusively within your device&rsquo;s browser local storage</strong> using client-side encryption. No personal data is ever transmitted to, retained by, or accessible on remote UDSS servers.
                </p>
              </div>

              {/* Statutory Disclosure Table */}
              <div className="border border-[#D0D0D0] overflow-hidden">
                <div className="bg-[#1B2A4A] text-white px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider">
                  Statutory Data Controller Information
                </div>
                <div className="divide-y divide-[#E5E5E0] text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-3 p-3 bg-white">
                    <span className="font-semibold text-[#1B2A4A]">Data Controller:</span>
                    <span className="sm:col-span-2 text-[#333333]">Universal Defence and Security Solutions Ltd (UDSS)</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 p-3 bg-[#FAF9F6]">
                    <span className="font-semibold text-[#1B2A4A]">Registered Address:</span>
                    <span className="sm:col-span-2 text-[#333333]">33 Cannon St, London EC4M 5SB, United Kingdom</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 p-3 bg-white">
                    <span className="font-semibold text-[#1B2A4A]">Applicable Regulations:</span>
                    <span className="sm:col-span-2 text-[#333333]">UK General Data Protection Regulation (UK GDPR), Data Protection Act 2018 (DPA 2018), EU GDPR Regulation 2016/679, and PECR.</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 p-3 bg-[#FAF9F6]">
                    <span className="font-semibold text-[#1B2A4A]">Lawful Basis (Art. 6):</span>
                    <span className="sm:col-span-2 text-[#333333]">
                      <strong>Legitimate Interests &amp; Explicit User Request:</strong> Local processing is strictly necessary to calculate household contingency needs, generate emergency offline cards, and track survival supplies requested by the user.
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 p-3 bg-white">
                    <span className="font-semibold text-[#1B2A4A]">Third-Party Tracking:</span>
                    <span className="sm:col-span-2 text-emerald-800 font-semibold">
                      Zero. No advertising cookies, tracking pixels, cross-site trackers, or third-party profiling scripts are loaded or permitted.
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 p-3 bg-[#FAF9F6]">
                    <span className="font-semibold text-[#1B2A4A]">Supervisory Authority:</span>
                    <span className="sm:col-span-2 text-[#333333]">
                      Information Commissioner&rsquo;s Office (ICO), Wycliffe House, Water Lane, Wilmslow, SK9 5AF (ico.org.uk).
                    </span>
                  </div>
                </div>
              </div>

              {/* Policy Sections */}
              <div className="space-y-4 text-xs text-[#333333] leading-relaxed">
                <div>
                  <h3 className="font-serif text-sm font-bold text-[#1B2A4A] mb-1">
                    1. Data Collected &amp; Purpose Specification
                  </h3>
                  <p>
                    When using the application, you may input household details (number of adults, children, infants, pets), emergency reunion points, out-of-area relative contact numbers, utility shutoff notes, and food/water reserves. This information is processed exclusively client-side to dynamically generate personal grab bag lists, emergency cards, and readiness scores.
                  </p>
                </div>

                <div>
                  <h3 className="font-serif text-sm font-bold text-[#1B2A4A] mb-1">
                    2. Cookies and Local Storage Posture
                  </h3>
                  <p>
                    Under the Privacy and Electronic Communications Regulations (PECR), this service uses <em>strictly essential browser storage</em> (HTML5 localStorage) to persist your contingency records between browser refreshes and enable full offline functionality during national electrical or telecommunications collapse. No marketing, advertising, or cross-site tracking cookies are used.
                  </p>
                </div>

                <div>
                  <h3 className="font-serif text-sm font-bold text-[#1B2A4A] mb-1">
                    3. Data Retention and Deletion
                  </h3>
                  <p>
                    Because all records reside on your local device, data retention is entirely under your control. You may update or delete your information at any time, or trigger complete data erasure via the <strong>Data Rights</strong> tab. Clearing your browser&rsquo;s cache or local storage will also remove all records immediately.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'rights' && (
            <div className="space-y-6 text-xs text-[#222222]">
              <div className="bg-[#FAF9F5] border-l-4 border-[#1B2A4A] p-4 text-xs text-[#333333] leading-relaxed">
                Under Articles 15 through 22 of the UK &amp; EU GDPR, you possess statutory rights over your personal data. Because UDSS holds no copy of your data on central servers, you can exercise these rights directly and instantaneously on this device using the controls below:
              </div>

              {/* Rights Interactive Grid */}
              <div className="space-y-4">
                {/* Right of Access & Portability */}
                <div className="border border-[#D0D0D0] p-4 bg-white space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Download className="w-4 h-4 text-[#1B2A4A]" />
                      <h3 className="font-serif text-sm font-bold text-[#1B2A4A]">
                        Article 15 (Access) &amp; Article 20 (Data Portability)
                      </h3>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-800 bg-emerald-100 px-2 py-0.5 border border-emerald-300 font-semibold">
                      Instant Self-Service
                    </span>
                  </div>
                  <p className="text-xs text-[#4A4A4A] leading-relaxed">
                    Download an unadulterated, machine-readable export of all household profiles, communications protocols, utility plans, and checklist logs currently stored on this device.
                  </p>
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <button
                      onClick={handleExportJson}
                      className="px-3.5 py-1.5 font-semibold uppercase tracking-wider text-white bg-[#1B2A4A] hover:bg-[#132039] border border-[#1B2A4A] transition-colors inline-flex items-center gap-1.5 shadow-xs"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Export Data (.json)
                    </button>
                    <button
                      onClick={handleExportText}
                      className="px-3.5 py-1.5 font-semibold uppercase tracking-wider text-[#1B2A4A] bg-[#FAF9F5] hover:bg-[#F0F0EA] border border-[#D0D0D0] transition-colors inline-flex items-center gap-1.5"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      Export Plain Text (.txt)
                    </button>
                  </div>
                </div>

                {/* Right to Rectification */}
                <div className="border border-[#D0D0D0] p-4 bg-white space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <UserCheck className="w-4 h-4 text-[#1B2A4A]" />
                      <h3 className="font-serif text-sm font-bold text-[#1B2A4A]">
                        Article 16 (Right to Rectification)
                      </h3>
                    </div>
                    <span className="text-[10px] font-mono text-slate-600 bg-slate-100 px-2 py-0.5 border border-slate-300">
                      Editable Anytime
                    </span>
                  </div>
                  <p className="text-xs text-[#4A4A4A] leading-relaxed">
                    You have the right to rectify inaccurate or outdated contingency records. Modify your household composition, emergency contact phone numbers, or shutoff notes at any time:
                  </p>
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    {onOpenProfiler && (
                      <button
                        onClick={onOpenProfiler}
                        className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#1B2A4A] bg-white border border-[#D0D0D0] hover:bg-[#FAF9F5] transition-colors"
                      >
                        Edit Household Profile &rarr;
                      </button>
                    )}
                    {onOpenEmergencyPlan && (
                      <button
                        onClick={onOpenEmergencyPlan}
                        className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#1B2A4A] bg-white border border-[#D0D0D0] hover:bg-[#FAF9F5] transition-colors"
                      >
                        Print Emergency &amp; Utility Cards &rarr;
                      </button>
                    )}
                  </div>
                </div>

                {/* Right to Erasure / Right to be Forgotten */}
                <div className="border border-rose-300 p-4 bg-rose-50/40 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Trash2 className="w-4 h-4 text-[#8B1A1A]" />
                      <h3 className="font-serif text-sm font-bold text-[#8B1A1A]">
                        Article 17 (Right to Erasure / &ldquo;Right to be Forgotten&rdquo;)
                      </h3>
                    </div>
                    <span className="text-[10px] font-mono text-rose-800 bg-rose-100 px-2 py-0.5 border border-rose-300 font-semibold">
                      Permanent Purge
                    </span>
                  </div>
                  <p className="text-xs text-[#4A4A4A] leading-relaxed">
                    Permanently delete all personal preparedness data, household profile records, emergency communications notes, and cryptographic tokens stored on this device.
                  </p>

                  {showConfirmPurge ? (
                    <div className="p-3 bg-white border-2 border-rose-600 space-y-2">
                      <div className="flex items-center gap-2 text-rose-900 font-bold text-xs">
                        <AlertTriangle className="w-4 h-4 text-rose-600" />
                        Are you certain you want to permanently erase all records?
                      </div>
                      <p className="text-[11px] text-[#555]">
                        This operation is irreversible. Your household checklist, contact cards, and private access token will be completely wiped from this browser.
                      </p>
                      <div className="flex items-center gap-2 pt-1">
                        <button
                          onClick={handlePurge}
                          className="px-3 py-1 text-xs font-bold uppercase tracking-wider text-white bg-[#8B1A1A] hover:bg-[#721515] transition-colors"
                        >
                          Confirm &amp; Purge Everything
                        </button>
                        <button
                          onClick={() => setShowConfirmPurge(false)}
                          className="px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#4A4A4A] bg-[#FAF9F5] border border-[#D0D0D0] hover:bg-white"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowConfirmPurge(true)}
                      className="px-3.5 py-1.5 font-semibold uppercase tracking-wider text-[#8B1A1A] bg-white border border-rose-300 hover:bg-rose-100/50 transition-colors inline-flex items-center gap-1.5"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-rose-700" />
                      Erase All Stored Data (Article 17)
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'audit' && (
            <div className="space-y-4 text-xs">
              <div className="bg-[#FAF9F5] border-l-4 border-[#1B2A4A] p-4 text-xs text-[#333333]">
                Transparency inspect tool: Below is an exact readout of every data field currently held in your device&rsquo;s browser storage under Prep ID <strong className="font-mono text-[#1B2A4A]">{progress.prepId}</strong>.
              </div>

              <div className="border border-[#D0D0D0] bg-slate-900 text-slate-100 p-4 font-mono text-[11px] overflow-x-auto max-h-80 rounded-none space-y-1">
                <pre>{exportAllUserDataJson()}</pre>
              </div>

              <div className="flex items-center justify-between text-slate-500 font-mono text-[11px] pt-1">
                <span>Cryptographic Key ID: {progress.recoveryToken.substring(0, 12)}...</span>
                <span>Storage Key: udss_personal_preparedness_v2</span>
              </div>
            </div>
          )}
        </div>

        {/* Global Footer Actions */}
        <div className="bg-[#F5F5F0] border-t border-[#D0D0D0] px-6 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="text-[11px] font-mono text-slate-500 text-center sm:text-left">
            Universal Defence and Security Solutions Ltd &bull; Registered in England &amp; Wales
          </div>
          <button
            onClick={onClose}
            className="px-5 py-1.5 text-xs font-semibold uppercase tracking-wider text-white bg-[#1B2A4A] hover:bg-[#132039] border border-[#1B2A4A] transition-colors"
          >
            Close Privacy Charter
          </button>
        </div>
      </div>
    </div>
  );
}
