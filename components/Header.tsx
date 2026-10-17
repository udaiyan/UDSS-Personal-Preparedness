'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Menu, X, BookOpen, CheckSquare, Info, Briefcase, Droplets, Backpack, FileText } from 'lucide-react';
import { PWAInstallButton } from './PWAInstallButton';

interface HeaderProps {
  activeTab: 'home' | 'checklist' | 'logistics' | 'about';
  setActiveTab: (tab: 'home' | 'checklist' | 'logistics' | 'about') => void;
  onOpenCorporateModal: () => void;
  onOpenEmergencyPlan: () => void;
}

export function Header({
  activeTab,
  setActiveTab,
  onOpenCorporateModal,
  onOpenEmergencyPlan,
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#1B2A4A] text-white border-b-2 border-[#8B1A1A] shadow-md">
      {/* Top micro-bar for institutional authority */}
      <div className="bg-[#0E1726] px-4 py-1 text-[11px] text-[#D0D0D0] border-b border-[#253556]">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#8B1A1A]"></span>
            <span className="font-mono tracking-wider uppercase text-[10px] sm:text-[11px]">
              UNIVERSAL DEFENCE AND SECURITY SOLUTIONS • RESILIENCE ADVISORY
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenEmergencyPlan}
              className="hidden sm:inline-flex items-center gap-1 text-[11px] text-slate-300 hover:text-white transition-colors"
            >
              <FileText className="w-3 h-3 text-amber-300" />
              Emergency Plan &amp; Utility Card
            </button>
            <span className="hidden sm:inline text-slate-500">|</span>
            <button
              onClick={onOpenCorporateModal}
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-200 hover:text-white transition-colors underline decoration-slate-400 underline-offset-2"
            >
              <Briefcase className="w-3 h-3 text-[#D0D0D0]" />
              Corporate Enquiries: Laurence Postgate
            </button>
          </div>
        </div>
      </div>

      {/* Main navigation header */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        {/* Brand identity */}
        <div
          onClick={() => {
            setActiveTab('home');
            setMobileMenuOpen(false);
          }}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="relative w-9 h-9 sm:w-10 sm:h-10 shrink-0 rounded bg-[#0E1726] border border-[#354B78] flex items-center justify-center overflow-hidden">
            <Image
              src="/icon.svg"
              alt="UDSS Crest"
              width={40}
              height={40}
              referrerPolicy="no-referrer"
              className="object-contain p-0.5"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif text-lg sm:text-xl font-bold tracking-tight text-white group-hover:text-slate-100 transition-colors">
                UDSS
              </span>
              <span className="hidden sm:inline-block text-[11px] font-mono tracking-wider uppercase bg-[#0E1726] text-slate-300 px-1.5 py-0.5 border border-[#354B78]">
                CIVIL RESILIENCE
              </span>
            </div>
            <p className="text-xs text-slate-300 font-sans tracking-wide">
              Personal Preparedness Brief
            </p>
          </div>
        </div>

        {/* Desktop Navigation & Actions */}
        <div className="hidden md:flex items-center gap-5">
          <nav className="flex items-center space-x-1" aria-label="Main Navigation">
            <button
              onClick={() => setActiveTab('home')}
              className={`px-3 py-1.5 text-xs font-semibold tracking-wider uppercase transition-colors border-b-2 ${
                activeTab === 'home'
                  ? 'border-white text-white bg-white/10'
                  : 'border-transparent text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <span className="inline-flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" />
                Briefings
              </span>
            </button>

            <button
              onClick={() => setActiveTab('checklist')}
              className={`px-3 py-1.5 text-xs font-semibold tracking-wider uppercase transition-colors border-b-2 ${
                activeTab === 'checklist'
                  ? 'border-white text-white bg-white/10'
                  : 'border-transparent text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <span className="inline-flex items-center gap-1.5">
                <CheckSquare className="w-3.5 h-3.5" />
                Measures
              </span>
            </button>

            <button
              onClick={() => setActiveTab('logistics')}
              className={`px-3 py-1.5 text-xs font-semibold tracking-wider uppercase transition-colors border-b-2 ${
                activeTab === 'logistics'
                  ? 'border-white text-white bg-white/10'
                  : 'border-transparent text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <span className="inline-flex items-center gap-1.5">
                <Backpack className="w-3.5 h-3.5" />
                Grab Bags &amp; Logistics
              </span>
            </button>

            <button
              onClick={() => setActiveTab('about')}
              className={`px-3 py-1.5 text-xs font-semibold tracking-wider uppercase transition-colors border-b-2 ${
                activeTab === 'about'
                  ? 'border-white text-white bg-white/10'
                  : 'border-transparent text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <span className="inline-flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5" />
                About UDSS
              </span>
            </button>
          </nav>

          <div className="h-5 w-px bg-slate-700" />

          {/* Prominent Corporate Enquiries Button */}
          <button
            onClick={onOpenCorporateModal}
            className="px-3 py-1.5 text-xs font-semibold tracking-wider uppercase text-white bg-[#8B1A1A] hover:bg-[#721515] border border-[#a42020] rounded shadow-xs transition-colors inline-flex items-center gap-1.5"
            aria-label="Contact Laurence Postgate for corporate enquiries"
          >
            <Briefcase className="w-3.5 h-3.5" />
            Corporate Enquiries
          </button>

          {/* PWA Install Button */}
          <PWAInstallButton />
        </div>

        {/* Mobile controls */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={onOpenCorporateModal}
            className="px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-white bg-[#8B1A1A] hover:bg-[#721515] rounded border border-[#a42020]"
          >
            Corporate
          </button>
          <PWAInstallButton />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 text-slate-200 hover:text-white rounded focus:outline-none focus:ring-2 focus:ring-white"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0E1726] border-t border-[#253556] px-4 py-3 space-y-2">
          <button
            onClick={() => {
              setActiveTab('home');
              setMobileMenuOpen(false);
            }}
            className={`w-full text-left px-3 py-2 text-xs font-semibold tracking-wider uppercase rounded transition-colors flex items-center gap-2 ${
              activeTab === 'home' ? 'bg-[#1B2A4A] text-white border-l-2 border-white' : 'text-slate-300 hover:bg-[#1B2A4A]/50'
            }`}
          >
            <BookOpen className="w-4 h-4 text-[#D0D0D0]" />
            Monthly Briefings &amp; Ready Score
          </button>

          <button
            onClick={() => {
              setActiveTab('checklist');
              setMobileMenuOpen(false);
            }}
            className={`w-full text-left px-3 py-2 text-xs font-semibold tracking-wider uppercase rounded transition-colors flex items-center gap-2 ${
              activeTab === 'checklist' ? 'bg-[#1B2A4A] text-white border-l-2 border-white' : 'text-slate-300 hover:bg-[#1B2A4A]/50'
            }`}
          >
            <CheckSquare className="w-4 h-4 text-[#D0D0D0]" />
            Preparedness Measures (Basic &amp; Advanced)
          </button>

          <button
            onClick={() => {
              setActiveTab('logistics');
              setMobileMenuOpen(false);
            }}
            className={`w-full text-left px-3 py-2 text-xs font-semibold tracking-wider uppercase rounded transition-colors flex items-center gap-2 ${
              activeTab === 'logistics' ? 'bg-[#1B2A4A] text-white border-l-2 border-white' : 'text-slate-300 hover:bg-[#1B2A4A]/50'
            }`}
          >
            <Backpack className="w-4 h-4 text-[#D0D0D0]" />
            Water, Food &amp; Grab Bags
          </button>

          <button
            onClick={() => {
              onOpenEmergencyPlan();
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2 text-xs font-semibold tracking-wider uppercase rounded transition-colors flex items-center gap-2 text-slate-300 hover:bg-[#1B2A4A]/50"
          >
            <FileText className="w-4 h-4 text-amber-300" />
            Print Emergency Plan &amp; Utility Card
          </button>

          <button
            onClick={() => {
              setActiveTab('about');
              setMobileMenuOpen(false);
            }}
            className={`w-full text-left px-3 py-2 text-xs font-semibold tracking-wider uppercase rounded transition-colors flex items-center gap-2 ${
              activeTab === 'about' ? 'bg-[#1B2A4A] text-white border-l-2 border-white' : 'text-slate-300 hover:bg-[#1B2A4A]/50'
            }`}
          >
            <Info className="w-4 h-4 text-[#D0D0D0]" />
            About UDSS &amp; Leadership
          </button>

          <div className="pt-2 border-t border-[#253556]">
            <button
              onClick={() => {
                onOpenCorporateModal();
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 text-xs font-semibold tracking-wider uppercase text-white bg-[#8B1A1A] hover:bg-[#721515] rounded flex items-center justify-between"
            >
              <span className="flex items-center gap-2">
                <Briefcase className="w-4 h-4" />
                Corporate Enquiries (Laurence Postgate)
              </span>
              <span className="text-[10px] text-white/80 font-mono">Contact &rarr;</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
