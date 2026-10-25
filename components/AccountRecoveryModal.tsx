'use client';

import React, { useState } from 'react';
import {
  X,
  KeyRound,
  Copy,
  Check,
  Download,
  RotateCcw,
  ShieldAlert,
  ShieldCheck,
  CloudUpload,
  Lock,
  Share2,
  Users
} from 'lucide-react';
import { UserProgress } from '@/types/briefing';
import {
  regenerateRecoveryToken,
  uploadEncryptedBackup,
  restoreFromRecoveryToken,
} from '@/lib/storage';

interface AccountRecoveryModalProps {
  isOpen: boolean;
  onClose: () => void;
  progress: UserProgress;
}

export function AccountRecoveryModal({ isOpen, onClose, progress }: AccountRecoveryModalProps) {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedToken, setCopiedToken] = useState(false);
  const [copiedFullShare, setCopiedFullShare] = useState(false);
  const [restoreInputToken, setRestoreInputToken] = useState('');
  const [restoreStatus, setRestoreStatus] = useState<string | null>(null);
  const [backupStatus, setBackupStatus] = useState<string | null>(null);
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [confirmRegenerate, setConfirmRegenerate] = useState(false);

  if (!isOpen) return null;

  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://universal-defence.com';
  const recoveryUrl = `${origin}?recover=${progress.recoveryToken}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(recoveryUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleCopyToken = () => {
    navigator.clipboard.writeText(progress.recoveryToken);
    setCopiedToken(true);
    setTimeout(() => setCopiedToken(false), 2500);
  };

  const handleCopyFullFamilyShare = () => {
    const text =
      `UDSS Personal Preparedness — Household Full Access Key\n\n` +
      `Our household resilience account (${progress.prepId}) can be accessed on your device using this private link:\n` +
      `${recoveryUrl}\n\n` +
      `You can update your personal grab bag, view our 72-hour food & water targets, and see our family emergency meeting plan.\n` +
      `Please keep this private within our household.`;

    navigator.clipboard.writeText(text);
    setCopiedFullShare(true);
    setTimeout(() => setCopiedFullShare(false), 2500);
  };

  const handleDownloadBackupCard = () => {
    const cardContent =
      `========================================================================\n` +
      `      UDSS PERSONAL PREPAREDNESS — CONFIDENTIAL RECOVERY CARD\n` +
      `========================================================================\n\n` +
      `UDSS Prep ID:        ${progress.prepId}\n` +
      `Issued:              ${new Date().toLocaleDateString('en-GB')}\n` +
      `Household Members:   ${progress.householdProfile.members.length} persons\n\n` +
      `PRIVATE RECOVERY TOKEN (DO NOT SHARE PUBLICLY):\n` +
      `${progress.recoveryToken}\n\n` +
      `RECOVERY ACCESS LINK:\n` +
      `${recoveryUrl}\n\n` +
      `INSTRUCTIONS:\n` +
      `1. Keep this card in your fireproof safe, waterproof pouch, or password manager (if possible laminate cards for wallet storage).\n` +
      `2. No name, email, or passwords are tied to this account.\n` +
      `3. If you switch smartphones or clear browser storage, open the recovery link to restore your checklist and family plans.\n\n` +
      `Universal Defence and Security Solutions Ltd • 33 Cannon St, London EC4M 5SB\n` +
      `========================================================================\n`;

    const blob = new Blob([cardContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `UDSS-Preparedness-Recovery-${progress.prepId.replace(/\s+/g, '-')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleUploadBackup = async () => {
    setIsBackingUp(true);
    setBackupStatus(null);
    const res = await uploadEncryptedBackup(progress);
    setIsBackingUp(false);
    if (res.success) {
      setBackupStatus('Encrypted backup successfully stored in central recovery repository.');
    } else {
      setBackupStatus(`Backup error: ${res.error}`);
    }
  };

  const handleExecuteRestore = async (e: React.FormEvent) => {
    e.preventDefault();
    setRestoreStatus('Decrypting and restoring from central repository...');
    const res = await restoreFromRecoveryToken(restoreInputToken);
    if (res.success) {
      setRestoreStatus('Success! Account and checklist restored.');
      setTimeout(() => {
        onClose();
      }, 1200);
    } else {
      setRestoreStatus(`Restore failed: ${res.error}`);
    }
  };

  const handleRegenerate = () => {
    regenerateRecoveryToken();
    setConfirmRegenerate(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 overflow-y-auto backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="recovery-modal-title"
    >
      <div className="relative w-full max-w-2xl bg-white border border-[#D0D0D0] shadow-2xl rounded-none my-8 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-[#1B2A4A] text-white px-6 py-4 flex items-center justify-between border-b-2 border-[#8B1A1A]">
          <div>
            <div className="text-[10px] font-mono tracking-widest text-slate-300 uppercase">
              Confidential Account Access
            </div>
            <h2 id="recovery-modal-title" className="font-serif text-xl sm:text-2xl font-bold text-white mt-0.5">
              Private Recovery Link &amp; Encrypted Backup
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-300 hover:text-white p-1 rounded"
            aria-label="Close recovery dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-[#1A1A1A]">
          {/* Plain English Privacy Directives */}
          <div className="bg-[#FAF9F5] border-l-4 border-[#1B2A4A] p-4 text-xs leading-relaxed space-y-1.5">
            <div className="font-semibold text-[#1B2A4A] flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-[#8B1A1A]" />
              Zero-Credentials Privacy Model
            </div>
            <p className="text-[#333333]">
              <strong>No name. No email. No passwords.</strong> Your preparedness data stays strictly on your device. This private recovery link contains a high-entropy cryptographical token that is the <em>sole</em> key to restore your account across devices.
            </p>
          </div>

          {/* Recovery Token Display Card */}
          <div className="border-2 border-[#1B2A4A] p-5 bg-[#FAF9F6] space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-serif text-sm font-bold text-[#1B2A4A]">
                Your Private Recovery Link
              </span>
              <span className="text-[10px] font-mono uppercase bg-amber-100 text-amber-900 px-2 py-0.5 border border-amber-300 font-semibold">
                Store in a safe place
              </span>
            </div>

            <div className="p-3 bg-white border border-[#D0D0D0] font-mono text-xs break-all text-[#1B2A4A] select-all">
              {recoveryUrl}
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
              <button
                onClick={handleCopyLink}
                className="px-3.5 py-1.5 font-semibold uppercase tracking-wider text-white bg-[#1B2A4A] hover:bg-[#132039] transition-colors inline-flex items-center gap-1.5"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedLink ? 'Link Copied' : 'Copy Recovery Link'}
              </button>

              <button
                onClick={handleDownloadBackupCard}
                className="px-3.5 py-1.5 font-semibold uppercase tracking-wider text-[#1B2A4A] bg-[#F5F5F0] hover:bg-[#EAEAE2] border border-[#D0D0D0] transition-colors inline-flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                Download Backup Card (.txt)
              </button>
            </div>

            <div className="text-[11px] font-mono text-[#666666] pt-1">
              Physical Card Advisory: If possible laminate cards to preserve recovery keys and offline emergency links against water damage.
            </div>
          </div>

          {/* Full Family Share Option */}
          <div className="border border-[#D0D0D0] p-4 bg-white space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-[#1B2A4A]" />
                <h3 className="font-serif text-sm font-bold text-[#1B2A4A]">
                  Full Household Account Share
                </h3>
              </div>
              <span className="text-[10px] font-mono text-[#666666]">
                Family Collaboration
              </span>
            </div>
            <p className="text-xs text-[#4A4A4A] leading-relaxed">
              Want spouse, partner, or older children to access this account on their phone to pack their own Grab Bags and check the pantry? Share this private access link directly.
            </p>
            <button
              onClick={handleCopyFullFamilyShare}
              className="px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#1B2A4A] bg-[#FAF9F5] hover:bg-[#F0EEE6] border border-[#D0D0D0] transition-colors inline-flex items-center gap-1.5"
            >
              {copiedFullShare ? <Check className="w-3.5 h-3.5 text-emerald-700" /> : <Share2 className="w-3.5 h-3.5" />}
              {copiedFullShare ? 'Family Access Copied' : 'Copy Full Family Share Message'}
            </button>
          </div>

          {/* Encrypted Central Cloud Backup */}
          <div className="border border-[#D0D0D0] p-4 bg-white space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CloudUpload className="w-4 h-4 text-[#1B2A4A]" />
                <h3 className="font-serif text-sm font-bold text-[#1B2A4A]">
                  Encrypted Central Backup
                </h3>
              </div>
              {progress.lastBackupTime && (
                <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 border border-emerald-200">
                  Backed Up: {new Date(progress.lastBackupTime).toLocaleDateString('en-GB')}
                </span>
              )}
            </div>

            <p className="text-xs text-[#4A4A4A] leading-relaxed">
              Encrypts your household checklist using AES-GCM and stores the ciphertext on UDSS recovery servers so you can restore your checklist if your phone is lost or damaged.
            </p>

            {backupStatus && (
              <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-xs text-emerald-950">
                {backupStatus}
              </div>
            )}

            <button
              onClick={handleUploadBackup}
              disabled={isBackingUp}
              className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white bg-[#1B2A4A] hover:bg-[#132039] disabled:opacity-50 transition-colors inline-flex items-center gap-1.5"
            >
              <CloudUpload className="w-3.5 h-3.5" />
              {isBackingUp ? 'Encrypting & Storing...' : 'Sync Encrypted Backup Now'}
            </button>
          </div>

          {/* Restore from Existing Recovery Token Form */}
          <form onSubmit={handleExecuteRestore} className="border border-[#D0D0D0] p-4 bg-[#FAF9F6] space-y-3">
            <h3 className="font-serif text-sm font-bold text-[#1B2A4A]">
              Restore Account from Recovery Token
            </h3>
            <p className="text-xs text-[#4A4A4A]">
              Opening on a new laptop or smartphone? Paste your recovery token or recovery URL below:
            </p>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Paste UUID token or full recovery URL..."
                required
                value={restoreInputToken}
                onChange={(e) => {
                  const val = e.target.value;
                  const match = val.match(/recover=([a-zA-Z0-9_-]+)/);
                  setRestoreInputToken(match ? match[1] : val);
                }}
                className="flex-1 px-3 py-1.5 text-xs border border-[#D0D0D0] bg-white font-mono focus:border-[#1B2A4A] focus:outline-none"
              />
              <button
                type="submit"
                className="px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-white bg-[#1B2A4A] hover:bg-[#132039] shrink-0"
              >
                Restore
              </button>
            </div>

            {restoreStatus && (
              <div className="p-2 bg-blue-50 border border-blue-200 text-xs text-blue-950 font-medium">
                {restoreStatus}
              </div>
            )}
          </form>

          {/* Invalidate / Regenerate Token */}
          <div className="pt-2 border-t border-[#D0D0D0] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="text-[#666666]">
              Compromised or shared with someone you no longer trust?
            </div>

            {confirmRegenerate ? (
              <div className="flex items-center gap-2 bg-rose-50 border border-rose-300 p-1.5">
                <span className="text-[11px] font-semibold text-rose-900">Invalidate previous token?</span>
                <button
                  onClick={handleRegenerate}
                  className="px-2 py-0.5 text-xs font-bold uppercase text-white bg-[#8B1A1A] hover:bg-[#6e1414]"
                >
                  Yes, Regenerate
                </button>
                <button
                  onClick={() => setConfirmRegenerate(false)}
                  className="px-2 py-0.5 text-xs font-semibold uppercase text-[#333333] bg-[#EAEAE2]"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmRegenerate(true)}
                className="text-xs font-semibold text-[#8B1A1A] hover:underline inline-flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Invalidate &amp; Regenerate Recovery Token
              </button>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#F5F5F0] border-t border-[#D0D0D0] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold uppercase tracking-wider text-white bg-[#1B2A4A] hover:bg-[#132039]"
          >
            Finished
          </button>
        </div>
      </div>
    </div>
  );
}
