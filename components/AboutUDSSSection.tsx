'use client';

import React from 'react';
import Image from 'next/image';
import { ExternalLink, Shield, Award, Users, BookOpen, Briefcase, ChevronRight } from 'lucide-react';

interface AboutUDSSSectionProps {
  onOpenCorporateModal: () => void;
}

export function AboutUDSSSection({ onOpenCorporateModal }: AboutUDSSSectionProps) {
  return (
    <article className="max-w-4xl mx-auto space-y-8">
      {/* Official Heading */}
      <div className="border-b-2 border-[#1B2A4A] pb-4 space-y-3">
        <div className="bg-white p-3 sm:p-4 rounded border border-[#D0D0D0] inline-block shadow-xs">
          <Image
            src="/assets/aistudio/Logo_6a1e58a5.webp"
            alt="Universal Defence and Security Solutions Logo"
            width={320}
            height={80}
            priority
            referrerPolicy="no-referrer"
            className="h-10 sm:h-12 w-auto object-contain"
          />
        </div>
        <div>
          <span className="text-xs font-mono tracking-wider uppercase text-[#8B1A1A] font-bold block">
            Institutional Overview &amp; Mandate
          </span>
          <p className="text-sm text-[#4A4A4A] mt-1">
            Strategic defence advisory, civil contingency planning, and national resilience for government, industry, and citizens.
          </p>
        </div>
      </div>

      {/* Leadership & Mandate */}
      <div className="bg-white border border-[#D0D0D0] p-6 sm:p-8 space-y-6">
        <div className="space-y-3">
          <h2 className="font-serif text-2xl font-bold text-[#1B2A4A]">
            Mission and Purpose
          </h2>
          <p className="text-base text-[#222222] leading-relaxed">
            Universal Defence and Security Solutions (UDSS) was established to provide governments, allied nations, corporations, and civil authorities with unvarnished, world-class strategic counsel across defence, security, and national resilience.
          </p>
          <p className="text-base text-[#222222] leading-relaxed">
            Our member network encompasses former Chiefs of the Defence Staff, operational theatre commanders, intelligence directors, and senior civil contingency planners. We combine strategic acumen honed at the highest levels of British government with practical implementation experience.
          </p>
        </div>

        {/* Co-Chairmanship */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-[#D0D0D0]">
          <div className="border-l-3 border-[#1B2A4A] pl-4 space-y-2">
            <span className="text-[11px] font-mono tracking-wider uppercase text-[#4A4A4A] font-semibold">
              Co-Chairman
            </span>
            <h3 className="font-serif text-xl font-bold text-[#1B2A4A]">
              General Sir Richard Barrons KCB CBE
            </h3>
            <p className="text-xs text-[#333333] leading-relaxed">
              Former Commander of the United Kingdom Joint Forces Command (2013–2016). General Barrons served on operations in Northern Ireland, the Balkans, Iraq, and Afghanistan. He is a prominent global authority on the character of future warfare, multi-domain integration, cyber threats, and national resilience.
            </p>
          </div>

          <div className="border-l-3 border-[#8B1A1A] pl-4 space-y-2">
            <span className="text-[11px] font-mono tracking-wider uppercase text-[#4A4A4A] font-semibold">
              Co-Chairman
            </span>
            <h3 className="font-serif text-xl font-bold text-[#1B2A4A]">
              Peter Hewitt FCSI FRSA
            </h3>
            <p className="text-xs text-[#333333] leading-relaxed">
              Co-founder of UDSS, prominent City of London financier, and former Alderman of the City of London. He brings over thirty-five years of commercial governance, financial resilience, and defence industry strategic leadership.
            </p>
          </div>
        </div>
      </div>

      {/* The Strategic Framework: "The Perfect Storm" */}
      <div className="bg-[#FAF9F5] border border-[#D0D0D0] p-6 sm:p-8 space-y-4">
        <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#1B2A4A]">
          The Resilience Framework: Confronting Simultaneous Shocks
        </h2>
        <p className="text-sm text-[#333333] leading-relaxed">
          UDSS analyses national preparedness through an integrated strategic model. Modern societies face converging disruptions:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="bg-white p-4 border border-[#D0D0D0]">
            <h4 className="font-serif text-base font-bold text-[#1B2A4A] mb-1">
              Geopolitical Realignment
            </h4>
            <p className="text-xs text-[#4A4A4A] leading-relaxed">
              Systemic confrontation between major states, asymmetric grey-zone tactics, and persistent threats to international maritime and subsea infrastructure.
            </p>
          </div>

          <div className="bg-white p-4 border border-[#D0D0D0]">
            <h4 className="font-serif text-base font-bold text-[#1B2A4A] mb-1">
              Technological Interdependence
            </h4>
            <p className="text-xs text-[#4A4A4A] leading-relaxed">
              Hyper-connected civilian grids, cloud-reliant financial clearing, and automated logistical systems vulnerable to cyber sabotage and electromagnetic disruption.
            </p>
          </div>

          <div className="bg-white p-4 border border-[#D0D0D0]">
            <h4 className="font-serif text-base font-bold text-[#1B2A4A] mb-1">
              Supply Chain Fragility
            </h4>
            <p className="text-xs text-[#4A4A4A] leading-relaxed">
              Just-in-time delivery dynamics in grocery retail, energy distribution, and pharmaceuticals that possess negligible reserve capacity during acute shocks.
            </p>
          </div>

          <div className="bg-white p-4 border border-[#D0D0D0]">
            <h4 className="font-serif text-base font-bold text-[#1B2A4A] mb-1">
              Civilian Deterrence
            </h4>
            <p className="text-xs text-[#4A4A4A] leading-relaxed">
              The principle that national deterrence cannot succeed on military power alone; a self-reliant, prepared civilian population neutralises hostile leverage.
            </p>
          </div>
        </div>
      </div>

      {/* Corporate & Strategic Programmes Callout */}
      <div className="bg-[#1B2A4A] text-white p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <span className="text-[11px] font-mono tracking-widest uppercase text-slate-300">
            Corporate Advisory
          </span>
          <h3 className="font-serif text-2xl font-bold text-white">
            Engage UDSS for Organisational Preparedness
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            For board-level resilience briefings, strategic advisory, or corporate preparedness programmes, contact Laurence Postgate at UDSS.
          </p>
        </div>

        <button
          onClick={onOpenCorporateModal}
          className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-white bg-[#8B1A1A] hover:bg-[#721515] border border-[#a42020] transition-colors shrink-0 inline-flex items-center gap-2"
        >
          <Briefcase className="w-4 h-4" />
          Contact Laurence Postgate
        </button>
      </div>

      {/* Official Links & Headquarters */}
      <div className="p-4 border border-[#D0D0D0] bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-[#4A4A4A]">
        <div>
          <span className="font-semibold text-[#1A1A1A] block">Headquarters:</span>
          Universal Defence and Security Solutions, 33 Cannon St, London EC4M 5SB
        </div>
        <a
          href="https://universal-defence.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 font-semibold text-[#1B2A4A] hover:underline shrink-0"
        >
          Visit universal-defence.com
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </article>
  );
}
