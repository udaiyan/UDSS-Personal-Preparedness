'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ExternalLink, Shield, Mail, Briefcase, Lock, ShieldCheck } from 'lucide-react';

interface FooterProps {
  onOpenCorporateModal: () => void;
  onNavigateTab: (tab: 'home' | 'checklist' | 'about') => void;
  onOpenGDPRModal?: () => void;
}

export function Footer({ onOpenCorporateModal, onNavigateTab, onOpenGDPRModal }: FooterProps) {
  return (
    <footer className="mt-16 bg-[#0E1726] text-[#D0D0D0] border-t-4 border-[#1B2A4A]">
      {/* Official Mandatory Disclaimer Banner */}
      <div className="bg-[#142034] border-b border-[#243552] py-4 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto flex items-start gap-3 text-xs leading-relaxed text-slate-300">
          <Shield className="w-4 h-4 text-[#8B1A1A] shrink-0 mt-0.5" />
          <div>
            <strong className="text-white font-semibold">Statutory Disclaimer: </strong>
            This app provides general information and guidance on personal preparedness. It is not a substitute for official government advice. In an emergency, always follow instructions from the police, local authorities, and the UK government.
          </div>
        </div>
      </div>

      {/* Main Footer navigation & information */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-[#253556]">
          {/* Brand Column */}
          <div className="md:col-span-2 space-y-3">
            <div className="bg-white/95 px-3 py-1.5 rounded shadow-xs inline-block border border-white/20">
              <Image
                src="/assets/aistudio/Logo_6a1e58a5.webp"
                alt="Universal Defence and Security Solutions Logo"
                width={220}
                height={55}
                referrerPolicy="no-referrer"
                className="h-9 w-auto object-contain"
              />
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-md pt-1">
              Bringing together the collective experience of former senior military commanders, intelligence directors, and civil contingency advisers to fortify national and societal resilience.
            </p>
            <div className="pt-1 text-[11px] font-mono text-slate-500">
              33 Cannon St, London EC4M 5SB, United Kingdom
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-white">
              Application Sections
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => {
                    onNavigateTab('home');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-slate-300 hover:text-white transition-colors"
                >
                  Monthly Briefings & Archive
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onNavigateTab('checklist');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-slate-300 hover:text-white transition-colors"
                >
                  Household Preparedness Checklist
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onNavigateTab('about');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-slate-300 hover:text-white transition-colors"
                >
                  About UDSS & Leadership
                </button>
              </li>
              <li>
                <a
                  href="https://universal-defence.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-slate-300 hover:text-white transition-colors"
                >
                  universal-defence.com
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
              </li>
              <li>
                {onOpenGDPRModal ? (
                  <button
                    onClick={onOpenGDPRModal}
                    className="inline-flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors text-left"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>GDPR &amp; Privacy Charter</span>
                  </button>
                ) : (
                  <Link
                    href="/privacy"
                    className="inline-flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>GDPR &amp; Privacy Charter</span>
                  </Link>
                )}
              </li>
            </ul>
          </div>

          {/* Corporate Enquiries */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-white">
              Corporate Enquiries
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Board-level briefings and strategic advisory for business continuity.
            </p>
            <button
              onClick={onOpenCorporateModal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-white bg-[#8B1A1A] hover:bg-[#721515] rounded border border-[#a42020] transition-colors"
            >
              <Briefcase className="w-3.5 h-3.5" />
              Laurence Postgate
            </button>
            <p className="text-[11px] text-slate-400 font-mono">
              laurence.postgate@universal-defence.com
            </p>
          </div>
        </div>

        {/* Bottom copyright & offline metadata */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span>&copy; 2026 Universal Defence and Security Solutions Ltd. Registered in England &amp; Wales.</span>
            <span>&bull;</span>
            {onOpenGDPRModal ? (
              <button
                onClick={onOpenGDPRModal}
                className="text-slate-300 hover:text-white underline font-mono text-[11px]"
              >
                GDPR &amp; Privacy Rights
              </button>
            ) : (
              <Link
                href="/privacy"
                className="text-slate-300 hover:text-white underline font-mono text-[11px]"
              >
                GDPR &amp; Privacy Policy
              </Link>
            )}
          </div>
          <div className="flex items-center gap-4 text-[11px] font-mono text-slate-400">
            <span className="inline-flex items-center gap-1">
              <Lock className="w-3 h-3" />
              Local Storage Encryption / Offline Capable
            </span>
            <span>•</span>
            <Link href="/privacy" className="hover:text-slate-200 underline">
              /privacy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
