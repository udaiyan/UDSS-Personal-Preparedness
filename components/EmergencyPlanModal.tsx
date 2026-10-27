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
  FileText,
  AlertCircle,
  ShieldCheck,
  ShieldAlert,
  PenTool
} from 'lucide-react';
import { UserProgress } from '@/types/briefing';
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
  const [activeTab, setActiveTab] = useState<'emergency' | 'utility'>('emergency');
  const [copiedSuccess, setCopiedSuccess] = useState(false);
  const [printNotice, setPrintNotice] = useState<string | null>(null);

  if (!isOpen) return null;

  const getEmergencyPlanText = () => {
    return [
      '========================================================================',
      'UNIVERSAL DEFENCE AND SECURITY SOLUTIONS (UDSS)',
      'HOUSEHOLD EMERGENCY & REUNION PLAN (PRINT & PEN TEMPLATE)',
      '33 Cannon St, London EC4M 5SB',
      '========================================================================',
      `Household Prep ID: ${progress.prepId}`,
      `Date Issued: ${new Date().toLocaleDateString('en-GB')}`,
      '',
      'INSTRUCTIONS FOR USE:',
      'This card is uneditable online to safeguard your personal privacy.',
      'Print this template and write in your family details by hand with a pen.',
      'Carry one physical copy in your wallet/grab bag and keep one at home.',
      '',
      '------------------------------------------------------------------------',
      '1. PRIMARY HOUSEHOLD CONTACT (Next of Kin / Partner / Parent)',
      '------------------------------------------------------------------------',
      '   Name:         _______________________________________________________',
      '   Mobile Tel:   _______________________________________________________',
      '   Daytime Tel:  _______________________________________________________',
      '',
      '------------------------------------------------------------------------',
      '2. AGREED OUT-OF-AREA RESILIENT CONTACT',
      '------------------------------------------------------------------------',
      '   Name:         _______________________________________________________',
      '   Town/County:  _______________________________________________________',
      '   Mobile Tel:   _______________________________________________________',
      '   * Contingency Protocol: Out-of-area SMS text messages route reliably',
      '     when local voice networks congest during wide-area power outages.',
      '',
      '------------------------------------------------------------------------',
      '3. HOUSEHOLD MEETING POINTS & REUNION PROTOCOL',
      '------------------------------------------------------------------------',
      '   Primary Meeting Point (Front of home / garden gate):',
      '   _____________________________________________________________________',
      '',
      '   Secondary Meeting Point (Parish hall / community hub if evacuated):',
      '   _____________________________________________________________________',
      '',
      '   Reunion Trigger Protocol:',
      '   Assemble at secondary meeting point within 2 hours if cellular towers',
      '   or regional electrical grid fails.',
      '',
      '------------------------------------------------------------------------',
      '4. OFFLINE COMMUNICATIONS & EMERGENCY BROADCASTS',
      '------------------------------------------------------------------------',
      '   National Frequency: BBC Radio 4 on 92.4–94.6 MHz FM',
      '   Local BBC Station:  ______________________________ MHz FM',
      '   Listen Window:      Top of every hour (:00) for official COBR updates',
      '   Battery Discipline: Phones in Ultra Low Power; SMS only; calls < 20s',
      '',
      '------------------------------------------------------------------------',
      '5. MEDICAL SURGERY & CRITICAL HEALTH DETAILS',
      '------------------------------------------------------------------------',
      '   GP Surgery & Tel:   _________________________________________________',
      '   Local Chemist/Tel:  _________________________________________________',
      '   Essential Meds:     _________________________________________________',
      '   Urgent Health Note: _________________________________________________',
      '',
      '========================================================================',
      'DURABILITY ADVISORY: If possible laminate cards after writing with pen.',
      'UDSS Domestic Civil Contingency Programme • 33 Cannon St, London EC4M 5SB',
      '========================================================================',
    ].join('\n');
  };

  const getUtilityCardText = () => {
    return [
      '========================================================================',
      'UNIVERSAL DEFENCE AND SECURITY SOLUTIONS (UDSS)',
      'HOUSEHOLD UTILITY EMERGENCY SHUTOFF CARD (PRINT & PEN TEMPLATE)',
      '33 Cannon St, London EC4M 5SB',
      '========================================================================',
      `Household Prep ID: ${progress.prepId}`,
      `Date Issued: ${new Date().toLocaleDateString('en-GB')}`,
      '',
      'INSTRUCTIONS FOR USE:',
      'This card is uneditable online to safeguard your home infrastructure data.',
      'Print this template and write in your utility locations with a pen.',
      'Pin this card inside your meter cupboard or utility space.',
      '',
      '------------------------------------------------------------------------',
      '1. MAINS WATER INTERNAL STOPCOCK VALVE',
      '------------------------------------------------------------------------',
      '   Location in Home:  __________________________________________________',
      '   (e.g. Under kitchen sink on cold riser pipe / front hallway cupboard)',
      '   Standard Action:   Turn brass turncock clockwise until hand-tight to',
      '                      isolate supply before flash floods or burst pipes.',
      '',
      '------------------------------------------------------------------------',
      '2. ELECTRICITY CONSUMER UNIT (MAIN FUSE BOX / MASTER BREAKER)',
      '------------------------------------------------------------------------',
      '   Location in Home:  __________________________________________________',
      '   (e.g. Hallway storage cupboard on top shelf / under stairs)',
      '   Standard Action:   Pull main master breaker switch down to OFF before',
      '                      water enters home or before major grid reconnection.',
      '',
      '------------------------------------------------------------------------',
      '3. GAS EMERGENCY ISOLATION VALVE',
      '------------------------------------------------------------------------',
      '   Location in Home:  __________________________________________________',
      '   (e.g. External white/brown meter box on exterior front wall)',
      '   Standard Action:   Turn quarter-turn brass handle 90° across pipe.',
      '   CRITICAL SAFETY:   IF YOU SMELL GAS: Do NOT touch light switches or',
      '                      ignite naked flames. Ventilate and evacuate.',
      '',
      '------------------------------------------------------------------------',
      '4. SPECIAL HOUSEHOLD HAZARDS & ACCESS INSTRUCTIONS',
      '------------------------------------------------------------------------',
      '   Solar / Battery Isolator: ___________________________________________',
      '   Spare Meter Key Location: ___________________________________________',
      '   Special Access / Pet Note: __________________________________________',
      '',
      '------------------------------------------------------------------------',
      '5. STATUTORY UK EMERGENCY HOTLINE NUMBERS',
      '------------------------------------------------------------------------',
      '   Emergency Services (Life-threatening / Fire / Police / Ambulance): 999',
      '   NHS Non-Emergency Urgent Medical Advice: 111',
      '   National Gas Emergency (Free 24/7 gas leak reporting line): 0800 111 999',
      '   National Power Cut Emergency Service (Free 24/7 line): 105',
      '   Environment Agency Floodline (24-hour flood warning line): 0345 988 1188',
      '',
      '========================================================================',
      'DURABILITY ADVISORY: If possible laminate cards after writing with pen.',
      'UDSS Domestic Civil Contingency Programme • 33 Cannon St, London EC4M 5SB',
      '========================================================================',
    ].join('\n');
  };

  const getEmergencyPlanHtml = () => {
    return buildCardHtml({
      title: 'HOUSEHOLD EMERGENCY & REUNION PLAN (PEN TEMPLATE)',
      category: 'COMMUNICATIONS & OFF-GRID REUNION PROTOCOL',
      prepId: progress.prepId,
      fields: [
        {
          label: '1. Primary Household Contact (Next of Kin / Parent / Partner)',
          value: 'Name: ___________________________________  Tel: ___________________________________',
          hint: 'Fill in with a pen. Carry one physical copy in your wallet or grab bag.',
        },
        {
          label: '2. Agreed Out-of-Area Resilient Contact',
          value: 'Name & Location: ________________________  Tel: ___________________________________',
          hint: 'Out-of-county relative or friend. SMS routing succeeds when local cell towers saturate.',
        },
        {
          label: '3. Household Meeting Points & Reunion Protocol',
          value: 'Primary: ________________________________  Secondary: _____________________________',
          hint: 'Reunion rule: Assemble at secondary meeting point within 2 hours if communications or grid fails.',
        },
        {
          label: '4. Offline Communications Protocol',
          value: 'BBC Radio 4 (92.4–94.6 MHz FM) • Listen at top of the hour (:00) for official COBR directives.',
          hint: 'Local BBC Station: _____________________ MHz FM • Keep phone battery on low-power mode; SMS only.',
        },
        {
          label: '5. Medical Surgery & Critical Prescriptions',
          value: 'GP Surgery: _____________________________  Pharmacy: ______________________________\nCritical Prescriptions: ___________________________________________________________',
          hint: 'Maintain 7-14 days of vital medication in your grab bag with written paper prescription slips.',
        },
      ],
    });
  };

  const getUtilityCardHtml = () => {
    return buildCardHtml({
      title: 'HOUSEHOLD UTILITY EMERGENCY SHUTOFF CARD (PEN TEMPLATE)',
      category: 'DOMESTIC CRITICAL INFRASTRUCTURE',
      prepId: progress.prepId,
      fields: [
        {
          label: '1. Mains Water Stopcock Valve',
          value: 'Location: _________________________________________________________________________\nProcedure: Turn brass turncock clockwise until hand-tight to isolate supply.',
          hint: 'Isolate immediately during internal burst pipes, flash floods, or contaminated municipal supply.',
        },
        {
          label: '2. Electricity Consumer Unit (Main Fuse Box)',
          value: 'Location: _________________________________________________________________________\nProcedure: Pull main red/black master switch down to OFF to isolate domestic circuits.',
          hint: 'Isolate before floodwater enters home or prior to major grid power reconnection to avoid surges.',
        },
        {
          label: '3. Gas Emergency Isolation Valve',
          value: 'Location: _________________________________________________________________________\nProcedure: Turn quarter-turn lever 90 degrees across pipe (perpendicular to pipe).',
          hint: 'IF SMELLING GAS: Do NOT touch light switches or naked flames. Evacuate immediately.',
        },
        {
          label: '4. Critical UK Emergency Hotlines (Pre-Printed)',
          value: 'Emergency (Police/Fire/Ambulance): 999  •  NHS Urgent Medical: 111\nGas Emergency: 0800 111 999  •  Power Cuts: 105  •  Floodline: 0345 988 1188',
          hint: 'Direct statutory freephone contingency lines operating 24 hours daily.',
        },
        {
          label: '5. Special Access Instructions & Home Hazards',
          value: 'Notes: ___________________________________________________________________________',
          hint: 'Solar inverter shutoff, battery storage location, spare keys, or pet locations.',
        },
      ],
    });
  };

  const handlePrint = () => {
    const isEmergency = activeTab === 'emergency';
    const htmlFileName = isEmergency
      ? 'UDSS-Household-Emergency-Plan-Template.html'
      : 'UDSS-Utility-Shutoff-Card-Template.html';
    const txtFileName = isEmergency
      ? 'UDSS-Household-Emergency-Plan-Template.txt'
      : 'UDSS-Utility-Shutoff-Card-Template.txt';
    const htmlContent = isEmergency ? getEmergencyPlanHtml() : getUtilityCardHtml();
    const txtContent = isEmergency ? getEmergencyPlanText() : getUtilityCardText();

    setPrintNotice(
      'Print menu requested. If your browser restricts printing inside this window, open the downloaded template file to print directly on A4 paper or cardstock.'
    );
    setTimeout(() => setPrintNotice(null), 8000);

    executePrintWithFallback(htmlFileName, htmlContent, txtContent);
  };

  const handleDownloadHtml = () => {
    const isEmergency = activeTab === 'emergency';
    const fileName = isEmergency
      ? 'UDSS-Household-Emergency-Plan-Template.html'
      : 'UDSS-Utility-Shutoff-Card-Template.html';
    const content = isEmergency ? getEmergencyPlanHtml() : getUtilityCardHtml();
    downloadHtmlFile(fileName, content);
    setPrintNotice('Printable HTML card downloaded. Open it in any browser and print onto A4 or cardstock to complete with a pen.');
    setTimeout(() => setPrintNotice(null), 6000);
  };

  const handleDownloadTxt = () => {
    const isEmergency = activeTab === 'emergency';
    const fileName = isEmergency
      ? 'UDSS-Household-Emergency-Plan-Template.txt'
      : 'UDSS-Utility-Shutoff-Card-Template.txt';
    const content = isEmergency ? getEmergencyPlanText() : getUtilityCardText();
    downloadTextFile(fileName, content);
  };

  const handleCopy = () => {
    const isEmergency = activeTab === 'emergency';
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
            <div className="text-[10px] font-mono tracking-widest text-slate-300 uppercase flex items-center gap-1.5">
              <span>Domestic Civil Contingency</span>
              <span>•</span>
              <span className="text-amber-300 font-semibold inline-flex items-center gap-1">
                <PenTool className="w-3 h-3" />
                Physical Print &amp; Pen Template
              </span>
            </div>
            <h2 id="plan-modal-title" className="font-serif text-xl sm:text-2xl font-bold text-white mt-0.5">
              Household Emergency &amp; Utility Shutoff Cards
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
            1. Emergency &amp; Reunion Plan (Print &amp; Pen)
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
            2. Utility Shutoff Card (Print &amp; Pen)
          </button>
        </div>

        {/* Notification Banner */}
        {printNotice && (
          <div className="bg-amber-50 border-b border-amber-200 px-6 py-2.5 flex items-start gap-2.5 text-xs text-amber-900">
            <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div className="flex-1 font-mono leading-relaxed">{printNotice}</div>
          </div>
        )}

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-[#1A1A1A] flex-1">
          {/* Privacy & Zero-Data Protocol Guarantee Callout */}
          <div className="bg-[#FAF9F5] border-l-4 border-emerald-600 p-4 text-xs leading-relaxed space-y-1.5 shadow-2xs">
            <div className="font-semibold text-emerald-950 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>Zero Digital Data Collection Guarantee • Uneditable Online</span>
            </div>
            <p className="text-[#333333]">
              To protect your family privacy and home security, <strong>this card is intentionally uneditable online</strong>. We do not store, process, or save any names, phone numbers, or utility shutoff locations in your browser or online. Simply click <strong>Print Card</strong> below to print out the official template, fill in the blank lines with a pen, and keep copies in your grab bag and home.
            </p>
          </div>

          {/* Lamination Guidance Banner */}
          <div className="bg-amber-50 border border-amber-300 p-3 flex items-center justify-between gap-3 text-xs text-amber-950 font-mono">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-[#8B1A1A] shrink-0" />
              <span>
                <strong>Durability Advisory:</strong> If possible laminate cards after writing with a pen to protect against moisture, grease, and pocket wear.
              </span>
            </div>
          </div>

          {/* Physical Card Mockup Display (Uneditable, Hand-Fillable Pen Card) */}
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
                  Official Civil Contingency Template • Complete with Pen
                </span>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#1B2A4A] uppercase tracking-wide">
                  {activeTab === 'emergency'
                    ? 'Household Emergency & Reunion Plan'
                    : 'Household Utility Emergency Shutoff Card'}
                </h3>
              </div>
              <div className="font-mono text-xs text-[#4A4A4A] sm:text-right shrink-0">
                <div>Prep ID: <strong className="text-[#1B2A4A]">{progress.prepId}</strong></div>
                <div className="text-[10px] text-slate-500">33 Cannon St, London EC4M 5SB</div>
              </div>
            </div>

            {activeTab === 'emergency' ? (
              <div className="space-y-4 text-xs">
                {/* 1. Primary Household Contact */}
                <div className="p-3.5 bg-[#FAF9F5] border-l-4 border-[#1B2A4A] space-y-2">
                  <div className="font-mono uppercase text-[11px] font-bold text-[#1B2A4A]">
                    1. Primary Household Contact (Next of Kin / Partner / Parent)
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-slate-600 font-mono text-[11px] block">Contact Full Name:</span>
                      <div className="h-7 border-b-2 border-dashed border-[#1B2A4A] flex items-end font-mono text-xs text-slate-400">
                        write name here...
                      </div>
                    </div>
                    <div>
                      <span className="text-slate-600 font-mono text-[11px] block">Mobile Telephone Number:</span>
                      <div className="h-7 border-b-2 border-dashed border-[#1B2A4A] flex items-end font-mono text-xs text-slate-400">
                        07...
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Out-of-Area Resilient Contact */}
                <div className="p-3.5 bg-[#FAF9F5] border-l-4 border-[#1B2A4A] space-y-2">
                  <div className="font-mono uppercase text-[11px] font-bold text-[#1B2A4A]">
                    2. Agreed Out-of-Area Resilient Contact (Relative/Friend outside the region)
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-slate-600 font-mono text-[11px] block">Contact Name &amp; Town:</span>
                      <div className="h-7 border-b-2 border-dashed border-[#1B2A4A] flex items-end font-mono text-xs text-slate-400">
                        name &amp; county...
                      </div>
                    </div>
                    <div>
                      <span className="text-slate-600 font-mono text-[11px] block">Telephone Number:</span>
                      <div className="h-7 border-b-2 border-dashed border-[#1B2A4A] flex items-end font-mono text-xs text-slate-400">
                        phone number...
                      </div>
                    </div>
                  </div>
                  <p className="text-[11px] text-[#555] font-mono leading-tight">
                    * Contingency Rule: Out-of-area SMS messages route reliably when local voice cell towers saturate.
                  </p>
                </div>

                {/* 3. Meeting Points & Reunion Protocol */}
                <div className="p-3.5 bg-[#FAF9F5] border-l-4 border-[#1B2A4A] space-y-2">
                  <div className="font-mono uppercase text-[11px] font-bold text-[#1B2A4A]">
                    3. Household Meeting Points &amp; Reunion Protocol
                  </div>
                  <div className="space-y-2">
                    <div>
                      <span className="text-slate-600 font-mono text-[11px] block">
                        Primary Meeting Point (e.g. Front entrance / immediate exterior):
                      </span>
                      <div className="h-7 border-b-2 border-dashed border-[#1B2A4A] flex items-end font-mono text-xs text-slate-400">
                        location...
                      </div>
                    </div>
                    <div>
                      <span className="text-slate-600 font-mono text-[11px] block">
                        Secondary Meeting Point (e.g. Local parish church, hall, or library if street cordoned):
                      </span>
                      <div className="h-7 border-b-2 border-dashed border-[#1B2A4A] flex items-end font-mono text-xs text-slate-400">
                        evacuation assembly point...
                      </div>
                    </div>
                    <div className="text-[11px] font-mono text-[#1B2A4A] font-semibold bg-white p-2 border border-[#D0D0D0]">
                      Reunion Rule: Assemble at secondary meeting point within 2 hours if cellular towers or regional power grid collapses.
                    </div>
                  </div>
                </div>

                {/* 4. Offline Communications Protocol */}
                <div className="p-3.5 bg-[#FAF9F5] border-l-4 border-[#1B2A4A] space-y-2">
                  <div className="font-mono uppercase text-[11px] font-bold text-[#1B2A4A]">
                    4. Offline Communications &amp; Emergency Radio Broadcast Protocol
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-slate-600 font-mono text-[11px] block">National Contingency Radio:</span>
                      <strong className="text-sm font-serif text-[#1B2A4A] block mt-0.5">BBC Radio 4 (92.4–94.6 MHz FM)</strong>
                    </div>
                    <div>
                      <span className="text-slate-600 font-mono text-[11px] block">Local BBC Radio Station &amp; FM Frequency:</span>
                      <div className="h-7 border-b-2 border-dashed border-[#1B2A4A] flex items-end font-mono text-xs text-slate-400">
                        frequency (e.g. BBC London 94.9)...
                      </div>
                    </div>
                  </div>
                  <p className="text-[11px] text-[#555] font-mono leading-tight">
                    * Protocol: Tune in at the top of every hour (:00) for official Cabinet Office directives. Keep mobile phones in Ultra Low Power mode; prioritise SMS text.
                  </p>
                </div>

                {/* 5. Medical Surgery & Critical Prescriptions */}
                <div className="p-3.5 bg-[#FAF9F5] border-l-4 border-[#1B2A4A] space-y-2">
                  <div className="font-mono uppercase text-[11px] font-bold text-[#1B2A4A]">
                    5. GP Surgery, Pharmacy &amp; Critical Daily Prescriptions
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-slate-600 font-mono text-[11px] block">GP Surgery &amp; Telephone:</span>
                      <div className="h-7 border-b-2 border-dashed border-[#1B2A4A] flex items-end font-mono text-xs text-slate-400">
                        surgery name &amp; phone...
                      </div>
                    </div>
                    <div>
                      <span className="text-slate-600 font-mono text-[11px] block">Local Chemist / Pharmacy:</span>
                      <div className="h-7 border-b-2 border-dashed border-[#1B2A4A] flex items-end font-mono text-xs text-slate-400">
                        pharmacy name &amp; phone...
                      </div>
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-600 font-mono text-[11px] block">Critical Medication &amp; Dosages:</span>
                    <div className="h-7 border-b-2 border-dashed border-[#1B2A4A] flex items-end font-mono text-xs text-slate-400">
                      prescriptions &amp; health requirements...
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4 text-xs">
                {/* 1. Mains Water Stopcock */}
                <div className="p-3.5 bg-[#FAF9F5] border-l-4 border-[#1B2A4A] space-y-2">
                  <div className="font-mono uppercase text-[11px] font-bold text-[#1B2A4A]">
                    1. Mains Water Internal Stopcock Valve
                  </div>
                  <div>
                    <span className="text-slate-600 font-mono text-[11px] block">
                      Exact Location in Property (e.g. Under kitchen sink / front hallway cupboard):
                    </span>
                    <div className="h-7 border-b-2 border-dashed border-[#1B2A4A] flex items-end font-mono text-xs text-slate-400">
                      location in property...
                    </div>
                  </div>
                  <div className="bg-white p-2 border border-[#D0D0D0] text-[11px] font-mono text-[#111]">
                    <strong>Action Procedure:</strong> Turn brass turncock clockwise until hand-tight to isolate supply before flash floods, pipe bursts, or freeze thaws.
                  </div>
                </div>

                {/* 2. Electricity Consumer Unit */}
                <div className="p-3.5 bg-[#FAF9F5] border-l-4 border-[#1B2A4A] space-y-2">
                  <div className="font-mono uppercase text-[11px] font-bold text-[#1B2A4A]">
                    2. Electricity Consumer Unit (Main Fuse Box / Master Breaker)
                  </div>
                  <div>
                    <span className="text-slate-600 font-mono text-[11px] block">
                      Exact Location in Property (e.g. Hallway storage cupboard top shelf / under stairs):
                    </span>
                    <div className="h-7 border-b-2 border-dashed border-[#1B2A4A] flex items-end font-mono text-xs text-slate-400">
                      fuse box location...
                    </div>
                  </div>
                  <div className="bg-white p-2 border border-[#D0D0D0] text-[11px] font-mono text-[#111]">
                    <strong>Action Procedure:</strong> Pull main red/black master switch down to OFF before water enters property or prior to national grid reconnection to prevent power surge damage.
                  </div>
                </div>

                {/* 3. Gas Emergency Isolation Valve */}
                <div className="p-3.5 bg-[#FAF9F5] border-l-4 border-[#1B2A4A] space-y-2">
                  <div className="font-mono uppercase text-[11px] font-bold text-[#1B2A4A]">
                    3. Gas Emergency Isolation Valve
                  </div>
                  <div>
                    <span className="text-slate-600 font-mono text-[11px] block">
                      Exact Location in Property (e.g. External meter box on front exterior wall):
                    </span>
                    <div className="h-7 border-b-2 border-dashed border-[#1B2A4A] flex items-end font-mono text-xs text-slate-400">
                      gas meter location...
                    </div>
                  </div>
                  <div className="bg-white p-2 border border-[#D0D0D0] text-[11px] font-mono text-[#111]">
                    <strong>Action Procedure:</strong> Turn quarter-turn handle 90° across pipe. <em>CRITICAL: IF YOU SMELL GAS: Do NOT flick light switches or ignite flames; ventilate and evacuate.</em>
                  </div>
                </div>

                {/* 4. Special Access Instructions & Hazards */}
                <div className="p-3.5 bg-[#FAF9F5] border-l-4 border-[#1B2A4A] space-y-2">
                  <div className="font-mono uppercase text-[11px] font-bold text-[#1B2A4A]">
                    4. Special Household Hazards &amp; Emergency Access Notes
                  </div>
                  <div>
                    <span className="text-slate-600 font-mono text-[11px] block">
                      Notes (Solar inverter shutoff, battery bank, spare meter keys, pet locations):
                    </span>
                    <div className="h-7 border-b-2 border-dashed border-[#1B2A4A] flex items-end font-mono text-xs text-slate-400">
                      hazards, keys, and special instructions...
                    </div>
                  </div>
                </div>

                {/* 5. Statutory UK Emergency Hotlines */}
                <div className="p-3.5 bg-[#FAF9F5] border-l-4 border-[#8B1A1A] space-y-2">
                  <div className="font-mono uppercase text-[11px] font-bold text-[#8B1A1A]">
                    5. Statutory UK Emergency Hotlines (Pre-Printed for Instant Offline Use)
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono text-xs">
                    <div className="p-1.5 bg-white border border-[#D0D0D0]">
                      <strong>999:</strong> Emergency (Police / Fire / Ambulance)
                    </div>
                    <div className="p-1.5 bg-white border border-[#D0D0D0]">
                      <strong>111:</strong> NHS Non-Emergency Urgent Advice
                    </div>
                    <div className="p-1.5 bg-white border border-[#D0D0D0]">
                      <strong>0800 111 999:</strong> National Gas Emergency (24/7)
                    </div>
                    <div className="p-1.5 bg-white border border-[#D0D0D0]">
                      <strong>105:</strong> Power Cut Reporting (Free 24/7 Line)
                    </div>
                    <div className="p-1.5 bg-white border border-[#D0D0D0] sm:col-span-2">
                      <strong>0345 988 1188:</strong> Environment Agency Floodline (24/7)
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="p-2.5 bg-[#FAF9F5] border border-dashed border-[#1B2A4A] text-[11px] font-mono text-[#1B2A4A] text-center font-medium">
              PROTECTIVE MEASURE: If possible laminate cards after filling in with pen
            </div>

            <div className="border-t border-[#D0D0D0] pt-3 flex items-center justify-between font-mono text-[10px] text-slate-500">
              <span>UDSS Domestic Civil Contingency Programme</span>
              <span>33 Cannon St, London EC4M 5SB</span>
            </div>
          </div>
        </div>

        {/* Global Footer Actions */}
        <div className="bg-[#F5F5F0] border-t border-[#D0D0D0] px-6 py-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white bg-[#1B2A4A] hover:bg-[#132039] border border-[#1B2A4A] inline-flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
              title="Print document on your local printer"
            >
              <Printer className="w-4 h-4 text-amber-300" />
              Print Card for Pen (A4 / Card)
            </button>

            <button
              type="button"
              onClick={handleDownloadHtml}
              className="px-3.5 py-2 text-xs font-semibold uppercase tracking-wider text-[#1B2A4A] bg-white hover:bg-[#FAF9F5] border border-[#D0D0D0] inline-flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Download standalone HTML card with print capability"
            >
              <Download className="w-3.5 h-3.5 text-[#8B1A1A]" />
              Download Printable Card (.html)
            </button>

            <button
              type="button"
              onClick={handleDownloadTxt}
              className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-[#4A4A4A] bg-white hover:bg-[#FAF9F5] border border-[#D0D0D0] inline-flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Download plain text file"
            >
              <FileText className="w-3.5 h-3.5" />
              .txt Template
            </button>

            <button
              type="button"
              onClick={handleCopy}
              className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-[#4A4A4A] bg-white hover:bg-[#FAF9F5] border border-[#D0D0D0] inline-flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Copy formatted template to clipboard"
            >
              {copiedSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-700" />
                  Copied Template
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  Copy Template
                </>
              )}
            </button>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold uppercase tracking-wider text-[#1B2A4A] hover:bg-[#EAEAE2] border border-[#D0D0D0] transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
