'use client';

import React, { useState } from 'react';
import { X, Mail, Phone, MapPin, Building, Copy, Check, ExternalLink } from 'lucide-react';

interface CorporateEnquiriesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CorporateEnquiriesModal({ isOpen, onClose }: CorporateEnquiriesModalProps) {
  const [copied, setCopied] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    organisation: '',
    role: '',
    enquiryType: 'Board-Level Strategic Resilience Briefing',
    message: '',
  });

  if (!isOpen) return null;

  const email = 'laurence.postgate@universal-defence.com';

  const mailtoSubject = encodeURIComponent(`UDSS Corporate Enquiry: ${formData.enquiryType} - ${formData.organisation || 'Corporate Briefing'}`);
  const mailtoBody = encodeURIComponent(
    `Dear Laurence Postgate,\n\nI am contacting Universal Defence and Security Solutions regarding corporate preparedness advisory.\n\n` +
    `Name: ${formData.name || 'Not specified'}\n` +
    `Organisation: ${formData.organisation || 'Not specified'}\n` +
    `Role: ${formData.role || 'Not specified'}\n` +
    `Area of Interest: ${formData.enquiryType}\n\n` +
    `Requirements / Message:\n${formData.message || 'We would like to discuss strategic resilience advisory for our executive leadership.'}\n\n` +
    `Kind regards,\n${formData.name || 'Enquirer'}`
  );

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 overflow-y-auto backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="corporate-modal-title"
    >
      <div className="relative w-full max-w-2xl bg-white border border-[#D0D0D0] shadow-2xl rounded-none my-8 max-h-[90vh] flex flex-col">
        {/* Institutional header bar */}
        <div className="bg-[#1B2A4A] text-white px-6 py-4 flex items-center justify-between border-b-2 border-[#8B1A1A]">
          <div>
            <div className="text-[11px] font-mono tracking-widest text-slate-300 uppercase">
              Universal Defence and Security Solutions
            </div>
            <h2 id="corporate-modal-title" className="font-serif text-xl sm:text-2xl font-bold text-white mt-0.5">
              Corporate Enquiries
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-300 hover:text-white p-1 rounded focus:outline-none focus:ring-2 focus:ring-white"
            aria-label="Close corporate enquiries dialog"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal content body */}
        <div className="p-6 overflow-y-auto space-y-6 text-[#1A1A1A]">
          {/* Official Directive text */}
          <div className="bg-[#F5F5F0] border-l-4 border-[#1B2A4A] p-4 text-sm leading-relaxed">
            <p className="font-semibold text-[#1B2A4A] mb-1">
              Direct Strategic Advisory
            </p>
            <p className="text-[#333333]">
              For board-level resilience briefings, strategic advisory, or corporate preparedness programmes, contact <strong className="font-semibold text-[#1B2A4A]">Laurence Postgate</strong> at UDSS.
            </p>
          </div>

          {/* Contact Details Card */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border border-[#D0D0D0] p-4 bg-white">
            <div>
              <span className="text-[11px] font-semibold text-[#4A4A4A] uppercase tracking-wider block">
                Lead Executive
              </span>
              <p className="font-serif text-lg font-bold text-[#1B2A4A] mt-0.5">
                Laurence Postgate
              </p>
              <p className="text-xs text-[#4A4A4A]">
                Director of Corporate Programmes, UDSS
              </p>
              <div className="mt-3 flex items-center gap-2">
                <a
                  href={`mailto:${email}`}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1B2A4A] hover:underline"
                >
                  <Mail className="w-3.5 h-3.5 text-[#8B1A1A]" />
                  {email}
                </a>
                <button
                  onClick={handleCopyEmail}
                  className="p-1 text-[#4A4A4A] hover:text-[#1B2A4A] rounded"
                  title="Copy email address"
                  aria-label="Copy email address"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-700" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div className="border-t sm:border-t-0 sm:border-l border-[#D0D0D0] pt-3 sm:pt-0 sm:pl-4 space-y-2 text-xs text-[#4A4A4A]">
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#1B2A4A] shrink-0 mt-0.5" />
                <span>
                  Universal Defence and Security Solutions<br />
                  33 Cannon St, London EC4M 5SB
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Building className="w-3.5 h-3.5 text-[#1B2A4A] shrink-0" />
                <a
                  href="https://universal-defence.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#1B2A4A] hover:underline inline-flex items-center gap-1 font-medium"
                >
                  universal-defence.com
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#1B2A4A] shrink-0" />
                <span>+44 (0)20 7101 4050</span>
              </div>
            </div>
          </div>

          {/* Direct Structured Enquiry Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              window.location.href = `mailto:${email}?subject=${mailtoSubject}&body=${mailtoBody}`;
            }}
            className="space-y-4"
          >
            <h3 className="font-serif text-base font-bold text-[#1B2A4A] border-b border-[#D0D0D0] pb-1">
              Prepare Corporate Enquiry
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="enquiry-name" className="block text-xs font-semibold text-[#1A1A1A] mb-1">
                  Full Name
                </label>
                <input
                  id="enquiry-name"
                  type="text"
                  required
                  placeholder="e.g. Eleanor Vance"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-[#D0D0D0] bg-[#FAFAF8] focus:bg-white focus:outline-none focus:border-[#1B2A4A]"
                />
              </div>

              <div>
                <label htmlFor="enquiry-org" className="block text-xs font-semibold text-[#1A1A1A] mb-1">
                  Organisation or Firm
                </label>
                <input
                  id="enquiry-org"
                  type="text"
                  required
                  placeholder="e.g. British Maritime Logistics Plc"
                  value={formData.organisation}
                  onChange={(e) => setFormData({ ...formData, organisation: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-[#D0D0D0] bg-[#FAFAF8] focus:bg-white focus:outline-none focus:border-[#1B2A4A]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="enquiry-role" className="block text-xs font-semibold text-[#1A1A1A] mb-1">
                  Role / Title
                </label>
                <input
                  id="enquiry-role"
                  type="text"
                  placeholder="e.g. Chief Operating Officer"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-[#D0D0D0] bg-[#FAFAF8] focus:bg-white focus:outline-none focus:border-[#1B2A4A]"
                />
              </div>

              <div>
                <label htmlFor="enquiry-type" className="block text-xs font-semibold text-[#1A1A1A] mb-1">
                  Area of Resilience Focus
                </label>
                <select
                  id="enquiry-type"
                  value={formData.enquiryType}
                  onChange={(e) => setFormData({ ...formData, enquiryType: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-[#D0D0D0] bg-[#FAFAF8] focus:bg-white focus:outline-none focus:border-[#1B2A4A]"
                >
                  <option value="Board-Level Strategic Resilience Briefing">Board-Level Strategic Resilience Briefing</option>
                  <option value="Critical Supply Chain Continuity Audit">Critical Supply Chain Continuity Audit</option>
                  <option value="Executive Contingency and Crisis Simulation">Executive Contingency and Crisis Simulation</option>
                  <option value="Hostile State Threat and Cyber Advisory">Hostile State Threat and Cyber Advisory</option>
                  <option value="Bespoke Organisational Preparedness Programme">Bespoke Organisational Preparedness Programme</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="enquiry-message" className="block text-xs font-semibold text-[#1A1A1A] mb-1">
                Specific Objectives or Strategic Context
              </label>
              <textarea
                id="enquiry-message"
                rows={3}
                placeholder="Brief outline of your organisation's contingency requirements or advisory goals..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-[#D0D0D0] bg-[#FAFAF8] focus:bg-white focus:outline-none focus:border-[#1B2A4A]"
              />
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <span className="text-[11px] text-[#4A4A4A]">
                Official communications handled under strict commercial confidentiality.
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#4A4A4A] bg-[#F5F5F0] hover:bg-[#EAEAE2] transition-colors"
                >
                  Close
                </button>
                <a
                  href={`mailto:${email}?subject=${mailtoSubject}&body=${mailtoBody}`}
                  className="px-5 py-2 text-xs font-semibold uppercase tracking-wider text-white bg-[#1B2A4A] hover:bg-[#132039] border border-[#2D4373] transition-colors inline-flex items-center justify-center gap-2"
                >
                  <Mail className="w-3.5 h-3.5" />
                  Transmit via Email
                </a>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
