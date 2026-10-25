'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ShieldCheck,
  Lock,
  ArrowLeft,
  Download,
  Trash2,
  FileText,
  CheckCircle,
  ExternalLink,
  AlertTriangle,
  UserCheck
} from 'lucide-react';
import { useUserProgress, purgeAllUserData, exportAllUserDataJson } from '@/lib/storage';
import { downloadTextFile } from '@/lib/safe-print';

export default function PrivacyPage() {
  const progress = useUserProgress();
  const [showConfirmPurge, setShowConfirmPurge] = useState(false);
  const [purgeSuccess, setPurgeSuccess] = useState(false);
  const [exportedSuccess, setExportedSuccess] = useState(false);

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
        (m, i) => `   - Member ${i + 1}: ${m.label} (${m.category})`
      ),
      `   Has Pets:          ${progress.householdProfile.hasPets ? `Yes (${progress.householdProfile.petCount} pets)` : 'No'}`,
      '',
      '2. EMERGENCY COMMUNICATIONS PROTOCOL',
      `   Primary Contact:   ${progress.emergencyPlan.primaryContactName || 'None'} (${progress.emergencyPlan.primaryContactPhone || 'None'})`,
      `   Out-of-Area:       ${progress.emergencyPlan.outOfAreaContactName || 'None'} (${progress.emergencyPlan.outOfAreaContactPhone || 'None'})`,
      `   Primary Meeting:   ${progress.emergencyPlan.primaryMeetingPoint || 'None'}`,
      `   Secondary Meeting: ${progress.emergencyPlan.secondaryMeetingPoint || 'None'}`,
      '',
      '3. DOMESTIC UTILITY SHUTOFF RECORDS',
      `   Water Stopcock:    ${progress.utilityPlan.waterStopcockLocation || 'None'}`,
      `   Main Breaker:      ${progress.utilityPlan.electricityConsumerUnitLocation || 'None'}`,
      `   Gas Valve:         ${progress.utilityPlan.gasMeterValveLocation || 'None'}`,
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
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-[#F5F5F0] text-[#1A1A1A] flex flex-col font-sans">
      {/* Top Navigation Bar */}
      <header className="bg-[#1B2A4A] text-white border-b-4 border-[#8B1A1A] py-3.5 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-white/95 px-2.5 py-1 rounded shadow-xs border border-white/20">
              <Image
                src="/assets/aistudio/Logo_6a1e58a5.webp"
                alt="Universal Defence & Security Solutions"
                width={160}
                height={40}
                priority
                referrerPolicy="no-referrer"
                className="h-7 w-auto object-contain"
              />
            </div>
            <div className="border-l border-white/20 pl-3 hidden sm:block">
              <span className="block text-[10px] font-mono tracking-widest uppercase text-amber-300 font-bold">
                Civil Resilience
              </span>
              <p className="text-xs text-slate-200 font-sans tracking-wide">
                Civilian Preparedness Assistant
              </p>
            </div>
          </div>

          <Link
            href="/"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-white bg-white/10 hover:bg-white/20 border border-white/20 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Return to App
          </Link>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8 flex-1">
        {/* Title Header */}
        <div className="border-b-2 border-[#1B2A4A] pb-4 space-y-1">
          <div className="flex items-center gap-2 text-[#8B1A1A] font-mono text-xs uppercase font-bold tracking-wider">
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            Statutory Data Protection Charter
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1B2A4A]">
            UK &amp; EU GDPR Compliance &amp; Privacy Policy
          </h1>
          <p className="text-sm text-[#4A4A4A]">
            Universal Defence and Security Solutions Ltd &bull; Issued for Civilian Preparedness Assistant
          </p>
        </div>

        {/* Notifications */}
        {exportedSuccess && (
          <div className="bg-emerald-50 border-2 border-emerald-400 p-3.5 text-xs font-mono text-emerald-900 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>Complete personal data export downloaded successfully pursuant to GDPR Article 20.</span>
          </div>
        )}

        {purgeSuccess && (
          <div className="bg-rose-50 border-2 border-rose-400 p-3.5 text-xs font-mono text-rose-900 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-rose-700 shrink-0" />
            <span>All local household contingency records have been permanently erased from this browser.</span>
          </div>
        )}

        {/* Privacy by Design Highlight */}
        <div className="bg-white border-l-4 border-emerald-600 p-6 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-emerald-900 font-bold font-serif text-lg">
            <ShieldCheck className="w-6 h-6 text-emerald-700" />
            Privacy-by-Design Architecture (Zero Remote Storage)
          </div>
          <p className="text-sm text-[#333333] leading-relaxed">
            The UDSS Civilian Preparedness Assistant is architected with complete privacy-by-design (Article 25 UK GDPR). Unlike cloud-based platforms, <strong>no household compositions, contact lists, medical prescription notes, or utility shutoff locations are uploaded to or retained by UDSS central servers</strong>.
          </p>
          <p className="text-sm text-[#333333] leading-relaxed">
            All data entered into this application is processed and stored exclusively inside your browser&rsquo;s encrypted local storage on your physical machine. In the event of a wide-area telecommunications blackout or power cut, your preparedness records remain entirely accessible offline without remote server dependencies.
          </p>
        </div>

        {/* Interactive Rights Console */}
        <div className="bg-white border border-[#D0D0D0] p-6 space-y-6">
          <div className="border-b border-[#D0D0D0] pb-3">
            <h2 className="font-serif text-xl font-bold text-[#1B2A4A]">
              Interactive Data Subject Rights Console (Articles 15–20)
            </h2>
            <p className="text-xs text-[#555] mt-1 font-mono">
              Directly exercise your statutory GDPR rights on this device without submitting email tickets.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Export */}
            <div className="border border-[#D0D0D0] p-4 bg-[#FAF9F5] space-y-2.5">
              <div className="flex items-center gap-2 font-serif font-bold text-sm text-[#1B2A4A]">
                <Download className="w-4 h-4 text-[#1B2A4A]" />
                Right of Access &amp; Portability (Art. 15 &amp; 20)
              </div>
              <p className="text-xs text-[#4A4A4A] leading-relaxed">
                Obtain a complete machine-readable copy of your household records currently held under Prep ID <strong className="font-mono text-[#1B2A4A]">{progress.prepId}</strong>.
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                <button
                  onClick={handleExportJson}
                  className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-white bg-[#1B2A4A] hover:bg-[#132039] transition-colors inline-flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  Export .JSON
                </button>
                <button
                  onClick={handleExportText}
                  className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#1B2A4A] bg-white hover:bg-[#FAF9F5] border border-[#D0D0D0] transition-colors inline-flex items-center gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5" />
                  Export .TXT
                </button>
              </div>
            </div>

            {/* Erasure */}
            <div className="border border-rose-300 p-4 bg-rose-50/30 space-y-2.5">
              <div className="flex items-center gap-2 font-serif font-bold text-sm text-[#8B1A1A]">
                <Trash2 className="w-4 h-4 text-rose-700" />
                Right to Erasure / &ldquo;Right to be Forgotten&rdquo; (Art. 17)
              </div>
              <p className="text-xs text-[#4A4A4A] leading-relaxed">
                Permanently purge all household data, contact cards, and private access keys stored on this device.
              </p>

              {showConfirmPurge ? (
                <div className="p-3 bg-white border border-rose-600 space-y-2">
                  <span className="block text-xs font-bold text-rose-900">Are you sure? This cannot be undone.</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handlePurge}
                      className="px-2.5 py-1 text-xs font-bold uppercase text-white bg-[#8B1A1A] hover:bg-[#721515]"
                    >
                      Yes, Purge All
                    </button>
                    <button
                      onClick={() => setShowConfirmPurge(false)}
                      className="px-2.5 py-1 text-xs font-semibold uppercase text-[#333] bg-[#EAEAE2]"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowConfirmPurge(true)}
                  className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#8B1A1A] bg-white border border-rose-300 hover:bg-rose-100/50 transition-colors inline-flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5 text-rose-700" />
                  Erase All Data
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Detailed Statutory Legal Terms */}
        <div className="bg-white border border-[#D0D0D0] p-6 space-y-6 text-sm text-[#222222] leading-relaxed">
          <section className="space-y-2">
            <h2 className="font-serif text-lg font-bold text-[#1B2A4A]">
              1. Data Controller Identification
            </h2>
            <p className="text-xs sm:text-sm text-[#333333]">
              The Data Controller responsible for this application under the UK General Data Protection Regulation and the Data Protection Act 2018 is:
            </p>
            <div className="p-3 bg-[#FAF9F5] border border-[#D0D0D0] font-mono text-xs text-[#1B2A4A]">
              Universal Defence and Security Solutions Ltd (UDSS)<br />
              33 Cannon St, London EC4M 5SB, United Kingdom<br />
              Company Registered in England &amp; Wales<br />
              Corporate Inquiries: laurence.postgate@universal-defence.com
            </div>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-lg font-bold text-[#1B2A4A]">
              2. Lawful Basis for Processing (Article 6 UK GDPR)
            </h2>
            <p className="text-xs sm:text-sm text-[#333333]">
              We process personal information under the following legal bases:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm text-[#333333]">
              <li>
                <strong>Legitimate Interests (Art. 6(1)(f)):</strong> Processing is strictly necessary to calculate personalized household readiness scores, water/food survival requirements, and offline family reunion instructions requested directly by the user.
              </li>
              <li>
                <strong>Data Minimisation (Art. 5(1)(c)):</strong> No extraneous personal identifiable information (PII) such as full names, email addresses, payment numbers, or national insurance numbers is collected or stored.
              </li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-lg font-bold text-[#1B2A4A]">
              3. Cookies &amp; Browser Storage (PECR Compliance)
            </h2>
            <p className="text-xs sm:text-sm text-[#333333]">
              This application complies strictly with the Privacy and Electronic Communications Regulations (PECR):
            </p>
            <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm text-[#333333]">
              <li><strong>Zero Advertising Cookies:</strong> We do not deploy third-party advertising cookies, retargeting pixels, or behavioral tracking beacons.</li>
              <li><strong>Essential Browser Storage:</strong> HTML5 localStorage is used exclusively to retain user contingency settings, grab bag completion status, and emergency cards between sessions.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-lg font-bold text-[#1B2A4A]">
              4. International Transfers &amp; Third-Party Disclosures
            </h2>
            <p className="text-xs sm:text-sm text-[#333333]">
              Because all household records remain on your local hardware, <strong>no international transfers of personal data occur</strong> under Chapter V of the GDPR. Your data is not sold, rented, monetized, or shared with commercial entities or advertisers.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-lg font-bold text-[#1B2A4A]">
              5. Right to Lodge a Complaint
            </h2>
            <p className="text-xs sm:text-sm text-[#333333]">
              If you have concerns regarding data protection or wish to seek independent regulatory advice, you possess the statutory right to lodge a complaint with the UK supervisory authority:
            </p>
            <div className="p-3 bg-[#FAF9F5] border border-[#D0D0D0] text-xs text-[#333333]">
              <strong>Information Commissioner&rsquo;s Office (ICO)</strong><br />
              Wycliffe House, Water Lane, Wilmslow, Cheshire, SK9 5AF<br />
              Helpline: 0303 123 1113 &bull; Website:{' '}
              <a
                href="https://ico.org.uk"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#1B2A4A] underline font-medium"
              >
                ico.org.uk
              </a>
            </div>
          </section>
        </div>

        {/* Bottom Back Button */}
        <div className="pt-2 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-white bg-[#1B2A4A] hover:bg-[#132039] transition-colors shadow-xs"
          >
            <ArrowLeft className="w-4 h-4" />
            Return to Civilian Preparedness Assistant
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#0E1726] text-slate-400 py-6 px-4 sm:px-6 border-t-2 border-[#1B2A4A] text-xs text-center">
        <p>&copy; 2026 Universal Defence and Security Solutions Ltd &bull; 33 Cannon St, London EC4M 5SB &bull; All Rights Reserved.</p>
      </footer>
    </div>
  );
}
